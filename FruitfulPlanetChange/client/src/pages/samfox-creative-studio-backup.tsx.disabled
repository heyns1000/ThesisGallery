import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
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
  Globe,
  Code,
  Layers,
  Database,
  Activity,
  BarChart3,
  Users,
  Settings,
  Shield,
  Zap,
  TrendingUp,
  DollarSign,
  FileText,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Monitor,
  ShoppingCart,
  CreditCard,
  PrinterIcon,
  Building,
  GitBranch,
  Plus,
  Edit,
  Trash2,
  Search,
  Home,
  TreePine,
  History
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import Madiba artwork, UFC Champion image, and Sam Fox authentic branding
import MadibaMockPath from '@/assets/Madiba_mock.png';
import UFCChampionImage from '@assets/3_1753260859823.png';
import SamFoxLogo from '@assets/Sam_fox_logo_v02_1753261659048.jpg';
import SamFoxLinkedInHeader from '@assets/Linkedin_header_1753261659049.png';

// Import all 20 Sam Fox design assets for commercial gallery
import RabbitSketch from '@assets/360_F_484003012_cZQBESXIS3Yr7KAL03iR9VxDTACrEGGs_1753263181129.jpg';
import WolfDesign from '@assets/Wolf_01_1753263376699.png';
import VoetsekDesign from '@assets/Voetsek_1753263376699.png';
import ToadColor from '@assets/toad_color_1753263376700.png';
import PumasOne from '@assets/pumas_01_1753263376700.jpg';
import PumasTwo from '@assets/pumas_02_1753263376700.jpg';
import SambreelDesign from '@assets/sambreel_01_1753263376701.png';
import SheepCone from '@assets/sheep_cone_1753263376701.png';
import OOGDesign from '@assets/OOG_1753263376701.png';
import NikonDesign from '@assets/Nikon_1753263376703.png';
import MonsterDesign from '@assets/Monster_01_1753263376704.png';
import InLoveColor from '@assets/in_love_color_1753263376704.png';
import EyesDesign from '@assets/eyes_01_1753263376705.png';
import DreamBigDesign from '@assets/dream_big_01_1753263376706.png';
import FirstEyeDesign from '@assets/1st_eye_1753263376706.png';
import ChiefDesign from '@assets/Chief_02_1753263376705.png';
import DripDesign from '@assets/Drip_1753263376705.png';

// Additional Sam Fox Artwork Images  
import LinkedinHeader from '@assets/Linkedin_header_1753261659049.png';

// Import PayPal Button component
import PayPalButton from '@/components/PayPalButton';
import HeritagePortal from '@/components/HeritagePortal';

// Database Schema successfully removed from SamFox - now exists only in proper database settings

// Sam Fox Design Gallery Data - All 20 Commercial Prints
const designGallery = [
  { id: 1, title: "Rabbit Sketch", image: RabbitSketch, price: 12.99, category: "Minimalist", description: "Clean line art rabbit design" },
  { id: 2, title: "Wolf Monster", image: WolfDesign, price: 15.99, category: "Character Art", description: "Bold wolf character with vibrant colors" },
  { id: 3, title: "Voetsek Hand", image: VoetsekDesign, price: 14.99, category: "Typography", description: "Iconic South African expression art" },
  { id: 4, title: "Toad Creature", image: ToadColor, price: 13.99, category: "Character Art", description: "Whimsical toad character design" },
  { id: 5, title: "Puma Cat (Pink)", image: PumasOne, price: 16.99, category: "Animal Art", description: "Stylized cat with geometric patterns" },
  { id: 6, title: "Space Cat", image: PumasTwo, price: 16.99, category: "Sci-Fi", description: "Cat astronaut adventure design" },
  { id: 7, title: "Sambreel Umbrella", image: SambreelDesign, price: 15.49, category: "Character Art", description: "Cute character with patterned umbrella" },
  { id: 8, title: "Sheep Ice Cream", image: SheepCone, price: 14.49, category: "Food Art", description: "Adorable sheep ice cream cone" },
  { id: 9, title: "OOG Eye Rabbit", image: OOGDesign, price: 13.49, category: "Surreal", description: "Surreal rabbit with prominent eye" },
  { id: 10, title: "Nikon Camera Person", image: NikonDesign, price: 17.99, category: "Photography", description: "Photographer with camera gear" },
  { id: 11, title: "MANDARK Monster", image: MonsterDesign, price: 18.99, category: "Typography", description: "Bold monster character with text" },
  { id: 12, title: "In Love Character", image: InLoveColor, price: 15.99, category: "Romance", description: "Romantic character design" },
  { id: 13, title: "Eyes Pattern", image: EyesDesign, price: 12.49, category: "Abstract", description: "Multiple eyes artistic pattern" },
  { id: 14, title: "Dream Big", image: DreamBigDesign, price: 16.49, category: "Motivational", description: "Inspirational dream big artwork" },
  { id: 15, title: "First Eye", image: FirstEyeDesign, price: 13.99, category: "Spiritual", description: "Third eye spiritual design" },
  { id: 16, title: "Chief Portrait", image: ChiefDesign, price: 19.99, category: "Portrait", description: "Detailed chief character portrait" },
  { id: 17, title: "Drip Style", image: DripDesign, price: 17.49, category: "Street Art", description: "Urban drip style artwork" },
  { id: 18, title: "Professional Screenshot", image: RabbitSketch, price: 16.99, category: "Professional", description: "High-quality professional design screenshot" },
  { id: 19, title: "Sam Fox Logo", image: SamFoxLogo, price: 24.99, category: "Branding", description: "Official Sam Fox Creative Studio logo" },
  { id: 20, title: "LinkedIn Header", image: LinkedinHeader, price: 18.99, category: "Professional", description: "Professional LinkedIn header design" }
];

// VIP Dashboard Component with Complete Portal Functionality
function VipDashboardComponent() {
  // Real-time data from the actual portal APIs
  const { data: brands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ["/api/brands/"],
    refetchInterval: 10000,
  });

  const { data: sectors = [] } = useQuery({
    queryKey: ["/api/sectors"],
    refetchInterval: 10000,
  });

  const { data: systemStatus = [] } = useQuery({
    queryKey: ["/api/system-status"],
    refetchInterval: 5000,
  });

  const { data: dashboardStats = {} } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000,
  });

  const { data: legalDocuments = [] } = useQuery({
    queryKey: ["/api/legal-documents"],
    refetchInterval: 15000,
  });

  // Dashboard metrics calculated from real data
  const connectedServices = systemStatus.filter(s => s.status === 'online').length;
  const totalServices = systemStatus.length;
  const connectionStatus = connectedServices === totalServices ? 'connected' : 'partial';

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
          <Monitor className="w-8 h-8 text-blue-500" />
          VIP Complete Dashboard Portal
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
          Complete Seedwave Brand Management Portal integrated directly into SamFox Creative Studio. 
          Real-time data, comprehensive analytics, and full portal functionality at your fingertips.
        </p>
      </div>

      {/* Real-time Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Database className="w-8 h-8 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">{dashboardStats.totalElements || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Brands</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
                <div className="text-2xl font-bold">{sectors.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Active Sectors</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-8 h-8 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">{legalDocuments.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Legal Documents</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {connectionStatus === 'connected' ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  )}
                </div>
                <div className="text-2xl font-bold">{connectedServices}/{totalServices}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Services Online</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Database Integration Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Brands Database</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{brands.length} records</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Sectors Database</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{sectors.length} records</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Legal Documents</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{legalDocuments.length} records</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>System Status</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{systemStatus.length} services</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="h-auto p-3">
                  <div className="text-center">
                    <BarChart3 className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs">Analytics</div>
                  </div>
                </Button>
                
                <Button variant="outline" size="sm" className="h-auto p-3">
                  <div className="text-center">
                    <Users className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs">User Mgmt</div>
                  </div>
                </Button>
                
                <Button variant="outline" size="sm" className="h-auto p-3">
                  <div className="text-center">
                    <FileText className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs">Documents</div>
                  </div>
                </Button>
                
                <Button variant="outline" size="sm" className="h-auto p-3">
                  <div className="text-center">
                    <Settings className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs">Settings</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sector Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Sector Brand Distribution
              </CardTitle>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Database className="w-3 h-3 mr-1" />
                {sectors.length} Sectors
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {brandsLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading sector data...</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sectors.map((sector: any) => {
                  const sectorBrands = brands.filter((brand: any) => brand.sectorId === sector.id);
                  const brandCount = sectorBrands.length;
                  return (
                    <div key={sector.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {sector.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={brandCount > 100 ? 'default' : brandCount > 50 ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {brandCount} brands
                        </Badge>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (brandCount / Math.max(...sectors.map((s: any) => brands.filter((b: any) => b.sectorId === s.id).length))) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Live Brand Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Live Brand Data
              </CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="w-3 h-3 mr-1" />
                Live ({brands.length} brands)
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {brandsLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading live data...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 pb-2 border-b">
                  <div>Brand Name</div>
                  <div>Sector</div>
                  <div>Status</div>
                  <div>Integration</div>
                </div>
                
                {brands.slice(0, 8).map((brand: any, index: number) => (
                  <div key={brand.id} className="grid grid-cols-4 gap-4 text-sm py-2 border-b border-gray-100 dark:border-gray-800">
                    <div className="font-medium">{brand.name}</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {sectors.find((s: any) => s.id === brand.sectorId)?.name || 'Unknown'}
                    </div>
                    <div>
                      <Badge 
                        variant={brand.status === 'active' ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
                        {brand.status || 'active'}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">{brand.integration || 'seedwave'}</div>
                  </div>
                ))}
                
                {brands.length > 8 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" size="sm">
                      View All {brands.length} Brands
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Complete Portal Synchronization Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Complete Seedwave Portal Sync Active</h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                VIP Dashboard shows live data from the complete Seedwave Brand Management Portal. 
                All {brands.length} brands across {sectors.length} sectors are synchronized in real-time.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">{brands.length}</div>
                <div className="text-sm text-gray-500">Total Brands</div>
                <div className="text-xs text-emerald-600 mt-1">✓ Live Data</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{sectors.length}</div>
                <div className="text-sm text-gray-500">Active Sectors</div>
                <div className="text-xs text-blue-600 mt-1">✓ Connected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{connectedServices}</div>
                <div className="text-sm text-gray-500">Services Online</div>
                <div className="text-xs text-purple-600 mt-1">✓ Operational</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{legalDocuments.length}</div>
                <div className="text-sm text-gray-500">Legal Documents</div>
                <div className="text-xs text-orange-600 mt-1">✓ Secure</div>
              </div>
            </div>

            {/* Real-time System Health Monitoring */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Brand Database</div>
                    <div className="text-xs text-gray-500">{brands.length} records</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">connected</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Sectors Database</div>
                    <div className="text-xs text-gray-500">{sectors.length} records</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">connected</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Legal Documents</div>
                    <div className="text-xs text-gray-500">{legalDocuments.length} records</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">connected</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">System Services</div>
                    <div className="text-xs text-gray-500">{systemStatus.length} services</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">connected</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                All Portal Features Active in SamFox VIP Dashboard
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function SamFoxCreativeStudio() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("designs");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPaymentDesign, setSelectedPaymentDesign] = useState(null);
  const [newFamilyMember, setNewFamilyMember] = useState({
    name: '',
    relationship: '',
    birthDate: '',
    location: ''
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    description: '',
    type: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const artworkGallery = [
    {
      id: 'madiba-portrait',
      title: 'Madiba Portrait Collection',
      description: 'Beautiful artistic interpretation featuring warm coral tones and intricate details',
      image: MadibaMockPath,
      category: 'Portrait Art',
      medium: 'Digital Illustration',
      dimensions: '841 x 1189 px',
      style: 'Contemporary Portrait',
      colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3']
    },
    {
      id: 'ufc-champion',
      title: 'UFC World Champion - Sweet Victory',
      description: 'Dynamic illustration celebrating championship success with bold typography and athletic power',
      image: UFCChampionImage,
      category: 'Sports Art',
      medium: 'Digital Illustration',
      dimensions: '1200 x 900 px',
      style: 'Sports Victory Art',
      colors: ['#2D5A5A', '#FFD700', '#FFFFFF', '#FF6B35']
    }
  ];

  const completeHtmlDesigns = [
    {
      id: 'looppay-portal',
      title: 'LoopPay™ Sovereign Payment & SSO Portal',
      description: 'Complete payment processing system with multi-language support and currency conversion',
      htmlContent: `Complete HTML design with PayPal SDK integration, multi-language support (English, Afrikaans, isiZulu, isiXhosa), currency converter, AI assistant, theme switching, and comprehensive payment licensing system.`,
      features: [
        'PayPal SDK Integration',
        'Multi-Language Support (4 languages)',
        'Real-time Currency Converter',
        'AI Assistant with Gemini API',
        'Dark/Light Theme Switching',
        'LoopPay™ Core License ($6,500)',
        'LoopPay™ Pro Grid ($230/month)',
        'Decentralized Payout Mesh',
        'Immutable Scroll Contracts',
        'Regional Compliance System'
      ],
      category: 'Payment Portal',
      complexity: 'Enterprise',
      technologies: ['PayPal API', 'Exchange Rate API', 'Gemini AI', 'TailwindCSS', 'Responsive Design'],
      pricing: {
        coreLicense: '$6,500 USD',
        proGrid: '$230 USD/month'
      }
    },
    {
      id: 'faa-brand-control',
      title: 'FAA™ Brand Control Center',
      description: 'Complete brand management dashboard with sidebar navigation and comprehensive brand deployment system',
      htmlContent: `Advanced dashboard with sidebar navigation, brand deployment tools, license management, GitHub integration, and comprehensive brand building capabilities.`,
      features: [
        'Sidebar Navigation Dashboard',
        'Rapid Deploy Brands System',
        'Deploy Vault with GitHub Sync',
        'Brand Builder & Customizer',
        'License Management Portal',
        'Interstellar Operations',
        'Quantum Brands Management',
        'Meta-Economy Integration',
        'Real-time System Status',
        'Active Scrolls Monitoring (7,038 deployments)',
        'Client Engagement Analytics',
        'Royalty & Yield Tracking (R50M+ payouts)'
      ],
      category: 'Brand Management',
      complexity: 'Enterprise',
      technologies: ['Dashboard UI', 'GitHub Integration', 'File Upload', 'Real-time Monitoring'],
      brands: [
        'CodeNest™ ($3,200 license, 6% royalty)',
        'PayLine™ ($4,100 license, 9% royalty)', 
        'HotStack™ ($3,600 license, 7% royalty)',
        'QuickClaim™ ($2,800 license, 6% royalty)',
        'FirstMover™ ($5,900 license, 12% royalty)'
      ]
    },
    {
      id: 'fruitful-sponsorship',
      title: 'Fruitful Crate Dance Showcase - Sponsorship Platform',
      description: 'Advanced sponsorship management system with interactive charts, currency conversion and multi-tier sponsorship packages',
      htmlContent: `Comprehensive sponsorship platform with dynamic tier cards, Chart.js integration, Spotify embed, currency converter, and multi-language support.`,
      features: [
        'Dynamic Sponsorship Tiers',
        'Chart.js Impact Visualization',
        'Spotify Music Integration',
        'Global Currency Converter',
        'Multi-Language Support',
        'Dark/Light Theme Switching',
        'PayPal Integration',
        'Responsive Tier Cards',
        'Investment vs Meals Chart',
        'Real-time Exchange Rates',
        'Custom Badge System',
        'Professional Footer Links'
      ],
      category: 'Sponsorship Platform',
      complexity: 'Enterprise',
      technologies: ['Chart.js', 'Spotify API', 'Currency API', 'PayPal Integration', 'Multi-language'],
      sponsorshipTiers: [
        'Community Champion',
        'Rising Star Sponsor', 
        'Cultural Ambassador',
        'Platinum Partner'
      ]
    }
  ];

  const dashboardTemplates = [
    {
      id: 'south-africa-dashboard',
      title: 'Fruitful™ South Africa Dashboard',
      description: 'Comprehensive South African brands and products dashboard with ZAR integration',
      preview: '/api/templates/samfox/south-africa-dashboard',
      features: ['ZAR Currency', 'SA Brand Management', 'Local Integration', 'RSA Flag Branding'],
      category: 'Regional Dashboard',
      complexity: 'Advanced'
    },
    {
      id: 'global-dashboard',
      title: 'Fruitful™ Global Dashboard',
      description: 'Comprehensive multi-canvas dashboard with elegant dark theme',
      preview: '/api/templates/samfox/global-dashboard',
      features: ['Dark Theme', 'Multi-Canvas Layout', 'Real-time Analytics', 'Interactive Charts'],
      category: 'Dashboard',
      complexity: 'Advanced'
    },
    {
      id: 'sector-index',
      title: 'Global Sector Index',
      description: 'Beautiful sector navigation with sophisticated styling',
      preview: '/api/templates/samfox/sector-index',
      features: ['Sector Navigation', 'Clean Layout', 'Responsive Design', 'Professional Styling'],
      category: 'Navigation',
      complexity: 'Intermediate'
    },
    {
      id: 'payment-portal',
      title: 'Fruitful Payment Portal',
      description: 'Elegant payment processing interface with PayPal integration',
      preview: '/api/templates/samfox/payment-portal',
      features: ['PayPal Integration', 'Secure Processing', 'Clean UI', 'Mobile Responsive'],
      category: 'E-commerce',
      complexity: 'Advanced'
    },
    {
      id: 'heritage-portal',
      title: 'Ancestortag Heritage Portal',
      description: 'Thoughtful heritage and ancestry exploration interface',
      preview: '/api/templates/samfox/heritage-portal',
      features: ['Heritage Theme', 'Genealogy Support', 'Cultural Elements', 'Family Trees'],
      category: 'Cultural',
      complexity: 'Intermediate'
    }
  ];

  const designAssets = [
    {
      id: 'color-palettes',
      title: 'SamFox Color Palettes',
      description: 'Curated color schemes with pastel and vibrant combinations',
      count: 15,
      type: 'Color System'
    },
    {
      id: 'component-library',
      title: 'UI Component Library',
      description: 'Reusable interface components with consistent styling',
      count: 28,
      type: 'Components'
    },
    {
      id: 'layout-templates',
      title: 'Layout Templates',
      description: 'Professional page layouts for various use cases',
      count: 12,
      type: 'Templates'
    }
  ];

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
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={SamFoxLogo} 
                  alt="Sam Fox Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                SamFox Creative Studio
              </h1>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Authentic Sam Fox creative work featuring beautiful artwork, sports celebration illustrations, elegant dashboard designs, and professional templates crafted with love and artistic vision
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <Badge variant="outline" className="px-4 py-2 bg-white/80 dark:bg-gray-800/80">
                <Brush className="w-4 h-4 mr-2" />
                Digital Artist
              </Badge>
              <Badge variant="outline" className="px-4 py-2 bg-white/80 dark:bg-gray-800/80">
                <Layout className="w-4 h-4 mr-2" />
                UI/UX Designer
              </Badge>
              <Badge variant="outline" className="px-4 py-2 bg-white/80 dark:bg-gray-800/80">
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
          <TabsList className="grid w-full grid-cols-8 lg:w-[1200px] mx-auto">
            <TabsTrigger value="artwork" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Artwork Gallery
            </TabsTrigger>
            <TabsTrigger value="html-designs" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Complete HTML
            </TabsTrigger>
            <TabsTrigger value="vip-dashboard" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              VIP Dashboard
            </TabsTrigger>
            <TabsTrigger value="south-africa" className="flex items-center gap-2">
              🇿🇦
              South Africa
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Dashboard Templates
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Design Assets
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Design Gallery
            </TabsTrigger>
            <TabsTrigger value="heritage" className="flex items-center gap-2">
              👤
              AncestorTag™
            </TabsTrigger>

          </TabsList>

          {/* Artwork Gallery */}
          <TabsContent value="artwork" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Artwork Gallery</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Featuring the beautiful Madiba portrait, UFC World Champion celebration artwork, and other artistic creations
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {artworkGallery.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative">
                      <img 
                        src={artwork.image} 
                        alt={artwork.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="font-semibold mb-1">{artwork.title}</h3>
                        <p className="text-sm text-gray-200">{artwork.medium}</p>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{artwork.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            {artwork.description}
                          </p>
                        </div>
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{artwork.category}</Badge>
                          <Badge variant="outline">{artwork.style}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {artwork.colors.map((color, i) => (
                            <div 
                              key={i}
                              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
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

          {/* Complete HTML Designs */}
          <TabsContent value="html-designs" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <Code className="w-8 h-8" />
                Complete HTML Design Systems
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Three comprehensive HTML design systems featuring advanced functionality, complete styling, and enterprise-grade features
              </p>
            </div>

            <div className="space-y-8">
              {completeHtmlDesigns.map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl flex items-center gap-3 mb-2">
                            {design.id === 'looppay-portal' && '💳'}
                            {design.id === 'faa-brand-control' && '🏢'}
                            {design.id === 'fruitful-sponsorship' && '🎵'}
                            {design.title}
                          </CardTitle>
                          <CardDescription className="text-lg">
                            {design.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-none">
                          {design.complexity}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 text-lg">System Overview</h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {design.htmlContent}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold mb-3">Core Features</h4>
                          <div className="space-y-2">
                            {design.features.slice(0, 6).map((feature, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                            {design.features.length > 6 && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                +{design.features.length - 6} more features...
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Technologies Used</h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {design.technologies.map((tech, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>

                          {/* System-specific data */}
                          {design.pricing && (
                            <div className="mt-4">
                              <h5 className="font-medium mb-2">Pricing Structure</h5>
                              <div className="text-sm space-y-1">
                                <div>Core License: <span className="font-mono text-emerald-600">{design.pricing.coreLicense}</span></div>
                                <div>Pro Grid: <span className="font-mono text-blue-600">{design.pricing.proGrid}</span></div>
                              </div>
                            </div>
                          )}

                          {design.brands && (
                            <div className="mt-4">
                              <h5 className="font-medium mb-2">Rapid Deploy Brands</h5>
                              <div className="text-sm space-y-1">
                                {design.brands.slice(0, 3).map((brand, i) => (
                                  <div key={i} className="text-xs">{brand}</div>
                                ))}
                                <div className="text-xs text-gray-500">+{design.brands.length - 3} more brands</div>
                              </div>
                            </div>
                          )}

                          {design.sponsorshipTiers && (
                            <div className="mt-4">
                              <h5 className="font-medium mb-2">Sponsorship Tiers</h5>
                              <div className="text-sm space-y-1">
                                {design.sponsorshipTiers.map((tier, i) => (
                                  <div key={i} className="text-xs">• {tier}</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button className="flex-1" onClick={() => setSelectedTemplate(design.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Complete System
                        </Button>
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download HTML
                        </Button>
                        <Button variant="outline">
                          <Code className="w-4 h-4 mr-2" />
                          View Source
                        </Button>
                      </div>

                      {/* Expanded view for selected template */}
                      {selectedTemplate === design.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                        >
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <h5 className="font-semibold mb-3">Complete Feature Set</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {design.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="mt-3"
                              onClick={() => setSelectedTemplate(null)}
                            >
                              Collapse Details
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Integration Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Complete HTML Design System Portfolio</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
                    These three comprehensive HTML design systems demonstrate advanced functionality including 
                    payment processing, brand management, sponsorship platforms, multi-language support, 
                    currency conversion, AI integration, and enterprise-grade features.
                  </p>
                  <div className="flex items-center justify-center gap-8 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">3</div>
                      <div className="text-gray-500">Complete Systems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">35+</div>
                      <div className="text-gray-500">Total Features</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">15+</div>
                      <div className="text-gray-500">Integrations</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* VIP Dashboard - Complete Portal Integration */}
          <TabsContent value="vip-dashboard" className="space-y-6">
            <VipDashboardComponent />
          </TabsContent>

          {/* South Africa Dashboard */}
          <TabsContent value="south-africa" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                🇿🇦 South Africa Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Comprehensive South African brands and products management with ZAR integration and local market focus
              </p>
            </div>

            {/* South African Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {[
                {
                  name: 'LoopPay™',
                  description: 'Construction-grade payout loop for RSA-based contractor networks',
                  price: 'R1,380 master license',
                  monthly: 'R92/month',
                  category: 'FinTech',
                  emoji: '💳',
                  features: ['PulseTrade™', 'ClaimRoot™', 'DivLock™']
                },
                {
                  name: 'SteelFlow™',
                  description: 'Mining operations management for Steelpoort region',
                  price: 'R2,100 master license',
                  monthly: 'R150/month',
                  category: 'Mining',
                  emoji: '⛏️',
                  features: ['Mining Operations', 'Safety Protocols', 'Resource Tracking']
                },
                {
                  name: 'AgriLink™',
                  description: 'Agricultural supply chain management for SA farmers',
                  price: 'R1,850 master license',
                  monthly: 'R125/month',
                  category: 'Agriculture',
                  emoji: '🌾',
                  features: ['Farm Management', 'Supply Chain', 'Weather Integration']
                },
                {
                  name: 'TaxiFlow™',
                  description: 'Minibus taxi fleet management system',
                  price: 'R950 master license',
                  monthly: 'R75/month',
                  category: 'Transport',
                  emoji: '🚐',
                  features: ['Route Optimization', 'Driver Management', 'Payment Processing']
                },
                {
                  name: 'RetailZAR™',
                  description: 'Point-of-sale system with ZAR integration',
                  price: 'R1,200 master license',
                  monthly: 'R85/month',
                  category: 'Retail',
                  emoji: '🛒',
                  features: ['POS System', 'Inventory', 'ZAR Processing']
                },
                {
                  name: 'EduSA™',
                  description: 'Educational management for South African schools',
                  price: 'R1,650 master license',
                  monthly: 'R110/month',
                  category: 'Education',
                  emoji: '🎓',
                  features: ['Student Management', 'Curriculum', 'Parent Portal']
                }
              ].map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 group border-orange-200 dark:border-orange-800">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{product.emoji}</span>
                          <div>
                            <h3 className="font-semibold text-lg text-orange-600 dark:text-orange-400">
                              {product.name}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-orange-600 dark:text-orange-400 font-mono">
                          ZAR
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {product.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Master License:</span>
                          <span className="font-semibold">{product.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Monthly:</span>
                          <span className="font-semibold">{product.monthly}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {product.features.map((feature, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* South African Dashboard Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-yellow-500/10 border-orange-500/20">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                      🇿🇦 South African Market Dashboard Features
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Specialized tools and integrations for the South African market
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white text-xl">R</span>
                      </div>
                      <h4 className="font-semibold mb-2">ZAR Integration</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Native South African Rand support
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white text-xl">🏪</span>
                      </div>
                      <h4 className="font-semibold mb-2">Local Markets</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Cape Town, Johannesburg, Durban
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white text-xl">📊</span>
                      </div>
                      <h4 className="font-semibold mb-2">RSA Analytics</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        South African market insights
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white text-xl">🤝</span>
                      </div>
                      <h4 className="font-semibold mb-2">Local Partners</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        RSA-based business networks
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Dashboard Templates */}
          <TabsContent value="templates" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Dashboard Templates</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Professional dashboard designs with elegant styling and sophisticated functionality
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dashboardTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">{template.title}</CardTitle>
                          <CardDescription className="text-base">
                            {template.description}
                          </CardDescription>
                        </div>
                        <Badge variant={template.complexity === 'Advanced' ? 'default' : 'secondary'}>
                          {template.complexity}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Features:</p>
                          <div className="flex flex-wrap gap-2">
                            {template.features.map((feature, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview Template
                          </Button>
                          <Button size="sm" variant="outline">
                            <Code className="w-4 h-4 mr-2" />
                            View Code
                          </Button>
                          <Button size="sm" variant="outline">
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

          {/* Design Assets */}
          <TabsContent value="assets" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Design Assets</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Reusable design components, color palettes, and styling resources
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {designAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="text-center hover:shadow-lg transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Layers className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2">{asset.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {asset.description}
                      </p>
                      
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <Badge variant="secondary">{asset.count} items</Badge>
                        <Badge variant="outline">{asset.type}</Badge>
                      </div>
                      
                      <Button size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Pack
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Portfolio */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Creative Portfolio</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                A showcase of artistic vision, sports celebration artwork, technical expertise, and creative excellence
              </p>

              {/* Sam Fox Profile Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-8"
              >
                <Card className="overflow-hidden max-w-4xl mx-auto">
                  <div className="h-32 relative">
                    <img 
                      src={SamFoxLinkedInHeader} 
                      alt="Sam Fox LinkedIn Header"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                  <CardContent className="p-6 -mt-8 relative">
                    <div className="flex items-start gap-6">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                        <img 
                          src={SamFoxLogo} 
                          alt="Sam Fox Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 pt-4">
                        <h3 className="text-2xl font-bold mb-2">Sam Fox</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Creative Director & Digital Artist specializing in brand identity, illustration, and digital design
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="bg-teal-100 text-teal-700">Creative Director</Badge>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Digital Artist</Badge>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">Brand Designer</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* UFC Champion Feature Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <Card className="overflow-hidden bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-emerald-500/20">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="relative">
                      <img 
                        src={UFCChampionImage}
                        alt="UFC World Champion - Sweet Victory"
                        className="w-full h-full object-cover min-h-[400px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-transparent" />
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <Badge className="w-fit mb-4 bg-emerald-600 hover:bg-emerald-700">
                        Featured Sports Art
                      </Badge>
                      <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        UFC World Champion - Sweet Victory
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                        A powerful celebration of athletic achievement featuring bold typography and dynamic design. 
                        This artwork captures the essence of championship victory with striking visual elements including 
                        "HULLE WEET NOU" and "WAT ONS WEET" proclamations, showcasing the triumph of a UFC World Champion.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">Sports Victory Art</Badge>
                          <Badge variant="outline">Digital Illustration</Badge>
                          <Badge variant="outline">Championship Theme</Badge>
                        </div>
                        <div className="flex gap-3">
                          <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <Eye className="w-4 h-4 mr-2" />
                            View Full Artwork
                          </Button>
                          <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download Print
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-4">About SamFox Studio</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    SamFox Creative Studio represents the intersection of artistic vision and technical excellence. 
                    Specializing in digital art, sports celebration artwork, user interface design, and comprehensive dashboard solutions, 
                    the studio brings together creativity and functionality in every project.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    From the beautiful Madiba portrait showcasing artistic talent to the dynamic UFC Champion victory artwork 
                    and sophisticated dashboard templates demonstrating technical prowess, each creation reflects a commitment to quality 
                    and attention to detail.
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-3">Specializations</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Brush className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Digital Art</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layout className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">UI/UX Design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Sports Art</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Creative Direction</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={MadibaMockPath} 
                    alt="Featured Artwork - Madiba Portrait"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="text-xl font-bold mb-2">Featured: Madiba Portrait</h4>
                    <p className="text-sm text-gray-200">Digital illustration showcasing artistic mastery</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Commercial Design Gallery */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <ShoppingCart className="w-8 h-8" />
                Sam Fox Design Gallery
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Premium downloadable prints featuring 20 unique Sam Fox designs. High-quality digital artwork perfect for personal use, gifts, or commercial projects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {designGallery.map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative">
                      <img 
                        src={design.image} 
                        alt={design.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-emerald-500 text-white">
                          ${design.price}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-xs">{design.category}</p>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{design.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 h-10 overflow-hidden">
                        {design.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary">{design.category}</Badge>
                        <span className="font-bold text-lg text-emerald-600">${design.price}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <Button className="w-full" size="sm">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Buy & Download
                        </Button>
                        <div className="w-full">
                          <PayPalButton 
                            amount={design.price.toString()} 
                            currency="USD" 
                            intent="CAPTURE" 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Commercial License Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <PrinterIcon className="w-5 h-5 text-blue-500" />
                      Personal Use
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Print for personal projects, home decoration, gifts
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Download className="w-5 h-5 text-green-500" />
                      Digital Rights
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      High-resolution files, instant download, lifetime access
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Star className="w-5 h-5 text-purple-500" />
                      Quality Guarantee
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Professional artwork, 300 DPI, multiple formats
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Design Gallery Tab - 20 Commercial Artwork Pieces */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Sam Fox Design Gallery</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Professional artwork collection featuring 20 premium designs available for commercial licensing. 
                Each piece includes full commercial rights and instant digital download.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {designGallery.map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative">
                      <img 
                        src={design.image} 
                        alt={design.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-500 text-white">${design.price}</Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="font-semibold mb-1">{design.title}</h3>
                        <p className="text-xs text-gray-200">{design.category}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-sm">{design.title}</h3>
                          <p className="text-xs text-gray-500">{design.category}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" />
                          <Eye className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">${design.price}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                          {/* PayPal Button Integration */}
                          <div className="paypal-button-container">
                            <PayPalButton 
                              amount={design.price.toString()} 
                              currency="USD" 
                              intent="sale"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Commercial License Information */}
            <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Commercial License & Usage Rights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Commercial License Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <PrinterIcon className="w-5 h-5 text-blue-500" />
                        Personal Use
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Print for personal projects, home decoration, gifts
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Download className="w-5 h-5 text-green-500" />
                        Digital Rights
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        High-resolution files, instant download, lifetime access
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Star className="w-5 h-5 text-purple-500" />
                        Quality Guarantee
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Professional artwork, 300 DPI, multiple formats
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AncestorTag™ Heritage Portal - API Connected Component */}
          <TabsContent value="heritage" className="space-y-6">
            <HeritagePortal 
              newFamilyMember={newFamilyMember}
              setNewFamilyMember={setNewFamilyMember}
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              toast={toast}
              queryClient={queryClient}
            />
          </TabsContent>
              
              {/* Left Sidebar - Filters & Quick Stats */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-purple-600">Dashboard Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex justify-between">
                        <span>Total Tags:</span>
                        <span className="font-bold">127</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Unique Ancestors:</span>
                        <span className="font-bold">45</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Documents Tagged:</span>
                        <span className="font-bold">23</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Oral Histories:</span>
                        <span className="font-bold">12</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Rituals Tagged:</span>
                        <span className="font-bold">8</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-purple-600">Filter Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Filter by Ancestor Name..." 
                      className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                    />
                    <select className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                      <option value="">All Content Types</option>
                      <option value="Document">Document</option>
                      <option value="Oral History">Oral History</option>
                      <option value="Ritual Description">Ritual Description</option>
                      <option value="Artifact">Artifact</option>
                      <option value="Visual Record">Visual Record</option>
                    </select>
                    <Button variant="outline" className="w-full">Clear Filters</Button>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content - Ancestral Records */}
              <div className="lg:col-span-3">
                <h3 className="text-2xl font-bold mb-6 text-purple-600">Your Tagged Ancestral Records</h3>
                
                {/* Sample Ancestral Records */}
                <div className="space-y-6">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold">Grandmother's Wedding Dress</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Artifact • 1952</p>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">Cultural Artifact</Badge>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Beautiful handmade wedding dress worn by my grandmother Margaret on her wedding day in 1952. Features intricate lace work and pearl buttons.
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>👤 Margaret Johnson</span>
                        <span>📅 June 15, 1952</span>
                        <span>📍 Cape Town, South Africa</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold">Family Recipe Collection</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Document • 1940s</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Family Document</Badge>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Handwritten collection of traditional family recipes passed down through generations. Includes the famous bobotie recipe and koeksisters.
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>👤 Sarah van der Merwe</span>
                        <span>📅 1943</span>
                        <span>📍 Stellenbosch, South Africa</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold">War Stories from Oupa</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Oral History • 1980s</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Oral History</Badge>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Recorded stories from my grandfather about his experiences during World War II. These recordings capture his voice and memories for future generations.
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>👤 Johannes "Oupa" Smith</span>
                        <span>📅 1985</span>
                        <span>📍 Johannesburg, South Africa</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Family Hub Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6 text-center">Family Hub: Connect & Cherish 👨‍👩‍👧‍👦</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
                A central space for all your family's needs: from tracking lineage and managing finances to celebrating milestones.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">🌳</div>
                    <h3 className="text-xl font-bold mb-4">Family Tree</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Visualize and manage your family's atom-level lineage.
                    </p>
                    <Button className="w-full">Go to Family Tree</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">💰</div>
                    <h3 className="text-xl font-bold mb-4">Financial Hub</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Manage family savings, personal wallets, and emergency funds.
                    </p>
                    <Button className="w-full">Go to Financial Hub</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">🎁</div>
                    <h3 className="text-xl font-bold mb-4">Gift Lists</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Keep track of Christmas and Birthday gift ideas for every family member.
                    </p>
                    <Button className="w-full">Go to Gift Lists</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">🗓️</div>
                    <h3 className="text-xl font-bold mb-4">Family Calendar</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Keep track of all important family events, birthdays, anniversaries, and travel plans.
                    </p>
                    <Button className="w-full">Go to Family Calendar</Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Family Tree Management */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Family Tree Management 🌳</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Family Member</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g., John Doe" 
                        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Relationship</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Father, Sister" 
                        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date of Birth</label>
                      <input 
                        type="date" 
                        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Current Location</label>
                      <input 
                        type="text" 
                        placeholder="e.g., London, UK" 
                        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Add Member</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Family Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="font-medium">Sarah Johnson</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Mother • Born: 1965 • Cape Town, SA</div>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="font-medium">Michael Johnson</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Father • Born: 1962 • Johannesburg, SA</div>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="font-medium">Margaret Smith</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Grandmother • Born: 1935 • Stellenbosch, SA</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Digital Provenance Features */}
            <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <Shield className="w-5 h-5" />
                  AncestorTag™ Digital Provenance
                </CardTitle>
                <CardDescription>
                  Blockchain-secured heritage preservation with irrefutable digital provenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <div className="text-3xl mb-3">🔗</div>
                    <h4 className="font-semibold mb-2">Blockchain Security</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Every family artifact and document is secured with blockchain technology for permanent preservation
                    </p>
                  </div>
                  <div className="text-center p-4 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <div className="text-3xl mb-3">🌍</div>
                    <h4 className="font-semibold mb-2">Global Heritage Network</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Connect with other families worldwide and discover shared ancestry through our heritage network
                    </p>
                  </div>
                  <div className="text-center p-4 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <div className="text-3xl mb-3">⏰</div>
                    <h4 className="font-semibold mb-2">Eternal Preservation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Your family legacy is preserved for future generations with atomic-level digital provenance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}