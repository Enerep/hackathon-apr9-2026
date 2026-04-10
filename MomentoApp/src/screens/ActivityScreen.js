import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Heart, MessageCircle, UserPlus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { notifications } from '../data/mockData';
import Avatar from '../components/Avatar';
import { HumanBadge } from '../components/Badge';
import { colors, moderateScale, fontScale } from '../theme';

const typeIcon = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
};

function NotificationItem({ item }) {
  const Icon = typeIcon[item.type];
  return (
    <View style={styles.item}>
      <Avatar emoji={item.avatarEmoji} size={42} />
      <View style={styles.itemContent}>
        <Text style={styles.itemText}>
          <Text style={styles.itemUsername}>{item.username}</Text>{' '}
          <HumanBadge />{' '}
          <Text style={styles.itemMessage}>{item.message}</Text>
        </Text>
        <Text style={styles.itemTimestamp}>{item.timestamp}</Text>
      </View>
      <Icon size={moderateScale(16)} strokeWidth={1.8} color={`${colors.brown}40`} />
    </View>
  );
}

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyText}>
            It's quiet here. Go share something real.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(n) => String(n.id)}
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>RECENT</Text>
            </View>
          }
          renderItem={({ item }) => <NotificationItem item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(8),
    paddingBottom: moderateScale(8),
    borderBottomWidth: 1,
    borderBottomColor: `${colors.tan}26`,
  },
  headerTitle: { fontStyle: 'italic', fontSize: fontScale(20), color: colors.dark, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: moderateScale(24) },
  emptyEmoji: { fontSize: moderateScale(48), marginBottom: moderateScale(16) },
  emptyText: {
    fontSize: fontScale(14),
    color: `${colors.brown}99`,
    maxWidth: moderateScale(220),
    textAlign: 'center',
  },
  listContent: { paddingBottom: moderateScale(24) },
  sectionHeader: { paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(10) },
  sectionLabel: {
    fontSize: fontScale(12),
    fontWeight: '600',
    color: `${colors.brown}80`,
    letterSpacing: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${colors.tan}1A`,
  },
  itemContent: { flex: 1, minWidth: 0 },
  itemText: { fontSize: fontScale(13), color: colors.dark, lineHeight: fontScale(18) },
  itemUsername: { fontWeight: '600' },
  itemMessage: { color: `${colors.brown}B3` },
  itemTimestamp: { fontSize: fontScale(11), color: `${colors.brown}66`, marginTop: moderateScale(2) },
});
