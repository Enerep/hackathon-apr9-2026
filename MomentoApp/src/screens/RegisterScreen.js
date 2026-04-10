import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Eye, EyeOff, UserPlus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { colors, moderateScale, fontScale } from '../theme';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    displayName: '', username: '', email: '', password: '', confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const update = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.displayName.trim()) return setError('Display name is required');
    if (!form.username.trim()) return setError('Username is required');
    if (form.username.includes(' ')) return setError('Username cannot contain spaces');
    if (!form.email.trim()) return setError('Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Invalid email address');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');

    setLoading(true);
    setTimeout(async () => {
      const result = await register({
        username: form.username.toLowerCase().trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
        displayName: form.displayName.trim(),
      });

      setLoading(false);
      if (result.success) {
        navigation.replace('VerifyID');
      } else {
        setError(result.error);
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
          <Text style={styles.brandSub}>Create your account</Text>
        </View>

        <View style={styles.form}>
          <TextInput placeholder="Display name" placeholderTextColor={`${colors.brown}59`} value={form.displayName} onChangeText={update('displayName')} style={styles.input} />
          <TextInput placeholder="Username" placeholderTextColor={`${colors.brown}59`} value={form.username} onChangeText={update('username')} autoCapitalize="none" autoCorrect={false} style={styles.input} />
          <TextInput placeholder="Email" placeholderTextColor={`${colors.brown}59`} value={form.email} onChangeText={update('email')} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
          <View style={styles.passwordWrap}>
            <TextInput placeholder="Password" placeholderTextColor={`${colors.brown}59`} value={form.password} onChangeText={update('password')} secureTextEntry={!showPassword} style={[styles.input, styles.passwordInput]} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              {showPassword ? <EyeOff size={moderateScale(18)} color={`${colors.brown}66`} /> : <Eye size={moderateScale(18)} color={`${colors.brown}66`} />}
            </TouchableOpacity>
          </View>
          <TextInput placeholder="Confirm password" placeholderTextColor={`${colors.brown}59`} value={form.confirmPassword} onChangeText={update('confirmPassword')} secureTextEntry={!showPassword} style={styles.input} />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity onPress={handleSubmit} disabled={loading} style={[styles.submitBtn, loading && styles.submitBtnDisabled]} activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator color={colors.cream} />
            ) : (
              <>
                <UserPlus size={moderateScale(18)} color={colors.cream} />
                <Text style={styles.submitText}>Create Account</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginBold}>Log in</Text>
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
  brandSection: { alignItems: 'center', marginBottom: moderateScale(24) },
  brandTitle: { fontStyle: 'italic', fontSize: fontScale(30), color: colors.dark, fontWeight: '700' },
  brandSub: { fontSize: fontScale(14), color: `${colors.brown}99`, marginTop: moderateScale(4) },
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
  loginLink: { marginTop: moderateScale(24), alignItems: 'center' },
  loginText: { fontSize: fontScale(13), color: `${colors.brown}80` },
  loginBold: { color: colors.brown, fontWeight: '600' },
});
