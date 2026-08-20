import ReactECharts from 'echarts-for-react';
import { echartsBaseOption, colors } from '../../app/theme/tokens';
import type { CorrelationResult } from '../../types/correlation';

export function CorrelationScatter({ correlation, height = 260 }: { correlation: CorrelationResult; height?: number }) {
  const option = {
    ...echartsBaseOption(),
    xAxis: {
      type: 'value',
      name: correlation.variableX.toUpperCase(),
      nameTextStyle: { color: colors.textDim },
      axisLabel: { color: colors.textDim },
      splitLine: { lineStyle: { color: colors.border } },
    },
    yAxis: {
      type: 'value',
      name: 'Catch (index)',
      nameTextStyle: { color: colors.textDim },
      axisLabel: { color: colors.textDim },
      splitLine: { lineStyle: { color: colors.border } },
    },
    series: [
      {
        type: 'scatter',
        symbolSize: 8,
        itemStyle: { color: colors.accent, opacity: 0.75 },
        data: correlation.series.map((p) => [p.x, p.y]),
      },
    ],
    tooltip: {
      ...echartsBaseOption().tooltip,
      formatter: (p: { data: [number, number] }) => `${correlation.variableX}: ${p.data[0].toFixed(2)}<br/>catch: ${p.data[1].toFixed(0)}`,
    },
  };

  return <ReactECharts option={option} style={{ height }} theme="dark" opts={{ renderer: 'svg' }} />;
}
