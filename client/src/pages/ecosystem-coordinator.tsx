import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Network, Workflow, Zap, Settings } from "lucide-react"

export default function EcosystemCoordinatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="ecosystem-coordinator-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-2 border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                <Network className="h-8 w-8 text-white" data-testid="icon-coordinator" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Ecosystem Coordinator</CardTitle>
            <CardDescription className="text-lg">
              Central orchestration platform for all ecosystem services and integrations
            </CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="outline" className="border-cyan-500 text-cyan-400">Multi-Sector</Badge>
              <Badge variant="outline" className="border-purple-500 text-purple-400">Auto-Sync</Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Active Services", value: "47", icon: Network },
            { title: "Workflows", value: "124", icon: Workflow },
            { title: "Sync Speed", value: "<100ms", icon: Zap },
            { title: "Uptime", value: "99.99%", icon: Settings }
          ].map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <Card key={index} data-testid={`stat-card-${index}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardDescription>{metric.title}</CardDescription>
                    <IconComponent className="h-5 w-5 text-cyan-500" />
                  </div>
                  <div className="text-3xl font-bold">{metric.value}</div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card data-testid="service-card-vaultmesh">
            <CardHeader>
              <Network className="h-8 w-8 text-cyan-500 mb-2" />
              <CardTitle>VaultMesh™ Hub</CardTitle>
              <CardDescription>
                Security and authentication coordination across all services
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="service-card-hotstack">
            <CardHeader>
              <Zap className="h-8 w-8 text-orange-500 mb-2" />
              <CardTitle>HotStack Services</CardTitle>
              <CardDescription>
                Deployment and infrastructure management coordination
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="service-card-faa">
            <CardHeader>
              <Workflow className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>FAA.ZONE™ Integration</CardTitle>
              <CardDescription>
                Cross-sector workflow automation and orchestration
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Network className="h-16 w-16 text-cyan-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Unified Ecosystem Management</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The Ecosystem Coordinator provides centralized management, monitoring, and orchestration of all services across VaultMesh™, HotStack, FAA.ZONE™, and integrated sub-ecosystems.
            </p>
            <Button className="mt-6 bg-cyan-500 hover:bg-cyan-600" data-testid="button-open-coordinator">
              Open Coordinator Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
