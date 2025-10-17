import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckSquare, ClipboardList, FileCheck, Shield } from "lucide-react"

export default function FAAIntakeChecklistPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="faa-intake-checklist-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-2 border-green-500/20 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckSquare className="h-8 w-8 text-white" data-testid="icon-checklist" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">FAA.ZONE™ Intake Checklist</CardTitle>
            <CardDescription className="text-lg">
              Comprehensive onboarding checklist for FAA.ZONE ecosystem integration
            </CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="outline" className="border-green-500 text-green-400">FAA.ZONE™</Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-400">Onboarding</Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card data-testid="section-card-documentation">
            <CardHeader>
              <ClipboardList className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>Documentation Review</CardTitle>
              <CardDescription>
                Complete required documentation and legal agreements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-green-500" />
                  Business registration documents
                </li>
                <li className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-green-500" />
                  Tax compliance certificates
                </li>
                <li className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-green-500" />
                  Insurance verification
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card data-testid="section-card-security">
            <CardHeader>
              <Shield className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Security Setup</CardTitle>
              <CardDescription>
                Configure VaultMesh™ security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-blue-500" />
                  Two-factor authentication
                </li>
                <li className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-blue-500" />
                  API key generation
                </li>
                <li className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-blue-500" />
                  Role-based permissions
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 text-center py-12">
            <ClipboardList className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interactive Checklist Coming Soon</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Guided onboarding with progress tracking, automated verification, and step-by-step integration into the FAA.ZONE ecosystem.
            </p>
            <Button className="mt-6 bg-green-500 hover:bg-green-600" data-testid="button-start">
              Start Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
