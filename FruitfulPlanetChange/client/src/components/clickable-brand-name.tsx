import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { WildlifeProductModal } from "@/components/wildlife-product-modal"
import { useToast } from "@/hooks/use-toast"
import type { Brand, Sector } from "@shared/schema"

interface ClickableBrandNameProps {
  brandName: string
  className?: string
  showBadge?: boolean
  variant?: "default" | "button" | "link"
}

// Mock brand data for demonstration - in production this would come from API
const createMockBrand = (name: string): Brand => ({
  id: Math.floor(Math.random() * 10000),
  name,
  description: `Complete ${name} integration with advanced features and real-time processing capabilities`,
  status: "active" as const,
  integration: name.includes("King") ? "King Price™" : name.includes("Royal") ? "VaultMesh™" : "FAA.Zone™",
  sectorId: 147, // Wildlife & Habitat sector
  metadata: {
    productId: `PROD-${name.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9999)}`,
    vaultId: `VAULT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    securityRating: "FAA-SEC A+",
    activeNodes: (Math.floor(Math.random() * 5000) + 1000).toLocaleString(),
    complianceStatus: "Active & Certified",
    currentPulseActivity: `${Math.floor(Math.random() * 100000).toLocaleString()} pulses/sec`,
    dataVolumeProcessed: `${(Math.random() * 100).toFixed(2)} TB`,
    lastAudit: "2025-07-20"
  }
})

const mockSector: Sector = {
  id: 147,
  name: "🏆 Sponsorship Management",
  emoji: "🏆",
  description: "Complete sponsorship lifecycle management",
  brandCount: 20,
  subnodeCount: 60,
  metadata: {}
}

export function ClickableBrandName({ brandName, className = "", showBadge = false, variant = "default" }: ClickableBrandNameProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [brand] = useState(() => createMockBrand(brandName))
  const { toast } = useToast()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("🔍 Opening product details for:", brandName)
    setIsModalOpen(true)
    toast({
      title: "Product Details",
      description: `Loading detailed information for ${brandName}`,
    })
  }

  const baseStyles = "cursor-pointer transition-all duration-200 hover:scale-105"
  
  const variantStyles = {
    default: "text-gray-700 hover:text-cyan-600 hover:underline",
    button: "bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm hover:bg-orange-100 hover:shadow-md",
    link: "text-blue-600 hover:text-blue-800 hover:underline font-medium"
  }

  return (
    <>
      <span
        onClick={handleClick}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick(e as any)
          }
        }}
      >
        {brandName}
        {showBadge && (
          <Badge variant="secondary" className="ml-2 text-xs">
            View Details
          </Badge>
        )}
      </span>

      <WildlifeProductModal
        brand={brand}
        sector={mockSector}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}