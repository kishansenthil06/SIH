export const colors = {
  bg: '#0a0e14',
  bgElevated: '#10151f',
  panel: '#131926',
  panelHover: '#182034',
  border: '#232b3d',
  borderStrong: '#303c56',
  text: '#e2e8f5',
  textMuted: '#8a96b3',
  textDim: '#5a6584',
  accent: '#22d3ee',
  accentStrong: '#06b6d4',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  info: '#818cf8',
};

export const chartPalette = ['#22d3ee', '#f87171', '#34d399', '#fbbf24', '#818cf8', '#f472b6'];

// deck.gl H3HexagonLayer color ramps (RGB tuples, low -> high)
export const rampCool: [number, number, number][] = [
  [8, 47, 73],
  [14, 116, 144],
  [34, 211, 238],
  [165, 243, 252],
];

export const rampWarm: [number, number, number][] = [
  [69, 10, 10],
  [153, 27, 27],
  [248, 113, 113],
  [254, 202, 202],
];

export const rampSuitability: [number, number, number][] = [
  [69, 10, 10],
  [217, 119, 6],
  [163, 230, 53],
  [22, 163, 74],
];

export function echartsBaseOption() {
  return {
    backgroundColor: 'transparent',
    textStyle: { color: colors.textMuted, fontFamily: 'inherit' },
    grid: { left: 48, right: 24, top: 32, bottom: 32, containLabel: true },
    tooltip: {
      backgroundColor: colors.bgElevated,
      borderColor: colors.borderStrong,
      textStyle: { color: colors.text },
    },
    legend: { textStyle: { color: colors.textMuted } },
  };
}
