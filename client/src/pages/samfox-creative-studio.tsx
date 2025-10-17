import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Sparkles, 
  Download, 
  Eye, 
  Heart,
  Star,
  Brush,
  Image,
  Layout,
  TrendingUp,
  BarChart3,
  Layers,
  Monitor,
  ShoppingCart,
  Activity,
  Database,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SamFoxCreativeStudio() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);

  // Fetch artworks from backend API
  const { data: artworks = [], isLoading: artworksLoading } = useQuery({
    queryKey: ["/api/samfox-studio/artworks"],
  });

  // Fetch portfolio projects from backend API
  const { data: portfolioProjects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/samfox-studio/portfolio-projects"],
  });

  // Fetch categories from backend API
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/samfox-studio/categories"],
  });

  // Fetch studio stats from backend API
  const { data: stats = {} } = useQuery({
    queryKey: ["/api/samfox-studio/stats"],
  });

  // Fetch studio settings from backend API
  const { data: settings = {} } = useQuery({
    queryKey: ["/api/samfox-studio/settings"],
  });

  // Sample artwork gallery data (will be replaced with API data)
  const sampleArtworkGallery = [
    {
      id: 'madiba-portrait',
      title: 'Madiba Portrait Collection',
      description: 'Beautiful artistic interpretation featuring warm coral tones and intricate details',
      category: 'Portrait Art',
      medium: 'Digital Illustration',
      dimensions: '841 x 1189 px',
      style: 'Contemporary Portrait',
      colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3']
    },
    {
      id: 'ufc-champion',
      title: 'UFC World Champion - Sweet Victory',
      description: 'Dynamic illustration celebrating championship success with bold typography',
      category: 'Sports Art',
      medium: 'Digital Illustration',
      dimensions: '1200 x 900 px',
      style: 'Sports Victory Art',
      colors: ['#2D5A5A', '#FFD700', '#FFFFFF', '#FF6B35']
    }
  ];

  // Sample design gallery data
  const designGallery = [
    { id: 1, title: "Rabbit Sketch", price: 12.99, category: "Minimalist", description: "Clean line art rabbit design" },
    { id: 2, title: "Wolf Monster", price: 15.99, category: "Character Art", description: "Bold wolf character with vibrant colors" },
    { id: 3, title: "Voetsek Hand", price: 14.99, category: "Typography", description: "Iconic South African expression art" },
    { id: 4, title: "Toad Creature", price: 13.99, category: "Character Art", description: "Whimsical toad character design" },
    { id: 5, title: "Puma Cat", price: 16.99, category: "Animal Art", description: "Stylized cat with geometric patterns" },
    { id: 6, title: "Space Cat", price: 16.99, category: "Sci-Fi", description: "Cat astronaut adventure design" },
  ];

  // Filter artworks by category
  const filteredArtworks = selectedCategory === "all" 
    ? sampleArtworkGallery 
    : sampleArtworkGallery.filter(art => art.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 via-purple-400/20 to-pink-400/20 dark:from-rose-600/30 dark:via-purple-600/30 dark:to-pink-600/30" />
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Palette className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent" data-testid="heading-samfox-studio">
                SamFox Creative Studio
              </h1>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" data-testid={`star-rating-${i}`} />
                ))}
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto" data-testid="text-studio-description"
            >
              Creative portfolio featuring digital artwork, character design, brand identity, and professional templates
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <Badge variant="outline" className="px-4 py-2 bg-white/80 dark:bg-gray-800/80" data-testid="badge-digital-artist">
                <Brush className="w-4 h-4 mr-2" />
                Digital Artist
              </Badge>
              <Badge variant="outline" className="px-4 py-2 bg-white/80 dark:bg-gray-800/80" data-testid="badge-ui-designer">
                <Layout className="w-4 h-4 mr-2" />
                UI/UX Designer
              </Badge>
              <Badge variant="outline" className="px-4 py-2 bg-white/80 dark:bg-gray-800/80" data-testid="badge-creative-director">
                <Sparkles className="w-4 h-4 mr-2" />
                Creative Director
              </Badge>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="artwork" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 lg:w-[800px] mx-auto">
            <TabsTrigger value="artwork" className="flex items-center gap-2" data-testid="tab-artwork">
              <Image className="w-4 h-4" />
              Artwork
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2" data-testid="tab-portfolio">
              <Layers className="w-4 h-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2" data-testid="tab-gallery">
              <ShoppingCart className="w-4 h-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2" data-testid="tab-stats">
              <BarChart3 className="w-4 h-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2" data-testid="tab-dashboard">
              <Monitor className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          {/* Artwork Gallery */}
          <TabsContent value="artwork" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4" data-testid="heading-artwork-gallery">Artwork Gallery</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Collection of digital artwork, portraits, and creative illustrations
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
              <Button 
                variant={selectedCategory === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedCategory("all")}
                data-testid="button-category-all"
              >
                All Artwork
              </Button>
              <Button 
                variant={selectedCategory === "Portrait Art" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedCategory("Portrait Art")}
                data-testid="button-category-portrait"
              >
                Portrait Art
              </Button>
              <Button 
                variant={selectedCategory === "Sports Art" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedCategory("Sports Art")}
                data-testid="button-category-sports"
              >
                Sports Art
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group" data-testid={`card-artwork-${artwork.id}`}>
                    <div className="relative">
                      <div className="w-full h-64 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                        <div className="text-center p-8">
                          <div className="text-6xl mb-4">🎨</div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{artwork.title}</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="font-semibold mb-1">{artwork.title}</h3>
                        <p className="text-sm text-gray-200">{artwork.medium}</p>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2" data-testid={`title-${artwork.id}`}>{artwork.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            {artwork.description}
                          </p>
                        </div>
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" data-testid={`icon-heart-${artwork.id}`} />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" data-testid={`badge-category-${artwork.id}`}>{artwork.category}</Badge>
                          <Badge variant="outline" data-testid={`badge-style-${artwork.id}`}>{artwork.style}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {artwork.colors.map((color, i) => (
                            <div 
                              key={i}
                              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: color }}
                              data-testid={`color-${artwork.id}-${i}`}
                            />
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1" onClick={() => setSelectedArtwork(artwork)} data-testid={`button-view-${artwork.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" data-testid={`button-download-${artwork.id}`}>
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Portfolio Projects */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4" data-testid="heading-portfolio-projects">Portfolio Projects</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Featured projects and creative works from SamFox Studio
              </p>
            </div>

            {projectsLoading ? (
              <div className="flex items-center justify-center py-12" data-testid="loading-projects">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <span className="ml-3">Loading portfolio projects...</span>
              </div>
            ) : portfolioProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(portfolioProjects as any[]).map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow" data-testid={`card-project-${project.id}`}>
                      <CardHeader>
                        <CardTitle data-testid={`title-project-${project.id}`}>{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 mb-3">
                          {project.tags?.map((tag: string, i: number) => (
                            <Badge key={i} variant="outline" data-testid={`tag-${project.id}-${i}`}>{tag}</Badge>
                          ))}
                        </div>
                        <Button size="sm" className="w-full" data-testid={`button-view-project-${project.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Project
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12" data-testid="empty-projects">
                <p className="text-gray-500 dark:text-gray-400">No portfolio projects available yet.</p>
              </div>
            )}
          </TabsContent>

          {/* Design Gallery */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4" data-testid="heading-design-gallery">Design Gallery</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Commercial prints and digital artwork available for purchase
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designGallery.map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300" data-testid={`card-design-${design.id}`}>
                    <div className="aspect-square bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 flex items-center justify-center">
                      <div className="text-6xl">🎨</div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2" data-testid={`title-design-${design.id}`}>{design.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{design.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" data-testid={`badge-design-category-${design.id}`}>{design.category}</Badge>
                        <span className="text-lg font-bold text-green-600" data-testid={`price-design-${design.id}`}>${design.price}</span>
                      </div>
                      <Button size="sm" className="w-full" data-testid={`button-purchase-${design.id}`}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Purchase Print
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Stats Dashboard */}
          <TabsContent value="stats" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4" data-testid="heading-studio-stats">Studio Statistics</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Performance metrics and analytics for SamFox Creative Studio
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card data-testid="card-stat-artworks">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Image className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold mb-1" data-testid="stat-artworks-count">{(stats as any).totalArtworks || 0}</div>
                  <div className="text-sm text-gray-500">Total Artworks</div>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-projects">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Layers className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold mb-1" data-testid="stat-projects-count">{(stats as any).totalProjects || 0}</div>
                  <div className="text-sm text-gray-500">Portfolio Projects</div>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-sales">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold mb-1" data-testid="stat-sales-count">{(stats as any).totalSales || 0}</div>
                  <div className="text-sm text-gray-500">Total Sales</div>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-categories">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold mb-1" data-testid="stat-categories-count">{(categories as any[]).length || 0}</div>
                  <div className="text-sm text-gray-500">Categories</div>
                </CardContent>
              </Card>
            </div>

            {/* Studio Settings Overview */}
            <Card data-testid="card-studio-settings">
              <CardHeader>
                <CardTitle>Studio Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Studio Name</div>
                    <div className="text-gray-600 dark:text-gray-400" data-testid="text-studio-name">{(settings as any).studioName || 'SamFox Creative Studio'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Status</div>
                    <Badge variant="default" data-testid="badge-studio-status">{(settings as any).status || 'Active'}</Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Location</div>
                    <div className="text-gray-600 dark:text-gray-400" data-testid="text-studio-location">{(settings as any).location || 'South Africa'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Established</div>
                    <div className="text-gray-600 dark:text-gray-400" data-testid="text-studio-established">{(settings as any).established || '2024'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard Overview */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3" data-testid="heading-dashboard">
                <Monitor className="w-8 h-8 text-blue-500" />
                Creative Studio Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Complete overview of artworks, projects, and studio performance
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30" data-testid="card-dashboard-overview">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Database className="w-8 h-8 text-blue-500" />
                      </div>
                      <div className="text-2xl font-bold" data-testid="dashboard-artworks">{artworks.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Total Artworks</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Activity className="w-8 h-8 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold" data-testid="dashboard-projects">{portfolioProjects.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Active Projects</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <BarChart3 className="w-8 h-8 text-purple-500" />
                      </div>
                      <div className="text-2xl font-bold" data-testid="dashboard-categories">{categories.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Categories</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <Card data-testid="card-recent-activity">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {artworksLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span className="ml-2">Loading activity...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {artworks.length > 0 ? (
                      (artworks as any[]).slice(0, 5).map((artwork: any, index: number) => (
                        <div key={artwork.id || index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800" data-testid={`activity-item-${index}`}>
                          <div>
                            <div className="font-medium" data-testid={`activity-title-${index}`}>{artwork.title}</div>
                            <div className="text-sm text-gray-500">{artwork.category}</div>
                          </div>
                          <Badge variant="outline" data-testid={`activity-badge-${index}`}>{artwork.status || 'Active'}</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">No recent activity</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
