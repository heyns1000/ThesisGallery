import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from '@/lib/utils'
import { SparkleEffect, PulseIndicator } from './micro-interactions'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  pulse?: boolean
  sparkle?: boolean
  delay?: number
  onClick?: () => void
}

export const AnimatedCard = ({ 
  children, 
  className,
  hover = true, 
  pulse = false,
  sparkle = false,
  delay = 0,
  onClick
}: AnimatedCardProps) => {
  const CardComponent = onClick ? motion.div : Card

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      className={cn("transition-all duration-200", className)}
      onClick={onClick}
    >
      <SparkleEffect trigger={sparkle}>
        <Card className={cn(
          "relative overflow-hidden",
          hover && "hover:shadow-lg",
          onClick && "cursor-pointer"
        )}>
          {pulse && (
            <div className="absolute top-3 right-3">
              <PulseIndicator active={true} color="green" size="sm" />
            </div>
          )}
          {children}
        </Card>
      </SparkleEffect>
    </motion.div>
  )
}

export const AnimatedCardHeader = ({ children, ...props }: React.ComponentProps<typeof CardHeader>) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
  >
    <CardHeader {...props}>
      {children}
    </CardHeader>
  </motion.div>
)

export const AnimatedCardContent = ({ children, ...props }: React.ComponentProps<typeof CardContent>) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
  >
    <CardContent {...props}>
      {children}
    </CardContent>
  </motion.div>
)