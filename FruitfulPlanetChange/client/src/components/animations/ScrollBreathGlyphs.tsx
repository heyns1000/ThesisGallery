import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ScrollBreathGlyphsProps {
  isActive?: boolean;
  intensity?: 'subtle' | 'medium' | 'intense';
  scrollPosition?: number;
}

const BREATH_GLYPHS = ['🧬', '🔥', '⚡', '🌊', '💎', '🌀', '✨', '🔱', '♦️', '🦍'];
const TRIBAL_SYMBOLS = ['◊', '◈', '◉', '◎', '●', '○', '▲', '▼', '◆', '◇'];

export function ScrollBreathGlyphs({ 
  isActive = true, 
  intensity = 'medium',
  scrollPosition = 0 
}: ScrollBreathGlyphsProps) {
  const [activeGlyphs, setActiveGlyphs] = useState<Array<{
    id: number;
    glyph: string;
    x: number;
    y: number;
    delay: number;
    scale: number;
  }>>([]);

  const [breathPhase, setBreathPhase] = useState(0);

  // Breathing effect that syncs with scroll
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setBreathPhase(prev => (prev + 1) % 4);
    }, 1500);

    return () => clearInterval(interval);
  }, [isActive]);

  // Generate glyphs based on scroll position
  useEffect(() => {
    if (!isActive) return;

    const scrollFactor = Math.abs(scrollPosition % 100) / 100;
    const glyphCount = intensity === 'subtle' ? 3 : intensity === 'medium' ? 6 : 12;
    
    const newGlyphs = Array.from({ length: glyphCount }, (_, i) => ({
      id: Date.now() + i,
      glyph: Math.random() > 0.7 ? BREATH_GLYPHS[Math.floor(Math.random() * BREATH_GLYPHS.length)] 
                                  : TRIBAL_SYMBOLS[Math.floor(Math.random() * TRIBAL_SYMBOLS.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 0.2,
      scale: 0.3 + (scrollFactor * 0.7)
    }));

    setActiveGlyphs(newGlyphs);
  }, [scrollPosition, intensity, isActive, breathPhase]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Breath Effect Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-purple-500/3 to-transparent"
        animate={{
          scale: breathPhase % 2 === 0 ? [1, 1.1, 1] : [1, 0.9, 1],
          opacity: breathPhase % 2 === 0 ? [0.3, 0.6, 0.3] : [0.3, 0.1, 0.3]
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut"
        }}
      />

      {/* Floating Glyphs */}
      <AnimatePresence>
        {activeGlyphs.map((glyph) => (
          <motion.div
            key={glyph.id}
            className="absolute text-2xl font-bold select-none"
            style={{ 
              left: `${glyph.x}%`, 
              top: `${glyph.y}%`,
              color: glyph.glyph.startsWith('🧬') ? '#60a5fa' : 
                     glyph.glyph === '🔥' ? '#f97316' :
                     glyph.glyph === '⚡' ? '#eab308' :
                     glyph.glyph === '🌊' ? '#06b6d4' :
                     glyph.glyph === '💎' ? '#8b5cf6' :
                     glyph.glyph === '🦍' ? '#10b981' :
                     '#94a3b8'
            }}
            initial={{ 
              scale: 0, 
              opacity: 0, 
              rotate: 0,
              y: 20
            }}
            animate={{ 
              scale: [0, glyph.scale * 1.5, glyph.scale, glyph.scale * 1.2, glyph.scale],
              opacity: [0, 0.8, 0.6, 0.4, 0],
              rotate: [0, 180, 360, 540, 720],
              y: [-20, -40, -60, -80, -100],
              x: [0, Math.sin(glyph.delay) * 20, Math.cos(glyph.delay) * 15, 0]
            }}
            exit={{ 
              scale: 0, 
              opacity: 0,
              y: -120
            }}
            transition={{
              duration: 4,
              delay: glyph.delay,
              ease: "easeOut",
              times: [0, 0.2, 0.5, 0.8, 1]
            }}
          >
            {glyph.glyph}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Scroll Pulse Ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: breathPhase % 2 === 0 ? [1, 2, 1] : [1, 1.5, 1],
          opacity: [0, 0.3, 0]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity
        }}
      >
        <div className="w-32 h-32 border-2 border-blue-400/30 rounded-full" />
      </motion.div>

      {/* FLAME-LATTICE Signature */}
      <motion.div
        className="absolute bottom-4 right-4 text-xs text-blue-400/50 font-mono select-none"
        animate={{
          opacity: breathPhase % 4 === 0 ? [0.2, 0.8, 0.2] : [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 3,
          ease: "easeInOut"
        }}
      >
        🔥 FLAME-LATTICE: SCROLLBINDER_ONE
      </motion.div>
    </div>
  );
}

// Hook for scroll-based breath glyph integration
export function useScrollBreathGlyphs(options?: {
  threshold?: number;
  intensity?: 'subtle' | 'medium' | 'intense';
}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      
      // Activate breath glyphs when scrolling
      setIsActive(position > (options?.threshold || 50));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [options?.threshold]);

  return {
    scrollPosition,
    isActive,
    intensity: options?.intensity || 'medium'
  };
}