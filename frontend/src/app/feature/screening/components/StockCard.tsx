import { type FC } from 'react';
import { StockCardHeader } from './StockCardHeader';
import { StockCardFooter } from './StockCardFooter';
import { useStockChart } from '../hooks/useStockChart';
import type { StockData } from '../types/screeningTypes';

type StockCardProps = {
  /** 表示する銘柄データ */
  stock: StockData;
};

/** チャートコンテナの高さクラス */
const CHART_CONTAINER_CLASS = 'w-full h-[200px]';

/**
 * スクリーニング結果を表示する銘柄カードコンポーネント
 */
export const StockCard: FC<StockCardProps> = ({ stock }) => {
  const { chartContainerRef } = useStockChart({
    candles: stock.candles,
    bollinger: stock.bollinger,
  });

  const style = {
    card: 'rounded-xl bg-card border border-border overflow-hidden',
    chartWrapper: 'px-2 pb-2',
    chartContainer: CHART_CONTAINER_CLASS,
  };

  return (
    <article className={style.card}>
      <StockCardHeader
        code={stock.code}
        name={stock.name}
        price={stock.price}
        changePercent={stock.changePercent}
      />

      {/* コンテンツ: 日足ローソク足チャート + ボリンジャーバンド */}
      <div className={style.chartWrapper}>
        <div ref={chartContainerRef} className={style.chartContainer} />
      </div>

      <StockCardFooter
        metrics={stock.metrics}
        strongMetrics={stock.strongMetrics}
      />
    </article>
  );
};
