import { liveCall, type ToolResult } from './client';
import type { OceanTimeseriesPoint, OceanVariable } from '../types/ocean';
import type { H3CellValue } from '../types/h3';
import { TIMESERIES_START, TIMESERIES_END } from '../mock-data/constants';

export interface GetOceanTimeseriesArgs {
  variable: OceanVariable;
  region?: string;
  startDate?: string;
  endDate?: string;
}

export function getOceanTimeseries(args: GetOceanTimeseriesArgs): Promise<ToolResult<OceanTimeseriesPoint[]>> {
  const { variable, region = 'kerala_coast', startDate = TIMESERIES_START, endDate = TIMESERIES_END } = args;
  const qs = new URLSearchParams({ variable, region, startDate, endDate });
  return liveCall('get_ocean_timeseries', { variable, region, startDate, endDate }, `/api/v1/ocean/timeseries?${qs}`);
}

export interface GetOceanSnapshotArgs {
  variable: OceanVariable;
  date: string;
}

export function getOceanSnapshot(args: GetOceanSnapshotArgs): Promise<ToolResult<H3CellValue<number>[]>> {
  const { variable, date } = args;
  const qs = new URLSearchParams({ variable, date });
  return liveCall('get_ocean_snapshot', { variable, date }, `/api/v1/ocean/snapshot?${qs}`);
}
