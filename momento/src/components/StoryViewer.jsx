import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const COLORS = ['#B8860B','#2E86AB','#27AE60','#E67E22','#8E6F4E','#D4A574','#F1C40F','#5D6D7E'];

export default function StoryViewer({ stories, startIndex = 0, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  const [exiting, setExiting] = useState(false);
  const [key, setKey] = useState(0);
  const story = stories[current];

  const close = useCallback(() => { setExiting(true); setTimeout(onClose, 250); }, [onClose]);
  const next = useCallback(() => { if (current < stories.length-1) { setCurrent(c=>c+1); setKey(k=>k+1); } else close(); }, [current, stories.length, close]);
  const prev = useCallback(() => { if (current > 0) { setCurrent(c=>c-1); setKey(k=>k+1); } }, [current]);

  useEffect(() => { const t = setTimeout(next, 5000); return () => clearTimeout(t); }, [current, key, next]);

  const handleTap = e => { const rect = e.currentTarget.getBoundingClientRect(); (e.clientX - rect.left) < rect.width/3 ? prev() : next(); };

  return (
    <div className={`story-viewer ${exiting ? 'story-out' : ''}`} onClick={handleTap}>
      <div className="absolute top-3 left-3 right-3 z-10 flex gap-1">
        {stories.map((_,i) => <div key={i} className="flex-1 story-bar">{i<current && <div className="h-full w-full bg-white rounded-full"/>}{i===current && <div key={key} className="story-fill"/>}</div>)}
      </div>
      <div className="absolute top-8 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5"><div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">{story.avatarEmoji}</div><span className="text-white text-sm font-semibold">{story.username}</span></div>
        <button onClick={e => { e.stopPropagation(); close(); }} className="p-2"><X size={22} className="text-white"/></button>
      </div>
      <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor:COLORS[current%COLORS.length] }}>
        <div className="text-center"><div className="text-6xl mb-4">{story.avatarEmoji}</div><p className="text-white/90 text-lg font-display italic">{story.username}&apos;s story</p><p className="text-white/50 text-xs mt-2">Tap to advance</p></div>
      </div>
    </div>
  );
}
