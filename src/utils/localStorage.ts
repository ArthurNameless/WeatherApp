import type { SearchHistoryItem } from '../types/weather';

const STORAGE_KEYS = {
  SEARCH_HISTORY: 'weather-app-search-history',
  REMOVED_ITEMS: 'weather-app-removed-items'
} as const;

const MAX_HISTORY_ITEMS = 10;
const MAX_REMOVED_ITEMS = 5;

export const safeGetItem = <T>(key: string, defaultValue: T): T => {
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
};

export const safeSetItem = <T>(key: string, value: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error);
    return false;
  }
};

export const safeRemoveItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage item ${key}:`, error);
    return false;
  }
};

export const getSearchHistory = (): SearchHistoryItem[] => {
  const history = safeGetItem<SearchHistoryItem[]>(
    STORAGE_KEYS.SEARCH_HISTORY,
    []
  );
  
  // Convert date strings back to Date objects
  return history.map(item => ({
    ...item,
    searchDate: new Date(item.searchDate)
  }));
};

export const addToSearchHistory = (item: SearchHistoryItem): void => {
  const currentHistory = getSearchHistory();
  
  // Remove existing entry for the same city (if any)
  const filteredHistory = currentHistory.filter(
    historyItem => historyItem.cityName.toLowerCase() !== item.cityName.toLowerCase()
  );
  
  // Add new item at the beginning
  const updatedHistory = [item, ...filteredHistory];
  
  // Keep only the most recent items
  const limitedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
  
  safeSetItem(STORAGE_KEYS.SEARCH_HISTORY, limitedHistory);
};

export const removeFromSearchHistory = (itemId: string): SearchHistoryItem | null => {
  const currentHistory = getSearchHistory();
  const itemToRemove = currentHistory.find(item => item.id === itemId);
  
  if (!itemToRemove) {
    return null;
  }
  
  // Remove the item from history
  const updatedHistory = currentHistory.filter(item => item.id !== itemId);
  safeSetItem(STORAGE_KEYS.SEARCH_HISTORY, updatedHistory);
  
  // Add to removed items for undo functionality
  addToRemovedItems(itemToRemove);
  
  return itemToRemove;
};

export const clearSearchHistory = (): void => {
  safeRemoveItem(STORAGE_KEYS.SEARCH_HISTORY);
};

export const getRemovedItems = (): SearchHistoryItem[] => {
  const removedItems = safeGetItem<SearchHistoryItem[]>(
    STORAGE_KEYS.REMOVED_ITEMS,
    []
  );
  
  // Convert date strings back to Date objects
  return removedItems.map(item => ({
    ...item,
    searchDate: new Date(item.searchDate)
  }));
};

export const addToRemovedItems = (item: SearchHistoryItem): void => {
  const currentRemovedItems = getRemovedItems();
  const updatedRemovedItems = [item, ...currentRemovedItems];
  
  // Keep only the most recent removed items
  const limitedRemovedItems = updatedRemovedItems.slice(0, MAX_REMOVED_ITEMS);
  
  safeSetItem(STORAGE_KEYS.REMOVED_ITEMS, limitedRemovedItems);
};

export const restoreFromRemoved = (itemId: string): boolean => {
  const removedItems = getRemovedItems();
  const itemToRestore = removedItems.find(item => item.id === itemId);
  
  if (!itemToRestore) {
    return false;
  }
  
  // Remove from removed items
  const updatedRemovedItems = removedItems.filter(item => item.id !== itemId);
  safeSetItem(STORAGE_KEYS.REMOVED_ITEMS, updatedRemovedItems);
  
  // Add back to search history
  addToSearchHistory(itemToRestore);
  
  return true;
};

export const clearRemovedItems = (): void => {
  safeRemoveItem(STORAGE_KEYS.REMOVED_ITEMS);
};
