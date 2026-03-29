import { type FC } from 'react';
import { cn } from '@/app/utils/cn';

export type ScreeningButtonProps = {
  /** ローディング中かどうか */
  isLoading: boolean;
  /** クリック時のコールバック */
  onExecute: () => void;
};

/** ローディング中のボタンラベル */
const LABEL_LOADING = 'スクリーニング中...';

/** 通常時のボタンラベル */
const LABEL_DEFAULT = 'スクリーニング実行';

/**
 * スクリーニング実行ボタンコンポーネント
 */
export const ScreeningButton: FC<ScreeningButtonProps> = ({ isLoading, onExecute }) => {
  const style = {
    button: cn(
      'px-6 py-2 rounded-lg font-semibold text-sm transition-opacity',
      'bg-primary text-background',
      isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer',
    ),
  };

  return (
    <button
      className={style.button}
      onClick={onExecute}
      disabled={isLoading}
    >
      {isLoading ? LABEL_LOADING : LABEL_DEFAULT}
    </button>
  );
};
