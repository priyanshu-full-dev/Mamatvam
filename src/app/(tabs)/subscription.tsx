import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Crown } from 'lucide-react-native';

export default function SubscriptionScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Crown size={32} color="#D97706" />
      </View>
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#1E1E1E', marginBottom: 8 }}>Mamatvam Premium</Text>
      <Text style={{ fontSize: 14, color: '#64748B', textAlign: 'center' }}>
        Unlock holistic courses, personal gynecologist access, and customized diet plans.
      </Text>
    </SafeAreaView>
  );
}
