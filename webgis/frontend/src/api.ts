import type { CandidateItem, FeatureCollection, LayerName, SummaryResponse } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export function getSummary(): Promise<SummaryResponse> {
  return request<SummaryResponse>('/summary');
}

export function getLayer(layerName: LayerName): Promise<FeatureCollection> {
  return request<FeatureCollection>(`/layers/${layerName}`);
}

export async function getCandidates(top: 1 | 3 | 5): Promise<CandidateItem[]> {
  const response = await request<{ top: 1 | 3 | 5; candidates: CandidateItem[] }>(`/candidates?top=${top}`);
  return response.candidates;
}
