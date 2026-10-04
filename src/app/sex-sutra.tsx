import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, X, Play, Heart, Bookmark } from 'lucide-react-native';

export interface MasterclassItem {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  category: string;
  image: any;
  saved?: boolean;
}

export const MASTERCLASS_DATA: MasterclassItem[] = [
  {
    id: '1',
    title: 'Complete Pregnancy Masterclass: From Conception to Birth',
    subtitle: 'Focus on hip opening and gentle stretching for back relief.',
    duration: '18 min',
    category: 'Full Masterclass',
    image: require('@/assets/images/sutra/masterclass_hero.jpg'),
  },
  {
    id: '2',
    title: 'Intimacy & Emotional Bonding Across Trimesters',
    subtitle: 'Strengthening couple communication, comfort and mutual care.',
    duration: '14 min',
    category: 'Couples & Intimacy',
    image: require('@/assets/images/sutra/partner_bonding.jpg'),
  },
  {
    id: '3',
    title: 'Safe Pelvic Positioning & Comfort Masterclass',
    subtitle: 'Pillow support techniques to alleviate belly and lumbar pressure.',
    duration: '16 min',
    category: 'Physical Comfort',
    image: require('@/assets/images/sutra/pelvic_comfort.jpg'),
  },
  {
    id: '4',
    title: 'Pelvic Floor Relaxation & Gentle Breathing',
    subtitle: 'Doctor-guided Kegel balance, diaphragmatic breath and ease.',
    duration: '12 min',
    category: 'Pelvic Health',
    image: require('@/assets/images/sutra/masterclass_hero.jpg'),
  },
  {
    id: '5',
    title: 'Trimester 3 Readiness & Gentle Non-Straining Closeness',
    subtitle: 'Safe closeness alternatives and preparing for labor tranquility.',
    duration: '15 min',
    category: 'Late Pregnancy',
    image: require('@/assets/images/sutra/partner_bonding.jpg'),
  },
];

export default function SexSutraScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [savedItems, setSavedItems] = useState<string[]>(['1']);

  const toggleSave = (id: string) => {
    if (savedItems.includes(id)) {
      setSavedItems(savedItems.filter((i) => i !== id));
      Alert.alert('Removed', 'Removed from your saved masterclasses.');
    } else {
      setSavedItems([...savedItems, id]);
      Alert.alert('Saved! 🌸', 'Added to your saved masterclasses.');
    }
  };

  const filteredData = MASTERCLASS_DATA.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  const topPadding = Math.max(insets.top, 28) + 8;
  const bottomPadding = Math.max(insets.bottom, 24) + 12;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" translucent={true} />

      {/* Top Header Bar matching Screenshot */}
      <View style={[styles.headerBar, { paddingTop: topPadding }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.headerIconButton}
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Sex Sutra</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsSearchActive(!isSearchActive)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.headerIconButton}
        >
          {isSearchActive ? (
            <X size={22} color="#1E293B" strokeWidth={2.4} />
          ) : (
            <Search size={22} color="#1E293B" strokeWidth={2.4} />
          )}
        </TouchableOpacity>
      </View>

      {/* Expandable Search Input */}
      {isSearchActive && (
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBarInner}>
            <Search size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search masterclasses, trimesters, positions..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <X size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Masterclass Cards List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollList,
          { paddingBottom: bottomPadding + 85 },
        ]}
      >
        {filteredData.map((item) => {
          const isSaved = savedItems.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.88}
              onPress={() =>
                router.push({
                  pathname: '/sex-sutra-detail',
                  params: { id: item.id },
                })
              }
              style={styles.card}
            >
              {/* Left Media Thumbnail */}
              <View style={styles.thumbnailContainer}>
                <Image source={item.image} style={styles.thumbnailImage} resizeMode="cover" />
                <View style={styles.playBadge}>
                  <Play size={12} color="#FFFFFF" fill="#FFFFFF" />
                </View>
              </View>

              {/* Right Text Content */}
              <View style={styles.cardRightContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.cardSubtitle} numberOfLines={3}>
                  {item.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {filteredData.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No masterclass found</Text>
            <Text style={styles.emptySubtitle}>Try searching for "trimester", "comfort", or "stretching"</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Fixed Action Bar matching Screenshot */}
      <View style={[styles.bottomBarContainer, { paddingBottom: bottomPadding }]}>
        <View style={styles.bottomBarRow}>
          {/* Left Button: Track Your Symptoms */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/record-symptoms')}
            style={styles.trackSymptomsButton}
          >
            <Text style={styles.trackSymptomsText}>Track Your Symptoms</Text>
          </TouchableOpacity>

          {/* Right Button: Save Now */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleSave('1')}
            style={styles.saveNowButton}
          >
            <Text style={styles.saveNowText}>Save Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
  },
  headerIconButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18.5,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#1E293B',
    padding: 0,
  },
  scrollList: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1.5,
    alignItems: 'center',
  },
  thumbnailContainer: {
    width: 82,
    height: 82,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    position: 'relative',
    marginRight: 14,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  playBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRightContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginTop: 5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 6,
  },
  bottomBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  trackSymptomsButton: {
    flex: 1.4,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#71717A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  trackSymptomsText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
  saveNowButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  saveNowText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
});
