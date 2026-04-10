import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
export default function VerificationStatus() {
  const navigate = useNavigate();
  const { user, approveVerification, denyVerification, refreshUser, logout } = useAuth();

  const [simulating, setSimulating] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const status = user.verificationStatus;

  if (status === 'none') {
    return <Navigate to="/verify-id" replace />;
  }

  if (status === 'approved') {
    return (
      <div className="min-h-full flex flex-col bg-cream">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="w-20 h-20 rounded-full bg-brown/10 flex items-center justify-center mb-4">
            <CheckCircle size={40} className="text-brown" />
          </div>
          <h1 className="font-display italic text-2xl text-dark">Verified!</h1>
          <p className="text-[13px] text-brown/60 mt-2 text-center max-w-xs">
            Your identity has been verified. You're now part of the authentic IG community.
          </p>

          <button
            onClick={() => navigate('/', { replace: true })}
            className="mt-6 w-full max-w-xs py-3 bg-brown text-cream rounded-xl font-semibold text-[15px] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <ArrowRight size={18} />
            Continue to IG
          </button>
        </div>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="min-h-full flex flex-col bg-cream">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="w-20 h-20 rounded-full bg-red/10 flex items-center justify-center mb-4">
            <XCircle size={40} className="text-red" />
          </div>
          <h1 className="font-display italic text-2xl text-dark">Verification Denied</h1>
          <p className="text-[13px] text-brown/60 mt-2 text-center max-w-xs">
            We couldn't verify your identity. This could be due to unclear photos or mismatched information.
          </p>

          <button
            onClick={() => navigate('/verify-id', { replace: true })}
            className="mt-6 w-full max-w-xs py-3 bg-brown text-cream rounded-xl font-semibold text-[15px] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Try Again
          </button>

          <button
            onClick={logout}
            className="mt-3 text-[13px] text-brown/50 font-medium"
          >
            Log out
          </button>
        </div>
      </div>
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
    />
  );
}

function PendingView({ user, simulating, setSimulating, approveVerification, denyVerification, refreshUser, logout }) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const id = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(id);
  }, []);

  const handleSimulateApprove = useCallback(() => {
    setSimulating(true);
    setTimeout(() => {
      approveVerification(user.id);
      refreshUser();
      setSimulating(false);
    }, 1500);
  }, [approveVerification, refreshUser, user.id, setSimulating]);

  const handleSimulateDeny = useCallback(() => {
    setSimulating(true);
    setTimeout(() => {
      denyVerification(user.id);
      refreshUser();
      setSimulating(false);
    }, 1500);
  }, [denyVerification, refreshUser, user.id, setSimulating]);

  return (
    <div className="min-h-full flex flex-col bg-cream">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <h2 className="font-display italic text-2xl text-dark mb-4">.Human</h2>

        <div className="w-20 h-20 rounded-full bg-brown/10 flex items-center justify-center mb-4">
          <Clock size={40} className="text-brown animate-pulse" />
        </div>

        <h1 className="font-display italic text-2xl text-dark">Under Review{dots}</h1>
        <p className="text-[13px] text-brown/60 mt-2 text-center max-w-xs">
          Your ID verification is being reviewed. This usually takes up to 24 hours.
        </p>

        <div className="w-full max-w-xs mt-6 bg-paper rounded-2xl p-4 border border-tan/15">
          <h3 className="font-display italic text-[14px] text-dark mb-3 text-center">Submitted Details</h3>
          <div className="space-y-2">
            <DetailRow label="Name" value={user.idVerification?.fullName || user.displayName} />
            <DetailRow label="Selfie" value="Uploaded" />
            <DetailRow label="ID Document" value="Uploaded" />
            <DetailRow label="Status" value="Pending Review" highlight />
          </div>
        </div>

        <div className="w-full max-w-xs mt-4 bg-paper rounded-2xl p-4 border border-tan/15">
          <h3 className="font-display italic text-[14px] text-dark mb-3 text-center">
            Demo: Admin Actions
          </h3>
          <p className="text-[11px] text-brown/40 text-center mb-3">
            In production, an admin would review and approve/deny.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleSimulateApprove}
              disabled={simulating}
              className="flex-1 py-2.5 bg-brown text-cream rounded-xl text-[13px] font-semibold active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {simulating ? (
                <span className="inline-block w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle size={14} />
                  Approve
                </>
              )}
            </button>
            <button
              onClick={handleSimulateDeny}
              disabled={simulating}
              className="flex-1 py-2.5 bg-red/10 text-red rounded-xl text-[13px] font-semibold active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {simulating ? (
                <span className="inline-block w-4 h-4 border-2 border-red/30 border-t-red rounded-full animate-spin" />
              ) : (
                <>
                  <XCircle size={14} />
                  Deny
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-5 text-[13px] text-brown/50 font-medium active:text-brown transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[12px] text-brown/50">{label}</span>
      <span className={`text-[12px] font-medium ${highlight ? 'text-brown' : 'text-dark'}`}>
        {value}
      </span>
    </div>
  );
}
