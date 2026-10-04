import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  StyleSheet,
  Dimensions,
  Modal,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Search,
  X,
  Share2,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  LayoutGrid,
  List,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const GRID_CARD_WIDTH = (width - 44) / 2;

export interface NuskhaItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  trimester: '1st Trimester' | '2nd Trimester' | '3rd Trimester' | 'All Trimesters';
  badgeColor: string;
  badgeTextColor: string;
  prepTime: string;
  image: any;
  story: string;
  ingredients: string[];
  instructions: string[];
  safetyNote: string;
}

const NUSKHE_LIST: NuskhaItem[] = [
  {
    id: 'nuskha_1',
    title: 'Adrak & Madhu Kadha',
    subtitle: 'Cure cold & throat irritation in a jiffy',
    category: 'Cold & Cough',
    trimester: 'All Trimesters',
    badgeColor: '#FEF3C7',
    badgeTextColor: '#B45309',
    prepTime: '5 mins',
    image: require('@/assets/images/nuskhe/nuskhe_ginger_honey.jpg'),
    story:
      'Catching a cold during pregnancy is exhausting. Traditional antibiotics should be avoided without prescription. Grandmothers swear by this gentle warm infusion of crushed fresh ginger, pure raw honey, and a drop of lemon to soothe your throat naturally.',
    ingredients: [
      '1 inch fresh ginger (crushed or grated)',
      '1.5 cups filtered water',
      '1 tsp pure organic honey',
      '2-3 fresh holy basil (tulsi) leaves',
      'A drop of lemon juice',
    ],
    instructions: [
      'Boil water with crushed ginger and tulsi leaves for 4-5 minutes.',
      'Strain the hot water into a cup.',
      'Allow it to cool to warm (never mix honey in boiling water).',
      'Stir in 1 tsp pure honey and sip slowly twice daily.',
    ],
    safetyNote: 'Mild ginger is safe during pregnancy and also combats nausea. Avoid excess black pepper.',
  },
  {
    id: 'nuskha_2',
    title: 'Golden Haldi Kesar Doodh',
    subtitle: 'Relieve backache & enjoy sound restful sleep',
    category: 'Sleep & Muscle Relief',
    trimester: '3rd Trimester',
    badgeColor: '#FEF9C3',
    badgeTextColor: '#A16207',
    prepTime: '7 mins',
    image: require('@/assets/images/nuskhe/nuskhe_turmeric_milk.jpg'),
    story:
      'In the late second and third trimesters, pelvic strain and interrupted sleep are common. A warm cup of turmeric golden milk infused with fragrant Kashmiri saffron and crushed almonds calms the nervous system and relaxes tight back muscles.',
    ingredients: [
      '1 cup warm full-cream or toned milk',
      '1/4 tsp pure organic turmeric powder',
      '2-3 strands of Kashmiri saffron (kesar)',
      '4 crushed blanched almonds & pistachios',
      '1/2 tsp natural jaggery or mishri',
    ],
    instructions: [
      'Heat milk on low flame and whisk in turmeric powder.',
      'Add saffron strands and crushed dry fruits, letting it simmer for 3 minutes.',
      'Sweeten with a touch of jaggery or mishri and drink 30 minutes before bedtime.',
    ],
    safetyNote: 'Use only a gentle pinch of turmeric. Do not consume high medicinal doses.',
  },
  {
    id: 'nuskha_3',
    title: 'Roasted Ajwain & Jeera Paani',
    subtitle: 'Instant relief from gas, bloating & heavy digestion',
    category: 'Digestion & Gas',
    trimester: '2nd Trimester',
    badgeColor: '#E0F2FE',
    badgeTextColor: '#0369A1',
    prepTime: '6 mins',
    image: require('@/assets/images/nuskhe/nuskhe_ajwain_water.jpg'),
    story:
      'Growing baby bump puts pressure on the stomach and slows digestion. Our grandmothers always kept roasted ajwain (carom seeds) and jeera handy to instantly release trapped gas and settle post-meal bloating without pharmaceutical antacids.',
    ingredients: [
      '1/2 tsp ajwain (carom seeds)',
      '1/2 tsp jeera (cumin seeds)',
      '2 cups water',
      'A pinch of pink rock salt (sendha namak)',
    ],
    instructions: [
      'Lightly dry-roast ajwain and jeera on a tawa until aromatic (30 seconds).',
      'Add water and boil until reduced by half.',
      'Strain, add a pinch of sendha namak, and sip warm after lunch or dinner.',
    ],
    safetyNote: 'Highly recommended for digestion. Safe in moderate culinary quantities.',
  },
  {
    id: 'nuskha_4',
    title: 'Nariyal Paani with Saunf',
    subtitle: 'Cool heartburn, acidity & morning hydration',
    category: 'Heartburn & Acidity',
    trimester: '1st Trimester',
    badgeColor: '#DCFCE7',
    badgeTextColor: '#15803D',
    prepTime: '2 mins',
    image: require('@/assets/images/nuskhe/nuskhe_coconut_water.jpg'),
    story:
      'Heartburn strikes frequently as pregnancy hormones relax the esophagus. Drinking fresh tender coconut water steeped with crushed green fennel seeds (saunf) provides an alkaline cooling shield that quenches acidity within minutes.',
    ingredients: [
      '1 glass fresh green tender coconut water',
      '1 tsp sweet green fennel seeds (saunf)',
      '3-4 fresh mint leaves',
    ],
    instructions: [
      'Soak fennel seeds in fresh coconut water for 15-20 minutes.',
      'Garnish with fresh crushed mint leaves and sip mid-morning.',
    ],
    safetyNote: 'Naturally rich in electrolytes and potassium. Perfect alternative to artificial hydration drinks.',
  },
  {
    id: 'nuskha_5',
    title: 'Nimbu Pudina Swaras',
    subtitle: 'Beat morning sickness & afternoon dizziness',
    category: 'Morning Sickness',
    trimester: '1st Trimester',
    badgeColor: '#FDF2F8',
    badgeTextColor: '#BE185D',
    prepTime: '3 mins',
    image: require('@/assets/images/home/herbal_bowl.jpg'),
    story:
      'Nausea and sudden olfactory sensitivity can make eating difficult in the first 12 weeks. Freshly crushed mint leaves with roasted cumin and fresh lime activates salivary enzymes and calms nausea immediately upon waking up.',
    ingredients: [
      '10 fresh garden mint leaves',
      'Juice of 1/2 fresh lime',
      '1 glass chilled or room temperature water',
      '1/4 tsp roasted jeera powder',
      '1/2 tsp organic honey or rock sugar',
    ],
    instructions: [
      'Crush mint leaves lightly with mortar and pestle to release aromatic menthol oils.',
      'Mix into water with lemon juice, roasted cumin, and honey.',
      'Sip in small gentle swallows whenever waves of nausea begin.',
    ],
    safetyNote: 'Mint and lemon aroma naturally suppress the brain’s nausea center.',
  },
  {
    id: 'nuskha_6',
    title: 'Amla & Curry Leaf Elixir',
    subtitle: 'Boost hemoglobin & prevent pregnancy fatigue',
    category: 'Iron & Immunity',
    trimester: '2nd Trimester',
    badgeColor: '#FEE2E2',
    badgeTextColor: '#B91C1C',
    prepTime: '5 mins',
    image: require('@/assets/images/nuskhe/nuskhe_hero_herbs.jpg'),
    story:
      'Indian gooseberry (Amla) is the richest natural source of Vitamin C which amplifies iron absorption by 300%. Grandmothers paired amla juice with fresh curry leaves to build maternal red blood cells and glowing skin.',
    ingredients: [
      '1 fresh deseeded Indian gooseberry (amla)',
      '6-7 fresh washed curry leaves',
      '1/2 glass warm water',
      '1 tsp honey or jaggery',
    ],
    instructions: [
      'Blend amla with curry leaves and 1/2 glass water into a smooth juice.',
      'Strain through a fine sieve and mix in honey.',
      'Drink first thing in the morning.',
    ],
    safetyNote: '100% natural, high in iron, Vitamin C, and antioxidants.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Nuskhe', icon: '✨' },
  { id: '1st', label: '1st Trimester', icon: '🍋' },
  { id: '2nd', label: '2nd Trimester', icon: '🍃' },
  { id: '3rd', label: '3rd Trimester', icon: '🌙' },
  { id: 'cold', label: 'Cold & Cough', icon: '☕' },
];

export default function DadiNaniNuskheScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Supports both Image 1 & Image 2!

  // Detail Modal State
  const [selectedNuskha, setSelectedNuskha] = useState<NuskhaItem | null>(null);

  const topPadding = Math.max(insets.top, 28) + 8;

  // Filter items
  const filteredItems = NUSKHE_LIST.filter((item) => {
    // Category match
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === '1st' && (item.trimester === '1st Trimester' || item.trimester === 'All Trimesters')) ||
      (selectedCategory === '2nd' && (item.trimester === '2nd Trimester' || item.trimester === 'All Trimesters')) ||
      (selectedCategory === '3rd' && (item.trimester === '3rd Trimester' || item.trimester === 'All Trimesters')) ||
      (selectedCategory === 'cold' && item.category.toLowerCase().includes('cold'));

    // Search query match
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleShare = async (nuskha: NuskhaItem) => {
    try {
      await Share.share({
        title: nuskha.title,
        message: `Dadi Nani Ka Nuskha: ${nuskha.title}\n${nuskha.subtitle}\n\nRecipe: ${nuskha.story}\n\nShared via Mamatvam Pregnancy App.`,
      });
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" translucent={true} />

      {/* Top Header Bar */}
      <View style={[styles.headerBar, { paddingTop: topPadding }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.headerBtn}
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Dadi Nani Ke Nuskhe</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Toggle View Mode (List vs Grid) */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setViewMode((prev) => (prev === 'list' ? 'grid' : 'list'))}
            style={[styles.headerBtn, { marginRight: 6 }]}
          >
            {viewMode === 'list' ? (
              <LayoutGrid size={20} color="#64748B" />
            ) : (
              <List size={20} color="#64748B" />
            )}
          </TouchableOpacity>

          {/* Search Toggle */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowSearch((prev) => !prev)}
            style={styles.headerBtn}
          >
            {showSearch ? (
              <X size={20} color="#1E293B" strokeWidth={2.4} />
            ) : (
              <Search size={20} color="#1E293B" strokeWidth={2.4} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input Bar (if open) */}
      {showSearch && (
        <View style={styles.searchBarWrapper}>
          <Search size={16} color="#94A3B8" />
          <TextInput
            placeholder="Search nuskhe (cold, nausea, gas, sleep)..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 24 },
        ]}
      >
        {/* Vibrant Glowing Hero Banner */}
        <View style={styles.heroBanner}>
          <Image
            source={require('@/assets/images/nuskhe/nuskhe_hero_herbs.jpg')}
            style={styles.heroBannerImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(217, 119, 6, 0.85)', 'rgba(180, 83, 9, 0.55)', 'rgba(0,0,0,0.4)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroOverlay}
          >
            <View style={styles.heroBadgeRow}>
              <Sparkles size={14} color="#FEF3C7" />
              <Text style={styles.heroBadgeText}>Ancient Maternal Wisdom</Text>
            </View>
            <Text style={styles.heroTitle}>Grandmother's Trusted Healing Secrets 🌿</Text>
            <Text style={styles.heroSubtitle}>
              Safe, 100% natural Ayurvedic home remedies for every trimester
            </Text>
          </LinearGradient>
        </View>

        {/* Filter Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipSelected,
                ]}
              >
                <Text style={styles.categoryChipIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && styles.categoryChipTextSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Section Title */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === '2nd'
              ? 'SECOND TRIMESTER'
              : selectedCategory === '1st'
              ? 'FIRST TRIMESTER'
              : selectedCategory === '3rd'
              ? 'THIRD TRIMESTER'
              : 'Popular Home Remedies'}
          </Text>
          <Text style={styles.itemCountText}>{filteredItems.length} nuskhe</Text>
        </View>

        {/* View Mode 1: List View (Matching Image 1) */}
        {viewMode === 'list' && (
          <View style={styles.listContainer}>
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => setSelectedNuskha(item)}
                style={styles.listCard}
              >
                {/* Thumbnail Image */}
                <Image source={item.image} style={styles.listThumbnail} resizeMode="cover" />

                {/* Details */}
                <View style={styles.listCardContent}>
                  {/* Category Pill */}
                  <View style={[styles.cardPill, { backgroundColor: item.badgeColor }]}>
                    <Text style={[styles.cardPillText, { color: item.badgeTextColor }]}>
                      {item.category}
                    </Text>
                  </View>

                  <Text style={styles.listTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.listSubtitle} numberOfLines={2}>
                    {item.subtitle}
                  </Text>

                  <View style={styles.listFooterRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Clock size={11} color="#94A3B8" style={{ marginRight: 4 }} />
                      <Text style={styles.listTimeText}>{item.prepTime}</Text>
                    </View>
                    <Text style={styles.readMoreText}>Read Nuskha ›</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* View Mode 2: 2-Column Grid View (Matching Image 2) */}
        {viewMode === 'grid' && (
          <View style={styles.gridContainer}>
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => setSelectedNuskha(item)}
                style={[styles.gridCard, { width: GRID_CARD_WIDTH }]}
              >
                {/* Thumbnail Top */}
                <View style={styles.gridImageWrapper}>
                  <Image source={item.image} style={styles.gridImage} resizeMode="cover" />
                  <View style={[styles.gridPill, { backgroundColor: item.badgeColor }]}>
                    <Text style={[styles.gridPillText, { color: item.badgeTextColor }]}>
                      {item.category}
                    </Text>
                  </View>
                </View>

                {/* Content */}
                <View style={styles.gridContent}>
                  <Text style={styles.gridTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.gridSubtitle} numberOfLines={2}>
                    {item.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Interactive Bottom Sheet Detail Modal (Matching Image 1) */}
      <Modal
        visible={selectedNuskha !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedNuskha(null)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={styles.modalDismissArea}
            activeOpacity={1}
            onPress={() => setSelectedNuskha(null)}
          />

          {selectedNuskha && (
            <View style={styles.bottomSheetContainer}>
              {/* Drag Handle Indicator */}
              <View style={styles.modalDragHandle} />

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Large Beautiful Food Image Banner */}
                <View style={styles.modalImageWrapper}>
                  <Image
                    source={selectedNuskha.image}
                    style={styles.modalBannerImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setSelectedNuskha(null)}
                    style={styles.modalCloseBtn}
                  >
                    <X size={18} color="#FFFFFF" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>

                {/* Modal Headings */}
                <View style={styles.modalHeadings}>
                  <View style={[styles.cardPill, { backgroundColor: selectedNuskha.badgeColor, alignSelf: 'flex-start', marginBottom: 8 }]}>
                    <Text style={[styles.cardPillText, { color: selectedNuskha.badgeTextColor }]}>
                      {selectedNuskha.category} • {selectedNuskha.trimester}
                    </Text>
                  </View>

                  <Text style={styles.modalTitle}>{selectedNuskha.title}</Text>
                  <Text style={styles.modalSubtitle}>{selectedNuskha.subtitle}</Text>
                </View>

                {/* Story Paragraph from Dadi Nani */}
                <View style={styles.storyCard}>
                  <Text style={styles.storyText}>{selectedNuskha.story}</Text>
                </View>

                {/* Ingredients */}
                <Text style={styles.sectionModalHeading}>🌿 Ingredients Needed</Text>
                <View style={styles.ingredientsBox}>
                  {selectedNuskha.ingredients.map((ing, idx) => (
                    <View key={idx} style={styles.ingredientRow}>
                      <CheckCircle2 size={15} color="#16A34A" style={{ marginTop: 2, marginRight: 8 }} />
                      <Text style={styles.ingredientText}>{ing}</Text>
                    </View>
                  ))}
                </View>

                {/* How to Prepare */}
                <Text style={styles.sectionModalHeading}>🥣 How to Prepare &amp; Take</Text>
                <View style={styles.instructionsBox}>
                  {selectedNuskha.instructions.map((step, idx) => (
                    <View key={idx} style={styles.instructionRow}>
                      <View style={styles.stepNumberBadge}>
                        <Text style={styles.stepNumberText}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.instructionText}>{step}</Text>
                    </View>
                  ))}
                </View>

                {/* Safety Note */}
                <View style={styles.safetyBox}>
                  <ShieldCheck size={18} color="#0284C7" style={{ marginTop: 2, marginRight: 8 }} />
                  <Text style={styles.safetyText}>{selectedNuskha.safetyNote}</Text>
                </View>

                {/* Coral-Red Share Nuskha Button (Matching Image 1) */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleShare(selectedNuskha)}
                  style={styles.shareNuskhaBtn}
                >
                  <Share2 size={18} color="#FFFFFF" strokeWidth={2.4} style={{ marginRight: 8 }} />
                  <Text style={styles.shareNuskhaBtnText}>Share Nuskha</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
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
  headerBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18.5,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    marginLeft: 8,
    padding: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  heroBanner: {
    height: 124,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FEF3C7',
    marginLeft: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
    marginTop: 3,
  },
  categoryScroll: {
    paddingBottom: 14,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipSelected: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  categoryChipIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.2,
  },
  itemCountText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  listContainer: {
    gap: 12,
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  listThumbnail: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
  },
  listCardContent: {
    flex: 1,
    marginLeft: 14,
  },
  cardPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  cardPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  listTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 18,
  },
  listSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  listFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  listTimeText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  readMoreText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#D97706',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  gridImageWrapper: {
    height: 110,
    width: '100%',
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridPill: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  gridPillText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  gridContent: {
    padding: 10,
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 17,
  },
  gridSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalDismissArea: {
    flex: 1,
  },
  bottomSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 10,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalDragHandle: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalImageWrapper: {
    height: 170,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
  },
  modalBannerImage: {
    width: '100%',
    height: '100%',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeadings: {
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  modalSubtitle: {
    fontSize: 13.5,
    color: '#D97706',
    fontWeight: '700',
    marginTop: 3,
  },
  storyCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    padding: 12,
    marginBottom: 16,
  },
  storyText: {
    fontSize: 12.5,
    color: '#78350F',
    lineHeight: 18,
  },
  sectionModalHeading: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    marginTop: 6,
  },
  ingredientsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  ingredientText: {
    flex: 1,
    fontSize: 12.5,
    color: '#334155',
  },
  instructionsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepNumberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  instructionText: {
    flex: 1,
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
  },
  safetyBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  safetyText: {
    flex: 1,
    fontSize: 11.5,
    color: '#0369A1',
    lineHeight: 16,
  },
  shareNuskhaBtn: {
    backgroundColor: '#ED5042',
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ED5042',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  shareNuskhaBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
