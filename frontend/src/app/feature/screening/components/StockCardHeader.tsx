import { type FC } from 'react';
import { cn } from '@/app/utils/cn';

export type StockCardHeaderProps = {
  /** 銘柄コード */
  code: string;
  /** 企業名 */
  name: string;
  /** 現在値 */
  price: number;
  /** 前日比 (%) */
  changePercent: number;
};

/** 銘柄カードのヘッダーコンポーネント */
export const StockCardHeader: FC<StockCardHeaderProps> = ({
  code,
  name,
  price,
  changePercent,
}) => {
  const isPositive = changePercent >= 0;

  const style = {
    header: 'flex items-start justify-between p-4 pb-2',
    codeAndName: 'flex flex-col gap-0.5',
    code: 'text-xs text-foreground/60 font-mono',
    name: 'text-sm font-bold text-foreground',
    priceBlock: 'flex flex-col items-end gap-0.5',
    price: 'text-lg font-bold text-primary',
    change: cn('text-xs font-medium', isPositive ? 'text-green-400' : 'text-red-400'),
  };

  return (
    <header className={style.header}>
      <div className={style.codeAndName}>
        <span className={style.code}>{code}</span>
        <span className={style.name}>{name}</span>
      </div>
      <div className={style.priceBlock}>
        <span className={style.price}>¥{price.toLocaleString()}</span>
        <span className={style.change}>
          {isPositive ? '+' : ''}
          {changePercent.toFixed(2)}%
        </span>
      </div>
    </header>
  );
};
