import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        }
      } catch {
        // keep initial value
      }
      setLoaded(true);
    })();
  }, [key]);

  const setValue = useCallback(
    (value) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      AsyncStorage.setItem(key, JSON.stringify(valueToStore)).catch(() => {});
    },
    [key, storedValue],
  );

  return [storedValue, setValue, loaded];
}
