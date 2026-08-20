import { Card } from '../../components/common/Card';

export interface ReportSection {
  key: string;
  label: string;
}

export const REPORT_SECTIONS: ReportSection[] = [
  { key: 'executive-summary', label: 'Executive Summary' },
  { key: 'species-trend', label: 'Species Trend' },
  { key: 'correlation-evidence', label: 'Correlation Evidence' },
  { key: 'map-snapshot', label: 'Map Snapshot' },
  { key: 'citations', label: 'Citations' },
  { key: 'methodology', label: 'Methodology / Provenance Appendix' },
];

interface SectionPickerProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

// Checkbox list of report sections. Selection state is lifted into
// ReportBuilderWorkspace so both the live preview and (indirectly, via
// ReportPrintView reading the same source data) the print route can honor it.
export function SectionPicker({ selected, onChange }: SectionPickerProps) {
  function toggle(key: string) {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key));
    } else {
      onChange([...selected, key]);
    }
  }

  return (
    <Card title="Sections">
      <ul className="space-y-2">
        {REPORT_SECTIONS.map((section) => (
          <li key={section.key}>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text)]">
              <input
                type="checkbox"
                checked={selected.includes(section.key)}
                onChange={() => toggle(section.key)}
                className="h-3.5 w-3.5 rounded border-[var(--color-border-strong)] accent-[var(--color-accent)]"
              />
              {section.label}
            </label>
          </li>
        ))}
      </ul>
    </Card>
  );
}
