import { ref, onUnmounted } from 'vue';

export interface GNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
}

export interface GEdge {
  from: string;
  to: string;
  weight?: number;
}

export interface GraphStep {
  nodes: GNode[];
  edges: GEdge[];
  description: string;
}

const MIN_SPEED = 50;
const MAX_SPEED = 2000;

export function useGraphPlayer() {
  const state = ref<'idle' | 'running' | 'paused' | 'done'>('idle');
  const steps = ref<GraphStep[]>([]);
  const index = ref(0);
  const speed = ref(500);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const currentStep = () => (index.value < steps.value.length ? steps.value[index.value] : null);
  const progress = () => (steps.value.length > 0 ? (index.value / steps.value.length) * 100 : 0);

  function loadSteps(s: GraphStep[]) { stopTimer(); steps.value = s; index.value = 0; state.value = 'idle'; }
  function play() { if (state.value === 'done') index.value = 0; state.value = 'running'; schedule(); }
  function schedule() {
    stopTimer();
    timer = setTimeout(() => {
      if (index.value < steps.value.length - 1) { index.value++; schedule(); }
      else state.value = 'done';
    }, MAX_SPEED - speed.value + MIN_SPEED);
  }
  function pause() { stopTimer(); state.value = 'paused'; }
  function reset() { stopTimer(); index.value = 0; state.value = 'idle'; }
  function stopTimer() { if (timer !== null) { clearTimeout(timer); timer = null; } }
  function setSpeed(s: number) { speed.value = Math.min(MAX_SPEED, Math.max(MIN_SPEED, s)); }
  onUnmounted(() => stopTimer());

  return { state, index, speed, currentStep, progress, loadSteps, play, pause, reset, setSpeed };
}

/** 演示图 */
export const DEMO_NODES: GNode[] = [
  { id: 'A', label: 'A', x: 400, y: 50 },
  { id: 'B', label: 'B', x: 200, y: 150 },
  { id: 'C', label: 'C', x: 600, y: 150 },
  { id: 'D', label: 'D', x: 100, y: 260 },
  { id: 'E', label: 'E', x: 400, y: 260 },
  { id: 'F', label: 'F', x: 700, y: 260 },
];

export const DEMO_EDGES: GEdge[] = [
  { from: 'A', to: 'B', weight: 2 },
  { from: 'A', to: 'C', weight: 4 },
  { from: 'B', to: 'D', weight: 7 },
  { from: 'B', to: 'E', weight: 3 },
  { from: 'C', to: 'E', weight: 1 },
  { from: 'C', to: 'F', weight: 5 },
];

const adj: Record<string, string[]> = {};
DEMO_EDGES.forEach(e => {
  if (!adj[e.from]) adj[e.from] = [];
  if (!adj[e.to]) adj[e.to] = [];
  adj[e.from].push(e.to);
  adj[e.to].push(e.from);
});

/** BFS 步骤生成 */
export function generateBFSSteps(start: string): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<string>();
  const queue = [start];
  visited.add(start);

  steps.push(makeStep(visited, setToArr(visited), `BFS 开始 — 从 ${start} 出发`));

  while (queue.length > 0) {
    const cur = queue.shift()!;
    steps.push(makeStep(visited, [cur], `BFS — 访问 ${cur}`));

    for (const nb of (adj[cur] || [])) {
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
        steps.push(makeStep(visited, [cur, nb], `BFS — 发现邻接节点 ${nb}，入队`));
      }
    }
  }
  steps.push(makeStep(visited, [], `BFS 完成 — 共访问 ${visited.size} 个节点`));
  return steps;
}

/** DFS 步骤生成 */
export function generateDFSSteps(start: string): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<string>();

  function dfs(node: string) {
    visited.add(node);
    steps.push(makeStep(visited, [node], `DFS — 访问 ${node}，深度深入`));
    for (const nb of (adj[node] || [])) {
      if (!visited.has(nb)) dfs(nb);
    }
    steps.push(makeStep(visited, [node], `DFS — ${node} 回溯`));
  }

  steps.push(makeStep(new Set(), [], `DFS 开始 — 从 ${start} 出发`));
  dfs(start);
  steps.push(makeStep(visited, [], `DFS 完成 — 共访问 ${visited.size} 个节点`));
  return steps;
}

function makeStep(visited: Set<string>, current: string[], desc: string): GraphStep {
  return {
    nodes: DEMO_NODES.map(n => {
      let color = '#6366f1';
      if (current.includes(n.id)) color = '#f43f5e';
      else if (visited.has(n.id)) color = '#10b981';
      return { ...n, color };
    }),
    edges: DEMO_EDGES,
    description: desc,
  };
}

function setToArr(s: Set<string>): string[] { return Array.from(s); }
