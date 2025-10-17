import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, GitBranch, Download, ExternalLink, FileText, Code, Database, Settings, Eye, Plus, Filter } from "lucide-react"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"

interface Repository {
  id: string
  name: string
  description: string
  category: string
  language: string
  stars: number
  forks: number
  lastUpdate: string
  status: 'active' | 'archived' | 'development'
  size: string
  owner: string
  isPrivate: boolean
  branches: number
  commits: number
  tags: string[]
}

export function RepositoryHub() {
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")

  // Fetch real repositories from database
  const { data: repositories = [], isLoading } = useQuery({
    queryKey: ["/api/repositories", searchTerm, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      
      const response = await fetch(`/api/repositories?${params}`)
      if (!response.ok) throw new Error('Failed to fetch repositories')
      return response.json()
    }
  })

  // Transform database repositories to component format
  const transformedRepositories: Repository[] = repositories.map((repo: any) => ({
    id: repo.id?.toString() || "0",
    name: repo.name || "",
    description: repo.description || "",
    category: repo.category || "general",
    language: "HTML",
    stars: 0,
    forks: 0,
    lastUpdate: "2 days ago",
    status: (repo.status as 'active' | 'archived' | 'development') || "active",
    size: "2.1 MB",
    owner: "heyns1000",
    isPrivate: false,
    branches: 1,
    commits: 45,
    tags: [repo.category || "general"]
  }))

  // Filter and search logic
  useEffect(() => {
    let filtered = transformedRepositories

    if (searchTerm) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(repo => repo.category === selectedCategory)
    }

    if (selectedLanguage !== "all") {
      filtered = filtered.filter(repo => repo.language === selectedLanguage)
    }

    setFilteredRepos(filtered)
  }, [transformedRepositories, searchTerm, selectedCategory, selectedLanguage])

  const categories = Array.from(new Set(transformedRepositories.map(repo => repo.category)))
  const languages = Array.from(new Set(transformedRepositories.map(repo => repo.language)))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'development': return 'bg-yellow-500'
      case 'archived': return 'bg-gray-500'
      default: return 'bg-blue-500'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'infrastructure': return <Database className="h-4 w-4" />
      case 'ai': return <Settings className="h-4 w-4" />
      case 'legal': return <FileText className="h-4 w-4" />
      case 'finance': return <Settings className="h-4 w-4" />
      case 'core': return <Code className="h-4 w-4" />
      default: return <GitBranch className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <GitBranch className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Repository & Legal Hub</h1>
        </div>
        <p className="text-green-100">
          Comprehensive repository management with integrated legal documentation and SecureSign™ VIP access
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Search className="h-5 w-5" />
            Repository Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Repositories</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">all</SelectItem>
                  {languages.map(language => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repository Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-600 rounded mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-16 bg-gray-600 rounded"></div>
                  <div className="h-6 w-16 bg-gray-600 rounded"></div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="text-center">
                      <div className="h-6 w-8 bg-gray-600 rounded mx-auto mb-1"></div>
                      <div className="h-3 w-12 bg-gray-600 rounded mx-auto"></div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-20 bg-gray-600 rounded"></div>
                  <div className="h-8 w-20 bg-gray-600 rounded"></div>
                  <div className="h-8 w-20 bg-gray-600 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRepos.map((repo) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gray-800 border-gray-700 hover:border-green-500 transition-colors duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(repo.category)}
                      <CardTitle className="text-white">{repo.name}</CardTitle>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(repo.status)}`}></div>
                  </div>
                  <p className="text-gray-300 text-sm">{repo.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {repo.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-orange-500 text-white">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-white">{repo.stars}</div>
                        <div className="text-xs text-gray-400">Stars</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{repo.forks}</div>
                        <div className="text-xs text-gray-400">Forks</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{repo.branches}</div>
                        <div className="text-xs text-gray-400">Branches</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{repo.commits}</div>
                        <div className="text-xs text-gray-400">Commits</div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>Size: {repo.size}</div>
                      <div>Owner: {repo.owner}</div>
                      <div>Last Update: {repo.lastUpdate}</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
                        <Download className="h-4 w-4 mr-1" />
                        Clone
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-600">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        GitHub
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredRepos.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-12">
            <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No repositories found</h3>
            <p className="text-gray-400">Try adjusting your search criteria or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}