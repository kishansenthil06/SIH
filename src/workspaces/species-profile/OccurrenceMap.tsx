import { useMemo } from 'react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { Card } from '../../components/common/Card';
import { ProvenanceBadge } from '../../components/common/ProvenanceBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { MapCanvas } from '../../components/map/MapCanvas';
import { useToolCall } from '../../hooks/useToolCall';
import { getSpeciesOccurrences } from '../../tools';
import { useSpeciesStore } from '../../store/useSpeciesStore';

export function OccurrenceMap() {
  const speciesId = useSpeciesStore((s) => s.selectedSpeciesId);
  const { data, result, loading } = useToolCall(getSpeciesOccurrences, { speciesId }, [speciesId]);

  const layers = useMemo(() => {
    const points = data ?? [];
    if (points.length === 0) return [];
    const counts = points.map((p) => p.count ?? 1);
    const maxCount = Math.max(...counts, 1);
    return [
      new ScatterplotLayer({
        id: 'species-profile-occurrences',
        data: points,
        pickable: true,
        getPosition: (d) => [d.lon, d.lat],
        getRadius: (d) => 1200 + ((d.count ?? 1) / maxCount) * 5000,
        radiusMinPixels: 3,
        radiusMaxPixels: 18,
        getFillColor: (d) => {
          const t = (d.count ?? 1) / maxCount;
          return [34, 211, 238, Math.round(120 + t * 135)];
        },
      }),
    ];
  }, [data]);

  return (
    <Card title="Occurrence Map" action={<ProvenanceBadge result={result} />}>
      {loading && <LoadingSkeleton className="h-[300px] w-full" />}
      {!loading && (data ?? []).length === 0 && (
        <EmptyState title="No occurrence records" description="No mapped observations for this species yet." />
      )}
      {!loading && (data ?? []).length > 0 && <MapCanvas layers={layers} height={300} />}
    </Card>
  );
}
