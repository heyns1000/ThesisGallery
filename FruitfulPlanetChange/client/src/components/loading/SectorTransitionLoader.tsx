import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2, Zap, Database, Globe2, Shield, Cpu } from "lucide-react";

interface SectorTransitionLoaderProps {
  isVisible: boolean;
  currentSector?: string;
  targetSector?: string;
  progress?: number;
  onComplete?: () => void;
}

const sectorIcons = {
  "agriculture": "🌱", "fsf": "🥦", "banking": "🏦", "creative": "🖋️", "logistics": "📦",
  "education-ip": "📚", "fashion": "✂", "gaming": "🎮", "health": "🧠", "housing": "🏗️",
  "justice": "⚖", "knowledge": "📖", "micromesh": "☰", "media": "🎬", "nutrition": "✿",
  "ai-logic": "🧠", "packaging": "📦", "quantum": "✴️", "ritual": "☯", "saas": "🔑",
  "trade": "🧺", "utilities": "🔋", "voice": "🎙️", "webless": "📡", "nft": "🔁",
  "education-youth": "🎓", "zerowaste": "♻️", "professional": "🧾", "payroll-mining": "🪙", "mining": "⛏️",
  "wildlife": "🦁"
};

const loadingStages = [
  { text: "Initializing Sector Protocols...", icon: Database, duration: 800 },
  { text: "Establishing VaultMesh™ Connection...", icon: Shield, duration: 600 },
  { text: "Loading Brand Ecosystem...", icon: Globe2, duration: 700 },
  { text: "Synchronizing OmniGrid™...", icon: Cpu, duration: 500 },
  { text: "Transition Complete", icon: Zap, duration: 300 }
];

export default function SectorTransitionLoader({ 
  isVisible, 
  currentSector, 
  targetSector, 
  progress = 0,
  onComplete 
}: SectorTransitionLoaderProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let stageIndex = 0;
    const animateStages = () => {
      if (stageIndex >= loadingStages.length) {
        setTimeout(() => onComplete?.(), 300);
        return;
      }

      const stage = loadingStages[stageIndex];
      setCurrentStage(stageIndex);
      setStageProgress(0);

      const progressInterval = setInterval(() => {
        setStageProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            stageIndex++;
            setTimeout(animateStages, 100);
            return 100;
          }
          return prev + (100 / (stage.duration / 50));
        });
      }, 50);
    };

    const startDelay = setTimeout(animateStages, 200);
    return () => {
      clearTimeout(startDelay);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const currentStageData = loadingStages[currentStage];
  const IconComponent = currentStageData?.icon || Loader2;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center"
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Main Loading Container */}
        <div className="relative z-10 max-w-md w-full mx-auto text-center px-6">
          {/* Sector Transition Visual */}
          <div className="mb-8 flex items-center justify-center space-x-8">
            {/* Current Sector */}
            {currentSector && (
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 0.8, opacity: 0.6 }}
                className="text-4xl"
              >
                {currentSector.split(' ')[0]}
              </motion.div>
            )}

            {/* Transition Arrow */}
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-blue-400"
            >
              <Zap className="w-6 h-6" />
            </motion.div>

            {/* Target Sector */}
            {targetSector && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl"
              >
                {targetSector.split(' ')[0]}
              </motion.div>
            )}
          </div>

          {/* Loading Icon */}
          <motion.div
            animate={{ 
              rotate: currentStage === 4 ? 0 : 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 0.8, repeat: Infinity }
            }}
            className="mb-6 flex justify-center"
          >
            <div className="relative">
              <IconComponent className="w-12 h-12 text-blue-400" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-blue-400/20"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Loading Text */}
          <motion.h2
            key={currentStage}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-xl font-semibold text-white mb-4"
          >
            {currentStageData?.text || "Loading..."}
          </motion.h2>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${stageProgress}%` }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Stage {currentStage + 1} of {loadingStages.length}
            </div>
          </div>

          {/* Sector Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            className="text-sm text-gray-400 max-w-sm mx-auto"
          >
            {currentSector && targetSector ? (
              <div>
                Transitioning from <span className="text-blue-300">{currentSector}</span> to{" "}
                <span className="text-purple-300">{targetSector}</span>
              </div>
            ) : (
              <div>
                Preparing sector ecosystem...
              </div>
            )}
          </motion.div>

          {/* Loading Dots */}
          <div className="mt-4 flex justify-center space-x-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="text-xs text-gray-500 text-center">
            Powered by <span className="text-blue-400">VaultMesh™</span> Infrastructure
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}