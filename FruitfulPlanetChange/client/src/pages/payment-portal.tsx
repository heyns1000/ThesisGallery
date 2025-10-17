import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Shield, CheckCircle, ArrowLeft, Zap } from "lucide-react"

export default function PaymentPortal() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const { toast } = useToast()

  // Get product details from URL params
  const urlParams = new URLSearchParams(window.location.search)
  const productName = urlParams.get('product') || 'Product'
  const price = urlParams.get('price') || '29.99'
  const category = urlParams.get('category') || 'General'
  const productId = urlParams.get('productId') || '1'

  // Payment Portal pricing tiers
  const pricingPlans = [
    {
      id: 'minenest-basic',
      name: 'MineNest Basic',
      description: 'Essential mining simulation tools',
      price: 29.99,
      features: [
        'Basic mining algorithms',
        'Resource tracking', 
        'Standard analytics',
        'Community support',
        'Basic API access'
      ],
      popular: false
    },
    {
      id: 'vaultmesh-pro',
      name: 'VaultMesh™ Pro',
      description: 'Advanced blockchain integration',
      price: 89.99,
      features: [
        'Advanced VaultMesh™ integration',
        'Real-time blockchain sync',
        'Premium analytics dashboard',
        'Priority support',
        'Full API access'
      ],
      popular: true
    },
    {
      id: 'faa-enterprise',
      name: 'FAA.ZONE™ Enterprise',
      description: 'Complete ecosystem access',
      price: 299.99,
      features: [
        'Full FAA.ZONE™ access',
        'HotStack integration',
        'Seedwave™ Admin Portal',
        'White-label options',
        'Dedicated support'
      ],
      popular: false
    }
  ]

  // Auto-select plan based on product price
  useEffect(() => {
    const productPrice = parseFloat(price)
    const matchingPlan = pricingPlans.find(plan => plan.price === productPrice)
    if (matchingPlan) {
      setSelectedPlan(matchingPlan.id)
    } else {
      // Default to closest price tier
      if (productPrice <= 29.99) setSelectedPlan('minenest-basic')
      else if (productPrice <= 89.99) setSelectedPlan('vaultmesh-pro')
      else setSelectedPlan('faa-enterprise')
    }
  }, [price])

  const handlePayment = async (planId: string) => {
    setProcessing(true)
    const plan = pricingPlans.find(p => p.id === planId)
    
    if (!plan) {
      toast({
        title: "Error",
        description: "Selected plan not found",
        variant: "destructive"
      })
      setProcessing(false)
      return
    }

    try {
      // Process payment through existing payment system
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: plan.name,
          amount: plan.price,
          currency: 'USD',
          productId: productId,
          productName: productName,
          category: category
        })
      })

      if (response.ok) {
        const paymentData = await response.json()
        
        toast({
          title: "Payment Successful!",
          description: `${plan.name} purchased successfully. Deploying to production...`,
        })

        // Redirect to success page or back to portal
        setTimeout(() => {
          window.location.href = `/payment/success?paymentId=${paymentData.id}`
        }, 2000)
      } else {
        throw new Error('Payment failed')
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support",
        variant: "destructive"
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Payment Portal</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Secure payment processing for {productName}
            </p>
          </div>
        </div>

        {/* Product Info */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{productName}</h2>
                <p className="text-gray-600 dark:text-gray-400">Category: {category}</p>
                <Badge className="mt-2">Real Payment Processing</Badge>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">${price}</div>
                <div className="text-sm text-gray-500">Selected Price</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`cursor-pointer transition-all ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:shadow-lg'
              } ${plan.popular ? 'border-purple-500' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardHeader className="text-center relative">
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600">
                    Most Popular
                  </Badge>
                )}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  {plan.id === 'minenest-basic' && <Shield className="h-8 w-8 text-white" />}
                  {plan.id === 'vaultmesh-pro' && <Zap className="h-8 w-8 text-white" />}
                  {plan.id === 'faa-enterprise' && <CreditCard className="h-8 w-8 text-white" />}
                </div>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                <div className="text-3xl font-bold text-green-600 mt-4">
                  ${plan.price}
                  <span className="text-sm text-gray-500">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className={`w-full mt-6 ${selectedPlan === plan.id ? 'bg-blue-600' : ''}`}
                  onClick={() => handlePayment(plan.id)}
                  disabled={processing}
                >
                  {processing && selectedPlan === plan.id ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Purchase {plan.name}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Notice */}
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200">
                  Secure Payment Processing
                </h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  All payments are processed through encrypted channels with automatic deployment to production servers after successful payment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}