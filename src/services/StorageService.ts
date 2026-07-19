export interface IStorageService {
  getItem<T>(key: string, defaultValue: T): T;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
}

class LocalStorageService implements IStorageService {
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return defaultValue;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing localStorage key "${key}":`, e);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing localStorage key "${key}":`, e);
    }
  }
}

export const StorageService = new LocalStorageService();
export default StorageService;
