# LunarEdge Backend

東証プライム銘柄スクリーニング API。Python + FastAPI。

## 技術

- FastAPI (API)
- uvicorn (ASGIサーバ)
- yfinance (株価データ取得)
- pandas / pandas-ta (テクニカル計算)

## セットアップ

`backend/` 起点。`app.xxx` インポートのため、このディレクトリから起動必須。

```bash
cd backend

# 仮想環境 作成 (初回のみ)
python3 -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate

# 依存インストール (初回のみ)
pip install -r requirements.txt
```

## 起動

```bash
uvicorn app.main:app --reload --port 8000
```

- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- ヘルスチェック: http://localhost:8000/health

## API

- `POST /api/screen` — スクリーニング実行。条件合致銘柄一覧を返す。
- `GET /api/chart/{code}` — 指定銘柄の1年分 日足OHLC + ボリンジャーバンド。例: `7203.T`

## スクリーニング条件

- PBR: 0.5〜1.0倍
- PER: 15倍以下
- ROE: 8〜25%
- 売上高営業利益率: 10%以上
- 自己資本比率: 40%以上
- ボリンジャーバンド(25日, 2σ): 現在値が +1σ〜+2σ

## 構成

```
backend/
├── app/
│   ├── main.py        # FastAPI エントリ、エンドポイント定義
│   ├── schemas.py     # Pydantic モデル
│   ├── screener.py    # スクリーニング・チャートデータ生成
│   └── tse_prime.py   # 東証プライム銘柄コード
└── requirements.txt
```

## 注意

- yfinance は無料・非公式 API。リクエスト間隔に留意。
- CORS 許可オリジン: `localhost:5173` / `localhost:3000` (`app/main.py`)。
