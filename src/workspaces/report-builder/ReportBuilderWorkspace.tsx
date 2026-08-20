import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileOutput, Sparkles } from 'lucide-react';
import { WorkspaceHeader } from '../../components/layout/WorkspaceHeader';
import { Card } from '../../components/common/Card';
import { Tag } from '../../components/common/Tag';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfidenceMeter } from '../../components/common/ConfidenceMeter';
import { useCopilotStore } from '../../store/useCopilotStore';
import { useSpeciesStore } from '../../store/useSpeciesStore';
import { formatTimestamp } from '../../utils/format';
import { SectionPicker, REPORT_SECTIONS } from './SectionPicker';

const DEFAULT_SELECTED = REPORT_SECTIONS.map((s) => s.key);

// Composes the section picker with a live preview pane built from the last
// Copilot-generated Insight. The preview intentionally re-renders equivalent
// content inline (rather than reusing ReportPrintView) since that component
// is mounted outside the router's AppShell context for printing.
export function ReportBuilderWorkspace() {
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED);
  const insights = useCopilotStore((s) => s.insights);
  const currentInsightId = useCopilotStore((s) => s.currentInsightId);
  const selectedSpeciesId = useSpeciesStore((s) => s.selectedSpeciesId);

  const insight = currentInsightId ? insights[currentInsightId] : null;

  function isOn(key: string) {
    return selected.includes(key);
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      <WorkspaceHeader
        title="Report Builder"
        description="Assemble a shareable report from the latest Copilot insight."
        action={
          <button
            type="button"
            onClick={() => window.open('/report/print', '_blank')}
            disabled={!insight}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileOutput className="h-3.5 w-3.5" />
            Export PDF
          </button>
        }
      />

      <div className="grid flex-1 grid-cols-1 gap-4 p-6 lg:grid-cols-[260px_1fr]">
        <SectionPicker selected={selected} onChange={setSelected} />

        <Card title="Preview">
          {!insight ? (
            <EmptyState
              icon={Sparkles}
              title="No insight yet"
              description="Run the Copilot demo to generate an insight before building a report."
              action={
                <Link
                  to="/copilot"
                  className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-accent-strong)]/40 bg-[var(--color-accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]/80"
                >
                  Go to Copilot
                </Link>
              }
            />
          ) : (
            <div className="space-y-6">
              <div className="border-b border-[var(--color-border)] pb-3">
                <p className="text-xs uppercase tracking-wide text-[var(--color-text-dim)]">
                  Prepared for species: {selectedSpeciesId}
                </p>
                <h2 className="mt-1 text-base font-semibold text-[var(--color-text)]">{insight.question}</h2>
                <p className="mt-1 text-xs text-[var(--color-text-dim)]">Generated {formatTimestamp(insight.generatedAt)}</p>
              </div>

              {isOn('executive-summary') && (
                <section>
                  <h3 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text-dim)]">
                    Executive Summary
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text)]">{insight.narrative}</p>
                  <div className="mt-2">
                    <ConfidenceMeter value={insight.confidence} />
                  </div>
                </section>
              )}

              {isOn('species-trend') && (
                <section>
                  <h3 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text-dim)]">
                    Species Trend
                  </h3>
                  {insight.charts.filter((c) => c.type === 'timeseries').length === 0 ? (
                    <p className="text-xs text-[var(--color-text-dim)]">No trend chart attached to this insight.</p>
                  ) : (
                    <ul className="space-y-1">
                      {insight.charts
                        .filter((c) => c.type === 'timeseries')
                        .map((c) => (
                          <li key={c.id} className="text-xs text-[var(--color-text-muted)]">
                            {c.title}
                          </li>
                        ))}
                    </ul>
                  )}
                </section>
              )}

              {isOn('correlation-evidence') && (
                <section>
                  <h3 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text-dim)]">
                    Correlation Evidence
                  </h3>
                  <ul className="space-y-1.5">
                    {insight.evidence.map((e) => (
                      <li key={e.id} className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-muted)]">
                        <span className="text-[var(--color-text)]">{e.claim}</span>
                        {e.value !== undefined && <Tag tone="accent">{e.value}</Tag>}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {isOn('map-snapshot') && (
                <section>
                  <h3 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text-dim)]">
                    Map Snapshot
                  </h3>
                  {insight.mapLayers.length === 0 ? (
                    <p className="text-xs text-[var(--color-text-dim)]">No map layers attached to this insight.</p>
                  ) : (
                    <ul className="space-y-1">
                      {insight.mapLayers.map((layer) => (
                        <li key={layer.id} className="text-xs text-[var(--color-text-muted)]">
                          {layer.label} <span className="text-[var(--color-text-dim)]">({layer.type})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}

              {isOn('citations') && (
                <section>
                  <h3 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text-dim)]">
                    Citations
                  </h3>
                  {insight.citations.length === 0 ? (
                    <p className="text-xs text-[var(--color-text-dim)]">No citations attached to this insight.</p>
                  ) : (
                    <ul className="space-y-1">
                      {insight.citations.map((c) => (
                        <li key={c.id} className="text-xs text-[var(--color-text-muted)]">
                          <span className="text-[var(--color-text)]">{c.title}</span> — {c.authors} ({c.year}), {c.venue}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}

              {isOn('methodology') && (
                <section>
                  <h3 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text-dim)]">
                    Methodology / Provenance Appendix
                  </h3>
                  <ul className="space-y-1">
                    {insight.trace.map((t) => (
                      <li key={t.step} className="font-mono text-[10px] text-[var(--color-text-dim)]">
                        {t.step}. {t.toolName}({JSON.stringify(t.args)}) — {t.status}
                        {t.finishedAt ? ` · ${formatTimestamp(t.finishedAt)}` : ''}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
