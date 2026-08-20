import { liveCall, type ToolResult } from './client';
import type { LiteratureHit } from '../types/literature';

export interface SearchLiteratureArgs {
  query: string;
}

export function searchLiterature(args: SearchLiteratureArgs): Promise<ToolResult<LiteratureHit[]>> {
  const qs = new URLSearchParams({ q: args.query });
  return liveCall('search_literature', { ...args }, `/api/v1/literature/search?${qs}`);
}
