import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code2, Layers, Zap, Rocket } from "lucide-react"

export function HotStackCodeNest() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900" data-testid="hotstack-codenest-container">
      <Card className="border-2 border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-red-500/5">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Code2 className="h-8 w-8 text-white" data-testid="icon-hotstack" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            HotStack CodeNest
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Enterprise code deployment and management platform with Cloudflare integration
          </CardDescription>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="outline" className="border-orange-500 text-orange-400" data-testid="badge-cloudflare">
              Cloudflare Powered
            </Badge>
            <Badge variant="outline" className="border-red-500 text-red-400" data-testid="badge-workers">
              Workers Ready
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800" data-testid="feature-card-deployment">
          <CardHeader>
            <Rocket className="h-8 w-8 text-orange-500 mb-2" />
            <CardTitle>Rapid Deployment</CardTitle>
            <CardDescription>
              Deploy code to Cloudflare Workers in seconds with HotStack automation
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white dark:bg-gray-800" data-testid="feature-card-layers">
          <CardHeader>
            <Layers className="h-8 w-8 text-purple-500 mb-2" />
            <CardTitle>Multi-Layer Stack</CardTitle>
            <CardDescription>
              Manage frontend, backend, and edge functions in one unified platform
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white dark:bg-gray-800" data-testid="feature-card-performance">
          <CardHeader>
            <Zap className="h-8 w-8 text-yellow-500 mb-2" />
            <CardTitle>Lightning Performance</CardTitle>
            <CardDescription>
              Edge computing for sub-50ms global response times
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="pt-6 text-center space-y-4">
          <Code2 className="h-16 w-16 text-orange-500 mx-auto" data-testid="icon-code" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Next-Gen Development Platform
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            HotStack CodeNest integrates with interns.seedwave.faa.zone for development workflows and codenest.seedwave.faa.zone for production deployments.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600" data-testid="button-start">
              Start Building
            </Button>
            <Button variant="outline" data-testid="button-docs">
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
