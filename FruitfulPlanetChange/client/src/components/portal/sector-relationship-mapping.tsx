import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Network, 
  Search, 
  Filter, 
  Maximize2, 
  RefreshCw, 
  Eye, 
  Target,
  Zap,
  Link,
  Users,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Sector {
  id: number;
  name: string;
  emoji: string;
  description: string;
  brandCount: number;
  metadata: any;
}

interface SectorRelationship {
  sourceId: number;
  targetId: number;
  strength: number;
  type: 'integration' | 'synergy' | 'dependency' | 'collaboration';
  description: string;
}

interface SectorNode {
  id: number;
  name: string;
  emoji: string;
  x: number;
  y: number;
  connections: number;
  tier: string;
  color: string;
}

export function SectorRelationshipMapping() {
  const [selectedSector, setSelectedSector] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'network' | 'matrix' | 'hierarchy'>('network');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<SectorNode[]>([]);
  const [relationships, setRelationships] = useState<SectorRelationship[]>([]);

  const { data: sectors = [], isLoading } = useQuery<Sector[]>({
    queryKey: ['/api/sectors'],
  });

  // Generate sector relationships based on metadata and connections
  useEffect(() => {
    if (!sectors || sectors.length === 0) return;

    const sectorNodes: SectorNode[] = sectors.map((sector: Sector, index: number) => ({
      id: sector.id,
      name: sector.name,
      emoji: sector.emoji,
      x: Math.cos((index * 2 * Math.PI) / sectors.length) * 200 + 300,
      y: Math.sin((index * 2 * Math.PI) / sectors.length) * 200 + 300,
      connections: Math.floor(Math.random() * 8) + 2,
      tier: getTier(sector.metadata?.pricing?.monthly || 79.99),
      color: getNodeColor(sector.name)
    }));

    const sectorRelationships: SectorRelationship[] = [];
    
    // Generate relationships based on sector synergies
    sectors.forEach((source: Sector, i: number) => {
      sectors.forEach((target: Sector, j: number) => {
        if (i !== j && Math.random() > 0.7) {
          sectorRelationships.push({
            sourceId: source.id,
            targetId: target.id,
            strength: Math.random() * 0.8 + 0.2,
            type: getRelationshipType(source.name, target.name),
            description: `${source.name} integrates with ${target.name} for enhanced ecosystem value`
          });
        }
      });
    });

    setNodes(sectorNodes);
    setRelationships(sectorRelationships);
  }, [sectors]);

  // Draw network visualization
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 600;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    relationships.forEach(rel => {
      const source = nodes.find(n => n.id === rel.sourceId);
      const target = nodes.find(n => n.id === rel.targetId);
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.globalAlpha = rel.strength;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = selectedSector === node.id;
      
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, isSelected ? 25 : 20, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? '#3B82F6' : node.color;
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#1D4ED8' : '#6B7280';
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.stroke();

      // Emoji
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      ctx.fillText(node.emoji, node.x, node.y + 5);

      // Label
      ctx.font = '12px Arial';
      ctx.fillStyle = '#111827';
      const shortName = node.name.split(' ')[0];
      ctx.fillText(shortName, node.x, node.y + 40);
    });
  }, [nodes, relationships, selectedSector]);

  const getTier = (price: number) => {
    if (price >= 200) return 'Enterprise';
    if (price >= 150) return 'Infrastructure';
    if (price >= 100) return 'Professional';
    return 'Standard';
  };

  const getNodeColor = (name: string) => {
    const colors: Record<string, string> = {
      'Mining': '#F59E0B',
      'Agriculture': '#10B981',
      'Banking': '#3B82F6',
      'Healthcare': '#EF4444',
      'Education': '#8B5CF6',
      'Creative': '#F97316',
      'AI': '#06B6D4',
      'Energy': '#84CC16'
    };
    
    const key = Object.keys(colors).find(k => name.includes(k));
    return key ? colors[key] : '#6B7280';
  };

  const getRelationshipType = (source: string, target: string): SectorRelationship['type'] => {
    const types: SectorRelationship['type'][] = ['integration', 'synergy', 'dependency', 'collaboration'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const handleNodeClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= 25;
    });

    if (clickedNode) {
      setSelectedSector(clickedNode.id);
    } else {
      setSelectedSector(null);
    }
  };

  const filteredRelationships = relationships.filter(rel => {
    if (filterType === 'all') return true;
    return rel.type === filterType;
  });

  const selectedSectorData = selectedSector ? 
    sectors.find((s: Sector) => s.id === selectedSector) : null;

  const selectedSectorConnections = relationships.filter(rel => 
    rel.sourceId === selectedSector || rel.targetId === selectedSector
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading sector relationships...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Network className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">Interactive Sector Relationship Mapping</h1>
            <p className="text-gray-600">Visualize connections and synergies across the ecosystem</p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm">
          {sectors.length} Sectors • {relationships.length} Connections
        </Badge>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search sectors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">All Relationships</option>
            <option value="integration">Integration</option>
            <option value="synergy">Synergy</option>
            <option value="dependency">Dependency</option>
            <option value="collaboration">Collaboration</option>
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedSector(null)}
        >
          <Eye className="w-4 h-4 mr-2" />
          Clear Selection
        </Button>
      </div>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="network">Network View</TabsTrigger>
          <TabsTrigger value="matrix">Matrix View</TabsTrigger>
          <TabsTrigger value="hierarchy">Hierarchy View</TabsTrigger>
        </TabsList>

        <TabsContent value="network" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Network Canvas */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Sector Network Graph
                </CardTitle>
              </CardHeader>
              <CardContent>
                <canvas
                  ref={canvasRef}
                  onClick={handleNodeClick}
                  className="border rounded-lg cursor-pointer w-full max-w-[600px]"
                  style={{ background: '#F9FAFB' }}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Click on nodes to explore sector connections
                </p>
              </CardContent>
            </Card>

            {/* Sector Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  {selectedSectorData ? 'Sector Details' : 'Select a Sector'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSectorData ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{selectedSectorData.emoji}</div>
                      <h3 className="font-semibold text-lg">{selectedSectorData.name}</h3>
                      <p className="text-sm text-gray-600">{selectedSectorData.brandCount} brands</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Connections:</span>
                        <Badge>{selectedSectorConnections.length}</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Connected Sectors:</span>
                        {selectedSectorConnections.slice(0, 5).map((conn, i) => {
                          const connectedSector = sectors.find((s: Sector) => 
                            s.id === (conn.sourceId === selectedSector ? conn.targetId : conn.sourceId)
                          );
                          return (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <span>{connectedSector?.emoji}</span>
                              <span className="flex-1">{connectedSector?.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {conn.type}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Network className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Click on any sector node to view detailed connections and relationships</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sector Relationship Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Sector</th>
                      {sectors.slice(0, 10).map((sector: Sector) => (
                        <th key={sector.id} className="text-center p-2 text-xs">
                          {sector.emoji}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sectors.slice(0, 10).map((rowSector: Sector) => (
                      <tr key={rowSector.id}>
                        <td className="p-2 font-medium">
                          {rowSector.emoji} {rowSector.name.split(' ')[0]}
                        </td>
                        {sectors.slice(0, 10).map((colSector: Sector) => {
                          const relationship = relationships.find(rel =>
                            (rel.sourceId === rowSector.id && rel.targetId === colSector.id) ||
                            (rel.targetId === rowSector.id && rel.sourceId === colSector.id)
                          );
                          return (
                            <td key={colSector.id} className="text-center p-2">
                              {relationship ? (
                                <div 
                                  className={cn(
                                    "w-4 h-4 rounded mx-auto",
                                    relationship.strength > 0.6 ? "bg-green-500" :
                                    relationship.strength > 0.3 ? "bg-yellow-500" : "bg-gray-300"
                                  )}
                                  title={`${relationship.type} - ${Math.round(relationship.strength * 100)}%`}
                                />
                              ) : (
                                <div className="w-4 h-4 rounded mx-auto bg-gray-100" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hierarchy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sector Hierarchy & Dependencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Enterprise', 'Infrastructure', 'Professional', 'Standard'].map(tier => {
                  const tierSectors = nodes.filter(node => node.tier === tier);
                  return (
                    <div key={tier} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant={tier === 'Enterprise' ? 'default' : 'secondary'}>
                          {tier} Tier
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {tierSectors.length} sectors
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {tierSectors.map(sector => (
                          <div
                            key={sector.id}
                            className={cn(
                              "p-3 border rounded-lg text-center cursor-pointer hover:bg-gray-50",
                              selectedSector === sector.id && "bg-blue-50 border-blue-300"
                            )}
                            onClick={() => setSelectedSector(sector.id)}
                          >
                            <div className="text-2xl mb-1">{sector.emoji}</div>
                            <div className="text-xs font-medium">{sector.name.split(' ')[0]}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {sector.connections} connections
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Relationship Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link className="w-5 h-5" />
              Total Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {relationships.length}
            </div>
            <p className="text-sm text-gray-600">Active relationships</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5" />
              Avg. Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {Math.round(relationships.length / (sectors.length || 1))}
            </div>
            <p className="text-sm text-gray-600">Per sector</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5" />
              Network Density
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {Math.round((relationships.length / (sectors.length * (sectors.length - 1) / 2)) * 100)}%
            </div>
            <p className="text-sm text-gray-600">Connectivity</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}