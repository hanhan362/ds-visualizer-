<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../store/user';
import api from '../utils/api';

const router = useRouter();
const userStore = useUserStore();
const form = ref({ username: '', password: '', confirm: '' });
const loading = ref(false);

async function handleRegister() {
  if (!form.value.username) { ElMessage.error('用户名不能为空'); return; }
  if (!form.value.password) { ElMessage.error('密码不能为空'); return; }
  if (form.value.password.length < 6) { ElMessage.error('密码长度不能少于6位'); return; }
  if (form.value.password !== form.value.confirm) { ElMessage.error('两次密码不一致'); return; }
  loading.value = true;
  let ok = false;
  try {
    const res = await api.post('/register', { username: form.value.username, password: form.value.password });
    userStore.login(res.data.token, res.data.user);
    ElMessage.success('注册成功');
    ok = true;
  } catch {
    // 离线注册——存到本地
    const users = JSON.parse(localStorage.getItem('ds_users') || '[]');
    if (users.find((u: any) => u.username === form.value.username)) {
      ElMessage.error('用户名已存在');
      loading.value = false;
      return;
    }
    users.push({ username: form.value.username, password: form.value.password });
    localStorage.setItem('ds_users', JSON.stringify(users));
    userStore.login('offline', { id: 0, username: form.value.username, avatar: '' });
    ElMessage.success('注册成功（离线模式）');
    ok = true;
  } finally {
    loading.value = false;
  }
  if (ok) router.push('/');
}
</script>

<template>
  <div class="min-h-screen flex bg-slate-50">
    <div class="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 items-center justify-center">
      <div class="text-center text-white px-12">
        <div class="text-5xl mb-6">🚀</div>
        <h1 class="text-3xl font-bold mb-4">加入 DS-Visualizer</h1>
        <p class="text-blue-100">开始你的数据结构可视化学习之旅</p>
      </div>
    </div>
    <div class="flex-1 flex items-center justify-center px-6">
      <div class="w-full max-w-[400px]">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-1">创建账号</h2>
          <p class="text-sm text-gray-500 mb-8">注册后可以保存学习记录</p>
          <div class="space-y-4">
            <input v-model="form.username" placeholder="用户名" class="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"/>
            <input v-model="form.password" type="password" placeholder="密码（6-20位）" class="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"/>
            <input v-model="form.confirm" type="password" placeholder="确认密码" class="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"/>
            <button @click="handleRegister" :disabled="loading" class="w-full py-3 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-60 transition-all">
              {{ loading ? '注册中...' : '注册' }}
            </button>
          </div>
          <p class="text-center text-sm text-gray-400 mt-6">已有账号？<router-link to="/login" class="text-blue-500 font-medium">登录</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>
