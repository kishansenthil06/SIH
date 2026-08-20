import { useMemo } from 'react';
import { ScatterplotLayer } from '@deck.gl/layers';
import type { Layer } from '@deck.gl/core';
import { MapCanvas } from '../../components/map/MapCanvas';
import { MapLegend } from '../../components/map/MapLegend';
import { LayerToggleList, type LayerOption } from '../../components/map/LayerToggleList';
import { WorkspaceHeader } from '../../components/layout/WorkspaceHeader';
import { CellInspector, type CellInspectorData } from './CellInspector';
import { useMapStore, layerKeyToOceanVariable, type MapLayerKey } from '../../store/useMapStore';
import { useToolCall } from '../../hooks/useToolCall';
import { buildH3HexagonLayer } from '../../hooks/useH3Layer';
import { getOceanSnapshot, getSpeciesOccurrences, runSdm } from '../../tools';
import { rampWarm, rampCool, rampSuitability } from '../../app/theme/tokens';
import { SPECIES_CATALOG } from '../../mock-data/constants';
import { formatNumber } from '../../utils/format';
import type { H3CellValue } from '../../types/h3';
import type { ToolResult } from '../../tools/client';

const DEMO_DATES = ['2015-06-01', '2018-06-01', '2021-06-01', '2024-06-01'];

const LAYER_OPTIONS: LayerOption<MapLayerKey>[] = [
  { key: 'sst', label: 'Sea Surface Temp', swatch: 'rgb(248,113,113)' },
  { key: 'chl_a', label: 'Chlorophyll-a', swatch: 'rgb(34,211,238)' },
  { key: 'sdm_suitability', label: 'Habitat Suitability', swatch: 'rgb(163,230,53)' },
  { key: 'occurrences', label: 'Occurrences', swatch: 'rgb(129,140,248)' },
];

function rgbToCss([r, g, b]: [number, number, number]): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function MapExplorerWorkspace() {
  const activeLayer = useMapStore((s) => s.activeLayer);
  const selectedDate = useMapStore((s) => s.selectedDate);
  const selectedSpeciesId = useMapStore((s) => s.selectedSpeciesId);
  const selectedH3Cell = useMapStore((s) => s.selectedH3Cell);
  const setActiveLayer = useMapStore((s) => s.setActiveLayer);
  const setSelectedDate = useMapStore((s) => s.setSelectedDate);
  const setSelectedSpeciesId = useMapStore((s) => s.setSelectedSpeciesId);
  const setSelectedH3Cell = useMapStore((s) => s.setSelectedH3Cell);

  const oceanVariable = layerKeyToOceanVariable(activeLayer);

  const oceanSnapshot = useToolCall(
    getOceanSnapshot,
    oceanVariable ? { variable: oceanVariable, date: selectedDate } : null,
    [oceanVariable, selectedDate]
  );

  const sdmCall = useToolCall(
    runSdm,
    activeLayer === 'sdm_suitability' ? { speciesId: selectedSpeciesId, date: selectedDate } : null,
    [activeLayer, selectedSpeciesId, selectedDate]
  );

  const occurrencesCall = useToolCall(
    getSpeciesOccurrences,
    activeLayer === 'occurrences' ? { speciesId: selectedSpeciesId } : null,
    [activeLayer, selectedSpeciesId]
  );

  const sdmCells: H3CellValue<number>[] = useMemo(
    () => (sdmCall.data ?? []).map((d) => ({ h3Cell: d.h3Cell, value: d.suitability, lat: d.lat, lon: d.lon })),
    [sdmCall.data]
  );

  const layers: Layer[] = useMemo(() => {
    if (activeLayer === 'sst' || activeLayer === 'chl_a') {
      const ramp = activeLayer === 'sst' ? rampWarm : rampCool;
      const layer = buildH3HexagonLayer('ocean-snapshot', oceanSnapshot.data ?? [], ramp, {
        onClick: (d) => setSelectedH3Cell(d.h3Cell),
      });
      return layer ? [layer] : [];
    }
    if (activeLayer === 'sdm_suitability') {
      const layer = buildH3HexagonLayer('sdm-suitability', sdmCells, rampSuitability, {
        onClick: (d) => setSelectedH3Cell(d.h3Cell),
      });
      return layer ? [layer] : [];
    }
    if (activeLayer === 'occurrences') {
      const points = occurrencesCall.data ?? [];
      if (points.length === 0) return [];
      const counts = points.map((p) => p.count ?? 1);
      const maxCount = Math.max(...counts, 1);
      const scatter = new ScatterplotLayer({
        id: 'occurrence-points',
        data: points,
        pickable: true,
        getPosition: (d) => [d.lon, d.lat],
        getRadius: (d) => 1500 + ((d.count ?? 1) / maxCount) * 6000,
        radiusMinPixels: 3,
        radiusMaxPixels: 24,
        getFillColor: (d) => {
          const t = (d.count ?? 1) / maxCount;
          return [129, 140, 248, Math.round(120 + t * 135)];
        },
        onClick: (info) => {
          if (info.object) setSelectedH3Cell(info.object.h3Cell);
        },
      });
      return [scatter];
    }
    return [];
  }, [activeLayer, oceanSnapshot.data, sdmCells, occurrencesCall.data, setSelectedH3Cell]);

  const legend = useMemo(() => {
    if (activeLayer === 'sst') {
      const values = (oceanSnapshot.data ?? []).map((d) => d.value);
      const min = values.length ? Math.min(...values) : null;
      const max = values.length ? Math.max(...values) : null;
      return {
        title: 'Sea Surface Temperature (°C)',
        min: min === null ? '--' : formatNumber(min, 1),
        max: max === null ? '--' : formatNumber(max, 1),
        colors: rampWarm.map(rgbToCss),
      };
    }
    if (activeLayer === 'chl_a') {
      const values = (oceanSnapshot.data ?? []).map((d) => d.value);
      const min = values.length ? Math.min(...values) : null;
      const max = values.length ? Math.max(...values) : null;
      return {
        title: 'Chlorophyll-a (mg/m³)',
        min: min === null ? '--' : formatNumber(min, 2),
        max: max === null ? '--' : formatNumber(max, 2),
        colors: rampCool.map(rgbToCss),
      };
    }
    if (activeLayer === 'sdm_suitability') {
      return {
        title: 'Habitat Suitability',
        min: '0',
        max: '1',
        colors: rampSuitability.map(rgbToCss),
      };
    }
    return {
      title: 'Occurrence Density',
      min: 'low',
      max: 'high',
      colors: ['rgba(129,140,248,0.35)', 'rgb(129,140,248)'],
    };
  }, [activeLayer, oceanSnapshot.data]);

  const activeResult: ToolResult<unknown> | null =
    activeLayer === 'sst' || activeLayer === 'chl_a'
      ? oceanSnapshot.result
      : activeLayer === 'sdm_suitability'
        ? sdmCall.result
        : occurrencesCall.result;

  const inspectorCell: CellInspectorData | null = useMemo(() => {
    if (!selectedH3Cell) return null;
    if (activeLayer === 'sst' || activeLayer === 'chl_a') {
      const match = (oceanSnapshot.data ?? []).find((d) => d.h3Cell === selectedH3Cell);
      if (!match) return null;
      return {
        h3Cell: match.h3Cell,
        lat: match.lat,
        lon: match.lon,
        value: match.value,
        valueLabel: activeLayer === 'sst' ? 'Sea Surface Temp' : 'Chlorophyll-a',
        valueUnit: activeLayer === 'sst' ? '°C' : 'mg/m³',
      };
    }
    if (activeLayer === 'sdm_suitability') {
      const match = sdmCells.find((d) => d.h3Cell === selectedH3Cell);
      if (!match) return null;
      return { h3Cell: match.h3Cell, lat: match.lat, lon: match.lon, value: match.value, valueLabel: 'Suitability' };
    }
    const match = (occurrencesCall.data ?? []).find((d) => d.h3Cell === selectedH3Cell);
    if (!match) return null;
    return {
      h3Cell: match.h3Cell,
      lat: match.lat,
      lon: match.lon,
      value: match.count ?? 1,
      valueLabel: 'Occurrence Count',
    };
  }, [selectedH3Cell, activeLayer, oceanSnapshot.data, sdmCells, occurrencesCall.data]);

  const speciesDependent = activeLayer === 'sdm_suitability' || activeLayer === 'occurrences';

  return (
    <div className="flex h-full flex-col">
      <WorkspaceHeader
        title="Map Explorer"
        description="Oceanographic layers, habitat suitability, and occurrence records across the Kerala coast."
        action={
          <div className="flex items-center gap-3">
            {speciesDependent && (
              <select
                value={selectedSpeciesId}
                onChange={(e) => setSelectedSpeciesId(e.target.value)}
                className="rounded-md border border-[var(--color-border-strong)] bg-[var(--color-panel)] px-2 py-1 text-xs text-[var(--color-text)]"
              >
                {SPECIES_CATALOG.map((s) => (
                  <option key={s.speciesId} value={s.speciesId}>
                    {s.commonName}
                  </option>
                ))}
              </select>
            )}
            <div className="flex items-center gap-1 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-panel)] p-1">
              {DEMO_DATES.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`rounded px-2 py-1 text-xs transition-colors ${
                    selectedDate === date
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-panel-hover)]'
                  }`}
                >
                  {date.slice(0, 7)}
                </button>
              ))}
            </div>
          </div>
        }
      />
      <div className="relative flex-1 p-4">
        <MapCanvas layers={layers} height="100%">
          <LayerToggleList options={LAYER_OPTIONS} active={activeLayer} onChange={setActiveLayer} />
          <MapLegend title={legend.title} min={legend.min} max={legend.max} colors={legend.colors} />
          {inspectorCell && (
            <CellInspector cell={inspectorCell} result={activeResult} onClose={() => setSelectedH3Cell(null)} />
          )}
        </MapCanvas>
      </div>
    </div>
  );
}
