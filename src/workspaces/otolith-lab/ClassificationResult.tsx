import { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { OtolithSpecimen } from '../../types/otolith';
import { classifyOtolith } from '../../tools';
import { useToolCall } from '../../hooks/useToolCall';
import { useCurationStore } from '../../store/useCurationStore';
import { SPECIES_CATALOG } from '../../mock-data/constants';
import { Card } from '../../components/common/Card';
import { ConfidenceMeter } from '../../components/common/ConfidenceMeter';
import { ProvenanceBadge } from '../../components/common/ProvenanceBadge';
import { LoadingLines } from '../../components/common/LoadingSkeleton';
import { nextId } from '../../utils/id';

interface ClassificationResultProps {
  specimen: OtolithSpecimen;
}

// Runs the (mock) otolith shape classifier for the selected specimen and
// pushes a pending CurationTask into the shared store on first success --
// that is what lights up the "Otolith Lab" pending-count badge in the
// sidebar and drives the CuratorOverridePanel human-in-the-loop review.
export function ClassificationResult({ specimen }: ClassificationResultProps) {
  const [triggered, setTriggered] = useState(false);
  const addedForSpecimen = useRef<string | null>(null);
  const tasks = useCurationStore((s) => s.tasks);
  const addTask = useCurationStore((s) => s.addTask);

  // Reset the local "has this specimen been classified in this session"
  // state whenever the selected specimen changes.
  useEffect(() => {
    setTriggered(false);
  }, [specimen.specimenId]);

  const args = triggered ? { specimenId: specimen.specimenId } : null;
  const { data: prediction, result, loading } = useToolCall(classifyOtolith, args, [specimen.specimenId, triggered]);

  useEffect(() => {
    if (!prediction) return;
    if (addedForSpecimen.current === prediction.specimenId) return;
    addedForSpecimen.current = prediction.specimenId;
    const alreadyHasTask = tasks.some((t) => t.specimenId === prediction.specimenId);
    if (!alreadyHasTask) {
      addTask({
        id: nextId('curation'),
        specimenId: prediction.specimenId,
        aiPrediction: prediction.predictedScientificName,
        aiConfidence: prediction.confidence,
        status: 'pending',
      });
    }
    // Only re-run when a new prediction comes in -- tasks/addTask are
    // intentionally excluded so this doesn't fire on every store update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prediction]);

  const speciesInfo = useMemo(
    () => (prediction ? SPECIES_CATALOG.find((s) => s.speciesId === prediction.predictedSpeciesId) : undefined),
    [prediction]
  );

  if (!prediction && !loading) {
    return (
      <Card title="Classification">
        <p className="mb-3 text-xs text-[var(--color-text-muted)]">
          Run the otolith shape classifier on this specimen to get a predicted species with confidence and shape
          descriptors.
        </p>
        <button
          type="button"
          onClick={() => setTriggered(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-[var(--color-bg)] hover:opacity-90"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Classify specimen
        </button>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card title="Classification">
        <LoadingLines lines={4} />
      </Card>
    );
  }

  if (!prediction) return null;

  return (
    <Card title="Classification" action={<ProvenanceBadge result={result} />}>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold italic text-[var(--color-text)]">{prediction.predictedScientificName}</p>
          {speciesInfo && <p className="text-xs text-[var(--color-text-muted)]">{speciesInfo.commonName}</p>}
        </div>
        <ConfidenceMeter value={prediction.confidence} />
        <div>
          <p className="mb-1 text-xs font-medium text-[var(--color-text-muted)]">Alternatives</p>
          <ul className="space-y-1">
            {prediction.alternatives.slice(0, 2).map((alt) => (
              <li key={alt.speciesId} className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                <span className="italic">{alt.scientificName}</span>
                <span>{Math.round(alt.confidence * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-[var(--color-text-muted)]">Shape descriptors</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-[var(--color-panel-hover)] px-2 py-1.5">
              <p className="text-xs font-semibold text-[var(--color-text)]">
                {prediction.shapeDescriptors.circularity.toFixed(2)}
              </p>
              <p className="text-[10px] text-[var(--color-text-dim)]">Circularity</p>
            </div>
            <div className="rounded-lg bg-[var(--color-panel-hover)] px-2 py-1.5">
              <p className="text-xs font-semibold text-[var(--color-text)]">
                {prediction.shapeDescriptors.rectangularity.toFixed(2)}
              </p>
              <p className="text-[10px] text-[var(--color-text-dim)]">Rectangularity</p>
            </div>
            <div className="rounded-lg bg-[var(--color-panel-hover)] px-2 py-1.5">
              <p className="text-xs font-semibold text-[var(--color-text)]">
                {prediction.shapeDescriptors.aspectRatio.toFixed(2)}
              </p>
              <p className="text-[10px] text-[var(--color-text-dim)]">Aspect ratio</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
