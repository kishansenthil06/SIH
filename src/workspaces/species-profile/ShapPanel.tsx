import { useMemo } from 'react';
import { Card } from '../../components/common/Card';
import { ConfidenceMeter } from '../../components/common/ConfidenceMeter';
import { ProvenanceBadge } from '../../components/common/ProvenanceBadge';
import { LoadingLines } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ShapBarChart } from '../../components/charts/ShapBarChart';
import { useToolCall } from '../../hooks/useToolCall';
import { runSdm } from '../../tools';
import { useSpeciesStore } from '../../store/useSpeciesStore';
import type { ShapValue } from '../../types/species';

const SDM_DATE = '2024-06-01';

// Averages the per-cell suitability and SHAP contributions across the whole
// SDM snapshot rather than showing a single cell -- gives a
// region-representative "why does the model think this" explanation.
export function ShapPanel() {
  const speciesId = useSpeciesStore((s) => s.selectedSpeciesId);
  const { data, result, loading } = useToolCall(runSdm, { speciesId, date: SDM_DATE }, [speciesId]);

  const meanSuitability = useMemo(() => {
    if (!data || data.length === 0) return null;
    return data.reduce((sum, d) => sum + d.suitability, 0) / data.length;
  }, [data]);

  const averagedShapValues: ShapValue[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    const totals = new Map<string, { sum: number; count: number }>();
    for (const cell of data) {
      for (const shap of cell.shapValues) {
        const entry = totals.get(shap.feature) ?? { sum: 0, count: 0 };
        entry.sum += shap.contribution;
        entry.count += 1;
        totals.set(shap.feature, entry);
      }
    }
    return Array.from(totals.entries()).map(([feature, { sum, count }]) => ({
      feature,
      contribution: sum / count,
    }));
  }, [data]);

  return (
    <Card title="Habitat Suitability Model" action={<ProvenanceBadge result={result} />}>
      {loading && <LoadingLines lines={6} />}
      {!loading && (!data || data.length === 0) && (
        <EmptyState title="No SDM output" description="No habitat suitability model output for this species." />
      )}
      {!loading && data && data.length > 0 && (
        <div className="flex flex-col gap-4">
          {meanSuitability !== null && <ConfidenceMeter value={meanSuitability} label="Habitat Suitability" />}
          <div>
            <p className="mb-2 text-xs text-[var(--color-text-dim)]">
              Mean feature contribution to predicted suitability (SHAP, averaged across {data.length} cells)
            </p>
            <ShapBarChart values={averagedShapValues} height={220} />
          </div>
        </div>
      )}
    </Card>
  );
}
