<script setup lang="ts">
import type { GNode, GEdge } from '../../composables/useGraphPlayer';

defineProps<{
  nodes: GNode[];
  edges: GEdge[];
}>();
</script>

<template>
  <svg viewBox="0 0 800 340" class="w-full h-80" preserveAspectRatio="xMidYMid meet">
    <rect width="800" height="340" fill="#0f172a" rx="8"/>

    <!-- 边 -->
    <g v-for="(edge, i) in edges" :key="'e'+i">
      <line
        :x1="nodes.find(n => n.id === edge.from)?.x ?? 0"
        :y1="nodes.find(n => n.id === edge.from)?.y ?? 0"
        :x2="nodes.find(n => n.id === edge.to)?.x ?? 0"
        :y2="nodes.find(n => n.id === edge.to)?.y ?? 0"
        stroke="#475569"
        stroke-width="2"
      />
      <!-- 权重 -->
      <text
        v-if="edge.weight"
        :x="((nodes.find(n => n.id === edge.from)?.x ?? 0) + (nodes.find(n => n.id === edge.to)?.x ?? 0)) / 2"
        :y="((nodes.find(n => n.id === edge.from)?.y ?? 0) + (nodes.find(n => n.id === edge.to)?.y ?? 0)) / 2 - 6"
        fill="#64748b"
        font-size="10"
        text-anchor="middle"
      >
        {{ edge.weight }}
      </text>
    </g>

    <!-- 节点 -->
    <g v-for="node in nodes" :key="node.id">
      <circle
        :cx="node.x"
        :cy="node.y"
        r="24"
        :fill="node.color || '#6366f1'"
        stroke="#0f172a"
        stroke-width="3"
      />
      <text
        :x="node.x"
        :y="node.y + 5"
        fill="white"
        font-size="14"
        font-weight="700"
        text-anchor="middle"
        font-family="monospace"
      >
        {{ node.label }}
      </text>
    </g>

    <!-- 图例 -->
    <rect x="10" y="310" width="12" height="12" rx="2" fill="#6366f1"/>
    <text x="26" y="320" fill="#94a3b8" font-size="9">未访问</text>
    <rect x="80" y="310" width="12" height="12" rx="2" fill="#f43f5e"/>
    <text x="96" y="320" fill="#94a3b8" font-size="9">当前</text>
    <rect x="140" y="310" width="12" height="12" rx="2" fill="#10b981"/>
    <text x="156" y="320" fill="#94a3b8" font-size="9">已访问</text>
  </svg>
</template>
