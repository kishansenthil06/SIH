import type { GraphNode, GraphEdge, GraphTraversalResult } from '../../types/graph';
import { SPECIES_CATALOG } from '../constants';
import { searchLiteratureFixture } from './generateLiterature';

const REGION: GraphNode = { id: 'region_kerala_coast', label: 'Kerala Coast', type: 'region' };
const HABITAT: GraphNode = { id: 'habitat_upwelling_zone', label: 'Coastal Upwelling Zone', type: 'habitat' };
const SST: GraphNode = { id: 'variable_sst', label: 'Sea Surface Temperature', type: 'variable' };
const CHLA: GraphNode = { id: 'variable_chl_a', label: 'Chlorophyll-a', type: 'variable' };

export function traverseGraphFixture(rootSpeciesId: string): GraphTraversalResult {
  const species = SPECIES_CATALOG.find((s) => s.speciesId === rootSpeciesId) ?? SPECIES_CATALOG[0];
  const speciesNode: GraphNode = { id: species.speciesId, label: species.scientificName, type: 'species' };
  const papers = searchLiteratureFixture(species.scientificName).slice(0, 3);
  const paperNodes: GraphNode[] = papers.map((p) => ({ id: p.id, label: p.title, type: 'paper' }));

  const nodes: GraphNode[] = [speciesNode, REGION, HABITAT, SST, CHLA, ...paperNodes];
  const edges: GraphEdge[] = [
    { id: 'e1', source: speciesNode.id, target: REGION.id, label: 'occurs in' },
    { id: 'e2', source: speciesNode.id, target: HABITAT.id, label: 'depends on' },
    { id: 'e3', source: HABITAT.id, target: SST.id, label: 'modulated by' },
    { id: 'e4', source: HABITAT.id, target: CHLA.id, label: 'produces' },
    { id: 'e5', source: speciesNode.id, target: SST.id, label: 'sensitive to' },
    ...paperNodes.map((p, i) => ({ id: `e_lit_${i}`, source: speciesNode.id, target: p.id, label: 'studied in' })),
  ];

  return { rootId: speciesNode.id, nodes, edges };
}
