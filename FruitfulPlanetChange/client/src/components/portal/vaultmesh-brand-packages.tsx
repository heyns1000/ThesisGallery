import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Globe, Search, Star, Package, Zap, CheckCircle, ArrowRight } from "lucide-react"
import type { Brand, Sector } from "@shared/schema"

export function VaultMeshBrandPackages() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSector, setSelectedSector] = useState("all")
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  })

  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
  })

  // Package definitions for different brand tiers
  const brandPackages = [
    {
      id: "startup",
      name: "Startup Package",
      price: 299,
      brandLimit: 5,
      features: [
        "Basic VaultMesh™ integration",
        "Standard security protocols",
        "Community support",
        "Basic analytics dashboard",
        "Standard deployment tools"
      ],
      recommended: false,
      popular: false
    },
    {
      id: "growth",
      name: "Growth Package", 
      price: 799,
      brandLimit: 25,
      features: [
        "Advanced VaultMesh™ protocols",
        "Enhanced security suite",
        "Priority support",
        "Advanced analytics & insights",
        "Custom integrations",
        "Multi-region deployment",
        "SecureSign™ integration"
      ],
      recommended: false,
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise Package",
      price: 2499,
      brandLimit: 100,
      features: [
        "Full VaultMesh™ infrastructure",
        "Enterprise security suite",
        "24/7 dedicated support",
        "Complete analytics platform",
        "White-label solutions",
        "Global deployment network",
        "Omni Grid™ access",
        "Custom development",
        "Compliance suite",
        "API marketplace access"
      ],
      recommended: true,
      popular: false
    },
    {
      id: "ecosystem",
      name: "Ecosystem Package",
      price: 9999,
      brandLimit: 1000,
      features: [
        "Complete VaultMesh™ ecosystem",
        "Military-grade security",
        "Dedicated infrastructure",
        "Custom analytics platform",
        "Fully white-labeled solution",
        "Private cloud deployment",
        "Custom protocol development",
        "Regulatory compliance suite",
        "Dedicated account management",
        "Research & development access",
        "Quantum-ready protocols"
      ],
      recommended: false,
      popular: false
    }
  ]

  // Filter brands based on search and sector
  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSector = selectedSector === "all" || brand.sectorId?.toString() === selectedSector
    return matchesSearch && matchesSector
  })

  // Group brands by sector for display
  const brandsBySector = sectors.map(sector => ({
    ...sector,
    brands: filteredBrands.filter(brand => brand.sectorId === sector.id)
  })).filter(sector => sector.brands.length > 0)

  const getPackageColor = (packageId: string) => {
    switch (packageId) {
      case "startup": return "border-blue-200 bg-blue-50 dark:bg-blue-900/20"
      case "growth": return "border-green-200 bg-green-50 dark:bg-green-900/20"
      case "enterprise": return "border-purple-200 bg-purple-50 dark:bg-purple-900/20"
      case "ecosystem": return "border-orange-200 bg-orange-50 dark:bg-orange-900/20"
      default: return ""
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">VaultMesh™ Brand Integration Packages</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Comprehensive brand management solutions powered by VaultMesh™ infrastructure.
          Secure, scalable, and compliant brand ecosystems for every business size.
        </p>
      </div>

      {/* Package Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brandPackages.map((pkg) => (
          <Card 
            key={pkg.id}
            className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedPackage === pkg.id 
                ? 'ring-2 ring-cyan-500 shadow-lg' 
                : 'hover:shadow-md'
            } ${getPackageColor(pkg.id)}`}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            {pkg.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-500 text-white px-3 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Recommended
                </Badge>
              </div>
            )}
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-500 text-white px-3 py-1">
                  <Zap className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold">{pkg.name}</CardTitle>
              <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                ${pkg.price.toLocaleString()}
                <span className="text-lg text-gray-500 font-normal">/month</span>
              </div>
              <p className="text-sm text-gray-600">Up to {pkg.brandLimit} brands</p>
            </CardHeader>

            <CardContent>
              <ul className="space-y-2 mb-6">
                {pkg.features.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                {pkg.features.length > 5 && (
                  <li className="text-sm text-gray-500">
                    +{pkg.features.length - 5} more features
                  </li>
                )}
              </ul>

              <Button 
                className={`w-full ${
                  selectedPackage === pkg.id
                    ? 'bg-cyan-500 hover:bg-cyan-600'
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Brand Explorer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-cyan-500" />
            Brand Ecosystem Explorer
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Explore {brands.length} brands across {sectors.length} sectors available for VaultMesh™ integration
          </p>
        </CardHeader>

        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id.toString()}>
                    {sector.emoji} {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand Results */}
          <div className="space-y-6">
            {brandsBySector.map((sector) => (
              <div key={sector.id}>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">{sector.emoji}</span>
                  {sector.name}
                  <Badge variant="outline" className="ml-2">
                    {sector.brands.length} brands
                  </Badge>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sector.brands.map((brand) => (
                    <Card key={brand.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {brand.name}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            VaultMesh™ Ready
                          </Badge>
                        </div>
                        {brand.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {brand.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            ID: {brand.id}
                          </span>
                          <Button size="sm" variant="outline">
                            <ArrowRight className="w-3 h-3 mr-1" />
                            Integrate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">No brands found</h3>
              <p className="text-gray-400">
                Try adjusting your search criteria or explore different sectors
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Package Comparison */}
      {selectedPackage && (
        <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle>Selected Package: {brandPackages.find(pkg => pkg.id === selectedPackage)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-500">
                  {brandPackages.find(pkg => pkg.id === selectedPackage)?.brandLimit}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Brand Limit</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">{filteredBrands.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Available Brands</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">{sectors.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Supported Sectors</div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Button className="bg-cyan-500 hover:bg-cyan-600" size="lg">
                <Globe className="w-4 h-4 mr-2" />
                Start VaultMesh™ Integration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}