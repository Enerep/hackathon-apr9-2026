import { useState, useEffect } from 'react';

function StatusBar() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const u = () => setTime(new Date().toLocaleTimeString([], { hour:'numeric', minute:'2-digit' }));
    u(); const id = setInterval(u, 30000); return () => clearInterval(id);
  }, []);
  return (
    <div className="phone-statusbar">
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" opacity=".7"><rect x="0" y="7" width="3" height="5" rx=".5"/><rect x="4.5" y="4" width="3" height="8" rx=".5"/><rect x="9" y="1" width="3" height="11" rx=".5"/><rect x="13" y="0" width="3" height="12" rx=".5" opacity=".3"/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor" opacity=".7"><rect x="0" y="1" width="21" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none"/><rect x="22" y="3.5" width="2" height="5" rx=".5" opacity=".3"/><rect x="1.5" y="2.5" width="14" height="7" rx="1"/></svg>
      </div>
    </div>
  );
}

export function IGLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs><linearGradient id="ig-grad" x1="0" y1="48" x2="48" y2="0"><stop offset="0%" stopColor="#C0392B"/><stop offset="50%" stopColor="#D4B896"/><stop offset="100%" stopColor="#8B6F47"/></linearGradient></defs>
      <rect width="48" height="48" rx="12" fill="url(#ig-grad)"/>
      <rect x="10" y="10" width="28" height="28" rx="8" stroke="#fff" strokeWidth="2.5" fill="none"/>
      <circle cx="24" cy="24" r="7.5" stroke="#fff" strokeWidth="2.5" fill="none"/>
      <circle cx="34" cy="14" r="2" fill="#fff"/>
    </svg>
  );
}

export function HandIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-4 0v1"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/>
      <path d="M18 8a2 2 0 0 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-5.9-2.7L3.3 15a2 2 0 0 1 3.4-2L8 15"/>
    </svg>
  );
}

function SplashScreen({ onDone }) {
  const [exiting, setExiting] = useState(false);
  useEffect(() => { const t = setTimeout(() => { setExiting(true); setTimeout(onDone, 400); }, 2000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className={`splash ${exiting ? 'splash-out' : ''}`}>
      <div className="splash-icon"><IGLogo size={72}/></div>
      <div className="splash-title mt-5">IG</div>
      <div className="flex items-center gap-1.5 mt-3 splash-sub"><HandIcon size={16}/><span>Human Touch</span></div>
    </div>
  );
}

export default function PhoneFrame({ children }) {
  const [showSplash, setShowSplash] = useState(true);
  return (
    <div className="h-full flex items-center justify-center bg-[#1a1a1a] p-4">
      <div className="phone-frame">
        <div className="phone-notch"/>
        <StatusBar/>
        {children}
        <div className="phone-home"/>
        {showSplash && <SplashScreen onDone={() => setShowSplash(false)}/>}
      </div>
    </div>
  );
}
