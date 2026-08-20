import { useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Tag } from '../../components/common/Tag';
import { ConfidenceMeter } from '../../components/common/ConfidenceMeter';
import { ProvenanceBadge } from '../../components/common/ProvenanceBadge';
import { LoadingLines, LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { CorrelationScatter } from '../../components/charts/CorrelationScatter';
import { ShapBarChart } from '../../components/charts/ShapBarChart';
import { MapCanvas } from '../../components/map/MapCanvas';
import { buildH3HexagonLayer } from '../../hooks/useH3Layer';
import { rampSuitability } from '../../app/theme/tokens';
import { useToolCall } from '../../hooks/useToolCall';
import { correlateVariables } from '../../tools/correlateVariables';
import { runSdm } from '../../tools/runSdm';
import { SARDINELLA_DEMO_SPECIES_ID } from '../../demo/sardinellaScript';
import type { Insight } from '../../types/insight';
import type { ShapValue } from '../../types/species';
import type { H3CellValue } from '../../types/h3';

const SDM_DATE = '2024-06-01';

interface InsightCardProps {
  insight: Insight;
}

// Independently re-fetches the same two tool calls the demo script already
// ran (correlate_variables + run_sdm for the Sardinella species) purely to
// get chart-ready data for the embedded visuals. Because both call through
// the same mock tool layer with the same args, the numbers match what's in
// insight.evidence -- demonstrating cross-workspace data consistency.
export function InsightCard({ insight }: InsightCardProps) {
  const correlationCall = useToolCall(
    correlateVariables,
    { variable: 'sst', speciesId: SARDINELLA_DEMO_SPECIES_ID },
    [SARDINELLA_DEMO_SPECIES_ID]
  );
  const sdmCall = useToolCall(runSdm, { speciesId: SARDINELLA_DEMO_SPECIES_ID, date: SDM_DATE }, [SARDINELLA_DEMO_SPECIES_ID]);

  const avgShapValues: ShapValue[] = useMemo(() => {
    const cells = sdmCall.data;
    if (!cells || cells.length === 0) return [];
    const sums = new Map<string, { sum: number; count: number }>();
    for (const cell of cells) {
      for (const sv of cell.shapValues) {
        const entry = sums.get(sv.feature) ?? { sum: 0, count: 0 };
        entry.sum += sv.contribution;
        entry.count += 1;
        sums.set(sv.feature, entry);
      }
    }
    return Array.from(sums.entries()).map(([feature, { sum, count }]) => ({ feature, contribution: sum / count }));
  }, [sdmCall.data]);

  const suitabilityLayer = useMemo(() => {
    const cells = sdmCall.data;
    if (!cells || cells.length === 0) return null;
    const h3Data: H3CellValue<number>[] = cells.map((c) => ({ h3Cell: c.h3Cell, value: c.suitability, lat: c.lat, lon: c.lon }));
    return buildH3HexagonLayer('sdm-suitability', h3Data, rampSuitability);
  }, [sdmCall.data]);

  return (
    <Card title="Insight">
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-[var(--color-text)]">{insight.narrative}</p>

        <ConfidenceMeter value={insight.confidence} />

        <div>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-text-dim)]">Evidence</h4>
          <ul className="space-y-2">
            {insight.evidence.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <span className="text-[var(--color-text)]">{e.claim}</span>
                <Tag tone="accent">{e.supportingToolCall}()</Tag>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-dim)]">SST vs. Catch</h4>
              <ProvenanceBadge result={correlationCall.result} />
            </div>
            {correlationCall.loading || !correlationCall.data ? (
              <LoadingSkeleton className="h-[260px] w-full" />
            ) : (
              <CorrelationScatter correlation={correlationCall.data} />
            )}
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-dim)]">SDM Feature Attribution (SHAP)</h4>
              <ProvenanceBadge result={sdmCall.result} />
            </div>
            {sdmCall.loading || avgShapValues.length === 0 ? (
              <LoadingSkeleton className="h-[220px] w-full" />
            ) : (
              <ShapBarChart values={avgShapValues} />
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-text-dim)]">Habitat Suitability</h4>
          {sdmCall.loading || !suitabilityLayer ? (
            <LoadingSkeleton className="h-[220px] w-full" />
          ) : (
            <MapCanvas layers={[suitabilityLayer]} height={220} />
          )}
        </div>

        <div>
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text-dim)]">
            <BookOpen className="h-3.5 w-3.5" />
            Citations
          </h4>
          {insight.citations.length === 0 ? (
            <LoadingLines lines={2} />
          ) : (
            <ul className="space-y-1.5">
              {insight.citations.map((c) => (
                <li key={c.id} className="text-xs text-[var(--color-text-muted)]">
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noreferrer" className="text-[var(--color-text)] hover:text-[var(--color-accent)]">
                      {c.title}
                    </a>
                  ) : (
                    <span className="text-[var(--color-text)]">{c.title}</span>
                  )}
                  <span className="text-[var(--color-text-dim)]">
                    {' '}
                    — {c.authors} ({c.year}), {c.venue}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
}
