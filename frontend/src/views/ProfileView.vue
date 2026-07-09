<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
import api from '../utils/api';

const user = useUserStore();
const router = useRouter();
const tab = ref<'history'|'favorites'|'notes'|'progress'>('history');
const history = ref<any[]>([]);
const favorites = ref<any[]>([]);
const notes = ref<any[]>([]);
const progress = ref<any[]>([]);
const noteText = ref('');
const loading = ref(false);

function loadLocal(key: string): any[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

async function loadAll() {
  // 先从 localStorage 加载，确保立即可见
  history.value = loadLocal('ds_history');
  try { const r = await api.get('/history'); history.value = (r.data||[]).length ? r.data : history.value; } catch {}
  try { const r = await api.get('/favorites'); favorites.value = (r.data||[]).length ? r.data : []; } catch {}
  try { const r = await api.get('/notes'); notes.value = r.data||[]; } catch {}
  try { const r = await api.get('/progress'); progress.value = r.data||[]; } catch {}
}

async function saveNote() {
  if (!noteText.value.trim()) return;
  loading.value = true;
  try { await api.post('/notes', { content: noteText.value }); noteText.value=''; loadAll(); } catch {}
  finally { loading.value = false; }
}

function logout() { user.logout(); router.push('/login'); }

onMounted(() => { if (user.isLoggedIn) loadAll(); });
</script>

<template>
  <div class="max-w-[900px] mx-auto p-8">
    <div class="flex items-center justify-between mb-8">
      <div><h1 class="text-2xl font-bold text-white">个人中心</h1><p class="text-sm text-slate-400 mt-1" v-if="user.isLoggedIn">{{ user.username }}</p></div>
      <button v-if="user.isLoggedIn" @click="logout" class="px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">退出登录</button>
    </div>

    <div v-if="!user.isLoggedIn" class="text-center py-16">
      <p class="text-slate-400 mb-4">请先登录</p>
      <button @click="router.push('/login')" class="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-500 transition-colors">去登录</button>
    </div>

    <template v-else>
      <div class="flex gap-1 bg-slate-800 rounded-lg p-1 mb-6 w-fit">
        <button v-for="t in (['history','favorites','notes','progress'] as const)" :key="t" @click="tab=t"
          class="px-4 py-2 rounded-md text-sm font-medium transition-all"
          :class="tab===t?'bg-slate-700 text-white':'text-slate-400 hover:text-slate-300'">
          {{ t==='history'?'操作历史':t==='favorites'?'收藏':t==='notes'?'笔记':'进度' }}
        </button>
      </div>

      <div v-if="tab==='history'" class="space-y-2">
        <div v-if="history.length===0" class="text-slate-500 text-sm py-8 text-center">暂无操作历史</div>
        <div v-for="h in history" :key="h.id" class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 flex justify-between">
          <div><span class="text-indigo-400 font-medium">{{ h.structure }}</span><span class="text-slate-500 mx-2">·</span><span class="text-slate-300">{{ h.operation }}</span></div>
          <span class="text-xs text-slate-500">{{ new Date(h.createdAt).toLocaleString() }}</span>
        </div>
      </div>

      <div v-if="tab==='favorites'" class="space-y-2">
        <div v-if="favorites.length===0" class="text-slate-500 text-sm py-8 text-center">暂无收藏</div>
        <div v-for="f in favorites" :key="f.id" class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 flex justify-between">
          <span class="text-indigo-400 font-medium">{{ f.structure }}</span>
          <span class="text-xs text-slate-500">{{ new Date(f.createdAt).toLocaleString() }}</span>
        </div>
      </div>

      <div v-if="tab==='notes'">
        <div class="flex gap-2 mb-4">
          <input v-model="noteText" placeholder="写笔记..." class="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"/>
          <button @click="saveNote" :disabled="loading" class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg font-medium hover:bg-indigo-500 disabled:opacity-50">保存</button>
        </div>
        <div v-if="notes.length===0" class="text-slate-500 text-sm py-8 text-center">暂无笔记</div>
        <div v-for="n in notes" :key="n.id" class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 mb-2">
          <p class="text-slate-300 text-sm">{{ n.content }}</p>
          <span class="text-xs text-slate-500 mt-1 block">{{ new Date(n.updatedAt||n.createdAt).toLocaleString() }}</span>
        </div>
      </div>

      <div v-if="tab==='progress'" class="space-y-3">
        <div v-if="progress.length===0" class="text-slate-500 text-sm py-8 text-center">暂无学习记录</div>
        <div v-for="p in progress" :key="p.id" class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 flex justify-between">
          <div><span class="text-indigo-400 font-medium">{{ p.algorithmId }}</span></div>
          <span class="text-xs text-slate-500">{{ new Date(p.finishedAt).toLocaleString() }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
