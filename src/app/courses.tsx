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
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, X } from 'lucide-react-native';

export interface CourseGridItem {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  price: string;
  image: any;
  masterclassTitle: string;
}

export const HOLISTIC_COURSES: CourseGridItem[] = [
  {
    id: '1',
    title: 'Basic Plan',
    subtitle: 'Essential guides for every stage',
    discount: '20% off',
    price: '$ 099',
    image: require('@/assets/images/home/course_baby.jpg'),
    masterclassTitle: 'Complete Pregnancy Masterclass: From Conception to Birth',
  },
  {
    id: '2',
    title: 'Basic Plan',
    subtitle: 'Essential guides for every stage',
    discount: '20% off',
    price: '$ 099',
    image: require('@/assets/images/home/course_baby.jpg'),
    masterclassTitle: 'Safe Prenatal Yoga: 30-Day Guided Flow',
  },
  {
    id: '3',
    title: 'Basic Plan',
    subtitle: 'Essential guides for every stage',
    discount: '20% off',
    price: '$ 099',
    image: require('@/assets/images/home/course_baby.jpg'),
    masterclassTitle: 'Understanding Your Trimester Nutritional Needs',
  },
  {
    id: '4',
    title: 'Basic Plan',
    subtitle: 'Essential guides for every stage',
    discount: '20% off',
    price: '$ 099',
    image: require('@/assets/images/home/course_baby.jpg'),
    masterclassTitle: 'Pelvic Mobility & Alignment Routine for Labor',
  },
  {
    id: '5',
    title: 'Basic Plan',
    subtitle: 'Essential guides for every stage',
    discount: '20% off',
    price: '$ 099',
    image: require('@/assets/images/home/course_baby.jpg'),
    masterclassTitle: 'Breathing for Labor & Contraction Ease',
  },
  {
    id: '6',
    title: 'Basic Plan',
    subtitle: 'Essential guides for every stage',
    discount: '20% off',
    price: '$ 099',
    image: require('@/assets/images/home/course_baby.jpg'),
    masterclassTitle: 'Postpartum Core & Gentle Rebuilding Program',
  },
  {
    id: '7',
    title: 'Basic Plan',
    subtitle: 'Essential guides for every stage',
    discount: '20% off',
    price: '$ 099',
    image: require('@/assets/images/home/course_baby.jpg'),
    masterclassTitle: 'Ayurvedic Garbh Sanskar & Mindful Bonding',
  },
  {
    id: '8',
    title: 'Basic Plan',
    subtitle: 'Essential guides for every stage',
    discount: '20% off',
    price: '$ 099',
    image: require('@/assets/images/home/course_baby.jpg'),
    masterclassTitle: 'Newborn Care & Lactation Foundations',
  },
];

export default function CoursesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const filteredCourses = HOLISTIC_COURSES.filter((course) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(query) ||
      course.subtitle.toLowerCase().includes(query) ||
      course.masterclassTitle.toLowerCase().includes(query)
    );
  });

  const topPadding = Math.max(insets.top, 24) + 8;
  const bottomPadding = Math.max(insets.bottom, 24) + 16;
  const cardWidth = (width - 44) / 2;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />

      {/* Top Header Bar */}
      <View style={[styles.headerBar, { paddingTop: topPadding }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.headerIconButton}
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Holistic Courses</Text>

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

      {/* Search Input if toggled */}
      {isSearchActive && (
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBarInner}>
            <Search size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search holistic courses & guides..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* 2-Column Grid Layout matching Screenshot */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
      >
        <View style={styles.gridContainer}>
          {filteredCourses.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.88}
              onPress={() =>
                router.push({
                  pathname: '/playlist',
                  params: {
                    id: item.id,
                    title: item.title,
                  },
                })
              }
              style={[styles.courseCard, { width: cardWidth }]}
            >
              {/* Card Image with Yellow Price Badge */}
              <View style={styles.cardImageWrapper}>
                <Image
                  source={item.image}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.priceBadge}>
                  <Text style={styles.priceBadgeText}>{item.price}</Text>
                </View>
              </View>

              {/* Card Info: Title, Subtitle, Discount */}
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                <Text style={styles.cardDiscount}>{item.discount}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {filteredCourses.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No courses found</Text>
            <Text style={styles.emptySubtitle}>Try searching for "Yoga" or "Nutrition"</Text>
          </View>
        )}
      </ScrollView>
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
    fontSize: 18,
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
  scrollContent: {
    paddingTop: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 105,
    backgroundColor: '#F1F5F9',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  priceBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EAB308',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  priceBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardInfo: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  cardSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 14,
  },
  cardDiscount: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EE4D38',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
  },
});
