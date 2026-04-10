import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { IGLogo } from '../components/PhoneFrame';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    displayName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.displayName.trim()) return setError('Display name is required');
    if (!form.username.trim()) return setError('Username is required');
    if (form.username.includes(' ')) return setError('Username cannot contain spaces');
    if (!form.email.trim()) return setError('Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Invalid email address');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');

    setLoading(true);

    setTimeout(() => {
      const result = register({
        username: form.username.toLowerCase().trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
        displayName: form.displayName.trim(),
      });

      setLoading(false);

      if (result.success) {
        navigate('/verify-id', { replace: true });
      } else {
        setError(result.error);
      }
    }, 600);
  };

  return (
    <div className="min-h-full flex flex-col bg-cream">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="mb-6 flex flex-col items-center">
          <IGLogo size={56} />
          <h1 className="font-display italic text-3xl text-dark mt-3">IG</h1>
          <p className="text-sm text-brown/60 mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
          <Input
            placeholder="Display name"
            value={form.displayName}
            onChange={update('displayName')}
            autoFocus
          />
          <Input
            placeholder="Username"
            value={form.username}
            onChange={update('username')}
          />
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={update('email')}
          />
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={update('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/40 active:text-brown"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
          />

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
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-[13px] text-brown/50">
          Already have an account?{' '}
          <Link to="/login" className="text-brown font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 bg-paper border border-tan/30 rounded-xl text-sm text-dark placeholder:text-brown/35 focus:outline-none focus:border-brown/50 focus:ring-1 focus:ring-brown/20 transition-colors ${className}`}
    />
  );
}
