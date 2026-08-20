import { liveCall, type ToolResult } from './client';
import type { EdnaSample } from '../types/edna';

export interface QueryEdnaArgs {
  region?: string;
  taxonFilter?: string;
}

export function queryEdna(args: QueryEdnaArgs = {}): Promise<ToolResult<EdnaSample[]>> {
  const params = new URLSearchParams();
  if (args.region) params.set('region', args.region);
  if (args.taxonFilter) params.set('taxonFilter', args.taxonFilter);
  const qs = params.toString();
  return liveCall('query_edna', { ...args }, `/api/v1/edna${qs ? `?${qs}` : ''}`);
}
