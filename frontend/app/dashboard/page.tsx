'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, useTreeStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { useTelegramWebApp, hapticFeedback } from '@/hooks/useTelegramWebApp';
import GlassCard from '@/components/GlassCard';
import TreeVisualization from '@/components/TreeVisualization';
import CountdownTimer from '@/components/CountdownTimer';
import ProgressBar from '@/components/ProgressBar';
import Button from '@/components/Button';
import { NotificationContainer } from '@/components/Notification';
import { FaCoins, FaAppleAlt, FaGift } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  const { user, token, fetchUser } = useAuthStore();
  const { tree, fetchTree, collectApple, claimReward, isLoading } = useTreeStore();
  const { webApp } = useTelegramWebApp();
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);
  // Agar user allaqachon login'dan keyin yukli bo'lsa, spinner ko'rsatmaymiz
  const [initialLoading, setInitialLoading] = useState(!user);

  useEffect(() => {
    if (!token) {
      router.push('/');
      return;
    }

    // Agar user allaqachon store'da bo'lsa, faqat tree yuklaymiz
    const loadData = async () => {
      try {
        // User yo'q bo'lsa backenddan olamiz, bor bo'lsa o'tkazib yuboramiz
        if (!user) {
          await fetchUser();
        }
        await fetchTree();
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();

    // 8 soniyadan keyin hali ham yuklanayotgan bo'lsa, majburiy to'xtatamiz
    const timeout = setTimeout(() => {
      setInitialLoading(false);
    }, 8000);

    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleCollect = async () => {
    hapticFeedback.light();
    try {
      await collectApple();
      hapticFeedback.success();
      addNotification('Olma muvaffaqiyatli yig\'ildi! 🍎', 'success');
    } catch (error: any) {
      hapticFeedback.error();
      addNotification(error.response?.data?.message || 'Xato yuz berdi', 'error');
    }
  };

  const handleClaimReward = async () => {
    hapticFeedback.medium();
    try {
      const reward = await claimReward();
      hapticFeedback.success();
      addNotification(`Tabriklaymiz! ${reward.amount.toLocaleString()} UZS mukofot oldingiz! 🎉`, 'success');
    } catch (error: any) {
      hapticFeedback.error();
      addNotification(error.response?.data?.message || 'Xato yuz berdi', 'error');
    }
  };

  const handlePurchaseTree = () => {
    hapticFeedback.light();
    router.push('/purchase');
  };

  // Yuklanish tugadi lekin user yo'q — bosh sahifaga qaytarish
  if (!initialLoading && !user) {
    router.push('/');
    return null;
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative safe-area-top safe-area-bottom">
      {/* Lightning background */}
      <div className="lightning-bg" />

      {/* Notifications */}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />

      <div className="relative z-10 px-4 py-4 md:py-8 max-w-6xl mx-auto">
        {/* Header - Mobile optimized */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-glow-gold text-gold-400 mb-1">
                Oltin Olma Daraxt
              </h1>
              <p className="text-sm md:text-base text-gray-400">
                Xush kelibsiz, {user.firstName || user.username}!
              </p>
            </div>
            <GlassCard className="flex items-center gap-3 w-full md:w-auto" hover={false}>
              <FaCoins className="text-gold-400 text-xl md:text-2xl" />
              <div>
                <p className="text-xs text-gray-400">Balans</p>
                <p className="text-lg md:text-2xl font-bold text-gold-400">
                  {user.balance.toLocaleString()} UZS
                </p>
              </div>
            </GlassCard>
          </div>
        </motion.div>
        {/* Main Content */}
        {!tree ? (
          <GlassCard className="text-center py-8 md:py-12" hover={false}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="text-6xl md:text-7xl mb-4">🌳</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gold-400 mb-4 px-4">
                Sizda hali daraxt yo'q
              </h2>
              <p className="text-sm md:text-base text-gray-300 mb-6 px-4">
                Oltin olma daraxtini sotib oling va har kuni daromad qiling!
              </p>
              <Button variant="gold" onClick={handlePurchaseTree} className="w-full md:w-auto">
                Daraxt sotib olish (50,000 UZS)
              </Button>
            </motion.div>
          </GlassCard>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {/* Tree Visualization - Full width on mobile */}
            <GlassCard hover={false}>
              <TreeVisualization
                status={tree.status}
                appleCount={tree.appleCount}
                level={tree.level}
              />
            </GlassCard>

            {/* Progress */}
            <GlassCard hover={false}>
              <h3 className="text-lg md:text-xl font-bold text-gold-400 mb-4">
                Haftalik Progress
              </h3>
              <ProgressBar
                current={tree.daysCollected}
                total={7}
                label="Yig'ilgan kunlar"
              />
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-300">
                <FaAppleAlt className="text-red-500" />
                <span>Jami olmalar: {tree.appleCount}</span>
              </div>
            </GlassCard>

            {/* Collection Timer */}
            {tree.status === 'active' && (
              <GlassCard hover={false}>
                <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-4">
                  Keyingi yig'ish
                </h3>
                <CountdownTimer
                  targetDate={tree.nextCollectionTime}
                  onExpire={() => fetchTree()}
                />
                <div className="mt-6">
                  <Button
                    variant="primary"
                    onClick={handleCollect}
                    disabled={!tree.canCollect || isLoading}
                    loading={isLoading}
                    className="w-full"
                  >
                    <FaAppleAlt className="inline mr-2" />
                    Olma yig'ish
                  </Button>
                </div>
              </GlassCard>
            )}

            {/* Claim Reward */}
            {tree.status === 'active' && tree.canClaimReward && (
              <GlassCard className="bg-gradient-to-r from-gold-500/10 to-purple-500/10 border-gold-500/50" hover={false}>
                <h3 className="text-xl md:text-2xl font-bold text-gold-400 mb-4 text-glow-gold">
                  <FaGift className="inline mr-2" />
                  Mukofot tayyor!
                </h3>
                <p className="text-sm md:text-base text-gray-300 mb-6">
                  Siz 7 kun davomida har kuni olma yig'idingiz. Endi mukofotingizni oling!
                </p>
                <Button
                  variant="gold"
                  onClick={handleClaimReward}
                  disabled={isLoading}
                  loading={isLoading}
                  className="w-full text-base md:text-lg"
                >
                  Mukofot olish (50,000 - 500,000 UZS)
                </Button>
              </GlassCard>
            )}

            {/* Dead Tree */}
            {tree.status === 'dead' && (
              <GlassCard className="bg-red-500/10 border-red-500/50" hover={false}>
                <div className="text-center py-4">
                  <div className="text-5xl mb-4">💀</div>
                  <h3 className="text-xl md:text-2xl font-bold text-red-400 mb-4">
                    Daraxt o'ldi
                  </h3>
                  <p className="text-sm md:text-base text-gray-300 mb-6 px-4">
                    Siz 1 kun o'tkazib yubordingiz. Yangi daraxt sotib olishingiz kerak.
                  </p>
                  <Button variant="gold" onClick={handlePurchaseTree} className="w-full md:w-auto">
                    Yangi daraxt sotib olish
                  </Button>
                </div>
              </GlassCard>
            )}

            {/* Completed Tree */}
            {tree.status === 'completed' && (
              <GlassCard className="bg-green-500/10 border-green-500/50" hover={false}>
                <div className="text-center py-4">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-xl md:text-2xl font-bold text-green-400 mb-4">
                    Daraxt tugallandi!
                  </h3>
                  <p className="text-sm md:text-base text-gray-300 mb-6 px-4">
                    Tabriklaymiz! Siz mukofotingizni oldingiz. Yangi daraxt sotib olishingiz mumkin.
                  </p>
                  <Button variant="gold" onClick={handlePurchaseTree} className="w-full md:w-auto">
                    Yangi daraxt sotib olish
                  </Button>
                </div>
              </GlassCard>
            )}
          </div>
        )}

        {/* Info Cards - Mobile optimized */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <GlassCard className="text-center py-4" hover={false}>
            <div className="text-3xl md:text-4xl mb-2">🌳</div>
            <h4 className="text-base md:text-lg font-bold text-gold-400 mb-2">Har kuni yig'ing</h4>
            <p className="text-xs md:text-sm text-gray-400 px-2">
              Har 8 soatda bir marta olma yig'ish mumkin (kuniga 3 marta)
            </p>
          </GlassCard>

          <GlassCard className="text-center py-4" hover={false}>
            <div className="text-3xl md:text-4xl mb-2">📅</div>
            <h4 className="text-base md:text-lg font-bold text-gold-400 mb-2">7 kun davom eting</h4>
            <p className="text-xs md:text-sm text-gray-400 px-2">
              Har kuni yig'ish esdan chiqmasin, aks holda daraxt o'ladi
            </p>
          </GlassCard>

          <GlassCard className="text-center py-4" hover={false}>
            <div className="text-3xl md:text-4xl mb-2">💰</div>
            <h4 className="text-base md:text-lg font-bold text-gold-400 mb-2">Mukofot oling</h4>
            <p className="text-xs md:text-sm text-gray-400 px-2">
              7 kundan keyin 50,000 - 500,000 UZS mukofot
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
