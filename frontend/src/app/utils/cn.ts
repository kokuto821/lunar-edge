import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind クラスを結合するユーティリティ */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
