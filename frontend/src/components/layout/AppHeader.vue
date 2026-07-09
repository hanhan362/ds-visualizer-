<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../../store/user';

const route = useRoute();
const router = useRouter();
const user = useUserStore();

const links = [
  { to: '/', label: 'Home' },
  { to: '/learning', label: 'Learning' },
  { to: '/array', label: 'Array' },
  { to: '/linked-list', label: 'Linked List' },
  { to: '/stack-queue', label: 'Stack/Queue' },
  { to: '/sort', label: 'Sorting' },
  { to: '/tree', label: 'Tree' },
  { to: '/graph', label: 'Graph' },
];

function isActive(p: string) { return route.path === p; }
function handleLogout() {
  user.logout();
  router.push('/login');
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
    <div class="max-w-[1200px] mx-auto flex items-center h-12 px-6 gap-6">
      <router-link to="/" class="flex items-center gap-2 no-underline shrink-0">
        <div class="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">D</div>
        <span class="text-sm font-semibold text-gray-900 tracking-tight hidden sm:inline">DS-Visualizer</span>
      </router-link>

      <nav class="hidden md:flex items-center gap-0.5 flex-1">
        <router-link v-for="l in links" :key="l.to" :to="l.to"
          class="px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors no-underline"
          :class="isActive(l.to) ? 'text-gray-900 bg-gray-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'">
          {{ l.label }}
        </router-link>
      </nav>

      <div class="flex items-center gap-2 ml-auto shrink-0">
        <template v-if="user.isLoggedIn">
          <el-dropdown trigger="click" placement="bottom-end">
            <div class="flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {{ user.username.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm text-gray-700 font-medium hidden sm:inline">{{ user.username }}</span>
              <svg class="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/profile')">
                  <span class="text-sm">👤 个人中心</span>
                </el-dropdown-item>
                <el-dropdown-item @click="router.push('/learning')">
                  <span class="text-sm">📖 学习记录</span>
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <span class="text-sm text-red-500">退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <router-link to="/login" class="text-sm text-gray-500 hover:text-gray-800 transition-colors px-2 py-1 no-underline">登录</router-link>
          <router-link to="/register" class="px-4 py-1.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all no-underline">注册</router-link>
        </template>
      </div>
    </div>
  </header>
</template>
