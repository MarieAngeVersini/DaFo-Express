export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'picked_up'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'orange' | 'card' | 'cash';

export type OrderType = 'delivery' | 'pickup';

export type CartItem = {
  id?: string;
  restaurantId?: string;
  restaurantName?: string;
  name: string;
  price: string | number;
  quantity?: number;
};

export type Order = {
  id: string;
  order_number: string;
  restaurant_id: string | null;
  restaurant_name: string;
  customer_id: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  order_type: OrderType;
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_code: string;
  delivery_address: string | null;
  created_at: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  name: string;
  price: number;
  quantity: number;
};
