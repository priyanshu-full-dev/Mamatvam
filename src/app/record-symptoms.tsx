import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

// 10 Symptoms as shown in Image 1 (defaulting to Morning Sickness with varied common pregnancy symptoms)
export interface SymptomItem {
  id: string;
  name: string;
  image: any;
}

const SYMPTOMS_LIST: SymptomItem[] = [
  { id: 'sym_1', name: 'Morning Sickness', image: require('@/assets/images/symptoms/morning_sickness.png') },
  { id: 'sym_2', name: 'Morning Sickness', image: require('@/assets/images/symptoms/morning_sickness.png') },
  { id: 'sym_3', name: 'Morning Sickness', image: require('@/assets/images/symptoms/morning_sickness.png') },
  { id: 'sym_4', name: 'Morning Sickness', image: require('@/assets/images/symptoms/morning_sickness.png') },
  { id: 'sym_5', name: 'Morning Sickness', image: require('@/assets/images/symptoms/morning_sickness.png') },
  { id: 'sym_6', name: 'Morning Sickness', image: require('@/assets/images/symptoms/morning_sickness.png') },
  { id: 'sym_7', name: 'Morning Sickness', image: require('@/assets/images/symptoms/morning_sickness.png') },
  { id: 'sym_8', name: 'Morning Sickness', image: require('@/assets/images/symptoms/morning_sickness.png') },
  { id: 'sym_9', name: 'Morning Sickness', image: require('@/assets/images/symptoms/morning_sickness.png') },
  { id: 'sym_10', name: 'Morning Sickness', image: require('@/assets/images/symptoms/morning_sickness.png') },
];

export default function RecordSymptomsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Selected symptom IDs (first one selected by default)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['sym_1']));

  const toggleSymptom = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSaveNow = () => {
    if (selectedIds.size === 0) {
      Alert.alert('No symptoms selected', 'Please tap on at least one symptom to record.');
      return;
    }
    // Navigate to history screen with recorded symptoms
    router.push({
      pathname: '/symptoms-history',
      params: {
        recordedCount: selectedIds.size.toString(),
      },
    });
  };

  const topPadding = Math.max(insets.top, 28) + 8;
  const bottomPadding = Math.max(insets.bottom, 20) + 12;

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

        <Text style={styles.headerTitle}>Record Symptoms</Text>

        {/* Placeholder balance */}
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 }]}
      >
        {/* Instruction Subtitle */}
        <Text style={styles.instructionText}>
          Select the symptoms you're experiencing today:
        </Text>

        {/* 2x5 Grid of 10 Symptom Cards */}
        <View style={styles.gridContainer}>
          {SYMPTOMS_LIST.map((item) => {
            const isSelected = selectedIds.has(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => toggleSymptom(item.id)}
                style={[
                  styles.symptomCard,
                  { width: CARD_WIDTH },
                  isSelected && styles.symptomCardSelected,
                ]}
              >
                {/* Active checkmark badge */}
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Check size={11} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}

                {/* Symptom Character Icon */}
                <Image
                  source={item.image}
                  style={styles.symptomIcon}
                  resizeMode="contain"
                />

                {/* Symptom Title */}
                <Text
                  style={[
                    styles.symptomName,
                    isSelected && styles.symptomNameSelected,
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={[styles.bottomActionBar, { paddingBottom: bottomPadding }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/symptoms-history')}
          style={styles.trackBtn}
        >
          <Text style={styles.trackBtnText}>Track Your Symptoms</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSaveNow}
          style={styles.saveBtn}
        >
          <Text style={styles.saveBtnText}>Save Now</Text>
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
    paddingBottom: 12,
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
    paddingTop: 14,
  },
  instructionText: {
    fontSize: 14.5,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 18,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  symptomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 14,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  symptomCardSelected: {
    borderColor: '#ED5042',
    backgroundColor: '#FFF5F5',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ED5042',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symptomIcon: {
    width: 52,
    height: 52,
    marginBottom: 10,
  },
  symptomName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  symptomNameSelected: {
    color: '#ED5042',
    fontWeight: '700',
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FAF9F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  trackBtn: {
    flex: 1.1,
    backgroundColor: '#808080',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  trackBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  saveBtn: {
    flex: 0.9,
    backgroundColor: '#ED5042',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ED5042',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
