import { useState } from 'react';
import { stories, posts } from '../data/mockData';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import ScrollPauseCard from '../components/ScrollPauseCard';
import ReelLimitBar from '../components/ReelLimitBar';
import StoryViewer from '../components/StoryViewer';
import { IGLogo, HandIcon } from '../components/PhoneFrame';

function StoriesRow({ onOpen }) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-3">
      {stories.map((s, i) => (
        <button key={s.id} onClick={() => onOpen(i)} className="flex flex-col items-center gap-1 shrink-0 active:scale-95 transition-transform">
          <Avatar emoji={s.avatarEmoji} size={58} ring seen={s.seen}/>
          <span className="text-[11px] text-brown/70 max-w-[64px] truncate">{s.username.split('.')[0]}</span>
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [storyIndex, setStoryIndex] = useState(null);
  return (
    <div>
      <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-tan/15">
        <div className="px-4 pt-2 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5"><IGLogo size={28}/><h1 className="font-display italic text-2xl text-dark">IG</h1></div>
          <div className="flex items-center gap-1.5 text-brown/50"><HandIcon size={16}/><span className="text-[10px] font-semibold tracking-wide uppercase">Human Touch</span></div>
        </div>
      </header>
      <div className="mx-4 mt-2 mb-1 bg-paper rounded-full px-4 py-1.5 text-center">
        <p className="text-[11px] text-brown/60">Showing posts from people you follow · <span className="font-medium">Chronological</span></p>
      </div>
      <StoriesRow onOpen={setStoryIndex}/>
      <div className="px-3 pb-6">
        {posts.map((post, i) => (
          <div key={post.id}>
            {i === 5 && <ScrollPauseCard/>}
            <PostCard post={post}/>
          </div>
        ))}
      </div>
      <ReelLimitBar/>
      {storyIndex !== null && <StoryViewer stories={stories} startIndex={storyIndex} onClose={() => setStoryIndex(null)}/>}
    </div>
  );
}
