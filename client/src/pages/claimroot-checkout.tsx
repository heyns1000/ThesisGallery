import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, CreditCard, Shield, Lock } from "lucide-react"

export default function ClaimRootCheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="claimroot-checkout-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-2 border-green-500/20 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-white" data-testid="icon-checkout" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">ClaimRoot™ Checkout</CardTitle>
            <CardDescription className="text-lg">
              Secure checkout and payment processing with Banimal giving loop integration
            </CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="outline" className="border-green-500 text-green-400">Secure</Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-400">Multi-Currency</Badge>
              <Badge variant="outline" className="border-purple-500 text-purple-400">Banimal Loop</Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card data-testid="feature-card-payment">
            <CardHeader>
              <CreditCard className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>Multiple Payment Methods</CardTitle>
              <CardDescription>
                Credit cards, PayPal, crypto, and local payment options
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="feature-card-security">
            <CardHeader>
              <Shield className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>VaultMesh™ Security</CardTitle>
              <CardDescription>
                Enterprise-grade encryption and fraud protection
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="feature-card-privacy">
            <CardHeader>
              <Lock className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>Privacy Protected</CardTitle>
              <CardDescription>
                PCI-DSS compliant with zero data storage
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <ShoppingCart className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Checkout Experience</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
                Every purchase through ClaimRoot™ Checkout contributes to the Banimal giving loop, supporting child welfare initiatives across the ecosystem.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 max-w-md mx-auto mb-6">
                <p className="text-sm text-green-800 dark:text-green-200">
                  🌱 10% of every transaction supports children's education and welfare programs
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <Button className="bg-green-500 hover:bg-green-600" data-testid="button-checkout">
                  Proceed to Checkout
                </Button>
                <Button variant="outline" data-testid="button-learn-giving">
                  Learn About Giving Loop
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
