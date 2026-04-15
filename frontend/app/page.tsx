'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useStore';
import { useTelegramWebApp, hapticFeedback } from '@/hooks/useTelegramWebApp';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import { motion } from 'framer-motion';
import { FaTelegram } from 'react-icons/fa';

// Module-level — komponent unmount/remount bo'lganda RESET BO'LMAYDI
let loginAttempted = false;

export default function Home() {
  const router = useRouter();
  const { login, token } = useAuthStore();
  const { webApp, user, isReady } = useTelegramWebApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitMsg, setWaitMsg] = useState<string | null>(null);

  // Token bor bo'lsa — dashboardga o'tish
  useEffect(() => {
    if (token) {
      router.replace('/dashboard');
    }
  }, [token, router]);

  // Telegram WebApp tayyor bo'lganda — avtomatik login (faqat bir marta)
  useEffect(() => {
    if (isReady && user && !token && !loading && !loginAttempted) {
      loginAttempted = true;
      handleTelegramLogin();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, user, token]);

  const handleTelegramLogin = async () => {
    if (!webApp || !user || loading) return;

    setLoading(true);
    setError(null);
    setWaitMsg(null);
    hapticFeedback.light();

    // 5 soniyadan keyin "birozdan so'ng..." xabarini ko'rsatish
    const waitTimer = setTimeout(() => {
      setWaitMsg('Server ishga tushmoqda, birozdan so\'ng...');
    }, 5000);

    try {
      await login({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name ?? '',
        username: user.username ?? '',
        auth_date: webApp.initDataUnsafe.auth_date,
        hash: webApp.initDataUnsafe.hash,
      });
      hapticFeedback.success();
      clearTimeout(waitTimer);
      // token o'rnatiladi → useEffect dashboard ga yo'naltiradi
    } catch (err: any) {
      clearTimeout(waitTimer);
      hapticFeedback.error();
      setWaitMsg(null);
      const msg = err?.response?.data?.message || err?.message || 'Kirish xatosi';
      setError(msg.includes('timeout')
        ? 'Server javob bermadi (20s). Qayta urining.'
        : msg);
      loginAttempted = false; // Qayta urinish uchun
    } finally {
      setLoading(false);
    }
  };

  // Browser test rejimi (mock login)
  const handleMockLogin = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    hapticFeedback.light();
    try {
      await login({
        id: Math.floor(Math.random() * 1000000),
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        auth_date: Math.floor(Date.now() / 1000),
        hash: 'mock_hash_' + Date.now(),
      });
      hapticFeedback.success();
    } catch (err: any) {
      hapticFeedback.error();
      setError(err?.response?.data?.message || 'Kirish xatosi');
      loginAttempted = false;
    } finally {
      setLoading(false);
    }
  };

  // Token bor — dashboardga o'tilmoqda
  if (token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="spinner" />
        <p className="text-gray-400 text-sm">Dashboard ochilmoqda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center safe-area-top safe-area-bottom px-4 py-6">
      <div className="lightning-bg" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gold-400 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div className="mb-6" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <div className="text-6xl md:text-8xl mb-3">🌳</div>
            <h1 className="text-3xl md:text-6xl font-bold text-glow-gold text-gold-400 mb-2 md:mb-4 px-2">
              Oltin Olma Daraxt
            </h1>
            <p className="text-base md:text-xl text-gray-300 px-4">
              Har kuni olma yig'ing va katta mukofotlar qo'lga kiriting!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <GlassCard hover={false}>
              <div className="text-center py-4">
                <div className="text-4xl md:text-5xl mb-3">💰</div>
                <h3 className="text-lg md:text-xl font-bold text-gold-400 mb-2">50,000 - 500,000 UZS</h3>
                <p className="text-xs md:text-sm text-gray-400 px-2">7 kun davomida har kuni olma yig'ib, katta mukofot oling</p>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="text-center py-4">
                <div className="text-4xl md:text-5xl mb-3">⏰</div>
                <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-2">Har 8 soatda</h3>
                <p className="text-xs md:text-sm text-gray-400 px-2">Kuniga 3 marta olma yig'ish imkoniyati</p>
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <div className="text-center py-4">
                <div className="text-4xl md:text-5xl mb-3">🎯</div>
                <h3 className="text-lg md:text-xl font-bold text-green-400 mb-2">Oddiy qoidalar</h3>
                <p className="text-xs md:text-sm text-gray-400 px-2">Faqat har kuni yig'ing va mukofot sizniki!</p>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="max-w-md mx-auto mb-8" hover={false}>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Boshlash uchun kiring</h2>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {waitMsg && (
              <div className="mb-4 p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
                <p className="text-sm text-blue-300">⏳ {waitMsg}</p>
              </div>
            )}

            <Button
              variant="primary"
              onClick={isReady && user ? handleTelegramLogin : handleMockLogin}
              loading={loading}
              className="w-full text-base md:text-lg"
            >
              <FaTelegram className="inline mr-2 text-xl" />
              {loading
                ? 'Kirilmoqda...'
                : isReady && user
                  ? 'Davom etish'
                  : 'Telegram orqali kirish'}
            </Button>

            {!isReady && !loading && (
              <p className="text-xs text-gray-500 mt-4 px-2">
                Telegram WebApp ichida ochish tavsiya etiladi. Brauzerda test rejimi.
              </p>
            )}
          </GlassCard>

          <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h3 className="text-xl md:text-2xl font-bold text-purple-400 mb-4">Qanday ishlaydi?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Daraxt sotib oling (50,000 UZS)', "Har kuni olma yig'ing (kuniga 3 marta)", "7 kun davom eting (1 kun ham o'tkazmang!)", 'Mukofot oling (50k - 500k UZS)'].map((text, i) => (
                <GlassCard key={i} className="text-center py-4" hover={false}>
                  <div className="text-2xl md:text-3xl mb-2">{['1️⃣','2️⃣','3️⃣','4️⃣'][i]}</div>
                  <p className="text-xs md:text-sm text-gray-300 px-1">{text}</p>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="glass rounded-lg p-4 border border-red-500/50 bg-red-500/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm md:text-base text-red-400 font-bold">
              ⚠️ Diqqat: Agar 1 kun ham o'tkazib yuborsangiz, daraxt o'ladi va pul qaytarilmaydi!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
