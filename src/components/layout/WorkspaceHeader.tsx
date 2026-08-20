import type { ReactNode } from 'react';

interface WorkspaceHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function WorkspaceHeader({ title, description, action }: WorkspaceHeaderProps) {
  return (
    <div className="flex items-start justify-between border-b border-[var(--color-border)] px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-[var(--color-text)]">{title}</h1>
        {description && <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{description}</p>}
      </div>
      {action}
    </div>
  );
}
