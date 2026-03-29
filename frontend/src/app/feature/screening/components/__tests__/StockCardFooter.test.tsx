import { render, screen } from '@testing-library/react';
import { StockCardFooter } from '../StockCardFooter';
import type { FinancialMetrics, StrongMetricKey } from '../../types/screeningTypes';

describe('StockCardFooter', () => {
  const DEFAULT_METRICS: FinancialMetrics = {
    per: 9.8,
    pbr: 1.1,
    roe: 12.5,
    operatingMargin: 8.3,
    equityRatio: 38.2,
  };

  test('全財務指標のラベルを表示する', () => {
    // Arrange
    const props = { metrics: DEFAULT_METRICS, strongMetrics: [] as StrongMetricKey[] };

    // Act
    render(<StockCardFooter {...props} />);

    // Assert
    expect(screen.getByText('PER')).toBeInTheDocument();
    expect(screen.getByText('PBR')).toBeInTheDocument();
    expect(screen.getByText('ROE')).toBeInTheDocument();
    expect(screen.getByText('営業利益率')).toBeInTheDocument();
    expect(screen.getByText('自己資本比率')).toBeInTheDocument();
  });

  test('strongMetricsに含まれる指標バッジが強調スタイルを持つ', () => {
    // Arrange
    const props = {
      metrics: DEFAULT_METRICS,
      strongMetrics: ['roe', 'operatingMargin'] as StrongMetricKey[],
    };

    // Act
    render(<StockCardFooter {...props} />);

    // Assert
    const badges = screen.getAllByRole('status');
    const roeBadge = badges.find((el) => el.textContent.includes('ROE'));
    const operatingMarginBadge = badges.find((el) => el.textContent.includes('営業利益率'));
    expect(roeBadge).toHaveClass('bg-primary');
    expect(operatingMarginBadge).toHaveClass('bg-primary');
  });

  test('値がnullの指標はN/Aと表示する', () => {
    // Arrange
    const metrics: FinancialMetrics = { ...DEFAULT_METRICS, per: null };
    const props = { metrics, strongMetrics: [] as StrongMetricKey[] };

    // Act
    render(<StockCardFooter {...props} />);

    // Assert
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
