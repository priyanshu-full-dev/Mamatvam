import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import {
  ArrowLeft,
  Search,
  Heart,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react-native';

interface BabyName {
  id: string;
  name: string;
  meaning: string;
  gender: 'boy' | 'girl' | 'unisex';
  origin: string;
  rashi: string;
  numerology: number;
}

const BABY_NAMES: BabyName[] = [
  {
    id: '1',
    name: 'Aarav',
    meaning: 'Peaceful, calm sound, wisdom',
    gender: 'boy',
    origin: 'Sanskrit',
    rashi: 'Mesh (Aries)',
    numerology: 1,
  },
  {
    id: '2',
    name: 'Ananya',
    meaning: 'Matchless, unique, Goddess Parvati',
    gender: 'girl',
    origin: 'Sanskrit',
    rashi: 'Mesh (Aries)',
    numerology: 9,
  },
  {
    id: '3',
    name: 'Advik',
    meaning: 'Unique, unparalleled creativity',
    gender: 'boy',
    origin: 'Modern Indian',
    rashi: 'Mesh (Aries)',
    numerology: 3,
  },
  {
    id: '4',
    name: 'Aadhya',
    meaning: 'First power, root energy, Goddess Durga',
    gender: 'girl',
    origin: 'Sanskrit',
    rashi: 'Mesh (Aries)',
    numerology: 6,
  },
  {
    id: '5',
    name: 'Reyansh',
    meaning: 'Ray of sunlight, Vishnu’s part',
    gender: 'boy',
    origin: 'Sanskrit',
    rashi: 'Tula (Libra)',
    numerology: 5,
  },
  {
    id: '6',
    name: 'Kiara',
    meaning: 'Bright, clear, radiant light',
    gender: 'girl',
    origin: 'Modern',
    rashi: 'Mithun (Gemini)',
    numerology: 8,
  },
  {
    id: '7',
    name: 'Kabir',
    meaning: 'Great, leader, saint of mystic love',
    gender: 'boy',
    origin: 'Spiritual',
    rashi: 'Mithun (Gemini)',
    numerology: 7,
  },
  {
    id: '8',
    name: 'Mira',
    meaning: 'Peace, ocean, devotee of divine love',
    gender: 'girl',
    origin: 'Sanskrit',
    rashi: 'Simha (Leo)',
    numerology: 2,
  },
  {
    id: '9',
    name: 'Vivaan',
    meaning: 'Full of life, dawn rays of morning sun',
    gender: 'boy',
    origin: 'Sanskrit',
    rashi: 'Vrishabha (Taurus)',
    numerology: 4,
  },
  {
    id: '10',
    name: 'Tara',
    meaning: 'Shining star, celestial guiding light',
    gender: 'girl',
    origin: 'Sanskrit',
    rashi: 'Tula (Libra)',
    numerology: 3,
  },
  {
    id: '11',
    name: 'Ari',
    meaning: 'Lion, brave, spiritual courage',
    gender: 'unisex',
    origin: 'Modern',
    rashi: 'Mesh (Aries)',
    numerology: 5,
  },
  {
    id: '12',
    name: 'Kiaan',
    meaning: 'Grace of God, royal crowned heart',
    gender: 'boy',
    origin: 'Modern Indian',
    rashi: 'Mithun (Gemini)',
    numerology: 6,
  },
  {
    id: '13',
    name: 'Myra',
    meaning: 'Sweet scent, wondrous blessing',
    gender: 'girl',
    origin: 'Modern',
    rashi: 'Simha (Leo)',
    numerology: 7,
  },
  {
    id: '14',
    name: 'Samar',
    meaning: 'Companion in fruitfulness and twilight conversation',
    gender: 'unisex',
    origin: 'Arabic / Sanskrit',
    rashi: 'Kumbha (Aquarius)',
    numerology: 1,
  },
  {
    id: '15',
    name: 'Ishaan',
    meaning: 'Lord of wealth and dawn sun',
    gender: 'boy',
    origin: 'Sanskrit',
    rashi: 'Mesh (Aries)',
    numerology: 9,
  },
  {
    id: '16',
    name: 'Siya',
    meaning: 'Goddess Sita, radiant moonlight',
    gender: 'girl',
    origin: 'Sanskrit',
    rashi: 'Kumbha (Aquarius)',
    numerology: 4,
  },
];

const ALPHABETS = ['All', 'A', 'I', 'K', 'M', 'R', 'S', 'T', 'V'];

export default function BabyNamesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<'all' | 'boy' | 'girl' | 'unisex'>('all');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    '1': true,
    '4': true,
  });

  const toggleFavorite = (id: string, name: string) => {
    setFavorites((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      return next;
    });
  };

  const filteredNames = useMemo(() => {
    return BABY_NAMES.filter((item) => {
      // Gender filter
      if (selectedGender !== 'all' && item.gender !== selectedGender) {
        return false;
      }
      // Alphabet filter
      if (selectedLetter !== 'All' && !item.name.toUpperCase().startsWith(selectedLetter)) {
        return false;
      }
      // Search filter
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.meaning.toLowerCase().includes(query) ||
          item.origin.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [searchQuery, selectedGender, selectedLetter]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Baby Names</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBarWrapper}>
        <Search size={18} color="#94A3B8" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search by name, meaning or origin..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Gender Filter Chips */}
      <View style={styles.genderRow}>
        {[
          { key: 'all', label: 'All Names' },
          { key: 'boy', label: 'Baby Boy 👦' },
          { key: 'girl', label: 'Baby Girl 👧' },
          { key: 'unisex', label: 'Unisex ✨' },
        ].map((tab) => {
          const isActive = selectedGender === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.8}
              onPress={() => setSelectedGender(tab.key as any)}
              style={[
                styles.genderChip,
                isActive && styles.genderChipActive,
                isActive && tab.key === 'boy' && { backgroundColor: '#0284C7' },
                isActive && tab.key === 'girl' && { backgroundColor: '#EC4899' },
                isActive && tab.key === 'unisex' && { backgroundColor: '#8B5CF6' },
              ]}
            >
              <Text
                style={[
                  styles.genderChipText,
                  isActive && styles.genderChipTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Alphabet Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.alphabetScroll}
      >
        {ALPHABETS.map((ltr) => {
          const isSelected = selectedLetter === ltr;
          return (
            <TouchableOpacity
              key={ltr}
              activeOpacity={0.8}
              onPress={() => setSelectedLetter(ltr)}
              style={[
                styles.alphabetPill,
                isSelected && styles.alphabetPillSelected,
              ]}
            >
              <Text
                style={[
                  styles.alphabetPillText,
                  isSelected && styles.alphabetPillTextSelected,
                ]}
              >
                {ltr}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Main List ScrollView */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Featured "Lucky Name of the Day" Card */}
        <View style={styles.featuredCard}>
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="nameHeroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FFF1F2" />
                <Stop offset="50%" stopColor="#FCE7F3" />
                <Stop offset="100%" stopColor="#EDE9FE" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" rx={20} fill="url(#nameHeroGrad)" />
          </Svg>

          <View style={styles.featuredBadge}>
            <Sparkles size={13} color="#DB2777" />
            <Text style={styles.featuredBadgeText}>Auspicious Name of the Day</Text>
          </View>

          <Text style={styles.featuredName}>Aadhya</Text>
          <Text style={styles.featuredMeaning}>
            "The first power; root energy; Goddess Durga. Embodies grace, divine leadership, and unconditional love."
          </Text>

          <View style={styles.featuredTagsRow}>
            <View style={styles.featuredTag}>
              <Text style={styles.featuredTagText}>Rashi: Mesh (Aries)</Text>
            </View>
            <View style={styles.featuredTag}>
              <Text style={styles.featuredTagText}>Numerology: 6</Text>
            </View>
            <View style={styles.featuredTag}>
              <Text style={styles.featuredTagText}>Sanskrit Origin</Text>
            </View>
          </View>
        </View>

        {/* Section Heading */}
        <View style={styles.resultsHeaderRow}>
          <Text style={styles.resultsCountText}>
            {filteredNames.length} names found
          </Text>
          <Text style={styles.resultsSubText}>Tap heart to bookmark</Text>
        </View>

        {/* Names Cards Grid */}
        {filteredNames.map((item) => {
          const isFav = !!favorites[item.id];
          const genderBadgeBg =
            item.gender === 'boy'
              ? '#E0F2FE'
              : item.gender === 'girl'
              ? '#FCE7F3'
              : '#F3E8FF';
          const genderBadgeColor =
            item.gender === 'boy'
              ? '#0284C7'
              : item.gender === 'girl'
              ? '#DB2777'
              : '#7C3AED';

          return (
            <View key={item.id} style={styles.nameCard}>
              <View style={styles.nameCardHeader}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.nameTitle}>{item.name}</Text>
                    <View style={[styles.genderBadge, { backgroundColor: genderBadgeBg }]}>
                      <Text style={[styles.genderBadgeText, { color: genderBadgeColor }]}>
                        {item.gender === 'boy'
                          ? 'Boy'
                          : item.gender === 'girl'
                          ? 'Girl'
                          : 'Unisex'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.nameMeaning}>{item.meaning}</Text>
                </View>

                {/* Favorite Button */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggleFavorite(item.id, item.name)}
                  style={[
                    styles.favBtn,
                    isFav && { backgroundColor: '#FFE4E6' },
                  ]}
                >
                  <Heart
                    size={20}
                    color={isFav ? '#E11D48' : '#94A3B8'}
                    fill={isFav ? '#E11D48' : 'none'}
                  />
                </TouchableOpacity>
              </View>

              {/* Footer Meta Row */}
              <View style={styles.nameCardFooter}>
                <Text style={styles.nameMetaText}>• Origin: {item.origin}</Text>
                <Text style={styles.nameMetaText}>• {item.rashi}</Text>
                <Text style={styles.nameMetaText}>• Number: {item.numerology}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    padding: 0,
  },
  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 10,
  },
  genderChip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
  },
  genderChipActive: {
    backgroundColor: '#EE4D38',
  },
  genderChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  genderChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  alphabetScroll: {
    paddingHorizontal: 16,
    gap: 6,
    paddingBottom: 10,
  },
  alphabetPill: {
    width: 38,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alphabetPillSelected: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  alphabetPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  alphabetPillTextSelected: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 40,
  },
  featuredCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCE7F3',
    overflow: 'hidden',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  featuredBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DB2777',
  },
  featuredName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#831843',
  },
  featuredMeaning: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
    lineHeight: 18,
  },
  featuredTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  featuredTag: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  featuredTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  resultsCountText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  resultsSubText: {
    fontSize: 11.5,
    color: '#94A3B8',
  },
  nameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  nameCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  nameTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
  },
  genderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  genderBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  nameMeaning: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 17,
  },
  favBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  nameCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  nameMetaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
