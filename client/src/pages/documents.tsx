import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentCard } from "@/components/ui/document-card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Document } from "@shared/schema";

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
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
      toast({ description: "Document uploaded successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        variant: "destructive",
        description: `Upload failed: ${error.message}` 
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    
    uploadMutation.mutate(formData);
  };

  const handleView = (document: Document) => {
    // TODO: Implement document viewer modal
    toast({ description: `Viewing ${document.title}` });
  };

  const handleDownload = (document: Document) => {
    // TODO: Implement download functionality
    toast({ description: `Downloading ${document.title}` });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">Document Library</h3>
            <p className="text-muted-foreground">Browse and manage all FAA documents and articles</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-document-search"
              />
              <i className="fas fa-search absolute left-3 top-3 text-muted-foreground"></i>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger data-testid="select-document-type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">Word</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                data-testid="input-file-upload"
              />
              <Button 
                className="bg-primary text-primary-foreground hover:opacity-90"
                disabled={uploadMutation.isPending}
              >
                <i className="fas fa-upload mr-2"></i>
                {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg p-6 border border-border animate-pulse">
              <div className="h-20 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <i className="fas fa-file-alt text-muted-foreground text-6xl mb-4"></i>
          <h4 className="text-lg font-semibold text-foreground mb-2">
            {searchTerm || filterType !== "all" ? "No documents found" : "No documents uploaded yet"}
          </h4>
          <p className="text-muted-foreground mb-6">
            {searchTerm || filterType !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Upload your first document to get started"
            }
          </p>
          {!searchTerm && filterType === "all" && (
            <Button onClick={() => document.getElementById('file-upload')?.click()}>
              <i className="fas fa-upload mr-2"></i>
              Upload Document
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onView={handleView}
                onDownload={handleDownload}
              />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Button variant="secondary" data-testid="button-load-more-documents">
              Load More Documents
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
