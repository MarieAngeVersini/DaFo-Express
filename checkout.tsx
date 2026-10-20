import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createOrderFromCart } from '@/lib/orders';
import { OrderType, PaymentMethod } from '@/lib/types';

const COLORS = {
  DARK_BROWN: '#2C1810',
  ORANGE: '#C06C3A',
  CREAM: '#F7F0E8',
  CARD_CREAM: '#FBF6F1',
};

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('orange');
  const [deliveryAddress, setDeliveryAddress] = useState('Dixinn, Conakry');
  const [loading, setLoading] = useState(false);
  const orderType = ((params.orderType as string) || (global as any).orderType || 'delivery') as OrderType;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const order = await createOrderFromCart({
        cartItems: (global as any).cartItems || [],
        paymentMethod,
        orderType,
        deliveryAddress,
      });

      (global as any).activeOrderId = order.id;
      (global as any).deliveryCode = order.delivery_code;
      (global as any).cartItems = [];

      router.push(`/confirmation?orderId=${order.id}`);
    } catch (error: any) {
      Alert.alert('Could not place order', error.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.DARK_BROWN} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Payment Method</Text>

        {orderType === 'delivery' && (
          <View style={{ marginBottom: 18 }}>
            <Text style={styles.fieldLabel}>Delivery Address</Text>
            <TextInput
              placeholder="Delivery address"
              placeholderTextColor="#8D7B75"
              style={styles.input}
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.methodCard, paymentMethod === 'orange' && styles.selected]}
          onPress={() => setPaymentMethod('orange')}
        >
          <Ionicons
            name="phone-portrait-outline"
            size={24}
            color={paymentMethod === 'orange' ? COLORS.ORANGE : '#8D7B75'}
          />
          <Text
            style={[
              styles.methodText,
              paymentMethod === 'orange' && { color: COLORS.DARK_BROWN },
            ]}
          >
            Orange Money
          </Text>
          {paymentMethod === 'orange' && (
            <Ionicons name="checkmark-circle" size={24} color={COLORS.ORANGE} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodCard, paymentMethod === 'card' && styles.selected]}
          onPress={() => setPaymentMethod('card')}
        >
          <Ionicons
            name="card-outline"
            size={24}
            color={paymentMethod === 'card' ? COLORS.ORANGE : '#8D7B75'}
          />
          <Text
            style={[
              styles.methodText,
              paymentMethod === 'card' && { color: COLORS.DARK_BROWN },
            ]}
          >
            Credit / Debit Card
          </Text>
          {paymentMethod === 'card' && (
            <Ionicons name="checkmark-circle" size={24} color={COLORS.ORANGE} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodCard, paymentMethod === 'cash' && styles.selected]}
          onPress={() => setPaymentMethod('cash')}
        >
          <Ionicons
            name="cash-outline"
            size={24}
            color={paymentMethod === 'cash' ? COLORS.ORANGE : '#8D7B75'}
          />
          <Text
            style={[
              styles.methodText,
              paymentMethod === 'cash' && { color: COLORS.DARK_BROWN },
            ]}
          >
            Cash on Delivery
          </Text>
          {paymentMethod === 'cash' && (
            <Ionicons name="checkmark-circle" size={24} color={COLORS.ORANGE} />
          )}
        </TouchableOpacity>

        {paymentMethod === 'orange' && (
          <View style={{ marginTop: 20 }}>
            <TextInput
              placeholder="Orange Money phone number"
              placeholderTextColor="#8D7B75"
              style={styles.input}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="Account name"
              placeholderTextColor="#8D7B75"
              style={styles.input}
            />
          </View>
        )}

        {paymentMethod === 'card' && (
          <View style={{ marginTop: 20 }}>
            <TextInput
              placeholder="Card Number"
              placeholderTextColor="#8D7B75"
              style={styles.input}
              keyboardType="number-pad"
            />
            <TextInput
              placeholder="Expiry Date"
              placeholderTextColor="#8D7B75"
              style={styles.input}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          disabled={loading}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.payButtonText}>{loading ? 'Placing Order...' : 'Place Order'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.CREAM },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.DARK_BROWN },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.DARK_BROWN, marginBottom: 15 },
  fieldLabel: { color: COLORS.DARK_BROWN, fontWeight: '600', marginBottom: 8 },

  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.CARD_CREAM,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EAD2C6',
  },
  selected: { borderColor: COLORS.ORANGE, backgroundColor: '#FFF' },
  methodText: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '600', color: '#8D7B75' },

  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAD2C6',
    color: COLORS.DARK_BROWN,
  },

  footer: { padding: 20 },
  payButton: {
    backgroundColor: COLORS.ORANGE,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: COLORS.ORANGE,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  payButtonDisabled: { opacity: 0.7 },
  payButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
