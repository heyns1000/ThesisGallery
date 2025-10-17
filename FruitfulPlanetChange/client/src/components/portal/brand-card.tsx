import { motion } from "framer-motion"
import { SparkleEffect, PulseIndicator } from "@/components/ui/micro-interactions"
import type { Brand, Sector } from "@shared/schema"

interface BrandCardProps {
  brand: Brand
  sector?: Sector
  onClick?: () => void
}

export function BrandCard({ brand, sector, onClick }: BrandCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "maintenance":
        return "bg-yellow-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "maintenance":
        return "Maintenance" 
      case "offline":
        return "Offline"
      default:
        return "Unknown"
    }
  }

  const getIntegrationBadgeColor = (integration: string) => {
    switch (integration) {
      case "VaultMesh™":
        return "bg-gradient-to-r from-cyan-500 to-blue-500"
      case "PulseGrid™":
        return "bg-gradient-to-r from-purple-500 to-pink-500"
      case "HotStack":
        return "bg-gradient-to-r from-orange-500 to-red-500"
      case "FAA.Zone™":
        return "bg-gradient-to-r from-green-500 to-teal-500"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600"
    }
  }

  // Parse metadata for enhanced display (from HTML data integration)
  const metadata = brand.metadata as any
  const hasAdvancedMetrics = metadata?.productId && metadata?.activeNodes
  
  return (
    <div
      onClick={onClick}
      className="brand-card bg-white dark:bg-gray-800 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-200 dark:border-gray-700 hover:border-cyan-500"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          {sector?.emoji || "🧩"}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={`
            text-xs text-white px-2 py-1 rounded-full font-semibold
            ${getIntegrationBadgeColor(brand.integration)}
          `}>
            {brand.integration}
          </div>
          {hasAdvancedMetrics && (
            <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
              {metadata.securityRating}
            </div>
          )}
        </div>
      </div>
      
      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{brand.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {brand.description}
      </p>
      
      {/* Show advanced metrics from Wildlife HTML data */}
      {hasAdvancedMetrics && (
        <div className="space-y-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600 dark:text-gray-400">Active Nodes:</span>
            <span className="font-mono font-bold text-blue-600">{metadata.activeNodes}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600 dark:text-gray-400">Pulse Activity:</span>
            <span className="font-mono font-bold text-green-600">{metadata.currentPulseActivity}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600 dark:text-gray-400">Data Volume:</span>
            <span className="font-mono font-bold text-purple-600">{metadata.dataVolumeProcessed}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600 dark:text-gray-400">Vault ID:</span>
            <span className="font-mono text-xs text-gray-500">{metadata.vaultId}</span>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">
          {sector?.emoji} {sector?.name || 'Unknown Sector'}
        </span>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(brand.status)}`} />
          <span className="text-xs text-gray-500">{getStatusText(brand.status)}</span>
        </div>
      </div>
    </div>
  )
}
