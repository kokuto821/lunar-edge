import { type FC } from 'react';
import { cn } from '@/app/utils/cn';
import { METRIC_LABEL, METRIC_UNIT } from '../shared/metricConstants';
import type { StrongMetricKey } from '../types/screeningTypes';

export type MetricBadgeProps = {
  /** 財務指標のキー */
  metricKey: StrongMetricKey;
  /** 財務指標の値 */
  value: number | null;
  /** スクリーニング条件を牽引している強い指標かどうか */
  isStrong: boolean;
};

/** 財務指標バッジコンポーネント */
export const MetricBadge: FC<MetricBadgeProps> = ({ metricKey, value, isStrong }) => {
  const style = {
    badge: cn(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
      isStrong
        ? 'bg-primary text-background'
        : 'bg-card border border-border text-foreground',
    ),
  };

  return (
    <span role="status" className={style.badge}>
      <span>{METRIC_LABEL[metricKey]}</span>
      <span>{value !== null ? `${value}${METRIC_UNIT[metricKey]}` : 'N/A'}</span>
    </span>
  );
};
