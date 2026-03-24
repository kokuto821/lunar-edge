from pydantic import BaseModel


# --- チャートデータ ---

class OHLCBar(BaseModel):
    """日足ローソク足の1本分"""
    time: str           # "YYYY-MM-DD"
    open: float
    high: float
    low: float
    close: float
    volume: int


class BollingerBands(BaseModel):
    """ボリンジャーバンド値（直近の値）"""
    middle: float       # 25日移動平均
    upper1: float       # +1σ
    upper2: float       # +2σ
    lower1: float       # -1σ
    lower2: float       # -2σ


class BollingerBandBar(BaseModel):
    """チャート描画用ボリンジャーバンド時系列データの1本分"""
    time: str
    middle: float
    upper1: float
    upper2: float
    lower1: float
    lower2: float


class ChartData(BaseModel):
    """チャートエンドポイントのレスポンス"""
    code: str
    ohlc: list[OHLCBar]
    bollinger: list[BollingerBandBar]


# --- スクリーニング結果 ---

class Fundamentals(BaseModel):
    """ファンダメンタルズ指標"""
    pbr: float | None       # PBR（実績）
    per: float | None       # PER（会社予想）
    roe: float | None       # ROE（会社予想）
    operating_margin: float | None  # 売上高営業利益率（会社予想）
    equity_ratio: float | None      # 自己資本比率（実績）


class StockCard(BaseModel):
    """スクリーニング結果の銘柄カード1枚分"""
    code: str               # 銘柄コード（例: "7203.T"）
    name: str               # 企業名
    price: float            # 現在値
    price_change_pct: float # 前日比（%）
    fundamentals: Fundamentals
    bollinger: BollingerBands
    chart_preview: list[OHLCBar]    # 直近6ヶ月分の日足（カード内プレビュー用）


class ScreeningResult(BaseModel):
    """スクリーニングエンドポイントのレスポンス"""
    screened_at: str        # ISO 8601 形式のタイムスタンプ
    total_screened: int     # スクリーニング対象銘柄数
    matched_count: int      # 条件合致銘柄数
    stocks: list[StockCard]
