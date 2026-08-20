import clsx from 'clsx';

export interface LayerOption<T extends string> {
  key: T;
  label: string;
  swatch: string; // css color
}

interface LayerToggleListProps<T extends string> {
  options: LayerOption<T>[];
  active: T;
  onChange: (key: T) => void;
}

export function LayerToggleList<T extends string>({ options, active, onChange }: LayerToggleListProps<T>) {
  return (
    <div className="absolute right-3 top-3 z-10 flex flex-col gap-1 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]/90 p-1.5 backdrop-blur">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={clsx(
            'flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors',
            active === opt.key ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-panel-hover)]'
          )}
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: opt.swatch }} />
          {opt.label}
        </button>
      ))}
    </div>
  );
}
