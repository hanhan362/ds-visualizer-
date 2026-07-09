import { ref } from 'vue';
import api from '../utils/api';

const LS_FAVORITES = 'ds_favorites';
const LS_HISTORY = 'ds_history';

function loadLocal(key: string): any[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

function saveLocal(key: string, data: any[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function useUserActions(structureId: string) {
  const favorited = ref(false);

  // 初始化：先从 localStorage 读，再异步从后端同步
  function init() {
    const local = loadLocal(LS_FAVORITES);
    favorited.value = local.includes(structureId);

    const t = localStorage.getItem('token');
    if (!t) return;
    // 后台静默从后端同步
    api.get('/favorites').then(r => {
      const list: any[] = r.data || [];
      favorited.value = list.some((f: any) => f.structure === structureId);
      saveLocal(LS_FAVORITES, list.map((f: any) => f.structure));
    }).catch(() => {});
  }

  async function toggleFavorite() {
    favorited.value = !favorited.value;

    // 更新 localStorage
    let local = loadLocal(LS_FAVORITES);
    if (favorited.value) { if (!local.includes(structureId)) local.push(structureId); }
    else { local = local.filter(s => s !== structureId); }
    saveLocal(LS_FAVORITES, local);

    // 后台同步后端
    const t = localStorage.getItem('token');
    if (!t) return;
    api.post('/favorites', { structure: structureId }).catch(() => {});
  }

  function recordHistory(operation: string) {
    // 写入 localStorage
    const h = { structure: structureId, operation, time: new Date().toISOString() };
    const local = loadLocal(LS_HISTORY);
    local.unshift(h);
    if (local.length > 100) local.length = 100;
    saveLocal(LS_HISTORY, local);

    // 后台同步后端
    const t = localStorage.getItem('token');
    if (!t) return;
    api.post('/history', { structure: structureId, operation }).catch(() => {});
  }

  init();

  return { favorited, toggleFavorite, recordHistory };
}
