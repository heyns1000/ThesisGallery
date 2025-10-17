import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Shield, Zap, CheckCircle2, AlertTriangle, Wrench, FileCode, Cpu, MousePointer } from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"

interface ButtonDiagnostic {
  file: string
  line: number
  element: string
  type: 'button' | 'Button' | 'interactive'
  handler: string | null
  status: 'functional' | 'broken' | 'temp-repaired'
  issue?: string
  repairAction?: string
  timestamp: string
}

interface ButtonValidationStatus {
  totalScanned: number
  functionalCount: number
  brokenCount: number
  repairedCount: number
  functionalPercentage: number
  buttons: ButtonDiagnostic[]
  cadInterfaceButtons: any[]
  scrollTriggers: any[]
  faaGridButtons: any[]
  lastScan: string
  status: '🧬 Button Layer Fully Operational' | '🧱 Temporary Scrolls Await Final Bind'
}

export default function OmniuniversalButtonValidator() {
  const { toast } = useToast()
  const [filterType, setFilterType] = useState<'all' | 'functional' | 'broken' | 'repaired'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: validationStatus, isLoading, refetch } = useQuery<ButtonValidationStatus>({
    queryKey: ['/api/button-validation/status'],
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  })

  const scanMutation = useMutation({
    mutationFn: () => apiRequest('/api/button-validation/scan', 'POST'),
    onSuccess: (data) => {
      toast({
        title: "🔍 Scan Complete",
        description: `Omniuniversal button scan completed successfully!`,
        variant: "default",
      })
      refetch()
    },
    onError: (error) => {
      toast({
        title: "❌ Scan Failed",
        description: "Button validation scan failed. Check console for details.",
        variant: "destructive",
      })
    },
  })

  const repairMutation = useMutation({
    mutationFn: () => apiRequest('/api/button-validation/repair', 'POST'),
    onSuccess: (data: any) => {
      toast({
        title: "🔧 Auto-Repair Complete",
        description: `Successfully repaired ${data.repaired} broken buttons!`,
        variant: "default",
      })
      refetch()
    },
    onError: (error) => {
      toast({
        title: "❌ Repair Failed",
        description: "Button auto-repair failed. Check console for details.",
        variant: "destructive",
      })
    },
  })

  const getFilteredButtons = () => {
    if (!validationStatus?.buttons) return []
    
    let filtered = validationStatus.buttons
    
    if (filterType !== 'all') {
      filtered = filtered.filter(button => button.status === filterType)
    }
    
    if (searchTerm) {
      filtered = filtered.filter(button =>
        button.file.toLowerCase().includes(searchTerm.toLowerCase()) ||
        button.element.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (button.issue && button.issue.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    return filtered
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'functional': return 'text-green-400'
      case 'broken': return 'text-red-400'
      case 'temp-repaired': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'functional': return <CheckCircle2 className="h-4 w-4 text-green-400" />
      case 'broken': return <AlertTriangle className="h-4 w-4 text-red-400" />
      case 'temp-repaired': return <Wrench className="h-4 w-4 text-yellow-400" />
      default: return <MousePointer className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent">
            🧬 Omniuniversal Button Validator
          </h1>
          <p className="text-xl text-gray-300">Comprehensive button functionality validation across all UI, CAD, app layers, and scroll triggers</p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="text-lg py-2 px-4">
              <Search className="h-5 w-5 mr-2" />
              JSX/TSX/HTML Scanner
            </Badge>
            <Badge variant="secondary" className="text-lg py-2 px-4">
              <Cpu className="h-5 w-5 mr-2" />
              CAD Interface Detection
            </Badge>
            <Badge variant="secondary" className="text-lg py-2 px-4">
              <Zap className="h-5 w-5 mr-2" />
              Auto-Repair System
            </Badge>
          </div>
        </div>

        {/* Control Panel */}
        <Card className="bg-gray-800 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-6 w-6 text-cyan-400" />
              Validation Control Panel
            </CardTitle>
            <CardDescription>Scan and repair button functionality across your entire ecosystem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4 flex-wrap">
              <Button 
                onClick={() => scanMutation.mutate()}
                disabled={scanMutation.isPending}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                data-testid="button-scan-all"
              >
                {scanMutation.isPending ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    🔍 Scan All Buttons
                  </>
                )}
              </Button>

              <Button 
                onClick={() => repairMutation.mutate()}
                disabled={repairMutation.isPending || !validationStatus?.brokenCount}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                data-testid="button-auto-repair"
              >
                {repairMutation.isPending ? (
                  <>
                    <Wrench className="h-4 w-4 mr-2 animate-spin" />
                    Repairing...
                  </>
                ) : (
                  <>
                    <Wrench className="h-4 w-4 mr-2" />
                    🔧 Auto-Repair Broken Buttons
                  </>
                )}
              </Button>
            </div>

            {validationStatus && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-cyan-400">{validationStatus.totalScanned}</div>
                  <div className="text-sm text-gray-400">Total Scanned</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-400">{validationStatus.functionalCount}</div>
                  <div className="text-sm text-gray-400">Functional</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-red-400">{validationStatus.brokenCount}</div>
                  <div className="text-sm text-gray-400">Broken</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-400">{validationStatus.repairedCount}</div>
                  <div className="text-sm text-gray-400">Repaired</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Overview */}
        {validationStatus && (
          <Card className="bg-gray-800 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-cyan-400" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Button Functionality</span>
                  <span className={validationStatus.functionalPercentage >= 95 ? 'text-green-400' : 'text-yellow-400'}>
                    {validationStatus.functionalPercentage}%
                  </span>
                </div>
                <Progress value={validationStatus.functionalPercentage} className="h-3" />
              </div>
              
              <div className={`p-4 rounded-lg border ${
                validationStatus.status === '🧬 Button Layer Fully Operational'
                  ? 'bg-green-500/20 border-green-500/50'
                  : 'bg-yellow-500/20 border-yellow-500/50'
              }`}>
                <Badge variant="default" className={
                  validationStatus.status === '🧬 Button Layer Fully Operational'
                    ? 'bg-green-600 text-white'
                    : 'bg-yellow-600 text-white'
                }>
                  {validationStatus.status}
                </Badge>
                <p className={`mt-2 ${
                  validationStatus.status === '🧬 Button Layer Fully Operational'
                    ? 'text-green-400'
                    : 'text-yellow-400'
                }`}>
                  {validationStatus.status === '🧬 Button Layer Fully Operational'
                    ? 'All critical button functionality is operational!'
                    : 'Some buttons require attention or temporary handlers are active.'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Results */}
        {validationStatus && (
          <Card className="bg-gray-800 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileCode className="h-6 w-6 text-cyan-400" />
                Button Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                <div className="flex justify-between items-center mb-4">
                  <TabsList className="bg-gray-700">
                    <TabsTrigger value="all">All ({validationStatus.totalScanned})</TabsTrigger>
                    <TabsTrigger value="functional">Functional ({validationStatus.functionalCount})</TabsTrigger>
                    <TabsTrigger value="broken">Broken ({validationStatus.brokenCount})</TabsTrigger>
                    <TabsTrigger value="repaired">Repaired ({validationStatus.repairedCount})</TabsTrigger>
                  </TabsList>
                  
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search files, elements, or issues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 w-64"
                      data-testid="input-search-buttons"
                    />
                  </div>
                </div>

                <TabsContent value={filterType}>
                  <ScrollArea className="h-96 w-full">
                    <div className="space-y-2">
                      {getFilteredButtons().map((button, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            button.status === 'functional' 
                              ? 'bg-green-500/10 border-green-500/30'
                              : button.status === 'broken'
                              ? 'bg-red-500/10 border-red-500/30'
                              : 'bg-yellow-500/10 border-yellow-500/30'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(button.status)}
                                <code className="text-sm bg-gray-700 px-2 py-1 rounded">
                                  {button.file}:{button.line}
                                </code>
                                <Badge variant="outline" className={getStatusColor(button.status)}>
                                  {button.type}
                                </Badge>
                              </div>
                              
                              <div className="text-sm text-gray-300 font-mono bg-gray-900 p-2 rounded">
                                {button.element}
                              </div>
                              
                              {button.handler && (
                                <div className="text-xs text-gray-400">
                                  Handler: <code className="bg-gray-700 px-1 rounded">{button.handler}</code>
                                </div>
                              )}
                              
                              {button.issue && (
                                <div className="text-sm text-red-400">
                                  Issue: {button.issue}
                                </div>
                              )}
                            </div>
                            
                            <Badge variant="secondary" className={getStatusColor(button.status)}>
                              {button.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      
                      {getFilteredButtons().length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          No buttons found matching current filters.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}