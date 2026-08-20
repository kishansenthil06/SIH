import { useMemo, useState } from 'react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { queryEdna } from '../../tools';
import { useToolCall } from '../../hooks/useToolCall';
import { MapCanvas } from '../../components/map/MapCanvas';
import { Card } from '../../components/common/Card';
import { LoadingLines } from '../../components/common/LoadingSkeleton';
import { ProvenanceBadge } from '../../components/common/ProvenanceBadge';
import { formatDate } from '../../utils/format';
import type { EdnaSample } from '../../types/edna';

const EDNA_QUERY_ARGS = {};

// Cool/dim blue for low diversity, bright accent cyan for high diversity.
const LOW_COLOR: [number, number, number] = [40, 55, 80];
const HIGH_COLOR: [number, number, number] = [34, 211, 238];

function lerpColor(t: number): [number, number, number, number] {
  const r = Math.round(LOW_COLOR[0] + (HIGH_COLOR[0] - LOW_COLOR[0]) * t);
  const g = Math.round(LOW_COLOR[1] + (HIGH_COLOR[1] - LOW_COLOR[1]) * t);
  const b = Math.round(LOW_COLOR[2] + (HIGH_COLOR[2] - LOW_COLOR[2]) * t);
  return [r, g, b, 210];
}

// Deck.gl ScatterplotLayer over eDNA sample stations, sized/colored by
// Shannon diversity index. MapCanvas doesn't expose deck.gl's getTooltip,
// so hover/click state is tracked locally and rendered as an info card
// below the map instead.
export function SampleMap() {
  const { data: samples, result, loading } = useToolCall(queryEdna, EDNA_QUERY_ARGS, []);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);

  const maxShannon = useMemo(() => {
    if (!samples || samples.length === 0) return 1;
    return Math.max(...samples.map((s) => s.shannonIndex), 0.0001);
  }, [samples]);

  const layers = useMemo(() => {
    if (!samples) return [];
    return [
      new ScatterplotLayer<EdnaSample>({
        id: 'edna-samples',
        data: samples,
        pickable: true,
        stroked: true,
        radiusUnits: 'meters',
        getPosition: (d): [number, number] => [d.lon, d.lat],
        getRadius: (d) => 1500 + (d.shannonIndex / maxShannon) * 4500,
        getFillColor: (d) => lerpColor(d.shannonIndex / maxShannon),
        getLineColor: [8, 20, 30, 220],
        lineWidthMinPixels: 1,
        onClick: (info) => {
          if (info.object) setSelectedSampleId(info.object.sampleId);
        },
        onHover: (info) => {
          if (info.object) setSelectedSampleId(info.object.sampleId);
        },
      }),
    ];
  }, [samples, maxShannon]);

  const selectedSample = samples?.find((s) => s.sampleId === selectedSampleId) ?? null;

  return (
    <Card title="Sample Stations" action={<ProvenanceBadge result={result} />}>
      {loading ? (
        <LoadingLines lines={6} />
      ) : (
        <>
          <MapCanvas layers={layers} height={320} />
          <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-hover)] px-3 py-2 text-xs">
            {selectedSample ? (
              <div className="space-y-0.5">
                <p className="font-medium text-[var(--color-text)]">{selectedSample.stationName}</p>
                <p className="text-[var(--color-text-muted)]">{formatDate(selectedSample.date)}</p>
                <p className="text-[var(--color-text-muted)]">
                  Shannon {selectedSample.shannonIndex.toFixed(2)} · Simpson {selectedSample.simpsonIndex.toFixed(2)} ·{' '}
                  {selectedSample.detections.length} detections
                </p>
              </div>
            ) : (
              <p className="text-[var(--color-text-dim)]">Hover or click a station to see its diversity indices.</p>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
