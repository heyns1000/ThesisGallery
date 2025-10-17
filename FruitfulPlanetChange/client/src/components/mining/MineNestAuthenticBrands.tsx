import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, ShoppingCart, Star, Zap, Shield, Trophy } from 'lucide-react';

interface Brand {
  id: number;
  name: string;
  description: string;
  sectorId: number;
  integration: string;
  status: string;
  isCore: boolean;
  metadata: {
    tier: string;
    category: string;
    price: string;
    license: string;
  };
}

export function MineNestAuthenticBrands() {
  const { data: miningBrands, isLoading, error } = useQuery({
    queryKey: ['/api/mining-brands'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-400">Loading authentic MineNest™ brands...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-400 mb-2">⚠️ Error loading mining brands</div>
        <div className="text-gray-400 text-sm">Please check your connection and try again</div>
      </div>
    );
  }

  const brandsArray = Array.isArray(miningBrands) ? miningBrands : [];
  
  if (brandsArray.length === 0) {
    return (
      <div className="text-center p-8">
        <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <div className="text-gray-400">No mining brands available</div>
      </div>
    );
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'A+': return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'A': return <Star className="h-4 w-4 text-blue-500" />;
      case 'B+': return <Shield className="h-4 w-4 text-green-500" />;
      default: return <Zap className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'A+': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'A': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'B+': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">MineNest™ Authentic Brands</h2>
          <p className="text-gray-400">30 core mining & resources solutions with accurate pricing from HTML file</p>
        </div>
        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
          {brandsArray.length} Brands Available
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brandsArray.map((brand) => (
          <Card key={brand.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/80 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  {getTierIcon(brand.metadata.tier)}
                  {brand.name}
                </CardTitle>
                <Badge className={getTierColor(brand.metadata.tier)}>
                  {brand.metadata.tier}
                </Badge>
              </div>
              <div className="text-sm text-gray-400">
                {brand.metadata.category} • {brand.metadata.license}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-300 line-clamp-2">
                {brand.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  Integration: <span className="text-blue-400">{brand.integration}</span>
                </div>
                <Badge 
                  variant={brand.status === 'active' ? 'default' : 'secondary'} 
                  className={brand.status === 'active' ? 'bg-green-500/10 text-green-500' : ''}
                >
                  {brand.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <div className="text-xl font-bold text-yellow-500">
                  {brand.metadata.price}
                </div>
                <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-black">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-6 border-t border-gray-700">
        <p className="text-sm text-gray-400">
          🔐 All brands powered by <span className="text-blue-400">VaultMesh™</span> infrastructure 
          with enterprise-grade security and real-time monitoring
        </p>
      </div>
    </div>
  );
}