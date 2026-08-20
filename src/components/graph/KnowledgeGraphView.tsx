import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import type { GraphTraversalResult } from '../../types/graph';
import { colors } from '../../app/theme/tokens';

cytoscape.use(fcose);

const TYPE_COLOR: Record<string, string> = {
  species: colors.accent,
  region: colors.info,
  habitat: colors.success,
  paper: colors.warning,
  variable: colors.danger,
};

export function KnowledgeGraphView({ graph, height = 320 }: { graph: GraphTraversalResult; height?: number }) {
  const elements = [
    ...graph.nodes.map((n) => ({ data: { id: n.id, label: n.label, type: n.type } })),
    ...graph.edges.map((e) => ({ data: { id: e.id, source: e.source, target: e.target, label: e.label } })),
  ];

  return (
    <CytoscapeComponent
      elements={elements}
      style={{ width: '100%', height }}
      layout={{ name: 'fcose', animate: false, nodeSeparation: 90 } as unknown as cytoscape.LayoutOptions}
      stylesheet={[
        {
          selector: 'node',
          style: {
            'background-color': (ele: cytoscape.NodeSingular) => TYPE_COLOR[ele.data('type')] ?? colors.textMuted,
            label: 'data(label)',
            color: colors.text,
            'font-size': 10,
            'text-wrap': 'wrap',
            'text-max-width': '80px',
            width: 26,
            height: 26,
            'text-valign': 'bottom',
            'text-margin-y': 6,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1.5,
            'line-color': colors.borderStrong,
            'target-arrow-color': colors.borderStrong,
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            label: 'data(label)',
            'font-size': 8,
            color: colors.textDim,
          },
        },
      ]}
    />
  );
}
