<script setup lang="ts">import { useRouter } from 'vue-router';const r=useRouter();</script>
<template><div class="text-center py-28"><h1 class="text-6xl font-bold text-slate-700 mb-4">404</h1><p class="text-slate-400 mb-6">页面未找到</p><button @click="r.push('/')" class="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-500">返回首页</button></div></template>
