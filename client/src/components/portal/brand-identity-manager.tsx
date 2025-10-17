import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Shield, 
  TrendingUp, 
  Award, 
  Sparkles, 
  Crown,
  FileText,
  CheckCircle,
  AlertCircle,
  Search,
  Plus,
  ExternalLink
} from "lucide-react"

interface Brand {
  id: number
  name: string
  symbol: string
  category: string
  status: string
  description: string
  protectionLevel: string
  registrationDate: string
  expiryDate: string
  territories: string[]
  owner: string
  associatedEntities: string[]
}

export function BrandIdentityManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const { data: brands = [], isLoading } = useQuery<Brand[]>({
    queryKey: ["/api/admin-panel/brands"]
  })

  const categories = [
    { id: "all", label: "All Brands", icon: Award },
    { id: "trademark", label: "Trademarks", icon: Shield },
    { id: "product", label: "Product Brands", icon: Sparkles },
    { id: "service", label: "Service Brands", icon: TrendingUp },
    { id: "platform", label: "Platform Brands", icon: Crown }
  ]

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         brand.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         brand.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || brand.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "registered": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "expired": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getProtectionIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "full": return <Shield className="w-5 h-5 text-green-500" />
      case "partial": return <Shield className="w-5 h-5 text-yellow-500" />
      case "pending": return <Shield className="w-5 h-5 text-blue-500" />
      default: return <Shield className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="heading-brand-identity-manager">
              Brand Identity Manager
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Seedwave™ Trademark & Brand Protection Portal
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200" data-testid="badge-protection-active">
              <Shield className="w-3 h-3 mr-1" />
              {brands.filter(b => b.status.toLowerCase() === "registered").length} Protected
            </Badge>
            <Button 
              size="sm" 
              className="flex items-center gap-2"
              data-testid="button-add-brand"
            >
              <Plus className="w-4 h-4" />
              Add Brand
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search brands, trademarks, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-brands"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                  data-testid={`button-filter-${category.id}`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Brands</p>
                  <p className="text-2xl font-bold" data-testid="text-total-brands">{brands.length}</p>
                </div>
                <Award className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Registered</p>
                  <p className="text-2xl font-bold" data-testid="text-registered-brands">{brands.filter(b => b.status.toLowerCase() === "registered").length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold" data-testid="text-pending-brands">{brands.filter(b => b.status.toLowerCase() === "pending").length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                  <p className="text-2xl font-bold" data-testid="text-total-categories">{new Set(brands.map(b => b.category)).size}</p>
                </div>
                <Sparkles className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Brands Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400" data-testid="text-loading-brands">Loading brands...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredBrands.map((brand) => (
              <Card key={brand.id} className="hover:shadow-lg transition-shadow" data-testid={`card-brand-${brand.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getProtectionIcon(brand.protectionLevel)}
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span data-testid={`text-brand-name-${brand.id}`}>{brand.name}</span>
                          <span className="text-sm font-normal text-gray-500" data-testid={`text-brand-symbol-${brand.id}`}>{brand.symbol}</span>
                        </CardTitle>
                        <CardDescription className="mt-1">{brand.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(brand.status)} data-testid={`badge-brand-status-${brand.id}`}>
                        {brand.status}
                      </Badge>
                      <Badge variant="outline" data-testid={`badge-brand-category-${brand.id}`}>{brand.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Protection Level:</span>
                        <p className="font-medium capitalize" data-testid={`text-protection-level-${brand.id}`}>{brand.protectionLevel}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Owner:</span>
                        <p className="font-medium" data-testid={`text-brand-owner-${brand.id}`}>{brand.owner}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Registration Date:</span>
                        <p className="font-medium" data-testid={`text-registration-date-${brand.id}`}>{brand.registrationDate}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Expiry Date:</span>
                        <p className="font-medium" data-testid={`text-expiry-date-${brand.id}`}>{brand.expiryDate}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Territories:</span>
                      <div className="flex flex-wrap gap-2">
                        {brand.territories.map((territory, idx) => (
                          <Badge key={idx} variant="secondary" data-testid={`badge-territory-${brand.id}-${idx}`}>
                            {territory}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {brand.associatedEntities.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Associated Entities:</span>
                        <div className="flex flex-wrap gap-2">
                          {brand.associatedEntities.map((entity, idx) => (
                            <Badge key={idx} variant="outline" data-testid={`badge-entity-${brand.id}-${idx}`}>
                              {entity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-2"
                        data-testid={`button-view-details-${brand.id}`}
                      >
                        <FileText className="w-4 h-4" />
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-2"
                        data-testid={`button-manage-protection-${brand.id}`}
                      >
                        <Shield className="w-4 h-4" />
                        Manage Protection
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-2"
                        data-testid={`button-view-certificate-${brand.id}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Certificate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredBrands.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2" data-testid="text-no-brands-heading">
              No brands found
            </h3>
            <p className="text-gray-600 dark:text-gray-400" data-testid="text-no-brands-description">
              Try adjusting your search criteria or category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
