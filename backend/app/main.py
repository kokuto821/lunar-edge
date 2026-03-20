from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import ChartData, ScreeningResult
from app.screener import get_chart_data, run_screening
from app.tse_prime import PRIME_CODES

app = FastAPI(
    title="LunarEdge API",
    description="東証プライム銘柄スクリーニング API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/screen", response_model=ScreeningResult, summary="スクリーニング実行")
def screen() -> ScreeningResult:
    """
    東証プライム銘柄に対してスクリーニングを実行し、条件を満たす銘柄一覧を返す。

    **スクリーニング条件:**
    - PBR: 0.5〜1.0倍
    - PER: 15倍以下
    - ROE: 8〜25%
    - 売上高営業利益率: 10%以上
    - 自己資本比率: 40%以上
    - ボリンジャーバンド(25日, 2σ): 現在値が +1σ〜+2σ の範囲内
    """
    result = run_screening(PRIME_CODES)
    return result


@app.get("/api/chart/{code}", response_model=ChartData, summary="銘柄チャートデータ取得")
def chart(code: str) -> ChartData:
    """
    指定銘柄の1年分の日足OHLC＋ボリンジャーバンドデータを返す。

    - `code`: 銘柄コード（例: `7203.T`）
    """
    data = get_chart_data(code)
    if data is None:
        raise HTTPException(status_code=404, detail=f"銘柄 '{code}' のデータが取得できませんでした。")
    return data
