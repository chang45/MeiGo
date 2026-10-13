import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Category, Merchant, MerchantStatus, StatisticsOverview } from '../types/admin';

interface ApiEnvelope<T> {
  code: number;
  message: string | string[];
  data: T;
}

const http = axios.create({ baseURL: '/api', timeout: 10000 });

async function unwrap<T>(request: Promise<AxiosResponse<ApiEnvelope<T>>>): Promise<T> {
  const response = await request;
  if (response.data.code !== 0) {
    throw new Error(Array.isArray(response.data.message) ? response.data.message.join('；') : response.data.message);
  }
  return response.data.data;
}

function getData<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return unwrap<T>(http.get<ApiEnvelope<T>>(url, config));
}

function postData<T>(url: string, body?: unknown): Promise<T> {
  return unwrap<T>(http.post<ApiEnvelope<T>>(url, body));
}

function patchData<T>(url: string, body?: unknown): Promise<T> {
  return unwrap<T>(http.patch<ApiEnvelope<T>>(url, body));
}

async function deleteData(url: string): Promise<void> {
  await unwrap<unknown>(http.delete<ApiEnvelope<unknown>>(url));
}

/** 从 axios 错误或普通错误中提取可展示信息。 */
export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiEnvelope<unknown> | undefined;
    if (payload?.message) {
      return Array.isArray(payload.message) ? payload.message.join('；') : String(payload.message);
    }
    return error.message;
  }
  return error instanceof Error ? error.message : '请求失败';
}

export function fetchStatistics(): Promise<StatisticsOverview> {
  return getData<StatisticsOverview>('/admin/statistics/overview');
}

export function fetchMerchants(status?: MerchantStatus): Promise<Merchant[]> {
  return getData<Merchant[]>('/admin/merchants', status ? { params: { status } } : undefined);
}

export function reviewMerchant(id: number, body: { approve: boolean; reason?: string }): Promise<Merchant> {
  return postData<Merchant>(`/admin/merchants/${id}/review`, body);
}

export function applyMerchant(body: {
  name: string;
  contactName: string;
  phone: string;
  address: string;
  description?: string;
}): Promise<Merchant> {
  return postData<Merchant>('/merchants/apply', body);
}

export function fetchCategories(): Promise<Category[]> {
  return getData<Category[]>('/admin/categories');
}

export interface CategoryInput {
  name: string;
  icon?: string;
  sort?: number;
  enabled?: boolean;
}

export function createCategory(body: CategoryInput): Promise<Category> {
  return postData<Category>('/admin/categories', body);
}

export function updateCategory(id: number, body: Partial<CategoryInput>): Promise<Category> {
  return patchData<Category>(`/admin/categories/${id}`, body);
}

export function deleteCategory(id: number): Promise<void> {
  return deleteData(`/admin/categories/${id}`);
}
