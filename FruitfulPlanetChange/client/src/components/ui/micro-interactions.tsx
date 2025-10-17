import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

// Sparkle effect for success states
export const SparkleEffect = ({ children, trigger }: { children: React.ReactNode, trigger?: boolean }) => {
  const [sparkles, setSparkles] = useState<Array<{ id: number, x: number, y: number }>>([])

  useEffect(() => {
    if (trigger) {
      const newSparkles = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }))
      setSparkles(newSparkles)
      setTimeout(() => setSparkles([]), 1000)
    }
  }, [trigger])

  return (
    <motion.div className="relative overflow-hidden">
      {children}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full pointer-events-none"
            style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ 
              scale: [0, 1, 0], 
              opacity: [1, 1, 0],
              y: -20,
              rotate: 360
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            ✨
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

// Ripple effect for button clicks
export const RippleButton = ({ 
  children, 
  className, 
  onClick, 
  variant = "default",
  ...props 
}: { 
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: "default" | "success" | "warning" | "destructive"
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const [ripples, setRipples] = useState<Array<{ id: number, x: number, y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newRipple = { id: Date.now(), x, y }
    setRipples(prev => [...prev, newRipple])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 600)
    
    onClick?.()
  }

  const getVariantColors = () => {
    switch (variant) {
      case "success": return "bg-green-400/30"
      case "warning": return "bg-yellow-400/30"
      case "destructive": return "bg-red-400/30"
      default: return "bg-blue-400/30"
    }
  }

  return (
    <motion.button
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        "hover:scale-105 active:scale-95",
        className
      )}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className={cn("absolute rounded-full pointer-events-none", getVariantColors())}
            style={{
              left: ripple.x - 25,
              top: ripple.y - 25,
              width: 50,
              height: 50
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  )
}

// Progress ring with animation
export const ProgressRing = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  className 
}: { 
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={cn("relative", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="text-blue-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          className="text-2xl font-bold"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
    </div>
  )
}

// Pulse indicator for active states
export const PulseIndicator = ({ 
  active = false, 
  color = "blue",
  size = "md"
}: { 
  active?: boolean
  color?: "blue" | "green" | "red" | "yellow" | "purple"
  size?: "sm" | "md" | "lg"
}) => {
  const getColorClasses = () => {
    switch (color) {
      case "green": return "bg-green-500"
      case "red": return "bg-red-500"
      case "yellow": return "bg-yellow-500"
      case "purple": return "bg-purple-500"
      default: return "bg-blue-500"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm": return "w-2 h-2"
      case "lg": return "w-4 h-4"
      default: return "w-3 h-3"
    }
  }

  if (!active) {
    return (
      <div className={cn(
        "rounded-full opacity-50",
        getColorClasses(),
        getSizeClasses()
      )} />
    )
  }

  return (
    <div className="relative">
      <motion.div
        className={cn(
          "rounded-full",
          getColorClasses(),
          getSizeClasses()
        )}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full opacity-40",
          getColorClasses()
        )}
        animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
    </div>
  )
}

// Morphing button states
export const MorphingButton = ({ 
  children, 
  isLoading = false,
  isSuccess = false,
  className,
  ...props 
}: { 
  children: React.ReactNode
  isLoading?: boolean
  isSuccess?: boolean
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <motion.button
      className={cn(
        "relative px-6 py-3 rounded-lg font-medium transition-all duration-300",
        "bg-blue-500 hover:bg-blue-600 text-white",
        className
      )}
      layout
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Loading...
          </motion.div>
        ) : isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              ✓
            </motion.div>
            Success!
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// Typing animation for text
export const TypingText = ({ 
  text, 
  speed = 50,
  className 
}: { 
  text: string
  speed?: number
  className?: string
}) => {
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    setDisplayText('')
    let currentIndex = 0
    
    const timer = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1"
      >
        |
      </motion.span>
    </span>
  )
}

// Success checkmark animation
export const SuccessCheckmark = ({ 
  visible = false, 
  size = 24 
}: { 
  visible?: boolean
  size?: number
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="flex items-center justify-center"
        >
          <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className="text-green-500"
          >
            <motion.path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Interactive Card component
export const InteractiveCard = ({ 
  children, 
  className = "", 
  onClick,
  ...props 
}: { 
  children: React.ReactNode
  className?: string
  onClick?: () => void
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <motion.div
      onClick={onClick}
      className={`border rounded-lg transition-all duration-200 ${className}`}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)" 
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Ripple Effect component for interactive elements
export const RippleEffect = ({ 
  children, 
  onClick,
  className = "",
  ...props 
}: { 
  children: React.ReactNode
  onClick?: () => void
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newRipple = { id: Date.now(), x, y }
    setRipples(prev => [...prev, newRipple])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)
    
    onClick?.()
  }

  return (
    <motion.div
      onClick={handleClick}
      className={`relative overflow-hidden cursor-pointer ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x - 50,
              top: ripple.y - 50,
              width: 100,
              height: 100,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}