import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Package, Truck, Award } from "lucide-react"

export function FruitfulMarketplace() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900" data-testid="fruitful-marketplace-container">
      <Card className="border-2 border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-red-500/5">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-white" data-testid="icon-fruitful" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Fruitful Marketplace
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Official marketplace for Fruitful products, Crate Dance merchandise, and ecosystem services
          </CardDescription>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="outline" className="border-orange-500 text-orange-400" data-testid="badge-official">
              Official Store
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400" data-testid="badge-banimal">
              Banimal Integrated
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800 hover:shadow-lg transition-all" data-testid="category-card-merchandise">
          <CardHeader>
            <Package className="h-8 w-8 text-orange-500 mb-2" />
            <CardTitle>Crate Dance Merchandise</CardTitle>
            <CardDescription>
              Official Fruitful Crate Dance apparel and accessories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" data-testid="button-browse-merchandise">
              Browse Collection
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 hover:shadow-lg transition-all" data-testid="category-card-products">
          <CardHeader>
            <ShoppingBag className="h-8 w-8 text-green-500 mb-2" />
            <CardTitle>Fruitful Products</CardTitle>
            <CardDescription>
              Premium products from the Fruitful ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" data-testid="button-browse-products">
              View Products
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 hover:shadow-lg transition-all" data-testid="category-card-services">
          <CardHeader>
            <Award className="h-8 w-8 text-purple-500 mb-2" />
            <CardTitle>Premium Services</CardTitle>
            <CardDescription>
              VaultMesh™, HotStack, and ecosystem integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" data-testid="button-browse-services">
              Explore Services
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-orange-500" />
            Shipping & Delivery
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Global shipping with tracking integration. All purchases support the Banimal giving loop, contributing to child welfare initiatives.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600" data-testid="button-start-shopping">
              Start Shopping
            </Button>
            <Button variant="outline" data-testid="button-learn-giving">
              Learn About Giving Loop
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
