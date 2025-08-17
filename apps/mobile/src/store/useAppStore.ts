import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  points: number;
}

interface AnalysisResult {
  id: string;
  imageUrl: string;
  score: number;
  feedback: string;
  createdAt: Date;
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Analysis state
  recentAnalyses: AnalysisResult[];
  currentAnalysis: AnalysisResult | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  
  addAnalysis: (analysis: AnalysisResult) => void;
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  recentAnalyses: [],
  currentAnalysis: null,
  isLoading: false,
  error: null,
  
  // User actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement actual API call
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email,
        level: 1,
        points: 0,
      };
      set({ user: mockUser, isAuthenticated: true });
    } catch (error) {
      set({ error: 'Login failed' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false,
    recentAnalyses: [],
    currentAnalysis: null 
  }),
  
  // Analysis actions
  addAnalysis: (analysis) => set((state) => ({
    recentAnalyses: [analysis, ...state.recentAnalyses].slice(0, 10)
  })),
  
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  
  // UI actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));