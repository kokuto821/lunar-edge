/**
 * スクリーニング機能の型定義
 */

/** ローソク足データ */
export type CandlestickData = {
  /** 日付 (YYYY-MM-DD) */
  time: string;
  /** 始値 */
  open: number;
  /** 高値 */
  high: number;
  /** 安値 */
  low: number;
  /** 終値 */
  close: number;
};

/** ボリンジャーバンドデータ */
export type BollingerBandData = {
  /** 日付 (YYYY-MM-DD) */
  time: string;
  /** +2σ ライン */
  upper2: number;
  /** +1σ ライン */
  upper1: number;
  /** 中央線（移動平均） */
  middle: number;
  /** -1σ ライン */
  lower1: number;
  /** -2σ ライン */
  lower2: number;
};

/** 財務指標 */
export type FinancialMetrics = {
  /** 株価収益率 (倍) */
  per: number | null;
  /** 株価純資産倍率 (倍) */
  pbr: number | null;
  /** 自己資本利益率 (%) */
  roe: number | null;
  /** 営業利益率 (%) */
  operatingMargin: number | null;
  /** 自己資本比率 (%) */
  equityRatio: number | null;
};

/** スクリーニング条件を牽引している指標のキー */
export type StrongMetricKey = keyof FinancialMetrics;

/** 銘柄データ */
export type StockData = {
  /** 銘柄コード */
  code: string;
  /** 企業名 */
  name: string;
  /** 現在値 */
  price: number;
  /** 前日比 (%) */
  changePercent: number;
  /** 日足ローソク足データ */
  candles: CandlestickData[];
  /** ボリンジャーバンドデータ */
  bollinger: BollingerBandData[];
  /** 財務指標 */
  metrics: FinancialMetrics;
  /** 強い指標キー（スクリーニング条件を牽引） */
  strongMetrics: StrongMetricKey[];
};
