import { ref, onUnmounted } from 'vue';

export interface LLNode {
  value: number;
  id: number;
}

export interface LLStep {
  nodes: LLNode[];
  highlights: number[];
  arrow: [number, number] | null;
  description: string;
}

const MIN_SPEED = 10;
const MAX_SPEED = 1000;
const DEFAULT_SPEED = 300;

export function useLLPlayer() {
  const state = ref<'idle' | 'running' | 'paused' | 'done'>('idle');
  const steps = ref<LLStep[]>([]);
  const index = ref(0);
  const speed = ref(DEFAULT_SPEED);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const currentStep = () => (index.value < steps.value.length ? steps.value[index.value] : null);
  const progress = () => (steps.value.length > 0 ? (index.value / steps.value.length) * 100 : 0);

  function loadSteps(s: LLStep[]) {
    stopTimer();
    steps.value = s;
    index.value = 0;
    state.value = 'idle';
  }

  function play() {
    if (state.value === 'done') index.value = 0;
    state.value = 'running';
    scheduleNext();
  }

  function scheduleNext() {
    stopTimer();
    timer = setTimeout(() => {
      if (index.value < steps.value.length - 1) { index.value++; scheduleNext(); }
      else state.value = 'done';
    }, MAX_SPEED - speed.value + MIN_SPEED);
  }

  function pause() { stopTimer(); state.value = 'paused'; }
  function reset() { stopTimer(); index.value = 0; state.value = 'idle'; }
  function stopTimer() { if (timer !== null) { clearTimeout(timer); timer = null; } }
  function setSpeed(s: number) { speed.value = Math.min(MAX_SPEED, Math.max(MIN_SPEED, s)); }
  onUnmounted(() => stopTimer());

  return { state, steps, index, speed, currentStep, progress, loadSteps, play, pause, reset, setSpeed };
}

let nextId = 100;

export function generateLLSteps(
  nodes: LLNode[],
  op: 'insertHead' | 'insertTail' | 'deleteHead' | 'deleteTail' | 'reverse',
  value?: number,
): { steps: LLStep[]; result: LLNode[] } {
  const steps: LLStep[] = [];
  const arr = nodes.map(n => ({ ...n }));

  steps.push({ nodes: arr.map(n => ({ ...n })), highlights: [], arrow: null, description: '初始状态' });

  if (op === 'insertHead' && value !== undefined) {
    const id = nextId++;
    steps.push({ nodes: arr.map(n => ({ ...n })), highlights: [], arrow: null, description: `创建新节点 ${value}` });
    arr.unshift({ value, id });
    steps.push({ nodes: arr.map(n => ({ ...n })), highlights: [id], arrow: [id, arr[1]?.id ?? -1], description: `insertHead(${value}) — 新节点指向原头节点` });
  } else if (op === 'insertTail' && value !== undefined) {
    const id = nextId++;
    steps.push({ nodes: arr.map(n => ({ ...n })), highlights: [], arrow: null, description: `创建新节点 ${value}` });
    const lastId = arr.length > 0 ? arr[arr.length - 1].id : -1;
    arr.push({ value, id });
    steps.push({ nodes: arr.map(n => ({ ...n })), highlights: [id], arrow: lastId > 0 ? [lastId, id] : null, description: `insertTail(${value}) — 尾节点指向新节点` });
  } else if (op === 'deleteHead' && arr.length > 0) {
    const head = arr[0];
    steps.push({ nodes: arr.map(n => ({ ...n })), highlights: [head.id], arrow: null, description: `deleteHead() — 准备移除 ${head.value}` });
    arr.shift();
    steps.push({ nodes: arr.map(n => ({ ...n })), highlights: [], arrow: null, description: `deleteHead() — 头节点已移除` });
  } else if (op === 'deleteTail' && arr.length > 0) {
    const tail = arr[arr.length - 1];
    steps.push({ nodes: arr.map(n => ({ ...n })), highlights: [tail.id], arrow: null, description: `deleteTail() — 准备移除 ${tail.value}` });
    arr.pop();
    steps.push({ nodes: arr.map(n => ({ ...n })), highlights: [], arrow: null, description: `deleteTail() — 尾节点已移除` });
  } else if (op === 'reverse') {
    arr.reverse();
    steps.push({ nodes: arr.map(n => ({ ...n })), highlights: [], arrow: null, description: `reverse() — 链表已反转` });
  }

  return { steps, result: arr };
}
