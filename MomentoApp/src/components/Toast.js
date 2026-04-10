import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, moderateScale, fontScale, wp } from '../theme';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const showToast = useCallback((message, duration = 2500) => {
    setToast(message);
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 30, duration: 200, useNativeDriver: true }),
      ]).start(() => setToast(null));
    }, duration);
  }, [fadeAnim, slideAnim]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.container,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
          pointerEvents="none"
        >
          <View style={styles.toast}>
            <Text style={styles.text}>{toast}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: moderateScale(140),
    alignSelf: 'center',
    zIndex: 300,
    width: wp(100),
    alignItems: 'center',
  },
  toast: {
    backgroundColor: colors.dark,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    color: colors.cream,
    fontSize: fontScale(14),
    fontWeight: '500',
  },
});
