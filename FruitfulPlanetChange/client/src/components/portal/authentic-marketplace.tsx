import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Crown, Star, Search, Filter, ShoppingCart, Zap, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

type Brand = {
  id: number;
  name: string;
  description: string;
  sectorId: number;
  isCore: boolean;
  status: string;
  tier: string;
  integration: string;
  metadata: any;
};

type Sector = {
  id: number;
  name: string;
  emoji: string;
  description?: string;
};

export function AuthenticMarketplace() {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<string>('all');

  const { data: sectors = [] } = useQuery<Sector[]>({ 
    queryKey: ['/api/sectors'] 
  });

  const { data: brands = [] } = useQuery<Brand[]>({ 
    queryKey: ['/api/brands'] 
  });

  // Filter brands based on selection criteria
  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = selectedSector === 'all' || 
                         brand.sectorId.toString() === selectedSector;
    
    const hasValidPricing = brand.metadata?.pricing?.monthly && brand.metadata?.pricing?.annual;
    
    let matchesPriceRange = true;
    if (priceRange !== 'all' && hasValidPricing) {
      const price = billingCycle === 'monthly' ? brand.metadata.pricing.monthly : brand.metadata.pricing.annual;
      switch (priceRange) {
        case 'under100':
          matchesPriceRange = price < 100;
          break;
        case '100-300':
          matchesPriceRange = price >= 100 && price < 300;
          break;
        case '300-1000':
          matchesPriceRange = price >= 300 && price < 1000;
          break;
        case 'over1000':
          matchesPriceRange = price >= 1000;
          break;
      }
    }
    
    return matchesSearch && matchesSector && hasValidPricing && matchesPriceRange;
  });

  // Group brands by sector for better display
  const brandsBySector = filteredBrands.reduce((acc, brand) => {
    const sector = sectors.find(s => s.id === brand.sectorId);
    const sectorName = sector?.name || 'Unknown Sector';
    if (!acc[sectorName]) {
      acc[sectorName] = [];
    }
    acc[sectorName].push(brand);
    return acc;
  }, {} as Record<string, Brand[]>);

  const formatPrice = (brand: Brand) => {
    const pricing = brand.metadata?.pricing;
    if (!pricing) return { display: '$79.99', period: '/month' };
    
    const price = billingCycle === 'monthly' ? pricing.monthly : pricing.annual;
    const period = billingCycle === 'monthly' ? '/month' : '/year';
    
    return {
      display: `$${price.toFixed(2)}`,
      period,
      savings: billingCycle === 'annual' ? pricing.savingsText : null,
      monthlyEquivalent: billingCycle === 'annual' ? pricing.monthlyEquivalent : null
    };
  };

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'a+':
      case 'enterprise':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'a':
      case 'professional':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'b+':
      case 'growth':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'enterprise':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'professional':
        return <Star className="w-4 h-4 text-blue-500" />;
      case 'growth':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🛒 Fruitful Global Marketplace
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Discover {brands.length} premium brand solutions across {sectors.length} sectors with authentic VaultMesh™ integration and real-time pricing.
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sector Filter */}
        <Select value={selectedSector} onValueChange={setSelectedSector}>
          <SelectTrigger>
            <SelectValue placeholder="Select Sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {sectors.map(sector => (
              <SelectItem key={sector.id} value={sector.id.toString()}>
                {sector.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Price Range Filter */}
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="under100">Under $100</SelectItem>
            <SelectItem value="100-300">$100 - $300</SelectItem>
            <SelectItem value="300-1000">$300 - $1,000</SelectItem>
            <SelectItem value="over1000">Over $1,000</SelectItem>
          </SelectContent>
        </Select>

        {/* Billing Cycle */}
        <Tabs value={billingCycle} onValueChange={(value) => setBillingCycle(value as 'monthly' | 'annual')} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="monthly" className="flex-1">Monthly</TabsTrigger>
            <TabsTrigger value="annual" className="flex-1">Annual</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <Badge variant="secondary" className="px-4 py-2">
          {filteredBrands.length} products found
        </Badge>
        {billingCycle === 'annual' && (
          <Badge variant="outline" className="ml-2 px-4 py-2 text-green-600">
            Save up to 16% with annual billing
          </Badge>
        )}
      </motion.div>

      {/* Product Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-8"
      >
        {Object.entries(brandsBySector).map(([sectorName, sectorBrands], sectorIndex) => (
          <div key={sectorName} className="space-y-4">
            {/* Sector Header */}
            <div className="flex items-center gap-3 pb-2 border-b">
              <h2 className="text-xl font-semibold">{sectorName}</h2>
              <Badge variant="secondary">{sectorBrands.length} products</Badge>
            </div>

            {/* Brand Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectorBrands.slice(0, 6).map((brand, brandIndex) => {
                const priceInfo = formatPrice(brand);
                const features = brand.metadata?.pricing?.features || ['VaultMesh™ Integration', 'Standard Support'];
                
                return (
                  <motion.div
                    key={brand.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + (brandIndex * 0.1) }}
                  >
                    <Card className="relative h-full hover:shadow-xl transition-all duration-300 group">
                      {/* Tier Badge */}
                      <div className={`absolute top-4 right-4 px-2 py-1 rounded-full ${getTierColor(brand.tier)} text-white text-xs font-bold flex items-center gap-1`}>
                        {getTierBadge(brand.tier)}
                        {brand.tier?.toUpperCase() || 'STANDARD'}
                      </div>

                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold flex items-start justify-between">
                          <span className="flex-1 pr-2">{brand.name}</span>
                        </CardTitle>
                        
                        {/* Pricing */}
                        <div className="space-y-1">
                          <div className="text-3xl font-bold text-blue-600">
                            {priceInfo.display}
                            <span className="text-lg text-gray-500 font-normal">
                              {priceInfo.period}
                            </span>
                          </div>
                          {billingCycle === 'annual' && priceInfo.monthlyEquivalent && (
                            <p className="text-sm text-green-600 font-medium">
                              {priceInfo.monthlyEquivalent} • {priceInfo.savings}
                            </p>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Description */}
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {brand.description}
                        </p>

                        {/* Features */}
                        <div className="space-y-2">
                          {features.slice(0, 3).map((feature: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Integration Badge */}
                        <div className="pt-2">
                          <Badge variant="outline" className="text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            {brand.integration} Ready
                          </Badge>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-4">
                          <Button variant="outline" size="sm" className="text-xs">
                            View Details
                          </Button>
                          <Button size="sm" className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Show more button if there are more brands */}
            {sectorBrands.length > 6 && (
              <div className="text-center pt-4">
                <Button variant="outline">
                  View all {sectorBrands.length} {sectorName} products
                </Button>
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* No Results */}
      {filteredBrands.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or filters
          </p>
        </motion.div>
      )}
    </div>
  );
}