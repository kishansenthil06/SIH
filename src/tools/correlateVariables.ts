import { callTool, type ToolResult } from './client';
import type { CorrelationResult } from '../types/correlation';
import type { OceanVariable } from '../types/ocean';
import { correlateOceanWithCatch } from '../mock-data/generators/generateCorrelation';

export interface CorrelateVariablesArgs {
  variable: OceanVariable;
  speciesId: string;
}

export function correlateVariables(args: CorrelateVariablesArgs): Promise<ToolResult<CorrelationResult>> {
  return callTool('correlate_variables', { ...args }, () => correlateOceanWithCatch(args.variable, args.speciesId));
}
