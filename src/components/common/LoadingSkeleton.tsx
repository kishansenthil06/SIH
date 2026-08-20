import clsx from 'clsx';

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse rounded-lg bg-[var(--color-panel-hover)]', className)} />;
}

export function LoadingLines({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingSkeleton key={i} className={clsx('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}
