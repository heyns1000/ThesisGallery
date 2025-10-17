import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, TrendingUp, Target, Lightbulb } from "lucide-react"

export default function FruitfulBusinessPlanPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="fruitful-business-plan-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-2 border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-red-500/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-white" data-testid="icon-business-plan" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Fruitful Business Plan</CardTitle>
            <CardDescription className="text-lg">
              Strategic roadmap for Fruitful Holdings ecosystem expansion
            </CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="outline" className="border-orange-500 text-orange-400">2025-2030</Badge>
              <Badge variant="outline" className="border-green-500 text-green-400">Multi-Sector</Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Revenue Target", value: "$500M", icon: TrendingUp },
            { title: "Market Sectors", value: "12", icon: Target },
            { title: "Brand Portfolio", value: "247", icon: Lightbulb },
            { title: "Growth Rate", value: "185%", icon: TrendingUp }
          ].map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <Card key={index} data-testid={`metric-card-${index}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardDescription>{metric.title}</CardDescription>
                    <IconComponent className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-3xl font-bold">{metric.value}</div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardContent className="pt-6 text-center py-12">
            <FileText className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Strategic Vision Document</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive business plan covering VaultMesh™ expansion, FAA.ZONE ecosystem growth, Banimal giving loop scaling, and cross-sector integration strategies.
            </p>
            <Button className="mt-6 bg-orange-500 hover:bg-orange-600" data-testid="button-view-plan">
              View Executive Summary
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
