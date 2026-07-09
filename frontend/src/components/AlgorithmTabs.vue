<script setup lang="ts">
import type { AlgorithmMeta } from '../types';

defineProps<{
  algorithms: AlgorithmMeta[];
  current: string | null;
  disabled: boolean;
}>();

const emit = defineEmits<{
  select: [id: string];
}>();
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="algo in algorithms"
      :key="algo.id"
      @click="emit('select', algo.id)"
      :disabled="disabled"
      :class="[
        'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
        current === algo.id
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/50'
          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700',
        'disabled:opacity-60 disabled:cursor-not-allowed',
      ]"
      :title="`${algo.timeComplexity} · ${algo.spaceComplexity} · ${algo.stable ? '稳定' : '不稳定'}`"
    >
      {{ algo.name }}
    </button>
  </div>

  <!-- 图例 -->
  <div class="flex justify-center gap-4 text-xs text-slate-500 mt-4">
    <div class="flex items-center gap-1.5">
      <div class="w-3 h-3 rounded-sm bg-indigo-500" />
      未排序
    </div>
    <div class="flex items-center gap-1.5">
      <div class="w-3 h-3 rounded-sm bg-amber-400" />
      比较中
    </div>
    <div class="flex items-center gap-1.5">
      <div class="w-3 h-3 rounded-sm bg-rose-500" />
      交换
    </div>
    <div class="flex items-center gap-1.5">
      <div class="w-3 h-3 rounded-sm bg-emerald-500" />
      已排定
    </div>
  </div>
</template>
