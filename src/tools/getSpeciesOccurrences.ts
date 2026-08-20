import { callTool, type ToolResult } from './client';
import type { SpeciesOccurrence } from '../types/species';
import { getOccurrencesForSpecies } from '../mock-data/generators/generateOccurrences';

export interface GetSpeciesOccurrencesArgs {
  speciesId: string;
  region?: string;
}

export function getSpeciesOccurrences(args: GetSpeciesOccurrencesArgs): Promise<ToolResult<SpeciesOccurrence[]>> {
  return callTool('get_species_occurrences', { ...args }, () => getOccurrencesForSpecies(args.speciesId));
}
