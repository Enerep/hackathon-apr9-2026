import { useRef, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal,
  Pressable, PanResponder, Animated,
} from 'react-native';
import { ArrowRight, MapPin, RotateCcw, Send, Users } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import { communityMoments } from '../data/mockData';
import { colors, moderateScale, fontScale, wp, hp } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = moderateScale(110);
const CARD_HEIGHT = hp(62);

export default function CommunityScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [nudgeMoment, setNudgeMoment] = useState(null);
  const dragX = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const topMoment = communityMoments[activeIndex];
  const visibleMoments = communityMoments.slice(activeIndex, activeIndex + 3);

  const advanceCard = useCallback(() => {
    if (!topMoment) return;
    setHistory((prev) => [...prev, activeIndex]);
    setNudgeMoment(topMoment);
    setActiveIndex((prev) => prev + 1);
    dragX.setValue(0);
  }, [topMoment, activeIndex, dragX]);

  const handleUndo = useCallback(() => {
    if (!history.length) return;
    const previousIndex = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setActiveIndex(previousIndex);
    setNudgeMoment(null);
    dragX.setValue(0);
  }, [history, dragX]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 5,
      onPanResponderMove: (_, g) => {
        if (g.dx > 0) dragX.setValue(g.dx);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx >= SWIPE_THRESHOLD) {
          Animated.timing(dragX, {
            toValue: SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            advanceCard();
          });
        } else {
          Animated.spring(dragX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const handleSendPing = () => {
    setNudgeMoment((prev) => (prev ? { ...prev, pingSent: true } : prev));
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Community</Text>
          <Text style={styles.headerSub}>Nearby people sharing moments you can join.</Text>
        </View>
        <View style={styles.nearbyBadge}>
          <Text style={styles.nearbyText}>
            {Math.max(communityMoments.length - activeIndex, 0)} nearby now
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.tipCard}>
          <Users size={moderateScale(16)} color={`${colors.brown}B3`} />
          <Text style={styles.tipText}>Swipe right or tap the arrow to open a gentle nudge.</Text>
        </View>

        <View style={[styles.deckContainer, { height: CARD_HEIGHT }]}>
          {visibleMoments.map((moment, offset) => {
            const isTop = offset === 0;
            const translateY = offset * moderateScale(14);
            const scaleVal = 1 - offset * 0.04;

            return (
              <Animated.View
                key={moment.id}
                {...(isTop ? panResponder.panHandlers : {})}
                style={[
                  styles.card,
                  {
                    zIndex: visibleMoments.length - offset,
                    opacity: 1 - offset * 0.14,
                    transform: isTop
                      ? [
                          { translateX: dragX },
                          { translateY },
                          {
                            rotate: dragX.interpolate({
                              inputRange: [0, SCREEN_WIDTH],
                              outputRange: ['0deg', '15deg'],
                            }),
                          },
                          { scale: scaleVal },
                        ]
                      : [{ translateY }, { scale: scaleVal }],
                  },
                ]}
              >
                <View style={[styles.cardImage, { backgroundColor: moment.imageColor }]}>
                  <View style={styles.cardImageOverlay}>
                    <View style={styles.nudgePill}>
                      <Text style={styles.nudgePillText}>GENTLE NUDGE</Text>
                    </View>
                    <Text style={styles.nudgeText}>{moment.nudge}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.cardUser}>
                    <Avatar emoji={moment.avatarEmoji} size={48} />
                    <View style={{ minWidth: 0, flex: 1 }}>
                      <Text style={styles.cardName}>{moment.displayName}</Text>
                      <Text style={styles.cardHandle}>@{moment.username}</Text>
                    </View>
                  </View>

                  <View style={styles.cardDetails}>
                    <View style={styles.locationRow}>
                      <MapPin size={moderateScale(14)} color={`${colors.brown}8C`} />
                      <Text style={styles.locationText}>{moment.location}</Text>
                      <Text style={styles.locationDot}>·</Text>
                      <Text style={styles.locationText}>{moment.distance}</Text>
                    </View>
                    <Text style={styles.statusText}>{moment.status}</Text>
                    <View style={styles.mutualPill}>
                      <Text style={styles.mutualText}>You both know {moment.mutualConnection}</Text>
                    </View>
                  </View>

                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      onPress={handleUndo}
                      disabled={!history.length}
                      style={[styles.undoBtn, !history.length && styles.disabledBtn]}
                    >
                      <RotateCcw size={moderateScale(16)} color={colors.brown} />
                      <Text style={styles.undoBtnText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={advanceCard}
                      style={styles.swipeBtn}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.swipeBtnText}>Right swipe</Text>
                      <ArrowRight size={moderateScale(16)} color={colors.cream} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            );
          })}

          {!topMoment && (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIcon}>
                <Users size={moderateScale(24)} color={`${colors.brown}B3`} />
              </View>
              <Text style={styles.emptyTitle}>You are caught up</Text>
              <Text style={styles.emptySub}>
                No more community moments nearby right now.
              </Text>
              <TouchableOpacity
                onPress={handleUndo}
                disabled={!history.length}
                style={[styles.undoBtn, !history.length && styles.disabledBtn, { marginTop: moderateScale(24) }]}
              >
                <Text style={styles.undoBtnText}>Bring the last card back</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <Modal visible={!!nudgeMoment} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setNudgeMoment(null)}>
          <View style={styles.nudgeSheet} onStartShouldSetResponder={() => true}>
            <Text style={styles.nudgeLabel}>GENTLE NUDGE</Text>
            <Text style={styles.nudgeTitle}>Someone you know is here.</Text>
            {nudgeMoment && (
              <>
                <Text style={styles.nudgeDesc}>
                  {nudgeMoment.displayName} is at {nudgeMoment.location}. Want to join or send a quick ping first?
                </Text>
                <View style={styles.nudgeInfo}>
                  <Text style={styles.nudgeStatus}>{nudgeMoment.status}</Text>
                  <Text style={styles.nudgeMutual}>
                    Shared connection: {nudgeMoment.mutualConnection}
                  </Text>
                </View>
                {nudgeMoment.pingSent && (
                  <View style={styles.pingSent}>
                    <Text style={styles.pingSentText}>
                      Ping sent. They'll see that you might join.
                    </Text>
                  </View>
                )}
                <View style={styles.nudgeActions}>
                  <TouchableOpacity
                    onPress={() => setNudgeMoment(null)}
                    style={styles.nudgeLater}
                  >
                    <Text style={styles.nudgeLaterText}>Maybe later</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSendPing} style={styles.nudgePing}>
                    <Send size={moderateScale(15)} color={colors.cream} />
                    <Text style={styles.nudgePingText}>Send a ping</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(8),
    paddingBottom: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: `${colors.tan}26`,
    gap: moderateScale(16),
  },
  headerLeft: { flex: 1 },
  headerTitle: { fontStyle: 'italic', fontSize: fontScale(24), color: colors.dark, fontWeight: '700' },
  headerSub: { marginTop: moderateScale(4), fontSize: fontScale(14), color: `${colors.brown}99` },
  nearbyBadge: {
    backgroundColor: colors.paper,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: 9999,
  },
  nearbyText: { fontSize: fontScale(11), fontWeight: '600', color: `${colors.brown}B3` },
  content: { flex: 1, paddingHorizontal: moderateScale(16), paddingTop: moderateScale(16) },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    backgroundColor: `${colors.paper}D9`,
    borderWidth: 1,
    borderColor: `${colors.tan}40`,
    borderRadius: moderateScale(28),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
  },
  tipText: { fontSize: fontScale(14), color: `${colors.brown}B3`, flex: 1 },
  deckContainer: { marginTop: moderateScale(16), position: 'relative' },
  card: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: moderateScale(32),
    borderWidth: 1,
    borderColor: `${colors.tan}33`,
    backgroundColor: colors.paper,
    overflow: 'hidden',
    shadowColor: '#3d2b1f',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.12,
    shadowRadius: 25,
    elevation: 8,
  },
  cardImage: {
    height: '40%',
    position: 'relative',
  },
  cardImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScale(20),
    paddingTop: moderateScale(40),
  },
  nudgePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(4),
    borderRadius: 9999,
  },
  nudgePillText: {
    fontSize: fontScale(11),
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.cream,
  },
  nudgeText: {
    marginTop: moderateScale(12),
    maxWidth: moderateScale(220),
    fontSize: fontScale(20),
    fontStyle: 'italic',
    color: colors.cream,
    lineHeight: fontScale(26),
  },
  cardBody: { flex: 1, paddingHorizontal: moderateScale(20), paddingVertical: moderateScale(16) },
  cardUser: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(12) },
  cardName: { fontSize: fontScale(16), fontWeight: '600', color: colors.dark },
  cardHandle: { fontSize: fontScale(14), color: `${colors.brown}99` },
  cardDetails: {
    marginTop: moderateScale(12),
    backgroundColor: colors.cream,
    borderRadius: moderateScale(24),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },
  locationText: { fontSize: fontScale(12), fontWeight: '600', letterSpacing: 0.5, color: `${colors.brown}8C` },
  locationDot: { fontSize: fontScale(12), color: `${colors.brown}8C` },
  statusText: { marginTop: moderateScale(8), fontSize: fontScale(16), color: colors.dark, lineHeight: fontScale(22) },
  mutualPill: {
    marginTop: moderateScale(8),
    alignSelf: 'flex-start',
    backgroundColor: colors.paper,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(4),
    borderRadius: 9999,
  },
  mutualText: { fontSize: fontScale(12), fontWeight: '500', color: `${colors.brown}BF` },
  cardActions: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginTop: moderateScale(12),
  },
  undoBtn: {
    flex: 1,
    minHeight: moderateScale(48),
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: `${colors.tan}40`,
    backgroundColor: colors.cream,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
  },
  undoBtnText: { fontSize: fontScale(14), fontWeight: '600', color: colors.brown },
  disabledBtn: { opacity: 0.35 },
  swipeBtn: {
    flex: 1.2,
    minHeight: moderateScale(48),
    borderRadius: 9999,
    backgroundColor: colors.brown,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
  },
  swipeBtnText: { fontSize: fontScale(14), fontWeight: '600', color: colors.cream },
  emptyCard: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: moderateScale(32),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: `${colors.tan}66`,
    backgroundColor: `${colors.paper}99`,
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: 9999,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: moderateScale(20),
    fontSize: fontScale(24),
    fontStyle: 'italic',
    color: colors.dark,
  },
  emptySub: {
    marginTop: moderateScale(8),
    fontSize: fontScale(14),
    color: `${colors.brown}A6`,
    textAlign: 'center',
    lineHeight: fontScale(20),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: `${colors.dark}66`,
    justifyContent: 'flex-end',
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(96),
  },
  nudgeSheet: {
    width: '100%',
    borderRadius: moderateScale(30),
    backgroundColor: colors.cream,
    padding: moderateScale(20),
  },
  nudgeLabel: {
    fontSize: fontScale(11),
    fontWeight: '600',
    letterSpacing: 2,
    color: `${colors.brown}73`,
  },
  nudgeTitle: {
    marginTop: moderateScale(8),
    fontSize: fontScale(24),
    fontStyle: 'italic',
    color: colors.dark,
  },
  nudgeDesc: {
    marginTop: moderateScale(12),
    fontSize: fontScale(14),
    color: `${colors.brown}BF`,
    lineHeight: fontScale(20),
  },
  nudgeInfo: {
    marginTop: moderateScale(16),
    backgroundColor: colors.paper,
    borderRadius: moderateScale(24),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
  },
  nudgeStatus: { fontSize: fontScale(14), color: colors.dark },
  nudgeMutual: { marginTop: moderateScale(8), fontSize: fontScale(12), fontWeight: '500', color: `${colors.brown}99` },
  pingSent: {
    marginTop: moderateScale(16),
    backgroundColor: colors.cream,
    borderRadius: moderateScale(16),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
  },
  pingSentText: { fontSize: fontScale(14), fontWeight: '500', color: colors.brown },
  nudgeActions: {
    marginTop: moderateScale(20),
    flexDirection: 'row',
    gap: moderateScale(12),
  },
  nudgeLater: {
    flex: 1,
    minHeight: moderateScale(48),
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: `${colors.tan}40`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nudgeLaterText: { fontSize: fontScale(14), fontWeight: '600', color: colors.brown },
  nudgePing: {
    flex: 1,
    minHeight: moderateScale(48),
    borderRadius: 9999,
    backgroundColor: colors.brown,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
  },
  nudgePingText: { fontSize: fontScale(14), fontWeight: '600', color: colors.cream },
});
