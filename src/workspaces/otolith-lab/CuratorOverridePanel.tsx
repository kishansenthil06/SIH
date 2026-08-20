import { useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { submitCuration } from '../../tools';
import { useCurationStore } from '../../store/useCurationStore';
import { SPECIES_CATALOG } from '../../mock-data/constants';
import { Card } from '../../components/common/Card';
import { Tag } from '../../components/common/Tag';
import { formatPercent, formatTimestamp } from '../../utils/format';

interface CuratorOverridePanelProps {
  specimenId: string;
}

// The explicit human-in-the-loop review step: a curator either accepts the
// AI's predicted species or overrides it with the correct one from the
// catalog. Both paths call submitCuration() (the "backend" ack) and then
// resolve the task in the shared curation store, which is what clears the
// pending-count badge in the sidebar.
export function CuratorOverridePanel({ specimenId }: CuratorOverridePanelProps) {
  const task = useCurationStore((s) => s.tasks.find((t) => t.specimenId === specimenId));
  const decide = useCurationStore((s) => s.decide);
  const [overriding, setOverriding] = useState(false);
  const [chosenSpecies, setChosenSpecies] = useState(SPECIES_CATALOG[0]?.scientificName ?? '');
  const [submitting, setSubmitting] = useState(false);

  if (!task) return null;

  async function handleAccept() {
    if (!task) return;
    setSubmitting(true);
    try {
      await submitCuration({ taskId: task.id, decision: 'accept' });
      decide(task.id, 'accepted', task.aiPrediction);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOverrideConfirm() {
    if (!task) return;
    setSubmitting(true);
    try {
      await submitCuration({ taskId: task.id, decision: 'override' });
      decide(task.id, 'overridden', chosenSpecies);
      setOverriding(false);
    } finally {
      setSubmitting(false);
    }
  }

  const isResolved = task.status !== 'pending';

  return (
    <Card title="Curator Review">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--color-text-muted)]">AI prediction</span>
          <span className="italic text-[var(--color-text)]">{task.aiPrediction}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--color-text-muted)]">AI confidence</span>
          <span className="text-[var(--color-text)]">{formatPercent(task.aiConfidence)}</span>
        </div>

        {isResolved ? (
          <div className="flex items-start gap-2 rounded-lg border border-[var(--color-success)]/30 bg-[rgba(52,211,153,0.08)] px-3 py-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-success)]" />
            <div className="text-xs">
              <p className="font-medium text-[var(--color-text)]">
                {task.status === 'accepted' ? 'Accepted AI prediction' : 'Overridden by curator'}
              </p>
              <p className="text-[var(--color-text-muted)]">Final: {task.curatorDecision}</p>
              {task.decidedAt && <p className="mt-0.5 text-[10px] text-[var(--color-text-dim)]">{formatTimestamp(task.decidedAt)}</p>}
            </div>
          </div>
        ) : overriding ? (
          <div className="space-y-2 rounded-lg border border-[var(--color-border-strong)] p-2">
            <label className="text-xs text-[var(--color-text-muted)]" htmlFor="override-species">
              Correct species
            </label>
            <select
              id="override-species"
              value={chosenSpecies}
              onChange={(e) => setChosenSpecies(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-panel-hover)] px-2 py-1 text-xs text-[var(--color-text)]"
            >
              {SPECIES_CATALOG.map((s) => (
                <option key={s.speciesId} value={s.scientificName}>
                  {s.scientificName} ({s.commonName})
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={handleOverrideConfirm}
                className="rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-[var(--color-bg)] disabled:opacity-50"
              >
                Confirm override
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => setOverriding(false)}
                className="rounded-lg border border-[var(--color-border-strong)] px-3 py-1.5 text-xs text-[var(--color-text-muted)]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={submitting}
              onClick={handleAccept}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-success)] px-3 py-1.5 text-xs font-medium text-[#052e1b] disabled:opacity-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Accept AI prediction
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => setOverriding(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Override
            </button>
          </div>
        )}

        <Tag tone={task.status === 'pending' ? 'warning' : task.status === 'accepted' ? 'success' : 'accent'}>{task.status}</Tag>
      </div>
    </Card>
  );
}
