<script setup lang="ts">
import { ref } from 'vue';
import { useLLPlayer, generateLLSteps, type LLNode } from '../composables/useLLPlayer';
import LinkedListSvg from '../components/linkedlist/LinkedListSvg.vue';

const nodes = ref<LLNode[]>([
  { value: 10, id: 1 },
  { value: 20, id: 2 },
  { value: 30, id: 3 },
]);
const inputValue = ref(15);
const player = useLLPlayer();

function doOp(op: 'insertHead' | 'insertTail' | 'deleteHead' | 'deleteTail' | 'reverse') {
  const val = op === 'insertHead' || op === 'insertTail' ? inputValue.value : undefined;
  const { steps, result } = generateLLSteps(nodes.value, op, val);
  player.loadSteps(steps);
  nodes.value = result;
  player.play();
}

const displayNodes = () => {
  const step = player.currentStep();
  return step ? step.nodes : nodes.value;
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
      <h2 class="text-lg font-bold text-white">链表可视化</h2>
      <p class="text-xs text-slate-500">SVG 节点 + 箭头 · 插入 / 删除 / 反转操作动画</p>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <input
        v-model.number="inputValue" type="number"
        class="w-20 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm
          focus:outline-none focus:border-indigo-500 transition-colors"
      />
      <button @click="doOp('insertHead')" :disabled="player.state.value === 'running'"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        头插
      </button>
      <button @click="doOp('insertTail')" :disabled="player.state.value === 'running'"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        尾插
      </button>
      <button @click="doOp('deleteHead')" :disabled="player.state.value === 'running' || nodes.length === 0"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-rose-600 hover:bg-rose-500 text-white
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        头删
      </button>
      <button @click="doOp('deleteTail')" :disabled="player.state.value === 'running' || nodes.length === 0"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-rose-600 hover:bg-rose-500 text-white
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        尾删
      </button>
      <button @click="doOp('reverse')" :disabled="player.state.value === 'running' || nodes.length < 2"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-amber-600 hover:bg-amber-500 text-white
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        反转
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

    <LinkedListSvg :nodes="displayNodes()" :highlights="displayHighlights()"/>

    <div class="flex items-center gap-2">
      <span class="text-xs text-slate-500">{{ Math.round(player.progress()) }}%</span>
      <input type="range" :min="0" :max="100" :value="player.progress()"
        class="flex-1 h-1 accent-indigo-500"/>
    </div>

    <div class="flex justify-center gap-4 text-xs text-slate-500">
      <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full bg-slate-700 border border-indigo-500"/> 节点</div>
      <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full bg-rose-500"/> 操作中</div>
      <div class="flex items-center gap-1.5">→ next 指针</div>
    </div>
  </div>
</template>
