import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Gallery, Document } from "@shared/schema";

// SamFox Studio color palette and styling constants
const SAMFOX_COLORS = {
  primary: "from-orange-400 to-yellow-500",
  secondary: "from-yellow-400 to-orange-500",
  accent: "from-amber-400 to-orange-400",
  cardHover: "hover:shadow-xl hover:shadow-orange-500/20",
  border: "border-orange-400/20 hover:border-orange-400/40",
  background: "bg-gradient-to-br from-orange-400/5 to-yellow-500/5",
};

// Asset type configurations with SamFox styling
const getAssetTypeInfo = (type: string) => {
  switch (type.toLowerCase()) {
    case 'roadmap':
      return {
        color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        icon: 'fas fa-route',
        label: 'Roadmap'
      };
    case 'ai-generated':
      return {
        color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        icon: 'fas fa-robot',
        label: 'AI Generated'
      };
    case 'brand-asset':
      return {
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        icon: 'fas fa-copyright',
        label: 'Brand Asset'
      };
    case 'screenshot':
      return {
        color: 'bg-orange-400/10 text-orange-300 border-orange-400/20',
        icon: 'fas fa-camera',
        label: 'Screenshot'
      };
    case 'concept':
      return {
        color: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/20',
        icon: 'fas fa-lightbulb',
        label: 'Concept'
      };
    case 'architecture':
      return {
        color: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
        icon: 'fas fa-drafting-compass',
        label: 'Architecture'
      };
    case 'uploaded':
      return {
        color: 'bg-orange-300/10 text-orange-200 border-orange-300/20',
        icon: 'fas fa-upload',
        label: 'Uploaded'
      };
    default:
      return {
        color: 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20',
        icon: 'fas fa-file',
        label: type
      };
  }
};

// SamFox Asset Card Component
interface SamFoxAssetCardProps {
  item: Gallery;
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'strip';
}

export function SamFoxAssetCard({ item, onClick, variant = 'default' }: SamFoxAssetCardProps) {
  const typeInfo = getAssetTypeInfo(item.type);
  
  if (variant === 'strip') {
    return (
      <div 
        className={`flex-shrink-0 w-32 cursor-pointer group ${SAMFOX_COLORS.cardHover} transition-all duration-300`}
        onClick={onClick}
        data-testid={`samfox-asset-card-${item.id}`}
      >
        <div className="aspect-square rounded-lg overflow-hidden relative">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${SAMFOX_COLORS.primary} flex items-center justify-center`}>
              <i className={`${typeInfo.icon} text-white text-2xl`}></i>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-1 left-1 right-1">
              <Badge className={`text-xs ${typeInfo.color}`}>
                <i className={`${typeInfo.icon} mr-1`}></i>
                {typeInfo.label}
              </Badge>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card 
        className={`group cursor-pointer ${SAMFOX_COLORS.cardHover} ${SAMFOX_COLORS.border} ${SAMFOX_COLORS.background} 
                   hover:scale-105 transition-all duration-300 overflow-hidden`}
        onClick={onClick}
        data-testid={`samfox-asset-card-${item.id}`}
      >
        <div className="aspect-square relative">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${SAMFOX_COLORS.primary} flex items-center justify-center`}>
              <i className={`${typeInfo.icon} text-white text-3xl`}></i>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-2 right-2">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                <i className="fas fa-eye"></i>
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-3">
          <h4 className="font-medium text-foreground truncate text-sm group-hover:text-orange-400 transition-colors">
            {item.title}
          </h4>
          <div className="flex items-center justify-between mt-2">
            <Badge className={`text-xs ${typeInfo.color}`}>
              <i className={`${typeInfo.icon} mr-1`}></i>
              {typeInfo.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(item.uploadedAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <div 
      className={`group relative overflow-hidden rounded-lg bg-card border ${SAMFOX_COLORS.border} 
                 cursor-pointer ${SAMFOX_COLORS.cardHover} hover:scale-105 transition-all duration-300`}
      onClick={onClick}
      data-testid={`samfox-asset-card-${item.id}`}
    >
      <div className="aspect-square relative">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${SAMFOX_COLORS.primary} flex items-center justify-center`}>
            <i className={`${typeInfo.icon} text-white text-4xl`}></i>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 
                        flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button className={`bg-gradient-to-r ${SAMFOX_COLORS.primary} text-white`}>
            <i className="fas fa-eye mr-2"></i>View
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="font-semibold text-foreground mb-1 line-clamp-1">{item.title}</h4>
        {item.description && (
          <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between">
          <Badge className={typeInfo.color}>
            <i className={`${typeInfo.icon} mr-1`}></i>
            {typeInfo.label}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(item.uploadedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// SamFox Filter Bar Component
interface SamFoxFilterBarProps {
  filterType: string;
  onFilterChange: (filter: string) => void;
  counts?: Record<string, number>;
}

export function SamFoxFilterBar({ filterType, onFilterChange, counts }: SamFoxFilterBarProps) {
  const filterOptions = [
    { value: "all", label: "All Assets", count: counts?.all || 0 },
    { value: "roadmap", label: "Roadmaps", count: counts?.roadmap || 0 },
    { value: "ai-generated", label: "AI Generated", count: counts?.['ai-generated'] || 0 },
    { value: "brand-asset", label: "Brand Assets", count: counts?.['brand-asset'] || 0 },
    { value: "screenshot", label: "Screenshots", count: counts?.screenshot || 0 },
    { value: "concept", label: "Concepts", count: counts?.concept || 0 },
    { value: "architecture", label: "Architecture", count: counts?.architecture || 0 },
  ];

  return (
    <div className="flex items-center space-x-4">
      <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${SAMFOX_COLORS.primary} text-white text-sm font-medium`}>
        <i className="fas fa-fox-face mr-2"></i>SamFox Gallery
      </div>
      
      <Select value={filterType} onValueChange={onFilterChange}>
        <SelectTrigger 
          className={`w-48 ${SAMFOX_COLORS.border} focus:border-orange-400`} 
          data-testid="select-samfox-gallery-filter"
        >
          <SelectValue placeholder="Filter assets" />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center justify-between w-full">
                <span>{option.label}</span>
                {option.count > 0 && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {option.count}
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// SamFox Upload Button Component
interface SamFoxUploadButtonProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  accept?: string;
  variant?: 'default' | 'compact';
}

export function SamFoxUploadButton({ onFileSelect, isUploading = false, accept = "image/*", variant = 'default' }: SamFoxUploadButtonProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const buttonClass = variant === 'compact' 
    ? "px-3 py-2 text-sm" 
    : "px-4 py-2";

  return (
    <div className="relative">
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept={accept}
        onChange={handleFileChange}
        disabled={isUploading}
        data-testid="input-samfox-upload"
      />
      <Button 
        className={`bg-gradient-to-r ${SAMFOX_COLORS.primary} text-white hover:opacity-90 ${buttonClass}`}
        disabled={isUploading}
        data-testid="button-samfox-upload"
      >
        <i className={`fas ${isUploading ? 'fa-spinner fa-spin' : 'fa-upload'} mr-2`}></i>
        {isUploading ? 'Uploading...' : 'Upload Asset'}
      </Button>
    </div>
  );
}

// SamFox Preview Modal Component
interface SamFoxPreviewModalProps {
  item: Gallery | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SamFoxPreviewModal({ item, isOpen, onClose }: SamFoxPreviewModalProps) {
  if (!item) return null;

  const typeInfo = getAssetTypeInfo(item.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] ${SAMFOX_COLORS.background} border-orange-400/20`}>
        <DialogHeader>
          <DialogTitle className="flex items-center text-orange-400">
            <i className={`${typeInfo.icon} mr-2`}></i>
            {item.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full max-h-96 object-contain bg-black/5"
              />
            ) : (
              <div className={`w-full h-64 bg-gradient-to-br ${SAMFOX_COLORS.primary} flex items-center justify-center`}>
                <i className={`${typeInfo.icon} text-white text-6xl`}></i>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge className={typeInfo.color}>
                <i className={`${typeInfo.icon} mr-1`}></i>
                {typeInfo.label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Uploaded on {new Date(item.uploadedAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <i className="fas fa-download mr-2"></i>Download
              </Button>
              <Button variant="outline" size="sm">
                <i className="fas fa-share mr-2"></i>Share
              </Button>
            </div>
          </div>
          
          {item.description && (
            <div>
              <h4 className="font-medium text-foreground mb-2">Description</h4>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          )}
          
          {item.tags && item.tags.length > 0 && (
            <div>
              <h4 className="font-medium text-foreground mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// SamFox Gallery Grid Component
interface SamFoxGalleryGridProps {
  items: Gallery[];
  isLoading?: boolean;
  onItemClick?: (item: Gallery) => void;
  variant?: 'default' | 'compact';
  emptyTitle?: string;
  emptyDescription?: string;
}

export function SamFoxGalleryGrid({ 
  items, 
  isLoading = false, 
  onItemClick, 
  variant = 'default',
  emptyTitle = "No assets found",
  emptyDescription = "Upload your first asset to get started" 
}: SamFoxGalleryGridProps) {
  if (isLoading) {
    const skeletonCount = variant === 'compact' ? 4 : 8;
    const gridCols = variant === 'compact' ? 'grid-cols-2 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    
    return (
      <div className={`grid ${gridCols} gap-6`}>
        {[...Array(skeletonCount)].map((_, i) => (
          <div key={i} className={`bg-card rounded-lg border ${SAMFOX_COLORS.border} overflow-hidden animate-pulse`}>
            <div className="aspect-square bg-muted"></div>
            <div className="p-4">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className={`w-16 h-16 bg-gradient-to-r ${SAMFOX_COLORS.primary} rounded-lg flex items-center justify-center mx-auto mb-4`}>
          <i className="fas fa-images text-white text-2xl"></i>
        </div>
        <h4 className="text-lg font-semibold text-foreground mb-2">{emptyTitle}</h4>
        <p className="text-muted-foreground mb-6">{emptyDescription}</p>
      </div>
    );
  }

  const gridCols = variant === 'compact' 
    ? 'grid-cols-2 md:grid-cols-4' 
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {items.map((item) => (
        <SamFoxAssetCard
          key={item.id}
          item={item}
          onClick={() => onItemClick?.(item)}
          variant={variant}
        />
      ))}
    </div>
  );
}

// SamFox Gallery Widget (for Dashboard)
interface SamFoxGalleryWidgetProps {
  title?: string;
  limit?: number;
  showUpload?: boolean;
}

export function SamFoxGalleryWidget({ title = "Recent Assets", limit = 4, showUpload = true }: SamFoxGalleryWidgetProps) {
  const [previewItem, setPreviewItem] = useState<Gallery | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: galleryItems = [], isLoading } = useQuery<Gallery[]>({
    queryKey: ["/api/gallery"],
    select: (data) => data.slice(0, limit),
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await apiRequest("POST", "/api/gallery", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ description: "Asset uploaded successfully! ✨" });
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
    formData.append('image', file);
    formData.append('title', file.name);
    formData.append('type', 'uploaded');
    uploadMutation.mutate(formData);
  };

  return (
    <Card className={`${SAMFOX_COLORS.background} ${SAMFOX_COLORS.border}`} data-testid="samfox-gallery-widget">
      <CardHeader className={`bg-gradient-to-r ${SAMFOX_COLORS.primary} text-white`}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-images mr-2"></i>
            {title}
          </div>
          {showUpload && (
            <SamFoxUploadButton
              onFileSelect={handleFileUpload}
              isUploading={uploadMutation.isPending}
              variant="compact"
            />
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <SamFoxGalleryGrid
          items={galleryItems}
          isLoading={isLoading}
          onItemClick={setPreviewItem}
          variant="compact"
          emptyTitle="No recent assets"
          emptyDescription="Upload assets to see them here"
        />
        
        {galleryItems.length > 0 && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              className={`${SAMFOX_COLORS.border} hover:bg-orange-50 dark:hover:bg-orange-950/10`}
              data-testid="button-view-all-assets"
            >
              View All Assets <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </div>
        )}
      </CardContent>

      <SamFoxPreviewModal 
        item={previewItem}
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </Card>
  );
}

// SamFox Gallery Strip (for AI pages)
interface SamFoxGalleryStripProps {
  title?: string;
  filterType?: string;
  limit?: number;
}

export function SamFoxGalleryStrip({ title = "Visual Assets", filterType, limit = 8 }: SamFoxGalleryStripProps) {
  const [previewItem, setPreviewItem] = useState<Gallery | null>(null);

  const { data: galleryItems = [], isLoading } = useQuery<Gallery[]>({
    queryKey: ["/api/gallery"],
    select: (data) => {
      let filtered = data;
      if (filterType && filterType !== 'all') {
        filtered = data.filter(item => item.type.toLowerCase() === filterType.toLowerCase());
      }
      return filtered.slice(0, limit);
    },
  });

  if (isLoading) {
    return (
      <div className={`p-4 rounded-lg ${SAMFOX_COLORS.background} ${SAMFOX_COLORS.border}`}>
        <h4 className="font-medium text-foreground mb-3 flex items-center">
          <i className="fas fa-images text-orange-400 mr-2"></i>
          {title}
        </h4>
        <ScrollArea className="w-full">
          <div className="flex space-x-3 pb-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-32 h-32 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (galleryItems.length === 0) {
    return (
      <div className={`p-4 rounded-lg ${SAMFOX_COLORS.background} ${SAMFOX_COLORS.border}`}>
        <h4 className="font-medium text-foreground mb-3 flex items-center">
          <i className="fas fa-images text-orange-400 mr-2"></i>
          {title}
        </h4>
        <div className="text-center py-8">
          <i className="fas fa-image text-muted-foreground text-2xl mb-2"></i>
          <p className="text-sm text-muted-foreground">No assets available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg ${SAMFOX_COLORS.background} ${SAMFOX_COLORS.border}`} data-testid="samfox-gallery-strip">
      <h4 className="font-medium text-foreground mb-3 flex items-center">
        <i className="fas fa-images text-orange-400 mr-2"></i>
        {title}
        <Badge className="ml-2 bg-orange-400/20 text-orange-400 border-orange-400/30">
          {galleryItems.length} assets
        </Badge>
      </h4>
      
      <ScrollArea className="w-full">
        <div className="flex space-x-3 pb-2">
          {galleryItems.map((item) => (
            <SamFoxAssetCard
              key={item.id}
              item={item}
              onClick={() => setPreviewItem(item)}
              variant="strip"
            />
          ))}
        </div>
      </ScrollArea>

      <SamFoxPreviewModal 
        item={previewItem}
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
}

// Main SamFox Gallery Component (combines all components)
interface SamFoxGalleryProps {
  title?: string;
  showUpload?: boolean;
  showFilter?: boolean;
}

export default function SamFoxGallery({ 
  title = "SamFox Studio Gallery", 
  showUpload = true, 
  showFilter = true 
}: SamFoxGalleryProps) {
  const [filterType, setFilterType] = useState("all");
  const [previewItem, setPreviewItem] = useState<Gallery | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: galleryItems = [], isLoading } = useQuery<Gallery[]>({
    queryKey: ["/api/gallery"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await apiRequest("POST", "/api/gallery", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ description: "Asset uploaded successfully! ✨" });
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
    formData.append('image', file);
    formData.append('title', file.name);
    formData.append('type', 'uploaded');
    uploadMutation.mutate(formData);
  };

  // Filter items
  const filteredItems = galleryItems.filter(item => 
    filterType === "all" || item.type.toLowerCase() === filterType.toLowerCase()
  );

  // Calculate filter counts
  const filterCounts = galleryItems.reduce((acc, item) => {
    acc.all = galleryItems.length;
    acc[item.type.toLowerCase()] = (acc[item.type.toLowerCase()] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6" data-testid="samfox-gallery-main">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center">
            <div className={`w-8 h-8 bg-gradient-to-r ${SAMFOX_COLORS.primary} rounded-lg flex items-center justify-center mr-3`}>
              <i className="fas fa-fox-face text-white text-sm"></i>
            </div>
            {title}
          </h3>
          <p className="text-muted-foreground">Professional visual asset management with SamFox Studio styling</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {showFilter && (
            <SamFoxFilterBar
              filterType={filterType}
              onFilterChange={setFilterType}
              counts={filterCounts}
            />
          )}
          
          {showUpload && (
            <SamFoxUploadButton
              onFileSelect={handleFileUpload}
              isUploading={uploadMutation.isPending}
            />
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <SamFoxGalleryGrid
        items={filteredItems}
        isLoading={isLoading}
        onItemClick={setPreviewItem}
        emptyTitle={filterType !== "all" ? "No assets found for this category" : "No assets uploaded yet"}
        emptyDescription={filterType !== "all" 
          ? "Try selecting a different category or upload new assets"
          : "Upload your first asset to get started with SamFox Gallery"
        }
      />

      {/* Load More Button */}
      {filteredItems.length > 0 && (
        <div className="text-center">
          <Button 
            variant="outline" 
            className={`${SAMFOX_COLORS.border} hover:bg-orange-50 dark:hover:bg-orange-950/10`}
            data-testid="button-load-more-assets"
          >
            Load More Assets
          </Button>
        </div>
      )}

      {/* Preview Modal */}
      <SamFoxPreviewModal 
        item={previewItem}
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
}