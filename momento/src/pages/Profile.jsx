import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { currentUser, posts } from '../data/mockData';
import { useAppState } from '../hooks/useAppState';
import Avatar from '../components/Avatar';
import { HumanVerifiedBadge } from '../components/Badge';

export default function Profile() {
  const { timeSpentToday, postsLikedToday, reelMinutesWatched, dailyReelLimit } = useAppState();
  const userPosts = posts.filter(p => !p.isAI).slice(0,9);
  return (
    <div className="pb-6">
      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm px-4 pt-2 pb-2 border-b border-tan/15 flex items-center justify-between">
        <h1 className="font-display italic text-xl text-dark">{currentUser.username}</h1>
        <Link to="/settings" className="p-2 -mr-1 text-brown/50 active:text-dark min-w-[44px] min-h-[44px] flex items-center justify-center"><Settings size={20} strokeWidth={1.8}/></Link>
      </header>
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-5">
          <Avatar emoji={currentUser.avatarEmoji} size={72}/>
          <div className="flex-1 grid grid-cols-3 text-center">
            <div><p className="text-lg font-bold text-dark">{currentUser.postsCount}</p><p className="text-[11px] text-brown/50">Posts</p></div>
            <div><p className="text-lg font-bold text-dark">{currentUser.followers}</p><p className="text-[11px] text-brown/50">Followers</p></div>
            <div><p className="text-lg font-bold text-dark">{currentUser.following}</p><p className="text-[11px] text-brown/50">Following</p></div>
          </div>
        </div>
        <div className="mt-3"><p className="font-semibold text-sm text-dark">{currentUser.displayName}</p><p className="text-[13px] text-brown/70 mt-0.5">{currentUser.bio}</p>{currentUser.isHumanVerified && <div className="mt-2"><HumanVerifiedBadge/></div>}</div>
        <button className="w-full mt-3 py-2 bg-paper border border-tan/30 rounded-lg text-sm font-medium text-dark active:bg-tan/20 transition-colors">Edit profile</button>
      </div>
      <div className="grid grid-cols-3 gap-px bg-tan/10">{userPosts.map(post => <div key={post.id} className="aspect-square film-overlay film-grain active:opacity-70 transition-opacity"><div className="w-full h-full" style={{ backgroundColor:post.imageColor }}/></div>)}</div>
      <div className="mx-4 mt-5 bg-paper rounded-2xl p-4 border border-tan/15">
        <h3 className="font-display italic text-base text-dark mb-3">Your day so far</h3>
        <div className="space-y-3"><Row label="Time spent today" value={`${timeSpentToday} min`}/><Row label="Posts liked" value={postsLikedToday}/><Row label="Reels watched" value={`${reelMinutesWatched} / ${dailyReelLimit} min`}/></div>
        {timeSpentToday < 30 && <div className="mt-3 bg-cream rounded-xl px-4 py-2.5 text-center"><p className="text-[13px] text-brown/70">🌿 Healthy scroll today.</p></div>}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return <div className="flex items-center justify-between"><span className="text-[13px] text-brown/50">{label}</span><span className="text-[13px] font-semibold text-dark">{value}</span></div>;
}
