import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Eye, EyeOff, LogIn } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { colors, moderateScale, fontScale } from '../theme';
import { Svg, Path } from 'react-native-svg';

function HandIcon({ size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 11V6a2 2 0 0 0-4 0v1" stroke={`${colors.brown}80`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M14 10V4a2 2 0 0 0-4 0v6" stroke={`${colors.brown}80`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 10.5V6a2 2 0 0 0-4 0v8" stroke={`${colors.brown}80`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M18 8a2 2 0 0 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-5.9-2.7L3.3 15a2 2 0 0 1 3.4-2L8 15" stroke={`${colors.brown}80`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {
    setError('');
    if (!identifier.trim()) return setError('Username or email is required');
    if (!password) return setError('Password is required');

    setLoading(true);
    setTimeout(async () => {
      const result = await login({ identifier, password });
      setLoading(false);

      if (!result.success) {
        setError(result.error);
        if (result.verificationStatus === 'none') {
          setTimeout(() => navigation.replace('VerifyID'), 1500);
        } else if (result.verificationStatus === 'pending' || result.verificationStatus === 'denied') {
          setTimeout(() => navigation.replace('VerificationStatus'), 1500);
        }
      }
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandSection}>
          <Text style={styles.brandTitle}>.Human</Text>
          <View style={styles.brandTag}>
            <HandIcon size={moderateScale(14)} />
            <Text style={styles.brandTagText}>Human Touch</Text>
          </View>
        </View>

        <View style={styles.form}>
          <TextInput
            placeholder="Username or email"
            placeholderTextColor={`${colors.brown}59`}
            value={identifier}
            onChangeText={(t) => { setIdentifier(t); setError(''); }}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
          <View style={styles.passwordWrap}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={`${colors.brown}59`}
              value={password}
              onChangeText={(t) => { setPassword(t); setError(''); }}
              secureTextEntry={!showPassword}
              style={[styles.input, styles.passwordInput]}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
            >
              {showPassword
                ? <EyeOff size={moderateScale(18)} color={`${colors.brown}66`} />
                : <Eye size={moderateScale(18)} color={`${colors.brown}66`} />
              }
            </TouchableOpacity>
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.cream} />
            ) : (
              <>
                <LogIn size={moderateScale(18)} color={colors.cream} />
                <Text style={styles.submitText}>Log In</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>Demo login</Text>
          <Text style={styles.demoLine}>Username: <Text style={styles.demoMono}>demo_user</Text></Text>
          <Text style={styles.demoLine}>Password: <Text style={styles.demoMono}>demo123</Text></Text>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupText}>
            Don't have an account?{' '}
            <Text style={styles.signupLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: moderateScale(24),
    paddingVertical: moderateScale(32),
  },
  brandSection: { alignItems: 'center', marginBottom: moderateScale(32) },
  brandTitle: { fontStyle: 'italic', fontSize: fontScale(36), color: colors.dark, fontWeight: '700' },
  brandTag: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(6), marginTop: moderateScale(8) },
  brandTagText: { fontSize: fontScale(13), fontWeight: '500', color: `${colors.brown}80`, letterSpacing: 0.5 },
  form: { width: '100%', gap: moderateScale(12) },
  input: {
    width: '100%',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(14),
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: `${colors.tan}4D`,
    borderRadius: moderateScale(12),
    fontSize: fontScale(14),
    color: colors.dark,
  },
  passwordWrap: { position: 'relative' },
  passwordInput: { paddingRight: moderateScale(48) },
  eyeBtn: { position: 'absolute', right: moderateScale(12), top: 0, bottom: 0, justifyContent: 'center' },
  error: { fontSize: fontScale(13), color: colors.red, textAlign: 'center', fontWeight: '500' },
  submitBtn: {
    width: '100%',
    paddingVertical: moderateScale(14),
    backgroundColor: colors.brown,
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitText: { color: colors.cream, fontWeight: '600', fontSize: fontScale(15) },
  demoCard: {
    marginTop: moderateScale(16),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: `${colors.tan}4D`,
    backgroundColor: colors.paper,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
  },
  demoTitle: { fontWeight: '600', color: colors.dark, fontSize: fontScale(14) },
  demoLine: { marginTop: moderateScale(4), fontSize: fontScale(14), color: `${colors.brown}B3` },
  demoMono: { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: colors.dark },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
    marginTop: moderateScale(24),
    marginBottom: moderateScale(12),
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: `${colors.tan}4D` },
  dividerText: { fontSize: fontScale(12), color: `${colors.brown}66`, fontWeight: '500' },
  signupText: { fontSize: fontScale(13), color: `${colors.brown}80`, textAlign: 'center' },
  signupLink: { color: colors.brown, fontWeight: '600' },
});
