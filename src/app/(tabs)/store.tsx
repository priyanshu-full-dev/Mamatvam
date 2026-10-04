import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Store as StoreIcon } from 'lucide-react-native';

export default function StoreScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFF1EE', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <StoreIcon size={32} color="#EE4D38" />
      </View>
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#1E1E1E', marginBottom: 8 }}>Mamatvam Store</Text>
      <Text style={{ fontSize: 14, color: '#64748B', textAlign: 'center' }}>
        Curated mother and baby essentials coming soon.
      </Text>
    </SafeAreaView>
  );
}
