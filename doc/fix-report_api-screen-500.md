# 修正レポート: `/api/screen` 500エラー

作成日 2026-07-23。原始人口調。

## 症状

スクリーニング実行ボタン押下 → 画面「APIエラー: 500」。
フロント `POST /api/screen` → バックエンド 500 返却。

## 根本原因

`backend/app/screener.py` `_calc_bollinger`。
pandas_ta の列名 版依存。全銘柄で例外 → 500。

- コード 期待列名: `BBM_25_2.0` / `BBU_25_2.0` / `BBL_25_2.0`
- 実際（pandas_ta **0.4.71b0**）: `BBM_25_2.0_2.0`（末尾 ddof サフィックス付与）
- → `bb["BBM_25_2.0"]` で **KeyError**
- `run_screening`・`_screen_single_stock` try/except 無し → FastAPI 既定 500

再現ログ:
```
KeyError: 'BBM_25_2.0'
# 実際の列: ['BBL_25_2.0_2.0','BBM_25_2.0_2.0','BBU_25_2.0_2.0', ...]
```

### 副次バグ

同版 pandas_ta は `std` 引数 無視。`ta.bbands(std=1.0)` が `std=2.0` と同値返却。
→ 列名 直しても ±1σ が ±2σ と同値になる潜在バグ。

## 修正

版依存排除。`_calc_bollinger` を pandas rolling 手動計算に置換。

- middle = `close.rolling(25).mean()`
- std    = `close.rolling(25).std(ddof=1)`  ← ddof=1 で従来 pandas_ta 出力 完全一致
- upper2/lower2 = middle ± 2σ、upper1/lower1 = middle ± 1σ

副次対応:
- 未使用 `import pandas_ta` 削除
- `run_screening` に1銘柄例外ガード追加（1件失敗で全体500 防ぐ防御策）

変更ファイル: `backend/app/screener.py`

## 検証

- `_calc_bollinger` 単体: bars 生成、±1σ≠±2σ、順序 `lower2<lower1<middle<upper1<upper2` 確認
- `POST /api/screen`（別ポート実プロセス）: **HTTP 200**、エラーログ無し
- BB計算 実データ動作確認（7203.T）: middle=2823 / +1σ=2908 / +2σ=2993 と正常
- `matched_count=0` は正当挙動（例 7203.T 営業利益率 4.57% < 10% で不合致）→ バグでない

## 補足

pandas_ta 0.4.71b0 はベータ。手動計算化により今後 pandas_ta 版差の影響 受けない。
`requirements` から pandas_ta 削除可能（他用途なければ）。
