import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, TrendingUp, Shield, ArrowRight } from "lucide-react"

export function AuthenticMarketplace() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900" data-testid="authentic-marketplace-container">
      <Card className="border-2 border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-white" data-testid="icon-marketplace" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Authentic Marketplace
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Premium marketplace for verified authentic products and services
          </CardDescription>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="outline" className="border-cyan-500 text-cyan-400" data-testid="badge-status">
              Coming Soon
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400" data-testid="badge-verified">
              Verified Vendors Only
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800 hover:shadow-lg transition-all" data-testid="feature-card-verification">
          <CardHeader>
            <Shield className="h-8 w-8 text-cyan-500 mb-2" />
            <CardTitle>100% Verified</CardTitle>
            <CardDescription>
              All products verified for authenticity through VaultMesh™ blockchain
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white dark:bg-gray-800 hover:shadow-lg transition-all" data-testid="feature-card-pricing">
          <CardHeader>
            <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
            <CardTitle>Transparent Pricing</CardTitle>
            <CardDescription>
              Real-time pricing with no hidden fees, powered by PulseGrid™
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white dark:bg-gray-800 hover:shadow-lg transition-all" data-testid="feature-card-secure">
          <CardHeader>
            <ShoppingCart className="h-8 w-8 text-purple-500 mb-2" />
            <CardTitle>Secure Checkout</CardTitle>
            <CardDescription>
              Enterprise-grade security for all transactions
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Launch Timeline
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The Authentic Marketplace is currently under development and will integrate with the Fruitful Crate Dance ecosystem, VaultMesh™ security, and Banimal giving loop.
            </p>
            <div className="flex justify-center gap-4">
              <Button className="bg-cyan-500 hover:bg-cyan-600" data-testid="button-notify">
                Notify Me at Launch
              </Button>
              <Button variant="outline" data-testid="button-learn-more">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
