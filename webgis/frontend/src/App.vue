<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';

import { getCandidates, getLayer, getSummary } from './api';
import WebMap from './components/WebMap.vue';
import type {
  CandidateGroup,
  FeatureCollection,
  LayerName,
  LayerState,
  SummaryResponse,
} from './types';

const summary = ref<SummaryResponse | null>(null);
const loading = ref(true);
const errorMessage = ref('');
const selectedTop = ref<1 | 3 | 5>(5);
const selectedCandidateFid = ref<number | null>(null);

const layers = reactive<Partial<Record<LayerName, FeatureCollection>>>({});
const candidates = reactive<CandidateGroup>({
  1: [],
  3: [],
  5: [],
});

const visibility = reactive<LayerState>({
  grid_scorefixxx22: true,
  highlysuitable: true,
  rank_highlysuitable: false,
  top5_kandidat: true,
  top3_kandidat: false,
  top1_kandidat: false,
});

const layerLabels: Record<LayerName, { title: string; desc: string }> = {
  grid_scorefixxx22: {
    title: 'Grid score final',
    desc: 'Seluruh grid dengan total score hasil overlay.',
  },
  highlysuitable: {
    title: 'Highly suitable',
    desc: 'Subset grid yang masuk kelas highly suitable.',
  },
  rank_highlysuitable: {
    title: 'Rank highly suitable',
    desc: 'Layer pendukung ranking untuk subset highly suitable.',
  },
  top5_kandidat: {
    title: 'Top 5 kandidat',
    desc: 'Lima kandidat final untuk shortlist.',
  },
  top3_kandidat: {
    title: 'Top 3 kandidat',
    desc: 'Tiga kandidat prioritas untuk presentasi.',
  },
  top1_kandidat: {
    title: 'Top 1 kandidat',
    desc: 'Satu kandidat utama untuk rekomendasi inti.',
  },
};

const suitabilityCards = computed(() => {
  if (!summary.value) return [];
  return [
    { label: 'Total grid', value: summary.value.totalGrid },
    { label: 'Highly suitable', value: summary.value.highlySuitableCount },
    { label: 'Score max', value: summary.value.maxScore },
    { label: 'Top 1 FID', value: summary.value.top1Label },
  ];
});

const currentCandidates = computed(() => candidates[selectedTop.value]);

function activateTop(top: 1 | 3 | 5): void {
  selectedTop.value = top;
  visibility[`top${top}_kandidat` as LayerName] = true;
  selectedCandidateFid.value = candidates[top][0]?.fid ?? null;
}

async function loadDashboard(): Promise<void> {
  loading.value = true;
  errorMessage.value = '';

  try {
    const layerNames: LayerName[] = [
      'grid_scorefixxx22',
      'highlysuitable',
      'rank_highlysuitable',
      'top5_kandidat',
      'top3_kandidat',
      'top1_kandidat',
    ];

    const [summaryResponse, layerResults, top1, top3, top5] = await Promise.all([
      getSummary(),
      Promise.all(layerNames.map(async (layerName) => [layerName, await getLayer(layerName)] as const)),
      getCandidates(1),
      getCandidates(3),
      getCandidates(5),
    ]);

    summary.value = summaryResponse;
    for (const [layerName, layerData] of layerResults) {
      layers[layerName] = layerData;
    }

    candidates[1] = top1;
    candidates[3] = top3;
    candidates[5] = top5;
    selectedCandidateFid.value = top5[0]?.fid ?? null;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal memuat dashboard.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadDashboard();
});
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand-block">
        <h1>DRC Candidate WebGIS</h1>
        <p>
          Pembangunan Distribution Center (DRC) di Kabupaten Bekasi penting untuk mendukung distribusi
          logistik yang lebih efisien, mempercepat jangkauan layanan ke kawasan permukiman dan pusat
          aktivitas, serta membantu pemilihan lokasi yang lebih tepat berdasarkan hasil analisis spasial.
          Melalui WebGIS ini, proses identifikasi lokasi potensial dapat ditampilkan secara lebih
          interaktif, terstruktur, dan mudah dipahami melalui layer grid hasil scoring, highly suitable,
          serta shortlist kandidat prioritas.
        </p>
      </div>

      <section class="panel" v-if="summary">
        <h2>Ringkasan cepat</h2>
        <div class="summary-grid">
          <article v-for="card in suitabilityCards" :key="card.label" class="stat-card">
            <span>{{ card.label }}</span>
            <strong>{{ card.value }}</strong>
          </article>
        </div>

        <div class="breakdown">
          <div class="breakdown-row" v-for="(count, label) in summary.classBreakdown" :key="label">
            <span>{{ label }}</span>
            <strong>{{ count }}</strong>
          </div>
        </div>
      </section>

      <section class="panel">
        <h2>Layer aktif</h2>
        <label v-for="(config, layerName) in layerLabels" :key="layerName" class="layer-item">
          <input v-model="visibility[layerName as LayerName]" type="checkbox" />
          <div>
            <strong>{{ config.title }}</strong>
            <small>{{ config.desc }}</small>
          </div>
        </label>
      </section>

      <section class="panel">
        <div class="panel-title-row">
          <h2>Shortlist kandidat</h2>
          <div class="button-group">
            <button :class="{ active: selectedTop === 5 }" @click="activateTop(5)">Top 5</button>
            <button :class="{ active: selectedTop === 3 }" @click="activateTop(3)">Top 3</button>
            <button :class="{ active: selectedTop === 1 }" @click="activateTop(1)">Top 1</button>
          </div>
        </div>

        <div class="candidate-list">
          <article
            v-for="candidate in currentCandidates"
            :key="candidate.fid"
            class="candidate-card"
            :class="{ selected: selectedCandidateFid === candidate.fid }"
            @click="selectedCandidateFid = candidate.fid"
          >
            <div class="candidate-top-row">
              <strong>{{ candidate.label }}</strong>
              <span class="score-badge">{{ candidate.totalScore }}</span>
            </div>
            <div class="candidate-meta">FID {{ candidate.fid }} · Grid {{ candidate.gridId }}</div>
            <p>{{ candidate.reasoning }}</p>
            <small>
              {{ candidate.center.lat.toFixed(4) }}, {{ candidate.center.lng.toFixed(4) }}
            </small>
          </article>
        </div>
      </section>

      <section class="panel note-panel">
        <h2>Catatan presentasi</h2>
        <ul>
          <li>Tampilkan layer grid final sebagai bukti basis analisis.</li>
          <li>Nyalakan highly suitable untuk menunjukkan hasil screening awal.</li>
          <li>Pindah ke top 5 → top 3 → top 1 untuk menunjukkan proses narrowing candidate.</li>
        </ul>
      </section>
    </aside>

    <main class="content">
      <div v-if="loading" class="state-box">Memuat WebGIS...</div>
      <div v-else-if="errorMessage" class="state-box error">{{ errorMessage }}</div>
      <WebMap
        v-else
        :layers="layers"
        :visibility="visibility"
        :selected-candidate-fid="selectedCandidateFid"
        @feature-click="selectedCandidateFid = $event"
      />
    </main>
  </div>
</template>
