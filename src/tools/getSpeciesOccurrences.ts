import { liveCall, type ToolResult } from './client';
import type { SpeciesOccurrence } from '../types/species';

export interface GetSpeciesOccurrencesArgs {
  speciesId: string;
  region?: string;
}

export function getSpeciesOccurrences(args: GetSpeciesOccurrencesArgs): Promise<ToolResult<SpeciesOccurrence[]>> {
  const qs = args.region ? `?region=${encodeURIComponent(args.region)}` : '';
  return liveCall('get_species_occurrences', { ...args }, `/api/v1/species/${encodeURIComponent(args.speciesId)}/occurrences${qs}`);
}
