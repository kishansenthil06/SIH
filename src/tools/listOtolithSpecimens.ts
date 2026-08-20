import { liveCall, type ToolResult } from './client';
import type { OtolithSpecimen } from '../types/otolith';

export function listOtolithSpecimens(): Promise<ToolResult<OtolithSpecimen[]>> {
  return liveCall('list_otolith_specimens', {}, '/api/v1/otolith/specimens');
}
