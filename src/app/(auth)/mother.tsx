import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { useAppStore } from '@/store/useAppStore';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function MotherScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pregnancyData, setPregnancyData } = useAppStore();

  const [babyBirthDate, setBabyBirthDate] = useState(pregnancyData.babyBirthDate || '');
  const [motherHeight, setMotherHeight] = useState(pregnancyData.motherHeight || '165');
  const [motherWeight, setMotherWeight] = useState(pregnancyData.motherWeight || '60');
  const [babyHeight, setBabyHeight] = useState(pregnancyData.babyHeight || '165');
  const [babyWeight, setBabyWeight] = useState(pregnancyData.babyWeight || '60');
  const [bloodGroup, setBloodGroup] = useState(pregnancyData.bloodGroup || '');
  const [isDiabetic, setIsDiabetic] = useState(pregnancyData.isDiabetic || false);
  const [bloodPressure, setBloodPressure] = useState<'low' | 'normal' | 'high'>(
    pregnancyData.bloodPressure || 'normal'
  );

  // Modal states
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
    setBabyBirthDate(formatted);
    setShowDatePicker(false);
  };

  const handleContinue = () => {
    setPregnancyData({
      babyBirthDate,
      motherHeight,
      motherWeight,
      babyHeight,
      babyWeight,
      bloodGroup,
      isDiabetic,
      bloodPressure,
    });
    router.replace('/(tabs)/home');
  };

  const topPadding = Math.max(insets.top, 24) + 10;
  const bottomPadding = Math.max(insets.bottom, 24) + 12;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />

      {/* Top Header Title matching Screenshot */}
      <View style={[styles.headerContainer, { paddingTop: topPadding }]}>
        <Text style={styles.headerTitle}>Mother</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
      >
        {/* 1. Date of Birth of Baby */}
        <Text style={styles.label}>Date of Birth of Baby</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowDatePicker(true)}
          style={styles.inputContainer}
        >
          <Text style={[styles.inputText, !babyBirthDate && styles.placeholderText]}>
            {babyBirthDate || 'Select date'}
          </Text>
          <Calendar size={20} color="#1E293B" strokeWidth={2} />
        </TouchableOpacity>

        {/* 2. Mother Height & Mother Weight */}
        <View style={styles.twoColumnRow}>
          {/* Mother Height */}
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Mother Height</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={motherHeight}
                onChangeText={setMotherHeight}
                keyboardType="numeric"
                style={styles.textInputField}
              />
            </View>
          </View>

          {/* Mother Weight */}
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Mother Weight</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={motherWeight}
                onChangeText={setMotherWeight}
                keyboardType="numeric"
                style={styles.textInputField}
              />
            </View>
          </View>
        </View>

        {/* 3. Baby Height (cm) & Baby Weight (kg) */}
        <View style={styles.twoColumnRow}>
          {/* Baby Height (cm) */}
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Baby Height (cm)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={babyHeight}
                onChangeText={setBabyHeight}
                keyboardType="numeric"
                style={styles.textInputField}
              />
            </View>
          </View>

          {/* Baby Weight (kg) */}
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Baby Weight (kg)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={babyWeight}
                onChangeText={setBabyWeight}
                keyboardType="numeric"
                style={styles.textInputField}
              />
            </View>
          </View>
        </View>

        {/* 4. Blood Group */}
        <Text style={styles.label}>Blood Group</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowBloodGroupPicker(true)}
          style={styles.inputContainer}
        >
          <Text style={[styles.inputText, !bloodGroup && styles.placeholderText]}>
            {bloodGroup || 'Select blood group'}
          </Text>
          <ChevronDown size={20} color="#94A3B8" />
        </TouchableOpacity>

        {/* 5. Diabetic Card matching Screenshot */}
        <View style={styles.diabeticCard}>
          <View style={styles.diabeticLeftRow}>
            <View style={styles.waterDropCircle}>
              <Droplet size={18} color="#2563EB" fill="#2563EB" />
            </View>
            <Text style={styles.cardMainText}>Diabetic</Text>
          </View>
          <Switch
            value={isDiabetic}
            onValueChange={setIsDiabetic}
            trackColor={{ false: '#CBD5E1', true: '#EF4444' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#CBD5E1"
          />
        </View>

        {/* 6. Blood Pressure Card matching Screenshot */}
        <View style={styles.bpCard}>
          <View style={styles.bpTopRow}>
            <View style={styles.bpHeartCircle}>
              <HeartPulse size={18} color="#EF4444" strokeWidth={2.4} />
            </View>
            <Text style={styles.cardMainText}>Blood Pressure</Text>
          </View>

          {/* Radio Options: Low, Normal, High */}
          <View style={styles.bpRadioRow}>
            {/* Low */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setBloodPressure('low')}
              style={styles.radioOption}
            >
              <View
                style={[
                  styles.radioOuter,
                  bloodPressure === 'low' && styles.radioOuterSelected,
                ]}
              >
                {bloodPressure === 'low' && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.radioLabel, { color: '#EF4444' }]}>Low</Text>
            </TouchableOpacity>

            {/* Normal */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setBloodPressure('normal')}
              style={styles.radioOption}
            >
              <View
                style={[
                  styles.radioOuter,
                  bloodPressure === 'normal' && styles.radioOuterSelected,
                ]}
              >
                {bloodPressure === 'normal' && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.radioLabel, { color: '#16A34A' }]}>Normal</Text>
            </TouchableOpacity>

            {/* High */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setBloodPressure('high')}
              style={styles.radioOption}
            >
              <View
                style={[
                  styles.radioOuter,
                  bloodPressure === 'high' && styles.radioOuterSelected,
                ]}
              >
                {bloodPressure === 'high' && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.radioLabel, { color: '#EAB308' }]}>High</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 7. Continue Button matching Screenshot */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleContinue}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.calendarModal}>
            <View style={styles.calHeader}>
              <TouchableOpacity onPress={handlePrevMonth} style={styles.calNavBtn}>
                <ChevronLeft size={22} color="#1E293B" />
              </TouchableOpacity>
              <Text style={styles.calMonthYear}>
                {MONTH_NAMES[pickerMonth]} {pickerYear}
              </Text>
              <TouchableOpacity onPress={handleNextMonth} style={styles.calNavBtn}>
                <ChevronRight size={22} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <View style={styles.calDaysHeader}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <Text key={d} style={styles.calDayLabel}>
                  {d}
                </Text>
              ))}
            </View>

            <View style={styles.calGrid}>
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <View key={`empty-${i}`} style={styles.calDayCell} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected = pickerDay === dayNum;
                return (
                  <TouchableOpacity
                    key={`day-${dayNum}`}
                    onPress={() => setPickerDay(dayNum)}
                    style={[styles.calDayCell, isSelected && styles.calDaySelected]}
                  >
                    <Text style={[styles.calDayText, isSelected && styles.calDayTextSelected]}>
                      {dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.calActionRow}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={styles.calCancelBtn}
              >
                <Text style={styles.calCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmDate} style={styles.calConfirmBtn}>
                <Text style={styles.calConfirmText}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Blood Group Picker Modal */}
      <Modal
        visible={showBloodGroupPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBloodGroupPicker(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowBloodGroupPicker(false)}
          style={styles.modalBackdrop}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Blood Group</Text>
              <TouchableOpacity onPress={() => setShowBloodGroupPicker(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={BLOOD_GROUPS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.bloodGroupItem,
                    bloodGroup === item && styles.bloodGroupItemSelected,
                  ]}
                  onPress={() => {
                    setBloodGroup(item);
                    setShowBloodGroupPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.bloodGroupText,
                      bloodGroup === item && styles.bloodGroupTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {bloodGroup === item && <Check size={18} color="#EF4444" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  label: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    marginTop: 10,
  },
  inputContainer: {
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  textInputField: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
    padding: 0,
  },
  inputText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  placeholderText: {
    color: '#64748B',
  },
  twoColumnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diabeticCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 12,
  },
  diabeticLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterDropCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardMainText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  bpCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 26,
  },
  bpTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  bpHeartCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  bpRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: '#1E293B',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1E293B',
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  continueButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarModal: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  calHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calNavBtn: {
    padding: 6,
  },
  calMonthYear: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  calDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  calDayLabel: {
    width: 38,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calDayCell: {
    width: '14.28%',
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calDaySelected: {
    backgroundColor: '#EF4444',
    borderRadius: 19,
  },
  calDayText: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
  },
  calDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  calActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  calCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  calCancelText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  calConfirmBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  calConfirmText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bottomSheet: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
    marginTop: 'auto',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  bloodGroupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  bloodGroupItemSelected: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  bloodGroupText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  bloodGroupTextSelected: {
    color: '#EF4444',
    fontWeight: '700',
  },
});
