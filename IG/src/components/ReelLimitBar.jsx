import { useState } from 'react';
import { useAppState } from '../hooks/useAppState';

export default function ReelLimitBar() {
  const { reelMinutesWatched, dailyReelLimit } = useAppState();
  const [showModal, setShowModal] = useState(false);
  const pct = Math.min((reelMinutesWatched / dailyReelLimit) * 100, 100);
  const atLimit = reelMinutesWatched >= dailyReelLimit;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="sticky bottom-0 w-full z-40 px-4 py-2 bg-cream/90 backdrop-blur-sm border-t border-tan/20 text-left active:bg-paper transition-colors"
      >
        <div className="flex items-center justify-between text-xs text-brown/70 mb-1">
          <span>Reels {reelMinutesWatched} / {dailyReelLimit} min</span>
          {atLimit && <span className="text-red font-medium">Limit reached</span>}
        </div>
        <div className="w-full h-1.5 bg-tan/20 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: atLimit ? 'var(--color-red)' : 'var(--color-brown)',
            }}
          />
        </div>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-dark/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div
            className="bg-cream rounded-t-3xl sm:rounded-2xl p-6 w-full sm:max-w-sm shadow-xl safe-bottom animate-[slideUp_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-tan/40 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="text-3xl text-center mb-3">⏳</div>
            <h3 className="font-display italic text-xl text-center text-dark mb-2">
              {atLimit ? "You've reached your reel limit" : 'Your daily reel cap'}
            </h3>
            <p className="text-sm text-brown/70 text-center mb-5">
              {atLimit
                ? "Come back tomorrow — or change your limit in Settings. This isn't a punishment; it's a gift to your attention."
                : `You've set a daily reel limit of ${dailyReelLimit} minutes. This helps you stay intentional with your time.`}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-brown text-cream text-sm font-medium py-3 rounded-full active:bg-dark transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
