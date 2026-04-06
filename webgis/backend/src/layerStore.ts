import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  type CandidateItem,
  type DashboardSummary,
  type Feature,
  type FeatureCollection,
  type LayerManifestItem,
  type LayerName,
  layerOrder,
} from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../data');
const layersDir = path.join(dataDir, 'layers');

let manifestCache: LayerManifestItem[] | null = null;
const layerCache = new Map<LayerName, FeatureCollection>();

async function readManifest(): Promise<LayerManifestItem[]> {
  if (manifestCache) {
    return manifestCache;
  }
  const manifestPath = path.join(dataDir, 'manifest.json');
  const raw = await readFile(manifestPath, 'utf-8');
  manifestCache = JSON.parse(raw) as LayerManifestItem[];
  return manifestCache;
}

export async function getManifest(): Promise<LayerManifestItem[]> {
  return readManifest();
}

export async function getLayer(layerName: LayerName): Promise<FeatureCollection> {
  const cached = layerCache.get(layerName);
  if (cached) {
    return cached;
  }

  const manifest = await readManifest();
  const entry = manifest.find((item) => item.layer_name === layerName);
  if (!entry) {
    throw new Error(`Layer not found: ${layerName}`);
  }

  const raw = await readFile(path.join(layersDir, entry.target_file), 'utf-8');
  const collection = JSON.parse(raw) as FeatureCollection;
  layerCache.set(layerName, collection);
  return collection;
}

export async function getAllLayers(): Promise<Record<LayerName, FeatureCollection>> {
  const entries = await Promise.all(
    layerOrder.map(async (layerName) => [layerName, await getLayer(layerName)] as const),
  );

  return Object.fromEntries(entries) as Record<LayerName, FeatureCollection>;
}

function updateBounds(coords: unknown, bounds: { minX: number; minY: number; maxX: number; maxY: number }): void {
  if (!Array.isArray(coords) || coords.length === 0) {
    return;
  }

  if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
    const [x, y] = coords as [number, number];
    bounds.minX = Math.min(bounds.minX, x);
    bounds.minY = Math.min(bounds.minY, y);
    bounds.maxX = Math.max(bounds.maxX, x);
    bounds.maxY = Math.max(bounds.maxY, y);
    return;
  }

  for (const item of coords) {
    updateBounds(item, bounds);
  }
}

function featureCenter(feature: Feature): { lat: number; lng: number } {
  const bounds = {
    minX: Number.POSITIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };
  updateBounds(feature.geometry.coordinates, bounds);

  return {
    lat: Number(((bounds.minY + bounds.maxY) / 2).toFixed(6)),
    lng: Number(((bounds.minX + bounds.maxX) / 2).toFixed(6)),
  };
}

function buildReasoning(feature: Feature): string {
  const p = feature.properties;
  return [
    `Total score ${p.total_score}`,
    `road score ${p.road_score}`,
    `flood score ${p.flood_score} (${p.flood_risk_class})`,
    `elevation score ${p.elevation_score}`,
    `land use ${p.landuse_class}`,
  ].join(' • ');
}

export async function getCandidates(top: 1 | 3 | 5): Promise<CandidateItem[]> {
  const layerName = `top${top}_kandidat` as LayerName;
  const layer = await getLayer(layerName);

  return layer.features.map((feature, index) => ({
    label: `Kandidat ${index + 1}`,
    fid: feature.properties.fid,
    gridId: feature.properties.grid_id,
    totalScore: feature.properties.total_score,
    roadScore: feature.properties.road_score,
    floodRiskClass: feature.properties.flood_risk_class,
    floodScore: feature.properties.flood_score,
    elevationMean: Number(feature.properties.elevation_mean.toFixed(2)),
    elevationScore: feature.properties.elevation_score,
    landuseClass: feature.properties.landuse_class,
    landuseScore: feature.properties.landuse_score,
    center: featureCenter(feature),
    reasoning: buildReasoning(feature),
  }));
}

export async function getSummary(): Promise<DashboardSummary> {
  const gridLayer = await getLayer('grid_scorefixxx22');
  const highlySuitable = await getLayer('highlysuitable');
  const top1 = await getCandidates(1);

  const classBreakdown = gridLayer.features.reduce<Record<string, number>>((acc, feature) => {
    const key = feature.properties.suitability_class;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const allScores = gridLayer.features
    .map((feature) => feature.properties.total_score)
    .filter((score): score is number => typeof score === 'number' && Number.isFinite(score));

  return {
    totalGrid: gridLayer.features.length,
    highlySuitableCount: highlySuitable.features.length,
    classBreakdown,
    maxScore: allScores.length ? Math.max(...allScores) : 0,
    minScore: allScores.length ? Math.min(...allScores) : 0,
    topLayers: {
      top5: 5,
      top3: 3,
      top1: 1,
    },
    top1Label: top1[0] ? `FID ${top1[0].fid}` : '-',
    availableLayers: [...layerOrder],
  };
}
