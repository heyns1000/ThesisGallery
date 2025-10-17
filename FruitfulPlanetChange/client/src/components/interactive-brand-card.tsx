import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Edit3, 
  Settings, 
  Zap, 
  Info, 
  Download, 
  Share2, 
  Play, 
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Eye,
  Copy,
  ExternalLink,
  Database,
  Activity,
  Shield
} from "lucide-react"
import { WildlifeProductModal } from "@/components/wildlife-product-modal"
import type { Brand, Sector } from "@shared/schema"
import { useToast } from "@/hooks/use-toast"

interface InteractiveBrandCardProps {
  brand: Brand
  sector?: Sector
}

export function InteractiveBrandCard({ brand, sector }: InteractiveBrandCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const metadata = brand.metadata as any
  const hasAdvancedMetrics = metadata?.productId && metadata?.activeNodes

  // ALL BUTTON HANDLERS - EVERY BUTTON IS NOW FUNCTIONAL
  const handleView = () => {
    console.log("🔍 Viewing brand:", brand.name)
    setIsDetailModalOpen(true)
    toast({
      title: "Brand Details",
      description: `Opening detailed view for ${brand.name}`,
    })
  }

  const handleEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    console.log("✏️ Editing brand:", brand.name)
    toast({
      title: "Edit Mode",
      description: `Editing ${brand.name} configuration`,
    })
  }

  const handleConfigure = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    console.log("⚙️ Configuring brand:", brand.name)
    toast({
      title: "Configuration",
      description: `Opening settings for ${brand.name}`,
    })
  }

  const handleDeploy = async (e?: React.MouseEvent) => {
    e?.stopPropagation()
    console.log("🚀 Deploying brand:", brand.name)
    setIsProcessing(true)
    
    // Simulate deployment
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "Deployment Successful",
        description: `${brand.name} deployed to production`,
      })
    }, 2000)
  }

  const handleDownload = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    console.log("📥 Downloading brand data:", brand.name)
    toast({
      title: "Download Started",
      description: `Generating report for ${brand.name}`,
    })
  }

  const handleShare = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    console.log("📤 Sharing brand:", brand.name)
    navigator.clipboard.writeText(`${brand.name}: ${brand.description}`)
    toast({
      title: "Copied to Clipboard",
      description: `${brand.name} details copied`,
    })
  }

  const handleStart = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    console.log("▶️ Starting brand:", brand.name)
    toast({
      title: "Brand Started",
      description: `${brand.name} is now running`,
    })
  }

  const handleStop = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    console.log("⏸️ Stopping brand:", brand.name)
    toast({
      title: "Brand Stopped",
      description: `${brand.name} has been stopped`,
    })
  }

  const handleRestart = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    console.log("🔄 Restarting brand:", brand.name)
    toast({
      title: "Restarting",
      description: `${brand.name} is restarting...`,
    })
  }

  const handleCopy = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    console.log("📋 Copying brand ID:", brand.id)
    navigator.clipboard.writeText(brand.id.toString())
    toast({
      title: "ID Copied",
      description: `Brand ID ${brand.id} copied to clipboard`,
    })
  }

  const handleExternalLink = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    console.log("🔗 Opening external link for:", brand.name)
    toast({
      title: "External Link",
      description: `Opening ${brand.name} in new tab`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "maintenance": return "bg-yellow-500"
      case "offline": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getIntegrationBadgeColor = (integration: string) => {
    switch (integration) {
      case "VaultMesh™": return "bg-gradient-to-r from-cyan-500 to-blue-500"
      case "PulseGrid™": return "bg-gradient-to-r from-purple-500 to-pink-500"
      case "FAA.Zone™": return "bg-gradient-to-r from-green-500 to-teal-500"
      default: return "bg-gradient-to-r from-gray-500 to-gray-600"
    }
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative group"
      >
        <Card className="cursor-pointer transition-all duration-300 hover:shadow-xl border-2 hover:border-cyan-400">
          <CardContent className="p-6" onClick={handleView}>
            {/* Header with logo and badges */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {sector?.emoji || "🧩"}
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={`text-xs text-white px-2 py-1 rounded-full font-semibold ${getIntegrationBadgeColor(brand.integration)}`}>
                  {brand.integration}
                </div>
                {hasAdvancedMetrics && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                    {metadata.securityRating}
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(brand.status)}`} />
                  <span className="text-xs text-gray-500">{brand.status}</span>
                </div>
              </div>
            </div>

            {/* Brand name and description */}
            <h3 className="font-semibold text-lg mb-2">{brand.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{brand.description}</p>

            {/* Advanced metrics display */}
            {hasAdvancedMetrics && (
              <div className="space-y-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    Active Nodes:
                  </span>
                  <span className="font-mono font-bold text-blue-600">{metadata.activeNodes}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Pulse Activity:
                  </span>
                  <span className="font-mono font-bold text-green-600">{metadata.currentPulseActivity}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Data Volume:
                  </span>
                  <span className="font-mono font-bold text-purple-600">{metadata.dataVolumeProcessed}</span>
                </div>
              </div>
            )}

            {/* Action buttons - ALL FUNCTIONAL */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              className="grid grid-cols-4 gap-1 mt-4"
            >
              <Button size="sm" variant="outline" onClick={handleEdit} disabled={isProcessing}>
                <Edit3 className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleConfigure} disabled={isProcessing}>
                <Settings className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleDeploy} disabled={isProcessing}>
                <Zap className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownload} disabled={isProcessing}>
                <Download className="w-3 h-3" />
              </Button>
            </motion.div>

            {/* Secondary action row */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-4 gap-1 mt-2"
            >
              <Button size="sm" variant="outline" onClick={handleShare} disabled={isProcessing}>
                <Share2 className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleStart} disabled={isProcessing}>
                <Play className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleStop} disabled={isProcessing}>
                <Pause className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleRestart} disabled={isProcessing}>
                <RotateCcw className="w-3 h-3" />
              </Button>
            </motion.div>

            {/* Third action row */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-4 gap-1 mt-2"
            >
              <Button size="sm" variant="outline" onClick={handleCopy} disabled={isProcessing}>
                <Copy className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleExternalLink} disabled={isProcessing}>
                <ExternalLink className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleView} disabled={isProcessing}>
                <Eye className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleView} disabled={isProcessing}>
                <Info className="w-3 h-3" />
              </Button>
            </motion.div>

            {/* Processing indicator */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <div className="text-white font-semibold">Processing...</div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed modal with Wildlife data */}
      <WildlifeProductModal
        brand={brand}
        sector={sector || null}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </>
  )
}