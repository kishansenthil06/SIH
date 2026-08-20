import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import clsx from 'clsx';
import { FileText, Loader2, UploadCloud } from 'lucide-react';
import Papa from 'papaparse';
import { Card } from '../../components/common/Card';
import { useIngestionStore } from '../../store/useIngestionStore';
import { CANONICAL_FIELDS } from '../../types/ingestion';
import type { ColumnMapping } from '../../types/ingestion';

type CanonicalField = (typeof CANONICAL_FIELDS)[number];

// Alias tokens matched (after normalization) against each CSV header to
// auto-guess a canonical target field. Kept intentionally loose -- this is a
// demo convenience, not a real schema-matching engine.
const FIELD_ALIASES: Record<CanonicalField, string[]> = {
  latitude: ['lat', 'latitude', 'y'],
  longitude: ['lon', 'long', 'lng', 'longitude', 'x'],
  date: ['date', 'surveydate', 'observationdate', 'obsdate', 'timestamp'],
  scientific_name: ['species', 'speciesname', 'scientificname', 'scientific_name', 'taxon', 'taxonname'],
  sst_c: ['sst', 'sstc', 'sst_c', 'seasurfacetemp', 'seasurfacetemperature', 'temperature', 'temp'],
  count: ['count', 'catchcount', 'catch_count', 'abundance', 'n'],
  gear_type: ['gear', 'geartype', 'gear_type', 'method', 'fishingmethod'],
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function guessTargetField(header: string): CanonicalField | null {
  const norm = normalize(header);
  for (const field of CANONICAL_FIELDS) {
    if (FIELD_ALIASES[field].some((alias) => normalize(alias) === norm)) return field;
  }
  return null;
}

function inferType(samples: string[]): ColumnMapping['inferredType'] {
  const nonEmpty = samples.map((s) => s.trim()).filter((s) => s !== '');
  if (nonEmpty.length === 0) return 'unknown';
  if (nonEmpty.every((s) => !Number.isNaN(Number(s)))) return 'number';
  if (nonEmpty.every((s) => !Number.isNaN(Date.parse(s)))) return 'date';
  return 'string';
}

function buildColumns(rows: Record<string, string>[], headers: string[]): ColumnMapping[] {
  return headers.map((header) => {
    const samples = rows.slice(0, 6).map((row) => (row[header] ?? '').trim());
    const nonEmptySamples = samples.filter((s) => s !== '');
    return {
      sourceColumn: header,
      targetField: guessTargetField(header),
      inferredType: inferType(samples),
      sampleValues: nonEmptySamples.slice(0, 3),
    };
  });
}

interface DropZoneProps {
  onLoaded: (rows: Record<string, string>[], fileName: string) => void;
}

// Drag/drop + file-pick + "load bundled sample" entry point for a new
// ingestion job. Parses the CSV with PapaParse, guesses a column mapping,
// and seeds the ingestion store -- ColumnMapper takes it from there.
export function DropZone({ onLoaded }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setJob = useIngestionStore((s) => s.setJob);

  function commitParsed(fileName: string, rows: Record<string, string>[], headers: string[]) {
    if (headers.length === 0) {
      setError('Could not detect any columns in this file.');
      return;
    }
    const columns = buildColumns(rows, headers);
    setJob({
      id: `job-${Date.now()}`,
      fileName,
      rowCount: rows.length,
      columns,
      issues: [],
      status: 'mapping',
      ingestedPoints: [],
    });
    onLoaded(rows, fileName);
  }

  function parseFile(file: File) {
    setError(null);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        commitParsed(file.name, results.data, results.meta.fields ?? []);
      },
      error: (err) => setError(err.message),
    });
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
    e.target.value = '';
  }

  async function handleLoadSample() {
    setError(null);
    setIsLoadingSample(true);
    try {
      const res = await fetch('/sample-messy-survey.csv');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const results = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
      commitParsed('sample-messy-survey.csv', results.data, results.meta.fields ?? []);
    } catch {
      setError('Failed to load the sample dataset.');
    } finally {
      setIsLoadingSample(false);
    }
  }

  return (
    <Card>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={clsx(
          'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors',
          isDragging ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]' : 'border-[var(--color-border)]'
        )}
      >
        <UploadCloud className="h-8 w-8 text-[var(--color-text-dim)]" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-medium text-[var(--color-text)]">Drag &amp; drop a CSV file here</p>
          <p className="mt-1 max-w-sm text-xs text-[var(--color-text-muted)]">
            Or pick a file from disk, or load the bundled messy sample dataset to try the flow instantly.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-panel-hover)] px-3 py-1.5 text-xs font-medium text-[var(--color-text)] hover:border-[var(--color-accent)]"
          >
            Choose CSV file
          </button>
          <button
            type="button"
            onClick={() => void handleLoadSample()}
            disabled={isLoadingSample}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-accent-strong)]/40 bg-[var(--color-accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoadingSample ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
            Load sample dataset
          </button>
        </div>
        <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
      </div>
      {error && <p className="mt-3 text-xs text-[var(--color-danger)]">{error}</p>}
    </Card>
  );
}
