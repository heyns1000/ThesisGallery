import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Activity, 
  Database, 
  Shield, 
  Zap, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  Download,
  Share2,
  Edit3,
  Trash2
} from "lucide-react"
import type { Brand, Sector } from "@shared/schema"

interface BrandDetailModalProps {
  brand: Brand | null
  sector: Sector | null
  isOpen: boolean
  onClose: () => void
}

export function BrandDetailModal({ brand, sector, isOpen, onClose }: BrandDetailModalProps) {
  if (!brand) return null

  const metadata = brand.metadata as any
  const hasAdvancedMetrics = metadata?.productId && metadata?.activeNodes

  const handleEdit = () => {
    console.log("Edit brand:", brand.name)
    // TODO: Open edit modal
  }

  const handleDelete = () => {
    console.log("Delete brand:", brand.name)
    // TODO: Confirm and delete
  }

  const handleDownload = () => {
    console.log("Download brand data:", brand.name)
    // TODO: Generate and download brand report
  }

  const handleShare = () => {
    console.log("Share brand:", brand.name)
    navigator.clipboard.writeText(`${brand.name} - ${brand.description}`)
  }

  const handleDeploy = () => {
    console.log("Deploy brand:", brand.name)
    // TODO: Deploy brand to production
  }

  const handleConfigure = () => {
    console.log("Configure brand:", brand.name)
    // TODO: Open configuration panel
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              {sector?.emoji || "🧩"}
            </div>
            <div>
              <DialogTitle className="text-2xl">{brand.name}</DialogTitle>
              <DialogDescription className="text-base">
                {sector?.name} • {brand.integration} Integration
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Brand Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{brand.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Status</h4>
                    <Badge variant={brand.status === "active" ? "default" : "secondary"}>
                      {brand.status}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Integration</h4>
                    <Badge variant="outline">{brand.integration}</Badge>
                  </div>
                </div>

                {hasAdvancedMetrics && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Product ID</h4>
                      <code className="bg-muted px-2 py-1 rounded text-sm">{metadata.productId}</code>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Vault ID</h4>
                      <code className="bg-muted px-2 py-1 rounded text-sm">{metadata.vaultId}</code>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6 mt-6">
            {hasAdvancedMetrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Active Nodes</span>
                        <span className="font-bold">{metadata.activeNodes}</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Pulse Activity</span>
                        <span className="font-bold">{metadata.currentPulseActivity}</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Data Processed</span>
                        <span className="font-bold">{metadata.dataVolumeProcessed}</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security & Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Security Rating</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {metadata.securityRating}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Compliance Status</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {metadata.complianceStatus}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Audit</span>
                      <span className="text-sm text-muted-foreground">{metadata.lastAudit}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Basic Metrics Only</h3>
                  <p className="text-muted-foreground">Advanced metrics not available for this brand</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Brand Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleConfigure} className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Brand Settings
                </Button>
                
                <Button onClick={handleEdit} variant="outline" className="w-full">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Brand Details
                </Button>
                
                <Button onClick={handleDeploy} variant="outline" className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Deploy to Production
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={handleDownload} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              
              <Button onClick={handleShare} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Brand
              </Button>
              
              <Button onClick={handleEdit} variant="outline">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
              
              <Button onClick={handleDelete} variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Brand
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}