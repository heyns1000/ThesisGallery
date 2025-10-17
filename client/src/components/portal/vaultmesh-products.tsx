import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Globe, Zap, Database, Users, Activity, Cpu, Network, Cloud, Lock, CheckCircle, Star, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  category: string
  description: string
  features: string[]
  pricing: string
  status: "Available" | "Beta" | "Coming Soon"
  popular?: boolean
  enterprise?: boolean
}

export function VaultMeshProducts() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { toast } = useToast()

  const handlePurchase = (product: Product) => {
    console.log("🛒 PROCESSING PURCHASE:", product.name, product.pricing)
    
    toast({
      title: "Purchase Initiated",
      description: `Processing payment for ${product.name} at ${product.pricing}. Redirecting to checkout...`,
    })

    window.open("https://banimal.co.za/vaultmesh-purchase?product=" + product.id, "_blank");
  }

  const handleEnterpriseSales = () => {
    console.log("🏢 ENTERPRISE SALES CONTACT REQUEST")
    toast({
      title: "Sales Team Contacted",
      description: "Our enterprise sales team will contact you within 24 hours to discuss custom pricing and implementation.",
    })
  }

  const handleViewEnterpriseFeatures = () => {
    console.log("📋 VIEWING ENTERPRISE FEATURES")
    toast({
      title: "Enterprise Features",
      description: "Redirecting to detailed enterprise feature documentation and pricing guide.",
    })
  }

  const products: Product[] = [
    {
      id: "core-platform",
      name: "VaultMesh™ Core Platform",
      category: "Infrastructure",
      description: "The foundational infrastructure layer providing secure data orchestration and distributed protocols",
      features: [
        "Distributed data integrity protocols",
        "Real-time synchronization engine",
        "Cross-protocol interoperability",
        "Enterprise-grade security",
        "24/7 monitoring and support"
      ],
      pricing: "Custom Enterprise Pricing",
      status: "Available",
      enterprise: true
    },
    {
      id: "omnigrid",
      name: "Omni Grid™",
      category: "Network",
      description: "Distributed, interconnected network layer for real-time synchronization of ecosystem activities",
      features: [
        "Global distributed architecture",
        "Auto-scaling network nodes",
        "Real-time data streaming",
        "Load balancing and failover",
        "Multi-region deployment"
      ],
      pricing: "$499/month",
      status: "Available",
      popular: true
    },
    {
      id: "buildnest",
      name: "BuildNest™",
      category: "Development",
      description: "Comprehensive enterprise solutions platform built on VaultMesh™ infrastructure",
      features: [
        "Rapid application development",
        "Pre-built templates and modules",
        "Custom integration builder",
        "API marketplace access",
        "Developer documentation"
      ],
      pricing: "$299/month",
      status: "Available"
    },
    {
      id: "securesign",
      name: "SecureSign™",
      category: "Security",
      description: "Digital trust and verifiable identity management solution",
      features: [
        "Blockchain-based verification",
        "Multi-factor authentication",
        "Digital signature protocols",
        "Identity verification API",
        "Compliance reporting"
      ],
      pricing: "$199/month",
      status: "Available"
    },
    {
      id: "seedwave",
      name: "Seedwave™ Analytics",
      category: "Analytics",
      description: "Advanced analytics and administrative portal for VaultMesh™ deployments",
      features: [
        "Real-time analytics dashboard",
        "Custom report generation",
        "Performance monitoring",
        "Predictive insights",
        "Data visualization tools"
      ],
      pricing: "$349/month",
      status: "Available"
    },
    {
      id: "baobab-archive",
      name: "Baobab Archive™",
      category: "Compliance",
      description: "Immutable record-keeping and compliance management solution",
      features: [
        "Tamper-proof audit trails",
        "Automated compliance checks",
        "Regulatory reporting",
        "Document versioning",
        "Long-term data retention"
      ],
      pricing: "$399/month",
      status: "Available",
      popular: true
    },
    {
      id: "quantum-ready",
      name: "Quantum-Ready Protocols",
      category: "Advanced",
      description: "Future-proof encryption and security protocols for quantum computing era",
      features: [
        "Post-quantum cryptography",
        "Quantum-resistant algorithms",
        "Future-proof architecture",
        "Advanced threat protection",
        "Research collaboration access"
      ],
      pricing: "Enterprise Only",
      status: "Beta",
      enterprise: true
    }
  ]

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))]

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  return (
    <div className="space-y-6" data-testid="vaultmesh-products-container">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold" data-testid="heading-products">VaultMesh™ Products & Services</h2>
          <p className="text-muted-foreground mt-2" data-testid="text-products-description">
            Enterprise-grade solutions for secure data orchestration
          </p>
        </div>
        <Badge variant="outline" className="text-green-600" data-testid="badge-status">
          <Activity className="h-3 w-3 mr-1" />
          All Systems Operational
        </Badge>
      </div>

      <div className="flex gap-2 flex-wrap" data-testid="category-filters">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            data-testid={`button-category-${category}`}
          >
            {category === "all" ? "All Products" : category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card 
            key={product.id}
            className={`relative ${product.popular ? 'border-2 border-purple-500' : ''}`}
            data-testid={`card-product-${product.id}`}
          >
            {product.popular && (
              <Badge className="absolute -top-3 right-4 bg-purple-500" data-testid={`badge-popular-${product.id}`}>
                <Star className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" data-testid={`badge-category-${product.id}`}>{product.category}</Badge>
                <Badge 
                  variant={product.status === "Available" ? "default" : "secondary"}
                  data-testid={`badge-status-${product.id}`}
                >
                  {product.status}
                </Badge>
              </div>
              <CardTitle className="text-xl" data-testid={`heading-product-${product.id}`}>{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground" data-testid={`text-description-${product.id}`}>
                {product.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-sm" data-testid={`heading-features-${product.id}`}>Key Features:</h4>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm" data-testid={`feature-${product.id}-${index}`}>
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                <p className="text-2xl font-bold mb-4" data-testid={`text-pricing-${product.id}`}>{product.pricing}</p>
                {product.enterprise ? (
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={handleViewEnterpriseFeatures}
                      data-testid={`button-view-features-${product.id}`}
                    >
                      View Enterprise Features
                    </Button>
                    <Button 
                      className="w-full"
                      onClick={handleEnterpriseSales}
                      data-testid={`button-contact-sales-${product.id}`}
                    >
                      Contact Sales Team
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full"
                    onClick={() => handlePurchase(product)}
                    disabled={product.status !== "Available"}
                    data-testid={`button-purchase-${product.id}`}
                  >
                    {product.status === "Available" ? "Purchase Now" : product.status}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20" data-testid="card-enterprise-solutions">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2" data-testid="heading-enterprise-solutions">
            <Shield className="h-6 w-6 text-cyan-500" />
            Enterprise Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 mb-4" data-testid="text-enterprise-description">
            Need a custom solution or enterprise deployment? Our team can help design and implement 
            a VaultMesh™ infrastructure tailored to your specific requirements.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={handleEnterpriseSales}
              data-testid="button-enterprise-sales"
            >
              <Users className="mr-2 h-4 w-4" />
              Contact Enterprise Sales
            </Button>
            <Button 
              variant="outline"
              onClick={handleViewEnterpriseFeatures}
              data-testid="button-view-enterprise"
            >
              View Enterprise Features
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
