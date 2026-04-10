import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [likedPosts, setLikedPosts] = useLocalStorage('momento_likedPosts', []);
  const [revealedAIPosts, setRevealedAIPosts] = useLocalStorage('momento_revealedAI', []);
  const [reelMinutesWatched, setReelMinutesWatched] = useLocalStorage('momento_reelMinutes', 0);
  const [timeSpentToday, setTimeSpentToday] = useLocalStorage('momento_timeSpent', 18);
  const [scrollReminderEnabled, setScrollReminderEnabled] = useLocalStorage('momento_scrollReminder', true);
  const [scrollReminderInterval, setScrollReminderInterval] = useLocalStorage('momento_scrollInterval', 20);
  const [aiContentSetting, setAiContentSetting] = useLocalStorage('momento_aiContent', 'blur');
  const [dailyReelLimit, setDailyReelLimit] = useLocalStorage('momento_reelLimit', 10);
  const [postsLikedToday, setPostsLikedToday] = useLocalStorage('momento_postsLikedToday', 12);

  const toggleLike = (postId) => {
    setLikedPosts((prev) => {
      if (prev.includes(postId)) return prev.filter((id) => id !== postId);
      setPostsLikedToday((c) => c + 1);
      return [...prev, postId];
    });
  };

  const revealAIPost = (postId) => {
    setRevealedAIPosts((prev) =>
      prev.includes(postId) ? prev : [...prev, postId],
    );
  };

  const value = useMemo(
    () => ({
      likedPosts, toggleLike,
      revealedAIPosts, revealAIPost,
      reelMinutesWatched, setReelMinutesWatched,
      timeSpentToday, setTimeSpentToday,
      scrollReminderEnabled, setScrollReminderEnabled,
      scrollReminderInterval, setScrollReminderInterval,
      aiContentSetting, setAiContentSetting,
      dailyReelLimit, setDailyReelLimit,
      postsLikedToday,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [likedPosts, revealedAIPosts, reelMinutesWatched, timeSpentToday,
     scrollReminderEnabled, scrollReminderInterval, aiContentSetting, dailyReelLimit, postsLikedToday],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
