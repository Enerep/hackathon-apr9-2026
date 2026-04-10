import { useState } from 'react';
import { useToast } from './Toast';

export default function ScrollPauseCard() {
  const [dismissed, setDismissed] = useState(false);
  const { showToast } = useToast();
  if (dismissed) return null;
  return (
    <div className="bg-paper rounded-2xl p-6 mb-3 text-center shadow-sm border border-tan/20">
      <div className="text-4xl mb-3">☕</div>
      <h3 className="font-display italic text-lg text-dark mb-1">You've been scrolling for a while</h3>
      <p className="text-sm text-brown/70 mb-5 max-w-[260px] mx-auto leading-relaxed">Maybe it's a good time to look up, stretch, or make yourself a warm drink.</p>
      <div className="flex flex-col gap-2.5">
        <button onClick={() => setDismissed(true)} className="bg-brown text-cream text-sm font-medium px-5 py-3 rounded-full active:bg-dark transition-colors">Continue scrolling</button>
        <button onClick={() => { showToast('Reminder set for 20 minutes ☕'); setDismissed(true); }} className="text-sm text-brown/60 font-medium active:text-brown transition-colors py-2">Set a reminder</button>
      </div>
    </div>
  );
}
