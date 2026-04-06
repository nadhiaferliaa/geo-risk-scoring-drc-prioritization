import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import { getCandidates, getLayer, getManifest, getSummary } from './layerStore.js';
import { layerOrder, type LayerName } from './types.js';

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'barras-webgis-backend' });
});

app.get('/api/manifest', async (_req, res, next) => {
  try {
    const manifest = await getManifest();
    res.json({ layers: manifest });
  } catch (error) {
    next(error);
  }
});

app.get('/api/summary', async (_req, res, next) => {
  try {
    const summary = await getSummary();
    res.json(summary);
  } catch (error) {
    next(error);
  }
});

app.get('/api/layers', async (_req, res, next) => {
  try {
    const manifest = await getManifest();
    res.json({
      layerNames: layerOrder,
      manifest,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/layers/:layerName', async (req, res, next) => {
  try {
    const layerName = req.params.layerName as LayerName;
    if (!layerOrder.includes(layerName)) {
      res.status(404).json({ message: `Layer ${req.params.layerName} tidak ditemukan.` });
      return;
    }
    const layer = await getLayer(layerName);
    res.json(layer);
  } catch (error) {
    next(error);
  }
});

app.get('/api/candidates', async (req, res, next) => {
  try {
    const requestedTop = Number(req.query.top ?? 5);
    const top = requestedTop === 1 || requestedTop === 3 || requestedTop === 5 ? requestedTop : 5;
    const candidates = await getCandidates(top);
    res.json({ top, candidates });
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : 'Terjadi kesalahan pada server.';
  res.status(500).json({ message });
});

app.listen(port, () => {
  console.log(`WEBGIS DRC backend berjalan di http://localhost:${port}`);
});
