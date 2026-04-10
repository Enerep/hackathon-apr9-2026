import { View, Text, StyleSheet } from 'react-native';
import { Svg, Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, moderateScale, fontScale } from '../theme';

export function HumanBadge() {
  return (
    <View style={styles.humanContainer}>
      <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
        <Circle cx="5" cy="5" r="4" stroke={colors.brown} strokeWidth="1.2" />
        <Path
          d="M3 5.2l1.4 1.3L7 3.8"
          stroke={colors.brown}
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <Text style={styles.humanText}>human</Text>
    </View>
  );
}

export function AIBadge() {
  return (
    <View style={styles.aiContainer}>
      <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
        <Rect x="1" y="1" width="8" height="8" rx="2" stroke="#BFA100" strokeWidth="1.1" />
        <SvgText
          x="5"
          y="7.5"
          textAnchor="middle"
          fontSize="6"
          fill="#BFA100"
          fontWeight="bold"
        >
          A
        </SvgText>
      </Svg>
      <Text style={styles.aiText}>ai generated</Text>
    </View>
  );
}

export function HumanVerifiedBadge() {
  return (
    <View style={styles.verifiedContainer}>
      <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
        <Circle cx="6" cy="6" r="5" stroke={colors.cream} strokeWidth="1.2" />
        <Path
          d="M3.5 6.2l1.8 1.6L8.5 4.5"
          stroke={colors.cream}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <Text style={styles.verifiedText}>Human Verified</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  humanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(3),
    backgroundColor: `${colors.brown}26`,
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(2),
    borderRadius: 9999,
  },
  humanText: {
    color: colors.brown,
    fontSize: fontScale(11),
    fontWeight: '600',
  },
  aiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(3),
    backgroundColor: colors.aiYellowBg,
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(2),
    borderRadius: 9999,
  },
  aiText: {
    color: colors.dark,
    fontSize: fontScale(11),
    fontWeight: '600',
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
    backgroundColor: colors.brown,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: 9999,
  },
  verifiedText: {
    color: colors.cream,
    fontSize: fontScale(11),
    fontWeight: '600',
  },
});
