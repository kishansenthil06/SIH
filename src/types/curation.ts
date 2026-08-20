export interface CurationTask {
  id: string;
  specimenId: string;
  aiPrediction: string;
  aiConfidence: number;
  status: 'pending' | 'accepted' | 'overridden';
  curatorDecision?: string;
  decidedAt?: string;
}
