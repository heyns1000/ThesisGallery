import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search, ExternalLink, Crown, Trophy, Users, Zap, Target, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FRUITFUL_CRATE_DANCE_ECOSYSTEM, FRUITFUL_CRATE_DANCE_SECTORS } from "@shared/fruitful-crate-dance-ecosystem"
import { ClickableBrandName } from "@/components/clickable-brand-name"

export function FruitfulCrateDancePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSector, setSelectedSector] = useState<string | null>(null)

  // Calculate total brand count
  const totalBrands = Object.values(FRUITFUL_CRATE_DANCE_SECTORS).reduce(
    (sum, sector) => sum + sector.brands.length, 
    0
  )

  const filteredSectors = Object.entries(FRUITFUL_CRATE_DANCE_SECTORS).filter(([key, sector]) => {
    if (!searchQuery) return true
    return sector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           sector.brands.some(brand => brand.toLowerCase().includes(searchQuery.toLowerCase()))
  })

  const kingPriceSponsorship = {
    packages: [
      { tier: "Platinum", amount: "R1.5 Million", features: ["Title Sponsorship", "Car Giveaway", "2M Impressions", "20K Sign-ups"] },
      { tier: "Gold", amount: "R750,000", features: ["Co-Sponsorship", "Regional Crates", "1M Impressions", "10K Sign-ups"] },
      { tier: "Silver", amount: "R300,000", features: ["Branded Crates", "QR Promotions", "500K Impressions", "5K Sign-ups"] }
    ]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          Fruitful Crate Dance Showcase
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Comprehensive Brand Management Ecosystem for www.fruitfulcratedance.com
        </p>
        <div className="flex justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-orange-500" />
            <span>{totalBrands} Total Brands</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span>A-Z Deployment Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>King Price Partnership</span>
          </div>
        </div>
      </div>

      {/* King Price Sponsorship Overview */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <Crown className="h-5 w-5" />
            King Price Insurance Partnership
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {kingPriceSponsorship.packages.map((pkg, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 border-red-200 dark:border-red-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{pkg.tier} Tier</CardTitle>
                  <div className="text-2xl font-bold text-red-600">{pkg.amount}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-red-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search brands, sectors, or capabilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Infrastructure Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Primary Domain</p>
                <p className="text-lg font-semibold">fruitfulcratedance.com</p>
              </div>
              <ExternalLink className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Brands</p>
                <p className="text-lg font-semibold">{totalBrands}</p>
              </div>
              <Trophy className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Sectors</p>
                <p className="text-lg font-semibold">{Object.keys(FRUITFUL_CRATE_DANCE_SECTORS).length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Deployment</p>
                <p className="text-lg font-semibold">Ready</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Sectors */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Brand Ecosystem Sectors</h2>
        <div className="grid gap-6">
          {filteredSectors.map(([sectorKey, sector]) => (
            <Card key={sectorKey} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{sector.name}</span>
                  <Badge variant="outline">{sector.brands.length} brands</Badge>
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300">{sector.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {sector.brands.slice(0, 9).map((brand, index) => (
                    <ClickableBrandName 
                      key={index}
                      brandName={brand}
                      variant="button"
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    />
                  ))}
                  {sector.brands.length > 9 && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        +{sector.brands.length - 9} more brands
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Deployment Infrastructure */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Infrastructure</CardTitle>
          <p className="text-gray-600 dark:text-gray-300">
            Complete A-Z deployment infrastructure for www.fruitfulcratedance.com
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(FRUITFUL_CRATE_DANCE_ECOSYSTEM.deploymentInfrastructure).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <ExternalLink className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="text-center bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <CardContent className="pt-6">
          <h3 className="text-2xl font-bold mb-2">Ready for Full Deployment</h3>
          <p className="mb-4 opacity-90">
            {totalBrands} carefully curated brands across {Object.keys(FRUITFUL_CRATE_DANCE_SECTORS).length} sectors, 
            ready for complete A-Z deployment and management
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <strong>King Price Partnership Ready</strong>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <strong>Full Infrastructure Deployed</strong>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <strong>Community Impact Focused</strong>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}