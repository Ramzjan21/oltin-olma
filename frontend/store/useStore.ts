import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── localStorage helpers ────────────────────────────────────────────────────
const isBrowser = typeof window !== 'undefined';

const getToken = () => (isBrowser ? localStorage.getItem('token') : null);
const getUser = (): User | null => {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const saveToken = (t: string) => isBrowser && localStorage.setItem('token', t);
const saveUser = (u: User) => isBrowser && localStorage.setItem('user', JSON.stringify(u));
const clearAll = () => {
  if (!isBrowser) return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ─── Axios instance (timeout: 20s Render.com cold-start uchun) ───────────────
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 20000, // 20 soniya — Render.com cold-start
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
});

// Token har so'rovga avtomatik qo'shiladi
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Types ───────────────────────────────────────────────────────────────────
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

// ─── Auth Store ───────────────────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (telegramData: any) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getUser(),   // localStorage dan o'qiladi
  token: getToken(), // localStorage dan o'qiladi
  isLoading: false,

  login: async (telegramData: any) => {
    console.log('🔑 [login] Boshlandi. Telegram data:', telegramData);
    set({ isLoading: true });
    try {
      const res = await apiClient.post('/auth/telegram-auth', telegramData);
      const { token, user } = res.data;
      console.log('✅ [login] Muvaffaqiyatli. User:', user);
      saveToken(token);
      saveUser(user);
      set({ token, user, isLoading: false });
    } catch (err: any) {
      console.error('❌ [login] Xato:', err?.response?.status, err?.message);
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    clearAll();
    set({ user: null, token: null });
  },

  fetchUser: async () => {
    const token = get().token;
    console.log('👤 [fetchUser] Token:', token ? token.slice(0, 20) + '...' : 'YO\'Q');
    if (!token) return;
    try {
      const res = await apiClient.get('/auth/me');
      const user = res.data.user;
      console.log('✅ [fetchUser] User:', user);
      saveUser(user);
      set({ user });
    } catch (err: any) {
      console.error('❌ [fetchUser] Xato:', err?.response?.status, err?.message);
      if (err?.response?.status === 401) {
        console.warn('🔒 [fetchUser] 401 — logout');
        get().logout();
      }
    }
  },
}));

// ─── Tree Store ───────────────────────────────────────────────────────────────
interface TreeState {
  tree: Tree | null;
  isLoading: boolean;
  fetchTree: () => Promise<void>;
  purchaseTree: (data: any) => Promise<void>;
  collectApple: () => Promise<void>;
  claimReward: () => Promise<{ amount: number; newBalance: number }>;
}

export const useTreeStore = create<TreeState>((set, get) => ({
  tree: null,
  isLoading: false,

  fetchTree: async () => {
    const token = useAuthStore.getState().token;
    console.log('🌳 [fetchTree] Boshlandi. Token:', token ? token.slice(0, 20) + '...' : 'YO\'Q');
    if (!token) {
      console.warn('⚠️ [fetchTree] Token yo\'q — to\'xtatildi');
      return;
    }
    set({ isLoading: true });
    try {
      const res = await apiClient.get('/tree/active');
      console.log('✅ [fetchTree] Tree:', res.data.tree);
      set({ tree: res.data.tree ?? null, isLoading: false });
    } catch (err: any) {
      console.error('❌ [fetchTree] Xato:', err?.response?.status, err?.message, err?.code);
      set({ isLoading: false });
    }
  },

  purchaseTree: async (data: any) => {
    set({ isLoading: true });
    try {
      const res = await apiClient.post('/tree/purchase', data);
      set({ tree: res.data.tree, isLoading: false });
      await useAuthStore.getState().fetchUser();
    } catch (err: any) {
      set({ isLoading: false });
      throw err;
    }
  },

  collectApple: async () => {
    set({ isLoading: true });
    try {
      await apiClient.post('/tree/collect', {});
      await get().fetchTree();
      set({ isLoading: false });
    } catch (err: any) {
      set({ isLoading: false });
      throw err;
    }
  },

  claimReward: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.post('/tree/claim-reward', {});
      await get().fetchTree();
      await useAuthStore.getState().fetchUser();
      set({ isLoading: false });
      return res.data.reward;
    } catch (err: any) {
      set({ isLoading: false });
      throw err;
    }
  },
}));
