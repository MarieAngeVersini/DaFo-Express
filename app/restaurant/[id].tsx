import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { formatMoney, menuItems, restaurants } from '@/lib/mockData';
import { MenuItem, Restaurant } from '@/lib/mockData';

const COLORS = {
  DARK_BROWN: '#2C1810',
  ORANGE: '#C06C3A',
  CREAM: '#F7F0E8',
  CARD_CREAM: '#FBF6F1',
  TEXT_GREY: '#8D7B75',
};

export default function RestaurantMenuScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [cartCount, setCartCount] = useState(0);
  const fallbackRestaurant =
    restaurants.find((item) => item.slug === id) || restaurants[0];
  const [restaurant, setRestaurant] = useState<Restaurant>(fallbackRestaurant);
  const [items, setItems] = useState<MenuItem[]>(
    menuItems.filter((item) => item.restaurant_id === fallbackRestaurant.id),
  );

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        const { data: restaurantData } = await supabase
          .from('restaurants')
          .select('*')
          .eq('slug', id)
          .single();

        if (!restaurantData) return;

        setRestaurant(restaurantData);

        const { data: itemData } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantData.id)
          .eq('is_available', true)
          .order('name');

        if (itemData?.length) setItems(itemData);
      } catch {
        console.warn('Using demo menu because Supabase is not reachable yet.');
      }
    };

    loadRestaurant();
  }, [id]);

  const addToCart = (item: MenuItem) => {
    setCartCount((prev) => prev + 1);
    if (!(global as any).cartItems) (global as any).cartItems = [];
    (global as any).cartItems.push({
      id: item.id,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      name: item.name,
      price: item.price,
    });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.heroImage, { backgroundColor: restaurant.image_color }]}>
        <SafeAreaView>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.DARK_BROWN} />
          </TouchableOpacity>
        </SafeAreaView>
        <View style={{ alignItems: 'center', marginTop: -20 }}>
          <Ionicons name={restaurant.icon as any} size={80} color={COLORS.ORANGE} />
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.infoSection}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>
              {restaurant.rating} stars • {restaurant.delivery_time} • {restaurant.price_level}
            </Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.menuItem}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
                <Text style={styles.itemPrice}>{formatMoney(Number(item.price))}</Text>
              </View>
              <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                <Ionicons name="add" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {cartCount > 0 && (
        <TouchableOpacity style={styles.cartBar} onPress={() => router.push('/basket')}>
          <View style={styles.cartCountCircle}>
            <Text style={styles.cartCountText}>{cartCount}</Text>
          </View>
          <Text style={styles.cartBarText}>View Basket</Text>
          <Text style={styles.cartBarPrice}>Review</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.CREAM },
  container: { flex: 1 },
  heroImage: { width: '100%', height: 200, justifyContent: 'flex-start' },
  backButton: { marginLeft: 20, marginTop: 10, backgroundColor: COLORS.CREAM, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  infoSection: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#EAD2C6' },
  restaurantName: { fontSize: 28, fontWeight: 'bold', color: COLORS.DARK_BROWN },
  detailsRow: { flexDirection: 'row', marginTop: 8, alignItems: 'center' },
  detailText: { fontSize: 14, color: COLORS.TEXT_GREY, fontWeight: '500' },
  menuSection: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: COLORS.DARK_BROWN },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, backgroundColor: COLORS.CARD_CREAM, padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#EAD2C6' },
  itemName: { fontSize: 16, fontWeight: 'bold', color: COLORS.DARK_BROWN, marginBottom: 4 },
  itemDesc: { fontSize: 12, color: COLORS.TEXT_GREY, marginBottom: 8 },
  itemPrice: { fontSize: 15, fontWeight: 'bold', color: COLORS.ORANGE },
  addButton: { backgroundColor: COLORS.ORANGE, width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cartBar: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: COLORS.DARK_BROWN, padding: 18, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  cartCountCircle: { backgroundColor: COLORS.ORANGE, width: 25, height: 25, borderRadius: 12.5, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  cartCountText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  cartBarText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, flex: 1 },
  cartBarPrice: { color: '#FFF', fontSize: 14, opacity: 0.8 },
});
