import { Dna } from 'lucide-react';
import { WorkspaceHeader } from '../../components/layout/WorkspaceHeader';
import { SampleMap } from './SampleMap';
import { AsvTable } from './AsvTable';
import { TaxonomyTree } from './TaxonomyTree';

export function EdnaLabWorkspace() {
  return (
    <div className="flex h-full flex-col">
      <WorkspaceHeader
        title="eDNA Lab"
        description="Environmental DNA amplicon sequence variants (ASVs) across monitoring stations"
        action={<Dna className="h-5 w-5 text-[var(--color-accent)]" />}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <SampleMap />
            <TaxonomyTree />
          </div>
          <div>
            <AsvTable />
          </div>
        </div>
      </div>
    </div>
  );
}
