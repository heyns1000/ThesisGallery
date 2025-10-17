import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CreditCard, Package, Building, Users, DollarSign, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface PayPalContainer {
  sectorId: number;
  sectorName: string;
  brandId?: number;
  brandName?: string;
  price: string;
  currency: string;
  containerId: string;
  paypalButtonId: string;
  checkoutUrl: string;
}

interface ContainerStats {
  sectorContainers: number;
  brandContainers: number;
  averagePrice: number;
}

export function PayPalEcosystemManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSector, setSelectedSector] = useState<number | null>(null);

  // Fetch containers overview
  const { data: containersData, isLoading: isLoadingContainers } = useQuery({
    queryKey: ['/api/paypal/containers'],
    retry: false,
  });

  // Initialize ecosystem mutation
  const initializeEcosystem = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/paypal/initialize-ecosystem', 'POST');
    },
    onSuccess: (data) => {
      toast({
        title: "PayPal Ecosystem Initialized!",
        description: `Successfully created ${data.totalContainers} PayPal containers across your ecosystem.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/paypal/containers'] });
    },
    onError: (error) => {
      toast({
        title: "Initialization Failed",
        description: "Failed to initialize PayPal ecosystem. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate sector containers mutation
  const generateSectorContainers = useMutation({
    mutationFn: async (sectorId: number) => {
      return await apiRequest(`/api/paypal/sector/${sectorId}/containers`, 'POST');
    },
    onSuccess: (data) => {
      toast({
        title: "Sector Containers Generated!",
        description: `Created ${data.containersGenerated} PayPal containers for sector ${data.sectorId}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/paypal/containers'] });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate sector containers. Please try again.",
        variant: "destructive",
      });
    },
  });

  const containers: PayPalContainer[] = containersData?.containers || [];
  const stats: ContainerStats = containersData?.stats || { sectorContainers: 0, brandContainers: 0, averagePrice: 0 };
  const totalContainers = containersData?.totalContainers || 0;

  return (
    <div className="space-y-6" data-testid="paypal-ecosystem-manager">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="card-total-containers">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Containers</p>
                <p className="text-2xl font-bold">{totalContainers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-sector-containers">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sector Containers</p>
                <p className="text-2xl font-bold">{stats.sectorContainers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-brand-containers">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Brand Containers</p>
                <p className="text-2xl font-bold">{stats.brandContainers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-average-price">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Price</p>
                <p className="text-2xl font-bold">${stats.averagePrice.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card data-testid="card-control-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            PayPal Ecosystem Control Panel
          </CardTitle>
          <CardDescription>
            Manage PayPal checkout containers for 7,000+ products across all sectors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => initializeEcosystem.mutate()}
              disabled={initializeEcosystem.isPending}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="button-initialize-ecosystem"
            >
              {initializeEcosystem.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="mr-2 h-4 w-4" />
              )}
              Initialize Full Ecosystem
            </Button>

            <Button
              onClick={() => setSelectedSector(selectedSector === 259 ? null : 259)}
              variant="outline"
              data-testid="button-gaming-sector"
            >
              Generate Gaming Sector
            </Button>

            <Button
              onClick={() => setSelectedSector(selectedSector === 266 ? null : 266)}
              variant="outline"
              data-testid="button-nutrition-sector"
            >
              Generate Nutrition Sector
            </Button>
          </div>

          {selectedSector && (
            <div className="pt-4 border-t">
              <Button
                onClick={() => generateSectorContainers.mutate(selectedSector)}
                disabled={generateSectorContainers.isPending}
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-generate-selected-sector"
              >
                {generateSectorContainers.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Package className="mr-2 h-4 w-4" />
                )}
                Generate Containers for Sector {selectedSector}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Containers List */}
      <Card data-testid="card-containers-list">
        <CardHeader>
          <CardTitle>Active PayPal Containers</CardTitle>
          <CardDescription>
            {containers.length > 0 ? 
              `Showing ${containers.length} containers (limited view for performance)` : 
              'No containers generated yet. Click "Initialize Full Ecosystem" to get started.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingContainers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading containers...</span>
            </div>
          ) : containers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {containers.map((container) => (
                <Card key={container.containerId} className="border-l-4 border-l-blue-500" data-testid={`container-${container.containerId}`}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={container.brandId ? "default" : "secondary"}>
                          {container.brandId ? "Brand" : "Sector"}
                        </Badge>
                        <span className="text-lg font-bold text-green-600">
                          ${container.price}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm">
                          {container.brandName || container.sectorName}
                        </h4>
                        {container.brandName && (
                          <p className="text-xs text-muted-foreground">
                            {container.sectorName}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Container ID: {container.containerId.split('-').slice(-1)[0]}
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full mt-2"
                        data-testid={`button-view-container-${container.containerId}`}
                      >
                        <CreditCard className="mr-2 h-3 w-3" />
                        View PayPal Button
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No PayPal containers found.</p>
              <p className="text-sm">Initialize the ecosystem to generate containers for your 7,000+ products.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}