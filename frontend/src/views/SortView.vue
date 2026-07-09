<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { fetchAlgorithms, runSort } from '../api';
import { useUserActions } from '../composables/useUserActions';

const { favorited, toggleFavorite, recordHistory } = useUserActions('Sorting');
import { useAnimation } from '../composables/useAnimation';
import { CLIENT_SORTERS } from '../algorithms';
import CanvasVisualizer from '../components/CanvasVisualizer.vue';
import ControlsPanel from '../components/ControlsPanel.vue';
import AlgorithmTabs from '../components/AlgorithmTabs.vue';
import type { AlgorithmMeta } from '../types';

const DEFAULT_ALGOS: AlgorithmMeta[] = [
  { id: 'bubble', name: '冒泡排序', timeComplexity: 'O(n²)', spaceComplexity: 'O(1)', stable: true },
  { id: 'selection', name: '选择排序', timeComplexity: 'O(n²)', spaceComplexity: 'O(1)', stable: false },
  { id: 'insertion', name: '插入排序', timeComplexity: 'O(n²)', spaceComplexity: 'O(1)', stable: true },
  { id: 'quick', name: '快速排序', timeComplexity: 'O(n log n)', spaceComplexity: 'O(log n)', stable: false },
  { id: 'merge', name: '归并排序', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)', stable: true },
];

const algorithms = ref<AlgorithmMeta[]>([]);
const selectedAlgo = ref<string | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

function generateArray() {
  return Array.from({ length: 30 }, () => Math.floor(Math.random() * 400) + 10);
}

const currentArray = ref(generateArray());
const anim = useAnimation();

const currentMeta = computed(() =>
  algorithms.value.find((a) => a.id === selectedAlgo.value),
);

function newArray() {
  currentArray.value = generateArray();
  anim.reset();
}

async function handleStart() {
  if (!selectedAlgo.value) return;
  error.value = null;

  if (anim.state.value === 'idle' || anim.state.value === 'done') {
    if (anim.state.value === 'done') {
      anim.reset();
      currentArray.value = generateArray();
    }
    loading.value = true;
    try {
      // 先尝试后端 API
      const res = await runSort(selectedAlgo.value, { array: [...currentArray.value] });
      anim.loadSteps(res.steps);
    } catch {
      // 后端不可用，使用客户端算法
      const fn = CLIENT_SORTERS[selectedAlgo.value];
      if (fn) {
        const steps = fn([...currentArray.value]);
        anim.loadSteps(steps);
      } else {
        error.value = '算法不可用';
      }
    } finally {
      loading.value = false;
      recordHistory(selectedAlgo.value + '排序');
    }
    anim.play();
  } else if (anim.state.value === 'paused') {
    anim.play();
  }
}

onMounted(async () => {
  try {
    algorithms.value = await fetchAlgorithms();
  } catch {
    // 后端不可用，使用默认算法列表
    algorithms.value = DEFAULT_ALGOS;
  }
  if (algorithms.value.length > 0) selectedAlgo.value = algorithms.value[0].id;
});
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-bold text-white">排序算法可视化</h2>
          <button @click="toggleFavorite" class="text-lg transition-colors" :class="favorited?'text-yellow-400':'text-slate-600 hover:text-yellow-400'" :title="favorited?'取消收藏':'收藏'">{{ favorited?'★':'☆' }}</button>
        </div>
        <p class="text-xs text-slate-500">Canvas 柱状图动画 · 5 种经典排序算法</p>
      </div>
      <div class="flex flex-col items-end gap-2">
        <AlgorithmTabs
          :algorithms="algorithms"
          :current="selectedAlgo"
          :disabled="anim.state.value === 'running' || loading"
          @select="selectedAlgo = $event"
        />
        <div v-if="currentMeta" class="flex gap-3 text-xs text-slate-500">
          <span>时间 {{ currentMeta.timeComplexity }}</span>
          <span>空间 {{ currentMeta.spaceComplexity }}</span>
          <span>{{ currentMeta.stable ? '✓ 稳定' : '✗ 不稳定' }}</span>
        </div>
      </div>
    </div>

    <div v-if="error" class="bg-rose-900/30 border border-rose-700 text-rose-300 rounded-lg px-4 py-3 text-sm">
      {{ error }}
    </div>

    <div v-if="anim.state.value !== 'idle'" class="flex justify-center gap-6 text-sm">
      <div class="flex items-center gap-2">
        <span class="text-slate-500">比较</span>
        <span class="font-mono text-amber-400 font-semibold tabular-nums">{{ anim.comparisons.value }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-slate-500">交换</span>
        <span class="font-mono text-rose-400 font-semibold tabular-nums">{{ anim.swaps.value }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-slate-500">步骤</span>
        <span class="font-mono text-slate-400 tabular-nums">{{ anim.currentIndex.value + 1 }} / {{ anim.totalSteps() }}</span>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="flex items-center gap-2 text-slate-400">
        <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        算法引擎计算中...
      </div>
    </div>

    <CanvasVisualizer v-if="!loading" :step="anim.currentStep()" :default-array="currentArray"/>

    <ControlsPanel
      :state="anim.state.value"
      :speed="anim.speed.value"
      :progress="anim.progress()"
      :total-steps="anim.totalSteps()"
      @play="handleStart"
      @pause="anim.pause"
      @reset="anim.reset"
      @generate="newArray"
      @update:speed="anim.setSpeed"
      @seek="anim.seekTo"
    />
  </div>
</template>
