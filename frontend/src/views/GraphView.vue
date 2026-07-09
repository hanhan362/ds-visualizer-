<script setup lang="ts">
import { ref } from 'vue';
import {
  useGraphPlayer, DEMO_NODES, DEMO_EDGES, generateBFSSteps, generateDFSSteps,
} from '../composables/useGraphPlayer';
import GraphSvg from '../components/graph/GraphSvg.vue';

const algorithm = ref<'bfs' | 'dfs'>('bfs');
const player = useGraphPlayer();

function start() {
  const steps = algorithm.value === 'bfs'
    ? generateBFSSteps('A')
    : generateDFSSteps('A');
  player.loadSteps(steps);
  player.play();
}

const displayNodes = () => {
  const step = player.currentStep();
  return step ? step.nodes : DEMO_NODES.map(n => ({ ...n, color: '#6366f1' }));
};

const displayEdges = () => {
  const step = player.currentStep();
  return step ? step.edges : DEMO_EDGES;
};

const displayDesc = () => {
  const step = player.currentStep();
  return step ? step.description : '';
};
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
    <div>
      <h2 class="text-lg font-bold text-white">图算法可视化</h2>
      <p class="text-xs text-slate-500">SVG 节点连线图 · BFS / DFS 遍历动画</p>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button
        @click="algorithm = 'bfs'"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
          algorithm === 'bfs' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700',
        ]"
      >
        BFS 广度优先
      </button>
      <button
        @click="algorithm = 'dfs'"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
          algorithm === 'dfs' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700',
        ]"
      >
        DFS 深度优先
      </button>

      <span class="text-xs text-slate-500">|</span>

      <button
        v-if="player.state.value !== 'running'"
        @click="start"
        class="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
      >
        {{ player.state.value === 'done' ? '重播' : player.state.value === 'paused' ? '继续' : '▶ 开始' }}
      </button>
      <button v-else @click="player.pause()"
        class="px-4 py-2 rounded-lg text-sm font-medium bg-amber-600 hover:bg-amber-500 text-white transition-colors">
        ⏸ 暂停
      </button>
      <button @click="player.reset()" :disabled="player.state.value === 'idle'"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 disabled:opacity-40 transition-colors">
        ↩ 重置
      </button>

      <div class="flex items-center gap-1 ml-2">
        <span class="text-xs text-slate-500">速度</span>
        <input type="range" min="50" max="2000" :value="player.speed.value"
          @input="player.setSpeed(Number(($event.target as HTMLInputElement).value))"
          class="w-20 h-1.5 accent-indigo-500"/>
      </div>
    </div>

    <div v-if="displayDesc()" class="text-sm text-amber-400 font-medium text-center">
      {{ displayDesc() }}
    </div>

    <GraphSvg :nodes="displayNodes()" :edges="displayEdges()"/>

    <div class="flex items-center gap-2">
      <span class="text-xs text-slate-500">{{ Math.round(player.progress()) }}%</span>
      <input type="range" :min="0" :max="100" :value="player.progress()"
        class="flex-1 h-1 accent-indigo-500"/>
    </div>

    <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-400">
      <p class="font-semibold text-white mb-1">{{ algorithm === 'bfs' ? 'BFS 广度优先搜索' : 'DFS 深度优先搜索' }}</p>
      <p class="text-xs">
        {{ algorithm === 'bfs'
          ? '从 A 出发，逐层向外扩展。🟡=当前访问 🟢=已访问 🔵=未访问。边上的数字为权重。'
          : '从 A 出发，沿一条路径走到底再回溯。🟡=当前访问 🟢=已访问 🔵=未访问。'
        }}
      </p>
    </div>
  </div>
</template>
