export type OrderStatus = 'pending' | 'accepted' | 'delivering' | 'completed';

export interface Order {
  id: number;
  orderNo: string;
  merchantName: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  status: OrderStatus;
  createTime: string;
  acceptedAt: string | null;
  deliveredAt: string | null;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: '待接单',
  accepted: '已接单',
  delivering: '配送中',
  completed: '已送达',
};
