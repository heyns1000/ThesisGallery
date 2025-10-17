import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Search, Filter, Star, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { CurrencyConverter } from '@/components/ui/currency-converter';

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

export function RealPricingMarketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');

  const { data: brands = [], isLoading } = useQuery<Brand[]>({ 
    queryKey: ['/api/brands'] 
  });

  const { data: sectors = [] } = useQuery({ 
    queryKey: ['/api/sectors'] 
  });

  // Filter brands with valid pricing
  const productsWithPricing = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || brand.sectorId.toString() === selectedSector;
    const hasValidPricing = brand.metadata?.pricing?.monthly || brand.metadata?.displayPrice;
    
    return matchesSearch && matchesSector && hasValidPricing;
  });

  const getDisplayPrice = (brand: Brand) => {
    if (brand.metadata?.pricing?.monthly) {
      return `$${brand.metadata.pricing.monthly.toFixed(2)}`;
    }
    if (brand.metadata?.displayPrice) {
      return brand.metadata.displayPrice;
    }
    return '$79.99';
  };

  const getPricingDetails = (brand: Brand) => {
    if (brand.metadata?.pricing) {
      return {
        monthly: brand.metadata.pricing.monthly,
        annual: brand.metadata.pricing.annual,
        savings: brand.metadata.pricing.savings,
        tier: brand.metadata.pricing.tier
      };
    }
    return null;
  };

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'professional':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'growth':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading marketplace products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          🛒 Real Pricing Marketplace
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {productsWithPricing.length} products with authenticated database pricing
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedSector} onValueChange={setSelectedSector}>
          <SelectTrigger>
            <SelectValue placeholder="Select Sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {sectors.map((sector: any) => (
              <SelectItem key={sector.id} value={sector.id.toString()}>
                {sector.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productsWithPricing.map((brand, index) => {
          const pricing = getPricingDetails(brand);
          const displayPrice = getDisplayPrice(brand);
          const sector = sectors.find((s: any) => s.id === brand.sectorId);

          return (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{brand.name}</CardTitle>
                      <Badge variant="outline">{sector?.name || 'Unknown Sector'}</Badge>
                    </div>
                    {pricing?.tier && (
                      <Badge className={getTierColor(pricing.tier)}>
                        {pricing.tier.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {brand.description}
                  </p>

                  {/* Real Pricing Display */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <CurrencyConverter usdAmount={parseFloat(displayPrice.replace('$', ''))} showConverter={false} />
                      <span className="text-sm text-gray-500">/month</span>
                    </div>
                    
                    {pricing?.annual && (
                      <div className="text-sm text-green-600">
                        <span className="font-medium">
                          <CurrencyConverter usdAmount={pricing.annual / 12} showConverter={false} />
                          /month
                        </span>
                        <span className="ml-1 text-xs">when paid annually</span>
                        <br />
                        <span className="text-xs">{pricing.savings}</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-1">
                    {pricing?.tier === 'enterprise' && (
                      <>
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                          ✅ Full VaultMesh™ Integration
                        </div>
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                          ✅ Real-time Analytics
                        </div>
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                          ✅ Priority Support
                        </div>
                      </>
                    )}
                    {pricing?.tier === 'professional' && (
                      <>
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                          ✅ Professional Integration
                        </div>
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                          ✅ Standard Analytics
                        </div>
                      </>
                    )}
                    {(!pricing?.tier || pricing?.tier === 'standard') && (
                      <>
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                          ✅ Basic Integration
                        </div>
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                          ✅ Community Support
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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

      {/* No Results */}
      {productsWithPricing.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  );
}