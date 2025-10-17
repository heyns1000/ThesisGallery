import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pickaxe, TrendingUp, Users, Zap } from "lucide-react"

export function MineNestAuthenticDashboard() {
  return (
    <div className="space-y-6" data-testid="minenest-authentic-dashboard">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Pickaxe className="h-6 w-6 text-orange-500" />
            MineNest™ Authentic Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-700 rounded-lg" data-testid="stat-mining-operations">
              <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">40</div>
              <div className="text-gray-400">Active Mining Operations</div>
            </div>
            <div className="text-center p-6 bg-gray-700 rounded-lg" data-testid="stat-minec ore-brands">
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">183</div>
              <div className="text-gray-400">MineCore™ Brands</div>
            </div>
            <div className="text-center p-6 bg-gray-700 rounded-lg" data-testid="stat-vault-trace">
              <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white">99.8%</div>
              <div className="text-gray-400">VaultTrace™ Uptime</div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-orange-900/20 border border-orange-700 rounded-lg" data-testid="minenest-info">
            <h3 className="text-orange-400 font-semibold mb-2">MineNest™ Integration Active</h3>
            <p className="text-gray-300 text-sm">
              This sector is powered by MineNest™ - our comprehensive mining operations management system 
              with real-time equipment tracking, ore yield monitoring, and VaultTrace™ compliance integration.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            Equipment & Operations Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded" data-testid="equipment-drill-rigs">
              <span className="text-gray-300">Drill Rigs</span>
              <Badge className="bg-green-600">18 Active / 22 Total</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded" data-testid="equipment-processors">
              <span className="text-gray-300">Ore Processors</span>
              <Badge className="bg-green-600">12 Active / 15 Total</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded" data-testid="equipment-transport">
              <span className="text-gray-300">Transport Systems</span>
              <Badge className="bg-green-600">8 Active / 10 Total</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
