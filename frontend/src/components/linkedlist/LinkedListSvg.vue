<script setup lang="ts">
import type { LLNode } from '../../composables/useLLPlayer';

defineProps<{
  nodes: LLNode[];
  highlights: number[];
}>();
</script>

<template>
  <svg viewBox="0 0 800 180" class="w-full h-40" preserveAspectRatio="xMidYMid meet">
    <rect width="800" height="180" fill="#0f172a" rx="8"/>

    <template v-if="nodes.length === 0">
      <text x="400" y="90" fill="#64748b" font-size="14" text-anchor="middle">空链表</text>
    </template>

    <template v-for="(node, i) in nodes" :key="node.id">
      <!-- 箭头 -->
      <line
        v-if="i < nodes.length - 1"
        :x1="110 + i * 120"
        y1="90"
        :x2="170 + i * 120"
        y2="90"
        stroke="#475569"
        stroke-width="2"
        marker-end="url(#arrow-head)"
      />

      <!-- 节点圆 -->
      <circle
        :cx="80 + i * 120"
        cy="90"
        r="28"
        :fill="highlights.includes(node.id) ? '#f43f5e' : '#1e293b'"
        :stroke="highlights.includes(node.id) ? '#f43f5e' : '#6366f1'"
        stroke-width="2.5"
      >
        <animate
          v-if="highlights.includes(node.id)"
          attributeName="stroke"
          values="#f43f5e;#fbbf24;#f43f5e"
          dur="0.4s"
          repeatCount="indefinite"
        />
      </circle>

      <!-- 节点值 -->
      <text
        :x="80 + i * 120"
        y="95"
        fill="white"
        font-size="14"
        font-weight="700"
        text-anchor="middle"
        font-family="monospace"
      >
        {{ node.value }}
      </text>

      <!-- next 指针标注 -->
      <text
        v-if="i < nodes.length - 1"
        :x="140 + i * 120"
        y="78"
        fill="#64748b"
        font-size="9"
        text-anchor="middle"
        font-family="monospace"
      >
        next
      </text>

      <!-- null 标注 -->
      <text
        v-if="i === nodes.length - 1"
        :x="140 + i * 120"
        y="78"
        fill="#64748b"
        font-size="9"
        text-anchor="middle"
        font-family="monospace"
      >
        null
      </text>
    </template>

    <defs>
      <marker id="arrow-head" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#475569"/>
      </marker>
    </defs>
  </svg>
</template>
