import clsx from 'clsx';
import { CheckCircle2, ListTree, Loader2, XCircle } from 'lucide-react';
import { useCopilotStore } from '../../store/useCopilotStore';
import type { ToolCallTraceEntry, ToolStatus } from '../../types/insight';
import { EmptyState } from '../../components/common/EmptyState';

function StatusIcon({ status }: { status: ToolStatus }) {
  switch (status) {
    case 'running':
      return <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--color-accent)]" />;
    case 'done':
      return <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success)]" />;
    case 'error':
      return <XCircle className="h-3.5 w-3.5 text-[var(--color-danger)]" />;
    case 'pending':
    default:
      return <span className="block h-2 w-2 rounded-full bg-[var(--color-text-dim)]" />;
  }
}

function TraceRow({ entry, isLast }: { entry: ToolCallTraceEntry; isLast: boolean }) {
  return (
    <div className="relative flex gap-3 pb-4">
      {!isLast && <span className="absolute left-[11px] top-6 h-[calc(100%-1.25rem)] w-px bg-[var(--color-border)]" />}
      <div
        className={clsx(
          'z-10 flex h-6 w-6 flex-none items-center justify-center rounded-full border',
          entry.status === 'done' && 'border-[var(--color-success)]/40 bg-[rgba(52,211,153,0.08)]',
          entry.status === 'running' && 'border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)]',
          entry.status === 'error' && 'border-[var(--color-danger)]/40 bg-[rgba(248,113,113,0.08)]',
          entry.status === 'pending' && 'border-[var(--color-border-strong)] bg-[var(--color-panel-hover)]'
        )}
      >
        <StatusIcon status={entry.status} />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-mono text-xs text-[var(--color-text)]">
            {entry.step}. {entry.toolName}()
          </span>
          {entry.status === 'done' && entry.latencyMs !== undefined && (
            <span className="text-[10px] text-[var(--color-text-dim)]">{entry.latencyMs}ms</span>
          )}
        </div>
        <p className="mt-0.5 truncate font-mono text-[10px] text-[var(--color-text-dim)]" title={JSON.stringify(entry.args)}>
          {JSON.stringify(entry.args)}
        </p>
        {entry.status === 'done' && entry.resultSummary && (
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{entry.resultSummary}</p>
        )}
        {entry.status === 'error' && <p className="mt-1 text-xs text-[var(--color-danger)]">Tool call failed</p>}
      </div>
    </div>
  );
}

// Live-renders useCopilotStore's trace array as a vertical numbered stepper.
// Re-renders automatically as runSardinellaDemo() streams status updates
// into the store step-by-step (pending -> running -> done).
export function ToolCallTrace() {
  const trace = useCopilotStore((s) => s.trace);

  if (trace.length === 0) {
    return (
      <EmptyState
        icon={ListTree}
        title="No tool calls yet"
        description="Ask a question to see the live, inspectable tool-call trace here."
      />
    );
  }

  return (
    <div className="px-1 py-1">
      {trace.map((entry, i) => (
        <TraceRow key={entry.step} entry={entry} isLast={i === trace.length - 1} />
      ))}
    </div>
  );
}
