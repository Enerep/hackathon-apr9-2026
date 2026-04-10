import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { currentUser as mockUser, posts } from '../data/mockData';
import { useAppState } from '../hooks/useAppState';
import { useAuth } from '../hooks/useAuth';
import Avatar from '../components/Avatar';
import { HumanVerifiedBadge } from '../components/Badge';
import { colors, moderateScale, fontScale, wp } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_SIZE = (SCREEN_WIDTH - 2) / 3;

export default function ProfileScreen({ navigation }) {
  const { timeSpentToday, postsLikedToday } = useAppState();
  const { user: authUser } = useAuth();
  const insets = useSafeAreaInsets();

  const currentUser = authUser
    ? {
        ...mockUser,
        username: authUser.username,
        displayName: authUser.displayName,
        avatarEmoji: authUser.avatarEmoji,
        isHumanVerified: authUser.isHumanVerified,
        bio: authUser.bio || mockUser.bio,
        followers: authUser.followers || mockUser.followers,
        following: authUser.following || mockUser.following,
        postsCount: authUser.postsCount || mockUser.postsCount,
      }
    : mockUser;

  const userPosts = posts.filter((p) => !p.isAI).slice(0, 9);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{currentUser.username}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsBtn}
        >
          <Settings size={moderateScale(20)} strokeWidth={1.8} color={`${colors.brown}80`} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileTop}>
          <View style={styles.profileRow}>
            <Avatar emoji={currentUser.avatarEmoji} size={72} />
            <View style={styles.statsGrid}>
              <StatCol value={currentUser.postsCount} label="Posts" />
              <StatCol value={currentUser.followers} label="Followers" />
              <StatCol value={currentUser.following} label="Following" />
            </View>
          </View>

          <View style={styles.bioSection}>
            <Text style={styles.displayName}>{currentUser.displayName}</Text>
            <Text style={styles.bio}>{currentUser.bio}</Text>
            {currentUser.isHumanVerified && (
              <View style={styles.badgeWrap}>
                <HumanVerifiedBadge />
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
            <Text style={styles.editBtnText}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {userPosts.map((post) => (
            <View
              key={post.id}
              style={[styles.gridItem, { width: GRID_SIZE, height: GRID_SIZE, backgroundColor: post.imageColor }]}
            />
          ))}
        </View>

        <View style={styles.dayCard}>
          <Text style={styles.dayTitle}>Your day so far</Text>
          <View style={styles.dayStats}>
            <StatRow label="Time spent today" value={`${timeSpentToday} min`} />
            <StatRow label="Posts liked" value={postsLikedToday} />
          </View>
          {timeSpentToday < 30 && (
            <View style={styles.healthyBanner}>
              <Text style={styles.healthyText}>🌿 Healthy scroll today.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function StatCol({ value, label }) {
  return (
    <View style={styles.statCol}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function StatRow({ label, value }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statRowLabel}>{label}</Text>
      <Text style={styles.statRowValue}>{String(value)}</Text>
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
    paddingTop: moderateScale(8),
    paddingBottom: moderateScale(8),
    borderBottomWidth: 1,
    borderBottomColor: `${colors.tan}26`,
  },
  headerTitle: { fontStyle: 'italic', fontSize: fontScale(20), color: colors.dark, fontWeight: '700' },
  settingsBtn: {
    padding: moderateScale(8),
    minWidth: moderateScale(44),
    minHeight: moderateScale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: moderateScale(24) },
  profileTop: { paddingHorizontal: moderateScale(16), paddingTop: moderateScale(16), paddingBottom: moderateScale(12) },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(20) },
  statsGrid: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  statCol: { alignItems: 'center' },
  statValue: { fontSize: fontScale(18), fontWeight: '700', color: colors.dark },
  statLabel: { fontSize: fontScale(11), color: `${colors.brown}80` },
  bioSection: { marginTop: moderateScale(12) },
  displayName: { fontWeight: '600', fontSize: fontScale(14), color: colors.dark },
  bio: { fontSize: fontScale(13), color: `${colors.brown}B3`, marginTop: moderateScale(2) },
  badgeWrap: { marginTop: moderateScale(8) },
  editBtn: {
    width: '100%',
    marginTop: moderateScale(12),
    paddingVertical: moderateScale(8),
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: `${colors.tan}4D`,
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  editBtnText: { fontSize: fontScale(14), fontWeight: '500', color: colors.dark },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: `${colors.tan}1A`,
    gap: 1,
  },
  gridItem: {},
  dayCard: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(20),
    backgroundColor: colors.paper,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    borderWidth: 1,
    borderColor: `${colors.tan}26`,
  },
  dayTitle: {
    fontStyle: 'italic',
    fontSize: fontScale(16),
    color: colors.dark,
    marginBottom: moderateScale(12),
  },
  dayStats: { gap: moderateScale(12) },
  statRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statRowLabel: { fontSize: fontScale(13), color: `${colors.brown}80` },
  statRowValue: { fontSize: fontScale(13), fontWeight: '600', color: colors.dark },
  healthyBanner: {
    marginTop: moderateScale(12),
    backgroundColor: colors.cream,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
    alignItems: 'center',
  },
  healthyText: { fontSize: fontScale(13), color: `${colors.brown}B3` },
});
