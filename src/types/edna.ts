export interface AsvRecord {
  asvId: string;
  taxon: string;
  aphiaId?: number;
  confidence: number; // 0-1
  readCount: number;
  sampleId: string;
}

export interface EdnaSample {
  sampleId: string;
  stationName: string;
  lat: number;
  lon: number;
  h3Cell: string;
  date: string;
  shannonIndex: number;
  simpsonIndex: number;
  detections: AsvRecord[];
}
