import { useState, useRef, useCallback } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import Avatar from './Avatar';
import { HumanBadge, AIBadge } from './Badge';

export default function PostCard({ post }) {
  const { likedPosts, toggleLike, aiContentSetting, revealedAIPosts, revealAIPost } = useAppState();
  const liked = likedPosts.includes(post.id);
  const [localLikes, setLocalLikes] = useState(post.likes);
  const [showHeart, setShowHeart] = useState(false);
  const lastTap = useRef(0);

  const isBlurred = post.isAI &&
    aiContentSetting === 'blur' &&
    !revealedAIPosts.includes(post.id);

  const isHidden = post.isAI && aiContentSetting === 'hide';

  if (isHidden) return null;

  const handleLike = () => {
    toggleLike(post.id);
    setLocalLikes((l) => (liked ? l - 1 : l + 1));
  };

  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!liked) {
        toggleLike(post.id);
        setLocalLikes((l) => l + 1);
      }
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    lastTap.current = now;
  }, [liked, post.id, toggleLike]);

  return (
    <article className="bg-paper rounded-2xl overflow-hidden mb-3 shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar emoji={post.avatarEmoji} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-dark truncate">{post.username}</span>
            {post.isAI ? <AIBadge /> : <HumanBadge />}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-brown/60 mt-0.5">
            <span>{post.timestamp}</span>
            {post.location && (
              <>
                <span>·</span>
                <span className="truncate">{post.location}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="relative aspect-square film-overlay vignette film-grain" onClick={handleDoubleTap}>
        <div
          className="w-full h-full"
          style={{ backgroundColor: post.imageColor }}
        />
        {showHeart && (
          <div className="heart-burst">
            <Heart size={80} className="fill-white text-white drop-shadow-lg" />
          </div>
        )}
        {isBlurred && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-[16px] bg-ai-yellow-bg/40">
            <div className="text-center px-6">
              <div className="text-3xl mb-2">🤖</div>
              <p className="text-sm font-medium text-dark mb-1">
                This content was AI generated
              </p>
              <p className="text-xs text-brown/70 mb-4">
                and is not recommended
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); revealAIPost(post.id); }}
                className="bg-dark/80 text-cream text-sm font-medium px-5 py-2.5 rounded-full active:bg-dark transition-colors"
              >
                Show anyway
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-1 mb-2">
          <button onClick={handleLike} className="p-2 -ml-2 transition-transform active:scale-125 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Heart
              size={26}
              strokeWidth={1.8}
              className={`transition-colors ${liked ? 'fill-red text-red' : 'text-dark'}`}
            />
          </button>
          <button className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <MessageCircle size={26} strokeWidth={1.8} className="text-dark" />
          </button>
          <button className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Send size={26} strokeWidth={1.8} className="text-dark" />
          </button>
        </div>
        <p className="text-sm font-semibold text-dark">{localLikes.toLocaleString()} likes</p>
        <p className="text-sm text-dark mt-1 leading-relaxed">
          <span className="font-semibold">{post.username}</span>{' '}
          {post.caption}
        </p>
        {post.comments.length > 0 && (
          <button className="text-xs text-brown/50 mt-1.5 mb-1 py-1">
            View all {post.comments.length} comments
          </button>
        )}
      </div>
    </article>
  );
}
