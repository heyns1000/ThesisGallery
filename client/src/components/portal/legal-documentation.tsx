import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DocumentViewer } from "./document-viewer"
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Shield,
  BookOpen,
  Gavel,
  Building2,
  Globe,
  RefreshCw
} from "lucide-react"

interface LegalDocument {
  id: string | number
  title: string
  type?: string
  category: string
  description: string
  lastUpdated?: string
  author?: string
  status?: string
  size?: string
  priority?: "high" | "medium" | "low"
  url?: string
  icon?: string
  tags?: string[]
  createdAt?: string
}

export function LegalDocumentation() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewingDocument, setViewingDocument] = useState<LegalDocument | null>(null)

  // Fetch real-time legal documents from the database
  const { data: legalDocs = [], isLoading } = useQuery<LegalDocument[]>({
    queryKey: ["/api/legal-documents"],
    refetchInterval: 5000 // Sync every 5 seconds for 24/7 updates
  })

  // Enhanced static documents that match the real API data structure for better integration
  const enhanceDocumentWithDefaults = (doc: any): LegalDocument => ({
    id: doc.id,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    url: doc.url,
    icon: doc.icon,
    tags: doc.tags,
    createdAt: doc.createdAt,
    // Add missing fields with defaults based on document type and category
    type: doc.id === 1 || doc.id === "fruitful-holdings-nda" ? "PDF" : "HTML",
    status: "active",
    size: doc.id === 1 ? "1.7 MB" : 
          doc.category === "technical" ? "67 KB" :
          doc.category === "minutes" ? "33 KB" : "50 KB",
    priority: (doc.category === "contracts" || doc.category === "technical") ? "high" :
              doc.category === "minutes" ? "medium" : "low",
    author: doc.category === "contracts" ? "Legal Team" :
            doc.category === "technical" ? "Development Team" :
            doc.category === "minutes" ? "Project Management" : "VaultMesh™ Team",
    lastUpdated: "July 19, 2025"
  })

  // Use enhanced real-time data if available, fallback to static data
  const staticDocuments: LegalDocument[] = [
    {
      id: "fruitful-holdings-nda",
      title: "Fruitful Holdings NDA",
      type: "PDF",
      category: "contracts",
      description: "Non-disclosure agreement for Fruitful Holdings operations and partnerships",
      lastUpdated: "July 19, 2025",
      author: "Legal Team",
      status: "active",
      size: "1.7 MB",
      priority: "high"
    },
    {
      id: "securesign-portal",
      title: "SecureSign™ Portal Documentation",
      type: "HTML",
      category: "technical",
      description: "Complete SecureSign™ NDA portal setup and integration guide",
      lastUpdated: "July 19, 2025",
      author: "Development Team", 
      status: "active",
      size: "101 KB",
      priority: "high"
    },
    {
      id: "seedwave-deployment",
      title: "Seedwave™ Deployment Manual",
      type: "HTML",
      category: "technical",
      description: "Comprehensive deployment manual for Seedwave™ portal infrastructure",
      lastUpdated: "July 19, 2025",
      author: "Operations Team",
      status: "active", 
      size: "67 KB",
      priority: "high"
    }
  ]

  // Merge API data with static documents
  const displayDocuments = legalDocs.length > 0 
    ? legalDocs.map(enhanceDocumentWithDefaults)
    : staticDocuments

  // Filter documents
  const filteredDocuments = displayDocuments.filter(doc => {
    const matchesSearch = searchQuery === "" || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Get unique categories
  const categories = Array.from(new Set(displayDocuments.map(doc => doc.category)))

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "contracts": return <FileText className="h-4 w-4" />
      case "technical": return <BookOpen className="h-4 w-4" />
      case "compliance": return <Shield className="h-4 w-4" />
      case "legal": return <Gavel className="h-4 w-4" />
      case "minutes": return <Clock className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high": return "text-red-600 dark:text-red-400"
      case "medium": return "text-yellow-600 dark:text-yellow-400"
      case "low": return "text-green-600 dark:text-green-400"
      default: return "text-gray-600 dark:text-gray-400"
    }
  }

  if (viewingDocument) {
    return <DocumentViewer document={viewingDocument} onClose={() => setViewingDocument(null)} />
  }

  return (
    <div className="space-y-6" data-testid="legal-documentation-container">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="h-6 w-6 text-cyan-500" />
                Legal Documentation Hub
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Centralized legal document repository with real-time VaultMesh™ sync
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700" data-testid="badge-document-count">
              {filteredDocuments.length} Documents
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search legal documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                data-testid="input-search-documents"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-gray-400" />
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white"
                  data-testid="button-filter-all"
                >
                  All
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-cyan-500 hover:bg-cyan-600 text-white" : ""}
                    data-testid={`button-filter-${category}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" data-testid="icon-loading" />
            </div>
          )}

          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <Card 
                key={doc.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                onClick={() => setViewingDocument(doc)}
                data-testid={`card-document-${doc.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400">
                        {getCategoryIcon(doc.category)}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                          {doc.title}
                        </CardTitle>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {doc.type || "HTML"} • {doc.size || "N/A"}
                        </p>
                      </div>
                    </div>
                    {doc.priority && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPriorityColor(doc.priority)}`}
                        data-testid={`badge-priority-${doc.id}`}
                      >
                        {doc.priority}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {doc.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {doc.author || "VaultMesh™ Team"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {doc.lastUpdated || doc.createdAt}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1" data-testid={`button-view-${doc.id}`}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" data-testid={`button-download-${doc.id}`}>
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredDocuments.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" data-testid="icon-empty-state" />
              <p className="text-gray-500 dark:text-gray-400">No documents found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
