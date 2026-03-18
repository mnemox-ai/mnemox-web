'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, LineSeries } from 'lightweight-charts';
import type { IChartApi, UTCTimestamp } from 'lightweight-charts';

interface EquityPoint {
  time: string;
  equity: number;
  trade_type: string;
}

interface EquityChartProps {
  data: EquityPoint[];
}

export default function EquityChart({ data }: EquityChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const isMobile = window.innerWidth < 768;
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: isMobile ? 280 : 400,
      layout: {
        background: { type: ColorType.Solid, color: '#04060b' },
        textColor: '#6a6a80',
      },
      grid: {
        vertLines: { color: '#1a1a28' },
        horzLines: { color: '#1a1a28' },
      },
    });
    chartRef.current = chart;

    const toTimestamp = (iso: string) =>
      (Math.floor(new Date(iso).getTime() / 1000)) as UTCTimestamp;

    const backtestData = data
      .filter((d) => d.trade_type === 'backtest')
      .map((d) => ({ time: toTimestamp(d.time), value: d.equity }));

    const paperRaw = data
      .filter((d) => d.trade_type === 'paper')
      .map((d) => ({ time: toTimestamp(d.time), value: d.equity }));

    // Connect paper series to end of backtest
    const paperData =
      backtestData.length > 0 && paperRaw.length > 0
        ? [backtestData[backtestData.length - 1], ...paperRaw]
        : paperRaw;

    if (backtestData.length > 0) {
      const backtestSeries = chart.addSeries(LineSeries, {
        color: '#6a6a80',
        lineWidth: 2,
      });
      backtestSeries.setData(backtestData);
    }

    if (paperData.length > 0) {
      const paperSeries = chart.addSeries(LineSeries, {
        color: '#00e5ff',
        lineWidth: 2,
      });
      paperSeries.setData(paperData);
    }

    chart.timeScale().fitContent();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        chart.applyOptions({ width: entry.contentRect.width });
      }
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-[#6a6a80] text-sm">
        No equity data available
      </div>
    );
  }

  return (
    <div>
      <div ref={containerRef} />
      <div className="flex items-center gap-4 mt-2 text-xs text-[#6a6a80]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#6a6a80]" />
          Backtest
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#00e5ff]" />
          Paper Trading
        </span>
      </div>
    </div>
  );
}
