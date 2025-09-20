import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SamFoxStudio {
  id: string;
  brandName: string;
  treatyClass: string;
  licenseType: string;
  vaultLink: boolean;
  storagePath: string;
  syncRate: number;
  globalStatus: string;
  claimStatement: string;
  copyrightActive: boolean;
  treatyReady: boolean;
  signatory: string;
  createdAt: string;
  metadata?: any;
}

interface CollaborationWorkspace {
  id: string;
  workspaceName: string;
  workspaceType: string;
  accessLevel: string;
  members: string[];
  realTimeEnabled: boolean;
  treatyProtected: boolean;
  vaultMeshLinked: boolean;
  status: string;
  createdAt: string;
}

interface GlobalMasterLicense {
  id: string;
  licenseKey: string;
  licenseType: string;
  licenseMatrix: any;
  copyrightAssertion: boolean;
  ipRegistryVerified: boolean;
  faaVerified: boolean;
  treatyClass: string;
  globalScope: boolean;
  status: string;
  issuedAt: string;
}

interface TreatyCollaboration {
  id: string;
  treatyId: string;
  brandCoSigners: string[];
  collaboratorIds: string[];
  treatyType: string;
  sealedTreatyLaw: boolean;
  treatyMessage: string;
  faaClassTag: string;
  status: string;
  createdAt: string;
}

// Enhanced Fileroom Gallery Component
function FileroomGallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<any | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch SamFox Studio fileroom data
  const { data: galleryItems = [], isLoading: galleryLoading } = useQuery({
    queryKey: ["/api/samfox-studio/fileroom"],
  });

  // Fetch SamFox Studio workspaces as documents/scrolls
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/samfox-studio/workspaces"],
  });

  // Mock data for license keys and vault trails (would be real API calls)
  const licenseKeys = [
    { id: "1", key: "SFS-MSTR-2024-001", type: "Global Master", status: "active", issuedDate: "2024-01-15", expiryDate: "2025-01-15" },
    { id: "2", key: "SFS-TRTY-2024-002", type: "Treaty Bound", status: "active", issuedDate: "2024-03-20", expiryDate: "2025-03-20" },
    { id: "3", key: "SFS-CRTV-2024-003", type: "Creative Asset", status: "pending", issuedDate: "2024-09-01", expiryDate: "2025-09-01" }
  ];

  const vaultTrails = [
    { id: "1", action: "Asset Synchronized", timestamp: "2024-09-20 14:30", type: "sync", details: "Digital prints updated via FAA OmniDrop" },
    { id: "2", action: "Treaty Sealed", timestamp: "2024-09-20 12:15", type: "treaty", details: "Brand collaboration treaty activated" },
    { id: "3", action: "License Generated", timestamp: "2024-09-20 10:45", type: "license", details: "New creative asset license issued" },
    { id: "4", action: "Vault Backup", timestamp: "2024-09-20 08:00", type: "backup", details: "Automated vault backup completed" }
  ];

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ formData, endpoint }: { formData: FormData; endpoint: string }) => {
      return await apiRequest("POST", endpoint, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/samfox-studio/fileroom"] });
      queryClient.invalidateQueries({ queryKey: ["/api/samfox-studio/workspaces"] });
      toast({ description: "Asset uploaded to SamFox Studio! ✨" });
      setUploadingType(null);
    },
    onError: (error: Error) => {
      toast({ 
        variant: "destructive",
        description: `Upload failed: ${error.message}` 
      });
      setUploadingType(null);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingType(type);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('type', type);
    
    const endpoint = '/api/samfox-studio/fileroom';
    uploadMutation.mutate({ formData, endpoint });
  };

  // Filter assets by category
  const digitalPrints = galleryItems.filter(item => 
    item.type === 'ai-generated' || item.type === 'brand-asset'
  );
  const creativeAssets = galleryItems.filter(item => 
    item.type === 'screenshot' || item.type === 'concept' || item.type === 'uploaded'
  );
  const projectScrolls = documents.slice(0, 6); // Show recent documents as scrolls

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'bg-green-500/10 text-green-400 border-green-500/20',
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      expired: 'bg-red-500/10 text-red-400 border-red-500/20',
      sync: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      treaty: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      license: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      backup: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    };
    return statusClasses[status as keyof typeof statusClasses] || statusClasses.active;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-archive text-white text-sm"></i>
            </div>
            SamFox Master Fileroom
          </h3>
          <p className="text-muted-foreground mt-1">
            Archive Sync: FAA OmniDrop Memory Feed | Auto-filed since Genesis Treaty
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48" data-testid="select-fileroom-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="prints">Digital Prints</SelectItem>
              <SelectItem value="scrolls">Project Scrolls</SelectItem>
              <SelectItem value="assets">Creative Assets</SelectItem>
              <SelectItem value="licenses">License Keys</SelectItem>
              <SelectItem value="trails">Vault Trails</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-400/10 to-orange-500/10 border-yellow-400/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{projectScrolls.length}</div>
            <div className="text-sm text-muted-foreground">Project Scrolls</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-400/10 to-green-500/10 border-emerald-400/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{licenseKeys.length}</div>
            <div className="text-sm text-muted-foreground">License Keys</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-400/10 to-cyan-500/10 border-blue-400/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{vaultTrails.length}</div>
            <div className="text-sm text-muted-foreground">Vault Trails</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-400/10 to-pink-500/10 border-purple-400/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{creativeAssets.length + digitalPrints.length}</div>
            <div className="text-sm text-muted-foreground">Creative Assets</div>
          </CardContent>
        </Card>
      </div>

      {/* Digital Print Gallery */}
      {(selectedCategory === "all" || selectedCategory === "prints") && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-b border-yellow-400/20">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="fas fa-image text-yellow-400 mr-2"></i>
                Digital Print Gallery
                <Badge className="ml-2 bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                  {digitalPrints.length} prints
                </Badge>
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="upload-digital-print"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'brand-asset')}
                  data-testid="input-upload-digital-print"
                />
                <Button size="sm" disabled={uploadingType === 'brand-asset'}>
                  {uploadingType === 'brand-asset' ? (
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-plus mr-2"></i>
                  )}
                  Add Print
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {galleryLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : digitalPrints.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-image text-muted-foreground text-4xl mb-3"></i>
                <p className="text-muted-foreground">No digital prints available</p>
                <Button 
                  className="mt-4"
                  onClick={() => document.getElementById('upload-digital-print')?.click()}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Upload First Print
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {digitalPrints.map((item) => (
                  <div 
                    key={item.id}
                    className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer 
                              hover:scale-105 transition-all duration-300 hover:shadow-lg
                              border-2 border-transparent hover:border-yellow-400/30"
                    onClick={() => setPreviewAsset(item)}
                    data-testid={`digital-print-${item.id}`}
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-xs font-medium truncate">{item.title}</p>
                        <Badge className="text-xs bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                        <i className="fas fa-eye"></i>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Project Scrolls */}
      {(selectedCategory === "all" || selectedCategory === "scrolls") && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-400/20 to-indigo-500/20 border-b border-blue-400/20">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="fas fa-scroll text-blue-400 mr-2"></i>
                Project Scrolls
                <Badge className="ml-2 bg-blue-400/20 text-blue-400 border-blue-400/30">
                  {projectScrolls.length} scrolls
                </Badge>
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="upload-project-scroll"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => handleFileUpload(e, 'document')}
                  data-testid="input-upload-project-scroll"
                />
                <Button size="sm" disabled={uploadingType === 'document'}>
                  {uploadingType === 'document' ? (
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-plus mr-2"></i>
                  )}
                  Add Scroll
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {documentsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : projectScrolls.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-scroll text-muted-foreground text-4xl mb-3"></i>
                <p className="text-muted-foreground">No project scrolls available</p>
                <Button 
                  className="mt-4"
                  onClick={() => document.getElementById('upload-project-scroll')?.click()}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Upload First Scroll
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectScrolls.map((doc) => (
                  <Card 
                    key={doc.id}
                    className="group cursor-pointer hover:scale-105 transition-all duration-300 
                              hover:shadow-lg border-2 border-transparent hover:border-blue-400/30
                              bg-gradient-to-br from-blue-400/5 to-indigo-500/5"
                    data-testid={`project-scroll-${doc.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-file-alt text-blue-400"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate group-hover:text-blue-400 transition-colors">
                            {doc.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                          <Badge className="text-xs bg-blue-400/20 text-blue-400 border-blue-400/30">
                            {doc.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Creative Assets Grid */}
      {(selectedCategory === "all" || selectedCategory === "assets") && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-400/20 to-pink-500/20 border-b border-purple-400/20">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="fas fa-palette text-purple-400 mr-2"></i>
                Creative Assets
                <Badge className="ml-2 bg-purple-400/20 text-purple-400 border-purple-400/30">
                  {creativeAssets.length} assets
                </Badge>
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="upload-creative-asset"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*,video/*,.psd,.ai,.sketch"
                  onChange={(e) => handleFileUpload(e, 'uploaded')}
                  data-testid="input-upload-creative-asset"
                />
                <Button size="sm" disabled={uploadingType === 'uploaded'}>
                  {uploadingType === 'uploaded' ? (
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-plus mr-2"></i>
                  )}
                  Add Asset
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {galleryLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-video bg-muted rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : creativeAssets.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-palette text-muted-foreground text-4xl mb-3"></i>
                <p className="text-muted-foreground">No creative assets available</p>
                <Button 
                  className="mt-4"
                  onClick={() => document.getElementById('upload-creative-asset')?.click()}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Upload First Asset
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {creativeAssets.map((item) => (
                  <Card 
                    key={item.id}
                    className="group cursor-pointer hover:scale-105 transition-all duration-300 
                              hover:shadow-lg border-2 border-transparent hover:border-purple-400/30 overflow-hidden"
                    onClick={() => setPreviewAsset(item)}
                    data-testid={`creative-asset-${item.id}`}
                  >
                    <div className="aspect-video relative">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute top-2 right-2">
                          <Button size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                            <i className="fas fa-expand-alt"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-medium text-foreground truncate text-sm group-hover:text-purple-400 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between mt-2">
                        <Badge className="text-xs bg-purple-400/20 text-purple-400 border-purple-400/30">
                          {item.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* License Keys Management */}
      {(selectedCategory === "all" || selectedCategory === "licenses") && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-400/20 to-green-500/20 border-b border-emerald-400/20">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="fas fa-key text-emerald-400 mr-2"></i>
                License Keys
                <Badge className="ml-2 bg-emerald-400/20 text-emerald-400 border-emerald-400/30">
                  {licenseKeys.length} keys
                </Badge>
              </div>
              <Button size="sm" data-testid="button-generate-license">
                <i className="fas fa-plus mr-2"></i>
                Generate Key
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {licenseKeys.map((license) => (
                <Card 
                  key={license.id}
                  className={`group cursor-pointer hover:scale-105 transition-all duration-300 
                            hover:shadow-lg border-2 ${getStatusBadge(license.status)}`}
                  data-testid={`license-key-${license.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-certificate text-emerald-400"></i>
                        <Badge className={`text-xs ${getStatusBadge(license.status)}`}>
                          {license.status}
                        </Badge>
                      </div>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <i className="fas fa-copy"></i>
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">{license.type}</h4>
                      <p className="font-mono text-xs text-muted-foreground bg-muted p-2 rounded">
                        {license.key}
                      </p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Issued: {new Date(license.issuedDate).toLocaleDateString()}</div>
                        <div>Expires: {new Date(license.expiryDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vault Trails Timeline */}
      {(selectedCategory === "all" || selectedCategory === "trails") && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-cyan-400/20 to-blue-500/20 border-b border-cyan-400/20">
            <CardTitle className="flex items-center">
              <i className="fas fa-history text-cyan-400 mr-2"></i>
              Vault Trails
              <Badge className="ml-2 bg-cyan-400/20 text-cyan-400 border-cyan-400/30">
                {vaultTrails.length} activities
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {vaultTrails.map((trail, index) => (
                <div 
                  key={trail.id}
                  className="flex items-start space-x-4 group hover:bg-card/50 p-3 rounded-lg transition-colors"
                  data-testid={`vault-trail-${trail.id}`}
                >
                  <div className="relative flex items-center justify-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusBadge(trail.type)}`}>
                      <i className={`fas ${
                        trail.type === 'sync' ? 'fa-sync-alt' :
                        trail.type === 'treaty' ? 'fa-handshake' :
                        trail.type === 'license' ? 'fa-key' :
                        'fa-database'
                      } text-xs`}></i>
                    </div>
                    {index < vaultTrails.length - 1 && (
                      <div className="absolute top-8 left-1/2 w-px h-8 bg-border -translate-x-1/2"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground group-hover:text-cyan-400 transition-colors">
                        {trail.action}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(trail.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{trail.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Asset Preview Modal */}
      {previewAsset && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewAsset(null)}
          data-testid="asset-preview-modal"
        >
          <div 
            className="bg-card rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{previewAsset.title}</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setPreviewAsset(null)}
                data-testid="button-close-preview"
              >
                <i className="fas fa-times"></i>
              </Button>
            </div>
            <div className="mb-4">
              <img 
                src={previewAsset.imageUrl} 
                alt={previewAsset.title}
                className="w-full max-h-96 object-contain rounded-lg"
              />
            </div>
            {previewAsset.description && (
              <p className="text-muted-foreground mb-4">{previewAsset.description}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge>{previewAsset.type}</Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(previewAsset.uploadedAt).toLocaleDateString()}
                </span>
              </div>
              <Button data-testid="button-download-asset">
                <i className="fas fa-download mr-2"></i>
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SamFoxStudioPlatform() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [pulseInterval, setPulseInterval] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch SamFox Studio instance
  const { data: studio, isLoading: studioLoading } = useQuery<SamFoxStudio>({
    queryKey: ["/api/samfox-studio"],
  });

  // Fetch workspaces
  const { data: workspaces = [], isLoading: workspacesLoading } = useQuery<CollaborationWorkspace[]>({
    queryKey: ["/api/samfox-studio/workspaces"],
    enabled: !!studio?.id,
  });

  // Fetch licenses
  const { data: licenses = [], isLoading: licensesLoading } = useQuery<GlobalMasterLicense[]>({
    queryKey: ["/api/samfox-studio/licenses"],
    enabled: !!studio?.id,
  });

  // Fetch treaties
  const { data: treaties = [], isLoading: treatiesLoading } = useQuery<TreatyCollaboration[]>({
    queryKey: ["/api/samfox-studio/treaties"],
    enabled: !!studio?.id,
  });

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ["/api/samfox-studio", studio?.id, "stats"],
    enabled: !!studio?.id,
  });

  // Initialize SamFox Studio mutation
  const initializeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/samfox-studio/initialize", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/samfox-studio"] });
      toast({ description: "SamFox Studio initialized successfully! ✨" });
    },
    onError: (error: Error) => {
      toast({ 
        variant: "destructive",
        description: `Failed to initialize: ${error.message}` 
      });
    },
  });

  // Vault sync mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!studio?.id) throw new Error("Studio not found");
      return await apiRequest("POST", `/api/samfox-studio/${studio.id}/sync`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/samfox-studio"] });
      toast({ description: "Vault sync completed successfully! 🔄" });
    },
    onError: (error: Error) => {
      toast({ 
        variant: "destructive",
        description: `Sync failed: ${error.message}` 
      });
    },
  });

  // 9-second pulse sync effect
  useEffect(() => {
    if (studio?.syncRate && studio.vaultLink) {
      const interval = setInterval(() => {
        if (studio.id) {
          // Silent sync in background
          syncMutation.mutate();
        }
      }, studio.syncRate * 1000);
      
      setPulseInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [studio]);

  if (studioLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading SamFox Studio Platform...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="text-6xl mb-4">🦁</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">SamFox Studio™</h2>
            <p className="text-muted-foreground mb-6">
              Global Master License | Copyright Protected | Treaty-Bound Collaboration
            </p>
          </div>
          
          <Card className="max-w-md mx-auto bg-gradient-to-br from-indigo-800 to-gray-900 text-white">
            <CardHeader>
              <CardTitle className="text-xl">🌍 Initialize SamFox Studio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-indigo-300 mb-4">
                One of a kind • Treaty-Bound • Global License
              </p>
              <Button 
                onClick={() => initializeMutation.mutate()}
                disabled={initializeMutation.isPending}
                className="w-full"
                data-testid="button-initialize-samfox"
              >
                {initializeMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Initializing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic mr-2"></i>
                    Initialize Platform
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Pulse Animation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                🦁
              </div>
              {studio.vaultLink && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{studio.brandName}</h1>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {studio.treatyClass}
                </Badge>
                <Badge variant={studio.copyrightActive ? "default" : "outline"} className="text-xs">
                  ✨ {studio.faaClassTag || "FAA-CLASS-BRND-321/SFS"}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={studio.globalStatus === "Open for Business" ? "default" : "secondary"}>
              {studio.globalStatus}
            </Badge>
            <Button 
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending}
              size="sm"
              data-testid="button-vault-sync"
            >
              {syncMutation.isPending ? (
                <i className="fas fa-spinner fa-spin mr-2"></i>
              ) : (
                <i className="fas fa-sync mr-2"></i>
              )}
              Vault Sync
            </Button>
          </div>
        </div>
        
        <p className="text-muted-foreground">{studio.claimStatement}</p>
        
        {/* Pulse Status */}
        <div className="mt-4 p-3 bg-card rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">
                Pulse Timer: {studio.syncRate}s | Vault Link: {studio.vaultLink ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Signatory: {studio.signatory}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="workspaces" data-testid="tab-workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="licenses" data-testid="tab-licenses">Licenses</TabsTrigger>
          <TabsTrigger value="treaties" data-testid="tab-treaties">Treaties</TabsTrigger>
          <TabsTrigger value="fileroom" data-testid="tab-fileroom">Fileroom</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalWorkspaces || 0}</div>
                <p className="text-xs text-muted-foreground">Active collaboration spaces</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Master Licenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalLicenses || 0}</div>
                <p className="text-xs text-muted-foreground">Global licensing agreements</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Treaty Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalFiles || 0}</div>
                <p className="text-xs text-muted-foreground">Protected documents</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Treaties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeTreaties || 0}</div>
                <p className="text-xs text-muted-foreground">Signed collaborations</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start" data-testid="button-create-workspace">
                  <i className="fas fa-plus mr-2"></i>
                  Create Workspace
                </Button>
                <Button variant="outline" className="justify-start" data-testid="button-issue-license">
                  <i className="fas fa-certificate mr-2"></i>
                  Issue License
                </Button>
                <Button variant="outline" className="justify-start" data-testid="button-draft-treaty">
                  <i className="fas fa-handshake mr-2"></i>
                  Draft Treaty
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workspaces Tab */}
        <TabsContent value="workspaces" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Collaboration Workspaces</h3>
            <Button data-testid="button-new-workspace">
              <i className="fas fa-plus mr-2"></i>
              New Workspace
            </Button>
          </div>
          
          {workspacesLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : workspaces.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <i className="fas fa-users text-muted-foreground text-4xl mb-4"></i>
                <h4 className="text-lg font-semibold mb-2">No Workspaces Yet</h4>
                <p className="text-muted-foreground mb-4">Create your first collaboration workspace</p>
                <Button data-testid="button-create-first-workspace">
                  <i className="fas fa-plus mr-2"></i>
                  Create Workspace
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {workspaces.map((workspace) => (
                <Card key={workspace.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center space-x-2">
                        <span>{workspace.workspaceName}</span>
                        {workspace.treatyProtected && (
                          <Badge variant="secondary" className="text-xs">Treaty Protected</Badge>
                        )}
                      </CardTitle>
                      <Badge variant={workspace.status === "active" ? "default" : "secondary"}>
                        {workspace.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <div className="font-medium">{workspace.workspaceType}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Access:</span>
                        <div className="font-medium">{workspace.accessLevel}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Members:</span>
                        <div className="font-medium">{workspace.members?.length || 0}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Real-time:</span>
                        <div className="font-medium">{workspace.realTimeEnabled ? "Enabled" : "Disabled"}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Licenses Tab */}
        <TabsContent value="licenses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Global Master Licenses</h3>
            <Button data-testid="button-new-license">
              <i className="fas fa-certificate mr-2"></i>
              Issue License
            </Button>
          </div>
          
          {licensesLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {licenses.map((license) => (
                <Card key={license.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-mono">{license.licenseKey}</CardTitle>
                      <div className="flex space-x-2">
                        {license.faaVerified && (
                          <Badge variant="default" className="text-xs">FAA Verified</Badge>
                        )}
                        {license.copyrightAssertion && (
                          <Badge variant="secondary" className="text-xs">Copyright Active</Badge>
                        )}
                        <Badge variant={license.status === "active" ? "default" : "secondary"}>
                          {license.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <div className="font-medium">{license.licenseType}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Treaty Class:</span>
                        <div className="font-medium">{license.treatyClass}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Global Scope:</span>
                        <div className="font-medium">{license.globalScope ? "Yes" : "No"}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Issued:</span>
                        <div className="font-medium">{new Date(license.issuedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Treaties Tab */}
        <TabsContent value="treaties" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Treaty Collaborations</h3>
            <Button data-testid="button-new-treaty">
              <i className="fas fa-handshake mr-2"></i>
              Draft Treaty
            </Button>
          </div>
          
          {treatiesLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {treaties.map((treaty) => (
                <Card key={treaty.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center space-x-2">
                        <span className="font-mono text-sm">{treaty.treatyId}</span>
                        {treaty.sealedTreatyLaw && (
                          <Badge variant="secondary" className="text-xs">Sealed Treaty Law</Badge>
                        )}
                      </CardTitle>
                      <Badge variant={treaty.status === "signed" ? "default" : "secondary"}>
                        {treaty.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <span className="text-muted-foreground text-sm">Treaty Type:</span>
                        <div className="font-medium">{treaty.treatyType}</div>
                      </div>
                      {treaty.treatyMessage && (
                        <div>
                          <span className="text-muted-foreground text-sm">Message:</span>
                          <div className="font-medium">{treaty.treatyMessage}</div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Co-Signers:</span>
                          <div className="font-medium">{treaty.brandCoSigners?.length || 0}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Collaborators:</span>
                          <div className="font-medium">{treaty.collaboratorIds?.length || 0}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {treaty.faaClassTag}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Fileroom Tab */}
        <TabsContent value="fileroom" className="space-y-6">
          <FileroomGallery />
        </TabsContent>
      </Tabs>
    </div>
  );
}