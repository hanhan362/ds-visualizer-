<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  useTreePlayer, buildDemoBST, layoutTree, getEdges, generateTraversalSteps,
} from '../composables/useTreePlayer';
import TreeSvg from '../components/tree/TreeSvg.vue';

const root = buildDemoBST();
const allNodes = layoutTree(root);
const allEdges = getEdges(root);
const traversalType = ref<'preorder' | 'inorder' | 'postorder'>('inorder');
const player = useTreePlayer();

function startTraversal() {
  const steps = generateTraversalSteps(root, traversalType.value);
  player.loadSteps(steps);
  player.play();
}

const displayNodes = () => {
  const step = player.currentStep();
  return step ? step.nodes : allNodes.map(n => ({ ...n, highlight: false }));
};

const displayEdges = () => {
  const step = player.currentStep();
  return step ? step.edges : allEdges;
};

const displayDesc = () => {
  const step = player.currentStep();
  return step ? step.description : '';
};

const traversalLabel = computed(() => {
  switch (traversalType.value) {
    case 'preorder': return '前序（根→左→右）';
    case 'inorder': return '中序（左→根→右）';
    case 'postorder': return '后序（左→右→根）';
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
    <div>
      <h2 class="text-lg font-bold text-white">二叉树可视化</h2>
      <p class="text-xs text-slate-500">SVG 二叉树 · 前/中/后序遍历动画</p>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <!-- 遍历方式 -->
      <button
        v-for="t in (['preorder','inorder','postorder'] as const)"
        :key="t"
        @click="traversalType = t"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-semibold transition-all',
          traversalType === t
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700',
        ]"
      >
        {{ t === 'preorder' ? '前序' : t === 'inorder' ? '中序' : '后序' }}
      </button>

      <span class="text-xs text-slate-500">|</span>

      <button
        v-if="player.state.value !== 'running'"
        @click="startTraversal"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          player.state.value === 'done'
            ? 'bg-amber-600 hover:bg-amber-500 text-white'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white',
        ]"
      >
        {{ player.state.value === 'done' ? '重播' : player.state.value === 'paused' ? '继续' : '▶ 开始遍历' }}
      </button>
      <button
        v-else
        @click="player.pause()"
        class="px-4 py-2 rounded-lg text-sm font-medium bg-amber-600 hover:bg-amber-500 text-white transition-colors"
      >
        ⏸ 暂停
      </button>
      <button
        @click="player.reset()"
        :disabled="player.state.value === 'idle'"
        class="px-3 py-2 rounded-lg text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
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

    <TreeSvg :nodes="displayNodes()" :edges="displayEdges()"/>

    <div class="flex items-center gap-2">
      <span class="text-xs text-slate-500">{{ Math.round(player.progress()) }}%</span>
      <input type="range" :min="0" :max="100" :value="player.progress()"
        class="flex-1 h-1 accent-indigo-500"/>
    </div>

    <!-- 说明 -->
    <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-400">
      <p class="font-semibold text-white mb-1">{{ traversalLabel }}</p>
      <p class="text-xs">演示 BST：50 → (30→20,40) (70→60,80)。红色节点为当前访问位置。</p>
    </div>
  </div>
</template>
