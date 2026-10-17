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
import { savePregnancyProfileApi, getRouteForOnboardingStep } from '@/api/onboarding.api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export default function PregnancyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pregnancyData, setPregnancyData, setStage } = useAppStore();
  const { setOnboarding } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deliveryDate, setDeliveryDate] = useState(pregnancyData.deliveryDate || '');
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

  const isFormValid =
    !!deliveryDate.trim() &&
    !!height.trim() &&
    !isNaN(parseFloat(height)) &&
    parseFloat(height) > 0 &&
    !!weight.trim() &&
    !isNaN(parseFloat(weight)) &&
    parseFloat(weight) > 0 &&
    !!bloodGroup.trim();

  // Modal states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBloodGroupPicker, setShowBloodGroupPicker] = useState(false);

  // Calendar modal state & restrictions: valid from today to upcoming 10 months
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth() + 10, today.getDate());
    d.setHours(23, 59, 59, 999);
    return d;
  }, [today]);

  const [pickerYear, setPickerYear] = useState(today.getFullYear());
  const [pickerMonth, setPickerMonth] = useState(today.getMonth());
  const [pickerDay, setPickerDay] = useState(today.getDate());
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showMonthSelector, setShowMonthSelector] = useState(false);

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
    setShowMonthSelector(false);
  };

  const isMonthDisabled = (m: number) => {
    const monthStart = new Date(pickerYear, m, 1);
    const monthEnd = new Date(pickerYear, m + 1, 0, 23, 59, 59, 999);
    return monthEnd < today || monthStart > maxDate;
  };

  const handleSelectMonth = (m: number) => {
    if (isMonthDisabled(m)) return;

    const maxDays = new Date(pickerYear, m + 1, 0).getDate();
    let newDay = Math.min(pickerDay, maxDays);
    const newDate = new Date(pickerYear, m, newDay);
    newDate.setHours(0, 0, 0, 0);
    if (newDate < today) {
      newDay = today.getDate();
    } else if (newDate > maxDate) {
      newDay = maxDate.getDate();
    }

    setPickerMonth(m);
    setPickerDay(newDay);
    setShowMonthSelector(false);
  };

  const handleOpenDatePicker = () => {
    setShowYearSelector(false);
    setShowMonthSelector(false);
    if (deliveryDate) {
      const parts = deliveryDate.split('/');
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
      Alert.alert('Invalid Date', 'Expected Delivery Date must be between today and the next 10 months.');
      return;
    }
    const formatted = `${String(pickerDay).padStart(2, '0')}/${String(pickerMonth + 1).padStart(2, '0')}/${pickerYear}`;
    setDeliveryDate(formatted);
    setDateError('');
    setShowDatePicker(false);
  };

  const handleContinue = async () => {
    if (!deliveryDate.trim()) {
      setDateError('Please select Expected Delivery Date');
      Alert.alert('Required Field', 'Expected Delivery Date is mandatory. Please select a date to proceed.');
      return;
    }

    if (!height.trim() || isNaN(parseFloat(height)) || parseFloat(height) <= 0) {
      Alert.alert('Required Field', 'Please enter your Height in cm (must be greater than zero).');
      return;
    }

    if (!weight.trim() || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
      Alert.alert('Required Field', 'Please enter your Weight in kg (must be greater than zero).');
      return;
    }

    if (!bloodGroup.trim()) {
      Alert.alert('Required Field', 'Please select your Blood Group.');
      return;
    }

    const parts = deliveryDate.split('/');
    let isoDate = deliveryDate;
    if (parts.length === 3) {
      const [d, m, y] = parts;
      isoDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }

    setPregnancyData({
      deliveryDate,
      height,
      weight,
      bloodGroup,
      isDiabetic,
      bloodPressure,
    });
    setStage('pregnant');

    try {
      setIsSubmitting(true);
      const res = await savePregnancyProfileApi({
        heightCm: height ? parseFloat(height) : undefined,
        weightKg: weight ? parseFloat(weight) : undefined,
        bloodGroup: bloodGroup || undefined,
        diabetic: !!isDiabetic,
        bloodPressure: bloodPressure === 'low' ? 'LOW' : bloodPressure === 'high' ? 'HIGH' : 'NORMAL',
        expectedDeliveryDate: isoDate,
      });

      if (res?.data) {
        await setOnboarding({
          completed: res.data.completed,
          nextStep: res.data.nextStep,
          language: res.data.language?.code || null,
          category: res.data.category?.code || 'PREGNANCY',
          profileComplete: res.data.profileComplete,
        });

        const targetRoute = getRouteForOnboardingStep({
          completed: res.data.completed,
          nextStep: res.data.nextStep,
          category: res.data.category?.code || 'PREGNANCY',
          language: res.data.language?.code || null,
          profileComplete: res.data.profileComplete,
        });

        router.replace(targetRoute as any);
      } else {
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      console.warn('Failed to save pregnancy profile:', err);
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
            <Text style={styles.titleText}>Pregnancy</Text>
          </View>

          {/* 1. Expected Delivery Date (Mandatory) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Expected Delivery Date <Text style={styles.requiredStar}>*</Text>
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
                  { color: deliveryDate ? '#1E293B' : '#94A3B8' },
                ]}
              >
                {deliveryDate || 'Select date'}
              </Text>
              <Calendar size={20} color={dateError ? '#EF4444' : '#1E293B'} strokeWidth={1.8} />
            </Pressable>
            {!!dateError && (
              <Text style={styles.errorText}>{dateError}</Text>
            )}
          </View>

          {/* 2. Your Height and Your Weight Row */}
          <View style={styles.twoColumnRow}>
            {/* Height */}
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>
                Your Height <Text style={styles.requiredStar}>*</Text>
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

            {/* Weight */}
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>
                Your Weight <Text style={styles.requiredStar}>*</Text>
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

          {/* 3. Blood Group */}
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
              trackColor={{ false: '#CBD5E1', true: '#F06292' }}
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

      {/* Date Picker Modal */}
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
              Select Expected Delivery Date
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
    marginTop: 12,
    marginBottom: 28,
  },
  titleText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1E1E1E',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  requiredStar: {
    color: '#EF4444',
    fontWeight: '700',
  },
  optionalLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#94A3B8',
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
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12.5,
    marginTop: 6,
    marginLeft: 4,
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 4,
  },
  yearBadgeButtonActive: {
    backgroundColor: '#FCE4EC',
  },
  calendarYearText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
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
  calendarBodyContainer: {
    height: 278,
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
