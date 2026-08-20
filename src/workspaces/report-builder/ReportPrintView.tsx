import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { useCopilotStore } from '../../store/useCopilotStore';
import { useSpeciesStore } from '../../store/useSpeciesStore';
import { formatTimestamp } from '../../utils/format';

// Standalone, print-optimized document mounted directly at /report/print,
// outside AppShell (no sidebar). Reads the same Copilot insight data as
// ReportBuilderWorkspace and renders it as a clean report, auto-triggering
// window.print() shortly after mount (fonts/layout need a moment to settle).
export function ReportPrintView() {
  const insights = useCopilotStore((s) => s.insights);
  const currentInsightId = useCopilotStore((s) => s.currentInsightId);
  const selectedSpeciesId = useSpeciesStore((s) => s.selectedSpeciesId);
  const insight = currentInsightId ? insights[currentInsightId] : null;

  useEffect(() => {
    if (!insight) return;
    const t = setTimeout(() => window.print(), 400);
    return () => clearTimeout(t);
  }, [insight]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <style>{`
        @media print {
          .report-page {
            max-width: none;
            padding: 0;
          }
          .report-section {
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-3">
        <Link to="/report" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)]">
          ← Back to Report Builder
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-[var(--color-bg)]"
        >
          <Printer className="h-3.5 w-3.5" />
          Print / Save PDF
        </button>
      </div>

      <div className="report-page mx-auto max-w-3xl px-8 py-10 font-serif">
        {!insight ? (
          <p className="text-sm text-[var(--color-text-muted)]">
            No insight has been generated yet. Run the Copilot demo, then return to{' '}
            <Link to="/report" className="text-[var(--color-accent)]">
              Report Builder
            </Link>
            .
          </p>
        ) : (
          <>
            <header className="report-section mb-8 border-b border-[var(--color-border)] pb-4">
              <p className="text-xs uppercase tracking-widest text-[var(--color-text-dim)]">
                AI-Driven Unified Data Platform — Insight Report
              </p>
              <h1 className="mt-1 text-2xl font-semibold">{insight.question}</h1>
              <p className="mt-2 text-xs text-[var(--color-text-dim)]">
                Species: {selectedSpeciesId} · Generated {formatTimestamp(insight.generatedAt)}
              </p>
            </header>

            <section className="report-section mb-8">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">
                Executive Summary
              </h2>
              <p className="text-sm leading-relaxed">{insight.narrative}</p>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                Confidence: {Math.round(insight.confidence * 100)}%
              </p>
            </section>

            <section className="report-section mb-8">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">Evidence</h2>
              <ul className="space-y-2">
                {insight.evidence.map((e) => {
                  const citations = insight.citations.filter((c) => e.citationIds?.includes(c.id));
                  return (
                    <li key={e.id} className="text-sm leading-relaxed">
                      {e.claim}
                      {e.value !== undefined && <span className="text-[var(--color-text-muted)]"> ({e.value})</span>}
                      {citations.length > 0 && (
                        <span className="text-xs text-[var(--color-text-dim)]">
                          {' '}
                          [{citations.map((c) => `${c.authors.split(',')[0]} ${c.year}`).join('; ')}]
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            {insight.citations.length > 0 && (
              <section className="report-section mb-8">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">
                  Citations
                </h2>
                <ol className="list-decimal space-y-1 pl-4 text-xs text-[var(--color-text-muted)]">
                  {insight.citations.map((c) => (
                    <li key={c.id}>
                      {c.authors} ({c.year}). <em>{c.title}</em>. {c.venue}
                      {c.url ? ` — ${c.url}` : ''}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section className="report-section">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">
                Methodology &amp; Provenance Appendix
              </h2>
              <p className="mb-2 text-xs text-[var(--color-text-dim)]">
                Full tool-call trace behind this insight, for reproducibility.
              </p>
              <ul className="space-y-1 font-mono text-[10px] leading-relaxed text-[var(--color-text-dim)]">
                {insight.trace.map((t) => (
                  <li key={t.step}>
                    [{t.step}] {t.toolName}({JSON.stringify(t.args)}) — {t.status}
                    {t.startedAt ? ` · started ${formatTimestamp(t.startedAt)}` : ''}
                    {t.latencyMs !== undefined ? ` · ${t.latencyMs}ms` : ''}
                    {t.resultSummary ? ` · ${t.resultSummary}` : ''}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
