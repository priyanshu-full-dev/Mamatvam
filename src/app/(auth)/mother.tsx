import React, { useState, useMemo, useEffect } from 'react';
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
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
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
import { Button } from '@/components/ui/Button';
import { BottomActionBar } from '@/components/ui/BottomActionBar';
import { Radio } from '@/components/ui/Radio';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { saveMotherProfileApi, getRouteForOnboardingStep } from '@/api/onboarding.api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export default function MotherScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pregnancyData, setPregnancyData, setStage } = useAppStore();
  const { setOnboarding, isAuthenticated, isLoading, token } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !token)) {
      router.replace('/(auth)/sign-in');
    }
  }, [isAuthenticated, token, isLoading]);

  const [babyBirthDate, setBabyBirthDate] = useState(pregnancyData.babyBirthDate || '');
  const [motherHeight, setMotherHeight] = useState(
    pregnancyData.motherHeight && pregnancyData.motherHeight !== '165' ? pregnancyData.motherHeight : ''
  );
  const [motherWeight, setMotherWeight] = useState(
    pregnancyData.motherWeight && pregnancyData.motherWeight !== '60' ? pregnancyData.motherWeight : ''
  );
  const [babyHeight, setBabyHeight] = useState(
    pregnancyData.babyHeight && pregnancyData.babyHeight !== '165' && pregnancyData.babyHeight !== '50'
      ? pregnancyData.babyHeight
      : ''
  );
  const [babyWeight, setBabyWeight] = useState(
    pregnancyData.babyWeight && pregnancyData.babyWeight !== '60' && pregnancyData.babyWeight !== '3.5'
      ? pregnancyData.babyWeight
      : ''
  );
  const [bloodGroup, setBloodGroup] = useState(pregnancyData.bloodGroup || '');
  const [isDiabetic, setIsDiabetic] = useState(pregnancyData.isDiabetic || false);
  const [bloodPressure, setBloodPressure] = useState<'low' | 'normal' | 'high'>(
    pregnancyData.bloodPressure || 'normal'
  );
  const [dateError, setDateError] = useState('');

  const isFormValid =
    !!babyBirthDate.trim() &&
    !!motherHeight.trim() &&
    !isNaN(parseFloat(motherHeight)) &&
    parseFloat(motherHeight) > 0 &&
    !!motherWeight.trim() &&
    !isNaN(parseFloat(motherWeight)) &&
    parseFloat(motherWeight) > 0 &&
    !!babyHeight.trim() &&
    !isNaN(parseFloat(babyHeight)) &&
    parseFloat(babyHeight) > 0 &&
    !!babyWeight.trim() &&
    !isNaN(parseFloat(babyWeight)) &&
    parseFloat(babyWeight) > 0 &&
    !!bloodGroup.trim();

  // Modal states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBloodGroupPicker, setShowBloodGroupPicker] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showMonthSelector, setShowMonthSelector] = useState(false);

  // Calendar modal state & restrictions: valid for past 2 years up to today
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  }, []);

  const minDate = useMemo(() => {
    const d = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
    d.setHours(0, 0, 0, 0);
    return d;
  }, [today]);

  const [pickerYear, setPickerYear] = useState(today.getFullYear());
  const [pickerMonth, setPickerMonth] = useState(today.getMonth());
  const [pickerDay, setPickerDay] = useState(today.getDate());

  const availableYears = useMemo(() => {
    const start = minDate.getFullYear();
    const end = today.getFullYear();
    const list: number[] = [];
    for (let y = start; y <= end; y++) {
      list.push(y);
    }
    return list;
  }, [minDate, today]);

  const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
  const firstDayIndex = new Date(pickerYear, pickerMonth, 1).getDay();
  const trailingEmptyCount = Math.max(0, 42 - (firstDayIndex + daysInMonth));

  const isMinMonth = pickerYear === minDate.getFullYear() && pickerMonth === minDate.getMonth();
  const isMaxMonth = pickerYear === today.getFullYear() && pickerMonth === today.getMonth();

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
    if (year === minDate.getFullYear() && newMonth < minDate.getMonth()) {
      newMonth = minDate.getMonth();
    } else if (year === today.getFullYear() && newMonth > today.getMonth()) {
      newMonth = today.getMonth();
    }

    const maxDays = new Date(year, newMonth + 1, 0).getDate();
    let newDay = Math.min(pickerDay, maxDays);
    const newDate = new Date(year, newMonth, newDay);
    newDate.setHours(12, 0, 0, 0);
    if (newDate < minDate) {
      newDay = minDate.getDate();
    } else if (newDate > today) {
      newDay = today.getDate();
    }

    setPickerYear(year);
    setPickerMonth(newMonth);
    setPickerDay(newDay);
    setShowYearSelector(false);
    setShowMonthSelector(false);
  };

  const isMonthDisabled = (m: number) => {
    const monthStart = new Date(pickerYear, m, 1);
    const monthEnd = new Date(pickerYear, m + 1, 0, 23, 59, 59, 999);
    return monthEnd < minDate || monthStart > today;
  };

  const handleSelectMonth = (m: number) => {
    if (isMonthDisabled(m)) return;

    const maxDays = new Date(pickerYear, m + 1, 0).getDate();
    let newDay = Math.min(pickerDay, maxDays);
    const newDate = new Date(pickerYear, m, newDay);
    newDate.setHours(12, 0, 0, 0);
    if (newDate < minDate) {
      newDay = minDate.getDate();
    } else if (newDate > today) {
      newDay = today.getDate();
    }

    setPickerMonth(m);
    setPickerDay(newDay);
    setShowMonthSelector(false);
  };

  const handleOpenDatePicker = () => {
    setShowYearSelector(false);
    setShowMonthSelector(false);
    if (babyBirthDate) {
      const parts = babyBirthDate.split('/');
      if (parts.length === 3) {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const y = parseInt(parts[2], 10);
        const parsed = new Date(y, m, d);
        parsed.setHours(12, 0, 0, 0);
        if (parsed >= minDate && parsed <= today) {
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
    selectedDate.setHours(12, 0, 0, 0);
    if (selectedDate < minDate || selectedDate > today) {
      Alert.alert('Invalid Date', 'Date of Birth of Baby must be within the past 2 years up to today.');
      return;
    }
    const formatted = `${String(pickerDay).padStart(2, '0')}/${String(pickerMonth + 1).padStart(2, '0')}/${pickerYear}`;
    setBabyBirthDate(formatted);
    setDateError('');
    setShowDatePicker(false);
  };

  const handleContinue = async () => {
    if (!isAuthenticated || !token) {
      Alert.alert('Session Expired', 'Please sign in to proceed.');
      router.replace('/(auth)/sign-in');
      return;
    }

    if (!babyBirthDate.trim()) {
      setDateError('Please select Date of Birth of Baby');
      Alert.alert('Required Field', 'Date of Birth of Baby is mandatory. Please select a date to proceed.');
      return;
    }

    if (!motherHeight.trim() || isNaN(parseFloat(motherHeight)) || parseFloat(motherHeight) <= 0) {
      Alert.alert('Required Field', 'Please enter Mother Height in cm (must be greater than zero).');
      return;
    }

    if (!motherWeight.trim() || isNaN(parseFloat(motherWeight)) || parseFloat(motherWeight) <= 0) {
      Alert.alert('Required Field', 'Please enter Mother Weight in kg (must be greater than zero).');
      return;
    }

    if (!babyHeight.trim() || isNaN(parseFloat(babyHeight)) || parseFloat(babyHeight) <= 0) {
      Alert.alert('Required Field', 'Please enter Baby Height in cm (must be greater than zero).');
      return;
    }

    if (!babyWeight.trim() || isNaN(parseFloat(babyWeight)) || parseFloat(babyWeight) <= 0) {
      Alert.alert('Required Field', 'Please enter Baby Weight in kg (must be greater than zero).');
      return;
    }

    if (!bloodGroup.trim()) {
      Alert.alert('Required Field', 'Please select Blood Group.');
      return;
    }

    const parts = babyBirthDate.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parseInt(parts[2], 10);
      const parsed = new Date(y, m, d);
      parsed.setHours(12, 0, 0, 0);
      if (parsed < minDate || parsed > today) {
        setDateError('Date must be within past 2 years up to today');
        Alert.alert('Invalid Date', 'Date of Birth of Baby must be within the past 2 years up to today.');
        return;
      }
    }

    // Format DD/MM/YYYY into YYYY-MM-DD
    let isoDate = babyBirthDate;
    if (parts.length === 3) {
      const [d, m, y] = parts;
      isoDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }

    const genderRaw = pregnancyData.babyGender || 'boy';
    const gender: 'BOY' | 'GIRL' = genderRaw.toLowerCase() === 'girl' ? 'GIRL' : 'BOY';

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
    setStage('mother');

    try {
      setIsSubmitting(true);
      const res = await saveMotherProfileApi({
        motherHeightCm: motherHeight ? parseFloat(motherHeight) : undefined,
        motherWeightKg: motherWeight ? parseFloat(motherWeight) : undefined,
        babyHeightCm: babyHeight ? parseFloat(babyHeight) : undefined,
        babyWeightKg: babyWeight ? parseFloat(babyWeight) : undefined,
        babyGender: gender,
        bloodGroup: bloodGroup || undefined,
        diabetic: !!isDiabetic,
        bloodPressure: bloodPressure === 'low' ? 'LOW' : bloodPressure === 'high' ? 'HIGH' : 'NORMAL',
        babyDateOfBirth: isoDate,
      });

      if (res?.success && res?.data) {
        await setOnboarding(res.data);

        const targetRoute = getRouteForOnboardingStep(res.data);
        router.replace(targetRoute as any);
      } else {
        Alert.alert(
          'Submission Failed',
          res?.message || 'Could not save profile. Please try again.'
        );
      }
    } catch (err: any) {
      console.warn('Failed to save mother profile:', err);
      Alert.alert(
        'Submission Failed',
        err?.message || 'Could not save profile. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
            <Text style={styles.titleText}>Post Pregnancy</Text>
          </View>

          {/* 1. Date of Birth of Baby (Mandatory) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Date of Birth of Baby <Text style={styles.requiredStar}>*</Text>
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
                  { color: babyBirthDate ? '#1E293B' : '#94A3B8' },
                ]}
              >
                {babyBirthDate || 'Select date'}
              </Text>
              <Calendar size={20} color={dateError ? '#EF4444' : '#1E293B'} strokeWidth={1.8} />
            </Pressable>
            {!!dateError && (
              <Text style={styles.errorText}>{dateError}</Text>
            )}
          </View>

          {/* 2. Mother Height and Mother Weight */}
          <View style={styles.twoColumnRow}>
            {/* Mother Height */}
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>
                Mother Height <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                value={motherHeight}
                onChangeText={setMotherHeight}
                placeholder="165"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                style={styles.textInputBox}
              />
            </View>

            {/* Mother Weight */}
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>
                Mother Weight <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                value={motherWeight}
                onChangeText={setMotherWeight}
                placeholder="60"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                style={styles.textInputBox}
              />
            </View>
          </View>

          {/* 3. Baby Height and Baby Weight */}
          <View style={styles.twoColumnRow}>
            {/* Baby Height */}
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>
                Baby Height <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                value={babyHeight}
                onChangeText={setBabyHeight}
                placeholder="50"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                style={styles.textInputBox}
              />
            </View>

            {/* Baby Weight */}
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>
                Baby Weight <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                value={babyWeight}
                onChangeText={setBabyWeight}
                placeholder="3.5"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                style={styles.textInputBox}
              />
            </View>
          </View>

          {/* 4. Blood Group */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Blood Group <Text style={styles.requiredStar}>*</Text>
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

          {/* 5. Diabetic Card (Mandatory) */}
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
              trackColor={{ false: '#CBD5E1', true: '#F06292' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#CBD5E1"
            />
          </View>

          {/* 6. Blood Pressure Card (Mandatory) */}
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
                  color="#F06292"
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
                  color="#F06292"
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
                  color="#F06292"
                />
                <Text style={[styles.bpOptionLabel, { color: '#F59E0B' }]}>High</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Continue Button at Bottom */}
        <BottomActionBar
          title="Continue"
          onPress={handleContinue}
          disabled={!isFormValid || isSubmitting}
          loading={isSubmitting}
        />
      </KeyboardAvoidingView>

      {/* Modern Fixed-Height Calendar Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowYearSelector(false);
          setShowMonthSelector(false);
          setShowDatePicker(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => {
              if (showMonthSelector || showYearSelector) {
                setShowMonthSelector(false);
                setShowYearSelector(false);
              } else {
                setShowDatePicker(false);
              }
            }}
          />
          <View style={styles.calendarModalContent}>
            {/* Header */}
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {/* Clickable Month Selector */}
                <Pressable
                  onPress={() => {
                    setShowYearSelector(false);
                    setShowMonthSelector((prev) => !prev);
                  }}
                  hitSlop={8}
                  style={[
                    styles.yearBadgeButton,
                    showMonthSelector && styles.yearBadgeButtonActive,
                  ]}
                >
                  <Text style={[styles.calendarYearText, showMonthSelector && styles.calendarYearTextActive]}>
                    {MONTH_NAMES[pickerMonth]}
                  </Text>
                  <ChevronDown
                    size={16}
                    color={showMonthSelector ? '#F06292' : '#64748B'}
                  />
                </Pressable>

                {/* Clickable Year Selector */}
                <Pressable
                  onPress={() => {
                    setShowMonthSelector(false);
                    setShowYearSelector((prev) => !prev);
                  }}
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
                    color={showYearSelector ? '#F06292' : '#64748B'}
                  />
                </Pressable>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable
                  onPress={handlePrevMonth}
                  disabled={isMinMonth}
                  hitSlop={10}
                  style={[{ padding: 6, marginRight: 2 }, isMinMonth && { opacity: 0.3 }]}
                >
                  <ChevronLeft size={20} color={isMinMonth ? '#CBD5E1' : '#64748B'} />
                </Pressable>
                <Pressable
                  onPress={handleNextMonth}
                  disabled={isMaxMonth}
                  hitSlop={10}
                  style={[{ padding: 6, marginRight: 8 }, isMaxMonth && { opacity: 0.3 }]}
                >
                  <ChevronRight size={20} color={isMaxMonth ? '#CBD5E1' : '#64748B'} />
                </Pressable>

                <Pressable
                  onPress={() => {
                    setShowYearSelector(false);
                    setShowMonthSelector(false);
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
              Select Date of Birth of Baby (Past 2 years)
            </Text>

            {/* Fixed Height Calendar Container (Always visible & interactive) */}
            <View style={styles.calendarBodyContainer}>
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
                  cellDate.setHours(12, 0, 0, 0);
                  const isDisabled = cellDate < minDate || cellDate > today;
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
            </View>

            {/* Floating Month Dropdown Menu */}
            {showMonthSelector && (
              <>
                <Pressable
                  style={StyleSheet.absoluteFill}
                  onPress={() => setShowMonthSelector(false)}
                />
                <View style={styles.monthDropdownMenu}>
                  <View style={styles.dropdownInner}>
                    <ScrollView
                      nestedScrollEnabled
                      showsVerticalScrollIndicator={true}
                      style={styles.dropdownScrollView}
                    >
                      {MONTH_NAMES.map((name, index) => {
                        const disabled = isMonthDisabled(index);
                        if (disabled) return null;
                        const isSelected = pickerMonth === index;
                        return (
                          <Pressable
                            key={name}
                            onPress={() => handleSelectMonth(index)}
                            style={[
                              styles.dropdownMenuItem,
                              isSelected && styles.dropdownMenuItemSelected,
                            ]}
                          >
                            <Text
                              style={[
                                styles.dropdownItemText,
                                isSelected && styles.dropdownItemTextSelected,
                              ]}
                            >
                              {name}
                            </Text>
                            {isSelected && (
                              <Check size={16} color="#F06292" strokeWidth={2.6} />
                            )}
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>
              </>
            )}

            {/* Floating Year Dropdown Menu */}
            {showYearSelector && (
              <>
                <Pressable
                  style={StyleSheet.absoluteFill}
                  onPress={() => setShowYearSelector(false)}
                />
                <View style={styles.yearDropdownMenu}>
                  <View style={styles.dropdownInner}>
                    <ScrollView
                      nestedScrollEnabled
                      showsVerticalScrollIndicator={true}
                      style={styles.dropdownScrollView}
                    >
                      {availableYears.map((yr) => {
                        const isSelected = pickerYear === yr;
                        return (
                          <Pressable
                            key={yr}
                            onPress={() => handleSelectYear(yr)}
                            style={[
                              styles.dropdownMenuItem,
                              isSelected && styles.dropdownMenuItemSelected,
                            ]}
                          >
                            <Text
                              style={[
                                styles.dropdownItemText,
                                isSelected && styles.dropdownItemTextSelected,
                              ]}
                            >
                              {yr}
                            </Text>
                            {isSelected && (
                              <Check size={16} color="#F06292" strokeWidth={2.6} />
                            )}
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>
              </>
            )}

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
                    {isSelected && <Check size={18} color="#F06292" />}
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
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  requiredStar: {
    color: '#EF4444',
    fontWeight: '700',
  },
  optionalLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
  },
  inputBox: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  textInputBox: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    fontWeight: '500',
  },
  inputText: {
    fontSize: 15,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfCol: {
    flex: 1,
  },
  diabeticCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  bpCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropletIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bpIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  bpOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingHorizontal: 8,
  },
  bpOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bpOptionLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalOverlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  calendarModalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  calendarBodyContainer: {
    height: 278,
    justifyContent: 'flex-start',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  calendarMonthText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 6,
  },
  yearBadgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    gap: 4,
  },
  yearBadgeButtonActive: {
    backgroundColor: '#FCE4EC',
  },
  calendarYearText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  calendarYearTextActive: {
    color: '#F06292',
  },
  monthDropdownMenu: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 175,
    maxHeight: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 30,
    zIndex: 9999,
  },
  yearDropdownMenu: {
    position: 'absolute',
    top: 60,
    left: 135,
    width: 125,
    maxHeight: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 30,
    zIndex: 9999,
  },
  dropdownInner: {
    borderRadius: 12.5,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  dropdownScrollView: {
    maxHeight: 250,
  },
  dropdownMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownMenuItemSelected: {
    backgroundColor: '#FCE4EC',
  },
  dropdownItemText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  dropdownItemTextSelected: {
    color: '#F06292',
    fontWeight: '700',
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
    backgroundColor: '#F06292',
  },
  daySlotDisabled: {
    opacity: 0.35,
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
    color: '#CBD5E1',
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
    backgroundColor: '#FCE4EC',
  },
  bloodItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E1E1E',
  },
  bloodItemTextSelected: {
    fontWeight: '700',
    color: '#F06292',
  },
});
