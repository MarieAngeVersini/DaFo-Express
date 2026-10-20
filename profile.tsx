import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Linking  
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

// Theme Colors
const COLORS = {
  DARK_BROWN: '#2C1810',
  ORANGE: '#C06C3A',
  CREAM: '#F7F0E8',
  CARD_CREAM: '#FBF6F1',
  TEXT_INACTIVE: '#8D7B75',
};

export default function ProfileScreen() {
  const router = useRouter();
  const userName = (global as any).userName || "Guest User";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    (global as any).hasAccess = false;
    (global as any).userName = null;
    router.replace('/login');
  };

  const handleCallSupport = () => {
    Alert.alert("Calling Support...", "Dialing +224 111 222 333");
  };

  const handleWhatsApp = async () => {
    const phoneNumber = '224626655137'; 
    const url = `whatsapp://send?phone=${phoneNumber}`;

    try {
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert('Opening Browser', 'WhatsApp not installed, opening web version...');
      await Linking.openURL(`https://wa.me/${phoneNumber}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.memberStatus}>Gold Member 🌟</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Customer Service</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleCallSupport}>
          <View style={[styles.iconBox, { backgroundColor: '#E6F4FE' }]}>
            <Ionicons name="call-outline" size={24} color="#007AFF" />
          </View>
          <View style={styles.menuTextInfo}>
            <Text style={styles.menuTitle}>Call Support</Text>
            <Text style={styles.menuSub}>Speak with an agent</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleWhatsApp}>
          <View style={[styles.iconBox, { backgroundColor: '#E0F8E0' }]}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#00C851" />
          </View>
          <View style={styles.menuTextInfo}>
            <Text style={styles.menuTitle}>Live Chat</Text>
            <Text style={styles.menuSub}>WhatsApp Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#CCC" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>About Us</Text>
        
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>DaFo Delivery</Text>
          <Text style={styles.aboutText}>
            DaFo is the fastest food delivery service in Conakry. We partner with over 500 local restaurants to bring fresh meals directly to your door.
          </Text>
          <Text style={styles.versionText}>Version 1.0.2 (Beta)</Text>
        </View>

        {/* Driver Mode Button */}
        <TouchableOpacity 
          style={styles.driverButton}
          onPress={() => router.push('/driver')}
        >
          <Text style={styles.driverButtonText}>
            Driver Mode 
          </Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.CREAM },
  header: { alignItems: 'center', padding: 30, backgroundColor: COLORS.DARK_BROWN },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.CREAM, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { fontSize: 30, fontWeight: 'bold', color: COLORS.ORANGE },
  name: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  memberStatus: { color: 'white', opacity: 0.9, marginTop: 5 },
  content: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 10, color: COLORS.DARK_BROWN },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EAD2C6' },
  iconBox: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuTextInfo: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: COLORS.DARK_BROWN },
  menuSub: { color: COLORS.TEXT_INACTIVE, fontSize: 13, marginTop: 2 },
  aboutCard: { backgroundColor: COLORS.CARD_CREAM, padding: 20, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: '#EAD2C6' },
  aboutTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: COLORS.DARK_BROWN },
  aboutText: { color: COLORS.TEXT_INACTIVE, lineHeight: 22 },
  versionText: { color: COLORS.TEXT_INACTIVE, fontSize: 12, marginTop: 15 },

  driverButton: {
    backgroundColor: '#EFE7E1',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10
  },
  driverButtonText: {
    fontWeight: 'bold',
    color: '#2C1810',
    fontSize: 16
  },

  logoutButton: { padding: 15, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  logoutText: { color: 'red', fontWeight: 'bold', fontSize: 16 }
});
