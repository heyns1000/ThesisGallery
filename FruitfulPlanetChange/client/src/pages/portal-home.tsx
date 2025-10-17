import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Rocket, HelpCircle, Plus, CreditCard, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SearchFilters } from "@/components/portal/search-filters"
import { InteractiveBrandCard } from "@/components/interactive-brand-card"
import { GlobalButtonActivator } from "@/components/global-button-activator"
import { DatabaseIntegrationStatus } from "@/components/database-integration-status"
import { FruitfulMarketplaceIntegration } from "@/components/fruitful-marketplace-integration"
import { CloudflareSyncManager } from "@/components/cloudflare-sync-manager"
import { motion } from "framer-motion"
import { MorphingButton, SparkleEffect, PulseIndicator } from "@/components/ui/micro-interactions"
import QuantifiedSidebarMenu from "@/components/QuantifiedSidebarMenu"
import type { Brand, Sector } from "@shared/schema"

export default function PortalHome() {
  console.log("🏠 PortalHome component rendering");
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSector, setSelectedSector] = useState<number | null>(null)
  const [displayLimit, setDisplayLimit] = useState(8)

  // Build query parameters with performance limits
  const queryParams = new URLSearchParams()
  if (searchQuery) queryParams.set("search", searchQuery)
  if (selectedSector) queryParams.set("sectorId", selectedSector.toString())
  queryParams.set("limit", "20") // Limit to 20 brands for better performance

  // REAL DATABASE QUERIES - Connected to PostgreSQL with 3794+ total elements
  const { data: brands = [], isLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands", queryParams.toString()],
    staleTime: 30000,
    refetchInterval: 30000, // Live data refresh every 30 seconds
  })

  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
    staleTime: 30000,
    refetchInterval: 30000, // Live data refresh
  })
  
  // Additional live database connections for complete portal functionality
  const { data: systemStatus = [] } = useQuery({
    queryKey: ["/api/system-status"],
    staleTime: 5000,
    refetchInterval: 5000, // Real-time system monitoring
  })

  const { data: dashboardStats = {} } = useQuery({
    queryKey: ["/api/dashboard/stats"], 
    staleTime: 30000,
    refetchInterval: 30000,
  })

  // Create sector lookup map
  const sectorMap = sectors.reduce((map, sector) => {
    map[sector.id] = sector
    return map
  }, {} as Record<number, Sector>)

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
        searchInput?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const displayedBrands = brands.slice(0, displayLimit)
  const remainingCount = brands.length - displayLimit

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'block' }}>
      {/* Global Button Activation System - Makes ALL buttons functional */}
      <GlobalButtonActivator />
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Fruitful Global Brand Portal
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete ecosystem with {(dashboardStats as any)?.totalElements || brands.length} brands across {sectors.length || 48} sectors connected to PostgreSQL database, SecureSign™ VIP, and deployment infrastructure
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              VaultMesh™ Secured
            </div>
            <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
              FG
            </div>
          </div>
        </div>
      </header>

      {/* Quantified Sidebar Menu - Live Sidebar Items with Metadata */}
      <section className="p-6">
        <QuantifiedSidebarMenu />
      </section>

      {/* ClaimRoot Checkout Integration */}
      <section className="p-6">
        <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-400">
              <Shield className="w-6 h-6 mr-2" />
              🧬 ClaimRoot License Checkout
            </CardTitle>
            <CardDescription>
              VaultLevel 7 licensing system now available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              Secure scroll-compliant licensing for Technology sector with full FAA-X13 treaty compliance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => window.open('/#/claimroot-checkout', '_blank')}
                className="bg-amber-500 hover:bg-amber-600 text-black"
              >
                React Checkout Portal
              </Button>
              <Button 
                onClick={() => window.open('/checkout.html', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Standalone HTML Checkout
              </Button>
              <a 
                href="https://www.paypal.com/ncp/payment/K9BPET82JDRQ4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-medium rounded-lg transition-all"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Direct Purchase - $1,140 USD
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Dynamic Button Repair Engine */}
      <section className="p-6">
        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-400">
              <Shield className="w-6 h-6 mr-2" />
              🔧 Dynamic Button Repair Engine
            </CardTitle>
            <CardDescription>
              AI-powered button monitoring and auto-repair system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              Real-time scanning with intelligent repair suggestions for all UI buttons across the ecosystem.
            </p>
            <Button 
              onClick={() => window.open('/#/button-repair-dashboard', '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Open Repair Dashboard
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Database Integration Status - Shows PostgreSQL Connection */}
      <section className="p-6">
        <DatabaseIntegrationStatus />
      </section>

      {/* Cloudflare Workers Data Sync Manager */}
      <section className="p-6">
        <CloudflareSyncManager />
      </section>

      {/* Fruitful Global Marketplace - Real Products from Database */}
      <section className="p-6 border-t border-gray-200 dark:border-gray-700">
        <FruitfulMarketplaceIntegration />
      </section>

      {/* Search and Filters */}
      <section className="p-6">
        <SearchFilters
          onSearch={setSearchQuery}
          onSectorFilter={setSelectedSector}
          selectedSector={selectedSector}
        />
      </section>

      {/* Brand Elements Grid */}
      <section className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Brand Elements
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore and discover brand elements across all sectors
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedBrands.map((brand, index) => (
              <div key={brand.id}>
                <InteractiveBrandCard
                  brand={brand}
                  sector={brand.sectorId ? sectorMap[brand.sectorId] : undefined}
                />
              </div>
            ))}

            {/* Load More Button */}
            {remainingCount > 0 && (
              <div className="col-span-full flex justify-center mt-8">
                <Button
                  onClick={() => setDisplayLimit(prev => prev + 8)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Load More Brands ({remainingCount.toLocaleString()}+ remaining)
                </Button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="p-6">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to Get Started?</h2>
              <p className="opacity-90">
                Explore the full ecosystem or connect with our development team.
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                className="bg-white text-cyan-500 hover:bg-gray-100"
                onClick={() => {
                  console.log("🚀 Launching new project...")
                  window.open("/dashboard", "_blank")
                }}
              >
                <Rocket className="w-4 h-4 mr-2" />
                Launch Project
              </Button>
              <Button
                variant="ghost"
                className="bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30"
                onClick={() => {
                  console.log("❓ Opening support portal...")
                  window.open("mailto:support@seedwave.com", "_blank")
                }}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Get Support
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
