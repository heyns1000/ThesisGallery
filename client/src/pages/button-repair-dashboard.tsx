import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wrench, CheckCircle, AlertTriangle, Activity } from "lucide-react"

export default function ButtonRepairDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="button-repair-dashboard-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-2 border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-orange-500/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Wrench className="h-8 w-8 text-white" data-testid="icon-repair" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Button Repair Dashboard</CardTitle>
            <CardDescription className="text-lg">
              UI/UX debugging and button functionality validation across the ecosystem
            </CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="outline" className="border-yellow-500 text-yellow-400">Debug Tools</Badge>
              <Badge variant="outline" className="border-green-500 text-green-400">Auto-Repair</Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Total Buttons", value: "2,847", icon: Activity, status: "success" },
            { title: "Working", value: "2,831", icon: CheckCircle, status: "success" },
            { title: "Needs Repair", value: "16", icon: AlertTriangle, status: "warning" },
            { title: "Repair Rate", value: "99.4%", icon: CheckCircle, status: "success" }
          ].map((metric, index) => {
            const IconComponent = metric.icon
            const colorClass = metric.status === 'success' ? 'text-green-500' : 'text-yellow-500'
            return (
              <Card key={index} data-testid={`stat-card-${index}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardDescription>{metric.title}</CardDescription>
                    <IconComponent className={`h-5 w-5 ${colorClass}`} />
                  </div>
                  <div className="text-3xl font-bold">{metric.value}</div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card data-testid="tool-card-validator">
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>Button Validator</CardTitle>
              <CardDescription>
                Automated testing of all interactive buttons across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-500 hover:bg-green-600" data-testid="button-run-validator">
                Run Validation
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="tool-card-repair">
            <CardHeader>
              <Wrench className="h-8 w-8 text-yellow-500 mb-2" />
              <CardTitle>Auto-Repair Tool</CardTitle>
              <CardDescription>
                Automatically fix common button issues and styling problems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600" data-testid="button-run-repair">
                Run Auto-Repair
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Wrench className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Comprehensive UI Validation</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Advanced debugging dashboard for identifying and repairing UI component issues across VaultMesh™, HotStack, and FAA.ZONE platforms.
            </p>
            <Button className="mt-6 bg-yellow-500 hover:bg-yellow-600" data-testid="button-full-scan">
              Run Full System Scan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
