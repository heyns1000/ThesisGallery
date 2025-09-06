import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Gallery } from "@shared/schema";

export default function GalleryPage() {
  const [filterType, setFilterType] = useState("all");
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
      toast({ description: "Image uploaded successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        variant: "destructive",
        description: `Upload failed: ${error.message}` 
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', file.name);
    formData.append('type', 'uploaded');
    
    uploadMutation.mutate(formData);
  };

  const getTypeInfo = (type: string) => {
    switch (type.toLowerCase()) {
      case 'roadmap':
        return { color: 'bg-primary/10 text-primary', label: 'Roadmap' };
      case 'ai-generated':
        return { color: 'bg-accent/10 text-accent', label: 'AI Generated' };
      case 'brand-asset':
        return { color: 'bg-emerald-400/10 text-emerald-400', label: 'Brand Asset' };
      case 'screenshot':
        return { color: 'bg-yellow-400/10 text-yellow-400', label: 'Screenshot' };
      case 'concept':
        return { color: 'bg-purple-400/10 text-purple-400', label: 'Concept' };
      case 'architecture':
        return { color: 'bg-cyan-400/10 text-cyan-400', label: 'Architecture' };
      default:
        return { color: 'bg-muted-foreground/10 text-muted-foreground', label: type };
    }
  };

  const filteredItems = galleryItems.filter(item => 
    filterType === "all" || item.type.toLowerCase() === filterType.toLowerCase()
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">Visual Gallery</h3>
            <p className="text-muted-foreground">Roadmaps, AI-generated images, and visual assets</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger data-testid="select-gallery-type">
                <SelectValue placeholder="All Images" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Images</SelectItem>
                <SelectItem value="roadmap">Roadmaps</SelectItem>
                <SelectItem value="ai-generated">AI Generated</SelectItem>
                <SelectItem value="brand-asset">Brand Assets</SelectItem>
                <SelectItem value="screenshot">Screenshots</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <input
                type="file"
                id="image-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleImageUpload}
                data-testid="input-image-upload"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted"></div>
              <div className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <i className="fas fa-images text-muted-foreground text-6xl mb-4"></i>
          <h4 className="text-lg font-semibold text-foreground mb-2">
            {filterType !== "all" ? "No images found for this category" : "No images uploaded yet"}
          </h4>
          <p className="text-muted-foreground mb-6">
            {filterType !== "all" 
              ? "Try selecting a different category or upload new images"
              : "Upload your first image to get started"
            }
          </p>
          {filterType === "all" && (
            <Button onClick={() => document.getElementById('image-upload')?.click()}>
              <i className="fas fa-upload mr-2"></i>
              Upload Image
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const typeInfo = getTypeInfo(item.type);
              
              return (
                <div 
                  key={item.id}
                  className="group relative overflow-hidden rounded-lg bg-card border border-border cursor-pointer hover:scale-105 transition-transform"
                  data-testid={`gallery-item-${item.id}`}
                >
                  {item.imageUrl.startsWith('http') ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="aspect-square object-cover w-full"
                    />
                  ) : (
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <i className="fas fa-image text-4xl text-muted-foreground"></i>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button className="bg-primary text-primary-foreground">
                      <i className="fas fa-eye mr-2"></i>View
                    </Button>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold text-foreground mb-1 line-clamp-1">{item.title}</h4>
                    {item.description && (
                      <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge className={typeInfo.color}>
                        {typeInfo.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 text-center">
            <Button variant="secondary" data-testid="button-load-more-images">
              Load More Images
            </Button>
          </div>
          
          {/* Spotify Album Embed */}
          <div className="mt-12 bg-card rounded-lg border border-border p-6">
            <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <i className="fab fa-spotify text-green-500 mr-2"></i>
              Music Experience
            </h4>
            <p className="text-muted-foreground mb-4">Enhance your FAA™ journey with curated audio experience</p>
            <iframe 
              data-testid="embed-iframe" 
              style={{borderRadius: '12px'}} 
              src="https://open.spotify.com/embed/album/30OeYX8aVRKtwzyUS9D1kZ?utm_source=generator" 
              width="100%" 
              height="352" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              className="w-full"
            />
          </div>
        </>
      )}
    </div>
  );
}
