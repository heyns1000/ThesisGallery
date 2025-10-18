import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Hammer, CheckCircle, Activity, Settings } from "lucide-react"

export function BuildNestDashboard() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900" data-testid="buildnest-dashboard-container">
      <Card className="border-2 border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Hammer className="h-8 w-8 text-white" data-testid="icon-buildnest" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            BuildNest Dashboard
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Comprehensive build management and monitoring system
          </CardDescription>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="outline" className="border-blue-500 text-blue-400" data-testid="badge-ci-cd">
              CI/CD Integrated
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400" data-testid="badge-live">
              Live Monitoring
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Active Builds", value: "12", icon: Activity, color: "blue" },
          { title: "Completed", value: "847", icon: CheckCircle, color: "green" },
          { title: "Build Time", value: "2.3min", icon: Settings, color: "purple" },
          { title: "Success Rate", value: "98.7%", icon: CheckCircle, color: "cyan" }
        ].map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="bg-white dark:bg-gray-800" data-testid={`stat-card-${index}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardDescription>{stat.title}</CardDescription>
                  <IconComponent className={`h-5 w-5 text-${stat.color}-500`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hammer className="h-6 w-6 text-blue-500" />
            Build Pipeline Status
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Activity className="h-16 w-16 text-blue-500 mx-auto mb-4" data-testid="icon-activity" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Automated build pipeline with GitHub Actions integration. Monitor deployments, track errors, and manage releases across the FAA.ZONE ecosystem.
          </p>
          <Button className="mt-6 bg-blue-500 hover:bg-blue-600" data-testid="button-view-builds">
            View All Builds
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
