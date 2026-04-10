import { useState, useRef, useCallback } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import Avatar from './Avatar';
import { HumanBadge, AIBadge } from './Badge';

export default function PostCard({ post }) {
  const { likedPosts, toggleLike, aiContentSetting, revealedAIPosts, revealAIPost } = useAppState();
  const liked = likedPosts.includes(post.id);
  const [showHeart, setShowHeart] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const lastTap = useRef(0);
  const canReport = !post.isAI && post.isHumanVerified;

  const isBlurred = post.isAI &&
    aiContentSetting === 'blur' &&
    !revealedAIPosts.includes(post.id);

  const isHidden = post.isAI && aiContentSetting === 'hide';

  if (isHidden) return null;

  const handleLike = () => {
    toggleLike(post.id);
  };

  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!liked) {
        toggleLike(post.id);
      }
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    lastTap.current = now;
  }, [liked, post.id, toggleLike]);

  const handleReport = () => {
    setShowReportModal(false);
    setIsReported(true);
  };

  return (
    <>
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
          {canReport && (
            <button
              type="button"
              aria-label="Report post"
              onClick={() => setShowReportModal(true)}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-brown/70 active:bg-dark/5 transition-colors"
            >
              <MoreHorizontal size={20} strokeWidth={2} />
            </button>
          )}
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
          {isReported && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-dark/60 backdrop-blur-[10px]">
              <div className="text-center px-6">
                <p className="text-sm font-medium text-cream mb-1">
                  You have reported this post.
                </p>
                <p className="text-xs text-cream/80">
                  We will review this post.
                </p>
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
          <p className="text-sm font-semibold text-dark">
            {liked
              ? `You and your mutual friend ${post.mutualLikeName} liked this post`
              : `Your mutual friend ${post.mutualLikeName} liked this post`}
          </p>
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

      {showReportModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-dark/45 px-6" onClick={() => setShowReportModal(false)}>
          <div
            className="w-full max-w-[320px] rounded-3xl bg-cream p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base font-semibold text-dark">Report post</p>
            <p className="mt-1 text-sm text-brown/75">
              Why are you reporting this post?
            </p>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={handleReport}
                className="w-full rounded-2xl bg-paper px-4 py-3 text-left text-sm font-medium text-dark active:bg-tan/40 transition-colors"
              >
                Inappropriate content
              </button>
              <button
                type="button"
                onClick={handleReport}
                className="w-full rounded-2xl bg-paper px-4 py-3 text-left text-sm font-medium text-dark active:bg-tan/40 transition-colors"
              >
                AI-generated
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowReportModal(false)}
              className="mt-4 w-full rounded-2xl border border-brown/15 px-4 py-3 text-sm font-medium text-brown/80 active:bg-dark/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
