import { type FC } from 'react';
import { StockCard } from './StockCard';
import type { StockData } from '../types/screeningTypes';

export type ScreeningGridProps = {
  /** 表示する銘柄データ一覧 */
  results: StockData[];
  /** ローディング中かどうか */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
};

/** ローディング中のメッセージ */
const MESSAGE_LOADING = 'スクリーニング中...';

/** 結果が空のときのメッセージ */
const MESSAGE_EMPTY = 'スクリーニング実行ボタンを押して結果を取得してください';

const style = {
  grid: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4',
  stateWrapper: 'flex items-center justify-center py-20 text-foreground/60 text-sm',
  errorWrapper: 'flex items-center justify-center py-20 text-red-400 text-sm',
} as const;

/**
 * スクリーニング結果のレスポンシブグリッドコンポーネント
 */
export const ScreeningGrid: FC<ScreeningGridProps> = ({ results, isLoading, error }) => {
  if (isLoading) {
    return <div className={style.stateWrapper}>{MESSAGE_LOADING}</div>;
  }

  if (error !== null) {
    return <div className={style.errorWrapper}>{error}</div>;
  }

  if (results.length === 0) {
    return <div className={style.stateWrapper}>{MESSAGE_EMPTY}</div>;
  }

  return (
    <div className={style.grid}>
      {results.map((stock) => (
        <StockCard key={stock.code} stock={stock} />
      ))}
    </div>
  );
};
