import { ref, onUnmounted } from 'vue';

export interface ArrayStep {
  array: number[];
  highlights: number[];
  description: string;
}

const MIN_SPEED = 10;
const MAX_SPEED = 1000;
const DEFAULT_SPEED = 200;

export function useArrayPlayer() {
  const state = ref<'idle' | 'running' | 'paused' | 'done'>('idle');
  const steps = ref<ArrayStep[]>([]);
  const index = ref(0);
  const speed = ref(DEFAULT_SPEED);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const currentStep = () => (index.value < steps.value.length ? steps.value[index.value] : null);
  const progress = () => (steps.value.length > 0 ? (index.value / steps.value.length) * 100 : 0);

  function loadSteps(s: ArrayStep[]) {
    stop();
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
      if (index.value < steps.value.length - 1) {
        index.value++;
        scheduleNext();
      } else {
        state.value = 'done';
      }
    }, MAX_SPEED - speed.value + MIN_SPEED);
  }

  function pause() {
    stopTimer();
    state.value = 'paused';
  }

  function reset() {
    stopTimer();
    index.value = 0;
    state.value = 'idle';
  }

  function stop() {
    stopTimer();
  }

  function stopTimer() {
    if (timer !== null) { clearTimeout(timer); timer = null; }
  }

  function setSpeed(s: number) {
    speed.value = Math.min(MAX_SPEED, Math.max(MIN_SPEED, s));
  }

  onUnmounted(() => stopTimer());

  return {
    state, steps, index, speed, currentStep, progress,
    loadSteps, play, pause, reset, stop, setSpeed,
  };
}

/** 生成数组操作步骤 */
export function generateArraySteps(
  initial: number[],
  operation: 'push' | 'pop' | 'shift' | 'unshift',
  value?: number,
): ArrayStep[] {
  const arr = [...initial];
  const steps: ArrayStep[] = [];

  steps.push({ array: [...arr], highlights: [], description: '初始状态' });

  if (operation === 'push' && value !== undefined) {
    steps.push({
      array: [...arr, value],
      highlights: [arr.length],
      description: `push(${value}) — 添加到末尾`,
    });
  } else if (operation === 'pop') {
    if (arr.length === 0) return steps;
    const last = arr.length - 1;
    steps.push({ array: [...arr], highlights: [last], description: `pop() — 准备移除 ${arr[last]}` });
    arr.pop();
    steps.push({ array: [...arr], highlights: [], description: `pop() — 已移除末尾元素` });
  } else if (operation === 'shift') {
    if (arr.length === 0) return steps;
    steps.push({ array: [...arr], highlights: [0], description: `shift() — 准备移除 ${arr[0]}` });
    arr.shift();
    steps.push({ array: [...arr], highlights: [], description: `shift() — 所有元素前移一位` });
  } else if (operation === 'unshift' && value !== undefined) {
    arr.unshift(value);
    steps.push({ array: [...arr], highlights: [0], description: `unshift(${value}) — 添加到开头，所有元素后移` });
  }

  return steps;
}
