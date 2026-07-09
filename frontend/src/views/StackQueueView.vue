<script setup lang="ts">
import { ref } from 'vue';
import { useArrayPlayer, generateArraySteps } from '../composables/useArrayPlayer';
import ArraySvg from '../components/array/ArraySvg.vue';

const mode = ref<'stack' | 'queue'>('stack');
const items = ref([42, 17, 89]);
const inputValue = ref(50);
const player = useArrayPlayer();

function pushOrEnqueue() {
  const steps = generateArraySteps(items.value, 'push', inputValue.value);
  player.loadSteps(steps);
  items.value.push(inputValue.value);
  player.play();
}

function popOrDequeue() {
  if (mode.value === 'stack') {
    const steps = generateArraySteps(items.value, 'pop');
    player.loadSteps(steps);
    items.value.pop();
  } else {
    const steps = generateArraySteps(items.value, 'shift');
    player.loadSteps(steps);
    items.value.shift();
  }
  player.play();
}

function resetAll() {
  items.value = [42, 17, 89];
  player.reset();
}

const displayArray = () => {
  const step = player.currentStep();
  return step ? step.array : items.value;
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
      <h2 class="text-lg font-bold text-white">栈 / 队列可视化</h2>
      <p class="text-xs text-slate-500">LIFO 栈（先进后出）· FIFO 队列（先进先出）</p>
    </div>

    <!-- 模式切换 -->
    <div class="flex gap-2">
      <button
        @click="mode = 'stack'; resetAll()"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
          mode === 'stack'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
            : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700',
        ]"
      >
        📚 栈 (Stack) — LIFO
      </button>
      <button
        @click="mode = 'queue'; resetAll()"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
          mode === 'queue'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
            : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700',
        ]"
      >
        📋 队列 (Queue) — FIFO
      </button>
    </div>

    <!-- 操作按钮 -->
    <div class="flex flex-wrap items-center gap-2">
      <input
        v-model.number="inputValue" type="number"
        class="w-20 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm
          focus:outline-none focus:border-indigo-500 transition-colors"
      />

      <button @click="pushOrEnqueue()" :disabled="player.state.value === 'running'"
        class="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        {{ mode === 'stack' ? 'push' : 'enqueue' }}
      </button>
      <button @click="popOrDequeue()" :disabled="player.state.value === 'running' || items.length === 0"
        class="px-4 py-2 rounded-lg text-sm font-medium bg-rose-600 hover:bg-rose-500 text-white
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        {{ mode === 'stack' ? 'pop' : 'dequeue' }}
      </button>

      <span class="text-slate-600 mx-1">|</span>

      <button v-if="player.state.value !== 'running'"
        @click="player.play()"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
        {{ player.state.value === 'done' ? '重播' : player.state.value === 'paused' ? '继续' : '▶' }}
      </button>
      <button v-else @click="player.pause()"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-amber-600 hover:bg-amber-500 text-white transition-colors">
        ⏸
      </button>

      <button @click="resetAll()"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors">
        🔄 重置
      </button>

      <div class="flex items-center gap-1 ml-2">
        <span class="text-xs text-slate-500">速度</span>
        <input type="range" min="10" max="1000" :value="player.speed.value"
          @input="player.setSpeed(Number(($event.target as HTMLInputElement).value))"
          class="w-20 h-1.5 accent-indigo-500"/>
      </div>
    </div>

    <div v-if="displayDesc()" class="text-sm text-amber-400 font-medium text-center">
      {{ displayDesc() }}
    </div>

    <!-- 可视化区域 -->
    <div class="relative">
      <!-- 模式标注 -->
      <div class="text-xs text-slate-500 mb-1 ml-2">
        <template v-if="mode === 'stack'">
          ← top（push 加入 / pop 移除）| bottom →
        </template>
        <template v-else>
          ← front（dequeue 移除）| ... | rear（enqueue 加入）→
        </template>
      </div>
      <ArraySvg :array="displayArray()" :highlights="displayHighlights()"/>
    </div>

    <div class="flex items-center gap-2">
      <span class="text-xs text-slate-500">{{ Math.round(player.progress()) }}%</span>
      <input type="range" :min="0" :max="100" :value="player.progress()"
        class="flex-1 h-1 accent-indigo-500"/>
    </div>

    <!-- 说明 -->
    <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-400">
      <template v-if="mode === 'stack'">
        <p class="font-semibold text-white mb-1">栈 (Stack) — LIFO 后进先出</p>
        <ul class="list-disc list-inside space-y-0.5 text-xs">
          <li>push: 元素添加到栈顶（数组末尾）</li>
          <li>pop: 从栈顶移除元素（数组末尾）</li>
          <li>应用: 函数调用栈、撤销操作、括号匹配</li>
        </ul>
      </template>
      <template v-else>
        <p class="font-semibold text-white mb-1">队列 (Queue) — FIFO 先进先出</p>
        <ul class="list-disc list-inside space-y-0.5 text-xs">
          <li>enqueue: 元素添加到队尾（数组末尾）</li>
          <li>dequeue: 从队首移除元素（数组开头，后续元素前移）</li>
          <li>应用: 任务调度、BFS、消息队列</li>
        </ul>
      </template>
    </div>
  </div>
</template>
