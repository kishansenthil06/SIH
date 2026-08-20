import clsx from 'clsx';

interface DemoModeToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

// Cosmetic-but-real pill switch. Demo Mode ON (default) runs the scripted
// Sardinella tool-call sequence for matching questions; OFF always returns
// the deterministic fallback message, giving the presenter a reliable
// manual-mode escape hatch if the live sequence misbehaves on stage.
export function DemoModeToggle({ enabled, onChange }: DemoModeToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      aria-pressed={enabled}
      className="inline-flex flex-none items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-panel-hover)] px-2.5 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/40"
    >
      <span
        className={clsx(
          'relative h-4 w-7 flex-none rounded-full transition-colors',
          enabled ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border-strong)]'
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 h-3 w-3 rounded-full bg-[var(--color-bg)] transition-transform',
            enabled ? 'translate-x-3.5' : 'translate-x-0.5'
          )}
        />
      </span>
      <span className={clsx('font-medium whitespace-nowrap', enabled ? 'text-[var(--color-text)]' : 'text-[var(--color-text-dim)]')}>
        Demo Mode {enabled ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}
