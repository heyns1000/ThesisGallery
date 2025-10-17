import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { CurrencyConverter } from '@/components/ui/currency-converter';
import { Search, Filter, BarChart3, Zap, Eye } from 'lucide-react';

export function CompleteSectorListing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const { data: sectors = [], isLoading } = useQuery({
    queryKey: ['/api/sectors'],
    refetchInterval: 30000
  });

  const { data: sectorBreakdown = [] } = useQuery({
    queryKey: ['/api/admin-panel/sector-breakdown'],
    refetchInterval: 30000
  });

  // Combine sectors with breakdown data
  const enrichedSectors = sectors.map((sector: any) => {
    const breakdown = sectorBreakdown.find((s: any) => s.sector === sector.name);
    return {
      ...sector,
      coreBrands: breakdown?.coreBrands || 0,
      totalNodes: breakdown?.totalNodes || 0,
      monthlyFee: breakdown?.monthlyFee || 79,
      tier: breakdown?.tier || 'A'
    };
  });

  // Filter and sort
  const filteredSectors = enrichedSectors
    .filter((sector: any) => 
      sector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sector.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'brands':
          return b.coreBrands - a.coreBrands;
        case 'pricing':
          return b.monthlyFee - a.monthlyFee;
        case 'tier':
          return a.tier.localeCompare(b.tier);
        default:
          return 0;
      }
    });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'A++': return 'bg-purple-600 text-white';
      case 'A+': return 'bg-blue-600 text-white';
      case 'A': return 'bg-green-600 text-white';
      case 'B+': return 'bg-orange-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading all sectors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          📊 Complete Sector Directory
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          All {sectors.length} sectors with comprehensive analytics and pricing
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search sectors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">📝 Name</SelectItem>
            <SelectItem value="brands">🏷️ Brand Count</SelectItem>
            <SelectItem value="pricing">💰 Pricing</SelectItem>
            <SelectItem value="tier">⭐ Tier</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          {filteredSectors.length} of {sectors.length} sectors
        </div>
      </div>

      {/* Sector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSectors.map((sector: any, index: number) => (
          <Card key={sector.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{sector.emoji}</div>
                  <div>
                    <CardTitle className="text-base">{sector.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTierColor(sector.tier)} variant="default">
                        {sector.tier}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ID: {sector.id}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Core Brands</div>
                  <div className="font-semibold text-lg">{sector.coreBrands}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Total Nodes</div>
                  <div className="font-semibold text-lg">{sector.totalNodes}</div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <div className="text-gray-500 dark:text-gray-400 text-sm">Monthly Fee</div>
                <div className="flex items-center justify-between">
                  <CurrencyConverter usdAmount={sector.monthlyFee} showConverter={false} />
                  <Badge variant="outline" className="text-xs">
                    /month
                  </Badge>
                </div>
              </div>

              {/* Description */}
              {sector.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {sector.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Analytics
                </Button>
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Zap className="w-3 h-3 mr-1" />
                  Deploy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{sectors.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Sectors</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {filteredSectors.reduce((sum: number, s: any) => sum + s.coreBrands, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Core Brands</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {filteredSectors.reduce((sum: number, s: any) => sum + s.totalNodes, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Nodes</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                <CurrencyConverter 
                  usdAmount={Math.round(filteredSectors.reduce((sum: number, s: any) => sum + s.monthlyFee, 0) / filteredSectors.length)} 
                  showConverter={false}
                />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Monthly Fee</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}