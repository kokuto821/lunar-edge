import { render, screen } from '@testing-library/react';
import { MetricBadge } from '../MetricBadge';

describe('MetricBadge', () => {
  test('指標ラベルと値・単位を表示する', () => {
    // Arrange
    const props = { metricKey: 'per' as const, value: 15.2, isStrong: false };

    // Act
    render(<MetricBadge {...props} />);

    // Assert
    expect(screen.getByText('PER')).toBeInTheDocument();
    expect(screen.getByText('15.2倍')).toBeInTheDocument();
  });

  test('値がnullのときN/Aを表示する', () => {
    // Arrange
    const props = { metricKey: 'roe' as const, value: null, isStrong: false };

    // Act
    render(<MetricBadge {...props} />);

    // Assert
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  test('isStrongがtrueのとき強調スタイルを適用する', () => {
    // Arrange
    const props = { metricKey: 'roe' as const, value: 12.5, isStrong: true };

    // Act
    const { container } = render(<MetricBadge {...props} />);

    // Assert
    expect(container.firstChild).toHaveClass('bg-primary');
  });

  test('isStrongがfalseのとき通常スタイルを適用する', () => {
    // Arrange
    const props = { metricKey: 'per' as const, value: 10, isStrong: false };

    // Act
    const { container } = render(<MetricBadge {...props} />);

    // Assert
    expect(container.firstChild).toHaveClass('bg-card');
  });

  test('%単位の指標を正しく表示する', () => {
    // Arrange
    const props = { metricKey: 'operatingMargin' as const, value: 8.3, isStrong: false };

    // Act
    render(<MetricBadge {...props} />);

    // Assert
    expect(screen.getByText('営業利益率')).toBeInTheDocument();
    expect(screen.getByText('8.3%')).toBeInTheDocument();
  });
});
