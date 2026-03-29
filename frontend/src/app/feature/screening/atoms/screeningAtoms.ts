import { atom } from 'jotai';
import type { StockData } from '../types/screeningTypes';

/** スクリーニング結果一覧 */
export const screeningResultsAtom = atom<StockData[]>([]);

/** ローディング状態 */
export const screeningLoadingAtom = atom<boolean>(false);

/** エラーメッセージ */
export const screeningErrorAtom = atom<string | null>(null);
