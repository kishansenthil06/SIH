import { callTool, type ToolResult } from './client';

export interface SubmitCurationArgs {
  taskId: string;
  decision: string;
}

export function submitCuration(args: SubmitCurationArgs): Promise<ToolResult<{ acknowledged: true }>> {
  return callTool('submit_curation', { ...args }, () => ({ acknowledged: true as const }));
}
