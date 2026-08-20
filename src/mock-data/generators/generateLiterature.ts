import type { LiteratureHit } from '../../types/literature';

const PAPERS: LiteratureHit[] = [
  {
    id: 'lit_1',
    title: 'Oil sardine fishery of Kerala: reflection of a changing ecosystem',
    authors: 'Vivekanandan, E., Rajagopalan, M., Pillai, N.G.K.',
    year: 2009,
    venue: 'Marine Biodiversity Records',
    snippet: 'Interannual fluctuations in the Kerala oil sardine fishery track shifts in coastal upwelling intensity and near-surface temperature.',
    relevance: 0.94,
  },
  {
    id: 'lit_2',
    title: 'Impact of sea surface temperature on the abundance of oil sardine along the southwest coast of India',
    authors: 'Sathianandan, T.V., Mohamed, K.S.',
    year: 2015,
    venue: 'Indian Journal of Fisheries',
    snippet: 'A significant inverse correlation was observed between SST anomalies and oil sardine landings with a lag of several months.',
    relevance: 0.91,
  },
  {
    id: 'lit_3',
    title: 'Environmental drivers of small pelagic fish variability in the eastern Arabian Sea',
    authors: 'Madhupratap, M., Kumar, S.P., Bhattathiri, P.M.A.',
    year: 2001,
    venue: 'Deep Sea Research',
    snippet: 'Weakened upwelling during warm-anomaly years suppresses chlorophyll production, reducing forage availability for planktivorous sardine stocks.',
    relevance: 0.83,
  },
  {
    id: 'lit_4',
    title: 'eDNA metabarcoding as a complementary tool for pelagic fish stock monitoring',
    authors: 'Thomsen, P.F., Willerslev, E.',
    year: 2019,
    venue: 'Molecular Ecology',
    snippet: 'Environmental DNA detection frequency corroborates trawl-survey abundance trends for coastal pelagic species.',
    relevance: 0.76,
  },
  {
    id: 'lit_5',
    title: 'Habitat suitability modelling of Sardinella longiceps under changing thermal regimes',
    authors: 'Kripa, V., Mohamed, K.S.',
    year: 2021,
    venue: 'Fisheries Oceanography',
    snippet: 'SDM outputs show a poleward and offshore contraction of suitable habitat as nearshore SST rises above the species’ thermal optimum.',
    relevance: 0.88,
  },
];

export function searchLiteratureFixture(query: string): LiteratureHit[] {
  const q = query.toLowerCase();
  const scored = PAPERS.map((p) => {
    const hay = `${p.title} ${p.snippet}`.toLowerCase();
    const matches = q.split(/\s+/).filter((token) => token.length > 2 && hay.includes(token)).length;
    return { paper: p, matches };
  });
  const anyMatch = scored.some((s) => s.matches > 0);
  const results = anyMatch ? scored.filter((s) => s.matches > 0) : scored;
  return results.map((s) => s.paper).sort((a, b) => b.relevance - a.relevance);
}
