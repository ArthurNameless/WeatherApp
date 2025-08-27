import type { SearchHistoryItem } from '../types/weather';

const STORAGE_KEYS = {
  SEARCH_HISTORY: 'weather-app-search-history',
  REMOVED_ITEMS: 'weather-app-removed-items'
} as const;

const MAX_HISTORY_ITEMS = 10;
const MAX_REMOVED_ITEMS = 5;

export class LocalStorageService {
  static isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  static safeGetItem<T>(key: string, defaultValue: T): T {
    if (!this.isLocalStorageAvailable()) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error parsing localStorage item ${key}:`, error);
      return defaultValue;
    }
  }

  static safeSetItem<T>(key: string, value: T): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error);
      return false;
    }
  }

  static safeRemoveItem(key: string): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage item ${key}:`, error);
      return false;
    }
  }

  static getSearchHistory(): SearchHistoryItem[] {
    const history = this.safeGetItem<SearchHistoryItem[]>(
      STORAGE_KEYS.SEARCH_HISTORY,
      []
    );
    
    // Convert date strings back to Date objects
    return history.map(item => ({
      ...item,
      searchDate: new Date(item.searchDate)
    }));
  }

  static addToSearchHistory(item: SearchHistoryItem): void {
    const currentHistory = this.getSearchHistory();
    
    // Remove existing entry for the same city (if any)
    const filteredHistory = currentHistory.filter(
      historyItem => historyItem.cityName.toLowerCase() !== item.cityName.toLowerCase()
    );
    
    // Add new item at the beginning
    const updatedHistory = [item, ...filteredHistory];
    
    // Keep only the most recent items
    const limitedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
    
    this.safeSetItem(STORAGE_KEYS.SEARCH_HISTORY, limitedHistory);
  }

  static removeFromSearchHistory(itemId: string): SearchHistoryItem | null {
    const currentHistory = this.getSearchHistory();
    const itemToRemove = currentHistory.find(item => item.id === itemId);
    
    if (!itemToRemove) {
      return null;
    }
    
    // Remove the item from history
    const updatedHistory = currentHistory.filter(item => item.id !== itemId);
    this.safeSetItem(STORAGE_KEYS.SEARCH_HISTORY, updatedHistory);
    
    // Add to removed items for undo functionality
    this.addToRemovedItems(itemToRemove);
    
    return itemToRemove;
  }

  static clearSearchHistory(): void {
    this.safeRemoveItem(STORAGE_KEYS.SEARCH_HISTORY);
  }

  static getRemovedItems(): SearchHistoryItem[] {
    const removedItems = this.safeGetItem<SearchHistoryItem[]>(
      STORAGE_KEYS.REMOVED_ITEMS,
      []
    );
    
    // Convert date strings back to Date objects
    return removedItems.map(item => ({
      ...item,
      searchDate: new Date(item.searchDate)
    }));
  }

  static addToRemovedItems(item: SearchHistoryItem): void {
    const currentRemovedItems = this.getRemovedItems();
    const updatedRemovedItems = [item, ...currentRemovedItems];
    
    // Keep only the most recent removed items
    const limitedRemovedItems = updatedRemovedItems.slice(0, MAX_REMOVED_ITEMS);
    
    this.safeSetItem(STORAGE_KEYS.REMOVED_ITEMS, limitedRemovedItems);
  }

  static restoreFromRemoved(itemId: string): boolean {
    const removedItems = this.getRemovedItems();
    const itemToRestore = removedItems.find(item => item.id === itemId);
    
    if (!itemToRestore) {
      return false;
    }
    
    // Remove from removed items
    const updatedRemovedItems = removedItems.filter(item => item.id !== itemId);
    this.safeSetItem(STORAGE_KEYS.REMOVED_ITEMS, updatedRemovedItems);
    
    // Add back to search history
    this.addToSearchHistory(itemToRestore);
    
    return true;
  }

  static clearRemovedItems(): void {
    this.safeRemoveItem(STORAGE_KEYS.REMOVED_ITEMS);
  }
}
