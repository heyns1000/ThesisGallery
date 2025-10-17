import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Unlock, Crown, Zap, Star } from "lucide-react"
import { hasVersionAccess, getAvailableVersions, PLAN_VERSION_MATRIX } from "@shared/subscription-schema"

interface VersionSelectorProps {
  onVersionChange: (version: string) => void
  selectedVersion: string
  sector?: string
}

export function VersionSelector({ onVersionChange, selectedVersion, sector }: VersionSelectorProps) {
  // Mock user subscription - in real app this would come from auth context
  const [userSubscription] = useState({
    planType: "free", // This should come from user context
    maxVersion: "V1",
    isActive: true
  })

  const availableVersions = getAvailableVersions(userSubscription.planType)
  const allVersions = ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9"]

  const getVersionStatus = (version: string) => {
    const isAvailable = hasVersionAccess(userSubscription.planType, version)
    return {
      available: isAvailable,
      locked: !isAvailable,
      current: version === selectedVersion
    }
  }

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case "free": return <Zap className="h-4 w-4" />
      case "basic": return <Star className="h-4 w-4" />
      case "premium": return <Crown className="h-4 w-4" />
      case "enterprise": return <Crown className="h-4 w-4 text-purple-500" />
      default: return <Zap className="h-4 w-4" />
    }
  }

  const getUpgradeMessage = (version: string) => {
    const requiredPlan = Object.entries(PLAN_VERSION_MATRIX).find(([planKey, plan]) => 
      hasVersionAccess(planKey, version)
    )?.[0] || "premium"
    
    return `Upgrade to ${requiredPlan} plan to access ${version} features`
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <Card className="border-cyan-200 dark:border-cyan-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getPlanIcon(userSubscription.planType)}
              <CardTitle className="text-lg capitalize">
                {userSubscription.planType} Plan
              </CardTitle>
            </div>
            <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
              Max: {userSubscription.maxVersion}
            </Badge>
          </div>
          <CardDescription>
            {PLAN_VERSION_MATRIX[userSubscription.planType as keyof typeof PLAN_VERSION_MATRIX]?.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Version Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Version Selection</CardTitle>
          <CardDescription>
            Choose your plan version to access different features and brand levels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Version Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Version</label>
            <Select value={selectedVersion} onValueChange={onVersionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a version" />
              </SelectTrigger>
              <SelectContent>
                {allVersions.map((version) => {
                  const status = getVersionStatus(version)
                  return (
                    <SelectItem 
                      key={version} 
                      value={version}
                      disabled={status.locked}
                      className={status.locked ? "opacity-50" : ""}
                    >
                      <div className="flex items-center gap-2">
                        {status.locked ? (
                          <Lock className="h-3 w-3 text-red-500" />
                        ) : (
                          <Unlock className="h-3 w-3 text-green-500" />
                        )}
                        <span>{version}</span>
                        {status.locked && (
                          <Badge variant="outline" className="text-xs">
                            Locked
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Access Denied Alert */}
          {!hasVersionAccess(userSubscription.planType, selectedVersion) && (
            <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>{getUpgradeMessage(selectedVersion)}</p>
                  <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600">
                    Upgrade Plan
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Version Grid Display */}
          <div className="grid grid-cols-3 gap-2">
            {allVersions.map((version) => {
              const status = getVersionStatus(version)
              return (
                <Button
                  key={version}
                  variant={status.current ? "default" : status.available ? "outline" : "ghost"}
                  size="sm"
                  disabled={status.locked}
                  onClick={() => status.available && onVersionChange(version)}
                  className={`
                    relative
                    ${status.current ? "bg-cyan-500 text-white" : ""}
                    ${status.locked ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <div className="flex items-center gap-1">
                    {status.locked ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Unlock className="h-3 w-3" />
                    )}
                    {version}
                  </div>
                  {status.locked && (
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-20 rounded" />
                  )}
                </Button>
              )
            })}
          </div>

          {/* Feature List for Current Version */}
          {hasVersionAccess(userSubscription.planType, selectedVersion) && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                Available in {selectedVersion}:
              </h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                {sector && (
                  <>
                    <li>• Full {sector} sector access</li>
                    <li>• All brand elements and nodes</li>
                    <li>• Integration with VaultMesh™</li>
                    <li>• Real-time ecosystem data</li>
                  </>
                )}
                {!sector && (
                  <>
                    <li>• Access to all available sectors</li>
                    <li>• Brand management tools</li>
                    <li>• Ecosystem explorer</li>
                    <li>• Analytics dashboard</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}