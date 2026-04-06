<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import L from 'leaflet';

import type { Feature, FeatureCollection, LayerName, LayerState } from '../types';

const props = defineProps<{
  layers: Partial<Record<LayerName, FeatureCollection>>;
  visibility: LayerState;
  selectedCandidateFid: number | null;
}>();

const emit = defineEmits<{
  featureClick: [fid: number];
}>();

const mapEl = ref<HTMLDivElement | null>(null);
let map: L.Map | null = null;
const dynamicLayers = new Map<LayerName, L.GeoJSON>();

const layerLabels: Record<LayerName, string> = {
  grid_scorefixxx22: 'Grid score final',
  highlysuitable: 'Highly suitable',
  rank_highlysuitable: 'Rank highly suitable',
  top5_kandidat: 'Top 5 kandidat',
  top3_kandidat: 'Top 3 kandidat',
  top1_kandidat: 'Top 1 kandidat',
};

function colorBySuitability(suitabilityClass: string): string {
  if (suitabilityClass === 'Highly Suitable') return '#166534';
  if (suitabilityClass === 'Suitable') return '#65a30d';
  if (suitabilityClass === 'Moderately Suitable') return '#f59e0b';
  return '#dc2626';
}


function displayValue(value: number | string | null | undefined, digits = 2): string {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'number') return Number.isFinite(value) ? value.toFixed(digits).replace(/\.00$/, '') : '-';
  return String(value);
}

function popupHtml(feature: Feature, layerName: LayerName): string {
  const p = feature.properties;
  return `
    <div style="font-family: Inter, Arial, sans-serif; min-width: 220px;">
      <strong>${layerLabels[layerName]}</strong>
      <div style="margin-top: 8px; line-height: 1.45;">
        <div><b>FID:</b> ${displayValue(p.fid, 0)}</div>
        <div><b>Grid ID:</b> ${displayValue(p.grid_id, 0)}</div>
        <div><b>Total Score:</b> ${displayValue(p.total_score)}</div>
        <div><b>Class:</b> ${displayValue(p.suitability_class)}</div>
        <div><b>Road Score:</b> ${displayValue(p.road_score)}</div>
        <div><b>Flood Risk:</b> ${displayValue(p.flood_risk_class)}</div>
        <div><b>Flood Score:</b> ${displayValue(p.flood_score)}</div>
        <div><b>Elevation Mean:</b> ${displayValue(p.elevation_mean)}</div>
        <div><b>Elevation Score:</b> ${displayValue(p.elevation_score)}</div>
        <div><b>Land Use:</b> ${displayValue(p.landuse_class)}</div>
      </div>
    </div>
  `;
}

function featureStyle(layerName: LayerName, feature?: Feature): L.PathOptions {
  const fid = feature?.properties.fid ?? -1;
  const isSelected = props.selectedCandidateFid === fid;

  switch (layerName) {
    case 'grid_scorefixxx22':
      return {
        color: '#e5e7eb',
        weight: 0.8,
        fillColor: colorBySuitability(feature?.properties.suitability_class ?? ''),
        fillOpacity: 0.45,
      };
    case 'highlysuitable':
      return {
        color: '#15803d',
        weight: 1.2,
        fillColor: '#22c55e',
        fillOpacity: 0.18,
      };
    case 'rank_highlysuitable':
      return {
        color: '#0f766e',
        weight: 1.2,
        dashArray: '4 4',
        fillColor: '#14b8a6',
        fillOpacity: 0.08,
      };
    case 'top5_kandidat':
      return {
        color: isSelected ? '#7c2d12' : '#b45309',
        weight: isSelected ? 3.5 : 2.4,
        fillColor: '#f59e0b',
        fillOpacity: isSelected ? 0.68 : 0.45,
      };
    case 'top3_kandidat':
      return {
        color: isSelected ? '#7f1d1d' : '#991b1b',
        weight: isSelected ? 3.8 : 2.8,
        fillColor: '#ef4444',
        fillOpacity: isSelected ? 0.7 : 0.42,
      };
    case 'top1_kandidat':
      return {
        color: '#4c1d95',
        weight: isSelected ? 4.2 : 3.2,
        fillColor: '#8b5cf6',
        fillOpacity: isSelected ? 0.82 : 0.6,
      };
  }
}

function clearLayers(): void {
  dynamicLayers.forEach((layer) => {
    map?.removeLayer(layer);
  });
  dynamicLayers.clear();
}

function renderLayers(): void {
  if (!map) return;
  const leafletMap = map;
  clearLayers();

  (Object.keys(props.layers) as LayerName[]).forEach((layerName) => {
    const layerData = props.layers[layerName];
    if (!layerData || !props.visibility[layerName]) return;

    const geoJsonLayer = L.geoJSON(layerData as never, {
      style: (feature) => featureStyle(layerName, feature as Feature),
      onEachFeature: (feature, layer) => {
        const typedFeature = feature as Feature;
        layer.bindPopup(popupHtml(typedFeature, layerName));
        layer.on('click', () => {
          emit('featureClick', typedFeature.properties.fid);
        });
      },
    });

    geoJsonLayer.addTo(leafletMap);
    dynamicLayers.set(layerName, geoJsonLayer);
  });

  if (props.selectedCandidateFid !== null) {
    focusOnFeature(props.selectedCandidateFid);
    return;
  }

  const baseLayer = dynamicLayers.get('grid_scorefixxx22');
  if (baseLayer) {
    map.fitBounds(baseLayer.getBounds(), { padding: [24, 24] });
  }
}

function focusOnFeature(fid: number): void {
  if (!map) return;

  for (const layer of dynamicLayers.values()) {
    let targetBounds: L.LatLngBounds | null = null;

    layer.eachLayer((leafletLayer) => {
      const candidateFeature = (leafletLayer as L.GeoJSON).feature as Feature | undefined;
      if (candidateFeature?.properties.fid === fid && 'getBounds' in leafletLayer) {
        targetBounds = (leafletLayer as L.Polygon).getBounds();
      }
    });

    if (targetBounds) {
      map.fitBounds(targetBounds, { padding: [40, 40], maxZoom: 14 });
      break;
    }
  }
}

onMounted(() => {
  if (!mapEl.value) return;

  map = L.map(mapEl.value, {
    zoomControl: true,
    preferCanvas: true,
  }).setView([-6.28, 107.09], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  renderLayers();
});

watch(
  () => [props.layers, props.visibility, props.selectedCandidateFid],
  () => {
    renderLayers();
  },
  { deep: true },
);

onUnmounted(() => {
  clearLayers();
  map?.remove();
  map = null;
});
</script>

<template>
  <div class="map-shell">
    <div ref="mapEl" class="map-canvas"></div>

    <div class="map-legend">
      <h4>Legenda</h4>
      <div class="legend-item"><span class="legend-swatch grid-high"></span> Highly Suitable</div>
      <div class="legend-item"><span class="legend-swatch grid-good"></span> Suitable</div>
      <div class="legend-item"><span class="legend-swatch grid-medium"></span> Moderately Suitable</div>
      <div class="legend-item"><span class="legend-swatch grid-low"></span> Not Suitable</div>
      <div class="legend-item"><span class="legend-swatch legend-top5"></span> Top 5 kandidat</div>
      <div class="legend-item"><span class="legend-swatch legend-top3"></span> Top 3 kandidat</div>
      <div class="legend-item"><span class="legend-swatch legend-top1"></span> Top 1 kandidat</div>
    </div>
  </div>
</template>
