<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

interface ModuleCard {
  path: string;
  title: string;
  icon: string;
  desc: string;
  status: 'done' | 'partial' | 'soon';
  statusText: string;
  features: string[];
}

const modules: ModuleCard[] = [
  {
    path: '/array',
    title: '数组',
    icon: '📊',
    desc: '连续内存存储结构，支持随机访问',
    status: 'done',
    statusText: '已完成',
    features: ['push / pop 动画', 'shift / unshift', '随机访问演示'],
  },
  {
    path: '/linked-list',
    title: '链表',
    icon: '🔗',
    desc: '节点 + 指针的动态链式结构',
    status: 'done',
    statusText: '已完成',
    features: ['插入 / 删除动画', '反转动画', '遍历演示'],
  },
  {
    path: '/stack-queue',
    title: '栈 / 队列',
    icon: '📚',
    desc: 'LIFO 栈与 FIFO 队列的线性结构',
    status: 'done',
    statusText: '已完成',
    features: ['push / pop 动画', 'enqueue / dequeue', '双模式切换'],
  },
  {
    path: '/sort',
    title: '排序算法',
    icon: '📈',
    desc: '5 种经典排序算法 Canvas 可视化',
    status: 'done',
    statusText: '已完成',
    features: ['冒泡 / 选择 / 插入', '快速 / 归并排序', '速度控制 + 进度条'],
  },
  {
    path: '/tree',
    title: '二叉树',
    icon: '🌳',
    desc: '二叉树遍历与 BST 操作可视化',
    status: 'done',
    statusText: '已完成',
    features: ['前序 / 中序 / 后序遍历', 'SVG 节点+边渲染', '播放控制 + 速度调节'],
  },
  {
    path: '/graph',
    title: '图算法',
    icon: '🕸',
    desc: '图的遍历与最短路径可视化',
    status: 'done',
    statusText: '已完成',
    features: ['BFS 广度优先搜索', 'DFS 深度优先搜索', '逐层染色 + 播放控制'],
  },
];

const statusClass = (status: string) => {
  switch (status) {
    case 'done': return 'bg-emerald-900/50 text-emerald-400 border-emerald-700';
    case 'partial': return 'bg-amber-900/50 text-amber-400 border-amber-700';
    case 'soon': return 'bg-slate-800 text-slate-400 border-slate-700';
    default: return '';
  }
};
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-12">
    <!-- Hero -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-white mb-3 tracking-tight">
        DS-Visualizer
      </h1>
      <p class="text-lg text-slate-400 max-w-2xl mx-auto">
        把抽象的数据结构和算法，通过动画展示出来。
        看到数据在内存中如何移动、节点如何连接、排序如何一步步完成。
      </p>
      <div class="flex justify-center gap-3 mt-6">
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-indigo-900/50 text-indigo-300 border border-indigo-800">
          Vue3 + TypeScript
        </span>
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-emerald-900/50 text-emerald-300 border border-emerald-800">
          Spring Boot
        </span>
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-amber-900/50 text-amber-300 border border-amber-800">
          Canvas + SVG
        </span>
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-rose-900/50 text-rose-300 border border-rose-800">
          MySQL
        </span>
      </div>
    </div>

    <!-- Module Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="mod in modules"
        :key="mod.path"
        @click="router.push(mod.path)"
        :class="[
          'group relative rounded-xl border p-5 cursor-pointer transition-all duration-200',
          'hover:border-indigo-500/50 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5',
          mod.status === 'done'
            ? 'bg-slate-900 border-slate-800'
            : 'bg-slate-900/50 border-slate-800/50',
        ]"
      >
        <!-- Status badge -->
        <span
          :class="[
            'absolute top-3 right-3 inline-block px-2 py-0.5 rounded-md text-[10px] font-medium border',
            statusClass(mod.status),
          ]"
        >
          {{ mod.statusText }}
        </span>

        <!-- Icon + Title -->
        <div class="text-3xl mb-3">{{ mod.icon }}</div>
        <h3 class="text-lg font-semibold text-white mb-1">{{ mod.title }}</h3>
        <p class="text-sm text-slate-500 mb-3">{{ mod.desc }}</p>

        <!-- Features -->
        <ul class="space-y-1">
          <li
            v-for="feat in mod.features"
            :key="feat"
            class="text-xs text-slate-400 flex items-center gap-1.5"
          >
            <span class="w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
            {{ feat }}
          </li>
        </ul>

        <!-- Hover arrow -->
        <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
