export interface SpeciesInfo {
  speciesId: string;
  scientificName: string;
  commonName: string;
  aphiaId: number;
  family: string;
  status: 'declining' | 'stable' | 'increasing' | 'data_deficient';
  thumbnail?: string;
}

export interface SpeciesOccurrence {
  id: string;
  speciesId: string;
  scientificName: string;
  lat: number;
  lon: number;
  h3Cell: string;
  date: string;
  count?: number; // catch/abundance proxy
  source: 'obis' | 'fishing_survey' | 'edna_derived';
}

export interface ShapValue {
  feature: string;
  contribution: number; // signed contribution to prediction
}

export interface SdmResult {
  speciesId: string;
  h3Cell: string;
  lat: number;
  lon: number;
  suitability: number; // 0-1
  shapValues: ShapValue[];
  date: string;
}
