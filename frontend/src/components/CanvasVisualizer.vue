<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import type { SortStep } from '../types';

const props = defineProps<{
  step: SortStep | null;
  defaultArray: number[];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const BAR_GAP = 2;

const array = computed(() => props.step?.array ?? props.defaultArray);

function draw() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const arr = array.value;
  const n = arr.length;
  const maxVal = Math.max(...arr, 1);
  const barW = (w - BAR_GAP * (n - 1)) / n;

  // 索引集合
  const comparedSet = new Set(props.step?.compared ?? []);
  const swappedSet = new Set(props.step?.swapped ?? []);
  const sortedSet = new Set(props.step?.sorted ?? []);
  const allSorted = props.step && arr.every((_, i) => sortedSet.has(i));

  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < n; i++) {
    const val = arr[i];
    const barH = (val / maxVal) * (h - 4);
    const x = i * (barW + BAR_GAP);
    const y = h - barH;

    // 颜色
    let color = '#6366f1'; // indigo-500
    if (allSorted || sortedSet.has(i)) color = '#10b981'; // emerald-500
    if (swappedSet.has(i)) color = '#f43f5e'; // rose-500
    if (comparedSet.has(i) && !swappedSet.has(i)) color = '#fbbf24'; // amber-400

    ctx.fillStyle = color;
    ctx.beginPath();
    // 圆角矩形
    const r = Math.min(4, barW / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + barW - r, y);
    ctx.arcTo(x + barW, y, x + barW, y + r, r);
    ctx.lineTo(x + barW, y + barH);
    ctx.lineTo(x, y + barH);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.fill();
  }
}

onMounted(() => draw());
watch(() => [props.step, props.defaultArray], () => draw(), { deep: true });

// 响应窗口缩放
if (typeof window !== 'undefined') {
  window.addEventListener('resize', draw);
}
</script>

<template>
  <canvas
    ref="canvasRef"
    class="w-full h-80 rounded-lg bg-slate-900/50 border border-slate-800"
  />
</template>
