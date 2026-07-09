import type { SortStep } from '../types';

function makeStep(arr: number[], compared: [number, number], swapped: [number, number], sorted: number[], comparisons: number, swaps: number): SortStep {
  return { array: [...arr], compared, swapped, sorted: [...sorted], comparisons, swaps };
}

export function bubbleSortClient(input: number[]): SortStep[] {
  const arr = [...input];
  const n = arr.length;
  const sorted: number[] = [];
  const steps: SortStep[] = [];
  let comparisons = 0, swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    let flag = false;
    for (let j = 0; j < n - 1 - i; j++) {
      comparisons++;
      steps.push(makeStep(arr, [j, j + 1], [-1, -1], sorted, comparisons, swaps));
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++; flag = true;
        steps.push(makeStep(arr, [j, j + 1], [j, j + 1], sorted, comparisons, swaps));
      }
    }
    sorted.push(n - 1 - i);
    if (!flag) { for (let k = n - 2 - i; k >= 0; k--) sorted.push(k); break; }
  }
  for (let i = 0; i < n; i++) { if (!sorted.includes(i)) sorted.push(i); }
  return steps;
}

export function selectionSortClient(input: number[]): SortStep[] {
  const arr = [...input];
  const n = arr.length;
  const sorted: number[] = [];
  const steps: SortStep[] = [];
  let comparisons = 0, swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      steps.push(makeStep(arr, [min, j], [-1, -1], sorted, comparisons, swaps));
      if (arr[j] < arr[min]) min = j;
    }
    if (min !== i) {
      [arr[i], arr[min]] = [arr[min], arr[i]];
      swaps++;
      steps.push(makeStep(arr, [i, min], [i, min], sorted, comparisons, swaps));
    }
    sorted.push(i);
  }
  sorted.push(n - 1);
  return steps;
}

export function insertionSortClient(input: number[]): SortStep[] {
  const arr = [...input];
  const n = arr.length;
  const sorted = [0];
  const steps: SortStep[] = [];
  let comparisons = 0, swaps = 0;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0) {
      comparisons++;
      steps.push(makeStep(arr, [j, j + 1], [-1, -1], sorted, comparisons, swaps));
      if (arr[j] > key) { arr[j + 1] = arr[j]; swaps++; steps.push(makeStep(arr, [j, j + 1], [j, j + 1], sorted, comparisons, swaps)); j--; }
      else break;
    }
    arr[j + 1] = key;
    sorted.push(i);
  }
  return steps;
}

export function quickSortClient(input: number[]): SortStep[] {
  const arr = [...input];
  const sorted = new Set<number>();
  const steps: SortStep[] = [];
  let comparisons = 0, swaps = 0;

  function partition(lo: number, hi: number): number {
    const pivot = arr[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      comparisons++;
      steps.push(makeStep(arr, [j, hi], [-1, -1], [...sorted], comparisons, swaps));
      if (arr[j] < pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; swaps++; steps.push(makeStep(arr, [i, j], [i, j], [...sorted], comparisons, swaps)); }
    }
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    if (i + 1 !== hi) { swaps++; steps.push(makeStep(arr, [i + 1, hi], [i + 1, hi], [...sorted], comparisons, swaps)); }
    sorted.add(i + 1);
    return i + 1;
  }

  function qs(lo: number, hi: number) {
    if (lo >= hi) { sorted.add(lo); return; }
    const pi = partition(lo, hi);
    if (pi - 1 > lo) qs(lo, pi - 1); else sorted.add(lo);
    if (pi + 1 < hi) qs(pi + 1, hi); else sorted.add(hi);
  }
  qs(0, arr.length - 1);
  return steps;
}

export function mergeSortClient(input: number[]): SortStep[] {
  const arr = [...input];
  const aux = [...arr];
  const sorted = new Set<number>();
  const steps: SortStep[] = [];
  let comparisons = 0, swaps = 0;

  function merge(lo: number, mid: number, hi: number) {
    for (let k = lo; k <= hi; k++) aux[k] = arr[k];
    let i = lo, j = mid + 1;
    for (let k = lo; k <= hi; k++) {
      if (i > mid) { arr[k] = aux[j++]; swaps++; }
      else if (j > hi) { arr[k] = aux[i++]; swaps++; }
      else {
        comparisons++;
        steps.push(makeStep(arr, [i, j], [-1, -1], [...sorted], comparisons, swaps));
        arr[k] = aux[i] <= aux[j] ? aux[i++] : aux[j++];
        swaps++;
        steps.push(makeStep(arr, [i - 1, j - 1], [-1, k], [...sorted], comparisons, swaps));
      }
    }
  }

  function ms(lo: number, hi: number) {
    if (lo >= hi) { sorted.add(lo); return; }
    const mid = Math.floor((lo + hi) / 2);
    ms(lo, mid); ms(mid + 1, hi);
    merge(lo, mid, hi);
    if (lo === 0 && hi === arr.length - 1) for (let i = 0; i < arr.length; i++) sorted.add(i);
  }
  ms(0, arr.length - 1);
  return steps;
}

export type ClientSortFn = (input: number[]) => SortStep[];
export const CLIENT_SORTERS: Record<string, ClientSortFn> = {
  bubble: bubbleSortClient,
  selection: selectionSortClient,
  insertion: insertionSortClient,
  quick: quickSortClient,
  merge: mergeSortClient,
};
