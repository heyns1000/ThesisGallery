import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Search, Grid, List, ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import type { Gallery } from "@shared/schema";

// SECTOR COLOR CODING - VaultKey/Banimal Dark Theme Aesthetic
const SECTOR_COLORS: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  "🤝 Sponsorship Management": { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", accent: "from-blue-500 to-cyan-400" },
  "🎪 Event Management": { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", accent: "from-purple-500 to-pink-400" },
  "🎬 Content Creation": { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", accent: "from-red-500 to-orange-400" },
  "🌟 Talent Development": { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", accent: "from-yellow-500 to-amber-400" },
  "🏘️ Community Engagement": { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", accent: "from-green-500 to-emerald-400" },
  "⚙️ Tech Infrastructure": { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", accent: "from-cyan-500 to-blue-400" },
  "📦 Logistics & Operations": { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", accent: "from-orange-500 to-yellow-400" },
  "💰 Financial Management": { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", accent: "from-emerald-500 to-green-400" },
  "🎨 Marketing & Branding": { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", accent: "from-pink-500 to-rose-400" },
  "🤝 Partnership & Collaboration": { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-400", accent: "from-indigo-500 to-purple-400" },
  "📊 Analytics & Insights": { bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-400", accent: "from-teal-500 to-cyan-400" },
  "🌱 Sustainability & Impact": { bg: "bg-lime-500/10", border: "border-lime-500/30", text: "text-lime-400", accent: "from-lime-500 to-green-400" },
  default: { bg: "bg-gray-500/10", border: "border-gray-500/30", text: "text-gray-400", accent: "from-gray-500 to-slate-400" }
};

// Get sector color theme
const getSectorColors = (sector?: string | null) => {
  if (!sector) return SECTOR_COLORS.default;
  return SECTOR_COLORS[sector] || SECTOR_COLORS.default;
};

// Division/Sector Group Component
interface DivisionGroupProps {
  division: string;
  items: Gallery[];
  isExpanded: boolean;
  onToggle: () => void;
  onItemClick: (item: Gallery) => void;
  viewMode: 'grid' | 'list';
}

function DivisionGroup({ division, items, isExpanded, onToggle, onItemClick, viewMode }: DivisionGroupProps) {
  const sectorColors = getSectorColors(items[0]?.sector);
  const itemCount = items.length;
  const uniqueBrands = new Set(items.map(item => item.brand).filter(Boolean)).size;

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className={`${sectorColors.bg} border ${sectorColors.border} overflow-hidden`} data-testid={`division-group-${division}`}>
        <CollapsibleTrigger className="w-full" data-testid={`division-toggle-${division}`}>
          <CardHeader className="cursor-pointer hover:bg-white/5 dark:hover:bg-black/20 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${sectorColors.accent} flex items-center justify-center`}>
                  <span className="text-2xl">{items[0]?.sector?.split(' ')[0] || '📁'}</span>
                </div>
                <div className="text-left">
                  <CardTitle className={`${sectorColors.text} text-xl`}>{division}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className={`${sectorColors.border} ${sectorColors.text}`}>
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </Badge>
                    {uniqueBrands > 0 && (
                      <Badge variant="outline" className={`${sectorColors.border} ${sectorColors.text}`}>
                        {uniqueBrands} {uniqueBrands === 1 ? 'brand' : 'brands'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={`bg-gradient-to-r ${sectorColors.accent} text-white`}>
                  {items[0]?.sector || 'Uncategorized'}
                </Badge>
                {isExpanded ? (
                  <ChevronUp className={sectorColors.text} />
                ) : (
                  <ChevronDown className={sectorColors.text} />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-4">
            <AnimatePresence>
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
                : 'space-y-4'
              }>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <EnhancedGalleryCard item={item} onClick={() => onItemClick(item)} viewMode={viewMode} />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// Enhanced Gallery Card Component
interface EnhancedGalleryCardProps {
  item: Gallery;
  onClick: () => void;
  viewMode: 'grid' | 'list';
}

function EnhancedGalleryCard({ item, onClick, viewMode }: EnhancedGalleryCardProps) {
  const sectorColors = getSectorColors(item.sector);
  
  if (viewMode === 'list') {
    return (
      <Card 
        className={`${sectorColors.bg} border ${sectorColors.border} cursor-pointer hover:shadow-lg hover:shadow-${sectorColors.text}/20 transition-all duration-300`}
        onClick={onClick}
        data-testid={`gallery-card-${item.id}`}
      >
        <div className="flex items-center space-x-4 p-4">
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            {item.imageUrl ? (
              <OptimizedImage 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${sectorColors.accent} flex items-center justify-center`}>
                <span className="text-white text-2xl">📷</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">{item.title}</h4>
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
            )}
            <div className="flex items-center space-x-2 mt-2 flex-wrap gap-2">
              {item.brand && (
                <Badge variant="outline" className={`${sectorColors.border} ${sectorColors.text} text-xs`}>
                  {item.brand}
                </Badge>
              )}
              {item.type && (
                <Badge variant="outline" className="text-xs">
                  {item.type}
                </Badge>
              )}
              {item.category && (
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(item.uploadedAt).toLocaleDateString()}
          </div>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <Card 
      className={`${sectorColors.bg} border ${sectorColors.border} cursor-pointer overflow-hidden group hover:shadow-xl hover:shadow-${sectorColors.text}/20 hover:scale-105 transition-all duration-300`}
      onClick={onClick}
      data-testid={`gallery-card-${item.id}`}
    >
      <div className="aspect-square relative">
        {item.imageUrl ? (
          <OptimizedImage 
            src={item.imageUrl} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${sectorColors.accent} flex items-center justify-center`}>
            <span className="text-white text-4xl">📷</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <h4 className="font-semibold text-white mb-2">{item.title}</h4>
            {item.brand && (
              <Badge className={`bg-gradient-to-r ${sectorColors.accent} text-white text-xs`}>
                {item.brand}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 flex-wrap gap-1">
            {item.sector && (
              <Badge variant="outline" className={`${sectorColors.border} ${sectorColors.text} text-xs`}>
                {item.sector?.split(' ')[0]}
              </Badge>
            )}
            {item.type && (
              <Badge variant="outline" className="text-xs">
                {item.type}
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(item.uploadedAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Preview Modal Component
interface PreviewModalProps {
  item: Gallery | null;
  isOpen: boolean;
  onClose: () => void;
}

function PreviewModal({ item, isOpen, onClose }: PreviewModalProps) {
  if (!item) return null;

  const sectorColors = getSectorColors(item.sector);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] ${sectorColors.bg} border ${sectorColors.border}`} data-testid="preview-modal">
        <DialogHeader>
          <DialogTitle className={`${sectorColors.text} text-2xl flex items-center`}>
            <span className="mr-2">{item.sector?.split(' ')[0] || '📷'}</span>
            {item.title}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              {item.imageUrl ? (
                <OptimizedImage 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full max-h-96 object-contain bg-black/5"
                />
              ) : (
                <div className={`w-full h-64 bg-gradient-to-br ${sectorColors.accent} flex items-center justify-center`}>
                  <span className="text-white text-6xl">📷</span>
                </div>
              )}
            </div>
            
            {item.description && (
              <div>
                <h4 className="font-semibold text-foreground mb-2">Description</h4>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Metadata</h4>
                <div className="space-y-2 text-sm">
                  {item.brand && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Brand:</span>
                      <Badge className={`${sectorColors.border} ${sectorColors.text}`}>{item.brand}</Badge>
                    </div>
                  )}
                  {item.sector && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Sector:</span>
                      <Badge className={`bg-gradient-to-r ${sectorColors.accent} text-white`}>{item.sector}</Badge>
                    </div>
                  )}
                  {item.category && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                  )}
                  {item.division && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Division:</span>
                      <Badge variant="outline">{item.division}</Badge>
                    </div>
                  )}
                  {item.type && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Uploaded:</span>
                    <span className="text-foreground">{new Date(item.uploadedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {item.tags && item.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Tags</h4>
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Main Enhanced Gallery Component
interface EnhancedGalleryProps {
  title?: string;
  showFilters?: boolean;
  defaultViewMode?: 'grid' | 'list';
}

export default function EnhancedGallery({ 
  title = "FAA™ Enhanced Gallery", 
  showFilters = true,
  defaultViewMode = 'grid'
}: EnhancedGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultViewMode);
  const [expandedDivisions, setExpandedDivisions] = useState<Set<string>>(new Set());
  const [previewItem, setPreviewItem] = useState<Gallery | null>(null);

  const { data: galleryItems = [], isLoading } = useQuery<Gallery[]>({
    queryKey: ["/api/gallery"],
  });

  // Extract unique values for filters
  const { sectors, brands, categories } = useMemo(() => {
    const sectorsSet = new Set<string>();
    const brandsSet = new Set<string>();
    const categoriesSet = new Set<string>();
    
    galleryItems.forEach(item => {
      if (item.sector) sectorsSet.add(item.sector);
      if (item.brand) brandsSet.add(item.brand);
      if (item.category) categoriesSet.add(item.category);
    });
    
    return {
      sectors: Array.from(sectorsSet).sort(),
      brands: Array.from(brandsSet).sort(),
      categories: Array.from(categoriesSet).sort()
    };
  }, [galleryItems]);

  // Filter and search gallery items
  const filteredItems = useMemo(() => {
    return galleryItems.filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSector = selectedSector === 'all' || item.sector === selectedSector;
      const matchesBrand = selectedBrand === 'all' || item.brand === selectedBrand;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      return matchesSearch && matchesSector && matchesBrand && matchesCategory;
    });
  }, [galleryItems, searchQuery, selectedSector, selectedBrand, selectedCategory]);

  // Group items by division/sector
  const groupedItems = useMemo(() => {
    const groups: Record<string, Gallery[]> = {};
    
    filteredItems.forEach(item => {
      const divisionKey = item.division || item.sector || 'Uncategorized';
      if (!groups[divisionKey]) {
        groups[divisionKey] = [];
      }
      groups[divisionKey].push(item);
    });
    
    return groups;
  }, [filteredItems]);

  const toggleDivision = (division: string) => {
    setExpandedDivisions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(division)) {
        newSet.delete(division);
      } else {
        newSet.add(division);
      }
      return newSet;
    });
  };

  const toggleAllDivisions = () => {
    if (expandedDivisions.size === Object.keys(groupedItems).length) {
      setExpandedDivisions(new Set());
    } else {
      setExpandedDivisions(new Set(Object.keys(groupedItems)));
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSector("all");
    setSelectedBrand("all");
    setSelectedCategory("all");
  };

  const activeFilterCount = [selectedSector, selectedBrand, selectedCategory].filter(f => f !== 'all').length + (searchQuery ? 1 : 0);

  return (
    <div className="space-y-6" data-testid="enhanced-gallery">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-muted-foreground mt-1">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} • {Object.keys(groupedItems).length} {Object.keys(groupedItems).length === 1 ? 'division' : 'divisions'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            data-testid="button-grid-view"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            data-testid="button-list-view"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAllDivisions}
            data-testid="button-toggle-all"
          >
            {expandedDivisions.size === Object.keys(groupedItems).length ? 'Collapse All' : 'Expand All'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="bg-gradient-to-br from-orange-400/5 to-yellow-500/5 border-orange-400/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search gallery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger data-testid="select-sector-filter">
                  <SelectValue placeholder="All Sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors ({galleryItems.length})</SelectItem>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>
                      {sector} ({galleryItems.filter(i => i.sector === sector).length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger data-testid="select-brand-filter">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>
                      {brand} ({galleryItems.filter(i => i.brand === brand).length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="select-category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category} ({galleryItems.filter(i => i.category === category).length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {activeFilterCount > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-muted-foreground">
                    {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Gallery Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-muted"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">No items found</h4>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            {activeFilterCount > 0 && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([division, items]) => (
              <DivisionGroup
                key={division}
                division={division}
                items={items}
                isExpanded={expandedDivisions.has(division)}
                onToggle={() => toggleDivision(division)}
                onItemClick={setPreviewItem}
                viewMode={viewMode}
              />
            ))}
        </div>
      )}

      {/* Preview Modal */}
      <PreviewModal 
        item={previewItem}
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
}
