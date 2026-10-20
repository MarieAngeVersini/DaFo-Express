export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  rating: number;
  delivery_time: string;
  price_level: string;
  address: string;
  image_color: string;
  icon: string;
};

export type MenuItem = {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
};

export const categories: Category[] = [
  { id: '11111111-1111-4111-8111-111111111111', name: 'Pizza', icon: 'pizza' },
  { id: '22222222-2222-4222-8222-222222222222', name: 'Burger', icon: 'fast-food' },
  { id: '33333333-3333-4333-8333-333333333333', name: 'Sushi', icon: 'fish' },
  { id: '44444444-4444-4444-8444-444444444444', name: 'Coffee', icon: 'cafe' },
];

export const restaurants: Restaurant[] = [
  {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    name: 'The Burger Palace',
    slug: 'burger-palace',
    category_id: categories[1].id,
    rating: 4.8,
    delivery_time: '15-25 min',
    price_level: '$',
    address: 'Kaloum, Conakry',
    image_color: '#EAD2C6',
    icon: 'fast-food',
  },
  {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    name: 'Pizza Hut',
    slug: 'pizza-hut',
    category_id: categories[0].id,
    rating: 4.5,
    delivery_time: '20-30 min',
    price_level: '$',
    address: 'Dixinn, Conakry',
    image_color: '#F0DFD3',
    icon: 'pizza',
  },
];

export const menuItems: MenuItem[] = [
  {
    id: 'b1',
    restaurant_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    name: 'Classic Cheeseburger',
    description: 'Beef, cheddar, pickles, and our secret sauce.',
    price: 12,
  },
  {
    id: 'b2',
    restaurant_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    name: 'Bacon Deluxe',
    description: 'Double patty with crispy bacon and BBQ sauce.',
    price: 14.5,
  },
  {
    id: 'b3',
    restaurant_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    name: 'Truffle Fries',
    description: 'Hand-cut fries with truffle oil and parmesan.',
    price: 6,
  },
  {
    id: 'p1',
    restaurant_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    name: 'Pepperoni Feast',
    description: 'Loaded with pepperoni and extra mozzarella.',
    price: 18,
  },
  {
    id: 'p2',
    restaurant_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    name: 'Veggie Supreme',
    description: 'Fresh peppers, onions, mushrooms, and olives.',
    price: 16,
  },
  {
    id: 'p3',
    restaurant_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    name: 'Garlic Breadsticks',
    description: 'Baked fresh with garlic butter dipping sauce.',
    price: 5.5,
  },
];

export function formatMoney(amount: number) {
  return `$${amount.toFixed(2)}`;
}
