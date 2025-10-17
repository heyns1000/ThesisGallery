import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Globe, Search, Star, Package, Zap, CheckCircle, ArrowRight } from "lucide-react"

export function VaultMeshBrandPackages() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSector, setSelectedSector] = useState("all")
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  const { data: brands = [] } = useQuery<any[]>({
    queryKey: ["/api/brands"],
  })

  const { data: sectors = [] } = useQuery<any[]>({
    queryKey: ["/api/sectors"],
  })

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

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSector = selectedSector === "all" || brand.sectorId?.toString() === selectedSector
    return matchesSearch && matchesSector
  })

  const handleRedirectToCheckout = (packageId: string) => {
    window.open("https://banimal.co.za/vaultmesh-checkout?package=" + packageId, "_blank");
  }

  return (
    <div className="space-y-6" data-testid="vaultmesh-brand-packages-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" data-testid="heading-brand-packages">VaultMesh™ Brand Packages</h2>
          <p className="text-muted-foreground" data-testid="text-brand-packages-description">
            Secure and scalable infrastructure for your brand ecosystem
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brandPackages.map((pkg) => (
          <Card 
            key={pkg.id}
            className={`relative ${pkg.recommended ? 'border-2 border-cyan-500' : ''}`}
            data-testid={`card-package-${pkg.id}`}
          >
            {pkg.recommended && (
              <Badge className="absolute -top-3 right-4 bg-cyan-500" data-testid={`badge-recommended-${pkg.id}`}>
                <Star className="h-3 w-3 mr-1" />
                Recommended
              </Badge>
            )}
            {pkg.popular && (
              <Badge className="absolute -top-3 right-4 bg-purple-500" data-testid={`badge-popular-${pkg.id}`}>
                Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2" data-testid={`heading-package-${pkg.id}`}>
                <Package className="h-5 w-5 text-cyan-500" />
                {pkg.name}
              </CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold" data-testid={`text-price-${pkg.id}`}>${pkg.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground" data-testid={`text-brand-limit-${pkg.id}`}>
                Up to {pkg.brandLimit} brands
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2" data-testid={`feature-${pkg.id}-${index}`}>
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-6"
                variant={pkg.recommended ? "default" : "outline"}
                onClick={() => handleRedirectToCheckout(pkg.id)}
                data-testid={`button-select-${pkg.id}`}
              >
                Select Package
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4" data-testid="heading-your-brands">Your Brands</h3>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-brands"
            />
          </div>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-[200px]" data-testid="select-sector">
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent data-testid="select-content-sector">
              <SelectItem value="all" data-testid="select-item-all">All Sectors</SelectItem>
              {sectors.map((sector: any) => (
                <SelectItem key={sector.id} value={sector.id.toString()} data-testid={`select-item-${sector.id}`}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBrands.length > 0 ? (
            filteredBrands.map((brand: any) => (
              <Card key={brand.id} data-testid={`card-brand-${brand.id}`}>
                <CardHeader>
                  <CardTitle className="text-lg" data-testid={`text-brand-name-${brand.id}`}>{brand.name}</CardTitle>
                  <Badge variant="outline" data-testid={`badge-brand-sector-${brand.id}`}>
                    {sectors.find((s: any) => s.id === brand.sectorId)?.name || "Unknown"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground" data-testid={`text-brand-description-${brand.id}`}>
                    {brand.description}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8" data-testid="text-no-brands">
              <p className="text-muted-foreground">No brands found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
