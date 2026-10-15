import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from 'lucide-react-native';
import { Button } from './Button';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (formattedDate: string) => void;
  selectedDate?: string; // format: DD/MM/YYYY
  minDate?: Date;
  maxDate?: Date;
  subheading?: string;
  confirmTitle?: string;
}

export function DatePickerModal({
  visible,
  onClose,
  onConfirm,
  selectedDate,
  minDate,
  maxDate,
  subheading = 'Valid from today up to 2 years',
  confirmTitle = 'Confirm Date',
}: DatePickerModalProps) {
  const defaultToday = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const effectiveMin = useMemo(() => {
    if (minDate) {
      const d = new Date(minDate);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    return defaultToday;
  }, [minDate, defaultToday]);

  const effectiveMax = useMemo(() => {
    if (maxDate) {
      const d = new Date(maxDate);
      d.setHours(23, 59, 59, 999);
      return d;
    }
    const d = new Date(defaultToday.getFullYear() + 2, defaultToday.getMonth(), defaultToday.getDate());
    d.setHours(23, 59, 59, 999);
    return d;
  }, [maxDate, defaultToday]);

  const [pickerYear, setPickerYear] = useState(defaultToday.getFullYear());
  const [pickerMonth, setPickerMonth] = useState(defaultToday.getMonth());
  const [pickerDay, setPickerDay] = useState(defaultToday.getDate());
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  // Sync state whenever modal opens or selectedDate changes
  useEffect(() => {
    if (visible) {
      setShowYearDropdown(false);
      setShowMonthDropdown(false);
      if (selectedDate) {
        const parts = selectedDate.split('/');
        if (parts.length === 3) {
          const d = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const y = parseInt(parts[2], 10);
          const parsed = new Date(y, m, d);
          parsed.setHours(0, 0, 0, 0);
          if (parsed >= effectiveMin && parsed <= effectiveMax) {
            setPickerYear(y);
            setPickerMonth(m);
            setPickerDay(d);
            return;
          }
        }
      }
      setPickerYear(defaultToday.getFullYear());
      setPickerMonth(defaultToday.getMonth());
      setPickerDay(defaultToday.getDate());
    }
  }, [visible, selectedDate, defaultToday, effectiveMin, effectiveMax]);

  const availableYears = useMemo(() => {
    const start = effectiveMin.getFullYear();
    const end = effectiveMax.getFullYear();
    const list: number[] = [];
    for (let y = start; y <= end; y++) {
      list.push(y);
    }
    return list;
  }, [effectiveMin, effectiveMax]);

  const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
  const firstDayIndex = new Date(pickerYear, pickerMonth, 1).getDay();
  const trailingEmptyCount = Math.max(0, 42 - (firstDayIndex + daysInMonth));

  const isMinMonth = pickerYear === effectiveMin.getFullYear() && pickerMonth === effectiveMin.getMonth();
  const isMaxMonth = pickerYear === effectiveMax.getFullYear() && pickerMonth === effectiveMax.getMonth();

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

  const isMonthDisabled = (m: number) => {
    const monthStart = new Date(pickerYear, m, 1);
    const monthEnd = new Date(pickerYear, m + 1, 0, 23, 59, 59, 999);
    return monthEnd < effectiveMin || monthStart > effectiveMax;
  };

  const handleSelectMonth = (m: number) => {
    if (isMonthDisabled(m)) return;

    const maxDays = new Date(pickerYear, m + 1, 0).getDate();
    let newDay = Math.min(pickerDay, maxDays);
    const newDate = new Date(pickerYear, m, newDay);
    newDate.setHours(0, 0, 0, 0);
    if (newDate < effectiveMin) {
      newDay = effectiveMin.getDate();
    } else if (newDate > effectiveMax) {
      newDay = effectiveMax.getDate();
    }

    setPickerMonth(m);
    setPickerDay(newDay);
    setShowMonthDropdown(false);
  };

  const handleSelectYear = (year: number) => {
    let newMonth = pickerMonth;
    if (year === effectiveMin.getFullYear() && newMonth < effectiveMin.getMonth()) {
      newMonth = effectiveMin.getMonth();
    } else if (year === effectiveMax.getFullYear() && newMonth > effectiveMax.getMonth()) {
      newMonth = effectiveMax.getMonth();
    }

    const maxDays = new Date(year, newMonth + 1, 0).getDate();
    let newDay = Math.min(pickerDay, maxDays);
    const newDate = new Date(year, newMonth, newDay);
    newDate.setHours(0, 0, 0, 0);
    if (newDate < effectiveMin) {
      newDay = effectiveMin.getDate();
    } else if (newDate > effectiveMax) {
      newDay = effectiveMax.getDate();
    }

    setPickerYear(year);
    setPickerMonth(newMonth);
    setPickerDay(newDay);
    setShowYearDropdown(false);
  };

  const handleConfirm = () => {
    const formatted = `${String(pickerDay).padStart(2, '0')}/${String(pickerMonth + 1).padStart(2, '0')}/${pickerYear}`;
    onConfirm(formatted);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        setShowYearDropdown(false);
        setShowMonthDropdown(false);
        onClose();
      }}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            if (showMonthDropdown || showYearDropdown) {
              setShowMonthDropdown(false);
              setShowYearDropdown(false);
            } else {
              onClose();
            }
          }}
        />

        <View style={styles.calendarModalContent}>
          {/* Header Row: Month & Year Dropdown Triggers + Arrows + Close */}
          <View style={styles.modalHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {/* Clickable Month Selector (Dropdown Trigger) */}
              <Pressable
                onPress={() => {
                  setShowYearDropdown(false);
                  setShowMonthDropdown((prev) => !prev);
                }}
                hitSlop={8}
                style={[
                  styles.badgeButton,
                  showMonthDropdown && styles.badgeButtonActive,
                ]}
              >
                <Text style={[styles.badgeText, showMonthDropdown && styles.badgeTextActive]}>
                  {MONTH_NAMES[pickerMonth]}
                </Text>
                <ChevronDown
                  size={16}
                  color={showMonthDropdown ? '#F06292' : '#64748B'}
                />
              </Pressable>

              {/* Clickable Year Selector (Dropdown Trigger) */}
              <Pressable
                onPress={() => {
                  setShowMonthDropdown(false);
                  setShowYearDropdown((prev) => !prev);
                }}
                hitSlop={8}
                style={[
                  styles.badgeButton,
                  showYearDropdown && styles.badgeButtonActive,
                ]}
              >
                <Text style={[styles.badgeText, showYearDropdown && styles.badgeTextActive]}>
                  {pickerYear}
                </Text>
                <ChevronDown
                  size={16}
                  color={showYearDropdown ? '#F06292' : '#64748B'}
                />
              </Pressable>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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

              <Pressable
                onPress={() => {
                  setShowYearDropdown(false);
                  setShowMonthDropdown(false);
                  onClose();
                }}
                hitSlop={10}
                style={{ padding: 4 }}
              >
                <X size={20} color="#64748B" />
              </Pressable>
            </View>
          </View>

          {/* Subheading */}
          <Text style={styles.modalSubheading}>{subheading}</Text>

          {/* Fixed Height Calendar Container */}
          <View style={styles.calendarBodyContainer}>
            {/* Days of Week */}
            <View style={styles.weekDaysRow}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <Text key={i} style={styles.weekDayText}>
                  {d}
                </Text>
              ))}
            </View>

            {/* Calendar Days 6-Row Fixed Grid */}
            <View style={styles.daysGrid}>
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <View key={`empty-start-${i}`} style={styles.daySlot} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const cellDate = new Date(pickerYear, pickerMonth, day);
                cellDate.setHours(0, 0, 0, 0);
                const isDisabled = cellDate < effectiveMin || cellDate > effectiveMax;
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
          {showMonthDropdown && (
            <>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setShowMonthDropdown(false)}
              />
              <View style={styles.monthDropdownMenu}>
                <View style={styles.dropdownInner}>
                  <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={true}
                    style={styles.dropdownScrollView}
                  >
                    {MONTH_NAMES.map((name, index) => {
                      const isSelected = pickerMonth === index;
                      const disabled = isMonthDisabled(index);
                      return (
                        <Pressable
                          key={name}
                          disabled={disabled}
                          onPress={() => handleSelectMonth(index)}
                          style={[
                            styles.dropdownMenuItem,
                            isSelected && styles.dropdownMenuItemSelected,
                            disabled && styles.dropdownMenuItemDisabled,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              isSelected && styles.dropdownItemTextSelected,
                              disabled && styles.dropdownItemTextDisabled,
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
          {showYearDropdown && (
            <>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setShowYearDropdown(false)}
              />
              <View style={styles.yearDropdownMenu}>
                <View style={styles.dropdownInner}>
                  <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
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
              title={confirmTitle}
              onPress={handleConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  calendarModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  badgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 4,
  },
  badgeButtonActive: {
    backgroundColor: '#FCE4EC',
  },
  badgeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  badgeTextActive: {
    color: '#F06292',
  },
  modalSubheading: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  calendarBodyContainer: {
    height: 278,
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
    justifyContent: 'space-between',
  },
  daySlot: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderRadius: 18,
  },
  daySlotSelected: {
    backgroundColor: '#F06292',
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
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dayNumberTextDisabled: {
    color: '#CBD5E1',
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
  dropdownMenuItemDisabled: {
    opacity: 0.35,
    backgroundColor: '#FFFFFF',
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
  dropdownItemTextDisabled: {
    color: '#94A3B8',
  },
});
