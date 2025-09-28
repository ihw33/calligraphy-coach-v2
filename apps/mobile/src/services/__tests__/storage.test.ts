import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage for testing
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve('test-value')),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('AsyncStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to store and retrieve data', async () => {
    const mockSetItem = AsyncStorage.setItem as jest.Mock;
    const mockGetItem = AsyncStorage.getItem as jest.Mock;

    await AsyncStorage.setItem('test-key', 'test-value');
    const result = await AsyncStorage.getItem('test-key');

    expect(mockSetItem).toHaveBeenCalledWith('test-key', 'test-value');
    expect(mockGetItem).toHaveBeenCalledWith('test-key');
    expect(result).toBe('test-value');
  });
});