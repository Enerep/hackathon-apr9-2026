import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useToast } from './Toast';
import { colors, moderateScale, fontScale } from '../theme';

export default function ScrollPauseCard() {
  const [dismissed, setDismissed] = useState(false);
  const { showToast } = useToast();

  if (dismissed) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>☕</Text>
      <Text style={styles.title}>You've been scrolling for a while</Text>
      <Text style={styles.subtitle}>
        Maybe it's a good time to look up, stretch, or make yourself a warm drink.
      </Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => setDismissed(true)}
          style={styles.primaryBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryBtnText}>Continue scrolling</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            showToast('Reminder set for 20 minutes from now ☕');
            setDismissed(true);
          }}
          style={styles.secondaryBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryBtnText}>Set a reminder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paper,
    borderRadius: moderateScale(16),
    padding: moderateScale(24),
    marginBottom: moderateScale(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${colors.tan}33`,
  },
  emoji: { fontSize: moderateScale(32), marginBottom: moderateScale(12) },
  title: {
    fontStyle: 'italic',
    fontSize: fontScale(18),
    color: colors.dark,
    marginBottom: moderateScale(4),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontScale(14),
    color: `${colors.brown}B3`,
    marginBottom: moderateScale(20),
    maxWidth: moderateScale(260),
    textAlign: 'center',
    lineHeight: fontScale(20),
  },
  buttons: { width: '100%', gap: moderateScale(10) },
  primaryBtn: {
    backgroundColor: colors.brown,
    paddingVertical: moderateScale(12),
    borderRadius: 9999,
    alignItems: 'center',
  },
  primaryBtnText: { color: colors.cream, fontSize: fontScale(14), fontWeight: '500' },
  secondaryBtn: { paddingVertical: moderateScale(8), alignItems: 'center' },
  secondaryBtnText: { color: `${colors.brown}99`, fontSize: fontScale(14), fontWeight: '500' },
});
