import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useSectorMappingData } from '@/hooks/useSectorMappingData';
import { useSectorVisualization } from '@/hooks/useSectorVisualization';
import {
  Network,
  Grid3x3,
  Layers,
  Download,
  Plus,
  RefreshCw,
  Activity,
  TrendingUp,
  Link2,
  Trash2,
  BarChart3,
} from 'lucide-react';

const relationshipSchema = z.object({
  sourceId: z.string().min(1, 'Source sector is required'),
  targetId: z.string().min(1, 'Target sector is required'),
  strength: z.number().min(0).max(1),
  relationshipType: z.enum(['integration', 'synergy', 'dependency', 'collaboration']),
  description: z.string().optional(),
  bidirectional: z.boolean().default(false),
  weight: z.number().default(1),
});

export default function InteractiveSectorMapping() {
  const { toast } = useToast();
  const [isAddRelationshipOpen, setIsAddRelationshipOpen] = useState(false);

  // Data management hook
  const {
    relationships,
    nodes,
    networkStats,
    isLoading,
    isInitialized,
    storeRelationship,
    deleteRelationship,
    getStrongestConnections,
    calculateNetworkCentrality,
    refreshCache,
  } = useSectorMappingData();

  // Visualization hook
  const {
    canvasRef,
    isReady,
    viewMode,
    setViewMode,
    selectedSector,
    selectSector,
    onMouseMove,
    onClick,
    exportAsImage,
    exportAsData,
  } = useSectorVisualization(nodes, relationships, {
    width: 800,
    height: 600,
    nodeRadius: 20,
    showLabels: true,
    animationSpeed: 1,
  });

  // Form for adding relationships
  const form = useForm({
    resolver: zodResolver(relationshipSchema),
    defaultValues: {
      sourceId: '',
      targetId: '',
      strength: 0.5,
      relationshipType: 'integration' as const,
      description: '',
      bidirectional: false,
      weight: 1,
    },
  });

  const handleAddRelationship = async (data: z.infer<typeof relationshipSchema>) => {
    try {
      await storeRelationship(data);
      toast({
        title: 'Relationship Created',
        description: 'Sector relationship has been successfully created.',
      });
      setIsAddRelationshipOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create relationship',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRelationship = async (id: string) => {
    try {
      await deleteRelationship(id);
      toast({
        title: 'Relationship Deleted',
        description: 'Sector relationship has been removed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete relationship',
        variant: 'destructive',
      });
    }
  };

  const handleExportImage = () => {
    const dataUrl = exportAsImage('png');
    const link = document.createElement('a');
    link.download = `sector-network-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    toast({
      title: 'Export Successful',
      description: 'Network visualization exported as PNG',
    });
  };

  const handleExportData = (format: 'json' | 'csv') => {
    const data = exportAsData(format);
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `sector-network-${Date.now()}.${format}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Export Successful',
      description: `Network data exported as ${format.toUpperCase()}`,
    });
  };

  const selectedSectorData = nodes.find(n => n.id === selectedSector);
  const selectedSectorRelationships = relationships.filter(
    r => r.sourceId === selectedSector || r.targetId === selectedSector
  );
  const strongestConnections = getStrongestConnections(5);
  const centralityData = calculateNetworkCentrality.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96" data-testid="loading-state">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading sector network...</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <Card data-testid="empty-state">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No sector data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-testid="sector-mapping-container">
      {/* Header with Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card data-testid="stat-sectors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sectors</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-sectors">{nodes.length}</div>
          </CardContent>
        </Card>

        <Card data-testid="stat-connections">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-connections">{networkStats.totalConnections}</div>
          </CardContent>
        </Card>

        <Card data-testid="stat-density">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Density</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-network-density">{networkStats.networkDensity}%</div>
          </CardContent>
        </Card>

        <Card data-testid="stat-avg-connections">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Connections</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-avg-connections">{networkStats.avgConnections}</div>
          </CardContent>
        </Card>

        <Card data-testid="stat-isolated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Isolated Nodes</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-isolated-nodes">{networkStats.isolatedNodes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Visualization */}
      <Card data-testid="visualization-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Interactive Sector Network</CardTitle>
              <CardDescription>
                Visualize and analyze sector relationships across the FAA.ZONE ecosystem
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isAddRelationshipOpen} onOpenChange={setIsAddRelationshipOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" data-testid="button-add-relationship">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Relationship
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid="dialog-add-relationship">
                  <DialogHeader>
                    <DialogTitle>Create Sector Relationship</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddRelationship)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="sourceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Source Sector</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger data-testid="select-source-sector">
                                  <SelectValue placeholder="Select source sector" />
                                </SelectTrigger>
                                <SelectContent>
                                  {nodes.map(node => (
                                    <SelectItem key={node.id} value={node.id} data-testid={`option-source-${node.id}`}>
                                      {node.glyph} {node.sectorName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Sector</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger data-testid="select-target-sector">
                                  <SelectValue placeholder="Select target sector" />
                                </SelectTrigger>
                                <SelectContent>
                                  {nodes.map(node => (
                                    <SelectItem key={node.id} value={node.id} data-testid={`option-target-${node.id}`}>
                                      {node.glyph} {node.sectorName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="relationshipType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship Type</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger data-testid="select-relationship-type">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="integration" data-testid="option-integration">Integration</SelectItem>
                                  <SelectItem value="synergy" data-testid="option-synergy">Synergy</SelectItem>
                                  <SelectItem value="dependency" data-testid="option-dependency">Dependency</SelectItem>
                                  <SelectItem value="collaboration" data-testid="option-collaboration">Collaboration</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="strength"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Strength (0-1)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="1"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                data-testid="input-strength"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea {...field} data-testid="textarea-description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddRelationshipOpen(false)}
                          data-testid="button-cancel-relationship"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" data-testid="button-submit-relationship">
                          Create Relationship
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Button
                size="sm"
                variant="outline"
                onClick={refreshCache}
                data-testid="button-refresh"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleExportImage}
                data-testid="button-export-image"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PNG
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExportData('json')}
                data-testid="button-export-json"
              >
                Export JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} data-testid="view-tabs">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="network" data-testid="tab-network">
                <Network className="h-4 w-4 mr-2" />
                Network Graph
              </TabsTrigger>
              <TabsTrigger value="matrix" data-testid="tab-matrix">
                <Grid3x3 className="h-4 w-4 mr-2" />
                Matrix View
              </TabsTrigger>
              <TabsTrigger value="hierarchy" data-testid="tab-hierarchy">
                <Layers className="h-4 w-4 mr-2" />
                Hierarchy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="network" className="mt-6" data-testid="content-network">
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg">
                <canvas
                  ref={canvasRef}
                  onMouseMove={onMouseMove}
                  onClick={onClick}
                  className="w-full h-[600px] cursor-pointer"
                  data-testid="canvas-network"
                />
              </div>
            </TabsContent>

            <TabsContent value="matrix" className="mt-6" data-testid="content-matrix">
              <div className="text-center text-muted-foreground py-12">
                Matrix view visualization (Coming soon)
              </div>
            </TabsContent>

            <TabsContent value="hierarchy" className="mt-6" data-testid="content-hierarchy">
              <div className="text-center text-muted-foreground py-12">
                Hierarchy view visualization (Coming soon)
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Bottom Panel - Details and Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Selected Sector Details */}
        <Card data-testid="selected-sector-card">
          <CardHeader>
            <CardTitle>Selected Sector</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSectorData ? (
              <div className="space-y-4" data-testid="selected-sector-details">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedSectorData.glyph}</span>
                  <div>
                    <h3 className="font-semibold" data-testid="text-selected-sector-name">
                      {selectedSectorData.sectorName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedSectorData.tier} Tier
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Core Brands:</span>
                    <span className="text-sm font-medium" data-testid="text-core-brands">
                      {selectedSectorData.coreBrands}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Nodes:</span>
                    <span className="text-sm font-medium" data-testid="text-total-nodes">
                      {selectedSectorData.totalNodes}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Relationships:</span>
                    <span className="text-sm font-medium" data-testid="text-relationships-count">
                      {selectedSectorRelationships.length}
                    </span>
                  </div>
                </div>

                {selectedSectorRelationships.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Connections:</h4>
                    <div className="space-y-1">
                      {selectedSectorRelationships.slice(0, 5).map((rel) => {
                        const otherSectorId = rel.sourceId === selectedSector ? rel.targetId : rel.sourceId;
                        const otherSector = nodes.find(n => n.id === otherSectorId);
                        return (
                          <div
                            key={rel.id}
                            className="flex items-center justify-between p-2 bg-muted rounded"
                            data-testid={`relationship-${rel.id}`}
                          >
                            <span className="text-sm">
                              {otherSector?.glyph} {otherSector?.sectorName}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{rel.relationshipType}</Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteRelationship(rel.id)}
                                data-testid={`button-delete-${rel.id}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8" data-testid="text-no-selection">
                Click on a sector node to view details
              </p>
            )}
          </CardContent>
        </Card>

        {/* Network Analytics */}
        <Card data-testid="analytics-card">
          <CardHeader>
            <CardTitle>Network Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="strongest" data-testid="analytics-tabs">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="strongest" data-testid="tab-strongest">Strongest Connections</TabsTrigger>
                <TabsTrigger value="centrality" data-testid="tab-centrality">Centrality</TabsTrigger>
              </TabsList>

              <TabsContent value="strongest" className="space-y-2 mt-4" data-testid="content-strongest">
                {strongestConnections.map((rel, index) => {
                  const source = nodes.find(n => n.id === rel.sourceId);
                  const target = nodes.find(n => n.id === rel.targetId);
                  return (
                    <div
                      key={rel.id}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                      data-testid={`strongest-${index}`}
                    >
                      <span className="text-sm">
                        {source?.glyph} → {target?.glyph} {target?.sectorName}
                      </span>
                      <Badge variant="outline" data-testid={`badge-strength-${index}`}>
                        {(rel.strength * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="centrality" className="space-y-2 mt-4" data-testid="content-centrality">
                {centralityData.map((item, index) => (
                  <div
                    key={item.node.id}
                    className="flex items-center justify-between p-2 bg-muted rounded"
                    data-testid={`centrality-${index}`}
                  >
                    <span className="text-sm">
                      {item.node.glyph} {item.node.sectorName}
                    </span>
                    <Badge variant="outline" data-testid={`badge-centrality-${index}`}>
                      {item.centrality} connections
                    </Badge>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
