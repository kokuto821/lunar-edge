import { type FC } from 'react';
import { ScreeningButton } from '@/app/feature/screening/components/ScreeningButton';
import { ScreeningGrid } from '@/app/feature/screening/components/ScreeningGrid';
import { useScreening } from '@/app/feature/screening/hooks/useScreening';

/** アプリケーションのエントリーページ */
const IndexPage: FC = () => {
  const { results, isLoading, error, executeScreening } = useScreening();

  const style = {
    container: 'min-h-screen bg-background text-foreground p-6',
    header: 'flex items-center justify-between mb-6',
    title: 'text-2xl font-bold text-primary',
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1 className={style.title}>Lunar Edge</h1>
        <ScreeningButton isLoading={isLoading} onExecute={() => { void executeScreening(); }} />
      </div>
      <ScreeningGrid results={results} isLoading={isLoading} error={error} />
    </div>
  );
};

export default IndexPage;
