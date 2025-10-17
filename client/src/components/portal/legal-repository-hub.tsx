import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Download, ExternalLink, Plus, Shield, BookOpen, Search, Filter, Trees, Globe } from "lucide-react"
import { motion } from "framer-motion"
import { BaobabEnvironmentalLawHub } from "./baobab-environmental-law-hub"

interface LegalDocument {
  id: string
  title: string
  description: string
  url: string
  icon: string
  category: string
  status: "active" | "draft" | "archived"
  lastUpdated: string
  size?: string
  type: "pdf" | "doc" | "contract" | "nda" | "template"
}

interface LegalRepositoryHubProps {
  sectorId?: number
  sectorName?: string
  className?: string
}

export function LegalRepositoryHub({ sectorId, sectorName, className = "" }: LegalRepositoryHubProps) {
  const [documents, setDocuments] = useState<LegalDocument[]>([])
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeHub, setActiveHub] = useState<"legal" | "environmental">("legal")
  
  // New document form state
  const [newDoc, setNewDoc] = useState({
    title: "",
    description: "",
    url: "",
    icon: "📄",
    category: "general",
    type: "pdf" as LegalDocument["type"]
  })

  // Sample legal documents with comprehensive categories
  const sampleDocuments: LegalDocument[] = [
    {
      id: "1",
      title: "Master Service Agreement Template",
      description: "Comprehensive MSA template for sector partnerships and service delivery",
      url: "/legal/msa-template.pdf",
      icon: "📋",
      category: "contracts",
      status: "active",
      lastUpdated: "2024-01-15",
      size: "2.3 MB",
      type: "contract"
    },
    {
      id: "2", 
      title: "Non-Disclosure Agreement (NDA)",
      description: "Standard NDA for protecting confidential sector information and trade secrets",
      url: "/legal/standard-nda.pdf",
      icon: "🔒",
      category: "nda",
      status: "active",
      lastUpdated: "2024-01-10",
      size: "1.8 MB",
      type: "nda"
    },
    {
      id: "3",
      title: "Sector Partnership Framework",
      description: "Legal framework for establishing strategic partnerships within sector ecosystems",
      url: "/legal/partnership-framework.pdf",
      icon: "🤝",
      category: "partnerships",
      status: "active",
      lastUpdated: "2024-01-12",
      size: "3.1 MB",
      type: "contract"
    },
    {
      id: "4",
      title: "Intellectual Property Guidelines",
      description: "Comprehensive IP protection and licensing guidelines for sector innovations",
      url: "/legal/ip-guidelines.pdf",
      icon: "💡",
      category: "ip",
      status: "active",
      lastUpdated: "2024-01-08",
      size: "2.7 MB",
      type: "pdf"
    },
    {
      id: "5",
      title: "SecureSign™ VIP Integration Guide",
      description: "Technical and legal documentation for SecureSign™ VIP implementation",
      url: "/legal/securesign-integration.pdf",
      icon: "🔐",
      category: "integration",
      status: "active",
      lastUpdated: "2024-01-14",
      size: "4.2 MB",
      type: "template"
    },
    {
      id: "6",
      title: "King Price Insurance Partnership Agreement",
      description: "Partnership documentation and sponsorship terms with King Price Insurance",
      url: "/legal/king-price-partnership.pdf",
      icon: "🏛️",
      category: "partnerships",
      status: "active",
      lastUpdated: "2024-01-11",
      size: "5.8 MB",
      type: "contract"
    }
  ]

  const categories = [
    { value: "all", label: "All Documents", count: 0 },
    { value: "contracts", label: "Contracts", count: 0 },
    { value: "nda", label: "NDAs", count: 0 },
    { value: "partnerships", label: "Partnerships", count: 0 },
    { value: "ip", label: "Intellectual Property", count: 0 },
    { value: "integration", label: "Integrations", count: 0 },
    { value: "templates", label: "Templates", count: 0 }
  ]

  useEffect(() => {
    // Simulate loading legal documents
    setTimeout(() => {
      setDocuments(sampleDocuments)
      setLoading(false)
    }, 1000)
  }, [sectorId])

  // Filter documents based on search and category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Update category counts
  categories.forEach(cat => {
    if (cat.value === "all") {
      cat.count = documents.length
    } else {
      cat.count = documents.filter(doc => doc.category === cat.value).length
    }
  })

  const handleAddDocument = () => {
    if (!newDoc.title || !newDoc.description || !newDoc.url) return

    const document: LegalDocument = {
      id: Date.now().toString(),
      ...newDoc,
      status: "active",
      lastUpdated: new Date().toISOString().split('T')[0],
      size: "Unknown"
    }

    setDocuments(prev => [document, ...prev])
    setNewDoc({
      title: "",
      description: "",
      url: "",
      icon: "📄",
      category: "general",
      type: "pdf"
    })
    setShowAddForm(false)
  }

  const getTypeIcon = (type: LegalDocument["type"]) => {
    switch (type) {
      case "contract": return "📋"
      case "nda": return "🔒"
      case "template": return "📝"
      case "doc": return "📄"
      default: return "📄"
    }
  }

  const getStatusColor = (status: LegalDocument["status"]) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "draft": return "bg-yellow-500"
      case "archived": return "bg-gray-500"
      default: return "bg-blue-500"
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-600" />
            Legal Repository Hub
            {sectorName && <Badge variant="outline" className="ml-2">{sectorName}</Badge>}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive legal documentation, SecureSign™ VIP integration, and Baobab Environmental Law mega centre for law firms supporting Fruitful Crate Dance and Banimal giving loop initiatives
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setActiveHub("legal")}
            variant={activeHub === "legal" ? "default" : "outline"}
            className={activeHub === "legal" ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            <Shield className="h-4 w-4 mr-2" />
            Legal Documents
          </Button>
          <Button 
            onClick={() => setActiveHub("environmental")}
            variant={activeHub === "environmental" ? "default" : "outline"}
            className={activeHub === "environmental" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <Trees className="h-4 w-4 mr-2" />
            Baobab Environmental Law
          </Button>
        </div>
      </div>

      {/* Content based on active hub */}
      {activeHub === "legal" ? (
        <>
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search legal documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <Button
                      key={category.value}
                      variant={selectedCategory === category.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.value)}
                      className="whitespace-nowrap"
                    >
                      {category.label} ({category.count})
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Legal Documents ({filteredDocuments.length})
          </h3>
          
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search or category filter
                </p>
                <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <Card className={`transition-all hover:shadow-lg ${
                    selectedDocument?.id === doc.id ? 'ring-2 ring-purple-500' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{doc.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium truncate">{doc.title}</h4>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(doc.status)}`}></div>
                              <Badge variant="outline" className="text-xs">
                                {doc.type.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {doc.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Updated: {doc.lastUpdated}</span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Document Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Document Details</h3>
          
          {selectedDocument ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">{selectedDocument.icon}</span>
                  {selectedDocument.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedDocument.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Category:</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedDocument.category}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedDocument.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <div className="flex items-center gap-2 ml-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedDocument.status)}`}></div>
                      <span className="capitalize">{selectedDocument.status}</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Size:</span>
                    <span className="ml-2">{selectedDocument.size}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <span className="font-medium text-sm">Last Updated:</span>
                  <span className="ml-2 text-sm">{selectedDocument.lastUpdated}</span>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <a href={selectedDocument.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Document
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={selectedDocument.url} download>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Select a Document</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a legal document from the list to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

          {/* SecureSign™ Integration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                SecureSign™ VIP Integration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Integration Status</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Secured Documents</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">VIP</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Access Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Baobab Environmental Law Hub */
        <BaobabEnvironmentalLawHub 
          sectorId={sectorId} 
          sectorName={sectorName}
          className="mt-6"
        />
      )}
    </div>
  )
}