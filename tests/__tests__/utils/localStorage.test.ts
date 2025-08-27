import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocalStorageService } from '../../../src/utils/localStorage';
import type { SearchHistoryItem } from '../../../src/types/weather';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('LocalStorageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isLocalStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(LocalStorageService.isLocalStorageAvailable()).toBe(true);
    });

    it('should return false when localStorage throws error', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('localStorage not available');
      });

      expect(LocalStorageService.isLocalStorageAvailable()).toBe(false);
    });
  });

  describe('safeGetItem', () => {
    it('should return parsed data when item exists', () => {
      const testData = { test: 'value' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(testData));

      const result = LocalStorageService.safeGetItem('test-key', {});
      expect(result).toEqual(testData);
    });

    it('should return default value when item does not exist', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const defaultValue = { default: true };
      const result = LocalStorageService.safeGetItem('test-key', defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it('should return default value when JSON parsing fails', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      const defaultValue = { default: true };
      const result = LocalStorageService.safeGetItem('test-key', defaultValue);
      expect(result).toEqual(defaultValue);
    });
  });

  describe('safeSetItem', () => {
    it('should successfully set item and return true', () => {
      const testData = { test: 'value' };

      const result = LocalStorageService.safeSetItem('test-key', testData);
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testData));
    });

    it('should return false when setItem throws error', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage quota exceeded');
      });

      const result = LocalStorageService.safeSetItem('test-key', { test: 'value' });
      expect(result).toBe(false);
    });
  });

  describe('search history management', () => {
    const mockSearchItem: SearchHistoryItem = {
      id: 'test-id',
      cityName: 'London',
      country: 'GB',
      region: 'Greater London',
      searchDate: new Date('2023-01-01'),
      weatherData: undefined
    };

    it('should add item to search history', () => {
      localStorageMock.getItem.mockReturnValue('[]');

      LocalStorageService.addToSearchHistory(mockSearchItem);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'weather-app-search-history',
        JSON.stringify([mockSearchItem])
      );
    });

    it('should get search history and convert dates', () => {
      const historyData = [
        {
          ...mockSearchItem,
          searchDate: '2023-01-01T00:00:00.000Z'
        }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(historyData));

      const result = LocalStorageService.getSearchHistory();

      expect(result).toHaveLength(1);
      expect(result[0].searchDate).toBeInstanceOf(Date);
    });

    it('should remove duplicate city entries when adding to history', () => {
      const existingHistory = [
        { ...mockSearchItem, id: 'old-id', searchDate: new Date('2022-01-01') }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingHistory));

      const newItem = { ...mockSearchItem, id: 'new-id', searchDate: new Date('2023-01-01') };
      LocalStorageService.addToSearchHistory(newItem);

      // Should have only the new item, old one removed
      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0].id).toBe('new-id');
    });

    it('should remove item from history and add to removed items', () => {
      const historyData = [mockSearchItem];
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(historyData)) // getSearchHistory call
        .mockReturnValueOnce('[]'); // getRemovedItems call

      const result = LocalStorageService.removeFromSearchHistory('test-id');

      expect(result).toEqual(mockSearchItem);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'weather-app-search-history',
        '[]'
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'weather-app-removed-items',
        JSON.stringify([mockSearchItem])
      );
    });

    it('should restore item from removed items to history', () => {
      const removedItems = [mockSearchItem];
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(removedItems)) // getRemovedItems call
        .mockReturnValueOnce('[]'); // getSearchHistory call

      const result = LocalStorageService.restoreFromRemoved('test-id');

      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'weather-app-removed-items',
        '[]'
      );
    });

    it('should return false when trying to restore non-existent item', () => {
      localStorageMock.getItem.mockReturnValue('[]');

      const result = LocalStorageService.restoreFromRemoved('non-existent-id');

      expect(result).toBe(false);
    });

    it('should limit history to maximum items', () => {
      // Create 15 items (more than MAX_HISTORY_ITEMS which is 10)
      const manyItems = Array.from({ length: 15 }, (_, i) => ({
        ...mockSearchItem,
        id: `item-${i}`,
        cityName: `City${i}`
      }));
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(manyItems));

      LocalStorageService.addToSearchHistory({
        ...mockSearchItem,
        id: 'new-item',
        cityName: 'NewCity'
      });

      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(10); // Should be limited to 10 items
      expect(savedData[0].cityName).toBe('NewCity'); // New item should be first
    });
  });
});
