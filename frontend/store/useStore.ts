import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── localStorage yordamchi funksiyalar ───────────────────────────────────────
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

const clearStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// ─── Axios instance ────────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
});

// Har bir so'rovga token avtomatik qo'shiladi
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Interfacelar ──────────────────────────────────────────────────────────────
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

// ─── Auth Store ────────────────────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (telegramData: any) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // localStorage dan boshlang'ich qiymat (sahifa yangilansa ham saqlanadi)
  user: getStoredUser(),
  token: getStoredToken(),
  isLoading: false,
  error: null,

  login: async (telegramData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/telegram-auth', telegramData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      saveUser(user);
      set({ token, user, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Kirish xatosi',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    clearStorage();
    set({ user: null, token: null });
  },

  fetchUser: async () => {
    const token = get().token;
    if (!token) return;

    try {
      const response = await apiClient.get('/auth/me');
      const user = response.data.user;
      saveUser(user);
      set({ user, isLoading: false });
    } catch (error: any) {
      // Faqat 401 (token yaroqsiz) bo'lsa logout qilamiz
      // Network xatolarda localStorage dagi user saqlanib qoladi
      if (error?.response?.status === 401) {
        get().logout();
      }
    }
  },
}));

// ─── Tree Store ────────────────────────────────────────────────────────────────
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
      const response = await apiClient.get('/tree/active');
      set({ tree: response.data.tree, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Xato',
        isLoading: false,
      });
    }
  },

  purchaseTree: async (paymentData: any) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/tree/purchase', paymentData);
      set({ tree: response.data.tree, isLoading: false });
      await useAuthStore.getState().fetchUser();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Sotib olish xatosi',
        isLoading: false,
      });
      throw error;
    }
  },

  collectApple: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      await apiClient.post('/tree/collect', {});
      await get().fetchTree();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Yig'ish xatosi",
        isLoading: false,
      });
      throw error;
    }
  },

  claimReward: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/tree/claim-reward', {});
      await get().fetchTree();
      await useAuthStore.getState().fetchUser();
      set({ isLoading: false });
      return response.data.reward;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Mukofot olish xatosi',
        isLoading: false,
      });
      throw error;
    }
  },
}));
