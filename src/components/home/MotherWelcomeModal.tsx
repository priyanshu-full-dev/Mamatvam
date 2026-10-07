import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { X, Check } from 'lucide-react-native';
import { PregnancyStage } from '@/store/useAppStore';

const { width } = Dimensions.get('window');

export interface MotherWelcomeModalProps {
  visible: boolean;
  onClose: () => void;
  stage?: PregnancyStage | null;
}

const CHECKLIST_ITEMS = [
  'Daily Parenting Tips',
  'Baby Growth Tracker & more',
  'Essentials Videos for becoming mother',
  'Helping Tools',
  'Experts Advice',
];

export function MotherWelcomeModal({
  visible,
  onClose,
  stage = 'mother',
}: MotherWelcomeModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdropOverlay}>
        <Pressable style={styles.backdropTouchable} onPress={onClose} />

        <View style={styles.cardContainer}>
          {/* Top-Right Close Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Close welcome popup"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <X size={20} color="#1E293B" strokeWidth={2.4} />
          </TouchableOpacity>

          {/* Top Illustration (Smiling sun + cute baby drinking milk from bottle + stars) */}
          <View style={styles.artContainer}>
            <Image
              source={require('@/assets/images/home/congrats_top_art_clean.png')}
              style={styles.topArtImage}
              contentFit="contain"
            />
            {/* Floating Star Cookies on Right */}
            <Image
              source={require('@/assets/images/home/congrats_stars.png')}
              style={styles.floatingStarsImage}
              contentFit="contain"
            />
          </View>

          {/* Heading Content */}
          <View style={styles.textHeaderContainer}>
            <Text style={styles.congratsTitle}>Congratulations !!!</Text>
            <Text style={styles.subTitle}>
              {stage === 'mother' ? 'You are a Mother.' : 'You are Pregnant.'}
            </Text>
            <Text style={styles.description}>
              {stage === 'mother'
                ? 'Your beautiful motherhood journey begins.'
                : 'Your body is creating a life. Incredible.'}
            </Text>
          </View>

          {/* Warm Cream Feature Checklist Box */}
          <View style={styles.checklistCard}>
            {CHECKLIST_ITEMS.map((item, index) => (
              <View key={index} style={styles.checkRow}>
                <View style={styles.checkBadge}>
                  <Check size={13} color="#FFFFFF" strokeWidth={3.5} />
                </View>
                <Text style={styles.checkText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Bottom Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onClose}
            style={styles.exploreBtn}
          >
            <Text style={styles.exploreBtnText}>Explore Mamatvam</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdropOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  backdropTouchable: {
    ...StyleSheet.absoluteFill,
  },
  cardContainer: {
    width: Math.min(width - 44, 350),
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  artContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  topArtImage: {
    width: '100%',
    height: 140,
  },
  floatingStarsImage: {
    position: 'absolute',
    right: 0,
    bottom: -10,
    width: 44,
    height: 60,
  },
  textHeaderContainer: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  congratsTitle: {
    fontSize: 25,
    fontWeight: '900',
    color: '#EE4D38',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1E1E',
    textAlign: 'center',
    marginTop: 4,
  },
  description: {
    fontSize: 13,
    fontWeight: '500',
    color: '#71717A',
    textAlign: 'center',
    marginTop: 4,
  },
  checklistCard: {
    backgroundColor: '#FFF8EE',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4.5,
  },
  checkBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EAB308',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#CA8A04',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  checkText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 10,
    flexShrink: 1,
  },
  exploreBtn: {
    backgroundColor: '#EE4D38',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    shadowColor: '#EE4D38',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
