import { callTool, type ToolResult } from './client';
import type { OtolithSpecimen } from '../types/otolith';
import { generateOtolithSpecimens } from '../mock-data/generators/generateOtoliths';

export function listOtolithSpecimens(): Promise<ToolResult<OtolithSpecimen[]>> {
  return callTool('list_otolith_specimens', {}, () => generateOtolithSpecimens());
}
