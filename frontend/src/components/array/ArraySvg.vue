<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  array: number[];
  highlights: number[];
}>();

const maxVal = computed(() => Math.max(...props.array, 1));
</script>

<template>
  <svg viewBox="0 0 800 300" class="w-full h-72" preserveAspectRatio="xMidYMid meet">
    <rect width="800" height="300" fill="#0f172a" rx="8"/>

    <!-- 索引标签 -->
    <g v-for="i in array.length" :key="i">
      <text
        :x="40 + (i - 1) * 50"
        y="30"
        fill="#64748b"
        font-size="11"
        text-anchor="middle"
        font-family="monospace"
      >
        [{{ i - 1 }}]
      </text>
    </g>

    <!-- 柱子 -->
    <g v-for="(val, i) in array" :key="'bar-' + i">
      <rect
        :x="15 + i * 50"
        :y="260 - (val / maxVal) * 200"
        width="36"
        :height="(val / maxVal) * 200"
        rx="4"
        :fill="highlights.includes(i) ? '#f43f5e' : '#6366f1'"
        :opacity="highlights.includes(i) ? 1 : 0.8"
      >
        <animate
          v-if="highlights.includes(i)"
          attributeName="fill"
          values="#f43f5e;#fbbf24;#f43f5e"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </rect>

      <!-- 数值 -->
      <text
        :x="33 + i * 50"
        :y="250 - (val / maxVal) * 200"
        fill="white"
        font-size="12"
        text-anchor="middle"
        font-family="monospace"
        font-weight="600"
      >
        {{ val }}
      </text>
    </g>
  </svg>
</template>
