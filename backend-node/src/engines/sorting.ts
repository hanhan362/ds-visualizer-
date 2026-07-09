interface SortStep {
  array: number[];
  compared: [number, number];
  swapped: [number, number];
  sorted: number[];
  comparisons: number;
  swaps: number;
}

function step(arr: number[], compared: [number,number], swapped: [number,number], sorted: number[], comp: number, swap: number): SortStep {
  return { array: [...arr], compared, swapped, sorted: [...sorted], comparisons: comp, swaps: swap };
}

function bubbleSort(input: number[]): SortStep[] {
  const a = [...input], n = a.length, sorted: number[] = [], steps: SortStep[] = [];
  let c = 0, s = 0;
  for (let i = 0; i < n - 1; i++) {
    let flag = false;
    for (let j = 0; j < n - 1 - i; j++) {
      c++; steps.push(step(a, [j, j+1], [-1,-1], sorted, c, s));
      if (a[j] > a[j+1]) { [a[j], a[j+1]] = [a[j+1], a[j]]; s++; flag = true; steps.push(step(a, [j, j+1], [j, j+1], sorted, c, s)); }
    }
    sorted.push(n - 1 - i);
    if (!flag) { for (let k = n - 2 - i; k >= 0; k--) sorted.push(k); break; }
  }
  return steps;
}

function selectionSort(input: number[]): SortStep[] {
  const a = [...input], n = a.length, sorted: number[] = [], steps: SortStep[] = [];
  let c = 0, s = 0;
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) { c++; steps.push(step(a, [min, j], [-1,-1], sorted, c, s)); if (a[j] < a[min]) min = j; }
    if (min !== i) { [a[i], a[min]] = [a[min], a[i]]; s++; steps.push(step(a, [i, min], [i, min], sorted, c, s)); }
    sorted.push(i);
  }
  sorted.push(n - 1);
  return steps;
}

function insertionSort(input: number[]): SortStep[] {
  const a = [...input], n = a.length, sorted = [0], steps: SortStep[] = [];
  let c = 0, s = 0;
  for (let i = 1; i < n; i++) {
    const key = a[i]; let j = i - 1;
    while (j >= 0) { c++; steps.push(step(a, [j, j+1], [-1,-1], sorted, c, s)); if (a[j] > key) { a[j+1] = a[j]; s++; steps.push(step(a, [j, j+1], [j, j+1], sorted, c, s)); j--; } else break; }
    a[j+1] = key; sorted.push(i);
  }
  return steps;
}

function quickSort(input: number[]): SortStep[] {
  const a = [...input], sorted = new Set<number>(), steps: SortStep[] = [];
  let c = 0, s = 0;
  function part(lo: number, hi: number): number {
    const pivot = a[hi]; let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      c++; steps.push(step(a, [j, hi], [-1,-1], [...sorted], c, s));
      if (a[j] < pivot) { i++; [a[i], a[j]] = [a[j], a[i]]; s++; steps.push(step(a, [i, j], [i, j], [...sorted], c, s)); }
    }
    [a[i+1], a[hi]] = [a[hi], a[i+1]];
    if (i + 1 !== hi) { s++; steps.push(step(a, [i+1, hi], [i+1, hi], [...sorted], c, s)); }
    sorted.add(i + 1); return i + 1;
  }
  function qs(lo: number, hi: number) {
    if (lo >= hi) { sorted.add(lo); return; }
    const pi = part(lo, hi);
    pi - 1 > lo ? qs(lo, pi - 1) : sorted.add(lo);
    pi + 1 < hi ? qs(pi + 1, hi) : sorted.add(hi);
  }
  qs(0, a.length - 1);
  return steps;
}

function mergeSort(input: number[]): SortStep[] {
  const a = [...input], aux = [...a], sorted = new Set<number>(), steps: SortStep[] = [];
  let c = 0, s = 0;
  function merge(lo: number, mid: number, hi: number) {
    for (let k = lo; k <= hi; k++) aux[k] = a[k];
    let i = lo, j = mid + 1;
    for (let k = lo; k <= hi; k++) {
      if (i > mid) { a[k] = aux[j++]; s++; }
      else if (j > hi) { a[k] = aux[i++]; s++; }
      else {
        c++; steps.push(step(a, [i, j], [-1,-1], [...sorted], c, s));
        a[k] = aux[i] <= aux[j] ? aux[i++] : aux[j++]; s++;
        steps.push(step(a, [i-1, j-1], [-1, k], [...sorted], c, s));
      }
    }
  }
  function ms(lo: number, hi: number) {
    if (lo >= hi) { sorted.add(lo); return; }
    const mid = Math.floor((lo + hi) / 2);
    ms(lo, mid); ms(mid + 1, hi); merge(lo, mid, hi);
    if (lo === 0 && hi === a.length - 1) for (let i = 0; i < a.length; i++) sorted.add(i);
  }
  ms(0, a.length - 1);
  return steps;
}

const engines: Record<string, (a: number[]) => SortStep[]> = { bubble: bubbleSort, selection: selectionSort, insertion: insertionSort, quick: quickSort, merge: mergeSort };

export function runSortEngine(id: string, input: number[]): SortStep[] {
  const fn = engines[id];
  if (!fn) throw new Error('Unknown algorithm: ' + id);
  return fn(input);
}
