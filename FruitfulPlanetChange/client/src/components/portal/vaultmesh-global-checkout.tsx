import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Shield, Globe, Zap, CheckCircle, AlertTriangle } from "lucide-react"

interface CheckoutPackage {
  id: string
  name: string
  price: number
  currency: string
  features: string[]
  recommended?: boolean
  popular?: boolean
}

export function VaultMeshGlobalCheckout() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("paypal")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  // Check for marketplace product selection
  useEffect(() => {
    const productData = localStorage.getItem('selectedProduct');
    if (productData) {
      try {
        const product = JSON.parse(productData);
        setSelectedProduct(product);
        // Auto-select appropriate package based on REAL product price from Seedwave data
        if (product.price === 29.99) {
          if (product.name.includes('Flow') || product.name.includes('Nature')) {
            setSelectedPackage('wildlife-basic');
          } else {
            setSelectedPackage('wildlife-preserve');
          }
        } else if (product.price === 299.99) {
          setSelectedPackage('wildlife-protection');
        } else {
          setSelectedPackage('wildlife-basic'); // fallback
        }
        localStorage.removeItem('selectedProduct'); // Clear after use
      } catch (error) {
        console.error('Error parsing selected product:', error);
      }
    }
  }, [])

  const packages: CheckoutPackage[] = [
    {
      id: "wildlife-basic",
      name: "FlowNature™ Wildlife Basic",
      price: 29.99,
      currency: "USD",
      popular: true,
      features: [
        "Natural flow monitoring",
        "Ecosystem surveillance",
        "Wildlife & Habitat protection",
        "Basic conservation tools",
        "Community reporting"
      ]
    },
    {
      id: "wildlife-preserve", 
      name: "GridPreserve™ Wildlife Network",
      price: 29.99,
      currency: "USD",
      features: [
        "Wildlife preservation grid",
        "Habitat protection zones",
        "Real-time monitoring",
        "Conservation analytics",
        "Preservation reporting"
      ]
    },
    {
      id: "wildlife-protection",
      name: "ProtectZone™ Advanced Protection",
      price: 299.99,
      currency: "USD",
      recommended: true,
      features: [
        "Advanced protection zones",
        "Wildlife sanctuaries management", 
        "Professional conservation tools",
        "24/7 monitoring systems",
        "Priority conservation support",
        "Full ecosystem protection"
      ]
    }
  ]

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId)
  }

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-4">
            🌐 VaultMesh™ Global Checkout
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Secure your place in the future with VaultMesh™ infrastructure packages.
            Enterprise-grade security and scalability for the regulated digital ecosystem.
          </p>
        </div>

        {/* Package Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id}
              className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedPackage === pkg.id 
                  ? 'ring-2 ring-cyan-500 shadow-lg' 
                  : 'hover:shadow-md'
              } ${
                pkg.recommended 
                  ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20' 
                  : pkg.popular 
                  ? 'border-green-200 bg-gradient-to-br from-green-50 to-cyan-50 dark:from-green-900/20 dark:to-cyan-900/20'
                  : ''
              }`}
              onClick={() => handlePackageSelect(pkg.id)}
            >
              {pkg.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-500 text-white px-4 py-1">
                    <Shield className="w-3 h-3 mr-1" />
                    Recommended
                  </Badge>
                </div>
              )}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white px-4 py-1">
                    <Zap className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
                <div className="text-4xl font-bold text-cyan-600 dark:text-cyan-400">
                  ${pkg.price}
                  <span className="text-lg text-gray-500 font-normal">/month</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full mt-6 ${
                    selectedPackage === pkg.id
                      ? 'bg-cyan-500 hover:bg-cyan-600'
                      : 'bg-gray-500 hover:bg-gray-600'
                  }`}
                  onClick={() => handlePackageSelect(pkg.id)}
                >
                  {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Checkout Form */}
        {selectedPackage && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-cyan-500" />
                Secure Checkout
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Complete your VaultMesh™ subscription
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="flex justify-between items-center">
                  <span>{selectedPkg?.name}</span>
                  <span className="font-bold">${selectedPkg?.price}/month</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">${selectedPkg?.price}/month</span>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-sm font-medium mb-2 block">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="stripe">Credit Card</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Organization</label>
                  <Input placeholder="Your Company" />
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                      Enterprise Security
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                      All transactions are secured by VaultMesh™ protocols with end-to-end encryption 
                      and compliance with international security standards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedPackage(null)}
                >
                  Back to Packages
                </Button>
                <Button className="flex-1 bg-cyan-500 hover:bg-cyan-600">
                  <Globe className="w-4 h-4 mr-2" />
                  Complete Purchase
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Overview */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose VaultMesh™?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Military-grade encryption and compliance with global regulatory standards
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Globe className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Global Infrastructure</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Distributed network with 99.99% uptime and worldwide coverage
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-time Performance</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Lightning-fast data processing and instant synchronization
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}