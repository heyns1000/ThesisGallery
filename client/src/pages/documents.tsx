import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SamFoxUploadButton } from "@/components/samfox-gallery";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Document } from "@shared/schema";

// SamFox Studio color constants for Project Scrolls
const SCROLL_COLORS = {
  primary: "from-amber-400 to-orange-500",
  secondary: "from-yellow-400 to-amber-500",
  accent: "from-orange-400 to-yellow-400",
  cardHover: "hover:shadow-xl hover:shadow-amber-500/20",
  border: "border-amber-400/20 hover:border-amber-400/40",
  background: "bg-gradient-to-br from-amber-400/5 to-orange-500/5",
};

// Document type styling
const getDocumentTypeInfo = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return {
        color: 'bg-red-500/10 text-red-400 border-red-500/20',
        icon: 'fas fa-file-pdf',
        label: 'PDF Document'
      };
    case 'docx':
      return {
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        icon: 'fas fa-file-word',
        label: 'Word Document'
      };
    case 'article':
      return {
        color: 'bg-green-500/10 text-green-400 border-green-500/20',
        icon: 'fas fa-newspaper',
        label: 'Article'
      };
    default:
      return {
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        icon: 'fas fa-scroll',
        label: 'Project Scroll'
      };
  }
};

// SamFox Project Scroll Card Component
interface ProjectScrollCardProps {
  document: Document;
  onClick: () => void;
}

function ProjectScrollCard({ document, onClick }: ProjectScrollCardProps) {
  const typeInfo = getDocumentTypeInfo(document.type);
  
  return (
    <Card 
      className={`group cursor-pointer ${SCROLL_COLORS.cardHover} ${SCROLL_COLORS.border} ${SCROLL_COLORS.background} 
                 hover:scale-105 transition-all duration-300 overflow-hidden`}
      onClick={onClick}
      data-testid={`project-scroll-${document.id}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${SCROLL_COLORS.primary} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <i className={`${typeInfo.icon} text-white text-xl`}></i>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate group-hover:text-amber-400 transition-colors mb-1">
              {document.title}
            </h4>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {document.content.substring(0, 120)}...
            </p>
            <div className="flex items-center justify-between">
              <Badge className={`text-xs ${typeInfo.color}`}>
                <i className={`${typeInfo.icon} mr-1`}></i>
                {typeInfo.label}
              </Badge>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-muted-foreground">
                  {new Date(document.uploadedAt).toLocaleDateString()}
                </span>
                <Badge className="text-xs bg-amber-100 text-amber-800 border-amber-400/30">
                  {document.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-1">
            <Button size="sm" variant="outline" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-amber-400/30">
              <i className="fas fa-eye text-xs"></i>
            </Button>
            <Button size="sm" variant="outline" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-amber-400/30">
              <i className="fas fa-download text-xs"></i>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await apiRequest("POST", "/api/documents", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({ description: "Project scroll uploaded successfully! ✨" });
    },
    onError: (error: Error) => {
      toast({ 
        variant: "destructive",
        description: `Upload failed: ${error.message}` 
      });
    },
  });

  const handleFileUpload = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    uploadMutation.mutate(formData);
  };

  const handleView = (document: Document) => {
    setPreviewDocument(document);
  };

  const handleDownload = (document: Document) => {
    toast({ description: `Downloading ${document.title}...` });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  // Calculate filter counts
  const filterCounts = documents.reduce((acc, doc) => {
    acc.all = documents.length;
    acc[doc.type.toLowerCase()] = (acc[doc.type.toLowerCase()] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground flex items-center">
              <div className={`w-8 h-8 bg-gradient-to-r ${SCROLL_COLORS.primary} rounded-lg flex items-center justify-center mr-3`}>
                <i className="fas fa-scroll text-white text-sm"></i>
              </div>
              📜 SamFox Project Scrolls Library
            </h3>
            <p className="text-muted-foreground">Sacred archives of FAA™ documents, treatises, and knowledge scrolls</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search scrolls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${SCROLL_COLORS.border} focus:border-amber-400`}
                data-testid="input-document-search"
              />
              <i className="fas fa-search absolute left-3 top-3 text-muted-foreground"></i>
            </div>
            
            {/* Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger 
                className={`w-48 ${SCROLL_COLORS.border} focus:border-amber-400`}
                data-testid="select-document-type"
              >
                <SelectValue placeholder="Filter scrolls" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center justify-between w-full">
                    <span>All Scrolls</span>
                    {filterCounts.all > 0 && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {filterCounts.all}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
                <SelectItem value="pdf">PDF Documents</SelectItem>
                <SelectItem value="docx">Word Documents</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Upload Button */}
            <SamFoxUploadButton
              onFileSelect={handleFileUpload}
              isUploading={uploadMutation.isPending}
              accept=".pdf,.doc,.docx,.txt"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className={`${SCROLL_COLORS.background} ${SCROLL_COLORS.border}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{filterCounts.all || 0}</div>
            <div className="text-sm text-muted-foreground">Total Scrolls</div>
          </CardContent>
        </Card>
        <Card className={`${SCROLL_COLORS.background} ${SCROLL_COLORS.border}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{filterCounts.pdf || 0}</div>
            <div className="text-sm text-muted-foreground">PDF Scrolls</div>
          </CardContent>
        </Card>
        <Card className={`${SCROLL_COLORS.background} ${SCROLL_COLORS.border}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{filterCounts.docx || 0}</div>
            <div className="text-sm text-muted-foreground">Word Scrolls</div>
          </CardContent>
        </Card>
        <Card className={`${SCROLL_COLORS.background} ${SCROLL_COLORS.border}`}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{filterCounts.article || 0}</div>
            <div className="text-sm text-muted-foreground">Articles</div>
          </CardContent>
        </Card>
      </div>

      {/* Project Scrolls Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`bg-card rounded-lg p-6 border ${SCROLL_COLORS.border} animate-pulse`}>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-3 w-3/4"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-3 bg-muted rounded w-20"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <div className={`w-16 h-16 bg-gradient-to-r ${SCROLL_COLORS.primary} rounded-lg flex items-center justify-center mx-auto mb-4`}>
            <i className="fas fa-scroll text-white text-2xl"></i>
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-2">
            {searchTerm || filterType !== "all" ? "No project scrolls found" : "No scrolls in the archive yet"}
          </h4>
          <p className="text-muted-foreground mb-6">
            {searchTerm || filterType !== "all" 
              ? "Try adjusting your search or filter to find the scroll you're looking for"
              : "Upload your first project scroll to begin building the sacred archive"
            }
          </p>
          {!searchTerm && filterType === "all" && (
            <Button 
              className={`bg-gradient-to-r ${SCROLL_COLORS.primary} text-white hover:opacity-90`}
              onClick={() => toast({ description: "Use the upload button above to add your first scroll!" })}
            >
              <i className="fas fa-scroll mr-2"></i>
              Upload First Scroll
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDocuments.map((document) => (
              <ProjectScrollCard
                key={document.id}
                document={document}
                onClick={() => handleView(document)}
              />
            ))}
          </div>
          
          {filteredDocuments.length > 0 && (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                className={`${SCROLL_COLORS.border} hover:bg-amber-50 dark:hover:bg-amber-950/10`}
                data-testid="button-load-more-documents"
              >
                Load More Scrolls <i className="fas fa-scroll ml-2"></i>
              </Button>
            </div>
          )}
        </>
      )}

      {/* Document Preview Modal */}
      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className={`max-w-4xl max-h-[90vh] ${SCROLL_COLORS.background} border-amber-400/20`}>
          {previewDocument && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center text-amber-400">
                  <i className={`${getDocumentTypeInfo(previewDocument.type).icon} mr-2`}></i>
                  {previewDocument.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge className={getDocumentTypeInfo(previewDocument.type).color}>
                      <i className={`${getDocumentTypeInfo(previewDocument.type).icon} mr-1`}></i>
                      {getDocumentTypeInfo(previewDocument.type).label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Created on {new Date(previewDocument.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(previewDocument)}
                    >
                      <i className="fas fa-download mr-2"></i>Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <i className="fas fa-share mr-2"></i>Share
                    </Button>
                  </div>
                </div>
                
                <div className={`p-6 rounded-lg bg-gradient-to-br ${SCROLL_COLORS.background} border ${SCROLL_COLORS.border}`}>
                  <h4 className="font-medium text-foreground mb-3">Content Preview</h4>
                  <div className="text-muted-foreground text-sm leading-relaxed max-h-64 overflow-y-auto">
                    {previewDocument.content}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="text-muted-foreground">
                    Status: <Badge className="ml-1 text-xs bg-green-100 text-green-800">{previewDocument.status}</Badge>
                  </div>
                  <div className="text-muted-foreground">
                    FAA™ Sacred Archive • VaultMesh™ Protected
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
