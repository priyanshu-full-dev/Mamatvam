import React, { useState, useMemo } from 'react';
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
  KeyboardAvoidingView,
  Platform,
  Alert,
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
import { Radio } from '@/components/ui/Radio';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function ConceiveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pregnancyData, setPregnancyData, setStage } = useAppStore();

  const [lastPeriodDate, setLastPeriodDate] = useState(pregnancyData.lastPeriodDate || '');
  const [height, setHeight] = useState(
    pregnancyData.height && pregnancyData.height !== '165' ? pregnancyData.height : ''
  );
  const [weight, setWeight] = useState(
    pregnancyData.weight && pregnancyData.weight !== '60' ? pregnancyData.weight : ''
  );
  const [bloodGroup, setBloodGroup] = useState(pregnancyData.bloodGroup || '');
  const [isDiabetic, setIsDiabetic] = useState(pregnancyData.isDiabetic || false);
  const [bloodPressure, setBloodPressure] = useState<'low' | 'normal' | 'high'>(
    pregnancyData.bloodPressure || 'normal'
  );
  const [dateError, setDateError] = useState('');

  const isFormValid = !!lastPeriodDate.trim();

  // Modals
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBloodGroupPicker, setShowBloodGroupPicker] = useState(false);

  // Calendar modal state & restrictions: valid from today to upcoming 2 years
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());
    d.setHours(23, 59, 59, 999);
    return d;
  }, [today]);

  const [pickerYear, setPickerYear] = useState(today.getFullYear());
  const [pickerMonth, setPickerMonth] = useState(today.getMonth());
  const [pickerDay, setPickerDay] = useState(today.getDate());
  const [showYearSelector, setShowYearSelector] = useState(false);

  const availableYears = useMemo(() => {
    const start = today.getFullYear();
    const end = maxDate.getFullYear();
    const list: number[] = [];
    for (let y = start; y <= end; y++) {
      list.push(y);
    }
    return list;
  }, [today, maxDate]);

  const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
  const firstDayIndex = new Date(pickerYear, pickerMonth, 1).getDay();
  const trailingEmptyCount = Math.max(0, 42 - (firstDayIndex + daysInMonth));

  const isMinMonth = pickerYear === today.getFullYear() && pickerMonth === today.getMonth();
  const isMaxMonth = pickerYear === maxDate.getFullYear() && pickerMonth === maxDate.getMonth();

  const handlePrevMonth = () => {
    if (isMinMonth) return;
    if (pickerMonth === 0) {
      setPickerMonth(11);
      setPickerYear((y) => y - 1);
    } else {
      setPickerMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (isMaxMonth) return;
    if (pickerMonth === 11) {
      setPickerMonth(0);
      setPickerYear((y) => y + 1);
    } else {
      setPickerMonth((m) => m + 1);
    }
  };

  const handleSelectYear = (year: number) => {
    let newMonth = pickerMonth;
    if (year === today.getFullYear() && newMonth < today.getMonth()) {
      newMonth = today.getMonth();
    } else if (year === maxDate.getFullYear() && newMonth > maxDate.getMonth()) {
      newMonth = maxDate.getMonth();
    }

    const maxDays = new Date(year, newMonth + 1, 0).getDate();
    let newDay = Math.min(pickerDay, maxDays);
    const newDate = new Date(year, newMonth, newDay);
    newDate.setHours(0, 0, 0, 0);
    if (newDate < today) {
      newDay = today.getDate();
    } else if (newDate > maxDate) {
      newDay = maxDate.getDate();
    }

    setPickerYear(year);
    setPickerMonth(newMonth);
    setPickerDay(newDay);
    setShowYearSelector(false);
  };

  const handleOpenDatePicker = () => {
    setShowYearSelector(false);
    if (lastPeriodDate) {
      const parts = lastPeriodDate.split('/');
      if (parts.length === 3) {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const y = parseInt(parts[2], 10);
        const parsed = new Date(y, m, d);
        parsed.setHours(0, 0, 0, 0);
        if (parsed >= today && parsed <= maxDate) {
          setPickerYear(y);
          setPickerMonth(m);
          setPickerDay(d);
          setShowDatePicker(true);
          return;
        }
      }
    }
    setPickerYear(today.getFullYear());
    setPickerMonth(today.getMonth());
    setPickerDay(today.getDate());
    setShowDatePicker(true);
  };

  const handleConfirmDate = () => {
    const selectedDate = new Date(pickerYear, pickerMonth, pickerDay);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today || selectedDate > maxDate) {
      Alert.alert('Invalid Date', 'Date must be between today and the next 2 years.');
      return;
    }
    const formatted = `${String(pickerDay).padStart(2, '0')}/${String(pickerMonth + 1).padStart(2, '0')}/${pickerYear}`;
    setLastPeriodDate(formatted);
    setDateError('');
    setShowDatePicker(false);
  };

  const handleContinue = () => {
    if (!lastPeriodDate.trim()) {
      setDateError('Please select Last Period Date');
      Alert.alert('Required Field', 'Last Period Date is mandatory. Please select a date to proceed.');
      return;
    }

    const parts = lastPeriodDate.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parseInt(parts[2], 10);
      const parsed = new Date(y, m, d);
      parsed.setHours(0, 0, 0, 0);
      if (parsed < today || parsed > maxDate) {
        setDateError('Date must be between today and next 2 years');
        Alert.alert('Invalid Date', 'Last Period Date must be between today and the next 2 years.');
        return;
      }
    }

    setPregnancyData({
      lastPeriodDate,
      height,
      weight,
      bloodGroup,
      isDiabetic,
      bloodPressure,
    });
    setStage('conceive');
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Screen Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Try To Conceive</Text>
        </View>

        {/* 1. Last Period Date (Mandatory) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>
            Last Period Date <Text style={styles.requiredStar}>*</Text>
          </Text>
          <Pressable
            onPress={handleOpenDatePicker}
            style={[
              styles.inputBox,
              !!dateError && { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
            ]}
          >
            <Text
              style={[
                styles.inputText,
                { color: lastPeriodDate ? '#1E293B' : '#94A3B8' },
              ]}
            >
              {lastPeriodDate || 'Select date'}
            </Text>
            <Calendar size={20} color={dateError ? '#EF4444' : '#1E293B'} strokeWidth={1.8} />
          </Pressable>
          {!!dateError && (
            <Text style={styles.errorText}>{dateError}</Text>
          )}
        </View>

        {/* 2. Your Height and Your Weight Row (Optional) */}
        <View style={styles.twoColumnRow}>
          {/* Your Height */}
          <View style={styles.halfCol}>
            <Text style={styles.fieldLabel}>
              Your Height <Text style={styles.optionalLabel}>(Optional)</Text>
            </Text>
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
            <Text style={styles.fieldLabel}>
              Your Weight <Text style={styles.optionalLabel}>(Optional)</Text>
            </Text>
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

        {/* 3. Blood Group (Optional) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>
            Blood Group <Text style={styles.optionalLabel}>(Optional)</Text>
          </Text>
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

        {/* 4. Diabetic Card (Mandatory) */}
        <View style={styles.diabeticCard}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.dropletIconBadge}>
              <Droplet size={22} color="#0284C7" fill="#0284C7" />
            </View>
            <Text style={styles.cardTitleText}>
              Diabetic <Text style={styles.requiredStar}>*</Text>
            </Text>
          </View>

          <Switch
            value={isDiabetic}
            onValueChange={setIsDiabetic}
            trackColor={{ false: '#CBD5E1', true: '#EE4D38' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#CBD5E1"
          />
        </View>

        {/* 5. Blood Pressure Card (Mandatory) */}
        <View style={styles.bpCard}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.bpIconBadge}>
              <HeartPulse size={22} color="#EF4444" />
            </View>
            <Text style={styles.cardTitleText}>
              Blood Pressure <Text style={styles.requiredStar}>*</Text>
            </Text>
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
                color="#EE4D38"
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
                color="#EE4D38"
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
                color="#EE4D38"
              />
              <Text style={[styles.bpOptionLabel, { color: '#F59E0B' }]}>High</Text>
            </Pressable>
          </View>
        </View>

      </ScrollView>

      {/* Fixed Continue Button at Bottom */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 20),
          backgroundColor: '#FFFFFF',
        }}
      >
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isFormValid}
        />
      </View>
    </KeyboardAvoidingView>

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
                  {MONTH_NAMES[pickerMonth]}
                </Text>

                {/* Clickable Year Selector */}
                <Pressable
                  onPress={() => setShowYearSelector((prev) => !prev)}
                  hitSlop={8}
                  style={[
                    styles.yearBadgeButton,
                    showYearSelector && styles.yearBadgeButtonActive,
                  ]}
                >
                  <Text style={[styles.calendarYearText, showYearSelector && styles.calendarYearTextActive]}>
                    {pickerYear}
                  </Text>
                  <ChevronDown
                    size={16}
                    color={showYearSelector ? '#EE4D38' : '#64748B'}
                  />
                </Pressable>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {!showYearSelector && (
                  <>
                    <Pressable
                      onPress={handlePrevMonth}
                      hitSlop={10}
                      disabled={isMinMonth}
                      style={{ padding: 6, marginRight: 2, opacity: isMinMonth ? 0.25 : 1 }}
                    >
                      <ChevronLeft size={20} color="#64748B" />
                    </Pressable>
                    <Pressable
                      onPress={handleNextMonth}
                      hitSlop={10}
                      disabled={isMaxMonth}
                      style={{ padding: 6, marginRight: 8, opacity: isMaxMonth ? 0.25 : 1 }}
                    >
                      <ChevronRight size={20} color="#64748B" />
                    </Pressable>
                  </>
                )}

                <Pressable
                  onPress={() => {
                    setShowYearSelector(false);
                    setShowDatePicker(false);
                  }}
                  hitSlop={10}
                  style={{ padding: 4 }}
                >
                  <X size={20} color="#64748B" />
                </Pressable>
              </View>
            </View>

            <Text style={styles.modalSubheading}>
              {showYearSelector ? 'Tap a year to switch' : 'Valid from today up to 2 years'}
            </Text>

            {/* Fixed Height Calendar / Year Container (consistent across every month) */}
            <View style={styles.calendarBodyContainer}>
              {showYearSelector ? (
                <View style={styles.yearPickerView}>
                  <View style={styles.yearListContainer}>
                    {availableYears.map((yr) => {
                      const isSelected = pickerYear === yr;
                      return (
                        <Pressable
                          key={yr}
                          onPress={() => handleSelectYear(yr)}
                          style={[
                            styles.yearOptionCard,
                            isSelected && styles.yearOptionCardSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.yearOptionText,
                              isSelected && styles.yearOptionTextSelected,
                            ]}
                          >
                            {yr}
                          </Text>
                          {isSelected ? (
                            <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
                          ) : (
                            <View style={{ width: 20 }} />
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ) : (
                <>
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
                      <View key={`empty-start-${i}`} style={styles.daySlot} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const cellDate = new Date(pickerYear, pickerMonth, day);
                      cellDate.setHours(0, 0, 0, 0);
                      const isDisabled = cellDate < today || cellDate > maxDate;
                      const isSelected = !isDisabled && pickerDay === day;
                      return (
                        <Pressable
                          key={day}
                          disabled={isDisabled}
                          onPress={() => !isDisabled && setPickerDay(day)}
                          style={[
                            styles.daySlot,
                            isSelected && styles.daySlotSelected,
                            isDisabled && styles.daySlotDisabled,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dayNumberText,
                              isSelected && styles.dayNumberTextSelected,
                              isDisabled && styles.dayNumberTextDisabled,
                            ]}
                          >
                            {day}
                          </Text>
                        </Pressable>
                      );
                    })}
                    {Array.from({ length: trailingEmptyCount }).map((_, i) => (
                      <View key={`empty-end-${i}`} style={styles.daySlot} />
                    ))}
                  </View>
                </>
              )}
            </View>

            {/* Actions */}
            <View style={{ marginTop: 20 }}>
              <Button
                title="Confirm Date"
                onPress={handleConfirmDate}
              />
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
                    {isSelected && <Check size={18} color="#EE4D38" />}
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 26,
  },
  titleText: {
    fontSize: 27,
    fontWeight: '800',
    color: '#1E1E1E',
    textAlign: 'center',
    letterSpacing: -0.4,
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
  requiredStar: {
    color: '#EE4D38',
    fontWeight: '700',
  },
  optionalLabel: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#94A3B8',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 2,
    fontWeight: '500',
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
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropletIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 14,
  },
  bpCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  bpIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bpOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 18,
  },
  bpOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bpOptionLabel: {
    fontSize: 14.5,
    fontWeight: '700',
    marginLeft: 7,
  },
  continueButton: {
    height: 52,
    backgroundColor: '#EE4D38',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EE4D38',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  continueButtonText: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalOverlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  calendarModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  calendarMonthText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E1E1E',
    marginRight: 6,
  },
  yearBadgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 6,
  },
  yearBadgeButtonActive: {
    backgroundColor: '#FEE2E2',
  },
  calendarYearText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 4,
  },
  calendarYearTextActive: {
    color: '#EE4D38',
  },
  calendarBodyContainer: {
    height: 278,
  },
  yearPickerView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  yearListContainer: {
    gap: 12,
  },
  yearOptionCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yearOptionCardSelected: {
    backgroundColor: '#EE4D38',
    borderColor: '#EE4D38',
  },
  yearOptionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  yearOptionTextSelected: {
    color: '#FFFFFF',
  },
  modalSubheading: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekDayText: {
    width: 36,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    height: 240,
  },
  daySlot: {
    width: 36,
    height: 36,
    margin: 2,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySlotSelected: {
    backgroundColor: '#EE4D38',
  },
  daySlotDisabled: {
    opacity: 0.3,
  },
  dayNumberText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E1E1E',
  },
  dayNumberTextSelected: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dayNumberTextDisabled: {
    color: '#94A3B8',
  },
  bloodModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '60%',
  },
  bloodModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1E1E',
  },
  bloodItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bloodItemSelected: {
    backgroundColor: '#FFF1EE',
  },
  bloodItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E1E1E',
  },
  bloodItemTextSelected: {
    fontWeight: '700',
    color: '#EE4D38',
  },
});
