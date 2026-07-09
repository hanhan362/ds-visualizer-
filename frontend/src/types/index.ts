/** 排序算法单步快照 */
export interface SortStep {
  array: number[];
  compared: [number, number];
  swapped: [number, number];
  sorted: number[];
  comparisons: number;
  swaps: number;
}

/** 算法元信息 */
export interface AlgorithmMeta {
  id: string;
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  stable: boolean;
}

/** POST /api/sort/{algorithm} 请求体 */
export interface SortRequest {
  array: number[];
}

/** POST /api/sort/{algorithm} 响应体 */
export interface SortResponse {
  algorithm: string;
  steps: SortStep[];
  stats: {
    comparisons: number;
    swaps: number;
    timeMs: number;
  };
}

/** 动画播放状态 */
export type AnimState = 'idle' | 'running' | 'paused' | 'done';
