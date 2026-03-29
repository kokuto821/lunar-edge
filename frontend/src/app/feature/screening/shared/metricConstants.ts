import type { StrongMetricKey } from '../types/screeningTypes';

/** 財務指標のラベルマップ */
export const METRIC_LABEL: Record<StrongMetricKey, string> = {
  per: 'PER',
  pbr: 'PBR',
  roe: 'ROE',
  operatingMargin: '営業利益率',
  equityRatio: '自己資本比率',
};

/** 財務指標の単位マップ */
export const METRIC_UNIT: Record<StrongMetricKey, string> = {
  per: '倍',
  pbr: '倍',
  roe: '%',
  operatingMargin: '%',
  equityRatio: '%',
};

/** 表示する財務指標キーの順序 */
export const METRIC_KEYS: StrongMetricKey[] = [
  'per',
  'pbr',
  'roe',
  'operatingMargin',
  'equityRatio',
];
