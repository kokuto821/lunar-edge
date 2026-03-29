import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScreeningButton } from '../ScreeningButton';

describe('ScreeningButton', () => {
  test('通常時に「スクリーニング実行」ラベルを表示する', () => {
    // Arrange
    const props = { isLoading: false, onExecute: vi.fn() };

    // Act
    render(<ScreeningButton {...props} />);

    // Assert
    expect(screen.getByRole('button', { name: 'スクリーニング実行' })).toBeInTheDocument();
  });

  test('ローディング中に「スクリーニング中...」ラベルを表示する', () => {
    // Arrange
    const props = { isLoading: true, onExecute: vi.fn() };

    // Act
    render(<ScreeningButton {...props} />);

    // Assert
    expect(screen.getByRole('button', { name: 'スクリーニング中...' })).toBeInTheDocument();
  });

  test('ローディング中はボタンが無効化される', () => {
    // Arrange
    const props = { isLoading: true, onExecute: vi.fn() };

    // Act
    render(<ScreeningButton {...props} />);

    // Assert
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('通常時にクリックするとonExecuteが呼ばれる', async () => {
    // Arrange
    const handleExecute = vi.fn();
    const props = { isLoading: false, onExecute: handleExecute };
    const user = userEvent.setup();

    // Act
    render(<ScreeningButton {...props} />);
    await user.click(screen.getByRole('button'));

    // Assert
    expect(handleExecute).toHaveBeenCalledTimes(1);
  });

  test('ローディング中はクリックしてもonExecuteが呼ばれない', async () => {
    // Arrange
    const handleExecute = vi.fn();
    const props = { isLoading: true, onExecute: handleExecute };
    const user = userEvent.setup();

    // Act
    render(<ScreeningButton {...props} />);
    await user.click(screen.getByRole('button'));

    // Assert
    expect(handleExecute).not.toHaveBeenCalled();
  });
});
