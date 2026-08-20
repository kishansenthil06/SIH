import { liveCall, type ToolResult } from './client';

export interface SubmitCurationArgs {
  taskId: string;
  decision: string;
  specimenId: string;
  aiPrediction: string;
  aiConfidence: number;
  curatorDecision: string;
}

export function submitCuration(args: SubmitCurationArgs): Promise<ToolResult<{ acknowledged: true }>> {
  const { taskId, ...body } = args;
  return liveCall('submit_curation', { ...args }, `/api/v1/curation/tasks/${encodeURIComponent(taskId)}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
