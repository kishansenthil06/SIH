import { liveCall, type ToolResult } from './client';
import type { GraphTraversalResult } from '../types/graph';

export interface TraverseGraphArgs {
  rootSpeciesId: string;
}

export function traverseGraph(args: TraverseGraphArgs): Promise<ToolResult<GraphTraversalResult>> {
  const qs = new URLSearchParams({ rootSpeciesId: args.rootSpeciesId });
  return liveCall('traverse_graph', { ...args }, `/api/v1/graph/traverse?${qs}`);
}
