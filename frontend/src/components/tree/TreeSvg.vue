<script setup lang="ts">
import type { TreeNode, TreeEdge } from '../../composables/useTreePlayer';

defineProps<{
  nodes: TreeNode[];
  edges: TreeEdge[];
}>();
</script>

<template>
  <svg viewBox="0 0 800 320" class="w-full h-80" preserveAspectRatio="xMidYMid meet">
    <rect width="800" height="320" fill="#0f172a" rx="8"/>

    <!-- 边 -->
    <line
      v-for="(edge, i) in edges"
      :key="'e' + i"
      :x1="nodes.find(n => n.value === edge.from)?.x ?? 0"
      :y1="nodes.find(n => n.value === edge.from)?.y ?? 0"
      :x2="nodes.find(n => n.value === edge.to)?.x ?? 0"
      :y2="nodes.find(n => n.value === edge.to)?.y ?? 0"
      stroke="#475569"
      stroke-width="2"
    />

    <!-- 节点 -->
    <g v-for="node in nodes" :key="node.value">
      <circle
        :cx="node.x"
        :cy="node.y"
        r="22"
        :fill="node.highlight ? '#f43f5e' : '#1e293b'"
        :stroke="node.highlight ? '#f43f5e' : '#6366f1'"
        stroke-width="2.5"
      />
      <text
        :x="node.x"
        :y="node.y + 5"
        fill="white"
        font-size="13"
        font-weight="700"
        text-anchor="middle"
        font-family="monospace"
      >
        {{ node.value }}
      </text>
    </g>
  </svg>
</template>
