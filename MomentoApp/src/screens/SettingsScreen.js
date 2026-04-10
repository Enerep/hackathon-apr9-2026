import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, LogOut } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppState } from '../hooks/useAppState';
import { useAuth } from '../hooks/useAuth';
import { colors, moderateScale, fontScale } from '../theme';

const INTERVALS = [15, 20, 30];

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function SettingsScreen({ navigation }) {
  const { logout } = useAuth();
  const {
    scrollReminderEnabled, setScrollReminderEnabled,
    scrollReminderInterval, setScrollReminderInterval,
    aiContentSetting, setAiContentSetting,
  } = useAppState();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={moderateScale(22)} strokeWidth={1.8} color={`${colors.brown}99`} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Section title="Scroll reminder">
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Remind me to take a break</Text>
            <TouchableOpacity
              onPress={() => setScrollReminderEnabled(!scrollReminderEnabled)}
              style={[styles.toggle, scrollReminderEnabled ? styles.toggleOn : styles.toggleOff]}
              activeOpacity={0.8}
            >
              <View style={[styles.toggleThumb, scrollReminderEnabled ? styles.thumbOn : styles.thumbOff]} />
            </TouchableOpacity>
          </View>
          {scrollReminderEnabled && (
            <View style={styles.intervalRow}>
              {INTERVALS.map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setScrollReminderInterval(m)}
                  style={[
                    styles.intervalBtn,
                    scrollReminderInterval === m ? styles.intervalActive : styles.intervalInactive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.intervalText,
                      scrollReminderInterval === m ? styles.intervalTextActive : styles.intervalTextInactive,
                    ]}
                  >
                    {m} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Section>

        <Section title="AI content">
          <View style={styles.optionsList}>
            {[
              { value: 'hide', label: 'Hide completely', desc: "AI posts won't appear anywhere" },
              { value: 'blur', label: 'Blur with option to reveal', desc: 'See a warning before viewing' },
              { value: 'show', label: 'Show normally', desc: 'No filtering applied' },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setAiContentSetting(opt.value)}
                style={[
                  styles.optionCard,
                  aiContentSetting === opt.value ? styles.optionActive : styles.optionInactive,
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.optionInner}>
                  <View
                    style={[
                      styles.radio,
                      aiContentSetting === opt.value ? styles.radioActive : styles.radioInactive,
                    ]}
                  >
                    {aiContentSetting === opt.value && <View style={styles.radioDot} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionLabel}>{opt.label}</Text>
                    <Text style={styles.optionDesc}>{opt.desc}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        <Section title="Human Verification">
          <Text style={styles.infoText}>
            Human Verification confirms you're a real person posting real content.
            Your verified status appears as a warm brown badge on your profile and posts.
          </Text>
        </Section>

        <Section title="Data & Privacy">
          <View style={styles.privacyBox}>
            <Text style={styles.privacyEmoji}>🔒</Text>
            <Text style={styles.infoText}>
              This app never sells your data. No advertisers. No tracking pixels.
              Your attention is not a product.
            </Text>
          </View>
        </Section>

        <Section title="Account">
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} activeOpacity={0.8}>
            <LogOut size={moderateScale(18)} color={colors.red} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(8),
    paddingBottom: moderateScale(8),
    borderBottomWidth: 1,
    borderBottomColor: `${colors.tan}26`,
  },
  backBtn: {
    padding: moderateScale(8),
    marginLeft: moderateScale(-8),
    minWidth: moderateScale(44),
    minHeight: moderateScale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontStyle: 'italic', fontSize: fontScale(20), color: colors.dark, fontWeight: '700' },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(12),
    paddingBottom: moderateScale(32),
    gap: moderateScale(12),
  },
  section: {
    backgroundColor: colors.paper,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    borderWidth: 1,
    borderColor: `${colors.tan}26`,
  },
  sectionTitle: {
    fontStyle: 'italic',
    fontSize: fontScale(15),
    color: colors.dark,
    marginBottom: moderateScale(10),
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: moderateScale(16),
    marginBottom: moderateScale(12),
  },
  toggleLabel: { fontSize: fontScale(13), color: `${colors.brown}B3`, flex: 1 },
  toggle: { width: moderateScale(48), height: moderateScale(28), borderRadius: 9999, justifyContent: 'center' },
  toggleOn: { backgroundColor: colors.brown },
  toggleOff: { backgroundColor: `${colors.tan}66` },
  toggleThumb: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: 9999,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbOn: { marginLeft: moderateScale(22) },
  thumbOff: { marginLeft: moderateScale(2) },
  intervalRow: { flexDirection: 'row', gap: moderateScale(8) },
  intervalBtn: { flex: 1, paddingVertical: moderateScale(8), borderRadius: moderateScale(12), alignItems: 'center' },
  intervalActive: { backgroundColor: colors.brown },
  intervalInactive: { backgroundColor: colors.cream, borderWidth: 1, borderColor: `${colors.tan}4D` },
  intervalText: { fontSize: fontScale(14), fontWeight: '500' },
  intervalTextActive: { color: colors.cream },
  intervalTextInactive: { color: `${colors.brown}99` },
  optionsList: { gap: moderateScale(8) },
  optionCard: {
    width: '100%',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(12),
    borderWidth: 1,
  },
  optionActive: { borderColor: colors.brown, backgroundColor: `${colors.brown}0D` },
  optionInactive: { borderColor: `${colors.tan}4D`, backgroundColor: colors.cream },
  optionInner: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(12) },
  radio: {
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: 9999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.brown },
  radioInactive: { borderColor: `${colors.tan}66` },
  radioDot: { width: moderateScale(8), height: moderateScale(8), borderRadius: 9999, backgroundColor: colors.brown },
  optionLabel: { fontSize: fontScale(13), fontWeight: '500', color: colors.dark },
  optionDesc: { fontSize: fontScale(11), color: `${colors.brown}80`, marginTop: moderateScale(2) },
  infoText: { fontSize: fontScale(13), color: `${colors.brown}99`, lineHeight: fontScale(18) },
  privacyBox: { alignItems: 'center', paddingVertical: moderateScale(8) },
  privacyEmoji: { fontSize: moderateScale(20), marginBottom: moderateScale(6) },
  logoutBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
    paddingVertical: moderateScale(12),
    backgroundColor: `${colors.red}1A`,
    borderRadius: moderateScale(12),
  },
  logoutText: { color: colors.red, fontWeight: '600', fontSize: fontScale(14) },
});
