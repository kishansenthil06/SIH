import { liveCall, type ToolResult } from './client';
import type { OtolithPrediction } from '../types/otolith';

export interface ClassifyOtolithArgs {
  specimenId: string;
}

export function classifyOtolith(args: ClassifyOtolithArgs): Promise<ToolResult<OtolithPrediction>> {
  return liveCall(
    'classify_otolith',
    { ...args },
    `/api/v1/otolith/${encodeURIComponent(args.specimenId)}/classify`,
    { method: 'POST' }
  );
}
