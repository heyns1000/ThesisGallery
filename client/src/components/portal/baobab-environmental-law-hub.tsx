import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Scale, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Search,
  Filter,
  Download,
  ExternalLink,
  Shield,
  Globe,
  BookOpen,
  Gavel,
  Leaf,
  Building
} from "lucide-react"

interface LegalDocument {
  id: string
  title: string
  type: "regulation" | "statute" | "treaty" | "compliance"
  jurisdiction: string
  status: "active" | "pending" | "archived"
  effectiveDate: string
  category: string
  description: string
  tags: string[]
}

interface ComplianceItem {
  id: string
  requirement: string
  status: "compliant" | "pending" | "non-compliant"
  deadline: string
  priority: "high" | "medium" | "low"
  assignedTo: string
}

export function BaobabEnvironmentalLawHub() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("regulations")

  const { data: legalDocuments = [], isLoading } = useQuery<LegalDocument[]>({
    queryKey: ["/api/legal/documents"]
  })

  const { data: complianceItems = [] } = useQuery<ComplianceItem[]>({
    queryKey: ["/api/compliance/items"]
  })

  const categories = [
    { id: "all", label: "All Documents", icon: FileText },
    { id: "environmental", label: "Environmental", icon: Leaf },
    { id: "agricultural", label: "Agricultural", icon: Building },
    { id: "trademark", label: "Trademark", icon: Shield },
    { id: "international", label: "International", icon: Globe }
  ]

  const filteredDocuments = legalDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "compliant":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "archived":
      case "non-compliant":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "regulation": return <Gavel className="w-5 h-5 text-blue-500" />
      case "statute": return <Scale className="w-5 h-5 text-purple-500" />
      case "treaty": return <Globe className="w-5 h-5 text-green-500" />
      case "compliance": return <CheckCircle className="w-5 h-5 text-orange-500" />
      default: return <FileText className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2" data-testid="heading-environmental-law-hub">
              <Scale className="w-8 h-8 text-blue-500" />
              Baobab Environmental Law Hub
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Legal Compliance & Environmental Regulations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge 
              variant="outline" 
              className={complianceItems.filter(c => c.status === "compliant").length === complianceItems.length
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }
              data-testid="badge-compliance-status"
            >
              {complianceItems.filter(c => c.status === "compliant").length === complianceItems.length ? (
                <><CheckCircle className="w-3 h-3 mr-1" />Fully Compliant</>
              ) : (
                <><AlertTriangle className="w-3 h-3 mr-1" />
                {complianceItems.filter(c => c.status !== "compliant").length} Pending
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Documents</p>
                  <p className="text-2xl font-bold" data-testid="text-total-documents">{legalDocuments.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Regulations</p>
                  <p className="text-2xl font-bold" data-testid="text-active-regulations">
                    {legalDocuments.filter(d => d.status === "active").length}
                  </p>
                </div>
                <Gavel className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Compliance Items</p>
                  <p className="text-2xl font-bold" data-testid="text-compliance-items">{complianceItems.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Jurisdictions</p>
                  <p className="text-2xl font-bold" data-testid="text-jurisdictions">
                    {new Set(legalDocuments.map(d => d.jurisdiction)).size}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="regulations" className="flex items-center gap-2" data-testid="tab-regulations">
              <BookOpen className="w-4 h-4" />
              Regulations
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2" data-testid="tab-compliance">
              <CheckCircle className="w-4 h-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2" data-testid="tab-resources">
              <Shield className="w-4 h-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="regulations" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search legal documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-documents"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                    data-testid={`button-filter-${category.id}`}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Documents Grid */}
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-gray-600 dark:text-gray-400" data-testid="text-loading-documents">Loading documents...</p>
              ) : filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-lg transition-shadow" data-testid={`card-document-${doc.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getDocumentTypeIcon(doc.type)}
                          <div>
                            <CardTitle className="text-lg" data-testid={`text-document-title-${doc.id}`}>{doc.title}</CardTitle>
                            <CardDescription className="mt-1">{doc.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(doc.status)} data-testid={`badge-document-status-${doc.id}`}>
                            {doc.status}
                          </Badge>
                          <Badge variant="outline" data-testid={`badge-document-type-${doc.id}`}>{doc.type}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Jurisdiction:</span>
                          <p className="font-medium" data-testid={`text-document-jurisdiction-${doc.id}`}>{doc.jurisdiction}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Effective Date:</span>
                          <p className="font-medium" data-testid={`text-document-date-${doc.id}`}>{doc.effectiveDate}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Tags:</span>
                        <div className="flex flex-wrap gap-2">
                          {doc.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" data-testid={`badge-tag-${doc.id}-${idx}`}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" data-testid={`button-view-${doc.id}`}>
                          <FileText className="w-4 h-4 mr-2" />
                          View Document
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-download-${doc.id}`}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-external-${doc.id}`}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          External Link
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2" data-testid="text-no-documents-heading">
                    No documents found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400" data-testid="text-no-documents-description">
                    Try adjusting your search criteria or category filter.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-compliance-tracker">Compliance Tracker</CardTitle>
                <CardDescription>Monitor and manage compliance requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border rounded-lg"
                      data-testid={`card-compliance-${item.id}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1" data-testid={`text-compliance-requirement-${item.id}`}>
                            {item.requirement}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span data-testid={`text-compliance-assignee-${item.id}`}>Assigned to: {item.assignedTo}</span>
                            <span data-testid={`text-compliance-deadline-${item.id}`}>Deadline: {item.deadline}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(item.priority)} data-testid={`badge-compliance-priority-${item.id}`}>
                            {item.priority}
                          </Badge>
                          <Badge className={getStatusColor(item.status)} data-testid={`badge-compliance-status-${item.id}`}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" data-testid={`button-update-compliance-${item.id}`}>
                          Update Status
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-view-details-compliance-${item.id}`}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                  {complianceItems.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400" data-testid="text-no-compliance-items">
                        No compliance items to track
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-legal-resources">Legal Resources</CardTitle>
                <CardDescription>Access legal guides and reference materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2" data-testid="text-resource-environmental-guide">Environmental Law Guide</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Comprehensive guide to environmental regulations and compliance
                    </p>
                    <Button size="sm" variant="outline" data-testid="button-download-environmental-guide">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2" data-testid="text-resource-trademark-handbook">Trademark Law Handbook</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Essential reference for trademark registration and protection
                    </p>
                    <Button size="sm" variant="outline" data-testid="button-download-trademark-handbook">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
