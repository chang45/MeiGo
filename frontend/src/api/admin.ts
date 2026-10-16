import http, { type ApiEnvelope, unwrap } from './http';
import type { Category, Merchant, MerchantStatus, StatisticsOverview } from '../types/admin';

export { errorMessage } from './http';

export function fetchStatistics(): Promise<StatisticsOverview> {
  return http.get<ApiEnvelope<StatisticsOverview>>('/admin/statistics/overview').then(unwrap);
}

export function fetchMerchants(status?: MerchantStatus): Promise<Merchant[]> {
  return http
    .get<ApiEnvelope<Merchant[]>>('/admin/merchants', status ? { params: { status } } : undefined)
    .then(unwrap);
}

export function reviewMerchant(id: number, body: { approve: boolean; reason?: string }): Promise<Merchant> {
  return http.post<ApiEnvelope<Merchant>>(`/admin/merchants/${id}/review`, body).then(unwrap);
}

export function applyMerchant(body: {
  name: string;
  contactName: string;
  phone: string;
  address: string;
  description?: string;
}): Promise<Merchant> {
  return http.post<ApiEnvelope<Merchant>>('/merchants/apply', body).then(unwrap);
}

export function fetchMyStore(): Promise<Merchant | null> {
  return http.get<ApiEnvelope<Merchant | null>>('/merchants/me').then(unwrap);
}

export function fetchCategories(): Promise<Category[]> {
  return http.get<ApiEnvelope<Category[]>>('/admin/categories').then(unwrap);
}

export interface CategoryInput {
  name: string;
  icon?: string;
  sort?: number;
  enabled?: boolean;
}

export function createCategory(body: CategoryInput): Promise<Category> {
  return http.post<ApiEnvelope<Category>>('/admin/categories', body).then(unwrap);
}

export function updateCategory(id: number, body: Partial<CategoryInput>): Promise<Category> {
  return http.patch<ApiEnvelope<Category>>(`/admin/categories/${id}`, body).then(unwrap);
}

export function deleteCategory(id: number): Promise<void> {
  return http.delete<ApiEnvelope<null>>(`/admin/categories/${id}`).then(() => undefined);
}
