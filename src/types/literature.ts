export interface Citation {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  url?: string;
}

export interface LiteratureHit extends Citation {
  snippet: string;
  relevance: number; // 0-1
}
