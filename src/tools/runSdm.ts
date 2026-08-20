import { callTool, type ToolResult } from './client';
import type { SdmResult } from '../types/species';
import { generateSdmSnapshot } from '../mock-data/generators/generateSdm';

export interface RunSdmArgs {
  speciesId: string;
  date?: string;
}

export function runSdm(args: RunSdmArgs): Promise<ToolResult<SdmResult[]>> {
  const date = args.date ?? '2024-06-01';
  return callTool('run_sdm', { ...args, date }, () => generateSdmSnapshot(args.speciesId, date));
}
