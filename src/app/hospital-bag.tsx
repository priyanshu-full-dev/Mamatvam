import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Check,
} from 'lucide-react-native';

// Hospital Suitcase / Bag Hero Icon
function HospitalBagHeroIcon({ size = 26 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V6"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M4 8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V8Z"
        stroke="#FFFFFF"
        strokeWidth={2}
        fill="rgba(255,255,255,0.18)"
      />
      <Path
        d="M12 10.5V15.5M9.5 13H14.5"
        stroke="#FFFFFF"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

interface ChecklistItem {
  id: string;
  name: string;
  icon: string;
}

interface CategoryGroup {
  id: string;
  title: string;
  icon: string;
  titleColor: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
  items: ChecklistItem[];
}

const CHECKLIST_CATEGORIES: CategoryGroup[] = [
  {
    id: 'documents',
    title: 'Documents',
    icon: '📁',
    titleColor: '#B45309',
    bgColor: '#FFFDF5',
    borderColor: '#FEF08A',
    accentColor: '#D97706',
    items: [
      { id: 'doc_1', name: 'ID / Aadhar Card', icon: '🪪' },
      { id: 'doc_2', name: 'Insurance Papers', icon: '📋' },
      { id: 'doc_3', name: 'Birth Plan', icon: '📝' },
      { id: 'doc_4', name: "Doctor's Contact", icon: '📞' },
    ],
  },
  {
    id: 'clothing',
    title: 'Clothing',
    icon: '👗',
    titleColor: '#BE185D',
    bgColor: '#FDF2F8',
    borderColor: '#FBCFE8',
    accentColor: '#DB2777',
    items: [
      { id: 'clo_1', name: 'Nightshirt / Gown', icon: '👗' },
      { id: 'clo_2', name: 'Loose Clothing', icon: '👚' },
      { id: 'clo_3', name: 'Cotton Underwear', icon: '🩲' },
      { id: 'clo_4', name: 'Pair of Socks', icon: '🧦' },
      { id: 'clo_5', name: 'Footwear / Slippers', icon: '🩴' },
    ],
  },
  {
    id: 'toiletries',
    title: 'Toiletries',
    icon: '🧴',
    titleColor: '#0F766E',
    bgColor: '#F0FDFA',
    borderColor: '#99F6E4',
    accentColor: '#0D9488',
    items: [
      { id: 'toi_1', name: 'Toothbrush & Paste', icon: '🪥' },
      { id: 'toi_2', name: 'Shampoo & Soap', icon: '🧴' },
      { id: 'toi_3', name: 'Towel', icon: '🛁' },
      { id: 'toi_4', name: 'Hair Ties / Clips', icon: '🎀' },
    ],
  },
  {
    id: 'comfort',
    title: 'Comfort',
    icon: '🛏️',
    titleColor: '#BE123C',
    bgColor: '#FFF1F2',
    borderColor: '#FECDD3',
    accentColor: '#E11D48',
    items: [
      { id: 'com_1', name: 'Comfort Pillow', icon: '🛏️' },
      { id: 'com_2', name: 'Maternity Pads', icon: '🩸' },
      { id: 'com_3', name: 'Breast Pads', icon: '🤱' },
      { id: 'com_4', name: 'Nursing Bras', icon: '👙' },
    ],
  },
  {
    id: 'electronics',
    title: 'Electronics',
    icon: '📱',
    titleColor: '#1D4ED8',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    accentColor: '#2563EB',
    items: [
      { id: 'ele_1', name: 'Cellphone & Charger', icon: '📱' },
      { id: 'ele_2', name: 'Earphones', icon: '🎧' },
      { id: 'ele_3', name: 'Books / Magazine', icon: '📖' },
      { id: 'ele_4', name: 'Camera', icon: '📷' },
    ],
  },
  {
    id: 'snacks',
    title: 'Snacks',
    icon: '🥪',
    titleColor: '#C2410C',
    bgColor: '#FFF7ED',
    borderColor: '#FED7AA',
    accentColor: '#EA580C',
    items: [
      { id: 'sna_1', name: 'Snacks & Drinks', icon: '🥪' },
      { id: 'sna_2', name: 'Water Bottle', icon: '💧' },
    ],
  },
  {
    id: 'baby',
    title: 'For Baby',
    icon: '👶',
    titleColor: '#7E22CE',
    bgColor: '#FAF5FF',
    borderColor: '#E9D5FF',
    accentColor: '#9333EA',
    items: [
      { id: 'bab_1', name: 'Baby Bodysuit x3', icon: '👶' },
      { id: 'bab_2', name: 'Newborn Diapers', icon: '🍼' },
      { id: 'bab_3', name: 'Baby Blanket', icon: '🧸' },
      { id: 'bab_4', name: 'Car Seat (for home)', icon: '🚗' },
    ],
  },
];

export default function HospitalBagScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Set of packed item IDs
  const [packedItems, setPackedItems] = useState<Set<string>>(new Set());

  // Collapsed categories state (all expanded by default like Image 2)
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setPackedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const totalItems = 27;
  const packedCount = packedItems.size;
  const progressPercent = Math.round((packedCount / totalItems) * 100);

  // Safe top padding to clear Android camera punch-holes and iOS notches
  const topPadding = Math.max(insets.top, 28) + 10;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" translucent={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding, paddingBottom: Math.max(insets.bottom, 24) + 24 },
        ]}
      >
        {/* Top Radiant Hero Banner with Live Progress */}
        <LinearGradient
          colors={['#01BBAB', '#01B8D8']}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 1, y: 0.8 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroRow}>
            {/* Back Button */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.back()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.4} />
            </TouchableOpacity>

            <View style={{ flex: 1, paddingHorizontal: 12 }}>
              <Text style={styles.heroTitle}>Hospital Bag</Text>
              <Text style={styles.heroSubtitle}>Delivery Checklist</Text>
            </View>

            {/* Bag Icon Badge */}
            <View style={styles.heroIconBadge}>
              <HospitalBagHeroIcon size={26} />
            </View>
          </View>

          {/* Progress Counters & Track */}
          <View style={styles.progressContainer}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabelText}>
                {packedCount} / {totalItems} items packed
              </Text>
              <Text style={styles.progressLabelText}>
                {progressPercent}%
              </Text>
            </View>

            {/* Progress Bar Track */}
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.max(2, progressPercent)}%` },
                ]}
              />
            </View>
          </View>
        </LinearGradient>

        {/* Packing Tip Banner */}
        <View style={styles.tipBanner}>
          <Text style={styles.tipBannerText}>
            💡 <Text style={{ fontWeight: '700' }}>Tip:</Text> Pack your hospital bag by Week 36. Keep it near the door for quick access!
          </Text>
        </View>

        {/* 7 Categorized Checklist Cards */}
        {CHECKLIST_CATEGORIES.map((cat) => {
          const isCollapsed = collapsedCategories.has(cat.id);
          const catPackedCount = cat.items.filter((item) => packedItems.has(item.id)).length;

          return (
            <View
              key={cat.id}
              style={[
                styles.categoryCard,
                { backgroundColor: '#FFFFFF', borderColor: cat.borderColor },
              ]}
            >
              {/* Category Header */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => toggleCategory(cat.id)}
                style={[styles.categoryHeader, { backgroundColor: cat.bgColor }]}
              >
                <Text style={{ fontSize: 20, marginRight: 10 }}>{cat.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.categoryTitle, { color: cat.titleColor }]}>
                    {cat.title}
                  </Text>
                  <Text style={styles.categorySubtext}>
                    {catPackedCount}/{cat.items.length} packed
                  </Text>
                </View>

                {/* Collapsible Chevron */}
                <View style={styles.chevronWrapper}>
                  {isCollapsed ? (
                    <ChevronDown size={18} color="#94A3B8" />
                  ) : (
                    <ChevronUp size={18} color="#94A3B8" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Items List */}
              {!isCollapsed && (
                <View style={styles.itemsListContainer}>
                  {cat.items.map((item, idx) => {
                    const isChecked = packedItems.has(item.id);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.7}
                        onPress={() => toggleItem(item.id)}
                        style={[
                          styles.itemRow,
                          { borderBottomWidth: idx === cat.items.length - 1 ? 0 : 1 },
                        ]}
                      >
                        {/* Circular Checkbox */}
                        <View
                          style={[
                            styles.checkboxCircle,
                            isChecked && { backgroundColor: cat.accentColor, borderColor: cat.accentColor },
                          ]}
                        >
                          {isChecked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                        </View>

                        {/* Item Icon */}
                        <Text style={styles.itemEmoji}>{item.icon}</Text>

                        {/* Item Title */}
                        <Text
                          style={[
                            styles.itemName,
                            isChecked && styles.itemNameChecked,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  heroBanner: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 12,
    shadowColor: '#01BBAB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginTop: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    marginTop: 14,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabelText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  tipBanner: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  tipBannerText: {
    fontSize: 11.5,
    color: '#065F46',
    lineHeight: 16,
  },
  categoryCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  categoryTitle: {
    fontSize: 15.5,
    fontWeight: '700',
  },
  categorySubtext: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
    fontWeight: '500',
  },
  chevronWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  itemsListContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomColor: '#F8FAFC',
  },
  checkboxCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemEmoji: {
    fontSize: 16,
    marginRight: 10,
  },
  itemName: {
    fontSize: 13.5,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
});
