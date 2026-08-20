import type { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}

export function Card({ children, className, title, action }: CardProps) {
  return (
    <div className={clsx('rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)]', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
          {title && <h3 className="text-sm font-medium text-[var(--color-text)]">{title}</h3>}
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
