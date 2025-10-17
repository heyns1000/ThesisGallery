import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Cloud, FileCheck, Globe, Zap, CheckCircle2 } from "lucide-react"

const checklistSections = [
  {
    id: "license",
    title: "🔒 License Compliance",
    icon: FileCheck,
    items: [
      "Apache License 2.0 is embedded (/LICENSE file present)",
      "License modal or footer link is visible to all users", 
      "App declares TreatySync status and ClaimRoot activation"
    ]
  },
  {
    id: "scroll",
    title: "🧬 Scroll Infrastructure", 
    icon: Zap,
    items: [
      "ScrollStack™ linkage active (or ScrollIndex declared)",
      "VaultDNS™ binding complete (domain resolution + trace)",
      "Omnidrop compliance confirmed (upload interface matches Treaty format)"
    ]
  },
  {
    id: "cloudflare",
    title: "🌐 Cloudflare Deployment (MANDATORY)",
    icon: Shield,
    items: [
      "App is protected via Cloudflare (DNS + SSL + DDoS enabled)",
      "Firewall Rules & Bot Mitigation configured", 
      "Cache-Control & Performance Optimizations toggled",
      "Cloudflare Pages or Workers usage declared if applicable"
    ]
  },
  {
    id: "metadata",
    title: "📦 Deployment Metadata",
    icon: Globe,
    items: [
      "App Version declared in .env or metadata layer",
      "VaultMesh timestamp attached",
      "Team or individual steward responsible (tied to VaultID or ScrollKey)"
    ]
  },
  {
    id: "treaty",
    title: "🚨 Final Step: FAA Treaty Sync",
    icon: CheckCircle2,
    items: [
      "Emitted confirmation: 🧱 TreatySync Complete — App Registered with VaultLayer"
    ]
  }
]

export default function FAAIntakeChecklist() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [appName, setAppName] = useState("")
  const [treatySynced, setTreatySynced] = useState(false)

  const toggleItem = (sectionId: string, itemIndex: number) => {
    const key = `${sectionId}:${itemIndex}`
    setCompleted(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const getSectionProgress = (sectionId: string, itemCount: number) => {
    const completedItems = Array.from({ length: itemCount }, (_, i) => 
      completed[`${sectionId}:${i}`]
    ).filter(Boolean).length
    return (completedItems / itemCount) * 100
  }

  const getTotalProgress = () => {
    const totalItems = checklistSections.reduce((sum, section) => sum + section.items.length, 0)
    const completedItems = Object.values(completed).filter(Boolean).length
    return (completedItems / totalItems) * 100
  }

  const handleTreatySync = () => {
    const totalProgress = getTotalProgress()
    if (totalProgress === 100) {
      setTreatySynced(true)
      console.log('🧱 TreatySync Complete — App Registered with VaultLayer')
      console.log(`✅ ${appName || 'Unnamed App'} successfully registered under FAA Treaty protocols`)
    }
  }

  const canSyncTreaty = getTotalProgress() === 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-green-400 bg-clip-text text-transparent">
            🚀 FAA App Intake Checklist
          </h1>
          <p className="text-xl text-gray-300">Comprehensive compliance verification for FAA Treaty apps</p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="text-lg py-2 px-4">
              <Shield className="h-5 w-5 mr-2" />
              Cloudflare Mandatory
            </Badge>
            <Badge variant="secondary" className="text-lg py-2 px-4">
              <FileCheck className="h-5 w-5 mr-2" />
              Apache 2.0 Licensed
            </Badge>
            <Badge variant="secondary" className="text-lg py-2 px-4">
              <Globe className="h-5 w-5 mr-2" />
              VaultMesh Integrated
            </Badge>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gray-800 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-cyan-400" />
              Overall Progress
            </CardTitle>
            <CardDescription>Complete all sections to enable Treaty Sync</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Checklist Completion</span>
                <span className="text-cyan-400">{Math.round(getTotalProgress())}%</span>
              </div>
              <Progress value={getTotalProgress()} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-2xl font-bold text-cyan-400">
                  {Object.values(completed).filter(Boolean).length}
                </div>
                <div className="text-sm text-gray-400">Items Completed</div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {checklistSections.reduce((sum, section) => sum + section.items.length, 0)}
                </div>
                <div className="text-sm text-gray-400">Total Requirements</div>
              </div>
            </div>

            {treatySynced && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg p-4">
                <Badge variant="default" className="bg-green-600 text-white animate-pulse">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  TREATY SYNC COMPLETE
                </Badge>
                <p className="text-green-400 mt-2">App successfully registered with VaultLayer!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Checklist Sections */}
        <div className="space-y-6">
          {checklistSections.map((section) => {
            const IconComponent = section.icon
            const sectionProgress = getSectionProgress(section.id, section.items.length)
            const isComplete = sectionProgress === 100
            
            return (
              <Card key={section.id} className={`bg-gray-800 ${isComplete ? 'border-green-500/30' : 'border-gray-600/30'}`}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <IconComponent className={`h-6 w-6 ${isComplete ? 'text-green-400' : 'text-blue-400'}`} />
                    {section.title}
                    {isComplete && (
                      <Badge variant="default" className="bg-green-600 text-white">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Section Progress</span>
                      <span className={isComplete ? 'text-green-400' : 'text-blue-400'}>
                        {Math.round(sectionProgress)}%
                      </span>
                    </div>
                    <Progress value={sectionProgress} className="h-2" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.items.map((item, index) => {
                      const key = `${section.id}:${index}`
                      const isChecked = completed[key] || false
                      
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <Checkbox
                            id={key}
                            checked={isChecked}
                            onCheckedChange={() => toggleItem(section.id, index)}
                            className="mt-1"
                            data-testid={`checkbox-${section.id}-${index}`}
                          />
                          <label 
                            htmlFor={key} 
                            className={`text-sm cursor-pointer leading-relaxed ${
                              isChecked ? 'text-green-400 line-through' : 'text-gray-300'
                            }`}
                          >
                            {item}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Treaty Sync Button */}
        <div className="text-center space-y-4">
          <Button 
            onClick={handleTreatySync}
            disabled={!canSyncTreaty || treatySynced}
            className={`text-lg px-8 py-4 ${
              canSyncTreaty && !treatySynced
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                : 'bg-gray-600'
            }`}
            data-testid="button-treaty-sync"
          >
            {treatySynced ? (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Treaty Sync Complete
              </>
            ) : canSyncTreaty ? (
              <>
                <Shield className="h-5 w-5 mr-2" />
                🧱 Confirm TreatySync Completion
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-2" />
                Complete All Requirements First
              </>
            )}
          </Button>
          
          {!canSyncTreaty && (
            <p className="text-gray-400 text-sm">
              {Math.round(getTotalProgress())}% complete • {Object.values(completed).filter(Boolean).length} of {checklistSections.reduce((sum, section) => sum + section.items.length, 0)} items checked
            </p>
          )}
        </div>

      </div>
    </div>
  )
}