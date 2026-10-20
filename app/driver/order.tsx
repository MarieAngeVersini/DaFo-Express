import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
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
};

export default function DriverOrderScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<'accepted' | 'pickedup' | 'delivered'>('accepted');
  const [enteredCode, setEnteredCode] = useState('');

  const realCode = (global as any).deliveryCode || '4821';

  const handleCallCustomer = async () => {
    const phone = 'tel:+224626655137';
    try {
      await Linking.openURL(phone);
    } catch {
      Alert.alert('Call failed', 'Could not open phone app.');
    }
  };

  const getStatusText = () => {
    if (status === 'accepted') return 'Go to restaurant';
    if (status === 'pickedup') return 'Take order to customer';
    return 'Order completed';
  };

  const handleConfirmDelivery = () => {
    if (enteredCode.trim() !== realCode) {
      Alert.alert('Wrong Code', 'The delivery code does not match.');
      return;
    }

    Keyboard.dismiss();
    setStatus('delivered');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={COLORS.DARK_BROWN} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Active Delivery</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
              <View style={styles.statusCard}>
                <Text style={styles.statusLabel}>Current Step</Text>
                <Text style={styles.statusText}>{getStatusText()}</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Pickup</Text>
                <Text style={styles.mainText}>The Burger Palace</Text>
                <Text style={styles.subText}>Kaloum, Conakry</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Customer</Text>
                <Text style={styles.mainText}>Mariama Diallo</Text>
                <Text style={styles.subText}>Dixinn, Conakry</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Payment</Text>
                <Text style={styles.mainText}>Orange Money</Text>
                <Text style={styles.subText}>Order DF-2026-001</Text>
              </View>

              <TouchableOpacity style={styles.callButton} onPress={handleCallCustomer}>
                <Ionicons name="call-outline" size={20} color="#FFF" />
                <Text style={styles.callButtonText}>Call Customer</Text>
              </TouchableOpacity>

              {status === 'accepted' && (
                <TouchableOpacity
                  style={styles.mainButton}
                  onPress={() => setStatus('pickedup')}
                >
                  <Text style={styles.mainButtonText}>Picked Up</Text>
                </TouchableOpacity>
              )}

              {status === 'pickedup' && (
                <View style={styles.codeSection}>
                  <Text style={styles.codeLabel}>Enter customer delivery code</Text>
                  <TextInput
                    style={styles.codeInput}
                    placeholder="4-digit code"
                    placeholderTextColor={COLORS.TEXT_GREY}
                    keyboardType="number-pad"
                    value={enteredCode}
                    onChangeText={setEnteredCode}
                    maxLength={4}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                  />

                  <TouchableOpacity
                    style={[styles.mainButton, { backgroundColor: COLORS.GREEN }]}
                    onPress={handleConfirmDelivery}
                  >
                    <Text style={styles.mainButtonText}>Confirm Delivery</Text>
                  </TouchableOpacity>
                </View>
              )}

              {status === 'delivered' && (
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => {
                    (global as any).deliveryCode = null;
                    router.replace('/driver');
                  }}
                >
                  <Text style={styles.doneButtonText}>Back to Driver Home</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.CREAM,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.DARK_BROWN,
  },
  content: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  statusCard: {
    backgroundColor: COLORS.DARK_BROWN,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  statusLabel: {
    color: '#D7CCC8',
    fontSize: 13,
    marginBottom: 6,
  },
  statusText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: COLORS.CARD_CREAM,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EAD2C6',
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.TEXT_GREY,
    fontSize: 13,
    marginBottom: 6,
  },
  mainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK_BROWN,
  },
  subText: {
    fontSize: 14,
    color: COLORS.TEXT_GREY,
    marginTop: 4,
  },
  callButton: {
    backgroundColor: COLORS.ORANGE,
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 12,
  },
  callButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  mainButton: {
    backgroundColor: COLORS.DARK_BROWN,
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
  },
  mainButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 17,
  },
  codeSection: {
    marginTop: 4,
  },
  codeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.DARK_BROWN,
    marginBottom: 10,
  },
  codeInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAD2C6',
    borderRadius: 14,
    padding: 16,
    fontSize: 18,
    color: COLORS.DARK_BROWN,
    marginBottom: 14,
    textAlign: 'center',
    letterSpacing: 0,
  },
  doneButton: {
    backgroundColor: '#EFE7E1',
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: 'center',
  },
  doneButtonText: {
    color: COLORS.DARK_BROWN,
    fontWeight: 'bold',
    fontSize: 16,
  },
});