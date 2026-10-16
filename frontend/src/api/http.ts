import axios from 'axios';

export interface ApiEnvelope<T> {
  code: number;
  message: string | string[];
  data: T;
}

const http = axios.create({ baseURL: '/api', timeout: 10000 });

http.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('meigo-auth');
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { token?: string } };
      const token = parsed.state?.token;
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }
  } catch {
    // 本地存储不可用时忽略，按未登录处理
  }
  return config;
});

export function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data;
}

export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiEnvelope<unknown> | undefined;
    if (payload?.message) {
      return Array.isArray(payload.message) ? payload.message.join('，') : String(payload.message);
    }
    return error.message;
  }
  return error instanceof Error ? error.message : '请求失败';
}

export default http;
