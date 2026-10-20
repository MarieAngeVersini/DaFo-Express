import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  DARK_BROWN: '#2C1810',
  ORANGE: '#C06C3A',
  CREAM: '#F7F0E8',
  CARD_CREAM: '#FBF6F1',
  TEXT_GREY: '#8D7B75',
  GREEN: '#2E7D32',
  RED: '#C62828',
};

export default function DriverHomeScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Driver Panel</Text>
            <Text style={styles.subtitle}>
              {isOnline ? 'You are online and ready' : 'You are offline'}
            </Text>
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={COLORS.DARK_BROWN} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Today’s Earnings</Text>

        <View style={styles.earningsCard}>
        <View style={styles.earningsTopRow}>
            <View>
            <Text style={styles.earningsAmount}>80,000 GNF</Text>
            <Text style={styles.earningsSubtext}>4 deliveries completed today</Text>
            </View>

            <View style={styles.earningsIconCircle}>
            <Ionicons name="wallet-outline" size={24} color={COLORS.ORANGE} />
            </View>
        </View>

        <View style={styles.earningsDivider} />

        <View style={styles.earningsBottomRow}>
            <View>
            <Text style={styles.earningsLabel}>Cash Orders</Text>
            <Text style={styles.earningsValue}>2</Text>
            </View>

            <View>
            <Text style={styles.earningsLabel}>Mobile Payments</Text>
            <Text style={styles.earningsValue}>2</Text>
            </View>

            <View>
            <Text style={styles.earningsLabel}>Status</Text>
            <Text style={[styles.earningsValue, { color: COLORS.GREEN }]}>Pending</Text>
            </View>
        </View>
        </View>

        {/* Online / Offline Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isOnline ? COLORS.GREEN : COLORS.RED },
              ]}
            />
            <View>
              <Text style={styles.statusTitle}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
              <Text style={styles.statusSubtext}>
                {isOnline
                  ? 'You can now receive delivery requests'
                  : 'Turn on to receive orders'}
              </Text>
            </View>
          </View>

          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: '#D7CCC8', true: '#D7B49E' }}
            thumbColor={isOnline ? COLORS.ORANGE : '#f4f3f4'}
          />
        </View>

        {/* Active Request */}
        <Text style={styles.sectionTitle}>New Delivery Request</Text>

        {isOnline ? (
          <View style={styles.orderCard}>
            <View style={styles.orderTopRow}>
              <View>
                <Text style={styles.restaurantName}>The Burger Palace</Text>
                <Text style={styles.orderMeta}>Order DF-2026-001</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>New</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={COLORS.ORANGE} />
              <Text style={styles.infoText}>Pickup: Kaloum, Conakry</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="home-outline" size={18} color={COLORS.ORANGE} />
              <Text style={styles.infoText}>Drop-off: Dixinn, Conakry</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={18} color={COLORS.ORANGE} />
              <Text style={styles.infoText}>Payment: Orange Money</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color={COLORS.ORANGE} />
              <Text style={styles.infoText}>Estimated trip: 20–25 min</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.rejectButton}>
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => router.push('/driver/order')}
              >
                <Text style={styles.acceptButtonText}>Accept Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.offlineCard}>
            <Ionicons name="moon-outline" size={36} color={COLORS.TEXT_GREY} />
            <Text style={styles.offlineTitle}>You are offline</Text>
            <Text style={styles.offlineText}>
              Turn yourself online to start receiving delivery requests.
            </Text>
          </View>
        )}

        {/* Tips */}
        <Text style={styles.sectionTitle}>Quick Tips</Text>
        <View style={styles.tipCard}>
          <View style={styles.tipRow}>
            <Ionicons name="call-outline" size={18} color={COLORS.ORANGE} />
            <Text style={styles.tipText}>Call customer if you cannot find the address</Text>
          </View>

          <View style={styles.tipRow}>
            <Ionicons name="bicycle-outline" size={18} color={COLORS.ORANGE} />
            <Text style={styles.tipText}>Confirm pickup before leaving restaurant</Text>
          </View>

          <View style={styles.tipRow}>
            <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.ORANGE} />
            <Text style={styles.tipText}>Mark delivered only after handing over the order</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.CREAM,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.DARK_BROWN,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_GREY,
    marginTop: 4,
  },
  backButton: {
    backgroundColor: COLORS.CARD_CREAM,
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAD2C6',
  },
  statusCard: {
    backgroundColor: COLORS.CARD_CREAM,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EAD2C6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 14,
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
  },
  statusTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.DARK_BROWN,
  },
  statusSubtext: {
    fontSize: 13,
    color: COLORS.TEXT_GREY,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.DARK_BROWN,
    marginBottom: 14,
  },
  orderCard: {
    backgroundColor: COLORS.CARD_CREAM,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EAD2C6',
    marginBottom: 26,
  },
  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    alignItems: 'flex-start',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK_BROWN,
  },
  orderMeta: {
    fontSize: 12,
    color: COLORS.TEXT_GREY,
    marginTop: 4,
  },
  badge: {
    backgroundColor: COLORS.ORANGE,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.DARK_BROWN,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#EFE7E1',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: COLORS.DARK_BROWN,
    fontWeight: 'bold',
    fontSize: 15,
  },
  acceptButton: {
    flex: 1.4,
    backgroundColor: COLORS.DARK_BROWN,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  offlineCard: {
    backgroundColor: COLORS.CARD_CREAM,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#EAD2C6',
    alignItems: 'center',
    marginBottom: 26,
  },
  offlineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK_BROWN,
    marginTop: 12,
  },
  offlineText: {
    textAlign: 'center',
    color: COLORS.TEXT_GREY,
    marginTop: 8,
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: COLORS.CARD_CREAM,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EAD2C6',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  tipText: {
    marginLeft: 10,
    color: COLORS.DARK_BROWN,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },

  earningsCard: {
  backgroundColor: COLORS.CARD_CREAM,
  borderRadius: 20,
  padding: 18,
  borderWidth: 1,
  borderColor: '#EAD2C6',
  marginBottom: 26,
},
earningsTopRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
earningsAmount: {
  fontSize: 26,
  fontWeight: 'bold',
  color: COLORS.DARK_BROWN,
},
earningsSubtext: {
  fontSize: 13,
  color: COLORS.TEXT_GREY,
  marginTop: 4,
},
earningsIconCircle: {
  width: 46,
  height: 46,
  borderRadius: 23,
  backgroundColor: '#FFF',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#EAD2C6',
},
earningsDivider: {
  height: 1,
  backgroundColor: '#EAD2C6',
  marginVertical: 16,
},
earningsBottomRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
earningsLabel: {
  fontSize: 12,
  color: COLORS.TEXT_GREY,
  marginBottom: 6,
},
earningsValue: {
  fontSize: 15,
  fontWeight: 'bold',
  color: COLORS.DARK_BROWN,
},
});