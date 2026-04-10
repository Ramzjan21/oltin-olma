'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/GlassCard';
import { motion } from 'framer-motion';
import { FaUsers, FaTree, FaCoins, FaChartLine, FaBan, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Stats {
  totalRevenue: number;
  totalRewardsPaid: number;
  totalProfit: number;
  activeTrees: number;
  totalUsers: number;
  profitMargin: string;
}

interface User {
  id: number;
  telegramId: number;
  username?: string;
  firstName?: string;
  balance: number;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/');
      return;
    }
    if (user && !user.isAdmin) {
      router.push('/dashboard');
      return;
    }
    fetchData();
  }, [token, user]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setLoading(false);
    } catch (error) {
      console.error('Admin ma\'lumotlarini olish xatosi:', error);
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: number, banned: boolean) => {
    try {
      await axios.post(
        `${API_URL}/admin/users/${userId}/ban`,
        { banned },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      console.error('Ban xatosi:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="lightning-bg" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-glow-purple text-purple-400 mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-400">Tizim boshqaruvi va statistika</p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <FaCoins className="text-green-400 text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Jami daromad</p>
                  <p className="text-2xl font-bold text-green-400">
                    {stats.totalRevenue.toLocaleString()} UZS
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <FaCoins className="text-red-400 text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">To'langan mukofotlar</p>
                  <p className="text-2xl font-bold text-red-400">
                    {stats.totalRewardsPaid.toLocaleString()} UZS
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center">
                  <FaChartLine className="text-gold-400 text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Sof foyda</p>
                  <p className="text-2xl font-bold text-gold-400">
                    {stats.totalProfit.toLocaleString()} UZS
                  </p>
                  <p className="text-xs text-gray-500">Foyda: {stats.profitMargin}%</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <FaUsers className="text-purple-400 text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Jami foydalanuvchilar</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.totalUsers}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <FaTree className="text-blue-400 text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Faol daraxtlar</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.activeTrees}</p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Users Table */}
        <GlassCard>
          <h2 className="text-2xl font-bold text-purple-400 mb-6">Foydalanuvchilar</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400">ID</th>
                  <th className="text-left py-3 px-4 text-gray-400">Ism</th>
                  <th className="text-left py-3 px-4 text-gray-400">Username</th>
                  <th className="text-left py-3 px-4 text-gray-400">Balans</th>
                  <th className="text-left py-3 px-4 text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-800 hover:bg-white/5">
                    <td className="py-3 px-4 text-gray-300">{u.id}</td>
                    <td className="py-3 px-4 text-white">{u.firstName || '-'}</td>
                    <td className="py-3 px-4 text-gray-300">@{u.username || '-'}</td>
                    <td className="py-3 px-4 text-gold-400 font-bold">
                      {u.balance.toLocaleString()} UZS
                    </td>
                    <td className="py-3 px-4">
                      {u.isAdmin ? (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                          Admin
                        </span>
                      ) : u.isBanned ? (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                          Bloklangan
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                          Faol
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {!u.isAdmin && (
                        <button
                          onClick={() => handleBanUser(u.id, !u.isBanned)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            u.isBanned
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          }`}
                        >
                          {u.isBanned ? (
                            <>
                              <FaCheckCircle className="inline mr-1" />
                              Blokdan chiqarish
                            </>
                          ) : (
                            <>
                              <FaBan className="inline mr-1" />
                              Bloklash
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
