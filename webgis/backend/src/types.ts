export const layerOrder = [
  'grid_scorefixxx22',
  'highlysuitable',
  'rank_highlysuitable',
  'top5_kandidat',
  'top3_kandidat',
  'top1_kandidat',
] as const;

export type LayerName = (typeof layerOrder)[number];

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

export type Position = [number, number];
export type PolygonCoordinates = Position[][];
export type MultiPolygonCoordinates = Position[][][];

export interface PolygonGeometry {
  type: 'Polygon';
  coordinates: PolygonCoordinates;
}

export interface MultiPolygonGeometry {
  type: 'MultiPolygon';
  coordinates: MultiPolygonCoordinates;
}

export type Geometry = PolygonGeometry | MultiPolygonGeometry;

export interface Feature {
  type: 'Feature';
  properties: LayerProperties;
  geometry: Geometry;
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

export interface LayerManifestItem {
  layer_name: LayerName;
  source_file: string;
  target_file: string;
  feature_count: number;
  crs: string;
  fields: string[];
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

export interface DashboardSummary {
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
