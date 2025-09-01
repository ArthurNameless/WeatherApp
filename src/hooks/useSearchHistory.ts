import { useState, useEffect, useCallback } from 'react';
import type { SearchHistoryItem, WeatherResponse } from '@Types/weather';
import { getSearchHistory, getRemovedItems, addToSearchHistory, removeFromSearchHistory, clearSearchHistory, clearRemovedItems, restoreFromRemoved } from '@Utils/localStorage';

interface UseSearchHistoryReturn {
  searchHistory: SearchHistoryItem[];
  removedItems: SearchHistoryItem[];
  addToHistory: (cityName: string, country: string, region?: string, weatherData?: WeatherResponse) => void;
  removeFromHistory: (itemId: string) => void;
  restoreItem: (itemId: string) => void;
  clearHistory: () => void;
  getHistoryItem: (cityName: string) => SearchHistoryItem | undefined;
}

export function useSearchHistory(): UseSearchHistoryReturn {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [removedItems, setRemovedItems] = useState<SearchHistoryItem[]>([]);

  // Load initial data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const history = getSearchHistory();
        const removed = getRemovedItems();

        setSearchHistory(history);
        setRemovedItems(removed);
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    };

    loadData();
  }, []);

  const addToHistory = useCallback((
    cityName: string,
    country: string,
    region: string = '',
    weatherData?: WeatherResponse
  ) => {
    if (!cityName.trim()) {
      return;
    }

    const newItem: SearchHistoryItem = {
      id: generateId(),
      cityName: cityName.trim(),
      country: country.trim(),
      region: region.trim(),
      searchDate: new Date(),
      weatherData
    };

    try {
      addToSearchHistory(newItem);
      const updatedHistory = getSearchHistory();
      setSearchHistory(updatedHistory);
    } catch (error) {
      console.error('Error adding to search history:', error);
    }
  }, []);

  const removeFromHistory = useCallback((itemId: string) => {
    try {
      const removedItem = removeFromSearchHistory(itemId);

      if (removedItem) {
        const updatedHistory = getSearchHistory();
        const updatedRemoved = getRemovedItems();

        setSearchHistory(updatedHistory);
        setRemovedItems(updatedRemoved);
      }
    } catch (error) {
      console.error('Error removing from search history:', error);
    }
  }, []);

  const restoreItem = useCallback((itemId: string) => {
    try {
      const restored = restoreFromRemoved(itemId);

      if (restored) {
        const updatedHistory = getSearchHistory();
        const updatedRemoved = getRemovedItems();

        setSearchHistory(updatedHistory);
        setRemovedItems(updatedRemoved);
      }
    } catch (error) {
      console.error('Error restoring item:', error);
    }
  }, []);

  const clearHistory = useCallback(() => {
    try {
      clearSearchHistory();
      clearRemovedItems();

      setSearchHistory([]);
      setRemovedItems([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }, []);

  const getHistoryItem = useCallback((cityName: string): SearchHistoryItem | undefined => {
    return searchHistory.find(
      item => item.cityName.toLowerCase() === cityName.toLowerCase()
    );
  }, [searchHistory]);

  return {
    searchHistory,
    removedItems,
    addToHistory,
    removeFromHistory,
    restoreItem,
    clearHistory,
    getHistoryItem
  };
}

// Note: We need to install uuid for unique IDs
// For now, let's create a simple ID generator as a fallback
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
