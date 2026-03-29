import { type FC } from 'react';
import { StockCard } from '@/app/feature/screening/components/StockCard';
import type { StockData } from '@/app/feature/screening/types/screeningTypes';

/** デモ用銘柄データ */
const DEMO_STOCK: StockData = {
  code: '7203',
  name: 'トヨタ自動車',
  price: 3250,
  changePercent: 1.45,
  candles: [
    { time: '2024-01-04', open: 3100, high: 3200, low: 3080, close: 3150 },
    { time: '2024-01-05', open: 3150, high: 3220, low: 3130, close: 3200 },
    { time: '2024-01-09', open: 3200, high: 3280, low: 3180, close: 3250 },
    { time: '2024-01-10', open: 3250, high: 3300, low: 3220, close: 3270 },
    { time: '2024-01-11', open: 3270, high: 3350, low: 3260, close: 3320 },
    { time: '2024-01-12', open: 3320, high: 3380, low: 3290, close: 3250 },
    { time: '2024-01-15', open: 3250, high: 3310, low: 3230, close: 3280 },
  ],
  bollinger: [
    { time: '2024-01-04', upper2: 3300, upper1: 3220, middle: 3150, lower1: 3080, lower2: 3000 },
    { time: '2024-01-05', upper2: 3320, upper1: 3240, middle: 3165, lower1: 3090, lower2: 3010 },
    { time: '2024-01-09', upper2: 3350, upper1: 3270, middle: 3190, lower1: 3110, lower2: 3030 },
    { time: '2024-01-10', upper2: 3370, upper1: 3290, middle: 3210, lower1: 3130, lower2: 3050 },
    { time: '2024-01-11', upper2: 3400, upper1: 3320, middle: 3240, lower1: 3160, lower2: 3080 },
    { time: '2024-01-12', upper2: 3420, upper1: 3340, middle: 3260, lower1: 3180, lower2: 3100 },
    { time: '2024-01-15', upper2: 3410, upper1: 3330, middle: 3250, lower1: 3170, lower2: 3090 },
  ],
  metrics: {
    per: 9.8,
    pbr: 1.1,
    roe: 12.5,
    operatingMargin: 8.3,
    equityRatio: 38.2,
  },
  strongMetrics: ['roe', 'operatingMargin'],
};

/** アプリケーションのエントリーページ */
const IndexPage: FC = () => {
  const style = {
    container: 'min-h-screen bg-background text-foreground p-6',
    title: 'text-2xl font-bold text-primary mb-6',
    grid: 'max-w-sm',
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>Lunar Edge</h1>
      <div className={style.grid}>
        <StockCard stock={DEMO_STOCK} />
      </div>
    </div>
  );
};

export default IndexPage;
