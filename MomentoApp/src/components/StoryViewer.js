import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
  Dimensions, Pressable, StatusBar,
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors, moderateScale, fontScale } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STORY_COLORS = ['#B8860B', '#2E86AB', '#27AE60', '#E67E22', '#8E6F4E', '#D4A574', '#F1C40F', '#5D6D7E'];

export default function StoryViewer({ stories, startIndex = 0, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const story = stories[current];

  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  const next = useCallback(() => {
    if (current < stories.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      close();
    }
  }, [current, stories.length, close]);

  const prev = useCallback(() => {
    if (current > 0) {
      setCurrent((c) => c - 1);
    }
  }, [current]);

  useEffect(() => {
    progressAnim.setValue(0);
    const anim = Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    });
    anim.start(({ finished }) => {
      if (finished) next();
    });
    return () => anim.stop();
  }, [current, next, progressAnim]);

  const handleTap = (e) => {
    const x = e.nativeEvent.locationX;
    if (x < SCREEN_WIDTH / 3) prev();
    else next();
  };

  return (
    <View style={[styles.container, { backgroundColor: STORY_COLORS[current % STORY_COLORS.length] }]}>
      <StatusBar barStyle="light-content" />

      <Pressable style={StyleSheet.absoluteFill} onPress={handleTap}>
        <View style={styles.storyContent}>
          <Text style={styles.storyEmoji}>{story.avatarEmoji}</Text>
          <Text style={styles.storyTitle}>{story.username}'s story</Text>
          <Text style={styles.storyHint}>Tap to advance</Text>
        </View>
      </Pressable>

      <View style={[styles.progressContainer, { top: insets.top + moderateScale(12) }]}>
        {stories.map((_, i) => (
          <View key={i} style={styles.progressBar}>
            {i < current && <View style={[styles.progressFill, { flex: 1 }]} />}
            {i === current && (
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            )}
          </View>
        ))}
      </View>

      <View style={[styles.headerRow, { top: insets.top + moderateScale(24) }]}>
        <View style={styles.userInfo}>
          <View style={styles.storyAvatar}>
            <Text style={styles.avatarEmoji}>{story.avatarEmoji}</Text>
          </View>
          <Text style={styles.storyUsername}>{story.username}</Text>
        </View>
        <TouchableOpacity onPress={close} style={styles.closeBtn}>
          <X size={moderateScale(22)} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 150,
  },
  storyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyEmoji: { fontSize: moderateScale(60), marginBottom: moderateScale(16) },
  storyTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: fontScale(18),
    fontStyle: 'italic',
  },
  storyHint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontScale(12),
    marginTop: moderateScale(8),
  },
  progressContainer: {
    position: 'absolute',
    left: moderateScale(12),
    right: moderateScale(12),
    flexDirection: 'row',
    gap: moderateScale(4),
    zIndex: 10,
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  headerRow: {
    position: 'absolute',
    left: moderateScale(16),
    right: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(10) },
  storyAvatar: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: moderateScale(18) },
  storyUsername: { color: 'white', fontSize: fontScale(14), fontWeight: '600' },
  closeBtn: {
    padding: moderateScale(8),
    minWidth: moderateScale(44),
    minHeight: moderateScale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
