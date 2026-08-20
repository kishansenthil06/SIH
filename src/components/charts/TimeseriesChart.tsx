import ReactECharts from 'echarts-for-react';
import { echartsBaseOption, chartPalette } from '../../app/theme/tokens';

export interface TimeseriesSeries {
  name: string;
  color?: string;
  points: { date: string; value: number }[];
  yAxisIndex?: 0 | 1;
}

interface TimeseriesChartProps {
  series: TimeseriesSeries[];
  height?: number;
  dualAxis?: boolean;
}

export function TimeseriesChart({ series, height = 260, dualAxis = false }: TimeseriesChartProps) {
  const dates = series[0]?.points.map((p) => p.date) ?? [];

  const option = {
    ...echartsBaseOption(),
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: 'var(--color-border-strong)' } },
      axisLabel: { color: 'var(--color-text-dim)', formatter: (v: string) => v.slice(0, 7) },
    },
    yAxis: dualAxis
      ? [
          { type: 'value', axisLabel: { color: 'var(--color-text-dim)' }, splitLine: { lineStyle: { color: 'var(--color-border)' } } },
          { type: 'value', axisLabel: { color: 'var(--color-text-dim)' }, splitLine: { show: false } },
        ]
      : { type: 'value', axisLabel: { color: 'var(--color-text-dim)' }, splitLine: { lineStyle: { color: 'var(--color-border)' } } },
    series: series.map((s, i) => ({
      name: s.name,
      type: 'line',
      smooth: true,
      symbol: 'none',
      yAxisIndex: s.yAxisIndex ?? 0,
      lineStyle: { color: s.color ?? chartPalette[i % chartPalette.length], width: 2 },
      itemStyle: { color: s.color ?? chartPalette[i % chartPalette.length] },
      data: s.points.map((p) => p.value),
    })),
  };

  return <ReactECharts option={option} style={{ height }} theme="dark" opts={{ renderer: 'svg' }} />;
}
