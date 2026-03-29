/** Moon Traders カラーパレット定数（Tailwind CSS変数参照） */
export const COLOR = {
  background: 'var(--background)',
  card: 'var(--card)',
  border: 'var(--border)',
  foreground: 'var(--foreground)',
  primary: 'var(--primary)',
} as const;

/**
 * Moon Traders カラーパレット実値
 * canvas はCSS変数を解釈できないため、RGB値を定義する
 */
const PALETTE_RGB = {
  /** #2f2f6f (--background) */
  BACKGROUND: '47, 47, 111',
  /** #4f5b7d (--card) */
  CARD: '79, 91, 125',
  /** #7890a5 (--border) */
  BORDER: '120, 144, 165',
  /** #afc3cf (--foreground) */
  FOREGROUND: '175, 195, 207',
  /** #f2e5c4 (--primary) */
  PRIMARY: '242, 229, 196',
} as const;

/** チャートで使用する不透明度 */
const CHART_ALPHA = {
  /** 20% */
  LOW: 0.2,
  /** 40% */
  MEDIUM_LOW: 0.4,
  /** 60% */
  MEDIUM_HIGH: 0.6,
  /** 80% */
  HIGH: 0.8,
} as const;

/**
 * チャート描画用カラー定数
 * canvas はCSS変数を解釈できないため、PALETTE_RGB の実値から rgba で組み立てる
 */
export const CHART_COLOR = {
  /** テキスト色 */
  TEXT: `rgba(${PALETTE_RGB.FOREGROUND}, 1)`,
  /** グリッド線色 */
  GRID: `rgba(${PALETTE_RGB.BORDER}, ${CHART_ALPHA.LOW})`,
  /** 軸ボーダー色 */
  AXIS_BORDER: `rgba(${PALETTE_RGB.BORDER}, 1)`,
  /** 陽線色 */
  CANDLE_UP: `rgba(${PALETTE_RGB.PRIMARY}, 1)`,
  /** 陰線色 */
  CANDLE_DOWN: `rgba(${PALETTE_RGB.BORDER}, 1)`,
  /** ボリンジャーバンド +2σ */
  BOLLINGER_UPPER2: `rgba(${PALETTE_RGB.PRIMARY}, ${CHART_ALPHA.MEDIUM_HIGH})`,
  /** ボリンジャーバンド +1σ */
  BOLLINGER_UPPER1: `rgba(${PALETTE_RGB.PRIMARY}, ${CHART_ALPHA.MEDIUM_LOW})`,
  /** ボリンジャーバンド 中央線 */
  BOLLINGER_MIDDLE: `rgba(${PALETTE_RGB.FOREGROUND}, ${CHART_ALPHA.HIGH})`,
  /** ボリンジャーバンド -1σ */
  BOLLINGER_LOWER1: `rgba(${PALETTE_RGB.BORDER}, ${CHART_ALPHA.MEDIUM_LOW})`,
  /** ボリンジャーバンド -2σ */
  BOLLINGER_LOWER2: `rgba(${PALETTE_RGB.BORDER}, ${CHART_ALPHA.MEDIUM_HIGH})`,
} as const;
