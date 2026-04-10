import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  users: 'momento_users',
  currentSession: 'momento_session',
};

const DEMO_USER = {
  id: 'demo-user',
  username: 'demo_user',
  email: 'demo_user@momento.app',
  password: 'demo123',
  displayName: 'Demo User',
  avatarEmoji: '🎞️',
  bio: 'Preview account for the app demo.',
  followers: 24,
  following: 18,
  postsCount: 3,
  isHumanVerified: true,
  verificationStatus: 'approved',
  idVerification: { submittedAt: '2026-04-10T00:00:00.000Z' },
  createdAt: '2026-04-10T00:00:00.000Z',
};

function ensureDemoUser(users) {
  return users.some((u) => u.id === DEMO_USER.id) ? users : [DEMO_USER, ...users];
}

async function getStoredUsers() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.users);
    return ensureDemoUser(raw ? JSON.parse(raw) : []);
  } catch {
    return [DEMO_USER];
  }
}

async function saveUsers(users) {
  await AsyncStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

async function getSession() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.currentSession);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function saveSession(session) {
  if (session) {
    await AsyncStorage.setItem(STORAGE_KEYS.currentSession, JSON.stringify(session));
  } else {
    await AsyncStorage.removeItem(STORAGE_KEYS.currentSession);
  }
}

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [users, setUsers] = useState([DEMO_USER]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const [storedUsers, storedSession] = await Promise.all([
        getStoredUsers(),
        getSession(),
      ]);
      setUsers(storedUsers);
      setSession(storedSession);
      setReady(true);
    })();
  }, []);

  const user = useMemo(() => {
    if (!session) return null;
    return users.find((u) => u.id === session.userId) || null;
  }, [session, users]);

  const isAuthenticated = !!user && user.verificationStatus === 'approved';

  const register = useCallback(
    async ({ username, email, password, displayName }) => {
      const currentUsers = await getStoredUsers();

      if (currentUsers.some((u) => u.email === email)) {
        return { success: false, error: 'Email already registered' };
      }
      if (currentUsers.some((u) => u.username === username)) {
        return { success: false, error: 'Username already taken' };
      }

      const newUser = {
        id: generateId(),
        username,
        email,
        password,
        displayName,
        avatarEmoji: '🎞️',
        bio: '',
        followers: 0,
        following: 0,
        postsCount: 0,
        isHumanVerified: false,
        verificationStatus: 'none',
        idVerification: null,
        createdAt: new Date().toISOString(),
      };

      const updated = [...currentUsers, newUser];
      await saveUsers(updated);
      setUsers(updated);

      const newSession = { userId: newUser.id, loggedInAt: new Date().toISOString() };
      await saveSession(newSession);
      setSession(newSession);

      return { success: true, user: newUser };
    },
    [],
  );

  const submitVerification = useCallback(
    async (verificationData) => {
      if (!session) return { success: false, error: 'Not logged in' };

      const currentUsers = await getStoredUsers();
      const idx = currentUsers.findIndex((u) => u.id === session.userId);
      if (idx === -1) return { success: false, error: 'User not found' };

      currentUsers[idx] = {
        ...currentUsers[idx],
        verificationStatus: 'pending',
        idVerification: {
          ...verificationData,
          submittedAt: new Date().toISOString(),
        },
      };
      await saveUsers(currentUsers);
      setUsers([...currentUsers]);
      setSession({ ...session });

      return { success: true };
    },
    [session],
  );

  const approveVerification = useCallback(
    async (userId) => {
      const currentUsers = await getStoredUsers();
      const idx = currentUsers.findIndex((u) => u.id === userId);
      if (idx === -1) return;

      currentUsers[idx] = {
        ...currentUsers[idx],
        verificationStatus: 'approved',
        isHumanVerified: true,
      };
      await saveUsers(currentUsers);
      setUsers([...currentUsers]);
      if (session?.userId === userId) {
        setSession({ ...session });
      }
    },
    [session],
  );

  const denyVerification = useCallback(
    async (userId) => {
      const currentUsers = await getStoredUsers();
      const idx = currentUsers.findIndex((u) => u.id === userId);
      if (idx === -1) return;

      currentUsers[idx] = {
        ...currentUsers[idx],
        verificationStatus: 'denied',
        isHumanVerified: false,
      };
      await saveUsers(currentUsers);
      setUsers([...currentUsers]);
      if (session?.userId === userId) {
        setSession({ ...session });
      }
    },
    [session],
  );

  const login = useCallback(async ({ identifier, password }) => {
    const currentUsers = await getStoredUsers();
    const normalized = identifier.toLowerCase().trim();
    const found = currentUsers.find(
      (u) =>
        (u.email === normalized || u.username === normalized) &&
        u.password === password,
    );

    if (!found) {
      return { success: false, error: 'Invalid username, email, or password' };
    }
    if (found.verificationStatus !== 'approved') {
      const msgs = {
        none: 'Please complete ID verification first',
        pending: 'Your verification is still under review',
        denied: 'Your verification was denied. Please re-submit.',
      };
      return {
        success: false,
        error: msgs[found.verificationStatus],
        verificationStatus: found.verificationStatus,
        userId: found.id,
      };
    }

    const newSession = { userId: found.id, loggedInAt: new Date().toISOString() };
    await saveSession(newSession);
    setSession(newSession);
    return { success: true, user: found };
  }, []);

  const logout = useCallback(async () => {
    await saveSession(null);
    setSession(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const currentUsers = await getStoredUsers();
    setUsers(currentUsers);
    if (session) setSession({ ...session });
  }, [session]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      session,
      ready,
      register,
      submitVerification,
      approveVerification,
      denyVerification,
      login,
      logout,
      refreshUser,
    }),
    [user, isAuthenticated, session, ready, register, submitVerification,
     approveVerification, denyVerification, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
