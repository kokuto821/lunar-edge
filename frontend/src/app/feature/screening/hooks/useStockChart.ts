import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ColorType } from 'lightweight-charts';
import { CHART_COLOR } from '../../../css/color';
import type { CandlestickData, BollingerBandData } from '../types/screeningTypes';

/** チャートの高さ (px) */
const CHART_HEIGHT = 200;

/** ラインシリーズの共通オプション */
const LINE_SERIES_BASE_OPTIONS = {
  lineWidth: 1,
  priceLineVisible: false,
  lastValueVisible: false,
} as const;

type UseStockChartParams = {
  /** 日足ローソク足データ */
  candles: CandlestickData[];
  /** ボリンジャーバンドデータ */
  bollinger: BollingerBandData[];
};

type UseStockChartReturn = {
  /** チャートをマウントするDOM参照 */
  chartContainerRef: React.RefObject<HTMLDivElement>;
};

/**
 * Lightweight-charts を使ってローソク足 + ボリンジャーバンドを描画するhook
 */
export const useStockChart = ({
  candles,
  bollinger,
}: UseStockChartParams): UseStockChartReturn => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ReturnType<IChartApi['addCandlestickSeries']> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    console.log('🔄 チャートを初期化中...');

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: CHART_HEIGHT,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: CHART_COLOR.TEXT,
      },
      grid: {
        vertLines: { color: CHART_COLOR.GRID },
        horzLines: { color: CHART_COLOR.GRID },
      },
      timeScale: {
        borderColor: CHART_COLOR.AXIS_BORDER,
      },
      rightPriceScale: {
        borderColor: CHART_COLOR.AXIS_BORDER,
      },
    });

    chartRef.current = chart;

    // ローソク足シリーズ
    const candleSeries = chart.addCandlestickSeries({
      upColor: CHART_COLOR.CANDLE_UP,
      downColor: CHART_COLOR.CANDLE_DOWN,
      borderUpColor: CHART_COLOR.CANDLE_UP,
      borderDownColor: CHART_COLOR.CANDLE_DOWN,
      wickUpColor: CHART_COLOR.CANDLE_UP,
      wickDownColor: CHART_COLOR.CANDLE_DOWN,
    });
    candleSeriesRef.current = candleSeries;
    candleSeries.setData(candles);

    // ボリンジャーバンド +2σ
    const upper2Series = chart.addLineSeries({
      ...LINE_SERIES_BASE_OPTIONS,
      color: CHART_COLOR.BOLLINGER_UPPER2,
    });
    upper2Series.setData(bollinger.map((d) => ({ time: d.time, value: d.upper2 })));

    // ボリンジャーバンド +1σ
    const upper1Series = chart.addLineSeries({
      ...LINE_SERIES_BASE_OPTIONS,
      color: CHART_COLOR.BOLLINGER_UPPER1,
    });
    upper1Series.setData(bollinger.map((d) => ({ time: d.time, value: d.upper1 })));

    // ボリンジャーバンド 中央線（20SMA）
    const middleSeries = chart.addLineSeries({
      ...LINE_SERIES_BASE_OPTIONS,
      color: CHART_COLOR.BOLLINGER_MIDDLE,
    });
    middleSeries.setData(bollinger.map((d) => ({ time: d.time, value: d.middle })));

    // ボリンジャーバンド -1σ
    const lower1Series = chart.addLineSeries({
      ...LINE_SERIES_BASE_OPTIONS,
      color: CHART_COLOR.BOLLINGER_LOWER1,
    });
    lower1Series.setData(bollinger.map((d) => ({ time: d.time, value: d.lower1 })));

    // ボリンジャーバンド -2σ
    const lower2Series = chart.addLineSeries({
      ...LINE_SERIES_BASE_OPTIONS,
      color: CHART_COLOR.BOLLINGER_LOWER2,
    });
    lower2Series.setData(bollinger.map((d) => ({ time: d.time, value: d.lower2 })));

    chart.timeScale().fitContent();

    console.log('✅ チャートの初期化が完了しました');

    // リサイズ対応
    const handleResize = (): void => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      console.log('🗑️ チャートを破棄しました');
    };
  }, [candles, bollinger]);

  return { chartContainerRef };
};
