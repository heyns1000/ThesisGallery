import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, ShoppingCart, DollarSign, TrendingUp, Users, Package, Star, Filter, Search, Crown, Zap, Globe, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

// Original V1-10 Sector Structure from HTML examples
const sectorList = {
  "agriculture": "🌱 Agriculture & Biotech",
  "fsf": "🥦 Food, Soil & Farming", 
  "banking": "🏦 Banking & Finance",
  "creative": "🖋️ Creative Tech",
  "logistics": "📦 Logistics & Packaging",
  "education-ip": "📚 Education & IP",
  "fashion": "✂ Fashion & Identity",
  "gaming": "🎮 Gaming & Simulation",
  "health": "🧠 Health & Hygiene",
  "housing": "🏗️ Housing & Infrastructure",
  "justice": "⚖ Justice & Ethics",
  "knowledge": "📖 Knowledge & Archives",
  "micromesh": "☰ Micro-Mesh Logistics",
  "media": "🎬 Motion, Media & Sonic",
  "nutrition": "✿ Nutrition & Food Chain",
  "ai-logic": "🧠 AI, Logic & Grid",
  "packaging": "📦 Packaging & Materials",
  "quantum": "✴️ Quantum Protocols",
  "ritual": "☯ Ritual & Culture",
  "saas": "🔑 SaaS & Licensing",
  "trade": "🧺 Trade Systems",
  "utilities": "🔋 Utilities & Energy",
  "voice": "🎙️ Voice & Audio",
  "webless": "📡 Webless Tech & Nodes",
  "nft": "🔁 NFT & Ownership",
  "education-youth": "🎓 Education & Youth",
  "zerowaste": "♻️ Zero Waste",
  "professional": "🧾 Professional Services",
  "payroll-mining": "🪙 Payroll Mining & Accounting",
  "mining": "⛏️ Mining & Resources",
  "wildlife": "🦁 Wildlife & Habitat",
  "admin-panel": "⚙️ Admin Panel",
  "global-index": "🌐 Global Brand Index"
};

// Sample comprehensive brand data per sector (from original examples)
const sampleBrands = {
  agriculture: ['CropLink', 'SoilPulse', 'RootYield', 'AquaFarm', 'AgriMesh', 'GrowNode', 'GrainCast', 'SoilBank'],
  banking: ['FinGrid', 'TradeAmp', 'LoopPay', 'TaxNova', 'VaultMaster', 'Gridwise', 'CrateDance', 'CashGlyph'],
  logistics: ['CrateLogic', 'PackChain', 'SortFleet', 'RouteMesh', 'LogiStack', 'DeliveryX', 'CargoVault', 'PalletPath'],
  creative: ['MediaGrid', 'StudioPath', 'SoundReel', 'EditFrame', 'MotionKit', 'GhostTrace', 'TalentMap', 'SignalVerse'],
  saas: ['CloudLink', 'DataGrid', 'SyncCore', 'APIVault', 'CodeNest', 'DevStack', 'CloudFlow', 'DataSync']
};

// Licensing tiers from original structure  
const licensingTiers = {
  starter: { 
    name: 'Starter License', 
    price: 299,
    currency: 'R',
    features: ['Basic branding rights', 'Single domain', 'Email support', '1 Brand Package'] 
  },
  professional: { 
    name: 'Professional License', 
    price: 899,
    currency: 'R', 
    features: ['Full branding rights', 'Multiple domains', 'Priority support', 'API access', '5 Brand Packages'] 
  },
  enterprise: { 
    name: 'Enterprise License', 
    price: 2499,
    currency: 'R',
    features: ['Unlimited usage', 'White-label options', 'Dedicated support', 'Custom integrations', 'Unlimited Brand Packages', 'VaultMesh™ Integration'] 
  }
};

export function FruitfulMarketplace() {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<string>('grid');
  const [sortBy, setSortBy] = useState<string>('trending');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ZAR');

  // Calculate totals from original structure
  const totalSectors = Object.keys(sectorList).length;
  const totalBrands = 6005; // From original specification
  const totalNodes = 7038; // From original specification

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Enhanced Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center space-x-3"
            >
              <Crown className="h-12 w-12 text-yellow-300" />
              <h1 className="text-5xl font-bold tracking-tight">
                🌐 Global 💰 Packages by Fruitful™
              </h1>
              <Crown className="h-12 w-12 text-yellow-300" />
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-blue-100 max-w-3xl mx-auto"
            >
              VaultMesh™ Powered Brand Ecosystem • Comprehensive Licensing Solutions • Global Commerce Platform
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-6 text-sm"
            >
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-yellow-300" />
                <span>{totalBrands.toLocaleString()} Total Brands</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-300" />
                <span>{totalNodes.toLocaleString()} Active Nodes</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-yellow-300" />
                <span>{totalSectors} Sectors</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-300" />
                <span>FAA.ZONE™ Certified</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Pricing & Licensing Tiers */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              💰 Brand Package Pricing & VaultMesh™ Licensing
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the perfect licensing tier for your business needs. All packages include VaultMesh™ integration and FAA.ZONE™ ecosystem access.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {Object.entries(licensingTiers).map(([key, tier], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <Card className={`relative overflow-hidden ${
                  key === 'professional' 
                    ? 'ring-2 ring-blue-500 transform scale-105 shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20' 
                    : 'hover:shadow-lg transition-shadow bg-white dark:bg-slate-800'
                }`}>
                  {key === 'professional' && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                      ⭐ MOST POPULAR
                    </div>
                  )}
                  <CardHeader className={key === 'professional' ? 'pt-10' : ''}>
                    <CardTitle className="text-2xl font-bold flex items-center justify-between">
                      {tier.name}
                      {key === 'enterprise' && <Crown className="h-6 w-6 text-yellow-500" />}
                    </CardTitle>
                    <div className="text-4xl font-bold text-blue-600">
                      {tier.currency}{tier.price.toLocaleString()}
                      <span className="text-lg font-normal text-gray-500">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${
                        key === 'professional' 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                          : ''
                      }`}
                      variant={key === 'professional' ? 'default' : 'outline'}
                    >
                      {key === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Currency Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
            <label className="text-sm font-medium">Display prices in:</label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ZAR">ZAR (R)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Comprehensive Sector Grid */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              🔍 Sector-Specific Brand Packages
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Explore our comprehensive brand ecosystem across {totalSectors} specialized sectors
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search brands, sectors, or capabilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="All Sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {Object.entries(sectorList).map(([key, name]) => (
                  <SelectItem key={key} value={key}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(sectorList)
              .filter(([key, name]) => 
                selectedSector === 'all' || selectedSector === key
              )
              .filter(([key, name]) => 
                searchQuery === '' || 
                name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                key.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(([key, name], index) => {
                const brands = sampleBrands[key as keyof typeof sampleBrands] || ['Coming Soon'];
                const brandCount = key === 'agriculture' ? 45 : Math.floor(Math.random() * 30) + 5;
                
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {brandCount} brands
                          </Badge>
                          <div className="text-2xl">
                            {name.split(' ')[0].charAt(0)}
                          </div>
                        </div>
                        <CardTitle className="text-lg leading-tight">
                          {name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 mb-4">
                          {brands.slice(0, 4).map((brand, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                              <span className="truncate">{brand}</span>
                            </div>
                          ))}
                          {brands.length > 4 && (
                            <div className="text-xs text-gray-400">
                              +{brands.length - 4} more brands...
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                          <div>Nodes: {Math.floor(brandCount * 1.5)}</div>
                          <div>Active: {Math.floor(brandCount * 0.8)}</div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-4 hover:bg-blue-50 hover:border-blue-300"
                        >
                          View Packages
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
          </div>
        </motion.section>

        {/* Global Marketplace Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              🚀 Global Marketplace Features
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Powered by VaultMesh™ infrastructure and FAA.ZONE™ ecosystem integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Globe className="h-8 w-8 text-blue-500" />,
                title: "Global Commerce",
                description: "Access to worldwide brand licensing and marketplace integration"
              },
              {
                icon: <Zap className="h-8 w-8 text-yellow-500" />,
                title: "Real-time Sync", 
                description: "Live inventory tracking across all 6,005+ products and brands"
              },
              {
                icon: <Crown className="h-8 w-8 text-purple-500" />,
                title: "VaultMesh™ Security",
                description: "Enterprise-grade security and blockchain-verified transactions"
              },
              {
                icon: <Truck className="h-8 w-8 text-green-500" />,
                title: "Seamless Delivery",
                description: "Integrated logistics with tracking across multiple shipping partners"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + index * 0.1 }}
              >
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call-to-Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12 mb-8"
        >
          <h2 className="text-4xl font-bold mb-4">
            Ready to Join the Global Ecosystem?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get started with Fruitful™ Brand Packages and unlock access to the world's most comprehensive licensing marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Crown className="h-5 w-5 mr-2" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <ExternalLink className="h-5 w-5 mr-2" />
              View Live Demo
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}