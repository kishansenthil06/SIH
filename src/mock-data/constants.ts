import type { SpeciesInfo } from '../types/species';

// Kerala coast / southeastern Arabian Sea bounding box.
export const KERALA_COAST_BOUNDS = {
  minLat: 8.0,
  maxLat: 12.0,
  minLon: 74.5,
  maxLon: 77.2,
};

export const H3_RESOLUTION = 5;

export const TIMESERIES_START = '2015-01-01';
export const TIMESERIES_END = '2024-12-01';

export const SPECIES_CATALOG: SpeciesInfo[] = [
  {
    speciesId: 'sardinella_longiceps',
    scientificName: 'Sardinella longiceps',
    commonName: 'Indian Oil Sardine',
    aphiaId: 126410,
    family: 'Clupeidae',
    status: 'declining',
  },
  {
    speciesId: 'rastrelliger_kanagurta',
    scientificName: 'Rastrelliger kanagurta',
    commonName: 'Indian Mackerel',
    aphiaId: 154798,
    family: 'Scombridae',
    status: 'stable',
  },
  {
    speciesId: 'thunnus_albacares',
    scientificName: 'Thunnus albacares',
    commonName: 'Yellowfin Tuna',
    aphiaId: 127139,
    family: 'Scombridae',
    status: 'increasing',
  },
  {
    speciesId: 'lutjanus_argentimaculatus',
    scientificName: 'Lutjanus argentimaculatus',
    commonName: 'Mangrove Red Snapper',
    aphiaId: 159833,
    family: 'Lutjanidae',
    status: 'data_deficient',
  },
];

export const DEMO_SPECIES_ID = 'sardinella_longiceps';
