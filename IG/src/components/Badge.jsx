export function HumanBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-brown/15 text-brown text-[11px] font-semibold px-2 py-0.5 rounded-full">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M3 5.2l1.4 1.3L7 3.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
      human
    </span>
  );
}

export function AIBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-ai-yellow-bg text-dark text-[11px] font-semibold px-2 py-0.5 rounded-full">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="1" y="1" width="8" height="8" rx="2" stroke="#BFA100" strokeWidth="1.1"/><text x="5" y="7.5" textAnchor="middle" fontSize="6" fill="#BFA100" fontWeight="bold">A</text></svg>
      ai generated
    </span>
  );
}

export function HumanVerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-brown text-cream text-[11px] font-semibold px-2.5 py-1 rounded-full">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M3.5 6.2l1.8 1.6L8.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      Human Verified
    </span>
  );
}
