import { FC } from 'react';
import { cn } from '@/app/utils/cn';
import { useStockChart } from '../hooks/useStockChart';
import type { StockData, StrongMetricKey } from '../types/screeningTypes';

type StockCardProps = {
  /** 表示する銘柄データ */
  stock: StockData;
};

type MetricBadgeProps = {
  /** 財務指標のキー */
  metricKey: StrongMetricKey;
  /** 財務指標の値 */
  value: number | null;
  /** スクリーニング条件を牽引している強い指標かどうか */
  isStrong: boolean;
};

/** 財務指標のラベルマップ */
const METRIC_LABEL: Record<StrongMetricKey, string> = {
  per: 'PER',
  pbr: 'PBR',
  roe: 'ROE',
  operatingMargin: '営業利益率',
  equityRatio: '自己資本比率',
};

/** 財務指標の単位マップ */
const METRIC_UNIT: Record<StrongMetricKey, string> = {
  per: '倍',
  pbr: '倍',
  roe: '%',
  operatingMargin: '%',
  equityRatio: '%',
};

/** 表示する財務指標キーの順序 */
const METRIC_KEYS: StrongMetricKey[] = [
  'per',
  'pbr',
  'roe',
  'operatingMargin',
  'equityRatio',
];

/** 財務指標バッジコンポーネント */
const MetricBadge: FC<MetricBadgeProps> = ({ metricKey, value, isStrong }) => {
  const style = {
    badge: cn(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
      isStrong
        ? 'bg-primary text-background'
        : 'bg-card border border-border text-foreground',
    ),
  };

  return (
    <span className={style.badge}>
      <span>{METRIC_LABEL[metricKey]}</span>
      <span>
        {value !== null ? `${value}${METRIC_UNIT[metricKey]}` : 'N/A'}
      </span>
    </span>
  );
};

/**
 * スクリーニング結果を表示する銘柄カードコンポーネント
 */
export const StockCard: FC<StockCardProps> = ({ stock }) => {
  const { chartContainerRef } = useStockChart({
    candles: stock.candles,
    bollinger: stock.bollinger,
  });

  const isPositive = stock.changePercent >= 0;

  const style = {
    card: 'rounded-xl bg-card border border-border overflow-hidden',
    header: 'flex items-start justify-between p-4 pb-2',
    codeAndName: 'flex flex-col gap-0.5',
    code: 'text-xs text-foreground/60 font-mono',
    name: 'text-sm font-bold text-foreground',
    priceBlock: 'flex flex-col items-end gap-0.5',
    price: 'text-lg font-bold text-primary',
    change: cn(
      'text-xs font-medium',
      isPositive ? 'text-green-400' : 'text-red-400',
    ),
    chartWrapper: 'px-2 pb-2',
    chartContainer: 'w-full h-[200px]',
    footer: 'flex flex-wrap gap-1.5 px-4 pb-4 pt-2 border-t border-border',
  };

  return (
    <article className={style.card}>
      {/* ヘッダー: 銘柄コード、企業名、現在値、前日比 */}
      <header className={style.header}>
        <div className={style.codeAndName}>
          <span className={style.code}>{stock.code}</span>
          <span className={style.name}>{stock.name}</span>
        </div>
        <div className={style.priceBlock}>
          <span className={style.price}>¥{stock.price.toLocaleString()}</span>
          <span className={style.change}>
            {isPositive ? '+' : ''}
            {stock.changePercent.toFixed(2)}%
          </span>
        </div>
      </header>

      {/* コンテンツ: 日足ローソク足チャート + ボリンジャーバンド */}
      <div className={style.chartWrapper}>
        <div ref={chartContainerRef} className={style.chartContainer} />
      </div>

      {/* フッター: 財務指標バッジ */}
      <footer className={style.footer}>
        {METRIC_KEYS.map((key) => (
          <MetricBadge
            key={key}
            metricKey={key}
            value={stock.metrics[key]}
            isStrong={stock.strongMetrics.includes(key)}
          />
        ))}
      </footer>
    </article>
  );
};
