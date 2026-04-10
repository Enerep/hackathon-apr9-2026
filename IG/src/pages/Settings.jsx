import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { useAuth } from '../hooks/useAuth';

const INTERVALS = [15, 20, 30];

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    dailyReelLimit, setDailyReelLimit,
    scrollReminderEnabled, setScrollReminderEnabled,
    scrollReminderInterval, setScrollReminderInterval,
    aiContentSetting, setAiContentSetting,
  } = useAppState();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-full pb-6">
      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm px-4 pt-2 pb-2 border-b border-tan/15 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-brown/60 active:text-dark transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft size={22} strokeWidth={1.8} />
        </button>
        <h1 className="font-display italic text-xl text-dark">Settings</h1>
      </header>

      <div className="px-4 pt-3 space-y-3">
        <Section title="Daily reel limit">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-dark">{dailyReelLimit} min</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            value={dailyReelLimit}
            onChange={(e) => setDailyReelLimit(Number(e.target.value))}
            className="w-full accent-brown h-1.5"
          />
          <div className="flex justify-between text-[11px] text-brown/40 mt-1">
            <span>0</span>
            <span>30 min</span>
          </div>
        </Section>

        <Section title="Scroll reminder">
          <div className="flex items-center justify-between mb-3 gap-4">
            <span className="text-[13px] text-brown/70">Remind me to take a break</span>
            <button
              onClick={() => setScrollReminderEnabled(!scrollReminderEnabled)}
              className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                scrollReminderEnabled ? 'bg-brown' : 'bg-tan/40'
              }`}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                  scrollReminderEnabled ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          {scrollReminderEnabled && (
            <div className="flex gap-2">
              {INTERVALS.map((m) => (
                <button
                  key={m}
                  onClick={() => setScrollReminderInterval(m)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                    scrollReminderInterval === m
                      ? 'bg-brown text-cream'
                      : 'bg-cream text-brown/60 border border-tan/30'
                  }`}
                >
                  {m} min
                </button>
              ))}
            </div>
          )}
        </Section>

        <Section title="AI content">
          <div className="space-y-2">
            {[
              { value: 'hide', label: 'Hide completely', desc: "AI posts won't appear anywhere" },
              { value: 'blur', label: 'Blur with option to reveal', desc: 'See a warning before viewing' },
              { value: 'show', label: 'Show normally', desc: 'No filtering applied' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setAiContentSetting(opt.value)}
                className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all active:scale-[0.98] ${
                  aiContentSetting === opt.value
                    ? 'border-brown bg-brown/5'
                    : 'border-tan/30 bg-cream'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      aiContentSetting === opt.value ? 'border-brown' : 'border-tan/40'
                    }`}
                  >
                    {aiContentSetting === opt.value && (
                      <div className="w-2 h-2 rounded-full bg-brown" />
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-dark">{opt.label}</p>
                    <p className="text-[11px] text-brown/50 mt-0.5">{opt.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Human Verification">
          <p className="text-[13px] text-brown/60 leading-relaxed">
            Human Verification confirms you're a real person posting real content.
            Your verified status appears as a warm brown badge on your profile and posts.
          </p>
        </Section>

        <Section title="Data & Privacy">
          <div className="text-center py-2">
            <div className="text-xl mb-1.5">🔒</div>
            <p className="text-[13px] text-brown/60 leading-relaxed">
              This app never sells your data. No advertisers. No tracking pixels.
              Your attention is not a product.
            </p>
          </div>
        </Section>

        <Section title="Account">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red/10 text-red rounded-xl font-semibold text-[14px] active:scale-[0.98] transition-all"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-paper rounded-2xl p-4 border border-tan/15">
      <h3 className="font-display italic text-[15px] text-dark mb-2.5">{title}</h3>
      {children}
    </div>
  );
}
