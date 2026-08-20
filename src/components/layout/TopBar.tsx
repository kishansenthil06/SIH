import { ShieldCheck } from 'lucide-react';

export function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-2 text-xs text-[var(--color-text-muted)]">
      <span>Kerala Coast &amp; Southeastern Arabian Sea · Demo Dataset</span>
      <span className="flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-success)]" />
        Signed in as Researcher
      </span>
    </header>
  );
}
