'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaAppleAlt } from 'react-icons/fa';

interface TreeVisualizationProps {
  status: 'active' | 'dead' | 'completed';
  appleCount: number;
  level: number;
}

export default function TreeVisualization({ status, appleCount, level }: TreeVisualizationProps) {
  const [showApples, setShowApples] = useState(false);

  useEffect(() => {
    setShowApples(true);
  }, [appleCount]);

  const getTreeColor = () => {
    if (status === 'dead') return 'grayscale';
    if (status === 'completed') return 'brightness-150';
    return '';
  };

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      {/* Lightning effect background */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Tree */}
      <motion.div
        className={`relative z-10 ${getTreeColor()}`}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Tree Crown */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <svg width="200" height="150" viewBox="0 0 200 150">
            {/* Tree leaves */}
            <ellipse cx="100" cy="60" rx="80" ry="60" fill="#2d5016" opacity="0.8" />
            <ellipse cx="100" cy="50" rx="70" ry="50" fill="#3d6b1f" opacity="0.9" />
            <ellipse cx="100" cy="40" rx="60" ry="40" fill="#4d7c2f" />
            
            {/* Golden glow for active tree */}
            {status === 'active' && (
              <ellipse cx="100" cy="50" rx="75" ry="55" fill="url(#goldGlow)" opacity="0.3" />
            )}
            
            {/* Trunk */}
            <rect x="90" y="90" width="20" height="60" fill="#5d4037" rx="2" />
            
            {/* Gradient definitions */}
            <defs>
              <radialGradient id="goldGlow">
                <stop offset="0%" stopColor="#ffd700" />
                <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>

          {/* Apples on tree */}
          <AnimatePresence>
            {showApples && status === 'active' && (
              <>
                {[...Array(Math.min(appleCount, 12))].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${30 + (i % 4) * 30}px`,
                      top: `${20 + Math.floor(i / 4) * 25}px`,
                    }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <FaAppleAlt className="text-red-500 text-2xl drop-shadow-lg" />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Status badge */}
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {status === 'active' && (
            <span className="px-4 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold border border-green-500/50">
              Faol
            </span>
          )}
          {status === 'dead' && (
            <span className="px-4 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold border border-red-500/50">
              O'lgan
            </span>
          )}
          {status === 'completed' && (
            <span className="px-4 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm font-bold border border-gold-500/50">
              Tugallangan
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* Apple count display */}
      <motion.div
        className="absolute top-4 right-4 glass rounded-lg px-4 py-2"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <FaAppleAlt className="text-red-500 text-xl" />
          <span className="text-2xl font-bold text-gold-400">{appleCount}</span>
        </div>
      </motion.div>
    </div>
  );
}
