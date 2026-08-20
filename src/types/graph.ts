export interface GraphNode {
  id: string;
  label: string;
  type: 'species' | 'region' | 'habitat' | 'paper' | 'variable';
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface GraphTraversalResult {
  rootId: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}
