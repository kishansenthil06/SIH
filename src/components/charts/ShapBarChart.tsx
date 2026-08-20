import ReactECharts from 'echarts-for-react';
import { echartsBaseOption, colors } from '../../app/theme/tokens';
import type { ShapValue } from '../../types/species';

export function ShapBarChart({ values, height = 220 }: { values: ShapValue[]; height?: number }) {
  const sorted = [...values].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  const option = {
    ...echartsBaseOption(),
    grid: { left: 120, right: 32, top: 16, bottom: 24 },
    xAxis: {
      type: 'value',
      axisLabel: { color: colors.textDim },
      splitLine: { lineStyle: { color: colors.border } },
    },
    yAxis: {
      type: 'category',
      data: sorted.map((v) => v.feature),
      axisLabel: { color: colors.textMuted },
      axisLine: { lineStyle: { color: colors.borderStrong } },
    },
    series: [
      {
        type: 'bar',
        data: sorted.map((v) => ({
          value: v.contribution,
          itemStyle: { color: v.contribution >= 0 ? colors.success : colors.danger },
        })),
        barWidth: 16,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} theme="dark" opts={{ renderer: 'svg' }} />;
}
