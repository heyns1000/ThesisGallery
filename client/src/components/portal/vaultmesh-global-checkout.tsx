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

  useEffect(() => {
    const productData = localStorage.getItem('selectedProduct');
    if (productData) {
      try {
        const product = JSON.parse(productData);
        setSelectedProduct(product);
        if (product.price === 29.99) {
          if (product.name.includes('Flow') || product.name.includes('Nature')) {
            setSelectedPackage('wildlife-basic');
          } else {
            setSelectedPackage('wildlife-preserve');
          }
        } else if (product.price === 299.99) {
          setSelectedPackage('wildlife-protection');
        } else {
          setSelectedPackage('wildlife-basic');
        }
        localStorage.removeItem('selectedProduct');
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

  const handleRedirectToPayment = () => {
    const pkg = packages.find(p => p.id === selectedPackage);
    if (pkg) {
      window.open(`https://banimal.co.za/checkout?package=${pkg.id}&price=${pkg.price}`, "_blank");
    }
  }

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="vaultmesh-global-checkout-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="heading-global-checkout">VaultMesh™ Global Checkout</h1>
          <p className="text-muted-foreground" data-testid="text-global-checkout-description">
            Secure payment processing powered by banimal.co.za
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id}
              className={`relative cursor-pointer transition-all ${
                selectedPackage === pkg.id ? 'border-2 border-cyan-500 shadow-lg' : ''
              } ${pkg.recommended ? 'border-2 border-green-500' : ''}`}
              onClick={() => handlePackageSelect(pkg.id)}
              data-testid={`card-global-package-${pkg.id}`}
            >
              {pkg.recommended && (
                <Badge className="absolute -top-3 right-4 bg-green-500" data-testid={`badge-global-recommended-${pkg.id}`}>
                  Recommended
                </Badge>
              )}
              {pkg.popular && (
                <Badge className="absolute -top-3 right-4 bg-purple-500" data-testid={`badge-global-popular-${pkg.id}`}>
                  Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl" data-testid={`heading-global-package-${pkg.id}`}>{pkg.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold" data-testid={`text-global-price-${pkg.id}`}>${pkg.price}</span>
                  <span className="text-muted-foreground">/{pkg.currency}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2" data-testid={`feature-global-${pkg.id}-${index}`}>
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedPkg && (
          <Card className="mt-8" data-testid="card-checkout-summary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" data-testid="heading-checkout-summary">
                <Shield className="h-5 w-5 text-cyan-500" />
                Checkout Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2" data-testid="heading-selected-package">Selected Package</h3>
                <p className="text-lg" data-testid="text-selected-package-name">{selectedPkg.name}</p>
                <p className="text-3xl font-bold mt-2" data-testid="text-selected-package-price">
                  ${selectedPkg.price} <span className="text-lg font-normal text-muted-foreground">{selectedPkg.currency}</span>
                </p>
              </div>

              <div className="p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-5 w-5 text-cyan-500" />
                  <h4 className="font-semibold" data-testid="heading-secure-processing">Secure Payment Processing</h4>
                </div>
                <p className="text-sm text-muted-foreground" data-testid="text-secure-processing-description">
                  All payments are securely processed through banimal.co.za with industry-standard encryption.
                </p>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                onClick={handleRedirectToPayment}
                data-testid="button-proceed-to-payment"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Proceed to Secure Payment
              </Button>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1" data-testid="badge-secure">
                  <Shield className="h-4 w-4" />
                  256-bit SSL
                </div>
                <div className="flex items-center gap-1" data-testid="badge-encrypted">
                  <Zap className="h-4 w-4" />
                  Encrypted
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
