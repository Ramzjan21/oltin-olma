'use client';

import { motion } from 'framer-motion';
import { useCountdown } from '@/hooks/useCountdown';

interface CountdownTimerProps {
  targetDate?: string | Date;
  onExpire?: () => void;
}

export default function CountdownTimer({ targetDate, onExpire }: CountdownTimerProps) {
  const { hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired && onExpire) {
    onExpire();
  }

  if (!targetDate || isExpired) {
    return (
      <div className="text-center">
        <p className="text-gold-400 text-lg font-bold">Hozir yig'ish mumkin!</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-center">
      <TimeUnit value={hours} label="Soat" />
      <TimeUnit value={minutes} label="Daqiqa" />
      <TimeUnit value={seconds} label="Soniya" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      className="glass rounded-lg p-4 min-w-[80px]"
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-3xl font-bold text-gold-400 text-glow-gold">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </motion.div>
  );
}
