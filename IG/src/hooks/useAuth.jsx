import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  users: 'momento_users',
  currentSession: 'momento_session',
};

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.users)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.currentSession));
  } catch {
    return null;
  }
}

function saveSession(session) {
  if (session) {
    localStorage.setItem(STORAGE_KEYS.currentSession, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEYS.currentSession);
  }
}

/**
 * Verification statuses:
 * - 'none'     : just registered, hasn't submitted ID
 * - 'pending'  : ID submitted, awaiting review
 * - 'approved' : verified, can log in
 * - 'denied'   : verification failed, can re-submit
 */

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession());

  const user = useMemo(() => {
    if (!session) return null;
    const users = getStoredUsers();
    return users.find((u) => u.id === session.userId) || null;
  }, [session]);

  const isAuthenticated = !!user && user.verificationStatus === 'approved';

  const register = useCallback(({ username, email, password, displayName }) => {
    const users = getStoredUsers();

    if (users.some((u) => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    if (users.some((u) => u.username === username)) {
      return { success: false, error: 'Username already taken' };
    }

    const newUser = {
      id: crypto.randomUUID(),
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

    saveUsers([...users, newUser]);
    const newSession = { userId: newUser.id, loggedInAt: new Date().toISOString() };
    saveSession(newSession);
    setSession(newSession);

    return { success: true, user: newUser };
  }, []);

  const submitVerification = useCallback((verificationData) => {
    if (!session) return { success: false, error: 'Not logged in' };

    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === session.userId);
    if (idx === -1) return { success: false, error: 'User not found' };

    users[idx] = {
      ...users[idx],
      verificationStatus: 'pending',
      idVerification: {
        ...verificationData,
        submittedAt: new Date().toISOString(),
      },
    };
    saveUsers(users);
    setSession({ ...session });

    return { success: true };
  }, [session]);

  const approveVerification = useCallback((userId) => {
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return;

    users[idx] = {
      ...users[idx],
      verificationStatus: 'approved',
      isHumanVerified: true,
    };
    saveUsers(users);
    if (session?.userId === userId) {
      setSession({ ...session });
    }
  }, [session]);

  const denyVerification = useCallback((userId) => {
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return;

    users[idx] = {
      ...users[idx],
      verificationStatus: 'denied',
      isHumanVerified: false,
    };
    saveUsers(users);
    if (session?.userId === userId) {
      setSession({ ...session });
    }
  }, [session]);

  const login = useCallback(({ email, password }) => {
    const users = getStoredUsers();
    const found = users.find((u) => u.email === email && u.password === password);

    if (!found) {
      return { success: false, error: 'Invalid email or password' };
    }
    if (found.verificationStatus !== 'approved') {
      const statusMessages = {
        none: 'Please complete ID verification first',
        pending: 'Your verification is still under review',
        denied: 'Your verification was denied. Please re-submit.',
      };
      return {
        success: false,
        error: statusMessages[found.verificationStatus],
        verificationStatus: found.verificationStatus,
        userId: found.id,
      };
    }

    const newSession = { userId: found.id, loggedInAt: new Date().toISOString() };
    saveSession(newSession);
    setSession(newSession);
    return { success: true, user: found };
  }, []);

  const logout = useCallback(() => {
    saveSession(null);
    setSession(null);
  }, []);

  const refreshUser = useCallback(() => {
    if (session) setSession({ ...session });
  }, [session]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      session,
      register,
      submitVerification,
      approveVerification,
      denyVerification,
      login,
      logout,
      refreshUser,
    }),
    [user, isAuthenticated, session, register, submitVerification,
     approveVerification, denyVerification, login, logout, refreshUser],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
