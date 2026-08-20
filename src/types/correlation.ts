export interface CorrelationResult {
  variableX: string;
  variableY: string;
  pearsonR: number;
  pValue: number;
  lagMonths: number;
  series: { date: string; x: number; y: number }[];
  interpretation: string;
}
