import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Theme Colors
const COLORS = {
  DARK_BROWN: '#2C1810',
  ORANGE: '#C06C3A',
  INACTIVE: '#8D7B75',
};

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false, 
      tabBarActiveTintColor: COLORS.ORANGE, 
      tabBarInactiveTintColor: COLORS.INACTIVE, 
      tabBarStyle: { 
        backgroundColor: COLORS.DARK_BROWN, 
        borderTopWidth: 0, 
        height: 70, 
        paddingBottom: 12, 
        paddingTop: 12,
      },
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600' }
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="orders" 
        options={{ 
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "receipt" : "receipt-outline"} size={26} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Account',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} />
        }} 
      />
    </Tabs>
  );
}