import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Leaf, Heart, TrendingUp } from "lucide-react"

export default function PlanetChangePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="planet-change-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-2 border-green-500/20 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Globe className="h-8 w-8 text-white" data-testid="icon-planet" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Planet Change Initiative</CardTitle>
            <CardDescription className="text-lg">
              Environmental sustainability and social impact across the Fruitful ecosystem
            </CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="outline" className="border-green-500 text-green-400">Carbon Neutral</Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-400">Social Impact</Badge>
              <Badge variant="outline" className="border-purple-500 text-purple-400">Banimal Loop</Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Trees Planted", value: "12,847", icon: Leaf },
            { title: "Children Helped", value: "3,421", icon: Heart },
            { title: "Carbon Offset", value: "2,500T", icon: Globe },
            { title: "Impact Score", value: "98.7%", icon: TrendingUp }
          ].map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <Card key={index} data-testid={`impact-card-${index}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardDescription>{metric.title}</CardDescription>
                    <IconComponent className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold">{metric.value}</div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card data-testid="pillar-card-environment">
            <CardHeader>
              <Leaf className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>Environmental</CardTitle>
              <CardDescription>
                Reforestation, carbon offsetting, and sustainable practices
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="pillar-card-social">
            <CardHeader>
              <Heart className="h-8 w-8 text-red-500 mb-2" />
              <CardTitle>Social Impact</CardTitle>
              <CardDescription>
                Child welfare, education, and community development programs
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="pillar-card-economic">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Economic Growth</CardTitle>
              <CardDescription>
                Sustainable business practices and fair trade partnerships
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Globe className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Changing the Planet, One Transaction at a Time</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
              Planet Change integrates environmental and social responsibility into every aspect of the Fruitful ecosystem. Through the Banimal giving loop, every transaction contributes to reforestation, child welfare, and sustainable development.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 max-w-md mx-auto mb-6">
              <p className="text-sm text-green-800 dark:text-green-200">
                🌱 For every $100 in revenue, we plant 10 trees and support 1 child's education
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button className="bg-green-500 hover:bg-green-600" data-testid="button-contribute">
                Contribute to Impact
              </Button>
              <Button variant="outline" data-testid="button-learn-more">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
