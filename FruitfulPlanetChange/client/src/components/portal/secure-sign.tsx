import { useState, useRef } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { queryClient, apiRequest } from "@/lib/queryClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { FileText, Shield, Key, Clock, CheckCircle, AlertTriangle, Upload, Download } from "lucide-react"

interface NDARecord {
  id: number
  participantName: string
  participantEmail: string
  participantCompany: string | null
  participantRole: string | null
  documentId: number | null
  signatureData: string | null
  status: string
  signedAt: string | null
  createdAt: string
}

interface SecureSignApiKey {
  id: number
  keyName: string
  keyValue: string
  keyType: string
  permissions: string[]
  isActive: boolean
  createdAt: string
  lastUsed: string | null
}

export function SecureSign() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("nda-portal")
  const [ndaForm, setNdaForm] = useState({
    participantName: "",
    participantEmail: "",
    participantCompany: "",
    participantRole: "",
    agreeToTerms: false
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch NDA records
  const { data: ndaRecords = [] } = useQuery<NDARecord[]>({
    queryKey: ["/api/securesign/nda-records"],
  })

  // Fetch API keys
  const { data: apiKeys = [] } = useQuery<SecureSignApiKey[]>({
    queryKey: ["/api/securesign/api-keys"],
  })

  // Create NDA mutation
  const createNDAMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/securesign/nda-records", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/securesign/nda-records"] })
      toast({ title: "Success", description: "NDA submitted successfully!" })
      setNdaForm({
        participantName: "",
        participantEmail: "",
        participantCompany: "",
        participantRole: "",
        agreeToTerms: false
      })
      setUploadedFile(null)
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit NDA. Please try again.", variant: "destructive" })
    }
  })

  const handleNDASubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ndaForm.agreeToTerms) {
      toast({ title: "Error", description: "Please agree to the terms and conditions.", variant: "destructive" })
      return
    }
    createNDAMutation.mutate({
      ...ndaForm,
      status: "pending",
      metadata: {
        submissionSource: "SecureSign Portal",
        hasAttachment: !!uploadedFile,
        attachmentName: uploadedFile?.name
      }
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      toast({ title: "File uploaded", description: `${file.name} uploaded successfully.` })
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "signed": return "default"
      case "pending": return "secondary"
      case "expired": return "destructive"
      default: return "outline"
    }
  }

  const getKeyTypeBadgeVariant = (keyType: string) => {
    switch (keyType) {
      case "production": return "default"
      case "development": return "secondary"
      case "webhook": return "outline"
      default: return "outline"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SecureSign™ Portal
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          VIP-Level Legal Document Management & NDA Processing System
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <span>Enterprise Security</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span>256-bit Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-purple-500" />
            <span>Audit Compliance</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("nda-portal")}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === "nda-portal"
                ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 font-medium"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            NDA Portal
          </button>
          <button
            onClick={() => setActiveTab("api-management")}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === "api-management"
                ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 font-medium"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            API Management
          </button>
          <button
            onClick={() => setActiveTab("audit-trail")}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === "audit-trail"
                ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 font-medium"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Audit Trail
          </button>
        </div>
      </div>

      {/* NDA Portal Tab */}
      {activeTab === "nda-portal" && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* NDA Submission Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Submit NDA Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNDASubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input
                    required
                    value={ndaForm.participantName}
                    onChange={(e) => setNdaForm(prev => ({ ...prev, participantName: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <Input
                    type="email"
                    required
                    value={ndaForm.participantEmail}
                    onChange={(e) => setNdaForm(prev => ({ ...prev, participantEmail: e.target.value }))}
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Company/Organization</label>
                  <Input
                    value={ndaForm.participantCompany}
                    onChange={(e) => setNdaForm(prev => ({ ...prev, participantCompany: e.target.value }))}
                    placeholder="Enter your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Role/Position</label>
                  <Input
                    value={ndaForm.participantRole}
                    onChange={(e) => setNdaForm(prev => ({ ...prev, participantRole: e.target.value }))}
                    placeholder="Enter your role or position"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Supporting Documents (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, TXT up to 10MB</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse Files
                    </Button>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={ndaForm.agreeToTerms}
                    onCheckedChange={(checked) => 
                      setNdaForm(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                    }
                  />
                  <label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the terms and conditions of the Fruitful Global Non-Disclosure Agreement 
                    and understand that all shared information will remain confidential.
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createNDAMutation.isPending}
                >
                  {createNDAMutation.isPending ? "Submitting..." : "Submit NDA Request"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent NDA Submissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Recent NDA Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ndaRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No NDA submissions yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ndaRecords.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div>
                        <p className="font-medium">{record.participantName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{record.participantEmail}</p>
                        {record.participantCompany && (
                          <p className="text-xs text-gray-500">{record.participantCompany}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusBadgeVariant(record.status)}>
                          {record.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(record.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Management Tab */}
      {activeTab === "api-management" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-purple-600" />
                SecureSign API Keys
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Manage API keys for SecureSign integration and external services
              </p>
            </CardHeader>
            <CardContent>
              {apiKeys.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No API keys configured yet</p>
                  <Button className="mt-4">Add API Key</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Key Name</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Last Used</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiKeys.map((key) => (
                        <tr key={key.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3">
                            <div>
                              <p className="font-medium">{key.keyName}</p>
                              <p className="text-xs font-mono text-gray-500">
                                {key.keyValue.substring(0, 20)}...
                              </p>
                            </div>
                          </td>
                          <td className="py-3">
                            <Badge variant={getKeyTypeBadgeVariant(key.keyType)}>
                              {key.keyType}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <Badge variant={key.isActive ? "default" : "destructive"}>
                              {key.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                            {key.lastUsed 
                              ? new Date(key.lastUsed).toLocaleDateString()
                              : "Never"
                            }
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Audit Trail Tab */}
      {activeTab === "audit-trail" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Security Audit Trail
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Complete audit log of all SecureSign activities and security events
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Audit Trail Coming Soon</p>
              <p>Complete security logging and compliance reporting will be available here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}