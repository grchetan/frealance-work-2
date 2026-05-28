export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  created_at?: string;
}

export interface Address {
  id: number;
  user_id: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: number; // 0 or 1
  created_at?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image_url: string;
  spice_level: number; // 1 to 5
  stock_quantity: number;
  weight_options: string[]; // parsed from JSON string array
  ingredients: string;
  is_featured: boolean;
  average_rating: number;
  review_count: number;
  reviews?: Review[];
  created_at?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  weight: string;
  name?: string; // joined
  image_url?: string; // joined
}

export interface Order {
  id: number;
  user_id: string;
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  shipping_amount: number;
  status: 'pending' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: 'UPI' | 'CARD' | 'COD';
  transaction_id?: string;
  shipping_address: Address; // parsed from JSON
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  user_name?: string; // joined for admin
  user_email?: string; // joined for admin
  payment?: Payment | null;
}

export interface Payment {
  id: number;
  order_id: number;
  transaction_id: string;
  amount: number;
  payment_method: string;
  status: 'success' | 'failed' | 'refunded';
  created_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_name: string; // joined
  rating: number;
  comment: string;
  created_at: string;
}

export interface DashboardKPIs {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockAlerts: number;
}

export interface AnalyticsData {
  summary: DashboardKPIs;
  recentOrders: {
    id: number;
    total_amount: number;
    status: string;
    payment_status: string;
    created_at: string;
    user_name: string;
  }[];
  categoryBreakdown: {
    category: string;
    sales: number;
  }[];
  salesTrend: {
    label: string;
    sales: number;
  }[];
  lowStockProducts: {
    id: number;
    name: string;
    stock_quantity: number;
    price: number;
    category: string;
  }[];
}
