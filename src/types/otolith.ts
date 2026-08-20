export interface OtolithSpecimen {
  specimenId: string;
  imageColor: string; // placeholder swatch color standing in for a real image
  collectedAt: string;
  stationName: string;
  lengthMm: number;
  status: 'unclassified' | 'classified' | 'curated';
}

export interface OtolithPrediction {
  specimenId: string;
  predictedSpeciesId: string;
  predictedScientificName: string;
  confidence: number;
  alternatives: { speciesId: string; scientificName: string; confidence: number }[];
  shapeDescriptors: { circularity: number; rectangularity: number; aspectRatio: number };
}
