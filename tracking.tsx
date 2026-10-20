import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'; // Import Map tools

// THEME COLORS
const COLORS = {
  DARK_BROWN: '#2C1810',
  ORANGE: '#C06C3A',
  CREAM: '#F7F0E8',
  CARD_CREAM: '#FBF6F1',
  TEXT_GREY: '#8D7B75',
};

export default function TrackingScreen() {
  const router = useRouter();
  const [status, setStatus] = useState('Finding a driver...');
  const [time, setTime] = useState('25-35 min');

  // 📍 CONAKRY COORDINATES (Central Kaloum/Dixinn area)
  const CONAKRY_REGION = {
    latitude: 9.5092,     // North/South
    longitude: -13.7122,  // East/West
    latitudeDelta: 0.05,  // Zoom level (smaller = closer)
    longitudeDelta: 0.05,
  };

  useEffect(() => {
    // Simulate order stages
    const timer1 = setTimeout(() => setStatus('Driver found! Heading to restaurant...'), 4000);
    const timer2 = setTimeout(() => {
      setStatus('Food is being prepared...');
      setTime('20 min');
    }, 8000);

    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <View style={styles.container}>
      {/* 1. REAL MAP OF CONAKRY */}
      <View style={styles.mapContainer}>
        <MapView 
          style={styles.map} 
          initialRegion={CONAKRY_REGION}
          provider={PROVIDER_DEFAULT} // Uses Apple Maps on iOS, Google on Android
        >
           {/* Driver Marker (The Bike) */}
           <Marker 
             coordinate={{ latitude: 9.5150, longitude: -13.7150 }} 
             title="Mohamed S."
             description="Delivery Driver"
           >
             <View style={styles.driverMarker}>
               <Ionicons name="bicycle" size={24} color={COLORS.CREAM} />
             </View>
           </Marker>

           {/* User Marker (Your House) */}
           <Marker 
             coordinate={{ latitude: 9.5092, longitude: -13.7122 }} 
             title="You"
             pinColor={COLORS.ORANGE} 
           />
        </MapView>

        {/* Floating Close Button */}
        <SafeAreaView style={styles.floatingHeader}>
           <TouchableOpacity style={styles.closeButton} onPress={() => router.replace('/(tabs)')}>
             <Ionicons name="close" size={24} color={COLORS.DARK_BROWN} />
           </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* 2. STATUS CARD (Bottom) */}
      <View style={styles.bottomSheet}>
        <View style={styles.handleBar} />
        
        <Text style={styles.statusTitle}>Order Tracking</Text>
        
        <View style={styles.statusRow}>
          <ActivityIndicator color={COLORS.ORANGE} size="large" />
          <View style={{marginLeft: 15}}>
             <Text style={styles.statusText}>{status}</Text>
             <Text style={styles.timeText}>Est. Arrival: {time}</Text>
          </View>
        </View>

        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
             <Ionicons name="person" size={24} color={COLORS.TEXT_GREY} />
          </View>
          <View style={{flex: 1}}>
             <Text style={styles.driverName}>Mohamed S.</Text>
             <Text style={styles.driverRating}>4.9 ⭐ • Honda Bike</Text>
          </View>
          <TouchableOpacity style={styles.callButton}>
             <Ionicons name="call" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={{marginTop: 20, alignSelf: 'center'}}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={{color: COLORS.ORANGE, fontWeight: 'bold'}}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.CREAM },
  mapContainer: { flex: 0.65 }, 
  map: { width: '100%', height: '100%' },
  
  floatingHeader: { position: 'absolute', top: 10, left: 20 },
  closeButton: { backgroundColor: COLORS.CREAM, padding: 10, borderRadius: 20, elevation: 5, shadowColor: "#000", shadowOffset: {width:0,height:2}, shadowOpacity:0.2, shadowRadius:4 },
  
  driverMarker: { backgroundColor: COLORS.ORANGE, padding: 8, borderRadius: 20, elevation: 5, borderWidth: 2, borderColor: '#FFF' },
  
  bottomSheet: { flex: 0.35, backgroundColor: COLORS.CREAM, borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, shadowColor: '#000', shadowOffset: {width:0, height:-4}, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  
  handleBar: { width: 40, height: 4, backgroundColor: COLORS.TEXT_GREY, alignSelf: 'center', borderRadius: 2, marginBottom: 20, opacity: 0.3 },
  
  statusTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: COLORS.DARK_BROWN },
  
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, paddingBottom: 25, borderBottomWidth: 1, borderBottomColor: '#EAD2C6' },
  statusText: { fontSize: 16, fontWeight: 'bold', color: COLORS.DARK_BROWN },
  timeText: { fontSize: 14, color: COLORS.TEXT_GREY, marginTop: 4 },
  
  driverCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.CARD_CREAM, padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#EAD2C6' },
  driverAvatar: { width: 45, height: 45, backgroundColor: '#EAD2C6', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  driverName: { fontWeight: 'bold', fontSize: 15, color: COLORS.DARK_BROWN },
  driverRating: { color: COLORS.TEXT_GREY, fontSize: 12, marginTop: 2 },
  
  callButton: { backgroundColor: COLORS.ORANGE, padding: 10, borderRadius: 20 },
});