import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export const wp = (percentage) => (SCREEN_WIDTH * percentage) / 100;
export const hp = (percentage) => (SCREEN_HEIGHT * percentage) / 100;

export const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
export const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const fontScale = (size) => {
  const newSize = scale(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const colors = {
  cream: '#050505',
  paper: '#111111',
  tan: '#2E2E2E',
  brown: '#D7D7D7',
  dark: '#F5F5F5',
  red: '#EAEAEA',
  aiYellow: '#8D8D8D',
  aiYellowBg: '#1A1A1A',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const fonts = {
  display: Platform.select({
    ios: 'Georgia',
    android: 'serif',
  }),
  body: Platform.select({
    ios: 'System',
    android: 'sans-serif',
  }),
};

export const spacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  xxxl: moderateScale(32),
};

export const borderRadius = {
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  full: 9999,
};
