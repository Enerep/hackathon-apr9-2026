import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { Clock, CheckCircle, XCircle, RefreshCw, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { colors, moderateScale, fontScale } from '../theme';

export default function VerificationStatusScreen({ navigation }) {
  const { user, approveVerification, denyVerification, refreshUser, logout } = useAuth();
  const [simulating, setSimulating] = useState(false);
  const insets = useSafeAreaInsets();

  if (!user) return null;

  const status = user.verificationStatus;

  if (status === 'approved') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.center}>
          <View style={[styles.iconCircle, { backgroundColor: `${colors.brown}1A` }]}>
            <CheckCircle size={moderateScale(40)} color={colors.brown} />
          </View>
          <Text style={styles.mainTitle}>Verified!</Text>
          <Text style={styles.mainSub}>
            Your identity has been verified. You're now part of the authentic community.
          </Text>
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
            <ArrowRight size={moderateScale(18)} color={colors.cream} />
            <Text style={styles.primaryBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (status === 'denied') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.center}>
          <View style={[styles.iconCircle, { backgroundColor: `${colors.red}1A` }]}>
            <XCircle size={moderateScale(40)} color={colors.red} />
          </View>
          <Text style={styles.mainTitle}>Verification Denied</Text>
          <Text style={styles.mainSub}>
            We couldn't verify your identity. This could be due to unclear photos or mismatched information.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.replace('VerifyID')}
            style={styles.primaryBtn}
            activeOpacity={0.8}
          >
            <RefreshCw size={moderateScale(18)} color={colors.cream} />
            <Text style={styles.primaryBtnText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.logoutLink}>
            <Text style={styles.logoutLinkText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <PendingView
      user={user}
      simulating={simulating}
      setSimulating={setSimulating}
      approveVerification={approveVerification}
      denyVerification={denyVerification}
      refreshUser={refreshUser}
      logout={logout}
      insets={insets}
    />
  );
}

function PendingView({ user, simulating, setSimulating, approveVerification, denyVerification, refreshUser, logout, insets }) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const id = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(id);
  }, []);

  const handleApprove = useCallback(async () => {
    setSimulating(true);
    setTimeout(async () => {
      await approveVerification(user.id);
      await refreshUser();
      setSimulating(false);
    }, 1500);
  }, [approveVerification, refreshUser, user.id, setSimulating]);

  const handleDeny = useCallback(async () => {
    setSimulating(true);
    setTimeout(async () => {
      await denyVerification(user.id);
      await refreshUser();
      setSimulating(false);
    }, 1500);
  }, [denyVerification, refreshUser, user.id, setSimulating]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.center}>
        <Text style={styles.brandTitle}>.Human</Text>

        <View style={[styles.iconCircle, { backgroundColor: `${colors.brown}1A` }]}>
          <Clock size={moderateScale(40)} color={colors.brown} />
        </View>

        <Text style={styles.mainTitle}>Under Review{dots}</Text>
        <Text style={styles.mainSub}>
          Your ID verification is being reviewed. This usually takes up to 24 hours.
        </Text>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Submitted Details</Text>
          <DetailRow label="Name" value={user.idVerification?.fullName || user.displayName} />
          <DetailRow label="Selfie" value="Uploaded" />
          <DetailRow label="ID Document" value="Uploaded" />
          <DetailRow label="Status" value="Pending Review" highlight />
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Demo: Admin Actions</Text>
          <Text style={styles.demoNote}>
            In production, an admin would review and approve/deny.
          </Text>
          <View style={styles.adminActions}>
            <TouchableOpacity
              onPress={handleApprove}
              disabled={simulating}
              style={[styles.approveBtn, simulating && { opacity: 0.5 }]}
              activeOpacity={0.8}
            >
              {simulating ? (
                <ActivityIndicator color={colors.cream} size="small" />
              ) : (
                <>
                  <CheckCircle size={moderateScale(14)} color={colors.cream} />
                  <Text style={styles.approveBtnText}>Approve</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeny}
              disabled={simulating}
              style={[styles.denyBtn, simulating && { opacity: 0.5 }]}
              activeOpacity={0.8}
            >
              {simulating ? (
                <ActivityIndicator color={colors.red} size="small" />
              ) : (
                <>
                  <XCircle size={moderateScale(14)} color={colors.red} />
                  <Text style={styles.denyBtnText}>Deny</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={logout} style={styles.logoutLink}>
          <Text style={styles.logoutLinkText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DetailRow({ label, value, highlight }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, highlight && { color: colors.brown }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: moderateScale(24) },
  brandTitle: { fontStyle: 'italic', fontSize: fontScale(24), color: colors.dark, fontWeight: '700', marginBottom: moderateScale(16) },
  iconCircle: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(16),
  },
  mainTitle: { fontStyle: 'italic', fontSize: fontScale(24), color: colors.dark, fontWeight: '700' },
  mainSub: {
    fontSize: fontScale(13),
    color: `${colors.brown}99`,
    marginTop: moderateScale(8),
    textAlign: 'center',
    maxWidth: moderateScale(280),
  },
  primaryBtn: {
    marginTop: moderateScale(24),
    width: '100%',
    maxWidth: moderateScale(280),
    paddingVertical: moderateScale(14),
    backgroundColor: colors.brown,
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
  },
  primaryBtnText: { color: colors.cream, fontWeight: '600', fontSize: fontScale(15) },
  logoutLink: { marginTop: moderateScale(20) },
  logoutLinkText: { fontSize: fontScale(13), color: `${colors.brown}80`, fontWeight: '500' },
  detailCard: {
    width: '100%',
    maxWidth: moderateScale(320),
    marginTop: moderateScale(24),
    backgroundColor: colors.paper,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    borderWidth: 1,
    borderColor: `${colors.tan}26`,
  },
  detailTitle: {
    fontStyle: 'italic',
    fontSize: fontScale(14),
    color: colors.dark,
    marginBottom: moderateScale(12),
    textAlign: 'center',
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: moderateScale(6) },
  detailLabel: { fontSize: fontScale(12), color: `${colors.brown}80` },
  detailValue: { fontSize: fontScale(12), fontWeight: '500', color: colors.dark },
  demoNote: { fontSize: fontScale(11), color: `${colors.brown}66`, textAlign: 'center', marginBottom: moderateScale(12) },
  adminActions: { flexDirection: 'row', gap: moderateScale(12) },
  approveBtn: {
    flex: 1,
    paddingVertical: moderateScale(10),
    backgroundColor: colors.brown,
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(6),
  },
  approveBtnText: { color: colors.cream, fontWeight: '600', fontSize: fontScale(13) },
  denyBtn: {
    flex: 1,
    paddingVertical: moderateScale(10),
    backgroundColor: `${colors.red}1A`,
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(6),
  },
  denyBtnText: { color: colors.red, fontWeight: '600', fontSize: fontScale(13) },
});
