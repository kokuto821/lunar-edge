import { type FC } from 'react';
import { MetricBadge } from './MetricBadge';
import { METRIC_KEYS } from '../shared/metricConstants';
import type { FinancialMetrics, StrongMetricKey } from '../types/screeningTypes';

export type StockCardFooterProps = {
  /** 財務指標データ */
  metrics: FinancialMetrics;
  /** スクリーニング条件を牽引している強い指標キー */
  strongMetrics: StrongMetricKey[];
};

/** 銘柄カードのフッターコンポーネント（財務指標バッジ一覧） */
export const StockCardFooter: FC<StockCardFooterProps> = ({ metrics, strongMetrics }) => {
  const style = {
    footer: 'flex flex-wrap gap-1.5 px-4 pb-4 pt-2 border-t border-border',
  };

  return (
    <footer className={style.footer}>
      {METRIC_KEYS.map((key) => (
        <MetricBadge
          key={key}
          metricKey={key}
          value={metrics[key]}
          isStrong={strongMetrics.includes(key)}
        />
      ))}
    </footer>
  );
};
