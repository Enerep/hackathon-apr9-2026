import { useState, useRef } from 'react';
import { Camera as CameraIcon, MapPin } from 'lucide-react';
import { useToast } from '../components/Toast';

const FILTERS = [{name:'Natural',cls:'filter-natural'},{name:'Warm',cls:'filter-warm'},{name:'Fade',cls:'filter-fade'},{name:'Grain',cls:'filter-grain'}];

export default function Camera() {
  const [image, setImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Natural');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isAI, setIsAI] = useState(false);
  const [posted, setPosted] = useState(false);
  const fileRef = useRef(null);
  const { showToast } = useToast();

  const handleFile = e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = ev => setImage(ev.target.result); r.readAsDataURL(f); };
  const handlePost = () => { setPosted(true); showToast('Your moment has been shared ✨'); setTimeout(() => { setImage(null); setCaption(''); setLocation(''); setIsAI(false); setPosted(false); }, 2000); };
  const filterCls = FILTERS.find(f => f.name === activeFilter)?.cls || '';

  return (
    <div>
      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-tan/15 px-4 pt-2 pb-2">
        <h1 className="font-display italic text-xl text-dark">Share a moment</h1>
        <p className="text-[11px] text-brown/50 mt-0.5">Something real, something yours.</p>
      </header>
      <div className="px-4 pt-3 pb-8">
        {!image ? (
          <button onClick={() => fileRef.current?.click()} className="w-full aspect-[4/5] rounded-2xl border-2 border-dashed border-tan/40 flex flex-col items-center justify-center gap-3 bg-paper/50 active:bg-paper transition-colors">
            <div className="w-16 h-16 rounded-full bg-tan/15 flex items-center justify-center"><CameraIcon size={32} strokeWidth={1.2} className="text-brown/40"/></div>
            <span className="text-sm text-brown/50 font-medium">Tap to choose a photo</span>
          </button>
        ) : (
          <div className="space-y-3">
            <div className={`aspect-square rounded-2xl overflow-hidden film-overlay vignette film-grain ${filterCls}`}><img src={image} alt="Preview" className="w-full h-full object-cover"/></div>
            <div className="flex gap-2 overflow-x-auto py-1">{FILTERS.map(f => <button key={f.name} onClick={() => setActiveFilter(f.name)} className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${activeFilter===f.name ? 'bg-brown text-cream' : 'bg-paper text-brown/60 border border-tan/30'}`}>{f.name}</button>)}</div>
            <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write a caption..." rows={3} className="w-full bg-paper border border-tan/30 rounded-xl px-4 py-3 text-sm text-dark placeholder:text-brown/40 focus:outline-none resize-none"/>
            <div className="relative"><MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brown/40"/><input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Add location (optional)" className="w-full bg-paper border border-tan/30 rounded-full pl-9 pr-4 py-2.5 text-sm text-dark placeholder:text-brown/40 focus:outline-none"/></div>
            <div className="bg-paper rounded-xl p-4 border border-tan/30">
              <div className="flex items-center justify-between gap-4"><div className="flex-1"><p className="text-sm font-medium text-dark">Is this AI-assisted?</p><p className="text-[11px] text-brown/50 mt-0.5">Be honest — the community appreciates it.</p></div>
                <button onClick={() => setIsAI(!isAI)} className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${isAI ? 'bg-ai-yellow' : 'bg-tan/40'}`}><span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${isAI ? 'translate-x-5' : 'translate-x-0.5'}`}/></button>
              </div>
              {isAI && <p className="text-xs text-dark/70 mt-2.5 bg-ai-yellow-bg/60 rounded-lg px-3 py-2">Your post will be labeled as AI-generated.</p>}
            </div>
            <button onClick={handlePost} disabled={posted} className="w-full bg-brown text-cream font-semibold py-3 rounded-full active:bg-dark transition-colors disabled:opacity-50">{posted ? 'Sharing...' : 'Share moment'}</button>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden"/>
      </div>
    </div>
  );
}
