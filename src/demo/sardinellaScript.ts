export const SARDINELLA_QUESTION = 'Why is the Indian oil sardine (Sardinella longiceps) declining along the Kerala coast?';

export const SARDINELLA_DEMO_SPECIES_ID = 'sardinella_longiceps';

export interface DemoStepDef {
  step: number;
  toolName: string;
  args: Record<string, unknown>;
}

export const SARDINELLA_STEPS: DemoStepDef[] = [
  { step: 1, toolName: 'get_ocean_timeseries', args: { variable: 'sst', region: 'kerala_coast' } },
  { step: 2, toolName: 'get_species_occurrences', args: { speciesId: SARDINELLA_DEMO_SPECIES_ID } },
  { step: 3, toolName: 'correlate_variables', args: { variable: 'sst', speciesId: SARDINELLA_DEMO_SPECIES_ID } },
  { step: 4, toolName: 'query_edna', args: { taxonFilter: 'Sardinella' } },
  { step: 5, toolName: 'run_sdm', args: { speciesId: SARDINELLA_DEMO_SPECIES_ID, date: '2024-06-01' } },
  { step: 6, toolName: 'search_literature', args: { query: 'Sardinella longiceps sea surface temperature Kerala upwelling' } },
  { step: 7, toolName: 'traverse_graph', args: { rootSpeciesId: SARDINELLA_DEMO_SPECIES_ID } },
];
