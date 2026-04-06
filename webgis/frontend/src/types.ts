export const layerNames = [
  'grid_scorefixxx22',
  'highlysuitable',
  'rank_highlysuitable',
  'top5_kandidat',
  'top3_kandidat',
  'top1_kandidat',
] as const;

export type LayerName = (typeof layerNames)[number];

export interface LayerProperties {
  source_layer: string;
  fid: number;
  grid_id: number;
  total_score: number;
  suitability_class: string;
  road_score: number;
  flood_risk_class: string;
  flood_score: number;
  elevation_mean: number;
  elevation_score: number;
  landuse_class: string;
  landuse_score: number;
  rank?: number | null;
}

export interface Geometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: unknown;
}

export interface Feature {
  type: 'Feature';
  properties: LayerProperties;
  geometry: Geometry;
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

export interface SummaryResponse {
  totalGrid: number;
  highlySuitableCount: number;
  classBreakdown: Record<string, number>;
  maxScore: number;
  minScore: number;
  topLayers: {
    top5: number;
    top3: number;
    top1: number;
  };
  top1Label: string;
  availableLayers: LayerName[];
}

export interface CandidateItem {
  label: string;
  fid: number;
  gridId: number;
  totalScore: number;
  roadScore: number;
  floodRiskClass: string;
  floodScore: number;
  elevationMean: number;
  elevationScore: number;
  landuseClass: string;
  landuseScore: number;
  center: {
    lat: number;
    lng: number;
  };
  reasoning: string;
}

export type CandidateGroup = Record<1 | 3 | 5, CandidateItem[]>;
export type LayerState = Record<LayerName, boolean>;
