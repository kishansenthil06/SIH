interface MapLegendProps {
  title: string;
  min: string;
  max: string;
  colors: string[]; // css color stops, low -> high
}

export function MapLegend({ title, min, max, colors }: MapLegendProps) {
  return (
    <div className="absolute bottom-3 left-3 z-10 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]/90 px-3 py-2 text-xs backdrop-blur">
      <p className="mb-1 font-medium text-[var(--color-text)]">{title}</p>
      <div className="flex items-center gap-2">
        <span className="text-[var(--color-text-dim)]">{min}</span>
        <div className="h-2 w-24 rounded-full" style={{ background: `linear-gradient(to right, ${colors.join(',')})` }} />
        <span className="text-[var(--color-text-dim)]">{max}</span>
      </div>
    </div>
  );
}
