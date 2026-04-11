'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useStore';
import { useTelegramWebApp, hapticFeedback } from '@/hooks/useTelegramWebApp';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import { motion } from 'framer-motion';
import { FaTelegram } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const { login, token } = useAuthStore();
  const { webApp, user, isReady } = useTelegramWebApp();
  const [loading, setLoading] = useState(false);
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (token) {
      console.log('Token found, redirecting to dashboard...');
      router.replace('/dashboard');
    }
  }, [token, router]);

  // Auto-login if Telegram WebApp data is available (faqat bir marta)
  useEffect(() => {
    if (isReady && user && !token && !loading && !hasAttemptedLogin) {
      console.log('Auto-login triggered');
      setHasAttemptedLogin(true);
      handleTelegramLogin();
    }
  }, [isReady, user, token, loading, hasAttemptedLogin]);

  // Telegram WebApp login
  const handleTelegramLogin = async () => {
    if (!webApp || !user || loading) return;
    
    console.log('Starting Telegram login...');
    setLoading(true);
    hapticFeedback.light();
    
    try {
      const telegramData = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        auth_date: webApp.initDataUnsafe.auth_date,
        hash: webApp.initDataUnsafe.hash,
      };

      await login(telegramData);
      console.log('Login successful, token saved');
      hapticFeedback.success();
      
      // Token zustand'da saqlanadi, useEffect avtomatik redirect qiladi
    } catch (error) {
      console.error('Login xatosi:', error);
      hapticFeedback.error();
      setHasAttemptedLogin(false); // Qayta urinish imkoniyati
      setLoading(false);
    }
  };

  // Mock Telegram login for testing (browser only)
  const handleMockLogin = async () => {
    if (loading) return;
    
    setLoading(true);
    hapticFeedback.light();
    
    try {
      const mockTelegramData = {
        id: Math.floor(Math.random() * 1000000),
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        auth_date: Math.floor(Date.now() / 1000),
        hash: 'mock_hash_' + Date.now(),
      };

      await login(mockTelegramData);
      console.log('Mock login successful');
      hapticFeedback.success();
      
      // Token zustand'da saqlanadi, useEffect avtomatik redirect qiladi
    } catch (error) {
      console.error('Login xatosi:', error);
      hapticFeedback.error();
      setLoading(false);
    }
  };

  // Agar token bor bo'lsa, loading ko'rsatish
  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }
      hapticFeedback.error();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center safe-area-top safe-area-bottom px-4 py-6">
      {/* Lightning background */}
      <div className="lightning-bg" />

      {/* Animated particles - reduced for mobile performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gold-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
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
          {/* Logo/Title - Mobile optimized */}
          <motion.div
            className="mb-6"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="text-6xl md:text-8xl mb-3">🌳</div>
            <h1 className="text-3xl md:text-6xl font-bold text-glow-gold text-gold-400 mb-2 md:mb-4 px-2">
              Oltin Olma Daraxt
            </h1>
            <p className="text-base md:text-xl text-gray-300 px-4">
              Har kuni olma yig'ing va katta mukofotlar qo'lga kiriting!
            </p>
          </motion.div>

          {/* Features - Mobile optimized */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <GlassCard hover={false}>
              <div className="text-center py-4">
                <div className="text-4xl md:text-5xl mb-3">💰</div>
                <h3 className="text-lg md:text-xl font-bold text-gold-400 mb-2">
                  50,000 - 500,000 UZS
                </h3>
                <p className="text-xs md:text-sm text-gray-400 px-2">
                  7 kun davomida har kuni olma yig'ib, katta mukofot oling
                </p>
              </div>
            </GlassCard>

            <GlassCard hover={false}>
              <div className="text-center py-4">
                <div className="text-4xl md:text-5xl mb-3">⏰</div>
                <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-2">
                  Har 8 soatda
                </h3>
                <p className="text-xs md:text-sm text-gray-400 px-2">
                  Kuniga 3 marta olma yig'ish imkoniyati
                </p>
              </div>
            </GlassCard>

            <GlassCard hover={false}>
              <div className="text-center py-4">
                <div className="text-4xl md:text-5xl mb-3">🎯</div>
                <h3 className="text-lg md:text-xl font-bold text-green-400 mb-2">
                  Oddiy qoidalar
                </h3>
                <p className="text-xs md:text-sm text-gray-400 px-2">
                  Faqat har kuni yig'ing va mukofot sizniki!
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Login Card - Mobile optimized */}
          <GlassCard className="max-w-md mx-auto mb-8" hover={false}>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
              Boshlash uchun kiring
            </h2>

            {/* Telegram Login Button */}
            <Button
              variant="primary"
              onClick={isReady && user ? handleTelegramLogin : handleMockLogin}
              loading={loading}
              className="w-full text-base md:text-lg"
            >
              <FaTelegram className="inline mr-2 text-xl" />
              {isReady && user ? 'Davom etish' : 'Telegram orqali kirish'}
            </Button>

            {!isReady && (
              <p className="text-xs text-gray-500 mt-4 px-2">
                Telegram WebApp ichida ochish tavsiya etiladi. Brauzerda test rejimi.
              </p>
            )}
          </GlassCard>

          {/* How it works - Mobile optimized */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-purple-400 mb-4">
              Qanday ishlaydi?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <GlassCard className="text-center py-4" hover={false}>
                <div className="text-2xl md:text-3xl mb-2">1️⃣</div>
                <p className="text-xs md:text-sm text-gray-300 px-1">
                  Daraxt sotib oling (50,000 UZS)
                </p>
              </GlassCard>
              <GlassCard className="text-center py-4" hover={false}>
                <div className="text-2xl md:text-3xl mb-2">2️⃣</div>
                <p className="text-xs md:text-sm text-gray-300 px-1">
                  Har kuni olma yig'ing (kuniga 3 marta)
                </p>
              </GlassCard>
              <GlassCard className="text-center py-4" hover={false}>
                <div className="text-2xl md:text-3xl mb-2">3️⃣</div>
                <p className="text-xs md:text-sm text-gray-300 px-1">
                  7 kun davom eting (1 kun ham o'tkazmang!)
                </p>
              </GlassCard>
              <GlassCard className="text-center py-4" hover={false}>
                <div className="text-2xl md:text-3xl mb-2">4️⃣</div>
                <p className="text-xs md:text-sm text-gray-300 px-1">
                  Mukofot oling (50k - 500k UZS)
                </p>
              </GlassCard>
            </div>
          </motion.div>

          {/* Warning - Mobile optimized */}
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
