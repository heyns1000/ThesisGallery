import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  const queryClient = useQueryClient();

  // Fetch legal documents
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ['/api/legal-documents'],
    queryFn: async () => {
      const response = await fetch('/api/legal-documents');
      if (!response.ok) throw new Error('Failed to fetch documents');
      return response.json() as LegalDocument[];
    }
  });

  // Fetch repositories
  const { data: repositories = [], isLoading: repositoriesLoading } = useQuery({
    queryKey: ['/api/repositories'],
    queryFn: async () => {
      const response = await fetch('/api/repositories');
      if (!response.ok) throw new Error('Failed to fetch repositories');
      return response.json() as Repository[];
    }
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
      title: 'FAA.ZONE™ Compliance Policy',
      category: 'compliance',
      status: 'approved',
      priority: 'critical',
      content: 'Comprehensive compliance guidelines for FAA.ZONE™ operations.',
      createdAt: new Date().toISOString()
    }
  ];

  const sampleRepositories: Repository[] = [
    {
      id: '1',
      name: 'Fruitful Holdings Legal Repository',
      type: 'legal',
      description: 'Central repository for all Fruitful Holdings legal documents and agreements',
      access: 'restricted',
      documentCount: 1247,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'VaultMesh™ IP Portfolio',
      type: 'ip',
      description: 'Intellectual property documents and patents for VaultMesh™ technology',
      access: 'confidential',
      documentCount: 89,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Compliance & Regulatory Hub',
      type: 'compliance',
      description: 'Regulatory compliance documents and audit trails',
      access: 'restricted',
      documentCount: 334,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
  ];

  const displayDocuments = documents.length > 0 ? documents : sampleDocuments;
  const displayRepositories = repositories.length > 0 ? repositories : sampleRepositories;

  const filteredDocuments = displayDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contract': return 'bg-blue-500';
      case 'license': return 'bg-green-500';
      case 'policy': return 'bg-yellow-500';
      case 'compliance': return 'bg-red-500';
      case 'ip': return 'bg-purple-500';
      case 'nda': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'review': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getAccessColor = (access: string) => {
    switch (access) {
      case 'public': return 'bg-green-500';
      case 'restricted': return 'bg-yellow-500';
      case 'confidential': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Check className="w-4 h-4" />;
      case 'review': return <Clock className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-green-500/20 bg-gradient-to-r from-green-500/5 to-blue-500/5">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Fruitful Holdings Repository & Legal Hub
          </CardTitle>
          <CardDescription className="text-lg">
            Comprehensive legal document management and intellectual property repository
          </CardDescription>
          <div className="flex justify-center space-x-2 mt-4">
            <Badge variant="outline" className="border-green-500 text-green-400">Legal Repository</Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">IP Management</Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400">Compliance Ready</Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents" className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Legal Documents
          </TabsTrigger>
          <TabsTrigger value="repositories" className="flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Repositories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Document Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="contract">Contracts</SelectItem>
                    <SelectItem value="license">Licenses</SelectItem>
                    <SelectItem value="policy">Policies</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="ip">Intellectual Property</SelectItem>
                    <SelectItem value="nda">NDAs</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentsLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No documents found matching your criteria.
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          getStatusColor(doc.status)
                        )} />
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                      </div>
                      <Badge 
                        className={cn("text-xs text-white", getPriorityColor(doc.priority))}
                      >
                        {doc.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                      <Badge 
                        variant="outline" 
                        className={cn("border-0 text-white", getCategoryColor(doc.category))}
                      >
                        {doc.category}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={cn("border-0 text-white", getStatusColor(doc.status))}
                      >
                        <span className="mr-1">{getStatusIcon(doc.status)}</span>
                        {doc.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {doc.content}
                    </p>
                    
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(doc.createdAt).toLocaleDateString()}
                      {doc.expiresAt && (
                        <>
                          <br />
                          Expires: {new Date(doc.expiresAt).toLocaleDateString()}
                        </>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedDocument(doc)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>{doc.title}</DialogTitle>
                            <DialogDescription>
                              {doc.category} • {doc.status} • {doc.priority} priority
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4">
                            <div className="max-h-96 overflow-y-auto p-4 bg-muted rounded-lg">
                              <p className="whitespace-pre-wrap">{doc.content}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="repositories" className="space-y-6">
          {/* Repository Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositoriesLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              displayRepositories.map((repo) => (
                <Card key={repo.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{repo.name}</CardTitle>
                      <Badge 
                        className={cn("text-xs text-white", getAccessColor(repo.access))}
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {repo.access}
                      </Badge>
                    </div>
                    <CardDescription>{repo.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="outline">{repo.type}</Badge>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Documents:</span>
                      <span className="font-semibold">{repo.documentCount.toLocaleString()}</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Last Updated: {new Date(repo.lastUpdated).toLocaleDateString()}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Browse
                      </Button>
                      <Button size="sm" variant="outline">
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Hub Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'VaultMesh™ Legal', status: 'active', integration: 'License Management' },
              { name: 'HotStack Contracts', status: 'active', integration: 'Development Agreements' },
              { name: 'FAA.ZONE™ Compliance', status: 'active', integration: 'Regulatory Docs' },
              { name: 'Fruitful Holdings IP', status: 'active', integration: 'Patent Portfolio' }
            ].map((service) => (
              <div key={service.name} className="text-center p-4 border rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                <div className="font-semibold text-sm">{service.name}</div>
                <div className="text-xs text-muted-foreground">{service.integration}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}