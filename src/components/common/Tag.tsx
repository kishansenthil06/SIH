import type { ReactNode } from 'react';
import clsx from 'clsx';

const TONES = {
  neutral: 'bg-[var(--color-panel-hover)] text-[var(--color-text-muted)] border-[var(--color-border-strong)]',
  accent: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent-strong)]/40',
  success: 'bg-[rgba(52,211,153,0.12)] text-[var(--color-success)] border-[var(--color-success)]/30',
  warning: 'bg-[rgba(251,191,36,0.12)] text-[var(--color-warning)] border-[var(--color-warning)]/30',
  danger: 'bg-[rgba(248,113,113,0.12)] text-[var(--color-danger)] border-[var(--color-danger)]/30',
};

interface TagProps {
  children: ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}

export function Tag({ children, tone = 'neutral', className }: TagProps) {
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium', TONES[tone], className)}>
      {children}
    </span>
  );
}
