# 🌕 LunarEdge

割安・財務健全・上昇トレンド初期(バンドウォーク)の優良銘柄を視覚抽出する、個人用スクリーニングツール。対象市場は東証プライム。

## 構成

- `frontend/` — React + TypeScript + Vite の SPA。→ [frontend/README.md](frontend/README.md)
- `backend/` — Python + FastAPI の スクリーニング API。→ [backend/README.md](backend/README.md)
- `doc/` — 要件定義書。

## クイックスタート

2つのターミナルで バックエンド・フロント を同時起動。

### 1. バックエンド (ポート 8000)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. フロント (ポート 5173)

```bash
cd frontend
npm install
npm run dev
```

→ ブラウザで http://localhost:5173

フロントの `/api/*` は Vite proxy 経由でバックエンド (`localhost:8000`) に転送。両方の起動が必要。

## 技術スタック

- フロント: React, TypeScript, Tailwind CSS, shadcn/ui, Jotai, lightweight-charts
- バックエンド: FastAPI, yfinance, pandas, pandas-ta

## テスト

フロントは Vitest。`frontend/` で:

```bash
npm run test:run
```

詳細は [frontend/README.md](frontend/README.md#テスト)。バックエンドは現状テスト未整備。

## その他

詳細な手順・スクリプト・API 仕様は各ディレクトリの README 参照。
