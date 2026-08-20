import { useEffect, useState } from 'react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { Card } from '../../components/common/Card';
import { MapCanvas } from '../../components/map/MapCanvas';

interface IngestPreviewMapProps {
  points: { lat: number; lon: number }[];
}

// Shown once the job status hits 'ingested'. Points fade/scale in on mount
// via a simple progress ramp re-rendered over a few frames -- a light-touch
// "animate in" that avoids pulling in a real animation library for a demo.
export function IngestPreviewMap({ points }: IngestPreviewMapProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    let raf = 0;
    const start = performance.now();
    const duration = 500;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      setProgress(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [points]);

  const layer = new ScatterplotLayer({
    id: 'ingested-points',
    data: points,
    getPosition: (d: { lat: number; lon: number }) => [d.lon, d.lat],
    getRadius: 1200 * (0.5 + progress * 0.5),
    getFillColor: [34, 211, 238, Math.round(200 * progress)],
    radiusMinPixels: 3,
    radiusMaxPixels: 14,
    pickable: false,
  });

  return (
    <Card title="Ingested points">
      {points.length === 0 ? (
        <p className="px-1 py-8 text-center text-xs text-[var(--color-text-muted)]">No valid coordinates to preview.</p>
      ) : (
        <MapCanvas layers={[layer]} height={360} />
      )}
    </Card>
  );
}
