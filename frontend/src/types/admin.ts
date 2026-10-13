export type MerchantStatus = 'pending' | 'approved' | 'rejected';

export interface Category {
  id: number;
  name: string;
  icon: string | null;
  sort: number;
  enabled: boolean;
  createTime: string;
  updateTime: string;
}

export interface Merchant {
  id: number;
  name: string;
  contactName: string;
  phone: string;
  address: string;
  description: string | null;
  status: MerchantStatus;
  rejectReason: string | null;
  reviewedAt: string | null;
  createTime: string;
  updateTime: string;
}

export interface StatisticsOverview {
  totalMerchants: number;
  pendingMerchants: number;
  approvedMerchants: number;
  rejectedMerchants: number;
  totalCategories: number;
  enabledCategories: number;
  todayOrders: number;
  todayRevenue: number;
}
