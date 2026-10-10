import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Phone,
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Calendar,
  MessageCircle,
  Activity,
  HeartPulse,
  Award,
  ChevronRight,
  Share2,
} from 'lucide-react-native';

const HOSPITAL_DATA = {
  name: 'Mamatvam Mother & Child Hospital',
  tagline: 'Premier Center for Fertility, Maternity & Neonatal Care',
  accreditation: 'NABH Accredited • Level III NICU',
  phone: '+91 98765 43210',
  emergencyPhone: '+91 1800 233 456',
  ambulancePhone: '102',
  whatsapp: '+91 98765 43210',
  address: 'Sector 14, Mother & Child Pavilion, Metro Boulevard, New Delhi, 110001',
  distance: '1.8 km away',
  timings: {
    emergency: 'Open 24 Hours / 7 Days',
    opd: 'Mon – Sat: 08:30 AM – 08:30 PM',
    visiting: '11:00 AM – 01:00 PM & 05:00 PM – 07:00 PM',
  },
  specialties: [
    { title: 'Fertility & IVF Center', desc: 'Advanced reproductive medicine & embryo care' },
    { title: 'High-Risk Pregnancy Care', desc: 'Expert obstetric care with 24/7 monitoring' },
    { title: 'LDR Delivery Suites', desc: 'Labor, delivery & recovery in single luxury room' },
    { title: 'Level III Advanced NICU', desc: '24/7 neonatal intensive care for newborns' },
    { title: 'Fetal Medicine & 4D Scan', desc: 'Real-time fetal anomaly scans & screening' },
    { title: 'Lactation & Postpartum', desc: 'Dedicated breastfeeding counselors & recovery' },
  ],
  facilities: [
    '24/7 Emergency & Maternity Trauma Unit',
    'Dedicated Level-3 Neonatal ICU (NICU)',
    'Ultra-clean HEPA Filter Modular OTs',
    '24/7 In-house Pharmacy & Blood Bank',
    'Advanced 4D Color Doppler Sonography Lab',
    'Personalized Diet & Nutrition Kitchen',
  ],
};

export default function HospitalProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleCall = (phoneNumber: string, label: string = 'Hospital') => {
    Alert.alert(
      `Call ${label}`,
      `Dial ${phoneNumber} now?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`).catch(() => {
              Alert.alert('Error', 'Unable to initiate call on this device.');
            });
          },
        },
      ]
    );
  };

  const handleWhatsApp = () => {
    const url = `whatsapp://send?phone=${HOSPITAL_DATA.whatsapp.replace(/[^0-9]/g, '')}&text=Hello Mamatvam Hospital, I would like to inquire about hospital services.`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(
        `https://wa.me/${HOSPITAL_DATA.whatsapp.replace(/[^0-9]/g, '')}?text=Hello Mamatvam Hospital, I would like to inquire about hospital services.`
      ).catch(() => {
        Alert.alert('Notice', 'WhatsApp is not installed on this device.');
      });
    });
  };

  const handleGetDirections = () => {
    const query = encodeURIComponent(`${HOSPITAL_DATA.name}, ${HOSPITAL_DATA.address}`);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    Linking.openURL(url as string).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.4} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hospital Details</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleCall(HOSPITAL_DATA.emergencyPhone, 'Emergency Desk')}
          style={styles.headerEmergencyBtn}
        >
          <PhoneCall size={16} color="#EE4D38" strokeWidth={2.4} />
          <Text style={styles.headerEmergencyText}>SOS</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
      >
        {/* Hospital Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.logoRow}>
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/mamatvam-icon.png')}
                style={styles.logoImage}
                contentFit="contain"
              />
            </View>
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={14} color="#10B981" />
              <Text style={styles.verifiedText}>Partner Hospital</Text>
            </View>
          </View>

          <Text style={styles.hospitalName}>{HOSPITAL_DATA.name}</Text>
          <Text style={styles.hospitalTagline}>{HOSPITAL_DATA.tagline}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.badgeItem}>
              <Award size={14} color="#F59E0B" />
              <Text style={styles.badgeText}>{HOSPITAL_DATA.accreditation}</Text>
            </View>
          </View>
        </View>

        {/* Primary Action Buttons (Call, SOS, Directions, WhatsApp) */}
        <View style={styles.quickActionsContainer}>
          {/* Main Call Hospital Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleCall(HOSPITAL_DATA.phone, 'Hospital Reception')}
            style={styles.primaryCallBtn}
          >
            <View style={styles.callIconCircle}>
              <Phone size={20} color="#FFFFFF" strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.primaryCallTitle}>Call Hospital</Text>
              <Text style={styles.primaryCallSubtitle}>{HOSPITAL_DATA.phone}</Text>
            </View>
            <ChevronRight size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Secondary Action Grid */}
          <View style={styles.secondaryActionsGrid}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleCall(HOSPITAL_DATA.emergencyPhone, '24/7 Maternity Emergency')}
              style={styles.secondaryActionCard}
            >
              <View style={[styles.actionIconBadge, { backgroundColor: '#FEE2E2' }]}>
                <Activity size={18} color="#EF4444" strokeWidth={2.2} />
              </View>
              <Text style={styles.actionCardTitle}>24/7 Emergency</Text>
              <Text style={styles.actionCardSub}>Helpline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleGetDirections}
              style={styles.secondaryActionCard}
            >
              <View style={[styles.actionIconBadge, { backgroundColor: '#E0F2FE' }]}>
                <MapPin size={18} color="#0284C7" strokeWidth={2.2} />
              </View>
              <Text style={styles.actionCardTitle}>Directions</Text>
              <Text style={styles.actionCardSub}>{HOSPITAL_DATA.distance}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleWhatsApp}
              style={styles.secondaryActionCard}
            >
              <View style={[styles.actionIconBadge, { backgroundColor: '#DCFCE7' }]}>
                <MessageCircle size={18} color="#16A34A" strokeWidth={2.2} />
              </View>
              <Text style={styles.actionCardTitle}>Chat Support</Text>
              <Text style={styles.actionCardSub}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Address & Timings Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Location & Timings</Text>

          <View style={styles.infoRow}>
            <MapPin size={18} color="#EE4D38" style={styles.infoIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoHeading}>Hospital Address</Text>
              <Text style={styles.infoText}>{HOSPITAL_DATA.address}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Clock size={18} color="#10B981" style={styles.infoIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoHeading}>Emergency & Labor Room</Text>
              <Text style={[styles.infoText, { color: '#16A34A', fontWeight: '700' }]}>
                {HOSPITAL_DATA.timings.emergency}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Calendar size={18} color="#0284C7" style={styles.infoIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoHeading}>OPD Consultation Hours</Text>
              <Text style={styles.infoText}>{HOSPITAL_DATA.timings.opd}</Text>
            </View>
          </View>
        </View>

        {/* Key Specialties & Departments */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Key Specialties & Departments</Text>
          <View style={styles.specialtiesList}>
            {HOSPITAL_DATA.specialties.map((item, idx) => (
              <View key={idx} style={styles.specialtyItem}>
                <View style={styles.specialtyDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.specialtyTitle}>{item.title}</Text>
                  <Text style={styles.specialtyDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Hospital Facilities */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Facilities & Highlights</Text>
          <View style={styles.facilitiesGrid}>
            {HOSPITAL_DATA.facilities.map((fac, idx) => (
              <View key={idx} style={styles.facilityItem}>
                <Building2 size={16} color="#EE4D38" style={{ marginTop: 2 }} />
                <Text style={styles.facilityText}>{fac}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Important Contact Numbers List */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Direct Helpline Numbers</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleCall(HOSPITAL_DATA.phone, 'Reception')}
            style={styles.contactRow}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>General Inquiries & Appointments</Text>
              <Text style={styles.contactValue}>{HOSPITAL_DATA.phone}</Text>
            </View>
            <View style={styles.dialBadge}>
              <Phone size={14} color="#EE4D38" />
              <Text style={styles.dialText}>Call</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleCall(HOSPITAL_DATA.emergencyPhone, 'Emergency Desk')}
            style={styles.contactRow}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>24/7 Maternity Emergency Wing</Text>
              <Text style={[styles.contactValue, { color: '#EF4444' }]}>
                {HOSPITAL_DATA.emergencyPhone}
              </Text>
            </View>
            <View style={[styles.dialBadge, { backgroundColor: '#FEE2E2', borderColor: '#FECACA' }]}>
              <PhoneCall size={14} color="#EF4444" />
              <Text style={[styles.dialText, { color: '#EF4444' }]}>SOS</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Bottom Bar for Instant Calling */}
      <View style={[styles.floatingBottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => handleCall(HOSPITAL_DATA.phone, 'Hospital')}
          style={styles.floatingCallBtn}
        >
          <Phone size={20} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.floatingCallText}>Call Hospital Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerEmergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FBDCD5',
  },
  headerEmergencyText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EE4D38',
    marginLeft: 4,
  },
  scrollContent: {
    padding: 16,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF0EE',
    borderWidth: 2,
    borderColor: '#FBDCD5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EE4D38',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
    marginLeft: 4,
  },
  hospitalName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1E1E',
    marginBottom: 4,
    lineHeight: 28,
  },
  hospitalTagline: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 5,
  },
  quickActionsContainer: {
    marginBottom: 16,
  },
  primaryCallBtn: {
    backgroundColor: '#EE4D38',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#EE4D38',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  callIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCallTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  primaryCallSubtitle: {
    fontSize: 12,
    color: '#FFE4E0',
    marginTop: 2,
  },
  secondaryActionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionCardTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  actionCardSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E1E1E',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  infoText: {
    fontSize: 13,
    color: '#334155',
    marginTop: 2,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  specialtiesList: {
    gap: 10,
  },
  specialtyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  specialtyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EE4D38',
    marginTop: 6,
    marginRight: 10,
  },
  specialtyTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  specialtyDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  facilitiesGrid: {
    gap: 8,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  facilityText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  contactLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  dialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FBDCD5',
    gap: 4,
  },
  dialText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EE4D38',
  },
  floatingBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingCallBtn: {
    backgroundColor: '#EE4D38',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#EE4D38',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  floatingCallText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
