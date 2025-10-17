import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pickaxe, Shield } from "lucide-react"

const mockMineCoreBrands = [
  { id: 1, name: "DiamondCore™", status: "active", integration: "VaultTrace", type: "Diamond Mining" },
  { id: 2, name: "GoldStream™", status: "active", integration: "OreTrack", type: "Gold Extraction" },
  { id: 3, name: "PlatinumPulse™", status: "active", integration: "MineNet", type: "Platinum Operations" },
  { id: 4, name: "CoalChain™", status: "active", integration: "VaultTrace", type: "Coal Mining" },
  { id: 5, name: "IronForge™", status: "development", integration: "MineCore", type: "Iron Ore" },
  { id: 6, name: "CopperLink™", status: "active", integration: "VaultTrace", type: "Copper Mining" },
]

export function MineNestAuthenticBrands() {
  return (
    <Card className="bg-gray-800 border-gray-700" data-testid="minenest-authentic-brands">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Pickaxe className="h-6 w-6 text-yellow-500" />
          MineCore™ Brand Portfolio
        </CardTitle>
        <div className="flex items-center gap-4 mt-2">
          <Badge className="bg-green-600 text-white">40 Active Brands</Badge>
          <Badge className="bg-purple-600 text-white">83% Integration</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockMineCoreBrands.map((brand) => (
            <div key={brand.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600" data-testid={`brand-${brand.id}`}>
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-white font-semibold">{brand.name}</h4>
                <Badge className={`${
                  brand.status === 'active' ? 'bg-green-500' :
                  brand.status === 'development' ? 'bg-yellow-500' :
                  'bg-gray-500'
                } text-white text-xs`}>
                  {brand.status}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-gray-300">{brand.type}</div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Shield className="h-4 w-4" />
                  {brand.integration}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">MineCore™</span>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1" data-testid={`button-core-${brand.id}`}>
                    Core
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-4 mt-6">
          <Button className="bg-green-600 hover:bg-green-700 text-white flex-1" data-testid="button-add-brand">
            Add New Brand
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1" data-testid="button-import-brands">
            Import Brands
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1" data-testid="button-export-portfolio">
            Export Portfolio
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
