import { type FC } from 'react';

/** アプリケーションのエントリーページ */
const IndexPage: FC = () => {
  const style = {
    container:
      'min-h-screen bg-background text-foreground flex items-center justify-center',
    title: 'text-2xl font-bold text-primary',
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>Lunar Edge</h1>
    </div>
  );
};

export default IndexPage;
