import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { stories, posts } from '../data/mockData';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import ScrollPauseCard from '../components/ScrollPauseCard';
import StoryViewer from '../components/StoryViewer';
import { colors, moderateScale, fontScale, wp } from '../theme';
import { Svg, Path } from 'react-native-svg';

function HandIcon({ size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 11V6a2 2 0 0 0-4 0v1" stroke={`${colors.brown}80`} />
      <Path d="M14 10V4a2 2 0 0 0-4 0v6" stroke={`${colors.brown}80`} />
      <Path d="M10 10.5V6a2 2 0 0 0-4 0v8" stroke={`${colors.brown}80`} />
      <Path d="M18 8a2 2 0 0 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-5.9-2.7L3.3 15a2 2 0 0 1 3.4-2L8 15" stroke={`${colors.brown}80`} />
    </Svg>
  );
}

function StoriesRow({ onOpen }) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={stories}
      keyExtractor={(s) => String(s.id)}
      contentContainerStyle={styles.storiesContainer}
      renderItem={({ item: s, index: i }) => (
        <TouchableOpacity
          onPress={() => onOpen(i)}
          style={styles.storyItem}
          activeOpacity={0.7}
        >
          <Avatar emoji={s.avatarEmoji} size={58} ring seen={s.seen} />
          <Text style={styles.storyName} numberOfLines={1}>
            {s.username.split('.')[0]}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

export default function HomeScreen() {
  const [storyIndex, setStoryIndex] = useState(null);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>.Human</Text>
        <View style={styles.headerRight}>
          <HandIcon size={moderateScale(16)} />
          <Text style={styles.headerTag}>HUMAN TOUCH</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chronoBanner}>
          <Text style={styles.chronoText}>
            Showing posts from people you follow · <Text style={styles.chronoBold}>Chronological</Text>
          </Text>
        </View>

        <StoriesRow onOpen={setStoryIndex} />

        <View style={styles.postsContainer}>
          {posts.map((post, i) => (
            <View key={post.id}>
              {i === 5 && <ScrollPauseCard />}
              <PostCard post={post} />
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={storyIndex !== null} animationType="fade" statusBarTranslucent>
        {storyIndex !== null && (
          <StoryViewer
            stories={stories}
            startIndex={storyIndex}
            onClose={() => setStoryIndex(null)}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    borderBottomWidth: 1,
    borderBottomColor: `${colors.tan}26`,
    backgroundColor: colors.cream,
  },
  headerTitle: {
    fontStyle: 'italic',
    fontSize: fontScale(24),
    color: colors.dark,
    fontWeight: '700',
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(6) },
  headerTag: {
    fontSize: fontScale(10),
    fontWeight: '600',
    letterSpacing: 1,
    color: `${colors.brown}80`,
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: moderateScale(24) },
  chronoBanner: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(8),
    marginBottom: moderateScale(4),
    backgroundColor: colors.paper,
    borderRadius: 9999,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(6),
    alignItems: 'center',
  },
  chronoText: { fontSize: fontScale(11), color: `${colors.brown}99` },
  chronoBold: { fontWeight: '500' },
  storiesContainer: {
    gap: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
  },
  storyItem: {
    alignItems: 'center',
    gap: moderateScale(4),
  },
  storyName: {
    fontSize: fontScale(11),
    color: `${colors.brown}B3`,
    maxWidth: moderateScale(64),
    textAlign: 'center',
  },
  postsContainer: { paddingHorizontal: moderateScale(12) },
});
