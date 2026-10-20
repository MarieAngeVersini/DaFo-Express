import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Order } from '@/lib/types';

const COLORS = {
  DARK_BROWN: '#2C1810',
  ORANGE: '#C06C3A',
  CREAM: '#F7F0E8',
  CARD_CREAM: '#FBF6F1',
  TEXT_GREY: '#8D7B75',
};

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);

  const paymentMethod = order?.payment_method || 'orange';
  const orderId = order?.order_number || `DF-${new Date().getFullYear()}-001`;

  const paymentLabel =
    paymentMethod === 'orange'
      ? 'Orange Money'
      : paymentMethod === 'card'
      ? 'Credit / Debit Card'
      : 'Cash on Delivery';

  useEffect(() => {
    const loadOrder = async () => {
      const id = params.orderId as string;
      if (!id) return;

      try {
        const { data } = await supabase.from('orders').select('*').eq('id', id).single();
        if (data) setOrder(data);
      } catch {
        console.warn('Could not load order confirmation from Supabase yet.');
      }
    };

    loadOrder();
  }, [params.orderId]);

  const deliveryCode = order?.delivery_code || (global as any).deliveryCode || '4821';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={42} color="#FFF" />
        </View>

        <Text style={styles.title}>Order Confirmed</Text>
        <Text style={styles.subtitle}>
          Your order has been placed successfully and is now being sent to the restaurant.
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.value}>{orderId}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Payment</Text>
            <Text style={styles.value}>{paymentLabel}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Estimated Time</Text>
            <Text style={styles.value}>25–35 min</Text>
          </View>
        </View>

        <View style={styles.codeCard}>
          <Text style={styles.codeTitle}>Your Delivery Code</Text>
          <Text style={styles.codeNumber}>{deliveryCode}</Text>
          <Text style={styles.codeHint}>
            Show this code to the driver when your order arrives.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/tracking')}
        >
          <Text style={styles.primaryButtonText}>Track Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.CREAM,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.DARK_BROWN,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.TEXT_GREY,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
    marginBottom: 28,
  },
  card: {
    backgroundColor: COLORS.CARD_CREAM,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EAD2C6',
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  label: {
    color: COLORS.TEXT_GREY,
    fontSize: 14,
  },
  value: {
    color: COLORS.DARK_BROWN,
    fontWeight: 'bold',
    fontSize: 14,
  },
  codeCard: {
    backgroundColor: '#FFF3E8',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0C9A8',
    alignItems: 'center',
    marginBottom: 28,
  },
  codeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK_BROWN,
    marginBottom: 8,
  },
  codeNumber: {
    fontSize: 34,
    fontWeight: 'bold',
    color: COLORS.ORANGE,
    letterSpacing: 4,
    marginBottom: 8,
  },
  codeHint: {
    textAlign: 'center',
    color: COLORS.TEXT_GREY,
    fontSize: 13,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: COLORS.ORANGE,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.DARK_BROWN,
    fontWeight: '600',
    fontSize: 16,
  },
});
