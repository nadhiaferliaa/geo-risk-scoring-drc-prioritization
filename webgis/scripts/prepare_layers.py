from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Dict

import geopandas as gpd

INPUT_FILES: Dict[str, str] = {
    'grid_scorefixxx22': 'gridscore_fixxx2.shp',
    'highlysuitable': 'highlysuitable.shp',
    'rank_highlysuitable': 'rank_highlysuitable.shp',
    'top5_kandidat': 'top5_kandidat.geojson',
    'top3_kandidat': 'top3_kandidat.geojson',
    'top1_kandidat': 'top1_kandidat.geojson',
}

FIELD_MAP = {
    'fid': 'fid',
    'id': 'grid_id',
    'roadscore': 'road_score',
    'rbKELAS_RI': 'flood_risk_class',
    'rbfloodsco': 'flood_score',
    'elevelevme': 'elevation_mean',
    'elevelevsc': 'elevation_score',
    'lu_CLASS': 'landuse_class',
    'lu_landuse': 'landuse_score',
    'scoretotal': 'total_score',
    'CLASS2': 'suitability_class',
    'rank': 'rank',
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description='Convert final QGIS layers into standardized GeoJSON files for the WebGIS MVP.',
    )
    parser.add_argument(
        '--input-dir',
        required=True,
        help='Folder that contains gridscore_fixxx2.shp, highlysuitable.shp, rank_highlysuitable.shp, top1/3/5_kandidat.geojson.',
    )
    parser.add_argument(
        '--output-dir',
        default=None,
        help='Optional custom output directory. Defaults to backend/data/layers inside this project.',
    )
    return parser.parse_args()



def normalize_layer(layer_name: str, src_path: Path, dest_path: Path) -> dict:
    gdf = gpd.read_file(src_path)
    if gdf.crs is None:
        raise ValueError(f'{src_path.name} has no CRS. Please set CRS first in QGIS.')
    gdf = gdf.to_crs(4326)

    existing_cols = [col for col in FIELD_MAP if col in gdf.columns]
    normalized = gdf[existing_cols + ['geometry']].copy()
    normalized = normalized.rename(columns={col: FIELD_MAP[col] for col in existing_cols})
    normalized['source_layer'] = layer_name

    ordered = [
        'source_layer',
        'fid',
        'grid_id',
        'total_score',
        'suitability_class',
        'road_score',
        'flood_risk_class',
        'flood_score',
        'elevation_mean',
        'elevation_score',
        'landuse_class',
        'landuse_score',
        'rank',
        'geometry',
    ]
    keep = [col for col in ordered if col in normalized.columns]
    normalized = normalized[keep]

    normalized.to_file(dest_path, driver='GeoJSON')

    return {
        'layer_name': layer_name,
        'source_file': src_path.name,
        'target_file': dest_path.name,
        'feature_count': int(len(normalized)),
        'crs': 'EPSG:4326',
        'fields': [col for col in normalized.columns if col != 'geometry'],
    }



def main() -> None:
    args = parse_args()
    project_root = Path(__file__).resolve().parents[1]
    input_dir = Path(args.input_dir).resolve()
    output_dir = Path(args.output_dir).resolve() if args.output_dir else project_root / 'backend' / 'data' / 'layers'
    output_dir.mkdir(parents=True, exist_ok=True)

    manifest = []
    for layer_name, filename in INPUT_FILES.items():
        src_path = input_dir / filename
        if not src_path.exists():
            raise FileNotFoundError(f'Missing input file: {src_path}')
        dest_path = output_dir / f'{layer_name}.geojson'
        manifest.append(normalize_layer(layer_name, src_path, dest_path))

    manifest_path = output_dir.parent / 'manifest.json'
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    print(json.dumps({'status': 'ok', 'manifest_path': str(manifest_path), 'layers': manifest}, indent=2))


if __name__ == '__main__':
    main()
