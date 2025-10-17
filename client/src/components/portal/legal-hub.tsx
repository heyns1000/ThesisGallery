import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, 
  Download, 
  Upload, 
  Shield, 
  Scale, 
  Eye,
  BookOpen,
  AlertTriangle,
  Check,
  Clock,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LegalDocument {
  id: string;
  title: string;
  category: 'contract' | 'license' | 'policy' | 'compliance' | 'ip' | 'nda';
  status: 'draft' | 'review' | 'approved' | 'expired';
  priority: 'low' | 'medium' | 'high' | 'critical';
  brandId?: number;
  content: string;
  fileUrl?: string;
  createdAt: string;
  expiresAt?: string;
}

interface Repository {
  id: string;
  name: string;
  type: 'legal' | 'ip' | 'compliance' | 'contracts';
  description: string;
  access: 'public' | 'restricted' | 'confidential';
  documentCount: number;
  lastUpdated: string;
  createdAt: string;
}

// Legal Hub Component - Fruitful Holdings Repository & Legal Hub
export function LegalHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);

  const { toast } = useToast();

  // Fetch legal documents
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ['/api/legal-documents'],
  });

  // Fetch repositories
  const { data: repositories = [], isLoading: repositoriesLoading } = useQuery({
    queryKey: ['/api/repositories'],
  });

  // Sample data for demonstration (will be replaced by real API data)
  const sampleDocuments: LegalDocument[] = [
    {
      id: '1',
      title: 'VaultMesh™ Master License Agreement',
      category: 'license',
      status: 'approved',
      priority: 'high',
      content: 'Master licensing agreement for VaultMesh™ platform usage and integration.',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      title: 'HotStack Development Agreement',
      category: 'contract',
      status: 'review',
      priority: 'medium',
      content: 'Development and integration agreement for HotStack services.',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Fruitful Holdings NDA',
      category: 'nda',
      status: 'approved',
      priority: 'critical',
      content: 'Non-disclosure agreement for Fruitful Holdings operations.',
      createdAt: new Date().toISOString()
    }
  ];

  const displayDocuments = documents.length > 0 ? documents : sampleDocuments;

  const filteredDocuments = displayDocuments.filter((doc: any) => {
    const matchesSearch = searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contract': return 'bg-blue-500';
      case 'license': return 'bg-purple-500';
      case 'policy': return 'bg-green-500';
      case 'compliance': return 'bg-orange-500';
      case 'ip': return 'bg-pink-500';
      case 'nda': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Check className="h-4 w-4 text-green-500" />;
      case 'review': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'draft': return <FileText className="h-4 w-4 text-gray-500" />;
      case 'expired': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900" data-testid="legal-hub-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="h-8 w-8 text-cyan-500" />
            Legal Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Centralized legal document management and compliance tracking
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" data-testid="button-upload-document">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger value="documents" data-testid="tab-documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="repositories" data-testid="tab-repositories">
            <BookOpen className="h-4 w-4 mr-2" />
            Repositories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          {/* Filters */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-documents"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48" data-testid="select-category-filter">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="contract">Contracts</SelectItem>
                    <SelectItem value="license">Licenses</SelectItem>
                    <SelectItem value="policy">Policies</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="ip">IP</SelectItem>
                    <SelectItem value="nda">NDAs</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48" data-testid="select-status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documents Grid */}
          {documentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" data-testid="icon-loading" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc: any) => (
                <Card 
                  key={doc.id}
                  className="hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  onClick={() => setSelectedDocument(doc)}
                  data-testid={`card-document-${doc.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={cn(getCategoryColor(doc.category), "text-white")}>
                        {doc.category}
                      </Badge>
                      {getStatusIcon(doc.status)}
                    </div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">{doc.title}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {doc.content.substring(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>Created: {new Date(doc.createdAt).toLocaleDateString()}</span>
                      <Badge variant="outline" className={cn(
                        doc.priority === 'critical' && 'text-red-600 border-red-600',
                        doc.priority === 'high' && 'text-orange-600 border-orange-600',
                        doc.priority === 'medium' && 'text-yellow-600 border-yellow-600',
                        doc.priority === 'low' && 'text-green-600 border-green-600'
                      )}>
                        {doc.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="repositories" className="space-y-4">
          {repositoriesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" data-testid="icon-loading-repositories" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repositories.map((repo: any) => (
                <Card 
                  key={repo.id}
                  className="hover:shadow-lg transition-all bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  data-testid={`card-repository-${repo.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-gray-900 dark:text-white">{repo.name}</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          {repo.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{repo.access}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {repo.documentCount || 0} documents
                      </span>
                      <Button variant="ghost" size="sm" data-testid={`button-view-repo-${repo.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
