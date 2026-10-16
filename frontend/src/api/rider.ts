import http, { type ApiEnvelope, unwrap } from './http';
import type { Order } from '../types/order';

export { errorMessage } from './http';

export function fetchAvailableOrders(): Promise<Order[]> {
  return http.get<ApiEnvelope<Order[]>>('/rider/orders/available').then(unwrap);
}

export function fetchMyDeliveries(): Promise<Order[]> {
  return http.get<ApiEnvelope<Order[]>>('/rider/orders/mine').then(unwrap);
}

export function fetchDeliveryHistory(): Promise<Order[]> {
  return http.get<ApiEnvelope<Order[]>>('/rider/orders/history').then(unwrap);
}

export function acceptOrder(id: number): Promise<Order> {
  return http.post<ApiEnvelope<Order>>(`/rider/orders/${id}/accept`).then(unwrap);
}

export function updateOrderStatus(id: number, status: 'delivering' | 'completed'): Promise<Order> {
  return http.post<ApiEnvelope<Order>>(`/rider/orders/${id}/status`, { status }).then(unwrap);
}
