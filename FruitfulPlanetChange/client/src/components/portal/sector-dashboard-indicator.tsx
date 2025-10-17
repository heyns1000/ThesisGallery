import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Database } from "lucide-react"
import type { Sector } from "@shared/schema"

interface SectorDashboardIndicatorProps {
  sector: Sector
  className?: string
}

export function SectorDashboardIndicator({ sector, className = "" }: SectorDashboardIndicatorProps) {
  const brandCount = sector.brandCount || 0
  const subnodeCount = sector.subnodeCount || 0
  const totalElements = brandCount + subnodeCount
  
  // Determine dashboard status
  const getDashboardStatus = () => {
    if (totalElements > 100) {
      return {
        status: 'enterprise',
        label: 'Enterprise Ready',
        color: 'bg-purple-500',
        icon: Database,
        description: `${totalElements} elements`
      }
    } else if (totalElements > 20) {
      return {
        status: 'active',
        label: 'Fully Active',
        color: 'bg-green-500',
        icon: CheckCircle,
        description: `${totalElements} elements`
      }
    } else if (totalElements > 0) {
      return {
        status: 'operational',
        label: 'Operational',
        color: 'bg-blue-500',
        icon: CheckCircle,
        description: `${totalElements} elements`
      }
    } else {
      return {
        status: 'ready',
        label: 'Dashboard Ready',
        color: 'bg-gray-500',
        icon: Clock,
        description: 'Available but no data'
      }
    }
  }
  
  const { status, label, color, icon: Icon, description } = getDashboardStatus()
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        className={`w-2 h-2 rounded-full ${color} animate-pulse`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      />
      <Badge 
        variant={status === 'enterprise' ? 'default' : status === 'active' ? 'secondary' : 'outline'} 
        className="text-xs"
      >
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
      <span className="text-xs text-gray-500">{description}</span>
    </div>
  )
}