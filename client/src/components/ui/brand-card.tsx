import { Badge } from "@/components/ui/badge";
import type { Brand } from "@shared/schema";

interface BrandCardProps {
  brands: Brand[];
  title: string;
  categoryBadge?: string;
  categoryColor?: string;
}

export function BrandCard({ brands, title, categoryBadge, categoryColor }: BrandCardProps) {
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'protected':
        return { color: 'bg-emerald-400', text: 'Protected' };
      case 'pending':
        return { color: 'bg-yellow-400', text: 'Pending' };
      case 'active':
        return { color: 'bg-emerald-400', text: 'Active' };
      case 'synced':
        return { color: 'bg-primary', text: 'Synced' };
      default:
        return { color: 'bg-muted-foreground', text: status };
    }
  };

  const getBrandIcon = (category: string, name: string) => {
    if (name.includes('FAA™')) return 'fas fa-shield-alt text-primary';
    if (name.includes('Compliance')) return 'fas fa-check-circle text-accent';
    if (name.includes('Verification')) return 'fas fa-atom text-primary';
    if (name.includes('Excel') || name.includes('Minerva')) return 'fas fa-vial text-yellow-400';
    if (name.includes('FUSIONBEAT')) return 'fas fa-music text-purple-400';
    if (name.includes('FRUITFUL')) return 'fas fa-seedling text-accent';
    return 'fas fa-trademark text-primary';
  };

  return (
    <div className="brand-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-foreground">{title}</h4>
        {categoryBadge && (
          <Badge className={categoryColor}>
            {categoryBadge}
          </Badge>
        )}
      </div>
      
      <div className="space-y-3">
        {brands.map((brand) => {
          const statusInfo = getStatusIndicator(brand.status);
          const iconClass = getBrandIcon(brand.category, brand.name);
          
          return (
            <div 
              key={brand.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              data-testid={`brand-item-${brand.id}`}
            >
              <div className="flex items-center space-x-3">
                <i className={iconClass}></i>
                <span className="text-foreground font-medium">{brand.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {brand.valuation ? (
                  <span className="text-xs text-muted-foreground">{brand.valuation}</span>
                ) : (
                  <>
                    <span className={`w-2 h-2 ${statusInfo.color} rounded-full animate-pulse`}></span>
                    <span className="text-xs text-muted-foreground">{statusInfo.text}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
