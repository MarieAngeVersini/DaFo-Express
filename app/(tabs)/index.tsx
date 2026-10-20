import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import {
  categories as fallbackCategories,
  restaurants as fallbackRestaurants,
} from '@/lib/mockData';

const COLORS = {
  DARK_BROWN: '#2C1810',
  ORANGE: '#C06C3A',
  CREAM: '#F7F0E8',
  CARD_CREAM: '#FBF6F1',
  TEXT_INACTIVE: '#8D7B75',
};

export default function HomeScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState(fallbackCategories);
  const [restaurants, setRestaurants] = useState(fallbackRestaurants);
  const userName = (global as any).userName || 'Guest';

  useEffect(() => {
    const count = (global as any).cartItems?.length || 0;
    setCartCount(count);
  }, [isFocused]);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [{ data: categoryData }, { data: restaurantData }] = await Promise.all([
          supabase.from('categories').select('*').order('name'),
          supabase
            .from('restaurants')
            .select('*')
            .eq('is_open', true)
            .order('rating', { ascending: false }),
        ]);

        if (categoryData?.length) setCategories(categoryData);
        if (restaurantData?.length) setRestaurants(restaurantData);
      } catch {
        console.warn('Using demo catalog because Supabase is not reachable yet.');
      }
    };

    loadCatalog();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Hello, {userName}</Text>
          <Text style={styles.locationText}>Delivery to Conakry</Text>
        </View>
        <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/basket')}>
          <Ionicons name="bag-handle-outline" size={26} color={COLORS.DARK_BROWN} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.bannerContainer}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>DaFo Express</Text>
            <Text style={styles.bannerSubtitle}>Delicious meals, delivered.</Text>
          </View>
          <Ionicons name="fast-food" size={50} color={COLORS.ORANGE} style={{ opacity: 0.9 }} />
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.categoryItem}>
                <View style={styles.categoryIconCircle}>
                  <Ionicons name={item.icon as any} size={24} color={COLORS.DARK_BROWN} />
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        </View>

        <View style={styles.restaurantSection}>
          <Text style={styles.sectionTitle}>Popular Restaurants</Text>

          {restaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.restaurantCard}
              onPress={() => router.push(`/restaurant/${restaurant.slug}`)}
            >
              <View style={[styles.imagePlaceholder, { backgroundColor: restaurant.image_color }]}>
                <Ionicons name={restaurant.icon as any} size={35} color={COLORS.ORANGE} />
              </View>
              <View style={styles.cardInfo}>
                <View>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <Text style={styles.ratingText}>
                    {restaurant.rating} stars • {restaurant.delivery_time}
                  </Text>
                </View>
                <Text style={styles.priceText}>{restaurant.price_level}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.CREAM },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  greetingText: { fontSize: 14, color: COLORS.TEXT_INACTIVE },
  locationText: { fontSize: 20, fontWeight: 'bold', color: COLORS.DARK_BROWN },
  cartButton: { padding: 5 },
  cartBadge: { position: 'absolute', right: -2, top: -2, backgroundColor: COLORS.ORANGE, borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.CREAM },
  cartBadgeText: { color: COLORS.CREAM, fontSize: 10, fontWeight: 'bold' },
  bannerContainer: { margin: 20, backgroundColor: COLORS.DARK_BROWN, borderRadius: 20, padding: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerTextContainer: { flex: 1 },
  bannerTitle: { color: COLORS.CREAM, fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  bannerSubtitle: { color: COLORS.CREAM, opacity: 0.8, fontSize: 14 },
  categoriesSection: { marginVertical: 10 },
  categoryItem: { alignItems: 'center', marginRight: 20 },
  categoryIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.CARD_CREAM, justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#EAD2C6' },
  categoryName: { fontSize: 13, fontWeight: '600', color: COLORS.DARK_BROWN },
  restaurantSection: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.DARK_BROWN, marginBottom: 15, paddingHorizontal: 20 },
  restaurantCard: { backgroundColor: COLORS.CARD_CREAM, borderRadius: 18, marginBottom: 15, flexDirection: 'row', padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#EAD2C6' },
  imagePlaceholder: { height: 70, width: 70, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  restaurantName: { fontSize: 16, fontWeight: 'bold', color: COLORS.DARK_BROWN, marginBottom: 4 },
  ratingText: { fontSize: 13, fontWeight: '600', color: COLORS.TEXT_INACTIVE },
  priceText: { fontSize: 16, fontWeight: 'bold', color: COLORS.DARK_BROWN },
});
