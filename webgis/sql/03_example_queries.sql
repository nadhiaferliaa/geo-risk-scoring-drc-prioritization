-- Contoh query yang bisa dipakai setelah layer sudah diimport ke PostGIS
SELECT suitability_class, COUNT(*)
FROM grid_scorefixxx22
GROUP BY suitability_class
ORDER BY COUNT(*) DESC;

SELECT fid, grid_id, total_score, road_score, flood_score, elevation_score, landuse_class
FROM top5_kandidat
ORDER BY total_score DESC, elevation_mean ASC;
