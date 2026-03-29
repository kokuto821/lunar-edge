import { useAtom } from 'jotai';
import { useCallback } from 'react';
import {
  screeningResultsAtom,
  screeningLoadingAtom,
  screeningErrorAtom,
} from '../atoms/screeningAtoms';
import type { StockData } from '../types/screeningTypes';

/** スクリーニングAPIのエンドポイント */
const SCREENING_API_ENDPOINT = '/api/screen';

type UseScreeningReturn = {
  /** スクリーニング結果一覧 */
  results: StockData[];
  /** ローディング状態 */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** スクリーニングを実行する */
  executeScreening: () => Promise<void>;
};

/**
 * スクリーニング実行と状態管理を担うカスタムhook
 */
export const useScreening = (): UseScreeningReturn => {
  const [results, setResults] = useAtom(screeningResultsAtom);
  const [isLoading, setIsLoading] = useAtom(screeningLoadingAtom);
  const [error, setError] = useAtom(screeningErrorAtom);

  const executeScreening = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    console.log('🔄 スクリーニングを実行中...');

    try {
      const response = await fetch(SCREENING_API_ENDPOINT, { method: 'POST' });

      if (!response.ok) {
        throw new Error(`APIエラー: ${response.status.toString()}`);
      }

      const data = (await response.json()) as StockData[];
      setResults(data);

      console.log('✅ スクリーニングが完了しました');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'スクリーニングに失敗しました';
      setError(message);
      console.log('❌ スクリーニングに失敗しました:', message);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError, setResults]);

  return { results, isLoading, error, executeScreening };
};
