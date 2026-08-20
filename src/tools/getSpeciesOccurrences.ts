import { callTool, liveCall, type ToolResult } from './client';
import type { SpeciesOccurrence } from '../types/species';
import { getOccurrencesForSpecies } from '../mock-data/generators/generateOccurrences';

const LIVE = import.meta.env.VITE_LIVE_SPECIES === 'true';

export interface GetSpeciesOccurrencesArgs {
  speciesId: string;
  region?: string;
}

export function getSpeciesOccurrences(args: GetSpeciesOccurrencesArgs): Promise<ToolResult<SpeciesOccurrence[]>> {
  if (LIVE) {
    const qs = args.region ? `?region=${encodeURIComponent(args.region)}` : '';
    return liveCall('get_species_occurrences', { ...args }, `/api/v1/species/${encodeURIComponent(args.speciesId)}/occurrences${qs}`);
  }
  return callTool('get_species_occurrences', { ...args }, () => getOccurrencesForSpecies(args.speciesId));
}
