import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { BrandCard } from "@/components/ui/brand-card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getContent } from "@/lib/appData";
import type { Brand } from "@shared/schema";

export default function Brands() {
  const content = getContent('brands');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: brands = [], isLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const exposeBrandsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/brands/expose", {});
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      toast({ description: data.message || "Brands exposed successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        variant: "destructive",
        description: `Failed to expose brands: ${error.message}` 
      });
    },
  });

  const seedBrandsMutation = useMutation({
    mutationFn: async (seedData: { category: string; baseName: string }) => {
      return await apiRequest("POST", "/api/brands/seed", seedData);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      toast({ description: data.message || "Brand seeds generated successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        variant: "destructive",
        description: `Failed to seed brands: ${error.message}` 
      });
    },
  });

  const handleWaterSeed = () => {
    const seedData = {
      category: "entertainment",
      baseName: "VIBE"
    };
    seedBrandsMutation.mutate(seedData);
  };

  const handleRevealBrands = () => {
    exposeBrandsMutation.mutate();
  };

  // Group brands by category
  const brandsByCategory = brands.reduce((acc, brand) => {
    const category = brand.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(brand);
    return acc;
  }, {} as Record<string, Brand[]>);

  const coreBrands = brandsByCategory.core || [];
  const miningBrands = brandsByCategory.mining || [];
  const entertainmentBrands = brandsByCategory.entertainment || brandsByCategory.generated || [];

  // Calculate stats
  const totalBrands = brands.length;
  const protectedBrands = brands.filter(b => b.status === 'protected').length;
  const pendingBrands = brands.filter(b => b.status === 'pending').length;
  const totalValuation = brands
    .filter(b => b.valuation)
    .reduce((sum, b) => {
      const val = b.valuation?.replace(/[^\d.]/g, '') || '0';
      return sum + parseFloat(val);
    }, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground" data-testid="text-brands-title">{content.sections.header.title}</h3>
            <p className="text-muted-foreground" data-testid="text-brands-subtitle">{content.sections.header.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleWaterSeed}
              disabled={seedBrandsMutation.isPending}
              data-testid="button-water-seed"
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              <i className="fas fa-plus mr-2"></i>
              {seedBrandsMutation.isPending ? 'Seeding...' : content.buttons.waterSeed}
            </Button>
            <Button 
              onClick={handleRevealBrands}
              disabled={exposeBrandsMutation.isPending}
              data-testid="button-reveal-brands"
              className="bg-accent text-accent-foreground hover:opacity-90"
            >
              <i className="fas fa-eye mr-2"></i>
              {exposeBrandsMutation.isPending ? 'Revealing...' : content.buttons.revealBrands}
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg p-6 border border-border animate-pulse">
              <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-12 bg-muted/30 rounded-lg"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center py-12">
          <i className="fas fa-trademark text-muted-foreground text-6xl mb-4"></i>
          <h4 className="text-lg font-semibold text-foreground mb-2">No brands found</h4>
          <p className="text-muted-foreground mb-6">
            Start by generating your first brand seeds or revealing existing brands
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button onClick={handleWaterSeed}>
              <i className="fas fa-plus mr-2"></i>
              Water the Seed
            </Button>
            <Button variant="outline" onClick={handleRevealBrands}>
              <i className="fas fa-eye mr-2"></i>
              Reveal Brands
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Brand Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {coreBrands.length > 0 && (
              <BrandCard
                brands={coreBrands}
                title="Core FAA™ Brands"
                categoryBadge="Active"
                categoryColor="bg-emerald-400/10 text-emerald-400"
              />
            )}
            
            {miningBrands.length > 0 && (
              <BrandCard
                brands={miningBrands}
                title="Mining Sector"
                categoryBadge={`${miningBrands.length} Brands`}
                categoryColor="bg-yellow-400/10 text-yellow-400"
              />
            )}
            
            {entertainmentBrands.length > 0 && (
              <BrandCard
                brands={entertainmentBrands}
                title="Entertainment"
                categoryBadge="New"
                categoryColor="bg-purple-400/10 text-purple-400"
              />
            )}
          </div>

          {/* Brand Analytics */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h4 className="text-lg font-semibold text-foreground mb-4">Brand Portfolio Analytics</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center" data-testid="stat-total-brands">
                <div className="text-3xl font-bold text-primary">{totalBrands}</div>
                <p className="text-muted-foreground text-sm">Total Brands</p>
              </div>
              <div className="text-center" data-testid="stat-protected-brands">
                <div className="text-3xl font-bold text-accent">{protectedBrands}</div>
                <p className="text-muted-foreground text-sm">Protected</p>
              </div>
              <div className="text-center" data-testid="stat-pending-brands">
                <div className="text-3xl font-bold text-yellow-400">{pendingBrands}</div>
                <p className="text-muted-foreground text-sm">Pending</p>
              </div>
              <div className="text-center" data-testid="stat-total-valuation">
                <div className="text-3xl font-bold text-emerald-400">
                  {totalValuation > 1000000000 
                    ? `R${(totalValuation / 1000000000).toFixed(1)}B`
                    : totalValuation > 1000000
                    ? `R${(totalValuation / 1000000).toFixed(0)}M`
                    : totalValuation > 0
                    ? `R${totalValuation.toFixed(0)}`
                    : 'R0'
                  }
                </div>
                <p className="text-muted-foreground text-sm">Total Valuation</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
