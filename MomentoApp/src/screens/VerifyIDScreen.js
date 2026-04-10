import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Image,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { Camera, Upload, ShieldCheck, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../hooks/useAuth';
import { colors, moderateScale, fontScale } from '../theme';

export default function VerifyIDScreen({ navigation }) {
  const { user, submitVerification } = useAuth();
  const [selfie, setSelfie] = useState(null);
  const [idPhoto, setIdPhoto] = useState(null);
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const insets = useSafeAreaInsets();

  const pickImage = async (setter) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      setter(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!fullName.trim()) return setError('Full name is required');
    if (!selfie) return setError('Please take or upload a selfie');
    if (!idPhoto) return setError('Please upload your ID document');

    setSubmitting(true);
    setError('');

    setTimeout(async () => {
      const result = await submitVerification({
        fullName: fullName.trim(),
        selfie: 'selfie_uploaded',
        idDocument: 'id_uploaded',
      });
      setSubmitting(false);
      if (result.success) {
        navigation.replace('VerificationStatus');
      } else {
        setError(result.error);
      }
    }, 1000);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandSection}>
          <Text style={styles.title}>Verify Your Identity</Text>
          <Text style={styles.subtitle}>
            We need to confirm you're a real human to keep our community authentic.
          </Text>
        </View>

        <View style={styles.stepper}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={styles.stepperItem}>
              <View style={[styles.stepCircle, step >= s ? styles.stepActive : styles.stepInactive]}>
                <Text style={[styles.stepNum, step >= s ? styles.stepNumActive : styles.stepNumInactive]}>{s}</Text>
              </View>
              {s < 3 && <View style={[styles.stepLine, step > s ? styles.stepLineActive : styles.stepLineInactive]} />}
            </View>
          ))}
        </View>

        {step === 1 && (
          <View style={styles.stepContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Full Legal Name</Text>
              <TextInput
                value={fullName}
                onChangeText={(t) => { setFullName(t); setError(''); }}
                placeholder="Enter your full name"
                placeholderTextColor={`${colors.brown}59`}
                style={styles.input}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Take a Selfie</Text>
              <Text style={styles.cardSub}>Take a clear photo of your face in good lighting.</Text>
              <PhotoUpload value={selfie} onPress={() => pickImage(setSelfie)} icon={<Camera size={moderateScale(24)} color={`${colors.brown}66`} />} label="Take Selfie" />
            </View>

            <TouchableOpacity
              onPress={() => {
                if (!fullName.trim()) return setError('Full name is required');
                if (!selfie) return setError('Please take or upload a selfie');
                setError('');
                setStep(2);
              }}
              style={styles.continueBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
              <ArrowRight size={moderateScale(18)} color={colors.cream} />
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Upload ID Document</Text>
              <Text style={styles.cardSub}>Upload a photo of your government-issued ID.</Text>
              <PhotoUpload value={idPhoto} onPress={() => pickImage(setIdPhoto)} icon={<Upload size={moderateScale(24)} color={`${colors.brown}66`} />} label="Upload ID" />
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity onPress={() => setStep(1)} style={styles.backBtn}>
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (!idPhoto) return setError('Please upload your ID document');
                  setError('');
                  setStep(3);
                }}
                style={styles.continueBtn}
              >
                <Text style={styles.continueBtnText}>Review</Text>
                <ArrowRight size={moderateScale(18)} color={colors.cream} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Review & Submit</Text>
              <ReviewRow label="Full Name" value={fullName} />
              <ReviewRow label="Selfie" value="Uploaded" hasCheck />
              <ReviewRow label="ID Document" value="Uploaded" hasCheck />
            </View>

            <View style={styles.card}>
              <View style={styles.shieldRow}>
                <ShieldCheck size={moderateScale(20)} color={colors.brown} />
                <Text style={styles.shieldText}>
                  Your documents are securely processed and will be reviewed within 24 hours.
                </Text>
              </View>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity onPress={() => setStep(2)} style={styles.backBtn}>
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} disabled={submitting} style={[styles.continueBtn, submitting && { opacity: 0.5 }]}>
                {submitting ? (
                  <ActivityIndicator color={colors.cream} />
                ) : (
                  <>
                    <ShieldCheck size={moderateScale(18)} color={colors.cream} />
                    <Text style={styles.continueBtnText}>Submit</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!!error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
    </View>
  );
}

function PhotoUpload({ value, onPress, icon, label }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {value ? (
        <View style={styles.photoPreview}>
          <Image source={{ uri: value }} style={styles.photoImage} />
        </View>
      ) : (
        <View style={styles.photoPlaceholder}>
          {icon}
          <Text style={styles.photoLabel}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function ReviewRow({ label, value, hasCheck }) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <View style={styles.reviewValue}>
        {hasCheck && <Text style={styles.checkMark}>✓</Text>}
        <Text style={styles.reviewValueText}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  scrollContent: { paddingHorizontal: moderateScale(24), paddingVertical: moderateScale(24) },
  brandSection: { alignItems: 'center', marginBottom: moderateScale(20) },
  title: { fontStyle: 'italic', fontSize: fontScale(24), color: colors.dark, fontWeight: '700' },
  subtitle: { fontSize: fontScale(13), color: `${colors.brown}80`, marginTop: moderateScale(4), textAlign: 'center' },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: moderateScale(8), marginBottom: moderateScale(20) },
  stepperItem: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(8) },
  stepCircle: { width: moderateScale(32), height: moderateScale(32), borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  stepActive: { backgroundColor: colors.brown },
  stepInactive: { backgroundColor: colors.paper, borderWidth: 1, borderColor: `${colors.tan}4D` },
  stepNum: { fontSize: fontScale(12), fontWeight: '700' },
  stepNumActive: { color: colors.cream },
  stepNumInactive: { color: `${colors.brown}66` },
  stepLine: { width: moderateScale(32), height: 2 },
  stepLineActive: { backgroundColor: colors.brown },
  stepLineInactive: { backgroundColor: `${colors.tan}4D` },
  stepContent: { gap: moderateScale(16) },
  card: {
    backgroundColor: colors.paper,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    borderWidth: 1,
    borderColor: `${colors.tan}26`,
  },
  cardTitle: { fontStyle: 'italic', fontSize: fontScale(15), color: colors.dark, marginBottom: moderateScale(8) },
  cardSub: { fontSize: fontScale(12), color: `${colors.brown}80`, marginBottom: moderateScale(12) },
  input: {
    width: '100%',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(14),
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: `${colors.tan}4D`,
    borderRadius: moderateScale(12),
    fontSize: fontScale(14),
    color: colors.dark,
  },
  photoPreview: { borderRadius: moderateScale(12), overflow: 'hidden', borderWidth: 1, borderColor: `${colors.tan}4D` },
  photoImage: { width: '100%', height: moderateScale(160), resizeMode: 'cover' },
  photoPlaceholder: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: `${colors.tan}66`,
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(32),
    alignItems: 'center',
    gap: moderateScale(8),
  },
  photoLabel: { fontSize: fontScale(13), fontWeight: '500', color: `${colors.brown}66` },
  btnRow: { flexDirection: 'row', gap: moderateScale(12) },
  backBtn: {
    flex: 1,
    paddingVertical: moderateScale(14),
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: `${colors.tan}4D`,
    borderRadius: moderateScale(12),
    alignItems: 'center',
  },
  backBtnText: { fontWeight: '600', fontSize: fontScale(15), color: `${colors.brown}B3` },
  continueBtn: {
    flex: 1,
    paddingVertical: moderateScale(14),
    backgroundColor: colors.brown,
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
  },
  continueBtnText: { color: colors.cream, fontWeight: '600', fontSize: fontScale(15) },
  shieldRow: { flexDirection: 'row', alignItems: 'flex-start', gap: moderateScale(12) },
  shieldText: { flex: 1, fontSize: fontScale(12), color: `${colors.brown}99`, lineHeight: fontScale(18) },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(8),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${colors.tan}1A`,
  },
  reviewLabel: { fontSize: fontScale(13), color: `${colors.brown}80` },
  reviewValue: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(6) },
  checkMark: { color: colors.brown, fontSize: fontScale(14) },
  reviewValueText: { fontSize: fontScale(13), fontWeight: '500', color: colors.dark },
  error: { fontSize: fontScale(13), color: colors.red, textAlign: 'center', fontWeight: '500', marginTop: moderateScale(12) },
});
