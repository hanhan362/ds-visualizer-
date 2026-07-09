<script setup lang="ts">
import { ref } from 'vue';
import { useUserActions } from '../composables/useUserActions';
import { useArrayPlayer, generateArraySteps } from '../composables/useArrayPlayer';
const { favorited, toggleFavorite, recordHistory } = useUserActions('Array');
import ArraySvg from '../components/array/ArraySvg.vue';

const currentArray = ref([42, 17, 89, 3, 65, 30, 55, 21]);
const inputValue = ref(50);
const player = useArrayPlayer();

function doOperation(op: 'push' | 'pop' | 'shift' | 'unshift') {
  const val = op === 'push' || op === 'unshift' ? inputValue.value : undefined;
  const steps = generateArraySteps(currentArray.value, op, val);
  player.loadSteps(steps);

  // 直接更新数组
  const arr = [...currentArray.value];
  if (op === 'push' && val !== undefined) arr.push(val);
  else if (op === 'pop') arr.pop();
  else if (op === 'shift') arr.shift();
  else if (op === 'unshift' && val !== undefined) arr.unshift(val);
  currentArray.value = arr;
  recordHistory('Array:'+op);

  player.play();
}

function randomArray() {
  const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 5);
  currentArray.value = arr;
  player.reset();
}

const displayArray = () => {
  const step = player.currentStep();
  return step ? step.array : currentArray.value;
};

const displayHighlights = () => {
  const step = player.currentStep();
  return step ? step.highlights : [];
};

const displayDesc = () => {
  const step = player.currentStep();
  return step ? step.description : '';
};
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
    <div>
      <h2 class="text-lg font-bold text-white">数组可视化</h2>
      <p class="text-xs text-slate-500">SVG 柱状图 · push / pop / shift / unshift 操作动画</p>
      <button @click="toggleFavorite" class="text-lg transition-colors ml-2" :class="favorited?'text-yellow-400':'text-slate-600 hover:text-yellow-400'" title="收藏">{{ favorited?'★':'☆' }}</button>
    </div>

    <!-- 操作按钮 -->
    <div class="flex flex-wrap items-center gap-2">
      <input
        v-model.number="inputValue"
        type="number"
        class="w-20 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm
          focus:outline-none focus:border-indigo-500 transition-colors"
        placeholder="值"
      />

      <button @click="doOperation('push')" :disabled="player.state.value === 'running'"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        push
      </button>
      <button @click="doOperation('pop')" :disabled="player.state.value === 'running' || currentArray.length === 0"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-rose-600 hover:bg-rose-500 text-white
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        pop
      </button>
      <button @click="doOperation('unshift')" :disabled="player.state.value === 'running'"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        unshift
      </button>
      <button @click="doOperation('shift')" :disabled="player.state.value === 'running' || currentArray.length === 0"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-rose-600 hover:bg-rose-500 text-white
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        shift
      </button>

      <span class="text-slate-600 mx-1">|</span>

      <!-- Player -->
      <button
        v-if="player.state.value === 'idle' || player.state.value === 'paused' || player.state.value === 'done'"
        @click="player.play()"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
        {{ player.state.value === 'done' ? '重播' : player.state.value === 'paused' ? '继续' : '▶' }}
      </button>
      <button v-else @click="player.pause()"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-amber-600 hover:bg-amber-500 text-white transition-colors">
        ⏸
      </button>

      <button @click="randomArray()"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors">
        🔀 随机
      </button>

      <!-- Speed -->
      <div class="flex items-center gap-1 ml-2">
        <span class="text-xs text-slate-500">速度</span>
        <input type="range" min="10" max="1000" :value="player.speed.value"
          @input="player.setSpeed(Number(($event.target as HTMLInputElement).value))"
          class="w-20 h-1.5 accent-indigo-500"/>
      </div>
    </div>

    <!-- 描述 -->
    <div v-if="displayDesc()" class="text-sm text-amber-400 font-medium text-center">
      {{ displayDesc() }}
    </div>

    <!-- SVG -->
    <ArraySvg :array="displayArray()" :highlights="displayHighlights()"/>

    <!-- 进度条 -->
    <div class="flex items-center gap-2">
      <span class="text-xs text-slate-500">{{ Math.round(player.progress()) }}%</span>
      <input type="range" :min="0" :max="100" :value="player.progress()"
        @input="player.index.value = Math.floor((Number(($event.target as HTMLInputElement).value) / 100) * (player.steps.value.length - 1))"
        class="flex-1 h-1 accent-indigo-500"/>
    </div>

    <!-- 图例 -->
    <div class="flex justify-center gap-4 text-xs text-slate-500">
      <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-sm bg-indigo-500"/>正常</div>
      <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-sm bg-rose-500"/>操作中</div>
    </div>
  </div>
</template>
