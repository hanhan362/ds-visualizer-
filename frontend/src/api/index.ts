import axios from 'axios';
import type { AlgorithmMeta, SortRequest, SortResponse } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

/** 获取所有算法元信息 */
export async function fetchAlgorithms(): Promise<AlgorithmMeta[]> {
  const { data } = await api.get<AlgorithmMeta[]>('/algorithms');
  return data;
}

/** 运行排序算法 */
export async function runSort(
  algorithmId: string,
  request: SortRequest,
): Promise<SortResponse> {
  const { data } = await api.post<SortResponse>(
    `/sort/${algorithmId}`,
    request,
  );
  return data;
}

/** 获取执行历史 */
export async function fetchHistory(algorithmId?: string): Promise<SortResponse[]> {
  const params = algorithmId ? { algorithm: algorithmId } : {};
  const { data } = await api.get<SortResponse[]>('/sort/history', { params });
  return data;
}
