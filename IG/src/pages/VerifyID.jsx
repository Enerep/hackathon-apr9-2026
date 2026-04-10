import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { IGLogo } from '../components/PhoneFrame';

export default function VerifyID() {
  const navigate = useNavigate();
  const { user, submitVerification } = useAuth();

  const [selfie, setSelfie] = useState(null);
  const [idPhoto, setIdPhoto] = useState(null);
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  if (user.verificationStatus === 'approved') {
    navigate('/', { replace: true });
    return null;
  }

  const handleFileSelect = (setter) => (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!fullName.trim()) return setError('Full name is required');
    if (!selfie) return setError('Please take or upload a selfie');
    if (!idPhoto) return setError('Please upload your ID document');

    setSubmitting(true);
    setError('');

    setTimeout(() => {
      const result = submitVerification({
        fullName: fullName.trim(),
        selfie: 'selfie_uploaded',
        idDocument: 'id_uploaded',
      });

      setSubmitting(false);

      if (result.success) {
        navigate('/verification-status', { replace: true });
      } else {
        setError(result.error);
      }
    }, 1000);
  };

  return (
    <div className="min-h-full flex flex-col bg-cream">
      <div className="flex-1 px-6 py-6">
        <div className="flex flex-col items-center mb-5">
          <IGLogo size={40} />
          <h1 className="font-display italic text-2xl text-dark mt-2">Verify Your Identity</h1>
          <p className="text-[13px] text-brown/50 mt-1 text-center">
            We need to confirm you're a real human to keep our community authentic.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-5">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s
                    ? 'bg-brown text-cream'
                    : 'bg-paper border border-tan/30 text-brown/40'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div className={`w-8 h-0.5 ${step > s ? 'bg-brown' : 'bg-tan/30'}`} />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4 page-enter">
            <div className="bg-paper rounded-2xl p-4 border border-tan/15">
              <h3 className="font-display italic text-[15px] text-dark mb-2">Full Legal Name</h3>
              <input
                type="text"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setError(''); }}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-cream border border-tan/30 rounded-xl text-sm text-dark placeholder:text-brown/35 focus:outline-none focus:border-brown/50 focus:ring-1 focus:ring-brown/20"
              />
            </div>

            <div className="bg-paper rounded-2xl p-4 border border-tan/15">
              <h3 className="font-display italic text-[15px] text-dark mb-2">Take a Selfie</h3>
              <p className="text-[12px] text-brown/50 mb-3">
                Take a clear photo of your face in good lighting.
              </p>
              <PhotoUpload
                value={selfie}
                onSelect={handleFileSelect(setSelfie)}
                icon={<Camera size={24} />}
                label="Take Selfie"
                accept="image/*"
                capture="user"
              />
            </div>

            <button
              onClick={() => {
                if (!fullName.trim()) return setError('Full name is required');
                if (!selfie) return setError('Please take or upload a selfie');
                setError('');
                setStep(2);
              }}
              className="w-full py-3 bg-brown text-cream rounded-xl font-semibold text-[15px] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 page-enter">
            <div className="bg-paper rounded-2xl p-4 border border-tan/15">
              <h3 className="font-display italic text-[15px] text-dark mb-2">Upload ID Document</h3>
              <p className="text-[12px] text-brown/50 mb-3">
                Upload a photo of your government-issued ID (driver's license, passport, or national ID).
              </p>
              <PhotoUpload
                value={idPhoto}
                onSelect={handleFileSelect(setIdPhoto)}
                icon={<Upload size={24} />}
                label="Upload ID"
                accept="image/*"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-paper border border-tan/30 rounded-xl font-semibold text-[15px] text-brown/70 active:scale-[0.98] transition-all"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (!idPhoto) return setError('Please upload your ID document');
                  setError('');
                  setStep(3);
                }}
                className="flex-1 py-3 bg-brown text-cream rounded-xl font-semibold text-[15px] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Review
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 page-enter">
            <div className="bg-paper rounded-2xl p-4 border border-tan/15">
              <h3 className="font-display italic text-[15px] text-dark mb-3">Review & Submit</h3>

              <div className="space-y-3">
                <ReviewRow label="Full Name" value={fullName} />
                <ReviewRow label="Selfie" value="Uploaded" hasCheck />
                <ReviewRow label="ID Document" value="Uploaded" hasCheck />
              </div>
            </div>

            <div className="bg-paper rounded-2xl p-4 border border-tan/15">
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} className="text-brown shrink-0 mt-0.5" />
                <p className="text-[12px] text-brown/60 leading-relaxed">
                  Your documents are securely processed and will be reviewed within 24 hours.
                  We never share your personal information.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-paper border border-tan/30 rounded-xl font-semibold text-[15px] text-brown/70 active:scale-[0.98] transition-all"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-3 bg-brown text-cream rounded-xl font-semibold text-[15px] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span className="inline-block w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red text-[13px] text-center font-medium mt-3">{error}</p>
        )}
      </div>
    </div>
  );
}

function PhotoUpload({ value, onSelect, icon, label, accept, capture }) {
  return (
    <label className="block cursor-pointer">
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-tan/30">
          <img src={value} alt="Preview" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-dark/20 flex items-center justify-center opacity-0 hover:opacity-100 active:opacity-100 transition-opacity">
            <span className="bg-cream/90 text-dark text-xs font-medium px-3 py-1.5 rounded-full">
              Change
            </span>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-tan/40 rounded-xl py-8 flex flex-col items-center gap-2 text-brown/40 active:border-brown/50 active:text-brown/60 transition-colors">
          {icon}
          <span className="text-[13px] font-medium">{label}</span>
        </div>
      )}
      <input
        type="file"
        accept={accept}
        capture={capture}
        onChange={onSelect}
        className="hidden"
      />
    </label>
  );
}

function ReviewRow({ label, value, hasCheck }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-tan/10 last:border-b-0">
      <span className="text-[13px] text-brown/50">{label}</span>
      <span className="text-[13px] font-medium text-dark flex items-center gap-1.5">
        {hasCheck && <span className="text-brown">&#10003;</span>}
        {value}
      </span>
    </div>
  );
}
