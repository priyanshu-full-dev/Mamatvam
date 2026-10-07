import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  StyleSheet,
  Dimensions,
  Platform,
  UIManager,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  SlidersHorizontal,
  Search,
  X,
  Star,
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  Building,
  Check,
} from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

export interface ExpertItem {
  id: string;
  name: string;
  specialty: string;
  category: string;
  rating: number;
  reviewsCount: number;
  nextAvailable: string;
  isHighlyRecommended: boolean;
  avatar: any;
  fee: string;
  hospital: string;
  availableSlots: string[];
}

const EXPERTS_LIST: ExpertItem[] = [
  {
    id: 'exp_1',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Senior Gynecologist',
    category: 'Gynecology',
    rating: 4.9,
    reviewsCount: 192,
    nextAvailable: 'Today, 2:30 PM',
    isHighlyRecommended: true,
    avatar: require('@/assets/images/home/categories/gynecology.jpg'),
    fee: '$45',
    hospital: 'City Maternity Care & Women’s Clinic',
    availableSlots: ['Today, 2:30 PM', 'Today, 4:00 PM', 'Tomorrow, 10:30 AM', 'Tomorrow, 2:00 PM'],
  },
  {
    id: 'exp_2',
    name: 'Dr. Priya Sharma',
    specialty: 'Senior Obstetrician & Gynecologist',
    category: 'Doctor',
    rating: 4.9,
    reviewsCount: 184,
    nextAvailable: 'Today, 3:15 PM',
    isHighlyRecommended: true,
    avatar: require('@/assets/images/home/categories/doctor.jpg'),
    fee: '$50',
    hospital: 'Mamatvam Apex Hospital',
    availableSlots: ['Today, 3:15 PM', 'Today, 5:30 PM', 'Tomorrow, 11:00 AM'],
  },
  {
    id: 'exp_3',
    name: 'Dr. Anita Desai',
    specialty: 'Clinical Nutritionist & Dietitian',
    category: 'Nutritionist',
    rating: 4.8,
    reviewsCount: 156,
    nextAvailable: 'Today, 4:00 PM',
    isHighlyRecommended: true,
    avatar: require('@/assets/images/home/categories/nutritionist.jpg'),
    fee: '$35',
    hospital: 'Nourish Maternal Wellness Center',
    availableSlots: ['Today, 4:00 PM', 'Tomorrow, 9:30 AM', 'Tomorrow, 1:30 PM'],
  },
  {
    id: 'exp_4',
    name: 'Dr. Rajesh Verma',
    specialty: 'Lead Fetal Medicine & Sonologist',
    category: 'Sonologist',
    rating: 4.95,
    reviewsCount: 220,
    nextAvailable: 'Tomorrow, 10:00 AM',
    isHighlyRecommended: true,
    avatar: require('@/assets/images/home/categories/sonologist.jpg'),
    fee: '$60',
    hospital: 'Advanced Ultrasound & Diagnostics',
    availableSlots: ['Tomorrow, 10:00 AM', 'Tomorrow, 12:30 PM', 'Friday, 11:00 AM'],
  },
  {
    id: 'exp_5',
    name: 'Dr. Emily Clark',
    specialty: 'Certified Lactation Consultant (IBCLC)',
    category: 'Lactationist',
    rating: 4.9,
    reviewsCount: 142,
    nextAvailable: 'Today, 5:30 PM',
    isHighlyRecommended: true,
    avatar: require('@/assets/images/home/categories/lactationist.jpg'),
    fee: '$40',
    hospital: 'Mother & Newborn Care Pavilion',
    availableSlots: ['Today, 5:30 PM', 'Tomorrow, 2:00 PM', 'Saturday, 10:00 AM'],
  },
  {
    id: 'exp_6',
    name: 'Dr. Marcus Vance',
    specialty: 'Pelvic Floor Physiotherapist',
    category: 'Physiotherapist',
    rating: 4.85,
    reviewsCount: 128,
    nextAvailable: 'Tomorrow, 11:30 AM',
    isHighlyRecommended: true,
    avatar: require('@/assets/images/home/categories/physiotherapist.jpg'),
    fee: '$45',
    hospital: 'Postpartum Rehab Center',
    availableSlots: ['Tomorrow, 11:30 AM', 'Tomorrow, 3:30 PM', 'Friday, 4:00 PM'],
  },
  {
    id: 'exp_7',
    name: 'Master Ananya Rao',
    specialty: 'Certified Prenatal & Postnatal Yoga Guide',
    category: 'Yoga Instructor',
    rating: 4.9,
    reviewsCount: 175,
    nextAvailable: 'Today, 6:00 PM',
    isHighlyRecommended: true,
    avatar: require('@/assets/images/home/categories/yoga.jpg'),
    fee: '$30',
    hospital: 'Prana Maternal Yoga Studio',
    availableSlots: ['Today, 6:00 PM', 'Tomorrow, 7:30 AM', 'Saturday, 8:00 AM'],
  },
  {
    id: 'exp_8',
    name: 'Acharya Devrat Sharma',
    specialty: 'Vedic Astrologer & Muhurta Specialist',
    category: 'Astrologers & Pandits',
    rating: 4.88,
    reviewsCount: 210,
    nextAvailable: 'Today, 4:30 PM',
    isHighlyRecommended: true,
    avatar: require('@/assets/images/home/categories/astrologer.jpg'),
    fee: '$35',
    hospital: 'Spiritual Garbh Sanskar Advisory',
    availableSlots: ['Today, 4:30 PM', 'Tomorrow, 5:00 PM', 'Sunday, 11:00 AM'],
  },
  {
    id: 'exp_9',
    name: 'Ryan Mitchell, CFP',
    specialty: 'Family Financial & Child Education Advisor',
    category: 'Financial advisor',
    rating: 4.8,
    reviewsCount: 96,
    nextAvailable: 'Tomorrow, 2:00 PM',
    isHighlyRecommended: true,
    avatar: require('@/assets/images/home/categories/financial.jpg'),
    fee: '$50',
    hospital: 'Future Secure Family Planning',
    availableSlots: ['Tomorrow, 2:00 PM', 'Thursday, 11:00 AM'],
  },
  {
    id: 'exp_10',
    name: 'Dr. Vikram Patel',
    specialty: 'Stem Cell & Cord Blood Preservation Counselor',
    category: 'Stem Cell Preservation',
    rating: 4.92,
    reviewsCount: 164,
    nextAvailable: 'Today, 3:45 PM',
    isHighlyRecommended: true,
    avatar: require('@/assets/images/home/categories/stem_cell.jpg'),
    fee: '$0 (Complimentary)',
    hospital: 'BioGen Cord Blood Biobank',
    availableSlots: ['Today, 3:45 PM', 'Tomorrow, 1:00 PM', 'Friday, 10:00 AM'],
  },
];

const CATEGORY_TABS = [
  'All',
  'Gynecology',
  'Doctor',
  'Nutritionist',
  'Lactationist',
  'Sonologist',
  'Physiotherapist',
  'Yoga Instructor',
  'Astrologers & Pandits',
  'Financial advisor',
  'Stem Cell Preservation',
];

export default function ExpertDirectoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ categoryTitle?: string; categoryId?: string }>();

  // Determine initial selected tab from params
  const initialTab = useMemo(() => {
    if (!params.categoryTitle) return 'All';
    const found = CATEGORY_TABS.find(
      (tab) => tab.toLowerCase() === params.categoryTitle?.trim().toLowerCase()
    );
    return found || 'All';
  }, [params.categoryTitle]);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Quick booking modal states
  const [selectedExpert, setSelectedExpert] = useState<ExpertItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'clinic' | 'video'>('clinic');
  const [bookingSuccessModal, setBookingSuccessModal] = useState<boolean>(false);

  // Filter experts based on category and search query
  const filteredExperts = useMemo(() => {
    return EXPERTS_LIST.filter((exp) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        exp.category.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesSearch =
        searchQuery.trim() === '' ||
        exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.hospital.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenBooking = (expert: ExpertItem) => {
    setSelectedExpert(expert);
    setSelectedSlot(expert.nextAvailable);
  };

  const handleConfirmAppointment = () => {
    if (!selectedExpert) return;
    setBookingSuccessModal(true);
  };

  const handleDismissSuccess = () => {
    setBookingSuccessModal(false);
    setSelectedExpert(null);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />

      {/* Header Matching Screenshot */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.headerIconBtn}
          accessibilityLabel="Back"
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Expert Directory</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            Alert.alert('Filter Experts', 'Sort by highest rating, fastest availability, or fees.');
          }}
          style={styles.headerIconBtn}
          accessibilityLabel="Filter"
        >
          <SlidersHorizontal size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBarContainer}>
        <Search size={18} color="#94A3B8" style={{ marginRight: 8 }} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search"
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
            <X size={16} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Category Filter Pills */}
      <View style={styles.categoryPillsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsScroll}
        >
          {CATEGORY_TABS.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.75}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Expert Cards List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredExperts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 28, marginBottom: 8 }}>🔍</Text>
            <Text style={styles.emptyTitle}>No Experts Found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching with another keyword or pick another category.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              style={styles.resetSearchBtn}
            >
              <Text style={styles.resetSearchBtnText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredExperts.map((expert) => (
            <TouchableOpacity
              key={expert.id}
              activeOpacity={0.92}
              onPress={() =>
                router.push({
                  pathname: '/expert-profile',
                  params: {
                    id: expert.id,
                    name: expert.name,
                    specialty: expert.specialty,
                    category: expert.category,
                    hospital: expert.hospital,
                    rating: expert.rating.toFixed(1),
                    reviewsCount: expert.reviewsCount.toString(),
                  },
                })
              }
              style={styles.expertCard}
            >
              {/* Top Row: Avatar + Details */}
              <View style={styles.cardTopRow}>
                <Image
                  source={expert.avatar}
                  style={styles.avatarImage}
                  contentFit="cover"
                />

                <View style={styles.cardDetailsCol}>
                  {/* Highly Recommended Badge */}
                  {expert.isHighlyRecommended && (
                    <View style={styles.badgeRow}>
                      <CheckCircle2 size={13} color="#EF4444" />
                      <Text style={styles.badgeText}>Highly Recommended</Text>
                    </View>
                  )}

                  {/* Doctor Name */}
                  <Text style={styles.doctorName} numberOfLines={1}>
                    {expert.name}
                  </Text>

                  {/* Specialization */}
                  <Text style={styles.specialtyText} numberOfLines={1}>
                    {expert.specialty}
                  </Text>

                  {/* Rating & Reviews */}
                  <View style={styles.ratingRow}>
                    <Star size={13} color="#EAB308" fill="#EAB308" />
                    <Text style={styles.ratingScore}>{expert.rating.toFixed(1)}</Text>
                    <Text style={styles.reviewCount}>({expert.reviewsCount})</Text>
                  </View>
                </View>
              </View>

              {/* Bottom Row: Next Available + Book Now Button */}
              <View style={styles.cardBottomRow}>
                <View style={styles.nextAvailableCol}>
                  <Text style={styles.nextAvailableLabel}>NEXT AVAILABLE</Text>
                  <Text style={styles.nextAvailableTime}>{expert.nextAvailable}</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleOpenBooking(expert)}
                  style={styles.bookNowButton}
                >
                  <Calendar size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.bookNowButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* ================= QUICK APPOINTMENT BOOKING MODAL ================= */}
      {selectedExpert && (
        <Modal
          visible={!!selectedExpert}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedExpert(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.bookingModalCard}>
              {/* Modal Header */}
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalHeaderTitle}>Book Appointment</Text>
                <TouchableOpacity
                  onPress={() => setSelectedExpert(null)}
                  style={styles.modalCloseBtn}
                >
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Doctor Summary */}
              <View style={styles.modalDoctorSummary}>
                <Image
                  source={selectedExpert.avatar}
                  style={styles.modalAvatar}
                  contentFit="cover"
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.modalDocName}>{selectedExpert.name}</Text>
                  <Text style={styles.modalDocSpec}>{selectedExpert.specialty}</Text>
                  <Text style={styles.modalDocHospital}>{selectedExpert.hospital}</Text>
                  <Text style={styles.modalDocFee}>Consultation: {selectedExpert.fee}</Text>
                </View>
              </View>

              {/* Consultation Format */}
              <Text style={styles.modalSectionLabel}>Consultation Format</Text>
              <View style={styles.formatRow}>
                <TouchableOpacity
                  onPress={() => setConsultationType('clinic')}
                  style={[
                    styles.formatOption,
                    consultationType === 'clinic' && styles.formatOptionActive,
                  ]}
                >
                  <Building size={16} color={consultationType === 'clinic' ? '#EE4D38' : '#64748B'} />
                  <Text
                    style={[
                      styles.formatOptionText,
                      consultationType === 'clinic' && styles.formatOptionTextActive,
                    ]}
                  >
                    In-Clinic
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setConsultationType('video')}
                  style={[
                    styles.formatOption,
                    consultationType === 'video' && styles.formatOptionActive,
                  ]}
                >
                  <Video size={16} color={consultationType === 'video' ? '#EE4D38' : '#64748B'} />
                  <Text
                    style={[
                      styles.formatOptionText,
                      consultationType === 'video' && styles.formatOptionTextActive,
                    ]}
                  >
                    Video Call
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Available Time Slots */}
              <Text style={styles.modalSectionLabel}>Select Time Slot</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                {selectedExpert.availableSlots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <TouchableOpacity
                      key={slot}
                      onPress={() => setSelectedSlot(slot)}
                      style={[
                        styles.slotPill,
                        isSelected && styles.slotPillActive,
                      ]}
                    >
                      <Clock size={12} color={isSelected ? '#FFFFFF' : '#475569'} style={{ marginRight: 4 }} />
                      <Text
                        style={[
                          styles.slotPillText,
                          isSelected && styles.slotPillTextActive,
                        ]}
                      >
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Action Buttons */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleConfirmAppointment}
                style={styles.confirmBookingBtn}
              >
                <Text style={styles.confirmBookingBtnText}>Confirm Appointment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  const expert = selectedExpert;
                  setSelectedExpert(null);
                  router.push({
                    pathname: '/new-appointment',
                    params: {
                      doctor: expert.name,
                      specialty: expert.specialty,
                    },
                  });
                }}
                style={styles.advancedBookingBtn}
              >
                <Text style={styles.advancedBookingBtnText}>Custom Booking Form</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* ================= SUCCESS CONFIRMATION MODAL ================= */}
      <Modal
        visible={bookingSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleDismissSuccess}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.successIconCircle}>
              <Check size={28} color="#FFFFFF" />
            </View>

            <Text style={styles.successTitle}>Appointment Booked!</Text>
            <Text style={styles.successSubtitle}>
              Your appointment with{' '}
              <Text style={{ fontWeight: '800', color: '#1E293B' }}>
                {selectedExpert?.name}
              </Text>{' '}
              has been scheduled for{' '}
              <Text style={{ fontWeight: '700', color: '#EE4D38' }}>{selectedSlot}</Text>.
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDismissSuccess}
              style={styles.successDoneBtn}
            >
              <Text style={styles.successDoneBtnText}>Great, Done!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF9F6',
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    height: '100%',
  },
  categoryPillsContainer: {
    marginBottom: 10,
  },
  categoryPillsScroll: {
    paddingHorizontal: 16,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#EE4D38',
    borderColor: '#EE4D38',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  expertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  cardDetailsCol: {
    flex: 1,
    marginLeft: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
    marginLeft: 4,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
  },
  specialtyText: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginLeft: 3,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  nextAvailableCol: {
    flex: 1,
  },
  nextAvailableLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  nextAvailableTime: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
  },
  bookNowButton: {
    backgroundColor: '#EE4D38',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#EE4D38',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  bookNowButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 6,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  resetSearchBtn: {
    marginTop: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resetSearchBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  bookingModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  modalDoctorSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  modalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  modalDocName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  modalDocSpec: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalDocHospital: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  modalDocFee: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
    marginTop: 3,
  },
  modalSectionLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  formatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  formatOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formatOptionActive: {
    backgroundColor: '#FFF1EE',
    borderColor: '#EE4D38',
  },
  formatOptionText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 6,
  },
  formatOptionTextActive: {
    color: '#EE4D38',
    fontWeight: '700',
  },
  slotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  slotPillActive: {
    backgroundColor: '#EE4D38',
  },
  slotPillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  slotPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  confirmBookingBtn: {
    backgroundColor: '#EE4D38',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmBookingBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  advancedBookingBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  advancedBookingBtnText: {
    color: '#64748B',
    fontSize: 12.5,
    fontWeight: '600',
  },

  // Success Modal
  successModalCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 30,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    alignSelf: 'center',
    width: width - 60,
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  successSubtitle: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  successDoneBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  successDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
