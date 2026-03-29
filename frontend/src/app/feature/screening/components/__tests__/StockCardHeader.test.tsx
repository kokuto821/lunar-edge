import { render, screen } from '@testing-library/react';
import { StockCardHeader } from '../StockCardHeader';

describe('StockCardHeader', () => {
  test('銘柄コードと企業名を表示する', () => {
    // Arrange
    const props = { code: '7203', name: 'トヨタ自動車', price: 3250, changePercent: 1.45 };

    // Act
    render(<StockCardHeader {...props} />);

    // Assert
    expect(screen.getByText('7203')).toBeInTheDocument();
    expect(screen.getByText('トヨタ自動車')).toBeInTheDocument();
  });

  test('現在値を円記号付きで表示する', () => {
    // Arrange
    const props = { code: '7203', name: 'トヨタ自動車', price: 3250, changePercent: 1.45 };

    // Act
    render(<StockCardHeader {...props} />);

    // Assert
    expect(screen.getByText('¥3,250')).toBeInTheDocument();
  });

  test('前日比が正のとき+プレフィックスを付けて表示する', () => {
    // Arrange
    const props = { code: '7203', name: 'トヨタ自動車', price: 3250, changePercent: 1.45 };

    // Act
    render(<StockCardHeader {...props} />);

    // Assert
    expect(screen.getByText('+1.45%')).toBeInTheDocument();
  });

  test('前日比が負のとき+プレフィックスなしで表示する', () => {
    // Arrange
    const props = { code: '7203', name: 'トヨタ自動車', price: 3100, changePercent: -2.30 };

    // Act
    render(<StockCardHeader {...props} />);

    // Assert
    expect(screen.getByText('-2.30%')).toBeInTheDocument();
  });

  test('前日比が0のとき+プレフィックスを付けて表示する', () => {
    // Arrange
    const props = { code: '7203', name: 'トヨタ自動車', price: 3250, changePercent: 0 };

    // Act
    render(<StockCardHeader {...props} />);

    // Assert
    expect(screen.getByText('+0.00%')).toBeInTheDocument();
  });
});
