import { useState } from "react"
import type { ComponentType, ElementType } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TreePine, 
  Shield, 
  Scale, 
  Heart, 
  Leaf, 
  Droplets, 
  Wind, 
  Waves, 
  Activity,
  ChevronRight,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { WildlifeProtectionDashboard } from "./dashboards/WildlifeProtectionDashboard"
import { WaterSecurityDashboard } from "./dashboards/WaterSecurityDashboard"
import { AirQualityDashboard } from "./dashboards/AirQualityDashboard"
import { DeforestationDashboard } from "./dashboards/DeforestationDashboard"
import { OceanPlasticDashboard } from "./dashboards/OceanPlasticDashboard"
import { GlobalHealthDashboard } from "./dashboards/GlobalHealthDashboard"
import { BaobabEnvironmentalLawHub } from "../../components/portal/baobab-environmental-law-hub"
import { BaobabSecurityNetwork } from "../../components/portal/baobab-security-network"

interface DashboardItem {
  id: string
  label: string
  icon: ElementType
  component: ComponentType
}

interface CategoryItem {
  id: string
  label: string
  icon: ElementType
  dashboards: DashboardItem[]
}

const categories: CategoryItem[] = [
  {
    id: "environmental",
    label: "Environmental Monitoring",
    icon: Leaf,
    dashboards: [
      { 
        id: "deforestation", 
        label: "Deforestation Tracking", 
        icon: TreePine, 
        component: DeforestationDashboard 
      },
      { 
        id: "ocean-plastic", 
        label: "Ocean Plastic Pollution", 
        icon: Waves, 
        component: OceanPlasticDashboard 
      },
      { 
        id: "wildlife-protection", 
        label: "Wildlife Protection", 
        icon: TreePine, 
        component: WildlifeProtectionDashboard 
      },
      { 
        id: "water-security", 
        label: "Water Security", 
        icon: Droplets, 
        component: WaterSecurityDashboard 
      },
      { 
        id: "air-quality", 
        label: "Air Quality Monitoring", 
        icon: Wind, 
        component: AirQualityDashboard 
      }
    ]
  },
  {
    id: "security",
    label: "Security & Protection",
    icon: Shield,
    dashboards: [
      { 
        id: "security-network", 
        label: "Security Network Monitor", 
        icon: Shield, 
        component: BaobabSecurityNetwork 
      }
    ]
  },
  {
    id: "legal",
    label: "Legal & Compliance",
    icon: Scale,
    dashboards: [
      { 
        id: "environmental-law", 
        label: "Environmental Law Hub", 
        icon: Scale, 
        component: BaobabEnvironmentalLawHub 
      }
    ]
  },
  {
    id: "health",
    label: "Global Health",
    icon: Heart,
    dashboards: [
      { 
        id: "global-health", 
        label: "Global Health Metrics", 
        icon: Heart, 
        component: GlobalHealthDashboard 
      }
    ]
  }
]

export function BaobabTreeHub() {
  const [selectedDashboard, setSelectedDashboard] = useState<string>("deforestation")
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["environmental"])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const getSelectedComponent = () => {
    for (const category of categories) {
      const dashboard = category.dashboards.find(d => d.id === selectedDashboard)
      if (dashboard) {
        return dashboard.component
      }
    }
    return DeforestationDashboard
  }

  const SelectedComponent = getSelectedComponent()

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Internal Sidebar Navigation */}
      <aside className="w-80 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-[var(--vault-cyan)]/30 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--vault-cyan)] to-green-500 rounded-lg flex items-center justify-center">
                <TreePine className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--vault-cyan)]" data-testid="heading-baobab-hub">
                  Sacred Baobab™
                </h1>
                <p className="text-xs text-gray-400">Security Network</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              AI-powered global monitoring & protection systems
            </p>
          </div>

          {/* System Status */}
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-[var(--vault-cyan)]/50 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[var(--vault-cyan)] flex items-center gap-2">
                <Activity className="w-4 h-4 animate-pulse" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Network Status</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Active Monitors</span>
                <span className="text-xs font-semibold text-[var(--vault-cyan)]">12/12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Data Sync</span>
                <Badge className="bg-[var(--vault-cyan)]/20 text-[var(--vault-cyan)] border-[var(--vault-cyan)]/30">
                  Real-time
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Categories */}
          <nav className="space-y-2">
            {categories.map((category) => {
              const isExpanded = expandedCategories.includes(category.id)
              const CategoryIcon = category.icon
              
              return (
                <div key={category.id}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between px-4 py-3 hover:bg-gray-700/50 transition-colors",
                      isExpanded ? "text-[var(--vault-cyan)]" : "text-gray-400"
                    )}
                    onClick={() => toggleCategory(category.id)}
                    data-testid={`button-category-${category.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <CategoryIcon className="w-5 h-5" />
                      <span className="font-medium text-sm">{category.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                  
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-[var(--vault-cyan)]/30 pl-4">
                      {category.dashboards.map((dashboard) => {
                        const DashboardIcon = dashboard.icon
                        const isActive = selectedDashboard === dashboard.id
                        
                        return (
                          <Button
                            key={dashboard.id}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start px-3 py-2 text-sm transition-all",
                              isActive
                                ? "bg-[var(--vault-cyan)]/20 text-[var(--vault-cyan)] border-l-2 border-[var(--vault-cyan)] font-semibold shadow-lg shadow-[var(--vault-cyan)]/10"
                                : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                            )}
                            onClick={() => setSelectedDashboard(dashboard.id)}
                            data-testid={`nav-${dashboard.id}`}
                          >
                            <DashboardIcon className="w-4 h-4 mr-2" />
                            {dashboard.label}
                          </Button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <SelectedComponent />
      </main>
    </div>
  )
}
