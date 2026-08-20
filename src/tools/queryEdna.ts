import { callTool, type ToolResult } from './client';
import type { EdnaSample } from '../types/edna';
import { generateEdnaSamples } from '../mock-data/generators/generateEdna';

export interface QueryEdnaArgs {
  region?: string;
  taxonFilter?: string;
}

export function queryEdna(args: QueryEdnaArgs = {}): Promise<ToolResult<EdnaSample[]>> {
  return callTool('query_edna', { ...args }, () => {
    const samples = generateEdnaSamples();
    if (!args.taxonFilter) return samples;
    const needle = args.taxonFilter.toLowerCase();
    return samples
      .map((s) => ({ ...s, detections: s.detections.filter((d) => d.taxon.toLowerCase().includes(needle)) }))
      .filter((s) => s.detections.length > 0);
  });
}
