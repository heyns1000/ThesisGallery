import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ScrollBreathGlyphs } from "./ScrollBreathGlyphs";

interface SectorTransitionEffectsProps {
  isVisible: boolean;
  sectorName?: string;
  sectorEmoji?: string;
  onComplete?: () => void;
}

export function SectorTransitionEffects({ 
  isVisible, 
  sectorName, 
  sectorEmoji, 
  onComplete 
}: SectorTransitionEffectsProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let animationFrame: number;
    let startTime: number;
    const duration = 2500; // 2.5 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      
      setProgress(newProgress);

      if (newProgress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setTimeout(() => onComplete?.(), 200);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center"
      >
        {/* Sector Icon Animation */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: [0.5, 1.2, 1], 
              opacity: [0, 1, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 1.5,
              ease: "easeInOut",
              times: [0, 0.6, 1]
            }}
            className="text-8xl mb-6"
          >
            {sectorEmoji || "🔧"}
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white mb-8"
          >
            Loading {sectorName || "Sector"}...
          </motion.h2>

          {/* Progress Ring */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-600"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-green-400"
                strokeLinecap="round"
                strokeDasharray={283} // 2 * PI * 45
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * progress) }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-400 text-sm"
          >
            Preparing sector ecosystem...
          </motion.div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* ScrollBinder Breath Glyphs Integration */}
        <ScrollBreathGlyphs 
          isActive={true}
          intensity="intense"
          scrollPosition={progress * 100}
        />
      </motion.div>
    </AnimatePresence>
  );
}