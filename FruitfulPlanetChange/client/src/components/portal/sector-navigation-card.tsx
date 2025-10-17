import { motion } from "framer-motion"
import { useLocation } from "wouter"
import { ChevronRight, ExternalLink } from "lucide-react"
import { InteractiveCard, SparkleEffect } from "@/components/ui/micro-interactions"
import { Badge } from "@/components/ui/badge"
import { SectorDashboardIndicator } from "./sector-dashboard-indicator"
import type { Sector } from "@shared/schema"

interface SectorNavigationCardProps {
  sector: Sector
  className?: string
}

export function SectorNavigationCard({ sector, className = "" }: SectorNavigationCardProps) {
  const [, setLocation] = useLocation()

  const handleNavigation = () => {
    setLocation(`/sector/${sector.id}`)
  }

  const metadata = sector.metadata as any || {}
  const colors = {
    primary: metadata.color || '#3b82f6',
    secondary: metadata.secondaryColor || '#1d4ed8',
    accent: metadata.accentColor || '#f59e0b',
    gradient: `linear-gradient(135deg, ${metadata.color || '#3b82f6'}, ${metadata.secondaryColor || '#1d4ed8'})`
  }

  return (
    <InteractiveCard 
      className={`p-6 cursor-pointer group relative overflow-hidden ${className}`}
      onClick={handleNavigation}
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{ background: colors.gradient }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.div 
            className="text-4xl mb-2"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {sector.emoji}
          </motion.div>
          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            whileHover={{ scale: 1.1 }}
          >
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>

        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {sector.name}
        </h3>
        
        {sector.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {sector.description}
          </p>
        )}
        
        {/* Dashboard Status Indicator */}
        <div className="mb-4">
          <SectorDashboardIndicator sector={sector} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {sector.brandCount && sector.brandCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {sector.brandCount} brands
              </Badge>
            )}
            {sector.subnodeCount && sector.subnodeCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {sector.subnodeCount} subnodes
              </Badge>
            )}
            {(!sector.brandCount || sector.brandCount === 0) && (
              <Badge variant="destructive" className="text-xs opacity-60">
                Dashboard Ready
              </Badge>
            )}
          </div>
          
          <motion.div
            className="flex items-center text-sm text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            whileHover={{ x: 5 }}
          >
            <span className="mr-1">{sector.brandCount && sector.brandCount > 0 ? 'Explore' : 'Access'}</span>
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>

      {/* Hover effect - using simple div instead of SparkleEffect to avoid prop issues */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 blur-xl" />
      </div>
    </InteractiveCard>
  )
}