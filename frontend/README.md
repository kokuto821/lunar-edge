# LunarEdge Frontend

スクリーニング結果表示 SPA。React + TypeScript + Vite。

## 技術

- React 18 + TypeScript
- Vite (ビルド・開発サーバ)
- Tailwind CSS + shadcn/ui
- Jotai (状態管理)
- lightweight-charts (チャート描画)
- Vitest + Testing Library (テスト)

## セットアップ

```bash
cd frontend
npm install     # 初回のみ
```

## 起動

```bash
npm run dev
```

→ http://localhost:5173

`/api/*` へのリクエストは Vite proxy で `http://localhost:8000` (バックエンド) に転送。
バックエンドも同時起動 必須。詳細は `../backend/README.md`。

バックエンドを 8000 以外で動かす場合、`vite.config.ts` の proxy 先も変更。

## スクリプト

- `npm run dev` — 開発サーバ
- `npm run build` — 型チェック + 本番ビルド
- `npm run preview` — ビルド結果プレビュー
- `npm run lint` — ESLint
- `npm run format` — Prettier 整形
- `npm run test` — Vitest (watch)
- `npm run test:run` — Vitest (1回実行)

## テスト

Vitest + Testing Library。テストは各コンポーネント隣接の `__tests__/` に配置。

```bash
npm run test        # watch モード (ファイル変更で再実行)
npm run test:run    # 1回実行 (CI 向け)
```

特定ファイルのみ:

```bash
npm run test:run -- ScreeningGrid
```

## パスエイリアス

`@/` → `src/` (`vite.config.ts` / `tsconfig.json`)
