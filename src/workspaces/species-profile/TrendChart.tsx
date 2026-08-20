import { useMemo } from 'react';
import { Card } from '../../components/common/Card';
import { LoadingLines } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ProvenanceBadge } from '../../components/common/ProvenanceBadge';
import { TimeseriesChart } from '../../components/charts/TimeseriesChart';
import { useToolCall } from '../../hooks/useToolCall';
import { getSpeciesOccurrences } from '../../tools';
import { useSpeciesStore } from '../../store/useSpeciesStore';
import { colors } from '../../app/theme/tokens';

// Aggregates raw occurrence records into a per-year abundance-proxy series
// so the trend reads as "is the population going up or down", matching the
// Copilot's sardine-decline narrative when this species is selected.
export function TrendChart() {
  const speciesId = useSpeciesStore((s) => s.selectedSpeciesId);
  const { data, result, loading } = useToolCall(getSpeciesOccurrences, { speciesId }, [speciesId]);

  const points = useMemo(() => {
    if (!data) return [];
    const byYear = new Map<number, number>();
    for (const occurrence of data) {
      const year = new Date(occurrence.date).getUTCFullYear();
      byYear.set(year, (byYear.get(year) ?? 0) + (occurrence.count ?? 1));
    }
    return Array.from(byYear.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, value]) => ({ date: `${year}-01-01`, value }));
  }, [data]);

  return (
    <Card
      title="Occurrence Trend"
      action={<ProvenanceBadge result={result} />}
    >
      {loading && <LoadingLines lines={5} />}
      {!loading && points.length === 0 && <EmptyState title="No occurrence records" description="No occurrence data available for this species." />}
      {!loading && points.length > 0 && (
        <TimeseriesChart series={[{ name: 'Abundance proxy', color: colors.accent, points }]} height={220} />
      )}
    </Card>
  );
}
