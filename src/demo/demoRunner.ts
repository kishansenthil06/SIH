import { useCopilotStore } from '../store/useCopilotStore';
import type { Insight, ToolCallTraceEntry, EvidenceItem } from '../types/insight';
import { SARDINELLA_QUESTION, SARDINELLA_STEPS, SARDINELLA_DEMO_SPECIES_ID } from './sardinellaScript';
import { nextId } from '../utils/id';

import { getOceanTimeseries } from '../tools/getOceanTimeseries';
import { getSpeciesOccurrences } from '../tools/getSpeciesOccurrences';
import { correlateVariables } from '../tools/correlateVariables';
import { queryEdna } from '../tools/queryEdna';
import { runSdm } from '../tools/runSdm';
import { searchLiterature } from '../tools/searchLiterature';
import { traverseGraph } from '../tools/traverseGraph';
import { SPECIES_CATALOG } from '../mock-data/constants';

const TOOL_FNS: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  get_ocean_timeseries: (args) => getOceanTimeseries(args as never),
  get_species_occurrences: (args) => getSpeciesOccurrences(args as never),
  correlate_variables: (args) => correlateVariables(args as never),
  query_edna: (args) => queryEdna(args as never),
  run_sdm: (args) => runSdm(args as never),
  search_literature: (args) => searchLiterature(args as never),
  traverse_graph: (args) => traverseGraph(args as never),
};

export async function runSardinellaDemo(): Promise<Insight> {
  const store = useCopilotStore.getState();
  const speciesName = SPECIES_CATALOG.find((s) => s.speciesId === SARDINELLA_DEMO_SPECIES_ID)!.scientificName;

  const initialTrace: ToolCallTraceEntry[] = SARDINELLA_STEPS.map((s) => ({
    step: s.step,
    toolName: s.toolName,
    args: s.args,
    status: 'pending',
  }));
  store.setTrace(initialTrace);
  store.setRunning(true);

  const results: Record<string, { data: unknown; toolResult: unknown }> = {};

  for (const stepDef of SARDINELLA_STEPS) {
    useCopilotStore.getState().updateTraceStep(stepDef.step, { status: 'running', startedAt: new Date().toISOString() });
    const toolResult = (await TOOL_FNS[stepDef.toolName](stepDef.args)) as { data: unknown; latencyMs: number; calledAt: string };
    results[stepDef.toolName] = { data: toolResult.data, toolResult };
    useCopilotStore.getState().updateTraceStep(stepDef.step, {
      status: 'done',
      finishedAt: new Date().toISOString(),
      latencyMs: toolResult.latencyMs,
      resultSummary: summarize(stepDef.toolName, toolResult.data),
    });
  }

  const correlation = results.correlate_variables.data as import('../types/correlation').CorrelationResult;
  const oceanSeries = results.get_ocean_timeseries.data as import('../types/ocean').OceanTimeseriesPoint[];
  const latestAnomaly = oceanSeries[oceanSeries.length - 1]?.anomaly ?? 0;
  const edna = results.query_edna.data as import('../types/edna').EdnaSample[];
  const sdm = results.run_sdm.data as import('../types/species').SdmResult[];
  const literature = results.search_literature.data as import('../types/literature').LiteratureHit[];

  const avgSuitability = sdm.reduce((s, c) => s + c.suitability, 0) / sdm.length;
  const nearshoreDetections = edna.filter((s) => s.detections.some((d) => d.taxon.includes('Sardinella longiceps')));
  const detectionFrequency = edna.length > 0 ? nearshoreDetections.length / edna.length : 0;

  const narrative = [
    `${speciesName} landings along the Kerala coast show a measurable decline, and the evidence points to warming coastal waters as the primary driver.`,
    correlation.interpretation,
    `The most recent SST anomaly in the region is +${latestAnomaly.toFixed(2)}°C above the seasonal baseline.`,
    `eDNA metabarcoding corroborates the trawl-survey trend: ${(detectionFrequency * 100).toFixed(0)}% of sampled stations still register ${speciesName} reads, concentrated toward cooler, southern stations.`,
    `Habitat suitability modelling gives the region an average suitability score of ${(avgSuitability * 100).toFixed(0)}%, with SST anomaly the dominant negative contributor (SHAP).`,
    `This mirrors documented findings in the literature on oil sardine sensitivity to upwelling-driven SST variability.`,
  ].join(' ');

  const evidence: EvidenceItem[] = [
    {
      id: nextId('ev'),
      claim: `SST anomaly correlates with catch decline (r=${correlation.pearsonR.toFixed(2)}, lag ${correlation.lagMonths}mo)`,
      supportingToolCall: 'correlate_variables',
      value: correlation.pearsonR,
    },
    {
      id: nextId('ev'),
      claim: `Latest regional SST anomaly: +${latestAnomaly.toFixed(2)}°C`,
      supportingToolCall: 'get_ocean_timeseries',
      value: Number(latestAnomaly.toFixed(2)),
    },
    {
      id: nextId('ev'),
      claim: `eDNA detection frequency across stations: ${(detectionFrequency * 100).toFixed(0)}%`,
      supportingToolCall: 'query_edna',
      value: `${(detectionFrequency * 100).toFixed(0)}%`,
    },
    {
      id: nextId('ev'),
      claim: `Mean habitat suitability across Kerala shelf: ${(avgSuitability * 100).toFixed(0)}%`,
      supportingToolCall: 'run_sdm',
      value: `${(avgSuitability * 100).toFixed(0)}%`,
    },
    {
      id: nextId('ev'),
      claim: `${literature.length} peer-reviewed sources support an SST-driven decline mechanism`,
      supportingToolCall: 'search_literature',
      value: literature.length,
      citationIds: literature.map((l) => l.id),
    },
  ];

  const insight: Insight = {
    id: nextId('insight'),
    question: SARDINELLA_QUESTION,
    narrative,
    evidence,
    confidence: 0.83,
    mapLayers: [{ id: 'sdm', label: 'Habitat Suitability', type: 'h3', dataRef: 'run_sdm' }],
    charts: [
      { id: 'correlation', type: 'scatter', dataRef: 'correlate_variables', title: 'SST Anomaly vs. Catch' },
      { id: 'shap', type: 'shap', dataRef: 'run_sdm', title: 'SDM Feature Attribution (SHAP)' },
    ],
    citations: literature.map((l) => ({ id: l.id, title: l.title, authors: l.authors, year: l.year, venue: l.venue, url: l.url })),
    trace: useCopilotStore.getState().trace,
    generatedAt: new Date().toISOString(),
  };

  useCopilotStore.getState().setInsight(insight);
  useCopilotStore.getState().setRunning(false);
  return insight;
}

function summarize(toolName: string, data: unknown): string {
  if (Array.isArray(data)) return `${data.length} records returned`;
  if (toolName === 'correlate_variables') {
    const c = data as import('../types/correlation').CorrelationResult;
    return `r=${c.pearsonR.toFixed(2)}, lag=${c.lagMonths}mo`;
  }
  return 'done';
}
