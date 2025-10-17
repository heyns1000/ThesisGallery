import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, LineChart, TrendingUp, Globe } from "lucide-react"

export function RealPricingMarketplace() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900" data-testid="real-pricing-marketplace-container">
      <Card className="border-2 border-green-500/20 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-white" data-testid="icon-pricing" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Real Pricing Marketplace
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Live market pricing with real-time data and transparent costs
          </CardDescription>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="outline" className="border-green-500 text-green-400" data-testid="badge-live">
              Live Pricing
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400" data-testid="badge-global">
              Global Markets
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Agriculture", value: "₹2,847", change: "+3.2%", color: "green" },
          { title: "Mining", value: "$1,234", change: "+1.8%", color: "blue" },
          { title: "Wildlife", value: "R3,456", change: "+5.1%", color: "purple" },
          { title: "Retail", value: "$987", change: "-0.5%", color: "orange" }
        ].map((market, index) => (
          <Card key={index} className="bg-white dark:bg-gray-800" data-testid={`market-card-${index}`}>
            <CardHeader>
              <CardDescription>{market.title}</CardDescription>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{market.value}</div>
                <div className={`text-sm font-semibold ${market.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {market.change}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-6 w-6 text-green-500" />
            Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" data-testid="icon-globe" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real-time market pricing integration with LoopPay currency conversion and multi-currency support. Full launch scheduled for Q2 2025.
          </p>
          <Button className="mt-6 bg-green-500 hover:bg-green-600" data-testid="button-get-access">
            Get Early Access
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
