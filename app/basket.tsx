import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

const COLORS = {
  DARK_BROWN: '#2C1810',
  ORANGE: '#C06C3A',
  CREAM: '#F7F0E8',
  CARD_CREAM: '#FBF6F1',
  TEXT_GREY: '#8D7B75',
};

export default function BasketScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const [groupedItems, setGroupedItems] = useState<any[]>([]);
  
  // NEW: State to track Delivery vs Pickup
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');

  useEffect(() => {
    groupCartItems();
  }, [isFocused]);

  const groupCartItems = () => {
    const rawItems = (global as any).cartItems || [];
    const grouped: any = {};
    rawItems.forEach((item: any) => {
      if (grouped[item.name]) {
        grouped[item.name].quantity += 1;
      } else {
        grouped[item.name] = { ...item, quantity: 1 };
      }
    });
    setGroupedItems(Object.values(grouped));
  };

  const changeQty = (itemName: string, action: 'add' | 'remove') => {
    let currentCart = [...(global as any).cartItems];
    if (action === 'add') {
      const itemToCopy = currentCart.find(i => i.name === itemName);
      currentCart.push({ ...itemToCopy });
    } else {
      const index = currentCart.findIndex(i => i.name === itemName);
      if (index > -1) currentCart.splice(index, 1);
    }
    (global as any).cartItems = currentCart;
    groupCartItems();
    if (currentCart.length === 0) router.back();
  };

  // MATH LOGIC
  const subtotal = groupedItems.reduce((acc: number, item: any) => {
    const priceNum =
      typeof item.price === 'number' ? item.price : parseFloat(item.price.replace('$', ''));
    return acc + (priceNum * item.quantity);
  }, 0);

  // If Pickup, fee is 0.
  const deliveryFee = orderType === 'delivery' ? 0.99 : 0.00;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    (global as any).orderType = orderType;
  }, [orderType]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.DARK_BROWN} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Basket</Text>
        <TouchableOpacity onPress={() => { (global as any).cartItems = []; router.back(); }}>
          <Text style={{color: COLORS.ORANGE, fontWeight: 'bold'}}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Item List */}
        {groupedItems.map((item: any, index: number) => (
          <View key={index} style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>

            <View style={styles.quantityControls}>
              <TouchableOpacity style={styles.actionButton} onPress={() => changeQty(item.name, 'remove')}>
                <Ionicons name="remove" size={20} color={COLORS.ORANGE} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity style={styles.actionButton} onPress={() => changeQty(item.name, 'add')}>
                <Ionicons name="add" size={20} color={COLORS.ORANGE} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {groupedItems.length > 0 && (
          <View>
            {/* NEW: DELIVERY VS PICKUP TOGGLE */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity 
                    style={[styles.toggleButton, orderType === 'delivery' && styles.activeToggle]}
                    onPress={() => setOrderType('delivery')}
                >
                    <Text style={[styles.toggleText, orderType === 'delivery' && styles.activeText]}>Delivery</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.toggleButton, orderType === 'pickup' && styles.activeToggle]}
                    onPress={() => setOrderType('pickup')}
                >
                    <Text style={[styles.toggleText, orderType === 'pickup' && styles.activeText]}>Pick Up</Text>
                </TouchableOpacity>
            </View>

            {/* Summary Box */}
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                    {orderType === 'delivery' ? 'Delivery Fee' : 'Pickup Discount'}
                </Text>
                <Text style={[styles.summaryValue, orderType === 'pickup' && {color: 'green'}]}>
                    {orderType === 'delivery' ? '$0.99' : 'FREE'}
                </Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalLabel}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {groupedItems.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push(`/checkout?orderType=${orderType}`)}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.CREAM },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.DARK_BROWN },
  content: { padding: 20 },
  
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, backgroundColor: COLORS.CARD_CREAM, padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#EAD2C6' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: COLORS.DARK_BROWN },
  itemPrice: { fontSize: 14, color: COLORS.ORANGE, marginTop: 4, fontWeight: '600' },
  
  quantityControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#EAD2C6' },
  actionButton: { padding: 8 },
  quantityText: { marginHorizontal: 10, fontWeight: 'bold', fontSize: 16, color: COLORS.DARK_BROWN },
  
  // NEW TOGGLE STYLES
  toggleContainer: { flexDirection: 'row', backgroundColor: '#EFEBE9', borderRadius: 12, padding: 4, marginBottom: 15 },
  toggleButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeToggle: { backgroundColor: COLORS.ORANGE, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  toggleText: { fontWeight: '600', color: COLORS.TEXT_GREY },
  activeText: { color: '#FFF', fontWeight: 'bold' },

  summaryBox: { padding: 20, backgroundColor: COLORS.CARD_CREAM, borderRadius: 20, borderWidth: 1, borderColor: '#EAD2C6' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { color: COLORS.TEXT_GREY, fontSize: 14 },
  summaryValue: { color: COLORS.DARK_BROWN, fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#EAD2C6' },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: COLORS.DARK_BROWN },
  
  footer: { padding: 20 },
  checkoutButton: { backgroundColor: COLORS.DARK_BROWN, padding: 18, borderRadius: 15, alignItems: 'center' },
  checkoutText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
