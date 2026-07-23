"""
スクリーニングロジック

東証プライム銘柄を対象に以下の全条件を満たす銘柄を抽出する:
  - バリュー  : PBR 0.5〜1.0倍 / PER 15倍以下
  - クオリティ: ROE 8〜25% / 営業利益率 10%以上
  - セーフティ: 自己資本比率 40%以上
  - テクニカル: ボリンジャーバンド(25日, 2σ) で +1σ〜+2σ内
"""

import time
import datetime
import logging
from zoneinfo import ZoneInfo

import pandas as pd
import yfinance as yf

from app.schemas import (
    BollingerBands,
    BollingerBandBar,
    Fundamentals,
    OHLCBar,
    ScreeningResult,
    StockCard,
)

logger = logging.getLogger(__name__)

JST = ZoneInfo("Asia/Tokyo")

# --- スクリーニング閾値 ---
PBR_MIN, PBR_MAX = 0.5, 1.0
PER_MAX = 15.0
ROE_MIN, ROE_MAX = 8.0, 25.0
OPERATING_MARGIN_MIN = 10.0
EQUITY_RATIO_MIN = 40.0
BB_PERIOD = 25
BB_STD = 2.0

# yfinance へのリクエスト間隔（秒）
REQUEST_INTERVAL = 0.5


def _fetch_info(ticker: yf.Ticker) -> dict:
    try:
        return ticker.info
    except Exception as e:
        logger.warning("info fetch failed: %s", e)
        return {}


def _fetch_history(ticker: yf.Ticker, period: str = "1y") -> pd.DataFrame:
    try:
        df = ticker.history(period=period, auto_adjust=True)
        return df
    except Exception as e:
        logger.warning("history fetch failed: %s", e)
        return pd.DataFrame()


def _build_ohlc_bars(df: pd.DataFrame) -> list[OHLCBar]:
    bars = []
    for idx, row in df.iterrows():
        date_str = idx.strftime("%Y-%m-%d") if hasattr(idx, "strftime") else str(idx)[:10]
        bars.append(OHLCBar(
            time=date_str,
            open=round(float(row["Open"]), 2),
            high=round(float(row["High"]), 2),
            low=round(float(row["Low"]), 2),
            close=round(float(row["Close"]), 2),
            volume=int(row["Volume"]),
        ))
    return bars


def _calc_bollinger(df: pd.DataFrame) -> tuple[list[BollingerBandBar], BollingerBands | None]:
    """
    ボリンジャーバンドを計算し (時系列リスト, 直近値) を返す。
    データ不足の場合は ([], None) を返す。

    pandas_ta の列名・std パラメータは版依存で不安定なため、pandas の rolling で
    直接計算する（ddof=1 の標本標準偏差で従来の pandas_ta 出力と一致）。
    """
    if len(df) < BB_PERIOD:
        logger.warning("data too short for Bollinger Bands: %d rows (need %d)", len(df), BB_PERIOD)
        return [], None

    close = df["Close"]
    middle = close.rolling(BB_PERIOD).mean()
    std = close.rolling(BB_PERIOD).std(ddof=1)

    bars: list[BollingerBandBar] = []
    for i, idx in enumerate(df.index):
        m = middle.iloc[i]
        s = std.iloc[i]
        if pd.isna(m) or pd.isna(s):
            continue
        date_str = idx.strftime("%Y-%m-%d") if hasattr(idx, "strftime") else str(idx)[:10]
        bars.append(BollingerBandBar(
            time=date_str,
            middle=round(float(m), 2),
            upper1=round(float(m + 1.0 * s), 2),
            upper2=round(float(m + BB_STD * s), 2),
            lower1=round(float(m - 1.0 * s), 2),
            lower2=round(float(m - BB_STD * s), 2),
        ))

    if not bars:
        return [], None

    latest = bars[-1]
    summary = BollingerBands(
        middle=latest.middle,
        upper1=latest.upper1,
        upper2=latest.upper2,
        lower1=latest.lower1,
        lower2=latest.lower2,
    )
    return bars, summary


def _passes_screening(info: dict, price: float, bb: BollingerBands) -> bool:
    """全スクリーニング条件を満たすか判定する"""

    def _f(key: str) -> float | None:
        v = info.get(key)
        return float(v) if v is not None else None

    pbr = _f("priceToBook")
    per = _f("trailingPE") or _f("forwardPE")
    roe = _f("returnOnEquity")
    if roe is not None:
        roe = roe * 100  # yfinance は小数で返す
    op_margin = _f("operatingMargins")
    if op_margin is not None:
        op_margin = op_margin * 100
    eq_ratio = _f("debtToEquity")  # 後続で変換

    # --- バリュー ---
    if pbr is None or not (PBR_MIN <= pbr <= PBR_MAX):
        return False
    if per is None or per > PER_MAX:
        return False

    # --- クオリティ ---
    if roe is None or not (ROE_MIN <= roe <= ROE_MAX):
        return False
    if op_margin is None or op_margin < OPERATING_MARGIN_MIN:
        return False

    # --- セーフティ（自己資本比率の簡易推計: 1 / (1 + D/E)）---
    if eq_ratio is not None:
        # debtToEquity は % 単位で返ることがある
        de = eq_ratio / 100 if eq_ratio > 10 else eq_ratio
        equity_ratio_est = 1.0 / (1.0 + de) * 100
        if equity_ratio_est < EQUITY_RATIO_MIN:
            return False

    # --- テクニカル: +1σ〜+2σ ---
    if not (bb.upper1 <= price <= bb.upper2):
        return False

    return True


def _screen_single_stock(code: str) -> StockCard | None:
    """1銘柄分のデータ取得・スクリーニング判定を行い、条件を満たせば StockCard を返す。"""
    time.sleep(REQUEST_INTERVAL)
    ticker = yf.Ticker(code)

    info = _fetch_info(ticker)
    if not info:
        return None

    hist = _fetch_history(ticker, period="1y")
    if hist.empty:
        return None

    _, bb_summary = _calc_bollinger(hist)
    if bb_summary is None:
        return None

    price = float(hist["Close"].iloc[-1])
    prev_close = float(hist["Close"].iloc[-2]) if len(hist) >= 2 else price
    price_change_pct = round((price - prev_close) / prev_close * 100, 2)

    if not _passes_screening(info, price, bb_summary):
        return None

    def _f(key: str) -> float | None:
        v = info.get(key)
        return float(v) if v is not None else None

    roe = _f("returnOnEquity")
    op_margin = _f("operatingMargins")
    de = _f("debtToEquity")
    equity_ratio = None
    if de is not None:
        de_norm = de / 100 if de > 10 else de
        equity_ratio = round(1.0 / (1.0 + de_norm) * 100, 1)

    fundamentals = Fundamentals(
        pbr=_f("priceToBook"),
        per=_f("trailingPE") or _f("forwardPE"),
        roe=round(roe * 100, 1) if roe is not None else None,
        operating_margin=round(op_margin * 100, 1) if op_margin is not None else None,
        equity_ratio=equity_ratio,
    )

    hist_6m = hist.iloc[-126:] if len(hist) >= 126 else hist
    chart_preview = _build_ohlc_bars(hist_6m)

    logger.info("matched: %s", code)
    return StockCard(
        code=code,
        name=info.get("longName") or info.get("shortName") or code,
        price=round(price, 2),
        price_change_pct=price_change_pct,
        fundamentals=fundamentals,
        bollinger=bb_summary,
        chart_preview=chart_preview,
    )


def run_screening(codes: list[str]) -> ScreeningResult:
    """
    指定した銘柄コードリストに対してスクリーニングを実行し結果を返す。
    """
    matched: list[StockCard] = []
    for code in codes:
        try:
            card = _screen_single_stock(code)
        except Exception as e:
            logger.warning("screening failed for %s: %s", code, e)
            continue
        if card is not None:
            matched.append(card)

    screened_at = datetime.datetime.now(JST).isoformat()
    return ScreeningResult(
        screened_at=screened_at,
        total_screened=len(codes),
        matched_count=len(matched),
        stocks=matched,
    )


def get_chart_data(code: str):
    """単一銘柄の1年分チャートデータを返す（/chart エンドポイント用）"""
    from app.schemas import ChartData

    ticker = yf.Ticker(code)
    hist = _fetch_history(ticker, period="1y")
    if hist.empty:
        return None

    ohlc = _build_ohlc_bars(hist)
    bb_bars, _ = _calc_bollinger(hist)

    return ChartData(code=code, ohlc=ohlc, bollinger=bb_bars)
