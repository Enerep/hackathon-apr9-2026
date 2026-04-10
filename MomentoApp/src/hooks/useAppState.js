import { createContext, useContext, useMemo } from 'react';
import { useStorage } from './useStorage';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [likedPosts, setLikedPosts] = useStorage('momento_likedPosts', []);
  const [revealedAIPosts, setRevealedAIPosts] = useStorage('momento_revealedAI', []);
  const [timeSpentToday, setTimeSpentToday] = useStorage('momento_timeSpent', 18);
  const [scrollReminderEnabled, setScrollReminderEnabled] = useStorage('momento_scrollReminder', true);
  const [scrollReminderInterval, setScrollReminderInterval] = useStorage('momento_scrollInterval', 20);
  const [aiContentSetting, setAiContentSetting] = useStorage('momento_aiContent', 'blur');
  const [postsLikedToday, setPostsLikedToday] = useStorage('momento_postsLikedToday', 12);

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
      likedPosts,
      toggleLike,
      revealedAIPosts,
      revealAIPost,
      timeSpentToday,
      setTimeSpentToday,
      scrollReminderEnabled,
      setScrollReminderEnabled,
      scrollReminderInterval,
      setScrollReminderInterval,
      aiContentSetting,
      setAiContentSetting,
      postsLikedToday,
    }),
    [likedPosts, revealedAIPosts, timeSpentToday,
     scrollReminderEnabled, scrollReminderInterval, aiContentSetting, postsLikedToday],
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
