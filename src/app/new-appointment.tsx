import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  StyleSheet,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  MapPin,
  Bell,
  CalendarPlus,
} from 'lucide-react-native';

const SPECIALTIES = [
  'OB-GYN',
  'Gynecologist',
  'Radiologist',
  'General Physician',
  'Dentist',
  'Pediatrician',
  'Dietitian',
  'Other',
];

const APPOINTMENT_TYPES = [
  { id: 'routine', label: 'Routine Checkup', icon: '🩺' },
  { id: 'ultrasound', label: 'Ultrasound / Sonography', icon: '📟' },
  { id: 'blood', label: 'Blood Test', icon: '🩸' },
  { id: 'urine', label: 'Urine Test', icon: '🧪' },
  { id: 'consultation', label: 'Consultation', icon: '💬' },
  { id: 'vaccination', label: 'Vaccination', icon: '💉' },
  { id: 'emergency', label: 'Emergency', icon: '🚨' },
  { id: 'followup', label: 'Follow-up', icon: '🔄' },
];

export default function NewAppointmentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Form State
  const [doctorName, setDoctorName] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('OB-GYN');
  const [selectedType, setSelectedType] = useState('routine');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [hospital, setHospital] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAppointment = () => {
    if (!doctorName.trim()) {
      Alert.alert('Doctor Name Required', 'Please enter the doctor name.');
      return;
    }
    if (!hospital.trim()) {
      Alert.alert('Hospital / Clinic Required', 'Please enter the hospital or clinic name.');
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      Alert.alert(
        'Appointment Scheduled! 🎉',
        `Your appointment with ${doctorName} on ${date} at ${time} has been saved.${
          reminderEnabled ? ' Reminder is set for 2 hours prior.' : ''
        }`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 1000);
  };

  const topPadding = Math.max(insets.top, 28) + 8;
  const bottomPadding = Math.max(insets.bottom, 24) + 16;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" translucent={true} />

      {/* Top Header Bar */}
      <View style={[styles.headerBar, { paddingTop: topPadding }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>New Appointment</Text>

        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding + 80 }]}
      >
        {/* 1. Doctor Name * */}
        <Text style={styles.fieldLabel}>Doctor Name *</Text>
        <View style={styles.inputContainer}>
          <User size={18} color="#94A3B8" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="e.g. Dr. Kavitha Sharma"
            placeholderTextColor="#94A3B8"
            value={doctorName}
            onChangeText={setDoctorName}
            style={styles.textInput}
          />
        </View>

        {/* 2. Specialty * */}
        <Text style={styles.fieldLabel}>Specialty *</Text>
        <View style={styles.chipsWrap}>
          {SPECIALTIES.map((spec) => {
            const isSelected = selectedSpecialty === spec;
            return (
              <TouchableOpacity
                key={spec}
                activeOpacity={0.75}
                onPress={() => setSelectedSpecialty(spec)}
                style={[
                  styles.specialtyChip,
                  isSelected ? styles.specialtyChipSelected : styles.specialtyChipUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.specialtyText,
                    isSelected ? styles.specialtyTextSelected : styles.specialtyTextUnselected,
                  ]}
                >
                  {spec}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3. Appointment Type * */}
        <Text style={styles.fieldLabel}>Appointment Type *</Text>
        <View style={styles.chipsWrap}>
          {APPOINTMENT_TYPES.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                activeOpacity={0.75}
                onPress={() => setSelectedType(type.id)}
                style={[
                  styles.typeChip,
                  isSelected ? styles.typeChipSelected : styles.typeChipUnselected,
                ]}
              >
                <Text style={{ fontSize: 13, marginRight: 6 }}>{type.icon}</Text>
                <Text
                  style={[
                    styles.typeText,
                    isSelected ? styles.typeTextSelected : styles.typeTextUnselected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 4. Date * and Time * */}
        <View style={styles.rowTwoFields}>
          {/* Date */}
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.fieldLabel}>Date *</Text>
            <View style={styles.inputContainer}>
              <Calendar size={18} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                value={date}
                onChangeText={setDate}
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Time */}
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Time *</Text>
            <View style={styles.inputContainer}>
              <Clock size={18} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                value={time}
                onChangeText={setTime}
                style={styles.textInput}
              />
            </View>
          </View>
        </View>

        {/* 5. Hospital / Clinic * */}
        <Text style={styles.fieldLabel}>Hospital / Clinic *</Text>
        <View style={styles.inputContainer}>
          <MapPin size={18} color="#94A3B8" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="e.g. Cloudnine Hospital, Bengaluru"
            placeholderTextColor="#94A3B8"
            value={hospital}
            onChangeText={setHospital}
            style={styles.textInput}
          />
        </View>

        {/* 6. Notes (optional) */}
        <Text style={styles.fieldLabel}>Notes (optional)</Text>
        <View style={styles.multilineContainer}>
          <TextInput
            placeholder="Things to remember, carry reports, etc."
            placeholderTextColor="#94A3B8"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.multilineInput}
          />
        </View>

        {/* 7. Set Reminder Card */}
        <View style={styles.reminderCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Bell size={18} color="#E11D48" />
            <Text style={styles.reminderText}>Set Reminder</Text>
          </View>
          <Switch
            value={reminderEnabled}
            onValueChange={setReminderEnabled}
            trackColor={{ false: '#E2E8F0', true: '#E11D48' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E2E8F0"
          />
        </View>
      </ScrollView>

      {/* Bottom Save Action Button */}
      <View style={[styles.bottomBar, { paddingBottom: bottomPadding }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSaveAppointment}
          disabled={isSaving}
          style={styles.saveButtonWrapper}
        >
          <LinearGradient
            colors={['#F43F5E', '#E11D48']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveGradientButton}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.saveButtonContent}>
                <CalendarPlus size={18} color="#FFFFFF" strokeWidth={2.4} style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Save Appointment</Text>
              </View>
            )}
          </LinearGradient>
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
    paddingBottom: 10,
    backgroundColor: '#FAF9F6',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18.5,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#1E293B',
    padding: 0,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  specialtyChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  specialtyChipSelected: {
    backgroundColor: '#FFF5F7',
    borderColor: '#E11D48',
  },
  specialtyChipUnselected: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  specialtyText: {
    fontSize: 12,
  },
  specialtyTextSelected: {
    color: '#E11D48',
    fontWeight: '700',
  },
  specialtyTextUnselected: {
    color: '#64748B',
    fontWeight: '500',
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  typeChipSelected: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FB7185',
  },
  typeChipUnselected: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  typeText: {
    fontSize: 12,
  },
  typeTextSelected: {
    color: '#E11D48',
    fontWeight: '700',
  },
  typeTextUnselected: {
    color: '#64748B',
    fontWeight: '500',
  },
  rowTwoFields: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  multilineContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    height: 96,
    marginBottom: 16,
  },
  multilineInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#1E293B',
    padding: 0,
  },
  reminderCard: {
    backgroundColor: '#FFF5F7',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCE7F3',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  reminderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#FAF9F6',
  },
  saveButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  saveGradientButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
