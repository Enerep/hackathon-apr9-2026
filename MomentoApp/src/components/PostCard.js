import { useState, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal,
  Pressable, Animated,
} from 'react-native';
import { Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react-native';
import { useAppState } from '../hooks/useAppState';
import Avatar from './Avatar';
import { HumanBadge, AIBadge } from './Badge';
import { colors, moderateScale, fontScale, wp } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PostCard({ post }) {
  const { likedPosts, toggleLike, aiContentSetting, revealedAIPosts, revealAIPost } = useAppState();
  const liked = likedPosts.includes(post.id);
  const [showHeart, setShowHeart] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const lastTap = useRef(0);
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;
  const canReport = !post.isAI && post.isHumanVerified;

  const isBlurred = post.isAI && aiContentSetting === 'blur' && !revealedAIPosts.includes(post.id);
  const isHidden = post.isAI && aiContentSetting === 'hide';

  if (isHidden) return null;

  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!liked) toggleLike(post.id);
      heartScale.setValue(0);
      heartOpacity.setValue(1);
      Animated.sequence([
        Animated.spring(heartScale, { toValue: 1.2, friction: 3, useNativeDriver: true }),
        Animated.timing(heartOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    lastTap.current = now;
  }, [liked, post.id, toggleLike, heartScale, heartOpacity]);

  const handleReport = () => {
    setShowReportModal(false);
    setIsReported(true);
  };

  const imageSize = SCREEN_WIDTH - moderateScale(24);

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <Avatar emoji={post.avatarEmoji} size={40} />
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.username} numberOfLines={1}>{post.username}</Text>
              {post.isAI ? <AIBadge /> : <HumanBadge />}
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.timestamp}>{post.timestamp}</Text>
              {post.location && (
                <>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.location} numberOfLines={1}>{post.location}</Text>
                </>
              )}
            </View>
          </View>
          {canReport && (
            <TouchableOpacity
              onPress={() => setShowReportModal(true)}
              style={styles.moreBtn}
            >
              <MoreHorizontal size={moderateScale(20)} strokeWidth={2} color={`${colors.brown}B3`} />
            </TouchableOpacity>
          )}
        </View>

        <Pressable onPress={handleDoubleTap}>
          <View style={[styles.imageBox, { width: imageSize, height: imageSize, backgroundColor: post.imageColor }]}>
            {showHeart && (
              <Animated.View
                style={[
                  styles.heartBurst,
                  { transform: [{ scale: heartScale }], opacity: heartOpacity },
                ]}
              >
                <Heart size={moderateScale(80)} fill="white" color="white" />
              </Animated.View>
            )}
            {isBlurred && (
              <View style={styles.blurOverlay}>
                <Text style={styles.blurEmoji}>🤖</Text>
                <Text style={styles.blurTitle}>This content was AI generated</Text>
                <Text style={styles.blurSub}>and is not recommended</Text>
                <TouchableOpacity
                  onPress={() => revealAIPost(post.id)}
                  style={styles.revealBtn}
                >
                  <Text style={styles.revealBtnText}>Show anyway</Text>
                </TouchableOpacity>
              </View>
            )}
            {isReported && (
              <View style={styles.reportedOverlay}>
                <Text style={styles.reportedTitle}>You have reported this post.</Text>
                <Text style={styles.reportedSub}>We will review this post.</Text>
              </View>
            )}
          </View>
        </Pressable>

        <View style={styles.actions}>
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => toggleLike(post.id)} style={styles.actionBtn}>
              <Heart
                size={moderateScale(26)}
                strokeWidth={1.8}
                color={liked ? colors.red : colors.dark}
                fill={liked ? colors.red : 'none'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <MessageCircle size={moderateScale(26)} strokeWidth={1.8} color={colors.dark} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Send size={moderateScale(26)} strokeWidth={1.8} color={colors.dark} />
            </TouchableOpacity>
          </View>
          <Text style={styles.likesText}>
            {liked
              ? `You and your mutual friend ${post.mutualLikeName} liked this post`
              : `Your mutual friend ${post.mutualLikeName} liked this post`}
          </Text>
          <Text style={styles.captionText}>
            <Text style={styles.captionUser}>{post.username}</Text>{' '}
            {post.caption}
          </Text>
          {post.comments.length > 0 && (
            <TouchableOpacity style={styles.commentsBtn}>
              <Text style={styles.commentsText}>
                View all {post.comments.length} comments
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Modal visible={showReportModal} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowReportModal(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Report post</Text>
            <Text style={styles.modalSub}>Why are you reporting this post?</Text>
            <View style={styles.modalOptions}>
              <TouchableOpacity style={styles.modalOption} onPress={handleReport}>
                <Text style={styles.modalOptionText}>Inappropriate content</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={handleReport}>
                <Text style={styles.modalOptionText}>AI-generated</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowReportModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paper,
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    marginBottom: moderateScale(12),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
  },
  headerInfo: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(8), flexWrap: 'wrap' },
  username: { fontWeight: '600', fontSize: fontScale(14), color: colors.dark },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(6), marginTop: moderateScale(2) },
  timestamp: { fontSize: fontScale(12), color: `${colors.brown}99` },
  metaDot: { fontSize: fontScale(12), color: `${colors.brown}99` },
  location: { fontSize: fontScale(12), color: `${colors.brown}99`, flex: 1 },
  moreBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(20),
  },
  imageBox: { position: 'relative' },
  heartBurst: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: moderateScale(-40),
    marginLeft: moderateScale(-40),
    zIndex: 20,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.aiYellowBg}66`,
  },
  blurEmoji: { fontSize: moderateScale(30), marginBottom: moderateScale(8) },
  blurTitle: { fontSize: fontScale(14), fontWeight: '500', color: colors.dark, marginBottom: moderateScale(4) },
  blurSub: { fontSize: fontScale(12), color: `${colors.brown}B3`, marginBottom: moderateScale(16) },
  revealBtn: {
    backgroundColor: `${colors.dark}CC`,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    borderRadius: 9999,
  },
  revealBtnText: { color: colors.cream, fontSize: fontScale(14), fontWeight: '500' },
  reportedOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.dark}99`,
  },
  reportedTitle: { fontSize: fontScale(14), fontWeight: '500', color: colors.cream, marginBottom: moderateScale(4) },
  reportedSub: { fontSize: fontScale(12), color: `${colors.cream}CC` },
  actions: { paddingHorizontal: moderateScale(16), paddingTop: moderateScale(12), paddingBottom: moderateScale(8) },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(4), marginBottom: moderateScale(8) },
  actionBtn: {
    padding: moderateScale(8),
    minWidth: moderateScale(44),
    minHeight: moderateScale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  likesText: { fontSize: fontScale(14), fontWeight: '600', color: colors.dark },
  captionText: { fontSize: fontScale(14), color: colors.dark, marginTop: moderateScale(4), lineHeight: fontScale(20) },
  captionUser: { fontWeight: '600' },
  commentsBtn: { marginTop: moderateScale(6), paddingVertical: moderateScale(4) },
  commentsText: { fontSize: fontScale(12), color: `${colors.brown}80` },
  modalOverlay: {
    flex: 1,
    backgroundColor: `${colors.dark}73`,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(24),
  },
  modalContent: {
    width: '100%',
    maxWidth: moderateScale(320),
    borderRadius: moderateScale(24),
    backgroundColor: colors.cream,
    padding: moderateScale(20),
  },
  modalTitle: { fontSize: fontScale(16), fontWeight: '600', color: colors.dark },
  modalSub: { marginTop: moderateScale(4), fontSize: fontScale(14), color: `${colors.brown}BF` },
  modalOptions: { marginTop: moderateScale(16), gap: moderateScale(8) },
  modalOption: {
    width: '100%',
    borderRadius: moderateScale(16),
    backgroundColor: colors.paper,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
  },
  modalOptionText: { fontSize: fontScale(14), fontWeight: '500', color: colors.dark },
  modalCancel: {
    marginTop: moderateScale(16),
    width: '100%',
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: `${colors.brown}26`,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    alignItems: 'center',
  },
  modalCancelText: { fontSize: fontScale(14), fontWeight: '500', color: `${colors.brown}CC` },
});
