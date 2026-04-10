import { View, Text, StyleSheet } from 'react-native';
import { colors, moderateScale } from '../theme';
import { LinearGradient } from 'react-native';

export default function Avatar({ emoji, size = 40, ring = false, seen = false }) {
  const scaledSize = moderateScale(size);
  const ringSize = scaledSize + moderateScale(6);
  const fontSize = scaledSize * 0.5;

  if (ring) {
    return (
      <View
        style={[
          styles.ringOuter,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            backgroundColor: seen ? '#D4B896' : '#8B6F47',
          },
        ]}
      >
        <View
          style={[
            styles.inner,
            {
              width: scaledSize,
              height: scaledSize,
              borderRadius: scaledSize / 2,
            },
          ]}
        >
          <Text style={{ fontSize }}>{emoji}</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.inner,
        {
          width: scaledSize,
          height: scaledSize,
          borderRadius: scaledSize / 2,
        },
      ]}
    >
      <Text style={{ fontSize }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ringOuter: {
    padding: moderateScale(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
