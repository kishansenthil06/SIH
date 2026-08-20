import { callTool, type ToolResult } from './client';
import type { GraphTraversalResult } from '../types/graph';
import { traverseGraphFixture } from '../mock-data/generators/generateGraph';

export interface TraverseGraphArgs {
  rootSpeciesId: string;
}

export function traverseGraph(args: TraverseGraphArgs): Promise<ToolResult<GraphTraversalResult>> {
  return callTool('traverse_graph', { ...args }, () => traverseGraphFixture(args.rootSpeciesId));
}
