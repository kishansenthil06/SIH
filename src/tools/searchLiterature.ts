import { callTool, type ToolResult } from './client';
import type { LiteratureHit } from '../types/literature';
import { searchLiteratureFixture } from '../mock-data/generators/generateLiterature';

export interface SearchLiteratureArgs {
  query: string;
}

export function searchLiterature(args: SearchLiteratureArgs): Promise<ToolResult<LiteratureHit[]>> {
  return callTool('search_literature', { ...args }, () => searchLiteratureFixture(args.query));
}
