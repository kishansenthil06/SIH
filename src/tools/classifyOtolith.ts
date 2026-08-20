import { callTool, type ToolResult } from './client';
import type { OtolithPrediction } from '../types/otolith';
import { classifySpecimen } from '../mock-data/generators/generateOtoliths';

export interface ClassifyOtolithArgs {
  specimenId: string;
}

export function classifyOtolith(args: ClassifyOtolithArgs): Promise<ToolResult<OtolithPrediction>> {
  return callTool('classify_otolith', { ...args }, () => classifySpecimen(args.specimenId));
}
