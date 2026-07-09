import axios from 'axios';
import { ElMessage } from 'element-plus';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({ baseURL: API_URL, timeout: 30000 });

// 请求拦截器：自动带 Token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 响应拦截器：处理 R 格式 + 401 跳转
api.interceptors.response.use(
  res => {
    const d = res.data;
    if (d && typeof d.code === 'number') {
      if (d.code === 200) return { ...res, data: d.data };
      return Promise.reject(new Error(d.message || d.msg || '请求失败'));
    }
    return res;
  },
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      ElMessage.error('登录已过期，请重新登录');
      setTimeout(() => { window.location.hash = '#/login'; }, 500);
    }
    return Promise.reject(err);
  },
);

export default api;
