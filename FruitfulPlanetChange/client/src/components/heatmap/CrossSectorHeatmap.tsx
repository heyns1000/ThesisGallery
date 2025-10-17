import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, 
  TrendingUp, 
  Network, 
  Zap, 
  Target,
  Activity,
  BarChart3,
  Eye,
  Settings,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeatmapCell {
  sourceId: string;
  targetId: string;
  strength: number;
  type: string;
  bidirectional: boolean;
  integrationPotential: number;
  strategicValue: number;
  operationalSynergy: number;
}

interface Sector {
  id: string;
  name: string;
  emoji: string;
  influence: number;
  brandCount?: number;
  totalElements?: number;
}

interface HeatmapData {
  matrix: Record<string, Record<string, HeatmapCell>>;
  sectors: Sector[];
  analytics: {
    totalConnections: number;
    strongestConnection: number;
    averageStrength: number;
    mostInfluentialSector: string;
  };
}

export function CrossSectorHeatmap() {
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'strength' | 'potential' | 'synergy'>('strength');
  const [intensityLevel, setIntensityLevel] = useState(1);

  // Fetch heatmap data from the interstellar coordination engine
  const { data: heatmapData, isLoading, refetch } = useQuery<HeatmapData>({
    queryKey: ['/api/ecosystem/interstellar/heatmap'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch sectors data for enhanced sector information
  const { data: sectorsData } = useQuery({
    queryKey: ['/api/sectors'],
    refetchInterval: 60000,
  });

  // Enhanced sectors with brand counts
  const enhancedSectors = useMemo(() => {
    if (!heatmapData?.sectors || !sectorsData) return heatmapData?.sectors || [];
    
    return heatmapData.sectors.map(sector => {
      const sectorDetails = sectorsData.find((s: any) => s.id.toString() === sector.id);
      return {
        ...sector,
        brandCount: sectorDetails?.brandCount || 0,
        totalElements: sectorDetails?.totalElements || 0
      };
    });
  }, [heatmapData?.sectors, sectorsData]);

  // Calculate color intensity based on view mode
  const getCellColor = (cell: HeatmapCell, sourceId: string, targetId: string) => {
    if (sourceId === targetId) return 'bg-gray-100 dark:bg-gray-800';
    
    let value = 0;
    switch (viewMode) {
      case 'strength':
        value = cell?.strength || 0;
        break;
      case 'potential':
        value = cell?.integrationPotential || 0;
        break;
      case 'synergy':
        value = cell?.operationalSynergy || 0;
        break;
    }

    const normalizedValue = Math.min(value / 100, 1);
    const adjustedValue = Math.pow(normalizedValue, 1 / intensityLevel);
    
    if (adjustedValue === 0) return 'bg-gray-50 dark:bg-gray-900';
    if (adjustedValue < 0.2) return 'bg-blue-100 dark:bg-blue-900/30';
    if (adjustedValue < 0.4) return 'bg-blue-200 dark:bg-blue-800/50';
    if (adjustedValue < 0.6) return 'bg-blue-400 dark:bg-blue-600/70';
    if (adjustedValue < 0.8) return 'bg-blue-600 dark:bg-blue-500/80';
    return 'bg-blue-800 dark:bg-blue-400';
  };

  // Get text color for readability
  const getCellTextColor = (cell: HeatmapCell, sourceId: string, targetId: string) => {
    if (sourceId === targetId) return 'text-gray-500';
    
    let value = 0;
    switch (viewMode) {
      case 'strength':
        value = cell?.strength || 0;
        break;
      case 'potential':
        value = cell?.integrationPotential || 0;
        break;
      case 'synergy':
        value = cell?.operationalSynergy || 0;
        break;
    }

    const normalizedValue = Math.min(value / 100, 1);
    const adjustedValue = Math.pow(normalizedValue, 1 / intensityLevel);
    
    return adjustedValue > 0.5 ? 'text-white' : 'text-gray-800 dark:text-gray-200';
  };

  // Get the value to display in cell
  const getCellValue = (cell: HeatmapCell, sourceId: string, targetId: string) => {
    if (sourceId === targetId) return '—';
    if (!cell) return '0';
    
    switch (viewMode) {
      case 'strength':
        return Math.round(cell.strength || 0);
      case 'potential':
        return Math.round(cell.integrationPotential || 0);
      case 'synergy':
        return Math.round(cell.operationalSynergy || 0);
      default:
        return '0';
    }
  };

  // Calculate sector influence indicators
  const getSectorInfluenceColor = (influence: number) => {
    if (influence > 80) return 'border-green-500 bg-green-50 dark:bg-green-900/20';
    if (influence > 60) return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    if (influence > 40) return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
    return 'border-gray-400 bg-gray-50 dark:bg-gray-900/20';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <span className="ml-3">Loading Cross-Sector Heatmap...</span>
      </div>
    );
  }

  if (!heatmapData || !enhancedSectors.length) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Network className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No heatmap data available. Initialize the ecosystem coordination matrix first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🌐 Cross-Sector Ecosystem Heatmap
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time visualization of sector relationships and integration potential
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Connections</p>
                <p className="text-2xl font-bold">{heatmapData.analytics.totalConnections}</p>
              </div>
              <Network className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Strongest Connection</p>
                <p className="text-2xl font-bold">{Math.round(heatmapData.analytics.strongestConnection)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Strength</p>
                <p className="text-2xl font-bold">{Math.round(heatmapData.analytics.averageStrength)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Sectors</p>
                <p className="text-2xl font-bold">{enhancedSectors.length}</p>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Controls */}
      <div className="flex items-center justify-between">
        <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="strength" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Relationship Strength
            </TabsTrigger>
            <TabsTrigger value="potential" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Integration Potential
            </TabsTrigger>
            <TabsTrigger value="synergy" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Operational Synergy
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Intensity:</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={intensityLevel}
            onChange={(e) => setIntensityLevel(parseFloat(e.target.value))}
            className="w-20"
          />
          <span className="text-sm w-8">{intensityLevel.toFixed(1)}</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-auto">
        <div className="inline-block min-w-full">
          <div className="grid gap-1" style={{ gridTemplateColumns: `120px repeat(${enhancedSectors.length}, 80px)` }}>
            {/* Header Row */}
            <div className="p-2"></div>
            {enhancedSectors.map((sector) => (
              <div
                key={`header-${sector.id}`}
                className={cn(
                  "p-2 text-center text-xs font-medium border-2 rounded-md transition-all cursor-pointer",
                  getSectorInfluenceColor(sector.influence),
                  hoveredSector === sector.id ? 'ring-2 ring-blue-500' : ''
                )}
                onMouseEnter={() => setHoveredSector(sector.id)}
                onMouseLeave={() => setHoveredSector(null)}
                title={`${sector.name}\nInfluence: ${sector.influence}\nBrands: ${sector.brandCount || 0}`}
              >
                <div className="font-semibold">{sector.emoji}</div>
                <div className="text-xs mt-1 truncate">{sector.name.split(' ')[0]}</div>
                {sector.brandCount && (
                  <div className="text-xs text-gray-500">{sector.brandCount}</div>
                )}
              </div>
            ))}

            {/* Data Rows */}
            {enhancedSectors.map((rowSector) => (
              <div key={`row-${rowSector.id}`} className="contents">
                {/* Row Label */}
                <div
                  className={cn(
                    "p-2 text-sm font-medium border-2 rounded-md flex items-center gap-2 transition-all cursor-pointer",
                    getSectorInfluenceColor(rowSector.influence),
                    hoveredSector === rowSector.id ? 'ring-2 ring-blue-500' : ''
                  )}
                  onMouseEnter={() => setHoveredSector(rowSector.id)}
                  onMouseLeave={() => setHoveredSector(null)}
                  title={`${rowSector.name}\nInfluence: ${rowSector.influence}\nElements: ${rowSector.totalElements || 0}`}
                >
                  <span>{rowSector.emoji}</span>
                  <div className="flex-1 truncate">
                    <div className="font-semibold text-xs">{rowSector.name.split(' ')[0]}</div>
                    {rowSector.totalElements && (
                      <div className="text-xs text-gray-500">{rowSector.totalElements}</div>
                    )}
                  </div>
                </div>

                {/* Data Cells */}
                {enhancedSectors.map((colSector) => {
                  const cell = heatmapData.matrix[rowSector.id]?.[colSector.id];
                  return (
                    <div
                      key={`cell-${rowSector.id}-${colSector.id}`}
                      className={cn(
                        "p-2 text-center text-xs font-medium border rounded transition-all cursor-pointer",
                        getCellColor(cell, rowSector.id, colSector.id),
                        getCellTextColor(cell, rowSector.id, colSector.id),
                        (hoveredSector === rowSector.id || hoveredSector === colSector.id) ? 'ring-2 ring-blue-400' : '',
                        selectedCell === cell ? 'ring-2 ring-purple-500' : ''
                      )}
                      onClick={() => setSelectedCell(cell)}
                      title={cell ? `${rowSector.name} ↔ ${colSector.name}\nStrength: ${Math.round(cell.strength || 0)}\nPotential: ${Math.round(cell.integrationPotential || 0)}\nSynergy: ${Math.round(cell.operationalSynergy || 0)}` : ''}
                    >
                      {getCellValue(cell, rowSector.id, colSector.id)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend and Info Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Color Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Color Legend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 border rounded"></div>
                <span className="text-sm">Self-reference</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 border rounded"></div>
                <span className="text-sm">Weak (0-20)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-200 dark:bg-blue-800/50 border rounded"></div>
                <span className="text-sm">Moderate (20-40)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 dark:bg-blue-600/70 border rounded"></div>
                <span className="text-sm">Strong (40-60)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 dark:bg-blue-500/80 border rounded"></div>
                <span className="text-sm">Very Strong (60-80)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-800 dark:bg-blue-400 border rounded"></div>
                <span className="text-sm">Exceptional (80-100)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sector Influence Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Influence Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded"></div>
                <span className="text-sm">High Influence (80+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded"></div>
                <span className="text-sm">Medium Influence (60-80)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded"></div>
                <span className="text-sm">Moderate Influence (40-60)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 bg-gray-50 dark:bg-gray-900/20 rounded"></div>
                <span className="text-sm">Low Influence (&lt;40)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Cell Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              {selectedCell ? 'Relationship Details' : 'Click a cell for details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCell ? (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium">Relationship Strength:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${selectedCell.strength}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{Math.round(selectedCell.strength)}%</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium">Integration Potential:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${selectedCell.integrationPotential}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{Math.round(selectedCell.integrationPotential)}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Operational Synergy:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${selectedCell.operationalSynergy}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{Math.round(selectedCell.operationalSynergy)}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <Badge variant={selectedCell.bidirectional ? "default" : "secondary"}>
                    {selectedCell.bidirectional ? 'Bidirectional' : 'Unidirectional'}
                  </Badge>
                  <Badge variant="outline">
                    {selectedCell.type}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select any cell in the heatmap to view detailed relationship information including strength, integration potential, and operational synergy.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}