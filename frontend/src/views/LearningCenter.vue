<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const tab = ref<'practice'|'wrong'|'favorites'|'history'|'stats'>('practice');

// ── Practice ──
interface Question {
  q: string;
  options: string[];
  answer: number;
  category: string;
}

const questions: Question[] = [
  { q: '数组在内存中的存储方式是？', options: ['链式存储', '连续存储', '索引存储', '散列存储'], answer: 1, category: 'Array' },
  { q: '链表插入操作的时间复杂度是？', options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'], answer: 0, category: 'LinkedList' },
  { q: '栈的特点是？', options: ['FIFO', 'LIFO', '随机访问', '链式'], answer: 1, category: 'Stack' },
  { q: '队列的特点是？', options: ['LIFO', '随机访问', 'FIFO', '双向'], answer: 2, category: 'Queue' },
  { q: '冒泡排序的时间复杂度是？', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], answer: 2, category: 'Sorting' },
  { q: '二叉搜索树中序遍历的结果是？', options: ['无序', '升序', '降序', '层序'], answer: 1, category: 'Tree' },
  { q: 'BFS 使用的数据结构是？', options: ['栈', '队列', '数组', '堆'], answer: 1, category: 'Graph' },
  { q: '快速排序的平均时间复杂度是？', options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(log n)'], answer: 2, category: 'Sorting' },
  { q: '归并排序的空间复杂度是？', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, category: 'Sorting' },
  { q: '链表的头插操作时间复杂度是？', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], answer: 0, category: 'LinkedList' },
];

const currentQ = ref<Question | null>(null);
const selectedAnswer = ref(-1);
const showResult = ref(false);
const isCorrect = ref(false);
const totalCorrect = ref(0);
const totalAttempts = ref(0);
const qIndex = ref(0);

function nextQuestion() {
  qIndex.value = (qIndex.value + 1) % questions.length;
  currentQ.value = questions[qIndex.value];
  selectedAnswer.value = -1;
  showResult.value = false;
}

function selectAnswer(idx: number) {
  if (showResult.value) return;
  selectedAnswer.value = idx;
  showResult.value = true;
  isCorrect.value = idx === currentQ.value!.answer;
  totalAttempts.value++;
  if (isCorrect.value) totalCorrect.value++;
  else saveWrong(currentQ.value!);

  const h = { structure: currentQ.value!.category, operation: isCorrect.value ? '练习正确' : '练习错误', time: new Date().toISOString() };
  const local: any[] = JSON.parse(localStorage.getItem('ds_history') || '[]');
  local.unshift(h);
  if (local.length > 100) local.length = 100;
  localStorage.setItem('ds_history', JSON.stringify(local));
}

// ── Wrong Questions ──
const wrongQuestions = ref<any[]>([]);

function saveWrong(q: Question) {
  const wq: any[] = JSON.parse(localStorage.getItem('ds_wrong') || '[]');
  if (!wq.find(w => w.q === q.q)) {
    wq.push({ ...q, time: new Date().toISOString() });
    localStorage.setItem('ds_wrong', JSON.stringify(wq));
  }
}

function loadWrong() {
  wrongQuestions.value = JSON.parse(localStorage.getItem('ds_wrong') || '[]');
}
function removeWrong(idx: number) {
  wrongQuestions.value.splice(idx, 1);
  localStorage.setItem('ds_wrong', JSON.stringify(wrongQuestions.value));
}

// ── Favorites ──
const favorites = ref<string[]>([]);
function loadFavorites() { favorites.value = JSON.parse(localStorage.getItem('ds_favorites') || '[]'); }

const structMap: Record<string, string> = { Array: '/array', LinkedList: '/linked-list', 'Stack/Queue': '/stack-queue', Sorting: '/sort', Tree: '/tree', Graph: '/graph' };

// ── History ──
const historyList = ref<any[]>([]);
function loadHistory() { historyList.value = JSON.parse(localStorage.getItem('ds_history') || '[]'); }

// ── Statistics ──
const stats = computed(() => {
  const catMap: Record<string, number> = {};
  historyList.value.forEach((h: any) => {
    const cat = h.structure || 'Other';
    catMap[cat] = (catMap[cat] || 0) + 1;
  });
  return Object.entries(catMap).sort((a, b) => b[1] - a[1]);
});

onMounted(() => {
  nextQuestion();
  loadWrong();
  loadFavorites();
  loadHistory();
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-2xl font-bold text-white mb-6">学习中心</h1>

    <!-- Tabs -->
    <div class="flex gap-1 bg-slate-800 rounded-lg p-1 mb-6 w-fit">
      <button v-for="t in (['practice','wrong','favorites','history','stats'] as const)" :key="t" @click="tab=t;if(t==='wrong')loadWrong();if(t==='favorites')loadFavorites();if(t==='history')loadHistory()"
        class="px-4 py-2 rounded-md text-sm font-medium transition-all"
        :class="tab===t?'bg-slate-700 text-white':'text-slate-400 hover:text-slate-300'">
        {{ t==='practice'?'📝 练习':t==='wrong'?'❌ 错题':t==='favorites'?'⭐ 收藏':t==='history'?'📋 历史':'📊 统计' }}
      </button>
    </div>

    <!-- Practice -->
    <div v-if="tab==='practice'" class="space-y-4">
      <div v-if="currentQ" class="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
        <p class="text-sm text-slate-400 mb-1">{{ currentQ.category }} · 第 {{ qIndex+1 }}/{{ questions.length }} 题</p>
        <p class="text-lg text-white font-semibold mb-6">{{ currentQ.q }}</p>

        <div class="space-y-3">
          <button
            v-for="(opt, i) in currentQ.options" :key="i"
            @click="selectAnswer(i)"
            :disabled="showResult"
            class="w-full text-left px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-200"
            :class="showResult
              ? i===currentQ.answer ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : i===selectedAnswer && !isCorrect ? 'bg-red-500/20 border-red-500/50 text-red-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-700'"
          >
            <span class="inline-block w-6 h-6 rounded-full text-xs flex items-center justify-center mr-2 border"
              :class="showResult && i===currentQ.answer ? 'border-emerald-500 text-emerald-300' : 'border-slate-600 text-slate-400'">
              {{ String.fromCharCode(65+i) }}
            </span>
            {{ opt }}
          </button>
        </div>

        <div v-if="showResult" class="mt-6 flex items-center justify-between">
          <span class="text-sm font-medium" :class="isCorrect?'text-emerald-400':'text-red-400'">
            {{ isCorrect ? '✅ 回答正确！' : '❌ 回答错误' }}
          </span>
          <div class="flex items-center gap-4">
            <span class="text-sm text-slate-400">{{ totalCorrect }}/{{ totalAttempts }} 正确</span>
            <button @click="nextQuestion" class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg font-medium hover:bg-indigo-500 transition-colors">下一题 →</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Wrong Questions -->
    <div v-if="tab==='wrong'" class="space-y-2">
      <div v-if="wrongQuestions.length===0" class="text-slate-500 text-sm py-12 text-center">暂无错题，去练习吧 ✨</div>
      <div v-for="(wq, i) in wrongQuestions" :key="i" class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex justify-between items-center">
        <div>
          <span class="text-xs text-indigo-400 font-medium">{{ wq.category }}</span>
          <p class="text-sm text-slate-300 mt-1">{{ wq.q }}</p>
          <p class="text-xs text-emerald-400 mt-1">答案：{{ wq.options[wq.answer] }}</p>
        </div>
        <button @click="removeWrong(i)" class="text-slate-500 hover:text-red-400 transition-colors text-sm">移除</button>
      </div>
    </div>

    <!-- Favorites -->
    <div v-if="tab==='favorites'" class="space-y-2">
      <div v-if="favorites.length===0" class="text-slate-500 text-sm py-12 text-center">暂无收藏，去模块页点 ☆</div>
      <div v-for="f in favorites" :key="f" @click="router.push(structMap[f] || '/')"
        class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 cursor-pointer hover:border-indigo-500/50 transition-all flex justify-between items-center">
        <span class="text-sm text-indigo-400 font-medium">{{ f }}</span>
        <span class="text-xs text-slate-500">点击进入 →</span>
      </div>
    </div>

    <!-- History -->
    <div v-if="tab==='history'" class="space-y-2">
      <div v-if="historyList.length===0" class="text-slate-500 text-sm py-12 text-center">暂无操作记录</div>
      <div v-for="(h, i) in historyList.slice(0, 30)" :key="i" class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 flex justify-between">
        <div><span class="text-indigo-400 text-sm font-medium">{{ h.structure }}</span><span class="text-slate-500 mx-2">·</span><span class="text-slate-300 text-sm">{{ h.operation }}</span></div>
        <span class="text-xs text-slate-500">{{ new Date(h.time).toLocaleString() }}</span>
      </div>
    </div>

    <!-- Statistics -->
    <div v-if="tab==='stats'" class="space-y-4">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-indigo-400">{{ totalAttempts }}</div>
          <div class="text-xs text-slate-400 mt-1">练习次数</div>
        </div>
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-emerald-400">{{ totalCorrect }}</div>
          <div class="text-xs text-slate-400 mt-1">正确次数</div>
        </div>
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-amber-400">{{ Math.round(totalAttempts ? totalCorrect/totalAttempts*100 : 0) }}%</div>
          <div class="text-xs text-slate-400 mt-1">正确率</div>
        </div>
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-rose-400">{{ wrongQuestions.length }}</div>
          <div class="text-xs text-slate-400 mt-1">错题数</div>
        </div>
      </div>

      <h3 class="text-sm font-semibold text-slate-400 mb-3">各模块练习分布</h3>
      <div v-if="stats.length===0" class="text-slate-500 text-sm py-4 text-center">暂无数据</div>
      <div v-for="[cat, count] in stats.slice(0, 6)" :key="cat" class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 flex items-center justify-between mb-2">
        <span class="text-sm text-slate-300">{{ cat }}</span>
        <div class="flex items-center gap-3">
          <div class="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full bg-indigo-500 rounded-full transition-all" :style="{ width: (count / Math.max(...stats.map(s=>s[1])) * 100) + '%' }"></div>
          </div>
          <span class="text-xs text-slate-400 w-6 text-right">{{ count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
