import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Activity, PieChart } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="analytics-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-2 border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-white" data-testid="icon-analytics" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Analytics Dashboard</CardTitle>
            <CardDescription className="text-lg">
              Comprehensive analytics and insights across the Fruitful ecosystem
            </CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="outline" className="border-cyan-500 text-cyan-400">Real-Time</Badge>
              <Badge variant="outline" className="border-green-500 text-green-400">Multi-Sector</Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Total Users", value: "12,847", icon: Activity, trend: "+12%" },
            { title: "Revenue", value: "$487K", icon: TrendingUp, trend: "+23%" },
            { title: "Active Brands", value: "247", icon: PieChart, trend: "+8%" },
            { title: "Sessions", value: "34,291", icon: BarChart3, trend: "+15%" }
          ].map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <Card key={index} data-testid={`metric-card-${index}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardDescription>{metric.title}</CardDescription>
                    <IconComponent className="h-5 w-5 text-cyan-500" />
                  </div>
                  <div className="text-3xl font-bold">{metric.value}</div>
                  <div className="text-sm text-green-500">{metric.trend}</div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardContent className="pt-6 text-center py-12">
            <BarChart3 className="h-16 w-16 text-cyan-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Advanced Analytics Coming Soon</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Full analytics dashboard with detailed metrics, custom reports, and real-time insights across VaultMesh™, HotStack, and FAA.ZONE ecosystems.
            </p>
            <Button className="mt-6 bg-cyan-500 hover:bg-cyan-600" data-testid="button-notify">
              Notify Me at Launch
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
