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
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Droplet, HeartPulse, X, Check } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Radio } from '@/components/ui/Radio';
import { useAppStore } from '@/store/useAppStore';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function PregnancyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pregnancyData, setPregnancyData } = useAppStore();

  const [date, setDate] = useState(pregnancyData.firstDate || '');
  const [deliveryDate, setDeliveryDate] = useState(pregnancyData.deliveryDate || '');
  const [height, setHeight] = useState(pregnancyData.height || '165');
  const [weight, setWeight] = useState(pregnancyData.weight || '60');
  const [bloodGroup, setBloodGroup] = useState(pregnancyData.bloodGroup || '');
  const [isDiabetic, setIsDiabetic] = useState(pregnancyData.isDiabetic || false);
  const [bloodPressure, setBloodPressure] = useState<'low' | 'normal' | 'high'>(
    pregnancyData.bloodPressure || 'normal'
  );

  // Modal states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDatePicker, setActiveDatePicker] = useState<'firstDate' | 'deliveryDate' | null>(null);
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
    if (activeDatePicker === 'firstDate') {
      setDate(formatted);
    } else if (activeDatePicker === 'deliveryDate') {
      setDeliveryDate(formatted);
    }
    setShowDatePicker(false);
    setActiveDatePicker(null);
  };

  const handleContinue = () => {
    setPregnancyData({
      firstDate: date,
      deliveryDate,
      height,
      weight,
      bloodGroup,
      isDiabetic,
      bloodPressure,
    });
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingBottom: insets.bottom > 0 ? 28 : 48,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Screen Title */}
        <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 28 }}>
          <Text style={{ fontSize: 30, fontWeight: '800', color: '#1E1E1E', textAlign: 'center', letterSpacing: -0.5 }}>
            Pregnancy
          </Text>
        </View>

        {/* Form Fields */}
        <View style={{ width: '100%' }}>
          {/* Pregnancy First Date */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E1E1E', marginBottom: 8 }}>
              Pregnancy First Date
            </Text>
            <Pressable
              onPress={() => {
                setActiveDatePicker('firstDate');
                setShowDatePicker(true);
              }}
              style={{
                height: 52,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 16,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 15, color: date ? '#1E1E1E' : '#94A3B8', fontWeight: date ? '600' : '400' }}>
                {date || 'Select date'}
              </Text>
              <Calendar size={20} color="#1E1E1E" />
            </Pressable>
          </View>

          {/* Expected Delivery Date */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E1E1E', marginBottom: 8 }}>
              Expected delivery date
            </Text>
            <Pressable
              onPress={() => {
                setActiveDatePicker('deliveryDate');
                setShowDatePicker(true);
              }}
              style={{
                height: 52,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 16,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 15, color: deliveryDate ? '#1E1E1E' : '#94A3B8', fontWeight: deliveryDate ? '600' : '400' }}>
                {deliveryDate || 'Select date'}
              </Text>
              <Calendar size={20} color="#1E1E1E" />
            </Pressable>
          </View>

          {/* Height and Weight Side by Side */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            {/* Height */}
            <View style={{ width: '47%' }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E1E1E', marginBottom: 8 }}>
                Height (cm)
              </Text>
              <TextInput
                value={height}
                onChangeText={setHeight}
                placeholder="165"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                style={{
                  height: 52,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  fontSize: 15,
                  color: '#1E1E1E',
                  fontWeight: '600',
                }}
              />
            </View>

            {/* Weight */}
            <View style={{ width: '47%' }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E1E1E', marginBottom: 8 }}>
                Weight (kg)
              </Text>
              <TextInput
                value={weight}
                onChangeText={setWeight}
                placeholder="60"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                style={{
                  height: 52,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  fontSize: 15,
                  color: '#1E1E1E',
                  fontWeight: '600',
                }}
              />
            </View>
          </View>

          {/* Blood Group */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E1E1E', marginBottom: 8 }}>
              Blood Group
            </Text>
            <Pressable
              onPress={() => setShowBloodGroupPicker(true)}
              style={{
                height: 52,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 16,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 15, color: bloodGroup ? '#1E1E1E' : '#94A3B8', fontWeight: bloodGroup ? '600' : '400' }}>
                {bloodGroup || 'Select blood group'}
              </Text>
              <ChevronDown size={20} color="#94A3B8" />
            </Pressable>
          </View>

          {/* Diabetic Card */}
          <View
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 16,
              marginBottom: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#E0F2FE',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Droplet size={22} color="#0284C7" fill="#0284C7" />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E', marginLeft: 14 }}>
                Diabetic
              </Text>
            </View>

            <Switch
              value={isDiabetic}
              onValueChange={setIsDiabetic}
              trackColor={{ false: '#E2E8F0', true: '#EE4D38' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Blood Pressure Card */}
          <View
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 20,
              padding: 16,
              marginBottom: 28,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#FFE4E6',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HeartPulse size={22} color="#E11D48" />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E1E1E', marginLeft: 14 }}>
                Blood Pressure
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 18 }}>
              {/* Low */}
              <Pressable
                onPress={() => setBloodPressure('low')}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Radio
                  selected={bloodPressure === 'low'}
                  onPress={() => setBloodPressure('low')}
                  size={20}
                  color="#EE4D38"
                />
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#EF4444', marginLeft: 8 }}>
                  Low
                </Text>
              </Pressable>

              {/* Normal */}
              <Pressable
                onPress={() => setBloodPressure('normal')}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Radio
                  selected={bloodPressure === 'normal'}
                  onPress={() => setBloodPressure('normal')}
                  size={20}
                  color="#EE4D38"
                />
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#10B981', marginLeft: 8 }}>
                  Normal
                </Text>
              </Pressable>

              {/* High */}
              <Pressable
                onPress={() => setBloodPressure('high')}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Radio
                  selected={bloodPressure === 'high'}
                  onPress={() => setBloodPressure('high')}
                  size={20}
                  color="#EE4D38"
                />
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#F59E0B', marginLeft: 8 }}>
                  High
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Continue Button */}
          <Button
            title="Continue"
            onPress={handleContinue}
          />
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowDatePicker(false);
          setActiveDatePicker(null);
        }}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20 }}>
            {/* Modal Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#1E1E1E', marginRight: 10 }}>
                  {MONTH_NAMES[pickerMonth]} {pickerYear}
                </Text>
                <Pressable onPress={handlePrevMonth} hitSlop={10} style={{ padding: 4, marginRight: 2 }}>
                  <ChevronLeft size={20} color="#64748B" />
                </Pressable>
                <Pressable onPress={handleNextMonth} hitSlop={10} style={{ padding: 4 }}>
                  <ChevronRight size={20} color="#64748B" />
                </Pressable>
              </View>
              <Pressable
                onPress={() => {
                  setShowDatePicker(false);
                  setActiveDatePicker(null);
                }}
                hitSlop={10}
              >
                <X size={20} color="#64748B" />
              </Pressable>
            </View>

            {/* Modal Subtitle indicating which date is being selected */}
            <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>
              {activeDatePicker === 'deliveryDate' ? 'Selecting Expected Delivery Date' : 'Selecting Pregnancy First Date'}
            </Text>

            {/* Days of Week Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <Text key={i} style={{ width: 36, textAlign: 'center', fontSize: 13, fontWeight: '600', color: '#94A3B8' }}>
                  {d}
                </Text>
              ))}
            </View>

            {/* Days Grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              {/* Empty leading slots */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <View key={`empty-${i}`} style={{ width: 36, height: 36, margin: 2 }} />
              ))}
              {/* Days numbers */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = pickerDay === day;
                return (
                  <Pressable
                    key={day}
                    onPress={() => setPickerDay(day)}
                    style={{
                      width: 36,
                      height: 36,
                      margin: 2,
                      borderRadius: 18,
                      backgroundColor: isSelected ? '#EE4D38' : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: isSelected ? '700' : '500',
                        color: isSelected ? '#FFFFFF' : '#1E1E1E',
                      }}
                    >
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
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
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '60%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E1E1E' }}>
                Select Blood Group
              </Text>
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
                    style={{
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      backgroundColor: isSelected ? '#FFF1EE' : 'transparent',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: isSelected ? '700' : '500',
                        color: isSelected ? '#EE4D38' : '#1E1E1E',
                      }}
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
