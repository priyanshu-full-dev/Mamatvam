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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Search, X, Video, BookOpen } from 'lucide-react-native';

export interface PlaylistItem {
  id: string;
  type: 'video' | 'reading';
  category: string;
  title: string;
  duration: string;
  lessons: string;
  price: string;
  image: any;
}

export const PLAYLIST_COURSES: PlaylistItem[] = [
  {
    id: '1',
    type: 'video',
    category: 'PRENATAL FITNESS',
    title: 'Safe Prenatal Yoga: 30-Day Program',
    duration: '2h 15min',
    lessons: '18 Lessons',
    price: '$49',
    image: require('@/assets/images/courses/succulent_thumbnail.jpg'),
  },
  {
    id: '2',
    type: 'reading',
    category: 'PRENATAL FITNESS',
    title: 'Safe Prenatal Yoga: 30-Day Program',
    duration: '10 min read',
    lessons: '18 Lessons',
    price: '$49',
    image: require('@/assets/images/courses/succulent_thumbnail.jpg'),
  },
  {
    id: '3',
    type: 'video',
    category: 'PRENATAL FITNESS',
    title: 'Safe Prenatal Yoga: 30-Day Program',
    duration: '2h 15min',
    lessons: '18 Lessons',
    price: '$49',
    image: require('@/assets/images/courses/succulent_thumbnail.jpg'),
  },
  {
    id: '4',
    type: 'reading',
    category: 'PRENATAL FITNESS',
    title: 'Safe Prenatal Yoga: 30-Day Program',
    duration: '12 min read',
    lessons: '18 Lessons',
    price: '$49',
    image: require('@/assets/images/courses/succulent_thumbnail.jpg'),
  },
  {
    id: '5',
    type: 'video',
    category: 'PRENATAL FITNESS',
    title: 'Safe Prenatal Yoga: 30-Day Program',
    duration: '2h 15min',
    lessons: '18 Lessons',
    price: '$49',
    image: require('@/assets/images/courses/succulent_thumbnail.jpg'),
  },
  {
    id: '6',
    type: 'reading',
    category: 'PRENATAL FITNESS',
    title: 'Safe Prenatal Yoga: 30-Day Program',
    duration: '15 min read',
    lessons: '18 Lessons',
    price: '$49',
    image: require('@/assets/images/courses/succulent_thumbnail.jpg'),
  },
];

export default function PlaylistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const filteredItems = PLAYLIST_COURSES.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const topPadding = Math.max(insets.top, 24) + 8;
  const bottomPadding = Math.max(insets.bottom, 24) + 16;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />

      {/* Top Header Bar matching Screenshot */}
      <View style={[styles.headerBar, { paddingTop: topPadding }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.headerIconButton}
        >
          <ArrowLeft size={24} color="#1E293B" strokeWidth={2.2} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Course</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsSearchActive(!isSearchActive)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.headerIconButton}
        >
          {isSearchActive ? (
            <X size={24} color="#1E293B" strokeWidth={2.2} />
          ) : (
            <Search size={24} color="#1E293B" strokeWidth={2.2} />
          )}
        </TouchableOpacity>
      </View>

      {/* Search Input Bar if toggled */}
      {isSearchActive && (
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBarInner}>
            <Search size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search course playlist..."
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

      {/* Vertical Playlist Cards matching Screenshot */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
      >
        <View style={styles.listContainer}>
          {filteredItems.map((item, index) => (
            <TouchableOpacity
              key={`${item.id}-${index}`}
              activeOpacity={0.88}
              onPress={() => {
                if (item.type === 'video') {
                  router.push({
                    pathname: '/course-detail',
                    params: {
                      id: item.id,
                      title: item.title,
                    },
                  });
                } else {
                  router.push({
                    pathname: '/course-article',
                    params: {
                      id: item.id,
                      title: item.title,
                      category: item.category,
                    },
                  });
                }
              }}
              style={styles.courseCard}
            >
              {/* Thumbnail on Left */}
              <Image
                source={item.image}
                style={styles.thumbnail}
                resizeMode="cover"
              />

              {/* Course Info on Right */}
              <View style={styles.infoContainer}>
                {/* Top Row: Category on Left, Reading or Video on Top Right */}
                <View style={styles.topMetaRow}>
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </View>

                  <View
                    style={[
                      styles.typeBadge,
                      item.type === 'video' ? styles.videoBadge : styles.readingBadge,
                    ]}
                  >
                    {item.type === 'video' ? (
                      <Video size={10.5} color="#DC2626" strokeWidth={2.4} style={{ marginRight: 3.5 }} />
                    ) : (
                      <BookOpen size={10.5} color="#2563EB" strokeWidth={2.4} style={{ marginRight: 3.5 }} />
                    )}
                    <Text
                      style={[
                        styles.typeText,
                        item.type === 'video' ? styles.videoText : styles.readingText,
                      ]}
                    >
                      {item.type === 'video' ? 'Video' : 'Reading'}
                    </Text>
                  </View>
                </View>

                {/* Title */}
                <Text style={styles.courseTitle} numberOfLines={2}>
                  {item.title}
                </Text>

                {/* Duration & Lessons Count */}
                <Text style={styles.metaText}>
                  {item.duration}   {item.lessons}
                </Text>

                {/* Price in Coral Red */}
                <Text style={styles.priceText}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {filteredItems.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No playlist found</Text>
            <Text style={styles.emptySubtitle}>Try searching with different keywords</Text>
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
    paddingBottom: 14,
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
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
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
    fontSize: 14,
    color: '#1E293B',
    padding: 0,
  },
  scrollContent: {
    paddingTop: 14,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1.5,
  },
  thumbnail: {
    width: 82,
    height: 82,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  categoryPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.4,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
  },
  videoBadge: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  readingBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  typeText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  videoText: {
    color: '#DC2626',
  },
  readingText: {
    color: '#2563EB',
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 20,
  },
  metaText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#EF4444',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
});
