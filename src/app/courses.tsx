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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, X } from 'lucide-react-native';

export interface CourseItem {
  id: string;
  category: string;
  title: string;
  duration: string;
  lessons: string;
  price: string;
  image: any;
}

export const COURSES_LIST: CourseItem[] = [
  {
    id: '1',
    category: 'PRENATAL FITNESS',
    title: 'Safe Prenatal Yoga: 30-Day Program',
    duration: '2h 15min',
    lessons: '18 Lessons',
    price: '$49',
    image: require('@/assets/images/courses/succulent_thumbnail.jpg'),
  },
  {
    id: '2',
    category: 'PRENATAL FITNESS',
    title: 'Complete Pregnancy Masterclass: From Conception to Birth',
    duration: '2h 15min',
    lessons: '18 Lessons',
    price: '$49',
    image: require('@/assets/images/courses/succulent_thumbnail.jpg'),
  },
  {
    id: '3',
    category: 'PRENATAL FITNESS',
    title: 'Safe Prenatal Yoga: 30-Day Program',
    duration: '2h 15min',
    lessons: '18 Lessons',
    price: '$49',
    image: require('@/assets/images/courses/succulent_thumbnail.jpg'),
  },
  {
    id: '4',
    category: 'PRENATAL FITNESS',
    title: 'Safe Prenatal Yoga: 30-Day Program',
    duration: '2h 15min',
    lessons: '18 Lessons',
    price: '$49',
    image: require('@/assets/images/courses/succulent_thumbnail.jpg'),
  },
  {
    id: '5',
    category: 'PRENATAL FITNESS',
    title: 'Safe Prenatal Yoga: 30-Day Program',
    duration: '2h 15min',
    lessons: '18 Lessons',
    price: '$49',
    image: require('@/assets/images/courses/succulent_thumbnail.jpg'),
  },
];

export default function CoursesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const filteredCourses = COURSES_LIST.filter((course) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query)
    );
  });

  const topPadding = Math.max(insets.top, 28) + 8;
  const bottomPadding = Math.max(insets.bottom, 24) + 16;

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

        <Text style={styles.headerTitle}>Course</Text>

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
              placeholder="Search courses, fitness, yoga..."
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

      {/* Courses List matching Screenshot */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
      >
        {filteredCourses.map((item, index) => (
          <TouchableOpacity
            key={`${item.id}-${index}`}
            activeOpacity={0.88}
            onPress={() =>
              router.push({
                pathname: '/course-detail',
                params: { id: item.id },
              })
            }
            style={styles.courseCard}
          >
            {/* Left Thumbnail Image */}
            <View style={styles.thumbnailWrapper}>
              <Image source={item.image} style={styles.thumbnailImage} resizeMode="cover" />
            </View>

            {/* Right Course Info */}
            <View style={styles.infoWrapper}>
              {/* Category Pill Tag */}
              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>

              {/* Title */}
              <Text style={styles.courseTitle} numberOfLines={2}>
                {item.title}
              </Text>

              {/* Duration & Lessons */}
              <Text style={styles.metaText}>
                {item.duration}   {item.lessons}
              </Text>

              {/* Price */}
              <Text style={styles.priceText}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {filteredCourses.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No courses found</Text>
            <Text style={styles.emptySubtitle}>Try searching for "Yoga" or "Fitness"</Text>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  courseCard: {
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
  thumbnailWrapper: {
    width: 82,
    height: 82,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    marginRight: 14,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryPill: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#166534',
    letterSpacing: 0.2,
  },
  courseTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  metaText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 3,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#EF4444',
    marginTop: 3,
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
