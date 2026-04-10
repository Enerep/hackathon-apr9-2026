import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { IGLogo, HandIcon } from '../components/PhoneFrame';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) return setError('Email is required');
    if (!password) return setError('Password is required');

    setLoading(true);

    setTimeout(() => {
      const result = login({
        email: email.toLowerCase().trim(),
        password,
      });

      setLoading(false);

      if (result.success) {
        navigate('/', { replace: true });
      } else {
        setError(result.error);

        if (result.verificationStatus === 'none') {
          setTimeout(() => navigate('/verify-id'), 1500);
        } else if (result.verificationStatus === 'pending') {
          setTimeout(() => navigate('/verification-status'), 1500);
        } else if (result.verificationStatus === 'denied') {
          setTimeout(() => navigate('/verify-id'), 1500);
        }
      }
    }, 600);
  };

  return (
    <div className="min-h-full flex flex-col bg-cream">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="mb-8 flex flex-col items-center">
          <IGLogo size={64} />
          <h1 className="font-display italic text-4xl text-dark mt-4">IG</h1>
          <div className="flex items-center gap-1.5 mt-2 text-brown/50">
            <HandIcon size={14} />
            <span className="text-[13px] font-medium tracking-wide">Human Touch</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            className="w-full px-4 py-3 bg-paper border border-tan/30 rounded-xl text-sm text-dark placeholder:text-brown/35 focus:outline-none focus:border-brown/50 focus:ring-1 focus:ring-brown/20 transition-colors"
            autoFocus
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-3 bg-paper border border-tan/30 rounded-xl text-sm text-dark placeholder:text-brown/35 focus:outline-none focus:border-brown/50 focus:ring-1 focus:ring-brown/20 transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/40 active:text-brown"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-red text-[13px] text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brown text-cream rounded-xl font-semibold text-[15px] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={18} />
                Log In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 w-full max-w-sm">
            <div className="flex-1 h-px bg-tan/30" />
            <span className="text-[12px] text-brown/40 font-medium">OR</span>
            <div className="flex-1 h-px bg-tan/30" />
          </div>

          <p className="text-[13px] text-brown/50">
            Don't have an account?{' '}
            <Link to="/register" className="text-brown font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
