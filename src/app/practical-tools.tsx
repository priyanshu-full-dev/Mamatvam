import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
  Circle,
  Ellipse,
} from 'react-native-svg';
import {
  ArrowLeft,
  X,
  Plus,
  Phone,
  HeartPulse,
  Check,
  Droplets,
  Activity,
  Briefcase,
} from 'lucide-react-native';

// Custom Siren / Emergency Icon matching the design
function SirenIcon({ size = 22, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2V4" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M6 5L7.5 6.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M18 5L16.5 6.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      <Path
        d="M7.5 17.5V13C7.5 10.5147 9.51472 8.5 12 8.5C14.4853 8.5 16.5 10.5147 16.5 13V17.5"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <Path d="M5 17.5H19" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M7.5 21H16.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

// 1. Kick Counter: White baby footprint icon
function BabyFootprintWhiteIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Ellipse cx="8" cy="4.8" rx="1.8" ry="2.2" transform="rotate(-15 8 4.8)" fill="#FFFFFF" />
      <Circle cx="12" cy="5.2" r="1.3" fill="#FFFFFF" />
      <Circle cx="15" cy="6.8" r="1.2" fill="#FFFFFF" />
      <Circle cx="17.5" cy="9.2" r="1.1" fill="#FFFFFF" />
      <Circle cx="19.2" cy="11.8" r="0.9" fill="#FFFFFF" />
      <Path
        d="M9.5 8.2C7 8.2 5.5 10 5.5 12.5C5.5 14.5 6.5 16 7.5 18C8.5 20 9 21.5 11 21.5C13 21.5 13.8 20 14.5 17.5C15.2 15 16 13.5 15.5 11C15 8.5 12 8.2 9.5 8.2Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

// 2. Contractions: Contraction wave / pulse monitor line
function ContractionsWhiteIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 14H6.5L9 8L13 18L16 11L18 14H21"
        stroke="#FFFFFF"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="13" cy="18" r="1.5" fill="#FFFFFF" />
    </Svg>
  );
}

// 3. Hospital Bag: Maternity bag / suitcase with medical cross
function HospitalBagWhiteIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 6V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V6" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
      <Path
        d="M4 8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V8Z"
        stroke="#FFFFFF"
        strokeWidth={2}
        fill="rgba(255,255,255,0.18)"
      />
      <Path d="M12 10.5V15.5M9.5 13H14.5" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

// 4. Hydration: Water droplet with sparkle
function HydrationWhiteIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3C12 3 6.5 10 6.5 14.5C6.5 17.5376 8.96243 20 12 20C15.0376 20 17.5 17.5376 17.5 14.5C17.5 10 12 3 12 3Z"
        fill="#FFFFFF"
      />
      <Path
        d="M9.5 14C9.5 12.5 11 11 12 10.5"
        stroke="rgba(6, 182, 212, 0.45)"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Reusable Vibrant Gradient Squircle Badge
function ColorfulBadge({
  gradientId,
  startColor,
  endColor,
  shadowColor,
  children,
  size = 54,
}: {
  gradientId: string;
  startColor: string;
  endColor: string;
  shadowColor: string;
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        shadowColor: shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 12,
        overflow: 'hidden',
      }}
    >
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={startColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={endColor} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" rx="16" ry="16" fill={`url(#${gradientId})`} />
      </Svg>
      {children}
    </View>
  );
}

export default function PracticalToolsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const CARD_WIDTH = (width - 54) / 2;

  // Interactive States
  const [kickCount, setKickCount] = useState(10);
  const [hydrationLiters, setHydrationLiters] = useState(1.2);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleCallEmergency = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() => {
      Alert.alert('Emergency Helpline', `Calling ${number}`);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 18,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: '#F8FAFC',
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: -8,
          }}
        >
          <ArrowLeft size={24} color="#1E1E1E" />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E1E1E' }}>
          Practical Tools
        </Text>

        <View style={{ width: 40, alignItems: 'flex-end', justifyContent: 'center' }}>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#94A3B8' }} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 40 }}
      >
        {/* Section Heading: Daily Utilities */}
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#1E1E1E', marginBottom: 16 }}>
          Daily Utilities
        </Text>

        {/* 2x2 Grid with Colorful Badges */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {/* Card 1: Kick Counter - Coral/Rose Gradient Badge */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.push('/kick-counter')}
            style={[
              styles.utilityCard,
              {
                width: CARD_WIDTH,
                minHeight: 180,
              },
            ]}
          >
            <ColorfulBadge
              gradientId="kickGrad"
              startColor="#FF5B79"
              endColor="#FF8A65"
              shadowColor="#FF5B79"
            >
              <BabyFootprintWhiteIcon size={25} />
            </ColorfulBadge>

            <Text style={styles.cardTitle}>Kick Counter</Text>
            <Text style={styles.cardSubtitle1}>{kickCount} kicks recorded</Text>
            <Text style={styles.cardSubtitle2}>today • 2h ago</Text>
          </TouchableOpacity>

          {/* Card 2: Contractions - Royal Violet/Purple Gradient Badge */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setActiveModal('contractions')}
            style={[
              styles.utilityCard,
              {
                width: CARD_WIDTH,
                minHeight: 180,
              },
            ]}
          >
            <ColorfulBadge
              gradientId="contractionsGrad"
              startColor="#8B5CF6"
              endColor="#6366F1"
              shadowColor="#8B5CF6"
            >
              <ContractionsWhiteIcon size={24} />
            </ColorfulBadge>

            <Text style={styles.cardTitle}>Contractions</Text>
            <Text style={styles.cardSubtitle1}>Last: 5m apart • 15m</Text>
            <Text style={styles.cardSubtitle2}>ago</Text>
          </TouchableOpacity>

          {/* Card 3: Hospital Bag - Golden Amber/Orange Gradient Badge */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.push('/hospital-bag')}
            style={[
              styles.utilityCard,
              {
                width: CARD_WIDTH,
                minHeight: 180,
                marginTop: 14,
              },
            ]}
          >
            <ColorfulBadge
              gradientId="bagGrad"
              startColor="#F59E0B"
              endColor="#FBBF24"
              shadowColor="#F59E0B"
            >
              <HospitalBagWhiteIcon size={24} />
            </ColorfulBadge>

            <Text style={styles.cardTitle}>Hospital Bag</Text>
            <Text style={styles.cardSubtitle1}>0/27 items packed</Text>
          </TouchableOpacity>

          {/* Card 4: Hydration - Ocean Cyan/Sky Blue Gradient Badge */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.push('/hydration-tracker')}
            style={[
              styles.utilityCard,
              {
                width: CARD_WIDTH,
                minHeight: 180,
                marginTop: 14,
              },
            ]}
          >
            <ColorfulBadge
              gradientId="hydrationGrad"
              startColor="#06B6D4"
              endColor="#0284C7"
              shadowColor="#06B6D4"
            >
              <HydrationWhiteIcon size={24} />
            </ColorfulBadge>

            <Text style={styles.cardTitle}>Hydration</Text>
            <Text style={styles.cardSubtitle1}>3 of 8 glasses</Text>
          </TouchableOpacity>
        </View>

        {/* Section Heading: Support & Care */}
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#1E1E1E', marginTop: 30, marginBottom: 14 }}>
          Support &amp; Care
        </Text>

        {/* Medical Contacts Card - Delicate Soft Coral Tint */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveModal('contacts')}
          style={{
            backgroundColor: '#FFE6E3',
            borderRadius: 16,
            padding: 18,
            borderWidth: 1,
            borderColor: '#FED7D4',
            marginBottom: 14,
          }}
        >
          <Text style={{ fontSize: 16.5, fontWeight: '700', color: '#1E1E1E' }}>
            Medical Contacts
          </Text>
          <Text style={{ fontSize: 13, color: '#475569', marginTop: 4, lineHeight: 18 }}>
            Quick access to your midwife and care team
          </Text>
          <Text style={{ fontSize: 13.5, fontWeight: '600', color: '#EE4D38', marginTop: 10 }}>
            Manage Directory -
          </Text>
        </TouchableOpacity>

        {/* Emergency Support Button - Radiant Red */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setActiveModal('emergency')}
          style={{
            backgroundColor: '#EE4D38',
            borderRadius: 16,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#EE4D38',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <SirenIcon size={22} color="#FFFFFF" />
          <Text style={{ fontSize: 16.5, fontWeight: '700', color: '#FFFFFF', marginLeft: 10 }}>
            Emergency Support
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ======================================================== */}
      {/* Interactive Modals                                       */}
      {/* ======================================================== */}

      {/* 1. Kick Counter Modal */}
      <Modal visible={activeModal === 'kick'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFE4E6', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <HeartPulse size={20} color="#F43F5E" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Kick Counter</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFF1EE', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#FF5B79' }}>
                <Text style={{ fontSize: 44, fontWeight: '800', color: '#FF5B79' }}>{kickCount}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#FF5B79' }}>Kicks Today</Text>
              </View>

              <Text style={{ fontSize: 13, color: '#64748B', marginTop: 16, textAlign: 'center', lineHeight: 18 }}>
                Tap below each time you feel your baby kick, flutter, or turn. A healthy goal is 10 movements within 2 hours.
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setKickCount((prev) => prev + 1)}
                style={{
                  backgroundColor: '#FF5B79',
                  paddingHorizontal: 28,
                  paddingVertical: 14,
                  borderRadius: 24,
                  marginTop: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Plus size={18} color="#FFFFFF" />
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginLeft: 6 }}>Record a Kick</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2. Contractions Modal */}
      <Modal visible={activeModal === 'contractions'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Activity size={20} color="#8B5CF6" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Contractions Timer</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: '#F5F3FF', borderRadius: 16, padding: 18 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#7C3AED', textTransform: 'uppercase' }}>Current Interval</Text>
              <Text style={{ fontSize: 32, fontWeight: '800', color: '#6D28D9', marginTop: 2 }}>5 mins apart</Text>
              <Text style={{ fontSize: 12.5, color: '#5B21B6', marginTop: 2 }}>Average duration: 45 seconds • 15m ago</Text>
            </View>

            <View style={{ backgroundColor: '#F8FAFC', borderRadius: 14, padding: 14, marginTop: 14, borderWidth: 1, borderColor: '#F1F5F9' }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E1E1E' }}>The 5-1-1 Rule for Labor:</Text>
              <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 18 }}>
                When contractions occur every 5 minutes, last 1 full minute each, for at least 1 hour, contact your doctor or midwife immediately.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal(null)}
              style={{ marginTop: 20, backgroundColor: '#8B5CF6', paddingVertical: 14, borderRadius: 14, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Start Timer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3. Hospital Bag Modal */}
      <Modal visible={activeModal === 'bag'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Briefcase size={20} color="#D97706" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Hospital Bag Checklist</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>
              12 of 20 essential items packed:
            </Text>

            <ScrollView style={{ maxHeight: 280 }} showsVerticalScrollIndicator={false}>
              {[
                { name: 'Maternity hospital gown & robe', packed: true },
                { name: 'Government ID & insurance paperwork', packed: true },
                { name: 'Baby onesies (newborn & 0-3m size)', packed: true },
                { name: 'Warm socks & non-slip slippers', packed: true },
                { name: 'Nursing bras & disposable maternity pads', packed: true },
                { name: 'Infant car seat pre-installed', packed: false },
                { name: 'Baby swaddles & soft receiving blanket', packed: false },
                { name: 'Postpartum recovery kit & nipple cream', packed: false },
              ].map((item, idx) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: item.packed ? '#10B981' : '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    {item.packed && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                  <Text style={{ fontSize: 13.5, color: '#1E1E1E', fontWeight: item.packed ? '600' : '400' }}>{item.name}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal(null)}
              style={{ marginTop: 16, backgroundColor: '#F59E0B', paddingVertical: 14, borderRadius: 14, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 4. Hydration Modal */}
      <Modal visible={activeModal === 'hydration'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Droplets size={20} color="#0284C7" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Hydration Tracker</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', paddingVertical: 16 }}>
              <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center' }}>
                <Droplets size={38} color="#0284C7" />
              </View>

              <Text style={{ fontSize: 32, fontWeight: '800', color: '#0284C7', marginTop: 12 }}>
                {hydrationLiters.toFixed(1)} L / 2.5 L
              </Text>
              <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Daily Hydration Goal</Text>

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 22 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setHydrationLiters((prev) => Math.min(4.0, Number((prev + 0.25).toFixed(2))))}
                  style={{
                    backgroundColor: '#0284C7',
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>+ 250 ml Glass</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setHydrationLiters((prev) => Math.min(4.0, Number((prev + 0.5).toFixed(2))))}
                  style={{
                    backgroundColor: '#E0F2FE',
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#0284C7' }}>+ 500 ml Bottle</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal(null)}
              style={{ marginTop: 16, backgroundColor: '#06B6D4', paddingVertical: 14, borderRadius: 14, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Save Progress</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 5. Medical Contacts Modal */}
      <Modal visible={activeModal === 'contacts'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Medical Directory</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View>
              {[
                { role: 'Primary Midwife', name: 'Dr. Rebecca Stone', phone: '+91 98765 43210' },
                { role: 'OB/GYN Consultant', name: 'Dr. Anita Roy', phone: '+91 98765 12345' },
                { role: 'Hospital Desk', name: 'City Maternity Wing', phone: '011-23456789' },
              ].map((contact, idx) => (
                <View key={idx} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#EE4D38', textTransform: 'uppercase' }}>{contact.role}</Text>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E1E1E', marginTop: 2 }}>{contact.name}</Text>
                  <TouchableOpacity onPress={() => handleCallEmergency(contact.phone)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                    <Phone size={14} color="#0284C7" />
                    <Text style={{ fontSize: 13, color: '#0284C7', marginLeft: 6, fontWeight: '600' }}>{contact.phone}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal(null)}
              style={{ marginTop: 20, backgroundColor: '#1E1E1E', paddingVertical: 14, borderRadius: 14, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 6. Emergency Support Modal */}
      <Modal visible={activeModal === 'emergency'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <HeartPulse size={20} color="#DC2626" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E1E' }}>Emergency Contacts</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={{ padding: 4 }}>
                <X size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 16, lineHeight: 18 }}>
              In case of severe cramps, heavy bleeding, or sudden pain, please contact immediate medical assistance:
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleCallEmergency('102')}
              style={[styles.emergencyRow, { backgroundColor: '#DC2626' }]}
            >
              <Phone size={18} color="#FFFFFF" />
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginLeft: 10 }}>Call Maternity Ambulance (102)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleCallEmergency('108')}
              style={[styles.emergencyRow, { backgroundColor: '#EE4D38', marginTop: 10 }]}
            >
              <Phone size={18} color="#FFFFFF" />
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginLeft: 10 }}>National Emergency (108)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal(null)}
              style={{ marginTop: 16, paddingVertical: 12, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748B' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  utilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EDEFF2',
    paddingVertical: 22,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#1E1E1E',
    textAlign: 'center',
  },
  cardSubtitle1: {
    fontSize: 12.5,
    color: '#8A94A6',
    textAlign: 'center',
    marginTop: 4,
  },
  cardSubtitle2: {
    fontSize: 12.5,
    color: '#8A94A6',
    textAlign: 'center',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  emergencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
});
