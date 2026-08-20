import { useState } from 'react';
import { Microscope } from 'lucide-react';
import { listOtolithSpecimens } from '../../tools';
import { useToolCall } from '../../hooks/useToolCall';
import { useCurationStore } from '../../store/useCurationStore';
import { WorkspaceHeader } from '../../components/layout/WorkspaceHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { SpecimenGallery } from './SpecimenGallery';
import { ClassificationResult } from './ClassificationResult';
import { CuratorOverridePanel } from './CuratorOverridePanel';

// listOtolithSpecimens() takes no args -- pass a fixed empty-object args
// value through useToolCall's generic (args) signature.
const LIST_ARGS = {};

export function OtolithLabWorkspace() {
  const { data: specimens, loading } = useToolCall(listOtolithSpecimens, LIST_ARGS, []);
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<string | null>(null);
  const hasTask = useCurationStore((s) => s.tasks.some((t) => t.specimenId === selectedSpecimenId));

  const selectedSpecimen = specimens?.find((s) => s.specimenId === selectedSpecimenId) ?? null;

  return (
    <div className="flex h-full flex-col">
      <WorkspaceHeader
        title="Otolith Lab"
        description="AI-assisted otolith shape classification with curator human-in-the-loop review"
        action={<Microscope className="h-5 w-5 text-[var(--color-accent)]" />}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <SpecimenGallery
            specimens={specimens}
            loading={loading}
            selectedSpecimenId={selectedSpecimenId}
            onSelect={setSelectedSpecimenId}
          />
          <div className="space-y-4">
            {!selectedSpecimen ? (
              <EmptyState
                icon={Microscope}
                title="Select a specimen"
                description="Choose an otolith from the gallery to run classification and review results."
              />
            ) : (
              <>
                <ClassificationResult specimen={selectedSpecimen} />
                {hasTask && <CuratorOverridePanel specimenId={selectedSpecimen.specimenId} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
