import { Microscope } from 'lucide-react';
import type { OtolithSpecimen } from '../../types/otolith';
import { Tag } from '../../components/common/Tag';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/format';

const STATUS_TONE: Record<OtolithSpecimen['status'], 'neutral' | 'accent' | 'success'> = {
  unclassified: 'neutral',
  classified: 'accent',
  curated: 'success',
};

interface SpecimenGalleryProps {
  specimens: OtolithSpecimen[] | null;
  loading: boolean;
  selectedSpecimenId: string | null;
  onSelect: (specimenId: string) => void;
}

// Responsive grid of specimen "thumbnails" -- there are no real otolith
// photos in this mock dataset, so imageColor stands in as a colored swatch.
export function SpecimenGallery({ specimens, loading, selectedSpecimenId, onSelect }: SpecimenGalleryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (!specimens || specimens.length === 0) {
    return <EmptyState icon={Microscope} title="No specimens found" description="No otolith specimens are available in this dataset." />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {specimens.map((specimen) => {
        const isSelected = specimen.specimenId === selectedSpecimenId;
        return (
          <button
            key={specimen.specimenId}
            type="button"
            onClick={() => onSelect(specimen.specimenId)}
            className={`flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-colors ${
              isSelected
                ? 'border-[var(--color-accent-strong)] bg-[var(--color-accent-soft)]'
                : 'border-[var(--color-border)] bg-[var(--color-panel)] hover:bg-[var(--color-panel-hover)]'
            }`}
          >
            <div className="h-16 w-16 flex-shrink-0 rounded-lg border border-[var(--color-border)]" style={{ background: specimen.imageColor }} />
            <div className="w-full">
              <p className="truncate text-xs font-medium text-[var(--color-text)]">{specimen.specimenId}</p>
              <p className="truncate text-[10px] text-[var(--color-text-muted)]">{specimen.stationName}</p>
              <p className="text-[10px] text-[var(--color-text-dim)]">
                {specimen.lengthMm.toFixed(1)} mm · {formatDate(specimen.collectedAt)}
              </p>
            </div>
            <Tag tone={STATUS_TONE[specimen.status]}>{specimen.status}</Tag>
          </button>
        );
      })}
    </div>
  );
}
