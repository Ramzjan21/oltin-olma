import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Axios default config - credentials o'chirilgan
axios.defaults.withCredentials = false;

interface User {
  id: number;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  balance: number;
  isAdmin: boolean;
}

interface Tree {
  id: number;
  level: number;
  status: 'active' | 'dead' | 'completed';
  appleCount: number;
  daysCollected: number;
  weekStartDate: string;
  lastCollectionTime?: string;
  nextCollectionTime?: string;
  canCollect: boolean;
  canClaimReward: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (telegramData: any) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  error: null,

  setToken: (token: string) => {
    localStorage.setItem('token', token);
    set({ token });
  },

  login: async (telegramData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/telegram-auth`, telegramData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ token, user, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Kirish xatosi', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  fetchUser: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data.user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      get().logout();
    }
  },
}));

interface TreeState {
  tree: Tree | null;
  isLoading: boolean;
  error: string | null;
  fetchTree: () => Promise<void>;
  purchaseTree: (paymentData: any) => Promise<void>;
  collectApple: () => Promise<void>;
  claimReward: () => Promise<{ amount: number; newBalance: number }>;
}

export const useTreeStore = create<TreeState>((set, get) => ({
  tree: null,
  isLoading: false,
  error: null,

  fetchTree: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/tree/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ tree: response.data.tree, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Xato', 
        isLoading: false 
      });
    }
  },

  purchaseTree: async (paymentData: any) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/tree/purchase`, paymentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ tree: response.data.tree, isLoading: false });
      
      // Balansni yangilash
      await useAuthStore.getState().fetchUser();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Sotib olish xatosi', 
        isLoading: false 
      });
      throw error;
    }
  },

  collectApple: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/tree/collect`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Daraxtni yangilash
      await get().fetchTree();
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Yig\'ish xatosi', 
        isLoading: false 
      });
      throw error;
    }
  },

  claimReward: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/tree/claim-reward`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Daraxt va foydalanuvchini yangilash
      await get().fetchTree();
      await useAuthStore.getState().fetchUser();
      
      set({ isLoading: false });
      return response.data.reward;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Mukofot olish xatosi', 
        isLoading: false 
      });
      throw error;
    }
  },
}));
