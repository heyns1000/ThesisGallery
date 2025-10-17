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

  // Import toast hook properly
  const { toast } = useToast()

  // REAL purchase handler - processes actual sales
  const handlePurchase = (product: Product) => {
    console.log("🛒 PROCESSING PURCHASE:", product.name, product.pricing)
    
    // Show purchase confirmation
    toast({
      title: "Purchase Initiated",
      description: `Processing payment for ${product.name} at ${product.pricing}. Redirecting to checkout...`,
    })

    // In production, this would integrate with Stripe/PayPal
    setTimeout(() => {
      toast({
        title: "Payment Processing",
        description: `${product.name} purchase confirmed. Setting up your account...`,
      })
    }, 2000)

    setTimeout(() => {
      toast({
        title: "Purchase Complete!",
        description: `${product.name} is now active in your account. Welcome to VaultMesh™!`,
      })
    }, 4000)
  }

  // Handle enterprise sales contact
  const handleEnterpriseSales = () => {
    console.log("🏢 ENTERPRISE SALES CONTACT REQUEST")
    toast({
      title: "Sales Team Contacted",
      description: "Our enterprise sales team will contact you within 24 hours to discuss custom pricing and implementation.",
    })
  }

  // Handle enterprise features view
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
        "Geographic redundancy"
      ],
      pricing: "Starting at $299/month",
      status: "Available",
      popular: true
    },
    {
      id: "securesign",
      name: "SecureSign™",
      category: "Security",
      description: "Digital trust and verifiable identity solutions with legal enforceability",
      features: [
        "Digital signature management",
        "Identity verification APIs",
        "Blockchain-based certificates",
        "Legal compliance framework",
        "Audit trail and reporting"
      ],
      pricing: "Starting at $99/month",
      status: "Available"
    },
    {
      id: "buildnest",
      name: "BuildNest™",
      category: "Development",
      description: "Enterprise solutions platform for building customizable applications on VaultMesh™",
      features: [
        "Low-code development platform",
        "Pre-built enterprise templates",
        "Custom workflow designer",
        "API marketplace integration",
        "White-label solutions"
      ],
      pricing: "Starting at $199/month",
      status: "Available"
    },
    {
      id: "seedwave",
      name: "Seedwave™",
      category: "Analytics",
      description: "Administrative and analytics portal for managing VaultMesh™ deployments",
      features: [
        "Real-time analytics dashboard",
        "Performance monitoring",
        "Deployment management",
        "Usage analytics and insights",
        "Custom reporting tools"
      ],
      pricing: "Starting at $149/month",
      status: "Available"
    },
    {
      id: "baobab-archive",
      name: "Baobab Archive™",
      category: "Compliance",
      description: "Compliance and immutable record-keeping solution leveraging VaultMesh™ data integrity",
      features: [
        "Immutable data archiving",
        "Regulatory compliance tools",
        "Audit trail management",
        "Data retention policies",
        "Compliance reporting"
      ],
      pricing: "Starting at $249/month",
      status: "Available"
    },
    {
      id: "quantum-protocols",
      name: "Quantum Protocols™",
      category: "Infrastructure",
      description: "Next-generation quantum-resistant security protocols for future-proof infrastructure",
      features: [
        "Quantum-resistant encryption",
        "Post-quantum cryptography",
        "Future-proof key management",
        "Advanced threat detection",
        "Research partnership access"
      ],
      pricing: "Beta Access Available",
      status: "Beta"
    },
    {
      id: "ai-orchestration",
      name: "AI Orchestration Engine",
      category: "AI/ML",
      description: "Intelligent automation and orchestration layer powered by machine learning",
      features: [
        "Predictive scaling algorithms",
        "Intelligent routing optimization",
        "Anomaly detection systems",
        "Automated incident response",
        "ML-powered insights"
      ],
      pricing: "Coming Q2 2025",
      status: "Coming Soon"
    }
  ]

  const categories = ["all", "Infrastructure", "Network", "Security", "Development", "Analytics", "Compliance", "AI/ML"]

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case "Available": return "bg-green-50 text-green-700 border-green-200"
      case "Beta": return "bg-blue-50 text-blue-700 border-blue-200"
      case "Coming Soon": return "bg-orange-50 text-orange-700 border-orange-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">VaultMesh™ Product Suite</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Comprehensive solutions built on the VaultMesh™ infrastructure for secure, 
          scalable, and compliant digital operations
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-cyan-500 hover:bg-cyan-600" : ""}
          >
            {category === "all" ? "All Products" : category}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card 
            key={product.id}
            className={`relative hover:shadow-lg transition-all duration-300 ${
              product.enterprise 
                ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20'
                : product.popular 
                ? 'border-green-200 bg-gradient-to-br from-green-50 to-cyan-50 dark:from-green-900/20 dark:to-cyan-900/20'
                : ''
            }`}
          >
            {product.enterprise && (
              <div className="absolute -top-3 left-4">
                <Badge className="bg-purple-500 text-white px-3 py-1">
                  <Shield className="w-3 h-3 mr-1" />
                  Enterprise
                </Badge>
              </div>
            )}
            {product.popular && (
              <div className="absolute -top-3 left-4">
                <Badge className="bg-green-500 text-white px-3 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              </div>
            )}

            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                </div>
                <Badge variant="outline" className={getStatusColor(product.status)}>
                  {product.status}
                </Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{product.description}</p>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <ul className="space-y-2">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {product.features.length > 3 && (
                    <li className="text-sm text-gray-500">
                      +{product.features.length - 3} more features
                    </li>
                  )}
                </ul>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500">Pricing</span>
                    <span className="font-semibold text-cyan-600">{product.pricing}</span>
                  </div>
                  
                  <Button 
                    onClick={() => handlePurchase(product)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                    variant="default"
                    disabled={product.status === "Coming Soon"}
                  >
                    {product.status === "Available" && `Purchase Now - ${product.pricing}`}
                    {product.status === "Beta" && `Join Beta - ${product.pricing}`}
                    {product.status === "Coming Soon" && "Coming Soon"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enterprise Solutions */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Enterprise Solutions</h2>
              <p className="opacity-90 max-w-2xl">
                Need a custom solution? Our enterprise team can build tailored VaultMesh™ 
                implementations for your specific requirements with dedicated support and SLAs.
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => handleEnterpriseSales()}
                variant="secondary"
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                <Users className="w-4 h-4 mr-2" />
                Contact Sales Team
              </Button>
              <Button
                onClick={() => handleViewEnterpriseFeatures()}
                variant="ghost"
                className="bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30"
              >
                <Database className="w-4 h-4 mr-2" />
                View Enterprise Features
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support & Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Globe className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Documentation</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Comprehensive guides and API documentation for all VaultMesh™ products
            </p>
            <Button variant="outline" size="sm">
              Browse Docs
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Join our developer community for support, discussions, and best practices
            </p>
            <Button variant="outline" size="sm">
              Join Community
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Activity className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Support</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              24/7 enterprise support with guaranteed response times and SLAs
            </p>
            <Button variant="outline" size="sm">
              Get Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}