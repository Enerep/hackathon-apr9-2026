import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

const Ctx = createContext(null);

export function AppStateProvider({ children }) {
  const [likedPosts, setLikedPosts] = useLocalStorage('ig_liked', []);
  const [revealedAIPosts, setRevealedAIPosts] = useLocalStorage('ig_revealedAI', []);
  const [reelMinutesWatched, setReelMinutesWatched] = useLocalStorage('ig_reelMin', 6);
  const [timeSpentToday, setTimeSpentToday] = useLocalStorage('ig_time', 18);
  const [scrollReminderEnabled, setScrollReminderEnabled] = useLocalStorage('ig_scrollRemind', true);
  const [scrollReminderInterval, setScrollReminderInterval] = useLocalStorage('ig_scrollInt', 20);
  const [aiContentSetting, setAiContentSetting] = useLocalStorage('ig_ai', 'blur');
  const [dailyReelLimit, setDailyReelLimit] = useLocalStorage('ig_reelLimit', 10);
  const [postsLikedToday, setPostsLikedToday] = useLocalStorage('ig_likesToday', 12);

  const toggleLike = (postId) => {
    setLikedPosts((prev) => {
      if (prev.includes(postId)) return prev.filter((id) => id !== postId);
      setPostsLikedToday((c) => c + 1);
      return [...prev, postId];
    });
  };
  const revealAIPost = (postId) => {
    setRevealedAIPosts((prev) => prev.includes(postId) ? prev : [...prev, postId]);
  };

  const value = useMemo(() => ({
    likedPosts, toggleLike, revealedAIPosts, revealAIPost,
    reelMinutesWatched, setReelMinutesWatched, timeSpentToday, setTimeSpentToday,
    scrollReminderEnabled, setScrollReminderEnabled, scrollReminderInterval, setScrollReminderInterval,
    aiContentSetting, setAiContentSetting, dailyReelLimit, setDailyReelLimit, postsLikedToday,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [likedPosts, revealedAIPosts, reelMinutesWatched, timeSpentToday, scrollReminderEnabled, scrollReminderInterval, aiContentSetting, dailyReelLimit, postsLikedToday]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be inside AppStateProvider');
  return ctx;
}
