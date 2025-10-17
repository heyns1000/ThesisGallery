import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GitBranch, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface Version {
  id: string
  name: string
  status: 'current' | 'stable' | 'beta' | 'legacy'
  releaseDate: string
  description: string
}

export function VersionSelector() {
  const [selectedVersion, setSelectedVersion] = useState<string>("v3.0")

  const versions: Version[] = [
    {
      id: "v3.0",
      name: "Version 3.0",
      status: "current",
      releaseDate: "2025-01-15",
      description: "Latest release with full FAA.ZONE integration and VaultMesh™ 2.0"
    },
    {
      id: "v2.5",
      name: "Version 2.5",
      status: "stable",
      releaseDate: "2024-11-20",
      description: "Stable release with HotStack deployment features"
    },
    {
      id: "v2.0",
      name: "Version 2.0",
      status: "stable",
      releaseDate: "2024-08-10",
      description: "Major release with Seedwave™ Admin integration"
    },
    {
      id: "v1.5",
      name: "Version 1.5",
      status: "legacy",
      releaseDate: "2024-05-01",
      description: "Legacy version maintained for compatibility"
    }
  ]

  const getStatusIcon = (status: Version['status']) => {
    switch (status) {
      case 'current': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'stable': return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'beta': return <Clock className="h-5 w-5 text-yellow-500" />
      case 'legacy': return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: Version['status']) => {
    switch (status) {
      case 'current': return 'border-green-500 text-green-400'
      case 'stable': return 'border-blue-500 text-blue-400'
      case 'beta': return 'border-yellow-500 text-yellow-400'
      case 'legacy': return 'border-gray-500 text-gray-400'
    }
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900" data-testid="version-selector-container">
      <Card className="border-2 border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <GitBranch className="h-8 w-8 text-white" data-testid="icon-version" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Version Selector
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Choose your platform version for compatibility and features
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {versions.map((version) => (
          <Card 
            key={version.id}
            className={`bg-white dark:bg-gray-800 cursor-pointer transition-all hover:shadow-lg ${
              selectedVersion === version.id ? 'ring-2 ring-cyan-500' : ''
            }`}
            onClick={() => setSelectedVersion(version.id)}
            data-testid={`version-card-${version.id}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(version.status)}
                  <div>
                    <CardTitle className="text-lg">{version.name}</CardTitle>
                    <CardDescription className="text-sm">
                      Released: {new Date(version.releaseDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(version.status)}
                  data-testid={`badge-status-${version.id}`}
                >
                  {version.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {version.description}
              </p>
              {selectedVersion === version.id && (
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600" data-testid={`button-select-${version.id}`}>
                  Currently Selected
                </Button>
              )}
              {selectedVersion !== version.id && (
                <Button variant="outline" className="w-full" data-testid={`button-choose-${version.id}`}>
                  Select Version
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <GitBranch className="h-16 w-16 text-blue-500 mx-auto" data-testid="icon-branch" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Version Management
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Select the appropriate version for your deployment. Current version recommended for latest features and security updates.
            </p>
            <div className="flex justify-center gap-4">
              <Button className="bg-blue-500 hover:bg-blue-600" data-testid="button-changelog">
                View Changelog
              </Button>
              <Button variant="outline" data-testid="button-docs">
                Version Documentation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
