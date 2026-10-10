import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Droplet,
  HeartPulse,
  X,
  Check,
} from 'lucide-react-native';
import { Radio } from '@/components/ui/Radio';
import { useAppStore } from '@/store/useAppStore';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function IuiIvfScreen() {
  const router = useRouter();
  const { pregnancyData, setPregnancyData, setStage } = useAppStore();

  const [lastPeriodDate, setLastPeriodDate] = useState(pregnancyData.lastPeriodDate || '');
  const [height, setHeight] = useState(pregnancyData.height || '165');
  const [weight, setWeight] = useState(pregnancyData.weight || '60');
  const [bloodGroup, setBloodGroup] = useState(pregnancyData.bloodGroup || '');
  const [isDiabetic, setIsDiabetic] = useState(pregnancyData.isDiabetic || false);
  const [bloodPressure, setBloodPressure] = useState<'low' | 'normal' | 'high'>(
    pregnancyData.bloodPressure || 'normal'
  );

  // Modals
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBloodGroupPicker, setShowBloodGroupPicker] = useState(false);

  // Calendar modal state
  const today = new Date();
  const [pickerYear, setPickerYear] = useState(today.getFullYear());
  const [pickerMonth, setPickerMonth] = useState(today.getMonth());
  const [pickerDay, setPickerDay] = useState(today.getDate());

  const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
  const firstDayIndex = new Date(pickerYear, pickerMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (pickerMonth === 0) {
      setPickerMonth(11);
      setPickerYear((y) => y - 1);
    } else {
      setPickerMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (pickerMonth === 11) {
      setPickerMonth(0);
      setPickerYear((y) => y + 1);
    } else {
      setPickerMonth((m) => m + 1);
    }
  };

  const handleConfirmDate = () => {
    const formatted = `${String(pickerDay).padStart(2, '0')}/${String(pickerMonth + 1).padStart(2, '0')}/${pickerYear}`;
    setLastPeriodDate(formatted);
    setShowDatePicker(false);
  };

  const handleContinue = () => {
    setPregnancyData({
      lastPeriodDate,
      height,
      weight,
      bloodGroup,
      isDiabetic,
      bloodPressure,
    });
    setStage('explore');
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header bar with Back button */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>IUI, IVF</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Screen Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>IUI, IVF</Text>
          <Text style={styles.subtitleText}>
            Personalized cycle & fertility tracking for your journey
          </Text>
        </View>

        {/* 1. Last Period Date */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Last Period Date</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={styles.inputBox}
          >
            <Text
              style={[
                styles.inputText,
                { color: lastPeriodDate ? '#1E293B' : '#94A3B8' },
              ]}
            >
              {lastPeriodDate || 'Select date'}
            </Text>
            <Calendar size={20} color="#1E293B" strokeWidth={1.8} />
          </Pressable>
        </View>

        {/* 2. Your Height and Your Weight Row */}
        <View style={styles.twoColumnRow}>
          {/* Your Height */}
          <View style={styles.halfCol}>
            <Text style={styles.fieldLabel}>Your Height</Text>
            <TextInput
              value={height}
              onChangeText={setHeight}
              placeholder="165"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              style={styles.textInputBox}
            />
          </View>

          {/* Your Weight */}
          <View style={styles.halfCol}>
            <Text style={styles.fieldLabel}>Your Weight</Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              placeholder="60"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              style={styles.textInputBox}
            />
          </View>
        </View>

        {/* 3. Blood Group */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Blood Group</Text>
          <Pressable
            onPress={() => setShowBloodGroupPicker(true)}
            style={styles.inputBox}
          >
            <Text
              style={[
                styles.inputText,
                { color: bloodGroup ? '#1E293B' : '#94A3B8' },
              ]}
            >
              {bloodGroup || 'Select blood group'}
            </Text>
            <ChevronDown size={20} color="#94A3B8" />
          </Pressable>
        </View>

        {/* 4. Diabetic Card */}
        <View style={styles.diabeticCard}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.dropletIconBadge}>
              <Droplet size={22} color="#0284C7" fill="#0284C7" />
            </View>
            <Text style={styles.cardTitleText}>Diabetic</Text>
          </View>

          <Switch
            value={isDiabetic}
            onValueChange={setIsDiabetic}
            trackColor={{ false: '#CBD5E1', true: '#8B5CF6' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#CBD5E1"
          />
        </View>

        {/* 5. Blood Pressure Card */}
        <View style={styles.bpCard}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.bpIconBadge}>
              <HeartPulse size={22} color="#EF4444" />
            </View>
            <Text style={styles.cardTitleText}>Blood Pressure</Text>
          </View>

          <View style={styles.bpOptionsRow}>
            {/* Low */}
            <Pressable
              onPress={() => setBloodPressure('low')}
              style={styles.bpOption}
            >
              <Radio
                selected={bloodPressure === 'low'}
                onPress={() => setBloodPressure('low')}
                size={19}
                color="#8B5CF6"
              />
              <Text style={[styles.bpOptionLabel, { color: '#EF4444' }]}>Low</Text>
            </Pressable>

            {/* Normal */}
            <Pressable
              onPress={() => setBloodPressure('normal')}
              style={styles.bpOption}
            >
              <Radio
                selected={bloodPressure === 'normal'}
                onPress={() => setBloodPressure('normal')}
                size={19}
                color="#8B5CF6"
              />
              <Text style={[styles.bpOptionLabel, { color: '#10B981' }]}>Normal</Text>
            </Pressable>

            {/* High */}
            <Pressable
              onPress={() => setBloodPressure('high')}
              style={styles.bpOption}
            >
              <Radio
                selected={bloodPressure === 'high'}
                onPress={() => setBloodPressure('high')}
                size={19}
                color="#8B5CF6"
              />
              <Text style={[styles.bpOptionLabel, { color: '#F59E0B' }]}>High</Text>
            </Pressable>
          </View>
        </View>

        {/* Spacer before button */}
        <View style={{ flex: 1, minHeight: 32 }} />

        {/* Continue Button */}
        <Pressable
          onPress={handleContinue}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModalContent}>
            {/* Header */}
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.calendarMonthText}>
                  {MONTH_NAMES[pickerMonth]} {pickerYear}
                </Text>
                <Pressable onPress={handlePrevMonth} hitSlop={10} style={{ padding: 4, marginRight: 4 }}>
                  <ChevronLeft size={20} color="#64748B" />
                </Pressable>
                <Pressable onPress={handleNextMonth} hitSlop={10} style={{ padding: 4 }}>
                  <ChevronRight size={20} color="#64748B" />
                </Pressable>
              </View>
              <Pressable onPress={() => setShowDatePicker(false)} hitSlop={10}>
                <X size={20} color="#64748B" />
              </Pressable>
            </View>

            <Text style={styles.modalSubheading}>Selecting Last Period Date</Text>

            {/* Days of Week */}
            <View style={styles.weekDaysRow}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <Text key={i} style={styles.weekDayText}>
                  {d}
                </Text>
              ))}
            </View>

            {/* Calendar Days Grid */}
            <View style={styles.daysGrid}>
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <View key={`empty-${i}`} style={styles.daySlot} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = pickerDay === day;
                return (
                  <Pressable
                    key={day}
                    onPress={() => setPickerDay(day)}
                    style={[
                      styles.daySlot,
                      isSelected && styles.daySlotSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumberText,
                        isSelected && styles.dayNumberTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Actions */}
            <View style={{ marginTop: 20 }}>
              <Pressable
                onPress={handleConfirmDate}
                style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>Confirm Date</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Blood Group Picker Modal */}
      <Modal
        visible={showBloodGroupPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBloodGroupPicker(false)}
      >
        <View style={styles.modalOverlayBottom}>
          <View style={styles.bloodModalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.bloodModalTitle}>Select Blood Group</Text>
              <Pressable onPress={() => setShowBloodGroupPicker(false)} hitSlop={10}>
                <X size={20} color="#64748B" />
              </Pressable>
            </View>

            <FlatList
              data={BLOOD_GROUPS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = bloodGroup === item;
                return (
                  <Pressable
                    onPress={() => {
                      setBloodGroup(item);
                      setShowBloodGroupPicker(false);
                    }}
                    style={[
                      styles.bloodItem,
                      isSelected && styles.bloodItemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bloodItemText,
                        isSelected && styles.bloodItemTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && <Check size={18} color="#8B5CF6" />}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E1E1E',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  subtitleText: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  inputBox: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 15,
    fontWeight: '500',
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfCol: {
    width: '48%',
  },
  textInputBox: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
  },
  diabeticCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropletIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitleText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  bpCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  bpIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bpOptionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  bpOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bpOptionLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '700',
  },
  continueButton: {
    height: 52,
    backgroundColor: '#8B5CF6',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalOverlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  calendarModalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarMonthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 8,
  },
  modalSubheading: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 16,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  weekDayText: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  daySlot: {
    width: `${100 / 7}%`,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginVertical: 2,
  },
  daySlotSelected: {
    backgroundColor: '#8B5CF6',
  },
  dayNumberText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  dayNumberTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bloodModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '60%',
  },
  bloodModalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  bloodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  bloodItemSelected: {
    backgroundColor: '#F5F3FF',
    borderRadius: 10,
  },
  bloodItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  bloodItemTextSelected: {
    color: '#8B5CF6',
    fontWeight: '700',
  },
});
