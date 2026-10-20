import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { getMyOrders } from '@/lib/orders';
import { Order } from '@/lib/types';

const COLORS = {
  DARK_BROWN: '#2C1810',
  ORANGE: '#C06C3A',
  CREAM: '#F7F0E8',
  CARD_CREAM: '#FBF6F1',
  TEXT_GREY: '#8D7B75',
};

const statusLabel: Record<string, string> = {
  placed: 'Order placed',
  accepted: 'Driver accepted',
  preparing: 'Food is being prepared',
  picked_up: 'Driver is on the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function OrdersScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const orders = (await getMyOrders()) as Order[];
        setActiveOrder(
          orders.find((order) => !['delivered', 'cancelled'].includes(order.status)) || null,
        );
        setPastOrders(orders.filter((order) => ['delivered', 'cancelled'].includes(order.status)));
      } catch {
        setActiveOrder(null);
        setPastOrders([]);
      }
    };

    loadOrders();
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Your Orders</Text>

        {activeOrder ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Order</Text>

            <TouchableOpacity style={styles.activeOrderCard} onPress={() => router.push('/tracking')}>
              <View style={styles.activeTopRow}>
                <View>
                  <Text style={[styles.restaurantName, { color: '#FFF' }]}>
                    {activeOrder.restaurant_name}
                  </Text>
                  <Text style={styles.orderId}>{activeOrder.order_number}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>Live</Text>
                </View>
              </View>

              <View style={styles.statusRow}>
                <Ionicons name="time-outline" size={18} color={COLORS.ORANGE} />
                <Text style={styles.statusText}>{statusLabel[activeOrder.status]}</Text>
              </View>

              <Text style={styles.itemsTitle}>Items</Text>
              {activeOrder.order_items?.slice(0, 3).map((item) => (
                <Text key={item.id} style={styles.itemText}>
                  {item.quantity}x {item.name}
                </Text>
              ))}

              <View style={styles.bottomRow}>
                <Text style={styles.totalText}>Total: ${Number(activeOrder.total).toFixed(2)}</Text>
                <Text style={styles.trackText}>Track Order</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={42} color={COLORS.TEXT_GREY} />
            <Text style={styles.emptyTitle}>No active orders</Text>
            <Text style={styles.emptySubtext}>Start exploring restaurants and place your next order.</Text>
            <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/(tabs)')}>
              <Text style={styles.shopButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Orders</Text>

          {pastOrders.length === 0 ? (
            <Text style={styles.emptyPastText}>Completed orders will appear here.</Text>
          ) : (
            pastOrders.map((order) => (
              <View key={order.id} style={styles.pastOrderCard}>
                <View style={styles.pastTopRow}>
                  <View>
                    <Text style={styles.restaurantName}>{order.restaurant_name}</Text>
                    <Text style={styles.orderMeta}>{order.order_number}</Text>
                  </View>
                  <Text style={styles.pastTotal}>${Number(order.total).toFixed(2)}</Text>
                </View>

                <Text style={styles.deliveredText}>{statusLabel[order.status]}</Text>
                <Text style={styles.orderItemsPreview}>
                  {order.order_items?.map((item) => item.name).join(', ')}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.CREAM },
  content: { padding: 20, paddingBottom: 30 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.DARK_BROWN, marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.DARK_BROWN, marginBottom: 14 },
  activeOrderCard: { backgroundColor: COLORS.DARK_BROWN, borderRadius: 20, padding: 20 },
  activeTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  restaurantName: { fontSize: 18, fontWeight: 'bold', color: COLORS.DARK_BROWN },
  orderId: { fontSize: 12, color: '#D7CCC8', marginTop: 4 },
  statusBadge: { backgroundColor: COLORS.ORANGE, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  statusBadgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  statusText: { color: '#FFF', marginLeft: 8, fontWeight: '600', fontSize: 15 },
  itemsTitle: { color: '#D7CCC8', fontWeight: '600', marginBottom: 8 },
  itemText: { color: '#FFF', marginBottom: 4 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#4E342E' },
  totalText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  trackText: { color: COLORS.ORANGE, fontWeight: 'bold' },
  emptyCard: { backgroundColor: COLORS.CARD_CREAM, borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#EAD2C6', marginBottom: 24 },
  emptyTitle: { marginTop: 12, fontSize: 18, fontWeight: 'bold', color: COLORS.DARK_BROWN },
  emptySubtext: { textAlign: 'center', color: COLORS.TEXT_GREY, marginTop: 8, marginBottom: 18, lineHeight: 20 },
  shopButton: { backgroundColor: COLORS.ORANGE, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 },
  shopButtonText: { color: '#FFF', fontWeight: 'bold' },
  emptyPastText: { color: COLORS.TEXT_GREY },
  pastOrderCard: { backgroundColor: COLORS.CARD_CREAM, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#EAD2C6', marginBottom: 12 },
  pastTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderMeta: { fontSize: 12, color: COLORS.TEXT_GREY, marginTop: 4 },
  pastTotal: { fontSize: 16, fontWeight: 'bold', color: COLORS.DARK_BROWN },
  deliveredText: { color: 'green', fontWeight: 'bold', marginTop: 10, marginBottom: 6 },
  orderItemsPreview: { color: COLORS.TEXT_GREY, lineHeight: 20 },
});
