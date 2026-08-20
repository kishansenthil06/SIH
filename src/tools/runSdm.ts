import { liveCall, type ToolResult } from './client';
import type { SdmResult } from '../types/species';

export interface RunSdmArgs {
  speciesId: string;
  date?: string;
}

export function runSdm(args: RunSdmArgs): Promise<ToolResult<SdmResult[]>> {
  const date = args.date ?? '2024-06-01';
  return liveCall('run_sdm', { ...args, date }, '/api/v1/sdm/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ speciesId: args.speciesId, date }),
  });
}
