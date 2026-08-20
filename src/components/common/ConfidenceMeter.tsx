function toneFor(value: number) {
  if (value >= 0.75) return 'var(--color-success)';
  if (value >= 0.5) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

export function ConfidenceMeter({ value, label = 'Confidence' }: { value: number; label?: string }) {
  const pct = Math.round(value * 100);
  const color = toneFor(value);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--color-panel-hover)]">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-medium" style={{ color }}>
        {pct}%
      </span>
    </div>
  );
}
