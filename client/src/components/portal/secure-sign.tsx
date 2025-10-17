import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Shield, 
  FileSignature, 
  Lock, 
  CheckCircle,
  AlertTriangle,
  Fingerprint,
  Key,
  Upload,
  Download,
  Clock,
  User
} from "lucide-react"

interface Signature {
  id: string
  documentName: string
  signedBy: string
  signedAt: string
  status: "verified" | "pending" | "expired"
  hash: string
  algorithm: string
  certificate: string
}

export function SecureSign() {
  const [documentToSign, setDocumentToSign] = useState("")
  const [signatureMethod, setSignatureMethod] = useState<"digital" | "biometric" | "certificate">("digital")

  const recentSignatures: Signature[] = [
    {
      id: "sig-001",
      documentName: "Environmental Impact Assessment 2025",
      signedBy: "Dr. Sarah Johnson",
      signedAt: "2025-07-19T14:30:00Z",
      status: "verified",
      hash: "SHA-256:a7f8c9d2e4b1c6d8e9f0a1b2c3d4e5f6",
      algorithm: "RSA-4096",
      certificate: "X.509 v3"
    },
    {
      id: "sig-002",
      documentName: "Partnership Agreement - Seedwave & VaultKey",
      signedBy: "Michael Chen",
      signedAt: "2025-07-18T10:15:00Z",
      status: "verified",
      hash: "SHA-256:b8e9d0c3f5a2d7b9c0d1e2f3a4b5c6d7",
      algorithm: "ECDSA P-384",
      certificate: "X.509 v3"
    },
    {
      id: "sig-003",
      documentName: "Trademark Registration Documents",
      signedBy: "Legal Team",
      signedAt: "2025-07-17T16:45:00Z",
      status: "pending",
      hash: "SHA-256:c9f0a1d4e6b3c8d0a1e2f3b4c5d6e7f8",
      algorithm: "RSA-2048",
      certificate: "X.509 v3"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "expired":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Shield className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const handleSign = () => {
    console.log("Signing document with method:", signatureMethod)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="heading-secure-sign">
              SecureSign™
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Digital Signature & Document Authentication
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200" data-testid="badge-signatures-verified">
              <Shield className="w-3 h-3 mr-1" />
              {recentSignatures.filter(s => s.status === "verified").length} Verified
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200" data-testid="badge-256-bit-encryption">
              <Lock className="w-3 h-3 mr-1" />
              256-bit Encryption
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sign Document Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" data-testid="heading-sign-document">
                  <FileSignature className="w-5 h-5" />
                  Sign New Document
                </CardTitle>
                <CardDescription>
                  Upload or enter document details for digital signature
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Document Name</label>
                  <Input
                    placeholder="Enter document name..."
                    value={documentToSign}
                    onChange={(e) => setDocumentToSign(e.target.value)}
                    data-testid="input-document-name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Document Content</label>
                  <Textarea
                    placeholder="Enter document content or upload file..."
                    className="min-h-[200px]"
                    data-testid="textarea-document-content"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Signature Method</label>
                  <div className="flex gap-4">
                    <Button
                      variant={signatureMethod === "digital" ? "default" : "outline"}
                      onClick={() => setSignatureMethod("digital")}
                      className="flex items-center gap-2"
                      data-testid="button-method-digital"
                    >
                      <Key className="w-4 h-4" />
                      Digital Key
                    </Button>
                    <Button
                      variant={signatureMethod === "biometric" ? "default" : "outline"}
                      onClick={() => setSignatureMethod("biometric")}
                      className="flex items-center gap-2"
                      data-testid="button-method-biometric"
                    >
                      <Fingerprint className="w-4 h-4" />
                      Biometric
                    </Button>
                    <Button
                      variant={signatureMethod === "certificate" ? "default" : "outline"}
                      onClick={() => setSignatureMethod("certificate")}
                      className="flex items-center gap-2"
                      data-testid="button-method-certificate"
                    >
                      <Shield className="w-4 h-4" />
                      Certificate
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1" onClick={handleSign} data-testid="button-sign-document">
                    <FileSignature className="w-4 h-4 mr-2" />
                    Sign Document
                  </Button>
                  <Button variant="outline" data-testid="button-upload-file">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Signature Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-signature-stats">Signature Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Signatures</span>
                  <span className="font-bold text-lg" data-testid="text-total-signatures">{recentSignatures.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Verified</span>
                  <span className="font-bold text-lg text-green-600" data-testid="text-verified-signatures">
                    {recentSignatures.filter(s => s.status === "verified").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                  <span className="font-bold text-lg text-yellow-600" data-testid="text-pending-signatures">
                    {recentSignatures.filter(s => s.status === "pending").length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-security-info">Security Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Encryption</p>
                    <p className="text-gray-600 dark:text-gray-400">AES-256-GCM</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Key Storage</p>
                    <p className="text-gray-600 dark:text-gray-400">Hardware Security Module</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Compliance</p>
                    <p className="text-gray-600 dark:text-gray-400">eIDAS, ESIGN Act</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Signatures */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle data-testid="heading-recent-signatures">Recent Signatures</CardTitle>
            <CardDescription>View and manage your digitally signed documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSignatures.map((signature) => (
                <div
                  key={signature.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  data-testid={`card-signature-${signature.id}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {getStatusIcon(signature.status)}
                    <div className="flex-1">
                      <h3 className="font-medium" data-testid={`text-signature-document-${signature.id}`}>
                        {signature.documentName}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {signature.signedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(signature.signedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 text-xs font-mono text-gray-500" data-testid={`text-signature-hash-${signature.id}`}>
                        {signature.hash}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge className={getStatusColor(signature.status)} data-testid={`badge-signature-status-${signature.id}`}>
                        {signature.status}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1" data-testid={`text-signature-algorithm-${signature.id}`}>
                        {signature.algorithm}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" data-testid={`button-verify-${signature.id}`}>
                      Verify
                    </Button>
                    <Button size="sm" variant="outline" data-testid={`button-download-${signature.id}`}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
