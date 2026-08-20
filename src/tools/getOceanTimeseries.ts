import { callTool, type ToolResult } from './client';
import type { OceanTimeseriesPoint, OceanVariable } from '../types/ocean';
import { generateRegionTimeseries, generateOceanSnapshot } from '../mock-data/generators/generateOceanTimeseries';
import { TIMESERIES_START, TIMESERIES_END } from '../mock-data/constants';

export interface GetOceanTimeseriesArgs {
  variable: OceanVariable;
  region?: string;
  startDate?: string;
  endDate?: string;
}

export function getOceanTimeseries(args: GetOceanTimeseriesArgs): Promise<ToolResult<OceanTimeseriesPoint[]>> {
  const { variable, region = 'kerala_coast', startDate = TIMESERIES_START, endDate = TIMESERIES_END } = args;
  return callTool('get_ocean_timeseries', { variable, region, startDate, endDate }, () =>
    generateRegionTimeseries(variable, startDate, endDate)
  );
}

export interface GetOceanSnapshotArgs {
  variable: OceanVariable;
  date: string;
}

export function getOceanSnapshot(args: GetOceanSnapshotArgs) {
  const { variable, date } = args;
  return callTool('get_ocean_snapshot', { variable, date }, () => generateOceanSnapshot(variable, date));
}
