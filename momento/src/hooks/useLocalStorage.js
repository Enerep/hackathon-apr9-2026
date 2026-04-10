import { useState, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try { const item = window.localStorage.getItem(key); return item ? JSON.parse(item) : initialValue; }
    catch { return initialValue; }
  });
  const setValue = useCallback((value) => {
    const v = value instanceof Function ? value(storedValue) : value;
    setStoredValue(v);
    try { window.localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key, storedValue]);
  return [storedValue, setValue];
}
