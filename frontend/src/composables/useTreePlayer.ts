import { ref, onUnmounted } from 'vue';

export interface TreeNode {
  value: number;
  x: number;
  y: number;
  highlight?: boolean;
}

export interface TreeEdge {
  from: number;
  to: number;
}

export interface TreeStep {
  nodes: TreeNode[];
  edges: TreeEdge[];
  description: string;
}

const MIN_SPEED = 50;
const MAX_SPEED = 2000;
const DEFAULT_SPEED = 400;

export function useTreePlayer() {
  const state = ref<'idle' | 'running' | 'paused' | 'done'>('idle');
  const steps = ref<TreeStep[]>([]);
  const index = ref(0);
  const speed = ref(DEFAULT_SPEED);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const currentStep = () => (index.value < steps.value.length ? steps.value[index.value] : null);
  const progress = () => (steps.value.length > 0 ? (index.value / steps.value.length) * 100 : 0);

  function loadSteps(s: TreeStep[]) {
    stop();
    steps.value = s;
    index.value = 0;
    state.value = 'idle';
  }

  function play() {
    if (state.value === 'done') index.value = 0;
    state.value = 'running';
    schedule();
  }

  function schedule() {
    stopTimer();
    timer = setTimeout(() => {
      if (index.value < steps.value.length - 1) { index.value++; schedule(); }
      else state.value = 'done';
    }, MAX_SPEED - speed.value + MIN_SPEED);
  }

  function pause() { stopTimer(); state.value = 'paused'; }
  function reset() { stopTimer(); index.value = 0; state.value = 'idle'; }
  function stop() { stopTimer(); }
  function stopTimer() { if (timer !== null) { clearTimeout(timer); timer = null; } }
  function setSpeed(s: number) { speed.value = Math.min(MAX_SPEED, Math.max(MIN_SPEED, s)); }
  onUnmounted(() => stopTimer());

  return { state, index, speed, currentStep, progress, loadSteps, play, pause, reset, setSpeed };
}

/** 构建一个演示用的 BST（固定结构） */
export function buildDemoBST(): { value: number; left: any; right: any } {
  return {
    value: 50,
    left: {
      value: 30,
      left: { value: 20, left: null, right: null },
      right: { value: 40, left: null, right: null },
    },
    right: {
      value: 70,
      left: { value: 60, left: null, right: null },
      right: { value: 80, left: null, right: null },
    },
  };
}

/** 计算节点坐标 */
export function layoutTree(root: any): TreeNode[] {
  const nodes: TreeNode[] = [];
  const levels: number[][] = [];

  function dfs(node: any, depth: number) {
    if (!node) return;
    if (!levels[depth]) levels[depth] = [];
    levels[depth].push(node.value);
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  }
  dfs(root, 0);

  // 分配坐标
  const vGap = 70;
  const positions: Record<number, { x: number; y: number }> = {};

  function assign(node: any, depth: number, left: number, right: number) {
    if (!node) return;
    const mid = (left + right) / 2;
    positions[node.value] = { x: mid, y: 60 + depth * vGap };
    assign(node.left, depth + 1, left, mid);
    assign(node.right, depth + 1, mid, right);
  }
  assign(root, 0, 50, 750);

  function collect(node: any) {
    if (!node) return;
    nodes.push({ value: node.value, x: positions[node.value].x, y: positions[node.value].y });
    collect(node.left);
    collect(node.right);
  }
  collect(root);

  return nodes;
}

export function getEdges(root: any): TreeEdge[] {
  const edges: TreeEdge[] = [];
  function dfs(node: any) {
    if (!node) return;
    if (node.left) { edges.push({ from: node.value, to: node.left.value }); dfs(node.left); }
    if (node.right) { edges.push({ from: node.value, to: node.right.value }); dfs(node.right); }
  }
  dfs(root);
  return edges;
}

/** 生成遍历动画步骤 */
export function generateTraversalSteps(
  root: any,
  order: 'preorder' | 'inorder' | 'postorder',
): TreeStep[] {
  const allNodes = layoutTree(root);
  const allEdges = getEdges(root);
  const traversalOrder: number[] = [];

  function traverse(node: any) {
    if (!node) return;
    if (order === 'preorder') { traversalOrder.push(node.value); traverse(node.left); traverse(node.right); }
    else if (order === 'inorder') { traverse(node.left); traversalOrder.push(node.value); traverse(node.right); }
    else if (order === 'postorder') { traverse(node.left); traverse(node.right); traversalOrder.push(node.value); }
  }
  traverse(root);

  const steps: TreeStep[] = [];
  // Step 0: 初始状态
  steps.push({
    nodes: allNodes.map(n => ({ ...n, highlight: false })),
    edges: allEdges,
    description: `初始 BST 树 — 准备 ${order === 'preorder' ? '前序' : order === 'inorder' ? '中序' : '后序'}遍历`,
  });

  // 逐步高亮
  const highlighted = new Set<number>();
  for (let i = 0; i < traversalOrder.length; i++) {
    highlighted.add(traversalOrder[i]);
    steps.push({
      nodes: allNodes.map(n => ({ ...n, highlight: highlighted.has(n.value) })),
      edges: allEdges,
      description: `${order === 'preorder' ? '前序' : order === 'inorder' ? '中序' : '后序'}遍历 — 访问节点 ${traversalOrder[i]}（第 ${i + 1}/${traversalOrder.length} 步）`,
    });
  }

  return steps;
}
