import type { Config } from 'tailwindcss';

/** Tailwind CSS 設定 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // CSS変数をTailwindカラーにブリッジ
        background: 'var(--background)',
        card: 'var(--card)',
        border: 'var(--border)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
      },
    },
  },
  plugins: [],
};

export default config;
