/**
 * Abyssal Intelligence Design System Tokens
 * Deep Marine Tech palette optimized for high-contrast data density,
 * minimalism, and bioluminescent glowing accents.
 */
export const colors = {
  // Surface Hierarchy
  bg: '#08132a', // Surface / Deep Abyss
  bgElevated: '#101b33', // Surface container low
  panel: '#151f37', // Submersible Navy / Surface container
  panelHover: '#1f2942', // Surface container high
  panelHighest: '#2a344d', // Surface container highest
  panelLowest: '#030d25', // Surface container lowest

  // Borders & Outlines
  border: '#233554',
  borderStrong: '#2f3952',
  outline: '#85948e',
  outlineVariant: '#3c4a45',

  // Typography / On-surface
  text: '#d9e2ff', // Data White
  textMuted: '#bacac3', // On-surface variant
  textDim: '#62728d',

  // Accents (Bioluminescent Teal)
  accent: '#64ffda',
  accentSoft: 'rgba(100, 255, 218, 0.12)',
  accentStrong: '#38debb',
  primaryContainer: '#5ffbd6',
  secondary: '#b9c7e4',
  secondaryContainer: '#3c4962',

  // Semantics
  success: '#38debb',
  warning: '#fbbf24',
  danger: '#f07178', // Muted Coral
  error: '#ffb4ab',
  info: '#b9c7e4',
};

export const chartPalette = [
  '#64ffda', // Bioluminescent Teal
  '#f07178', // Muted Coral
  '#38debb', // Emerald/Teal
  '#b9c7e4', // Ice Blue
  '#fbbf24', // Amber
  '#d8e2ff', // Soft White/Blue
];

// deck.gl H3HexagonLayer color ramps (RGB tuples, low -> high)
export const rampCool: [number, number, number][] = [
  [8, 19, 42],    // #08132a (Deep Abyss)
  [21, 31, 55],   // #151f37 (Surface container)
  [56, 222, 187], // #38debb (Surface tint)
  [100, 255, 218],// #64ffda (Bioluminescent Teal)
];

export const rampWarm: [number, number, number][] = [
  [147, 0, 10],   // Error container
  [240, 113, 120],// Coral
  [255, 180, 171],// On error container
  [255, 218, 214],
];

export const rampSuitability: [number, number, number][] = [
  [16, 27, 51],   // Low suitability (Deep Water)
  [60, 73, 98],   // Mid-low
  [56, 222, 187], // Mid-high (Teal)
  [100, 255, 218],// High (Bioluminescent)
];

export function echartsBaseOption() {
  return {
    backgroundColor: 'transparent',
    textStyle: { color: colors.textMuted, fontFamily: 'Inter, sans-serif' },
    grid: { left: 48, right: 24, top: 32, bottom: 32, containLabel: true },
    tooltip: {
      backgroundColor: colors.panel,
      borderColor: colors.border,
      borderWidth: 1,
      textStyle: { color: colors.text, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 },
      extraCssText: 'box-shadow: 0 8px 24px rgba(3, 13, 37, 0.6); backdrop-filter: blur(12px);',
    },
    legend: { textStyle: { color: colors.textMuted } },
  };
}
