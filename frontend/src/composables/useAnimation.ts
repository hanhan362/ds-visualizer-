import { ref, onUnmounted } from 'vue';
import type { SortStep, AnimState } from '../types';

const MIN_SPEED = 5;
const MAX_SPEED = 500;
const DEFAULT_SPEED = 30;

export function useAnimation() {
  // ── 状态 ──
  const state = ref<AnimState>('idle');
  const steps = ref<SortStep[]>([]);
  const currentIndex = ref(0);
  const speed = ref(DEFAULT_SPEED);
  const comparisons = ref(0);
  const swaps = ref(0);

  // ── 内部引用 ──
  let rafId: number | null = null;
  let lastStepTime = 0;

  // ── 计算属性 ──
  const currentStep = () =>
    currentIndex.value < steps.value.length
      ? steps.value[currentIndex.value]
      : null;

  const progress = () =>
    steps.value.length > 0
      ? (currentIndex.value / steps.value.length) * 100
      : 0;

  const totalSteps = () => steps.value.length;

  // ── 动画循环 ──
  function animationLoop(timestamp: number) {
    if (state.value !== 'running') return;

    if (!lastStepTime) lastStepTime = timestamp;

    const elapsed = timestamp - lastStepTime;
    const delay = MAX_SPEED - speed.value + MIN_SPEED;

    if (elapsed >= delay) {
      lastStepTime = timestamp - (elapsed % delay);

      if (currentIndex.value < steps.value.length - 1) {
        currentIndex.value++;
        const step = steps.value[currentIndex.value];
        comparisons.value = step.comparisons;
        swaps.value = step.swaps;
      } else {
        state.value = 'done';
        return;
      }
    }

    rafId = requestAnimationFrame(animationLoop);
  }

  function startLoop() {
    if (rafId) return;
    lastStepTime = 0;
    rafId = requestAnimationFrame(animationLoop);
  }

  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // ── 公开方法 ──
  function loadSteps(newSteps: SortStep[]) {
    stopLoop();
    steps.value = newSteps;
    currentIndex.value = 0;
    state.value = 'idle';
    comparisons.value = 0;
    swaps.value = 0;
  }

  function play() {
    if (state.value === 'done') {
      currentIndex.value = 0;
      comparisons.value = 0;
      swaps.value = 0;
    }
    state.value = 'running';
    startLoop();
  }

  function pause() {
    state.value = 'paused';
    stopLoop();
  }

  function reset() {
    stopLoop();
    currentIndex.value = 0;
    comparisons.value = 0;
    swaps.value = 0;
    state.value = 'idle';
  }

  function seekTo(index: number) {
    const clamped = Math.max(0, Math.min(index, steps.value.length - 1));
    currentIndex.value = clamped;
    const step = steps.value[clamped];
    comparisons.value = step.comparisons;
    swaps.value = step.swaps;

    if (clamped >= steps.value.length - 1) {
      state.value = 'done';
      stopLoop();
    }
  }

  function setSpeed(s: number) {
    speed.value = Math.min(MAX_SPEED, Math.max(MIN_SPEED, s));
  }

  // 清理
  onUnmounted(() => stopLoop());

  return {
    state,
    steps,
    currentIndex,
    speed,
    comparisons,
    swaps,
    currentStep,
    progress,
    totalSteps,
    loadSteps,
    play,
    pause,
    reset,
    seekTo,
    setSpeed,
  };
}
