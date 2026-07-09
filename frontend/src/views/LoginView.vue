<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../store/user';
import api from '../utils/api';

const router = useRouter();
const userStore = useUserStore();

const form = ref({ username: '', password: '' });
const loading = ref(false);
const showPwd = ref(false);
const remember = ref(false);
const errors = ref({ username: '', password: '' });

function validate(): boolean {
  errors.value = { username: '', password: '' };
  if (!form.value.username) { errors.value.username = '用户名不能为空'; return false; }
  if (!form.value.password) { errors.value.password = '密码不能为空'; return false; }
  if (form.value.password.length < 6) { errors.value.password = '密码长度不能少于6位'; return false; }
  if (form.value.password.length > 20) { errors.value.password = '密码长度不能超过20位'; return false; }
  return true;
}

async function handleLogin() {
  if (!validate()) return;
  loading.value = true;
  try {
    const res = await api.post('/login', form.value);
    userStore.login(res.data.token, res.data.user);
    ElMessage.success('登录成功');
    router.push('/');
  } catch {
    // 离线模式——从本地存储验证
    const users = JSON.parse(localStorage.getItem('ds_users') || '[]');
    const found = users.find((u: any) => u.username === form.value.username && u.password === form.value.password);
    if (found) {
      userStore.login('offline', { id: 0, username: found.username, avatar: '' });
      ElMessage.success('登录成功（离线模式）');
      router.push('/');
    } else {
      ElMessage.error('用户名或密码错误');
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex bg-slate-50">
    <!-- Left: Illustration -->
    <div class="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-20 w-40 h-40 border-2 border-white rounded-lg"></div>
        <div class="absolute top-32 left-32 w-40 h-40 border-2 border-white rounded-lg"></div>
        <div class="absolute bottom-32 right-20 w-60 h-60 border-2 border-white rounded-full"></div>
      </div>
      <div class="relative z-10 text-center text-white px-12">
        <div class="text-6xl mb-6">🔗🌳📊</div>
        <h1 class="text-4xl font-bold mb-4">DS-Visualizer</h1>
        <p class="text-lg text-blue-100 leading-relaxed">数据结构可视化教学平台<br/>看见数据如何流动</p>
        <div class="mt-10 flex justify-center gap-4 text-sm text-blue-200">
          <span>▦ 数组</span><span>↗ 链表</span><span>◈ 树</span><span>⬡ 图</span>
        </div>
      </div>
    </div>

    <!-- Right: Login Card -->
    <div class="flex-1 flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-[400px]">
        <!-- Mobile logo -->
        <div class="lg:hidden text-center mb-8">
          <div class="text-4xl mb-2">🔗</div>
          <h1 class="text-2xl font-bold text-gray-900">DS-Visualizer</h1>
        </div>

        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-1">欢迎回来</h2>
          <p class="text-sm text-gray-500 mb-8">登录你的账号继续学习</p>

          <!-- Username -->
          <div class="mb-5">
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span>
              <input
                v-model="form.username"
                @input="errors.username=''"
                placeholder="用户名"
                class="w-full pl-10 pr-4 py-3 rounded-lg border text-sm outline-none transition-all duration-200"
                :class="errors.username ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'"
              />
            </div>
            <p v-if="errors.username" class="text-red-500 text-xs mt-1.5 ml-1">{{ errors.username }}</p>
          </div>

          <!-- Password -->
          <div class="mb-2">
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
              <input
                v-model="form.password"
                @input="errors.password=''"
                :type="showPwd ? 'text' : 'password'"
                placeholder="密码"
                class="w-full pl-10 pr-12 py-3 rounded-lg border text-sm outline-none transition-all duration-200"
                :class="errors.password ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'"
              />
              <button type="button" @click="showPwd=!showPwd" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm transition-colors">
                {{ showPwd ? '🙈' : '👁' }}
              </button>
            </div>
            <p v-if="errors.password" class="text-red-500 text-xs mt-1.5 ml-1">{{ errors.password }}</p>
          </div>

          <!-- Remember + Forgot -->
          <div class="flex items-center justify-between mb-6 mt-3">
            <label class="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
              <input type="checkbox" v-model="remember" class="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
              记住我
            </label>
            <a href="#" class="text-sm text-gray-400 hover:text-blue-500 transition-colors">忘记密码？</a>
          </div>

          <!-- Submit -->
          <button
            @click="handleLogin"
            :disabled="loading"
            class="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="inline-flex items-center gap-2">
              <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              登录中...
            </span>
            <span v-else>登录</span>
          </button>

          <p class="text-center text-sm text-gray-400 mt-6">
            没有账号？
            <router-link to="/register" class="text-blue-500 font-medium hover:text-blue-600 transition-colors">立即注册</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
