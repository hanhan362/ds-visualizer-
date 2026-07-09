<script setup lang="ts">
import type { AnimState } from '../types';

const props = defineProps<{
  state: AnimState;
  speed: number;
  progress: number;
  totalSteps: number;
}>();

const emit = defineEmits<{
  play: [];
  pause: [];
  reset: [];
  generate: [];
  'update:speed': [value: number];
  seek: [index: number];
}>();

const canPlay = props.state === 'idle' || props.state === 'paused' || props.state === 'done';
const canPause = props.state === 'running';

function onProgressInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const pct = Number(target.value);
  const idx = Math.floor((pct / 100) * (props.totalSteps - 1));
  emit('seek', idx);
}
</script>

<template>
  <div class="flex flex-col gap-3 w-full max-w-2xl mx-auto">
    <!-- 进度条 -->
    <div class="flex items-center gap-3">
      <span class="text-xs text-slate-500 w-8 text-right tabular-nums">
        {{ Math.round(progress) }}%
      </span>
      <input
        type="range"
        :min="0"
        :max="100"
        :value="progress"
        @input="onProgressInput"
        class="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer
          accent-indigo-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5
          [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-indigo-400"
      />
    </div>

    <!-- 按钮组 -->
    <div class="flex flex-wrap items-center justify-center gap-3">
      <!-- Play / Pause -->
      <button
        v-if="canPlay"
        @click="emit('play')"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
          bg-emerald-600 hover:bg-emerald-500 text-white transition-colors
          shadow-lg shadow-emerald-500/20"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
        </svg>
        {{ state === 'done' ? '重播' : state === 'paused' ? '继续' : '开始' }}
      </button>
      <button
        v-else-if="canPause"
        @click="emit('pause')"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
          bg-amber-600 hover:bg-amber-500 text-white transition-colors
          shadow-lg shadow-amber-500/20"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z" />
        </svg>
        暂停
      </button>

      <!-- Reset -->
      <button
        @click="emit('reset')"
        :disabled="state === 'idle'"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
          bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed border border-slate-600"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z" />
        </svg>
        重置
      </button>

      <!-- 新数组 -->
      <button
        @click="emit('generate')"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
          bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors
          border border-slate-600"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
        </svg>
        新数组
      </button>

      <!-- 速度 -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-400">速度</span>
        <input
          type="range"
          :min="5"
          :max="500"
          :value="speed"
          @input="emit('update:speed', Number(($event.target as HTMLInputElement).value))"
          class="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer
            accent-indigo-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5
            [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-indigo-400"
        />
        <span class="text-xs text-slate-500 w-10 text-right">{{ speed }}ms</span>
      </div>
    </div>
  </div>
</template>
