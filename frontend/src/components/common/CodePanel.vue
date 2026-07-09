<script setup lang="ts">
defineProps<{
  code: string;
  currentLine: number;
}>();
</script>

<template>
  <div class="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
    <div class="px-4 py-2 bg-slate-800 text-xs text-slate-400 font-medium">
      伪代码
    </div>
    <pre class="p-4 text-sm font-mono leading-relaxed overflow-x-auto"><code><span
        v-for="(line, i) in code.trim().split('\n')"
        :key="i"
        :class="[
          'block px-2 py-0.5 rounded',
          i + 1 === currentLine
            ? 'bg-indigo-900/50 text-indigo-300 border-l-2 border-indigo-400'
            : 'text-slate-400',
        ]"
      >{{ line }}</span></code></pre>
  </div>
</template>
