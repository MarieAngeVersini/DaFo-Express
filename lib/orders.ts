import { supabase } from './supabase';
import { CartItem, OrderType, PaymentMethod } from './types';

const DEFAULT_RESTAURANT_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const DEFAULT_RESTAURANT_NAME = 'The Burger Palace';

function parsePrice(price: string | number) {
  if (typeof price === 'number') return price;
  return Number(price.replace('$', '')) || 0;
}

function generateDeliveryCode() {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
}

function buildOrderNumber() {
  const shortId = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DF-${new Date().getFullYear()}-${shortId}`;
}

export async function createOrderFromCart({
  cartItems,
  paymentMethod,
  orderType,
  deliveryAddress,
}: {
  cartItems: CartItem[];
  paymentMethod: PaymentMethod;
  orderType: OrderType;
  deliveryAddress?: string;
}) {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    throw new Error('Please log in before placing an order.');
  }

  if (cartItems.length === 0) {
    throw new Error('Your basket is empty.');
  }

  const grouped = new Map<string, CartItem & { quantity: number; numericPrice: number }>();

  cartItems.forEach((item) => {
    const key = item.id || item.name;
    const existing = grouped.get(key);
    if (existing) {
      existing.quantity += item.quantity || 1;
      return;
    }

    grouped.set(key, {
      ...item,
      quantity: item.quantity || 1,
      numericPrice: parsePrice(item.price),
    });
  });

  const items = Array.from(grouped.values());
  const subtotal = items.reduce((sum, item) => sum + item.numericPrice * item.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? 0.99 : 0;
  const deliveryCode = generateDeliveryCode();

  const orderPayload = {
    order_number: buildOrderNumber(),
    restaurant_id: items[0]?.restaurantId || DEFAULT_RESTAURANT_ID,
    restaurant_name: items[0]?.restaurantName || DEFAULT_RESTAURANT_NAME,
    customer_id: authData.user.id,
    status: 'placed',
    payment_method: paymentMethod,
    order_type: orderType,
    subtotal,
    delivery_fee: deliveryFee,
    total: subtotal + deliveryFee,
    delivery_code: deliveryCode,
    delivery_address: deliveryAddress || 'Dixinn, Conakry',
  };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderPayload)
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItemsPayload = items.map((item) => ({
    order_id: order.id,
    menu_item_id: item.id && item.id.length > 8 ? item.id : null,
    name: item.name,
    price: item.numericPrice,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);
  if (itemsError) throw itemsError;

  return { ...order, order_items: orderItemsPayload, delivery_code: deliveryCode };
}

export async function getMyOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
