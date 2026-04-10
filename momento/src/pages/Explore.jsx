import { useState } from 'react';
import { Search } from 'lucide-react';
import { posts } from '../data/mockData';

const FILTERS = ['All','People','Places','Art'];

export default function Explore() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [query, setQuery] = useState('');
  const humanPosts = posts.filter(p => !p.isAI);
  const filtered = humanPosts.filter(p => {
    if (!query) return true;
    const q = query.toLowerCase();
    return p.username.toLowerCase().includes(q) || p.caption.toLowerCase().includes(q) || (p.location && p.location.toLowerCase().includes(q));
  });
  return (
    <div>
      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm px-4 pt-2 pb-2 border-b border-tan/15">
        <h1 className="font-display italic text-xl text-dark mb-2">From the community</h1>
        <div className="relative mb-2.5"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/40"/><input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search moments..." className="w-full bg-paper border border-tan/30 rounded-full pl-9 pr-4 py-2 text-sm text-dark placeholder:text-brown/40 focus:outline-none focus:border-brown/50"/></div>
        <div className="flex gap-2 overflow-x-auto pb-0.5">{FILTERS.map(f => <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${activeFilter===f ? 'bg-brown text-cream' : 'bg-paper text-brown/60'}`}>{f}</button>)}</div>
      </header>
      <div className="grid grid-cols-3 gap-px bg-tan/10">{filtered.map(post => <div key={post.id} className="aspect-square film-overlay film-grain active:opacity-70 transition-opacity"><div className="w-full h-full" style={{ backgroundColor:post.imageColor }}/></div>)}</div>
      {filtered.length === 0 && <div className="text-center py-20 px-6"><div className="text-4xl mb-3">🔍</div><p className="text-sm text-brown/60">No moments found.</p></div>}
    </div>
  );
}
