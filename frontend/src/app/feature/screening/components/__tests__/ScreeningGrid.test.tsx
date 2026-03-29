import { render, screen } from '@testing-library/react';
import { ScreeningGrid } from '../ScreeningGrid';
import type { StockData } from '../../types/screeningTypes';

/** テスト用の最小限の銘柄データを生成するヘルパー */
const createStockData = (overrides: Partial<StockData> = {}): StockData => ({
  code: '7203',
  name: 'トヨタ自動車',
  price: 3250,
  changePercent: 1.45,
  candles: [],
  bollinger: [],
  metrics: {
    per: 9.8,
    pbr: 1.1,
    roe: 12.5,
    operatingMargin: 8.3,
    equityRatio: 38.2,
  },
  strongMetrics: [],
  ...overrides,
});

describe('ScreeningGrid', () => {
  test('ローディング中にローディングメッセージを表示する', () => {
    // Arrange
    const props = { results: [], isLoading: true, error: null };

    // Act
    render(<ScreeningGrid {...props} />);

    // Assert
    expect(screen.getByText('スクリーニング中...')).toBeInTheDocument();
  });

  test('エラー時にエラーメッセージを表示する', () => {
    // Arrange
    const props = { results: [], isLoading: false, error: 'APIエラー: 500' };

    // Act
    render(<ScreeningGrid {...props} />);

    // Assert
    expect(screen.getByText('APIエラー: 500')).toBeInTheDocument();
  });

  test('結果が空のとき案内メッセージを表示する', () => {
    // Arrange
    const props = { results: [], isLoading: false, error: null };

    // Act
    render(<ScreeningGrid {...props} />);

    // Assert
    expect(
      screen.getByText('スクリーニング実行ボタンを押して結果を取得してください'),
    ).toBeInTheDocument();
  });

  test('結果がある場合に銘柄コードを表示する', () => {
    // Arrange
    const results = [
      createStockData({ code: '7203', name: 'トヨタ自動車' }),
      createStockData({ code: '6758', name: 'ソニーグループ' }),
    ];
    const props = { results, isLoading: false, error: null };

    // Act
    render(<ScreeningGrid {...props} />);

    // Assert
    expect(screen.getByText('7203')).toBeInTheDocument();
    expect(screen.getByText('6758')).toBeInTheDocument();
  });

  test('ローディング中はエラーより優先してローディング表示する', () => {
    // Arrange
    const props = { results: [], isLoading: true, error: 'APIエラー: 500' };

    // Act
    render(<ScreeningGrid {...props} />);

    // Assert
    expect(screen.getByText('スクリーニング中...')).toBeInTheDocument();
    expect(screen.queryByText('APIエラー: 500')).not.toBeInTheDocument();
  });
});
