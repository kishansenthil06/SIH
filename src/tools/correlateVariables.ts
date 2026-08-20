import { liveCall, type ToolResult } from './client';
import type { CorrelationResult } from '../types/correlation';
import type { OceanVariable } from '../types/ocean';

export interface CorrelateVariablesArgs {
  variable: OceanVariable;
  speciesId: string;
}

export function correlateVariables(args: CorrelateVariablesArgs): Promise<ToolResult<CorrelationResult>> {
  const qs = new URLSearchParams({ variable: args.variable, speciesId: args.speciesId });
  return liveCall('correlate_variables', { ...args }, `/api/v1/correlate?${qs}`);
}
