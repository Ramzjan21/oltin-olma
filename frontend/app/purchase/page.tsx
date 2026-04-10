'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTreeStore } from '@/store/useStore';
import { hapticFeedback } from '@/hooks/useTelegramWebApp';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import { NotificationContainer } from '@/components/Notification';
import { motion } from 'framer-motion';
import { FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';

export default function PurchasePage() {
  const router = useRouter();
  const { purchaseTree, isLoading } = useTreeStore();
  const [selectedMethod, setSelectedMethod] = useState<'payme' | 'click' | 'mock'>('mock');
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handlePurchase = async () => {
    hapticFeedback.medium();
    try {
      await purchaseTree({
        paymentMethod: selectedMethod,
        paymentId: `${selectedMethod.toUpperCase()}_${Date.now()}`,
      });
      hapticFeedback.success();
      addNotification('Daraxt muvaffaqiyatli sotib olindi! 🌳', 'success');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error: any) {
      hapticFeedback.error();
      addNotification(error.response?.data?.message || 'Xato yuz berdi', 'error');
    }
  };

  const handleSelectMethod = (method: 'payme' | 'click' | 'mock') => {
    hapticFeedback.selection();
    setSelectedMethod(method);
  };

  return (
    <div className="min-h-screen relative safe-area-top safe-area-bottom">
      <div className="lightning-bg" />
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />

      <div className="relative z-10 px-4 py-4 md:py-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-4xl font-bold text-glow-gold text-gold-400 mb-6 text-center">
            Oltin Olma Daraxt Sotib Olish
          </h1>

          <GlassCard className="mb-6" hover={false}>
            <div className="text-center py-6 md:py-8">
              <div className="text-5xl md:text-6xl mb-4">🌳</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gold-400 mb-2">Level 1 Daraxt</h2>
              <p className="text-4xl md:text-5xl font-bold text-glow-gold text-gold-400 mb-4">
                50,000 UZS
              </p>
              <div className="space-y-2 text-left max-w-md mx-auto px-4">
                <div className="flex items-start gap-2">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-sm md:text-base text-gray-300">Har 8 soatda olma yig'ish</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-sm md:text-base text-gray-300">Kuniga maksimal 3 marta yig'ish</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-sm md:text-base text-gray-300">7 kun davom ettiring</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-sm md:text-base text-gray-300">50,000 - 500,000 UZS mukofot</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-4 md:mb-6">To'lov usulini tanlang</h3>

            <div className="space-y-3 md:space-y-4 mb-6">
              {/* Payme */}
              <motion.div
                className={`glass p-4 rounded-lg cursor-pointer border-2 transition-all touch-feedback ${
                  selectedMethod === 'payme'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-transparent'
                }`}
                onClick={() => handleSelectMethod('payme')}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaCreditCard className="text-white text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm md:text-base">Payme</h4>
                    <p className="text-xs md:text-sm text-gray-400">Plastik karta orqali to'lash</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                      selectedMethod === 'payme'
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-500'
                    }`}
                  />
                </div>
              </motion.div>

              {/* Click */}
              <motion.div
                className={`glass p-4 rounded-lg cursor-pointer border-2 transition-all touch-feedback ${
                  selectedMethod === 'click'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-transparent'
                }`}
                onClick={() => handleSelectMethod('click')}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMoneyBillWave className="text-white text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm md:text-base">Click</h4>
                    <p className="text-xs md:text-sm text-gray-400">Click orqali to'lash</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                      selectedMethod === 'click'
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-500'
                    }`}
                  />
                </div>
              </motion.div>

              {/* Mock (for testing) */}
              <motion.div
                className={`glass p-4 rounded-lg cursor-pointer border-2 transition-all touch-feedback ${
                  selectedMethod === 'mock'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-transparent'
                }`}
                onClick={() => handleSelectMethod('mock')}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💳</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm md:text-base">Test To'lov</h4>
                    <p className="text-xs md:text-sm text-gray-400">Demo uchun (haqiqiy to'lov emas)</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                      selectedMethod === 'mock'
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-500'
                    }`}
                  />
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <Button
                variant="primary"
                onClick={() => router.push('/dashboard')}
                className="w-full md:flex-1"
              >
                Bekor qilish
              </Button>
              <Button
                variant="gold"
                onClick={handlePurchase}
                disabled={isLoading}
                loading={isLoading}
                className="w-full md:flex-1"
              >
                To'lash (50,000 UZS)
              </Button>
            </div>
          </GlassCard>

          <div className="mt-4 md:mt-6 text-center px-4">
            <p className="text-xs md:text-sm text-gray-400">
              ⚠️ Diqqat: Agar 1 kun ham o'tkazib yuborsangiz, daraxt o'ladi va pul qaytarilmaydi
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
