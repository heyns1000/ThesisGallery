import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TreePine, Globe2, Rocket, Shield, Activity, Database,
  TrendingUp, Users, Zap, Check, Circle, Star
} from "lucide-react";

interface DashboardMetrics {
  globalExpansionTargets: number;
  activeBrands: number;
  aiMediaIntegration: number;
  diamondTierActive: boolean;
  activeSystems: number;
}

export default function CommandCenter() {
  // Fetch real-time metrics from the integrated ecosystem
  const { data: metrics } = useQuery<DashboardMetrics>({
    queryKey: ["/api/command-center/metrics"],
    initialData: {
      globalExpansionTargets: 271,
      activeBrands: 485,
      aiMediaIntegration: 13,
      diamondTierActive: true,
      activeSystems: 0,
    },
  });

  return (
    <div className="min-h-screen bg-background p-6 md:p-8" data-testid="command-center-container">
      {/* Header Section */}
      <div className="mb-8" data-testid="header-section">
        <div className="flex items-center gap-3 mb-2">
          <TreePine className="w-8 h-8" style={{ color: 'var(--vault-cyan)' }} data-testid="icon-tree-pine" />
          <h1 
            className="text-4xl font-bold bg-clip-text text-transparent"
            style={{
              background: 'linear-gradient(to right, var(--vault-cyan), var(--energetic-blue), var(--vault-cyan-light))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            data-testid="heading-command-center"
          >
            Fruitful Global Command Center
          </h1>
        </div>
        <p className="text-muted-foreground text-lg" data-testid="text-subtitle">
          Sacred Baobab™ Foundation • Complete Ecosystem Integration • VaultMesh™ Secured
        </p>
        <div className="flex gap-3 mt-4" data-testid="badges-container">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30" data-testid="badge-regions-active">
            <Activity className="w-3 h-3 mr-1" />
            8 Regions Active
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30" data-testid="badge-fruitful-planet-online">
            <Database className="w-3 h-3 mr-1" />
            FruitfulPlanet™ Online
          </Badge>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30" data-testid="badge-diamond-tier">
            <Shield className="w-3 h-3 mr-1" />
            Diamond Tier
          </Badge>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="metrics-grid">
        {/* Global Expansion Targets */}
        <Card 
          className="energetic-card border-l-4" 
          style={{ borderLeftColor: 'var(--vault-cyan)' }}
          data-testid="card-global-expansion"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Globe2 className="w-4 h-4" />
              Global Expansion Targets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="text-4xl font-bold mb-2"
              style={{ color: 'var(--vault-cyan)' }}
              data-testid="metric-global-expansion-targets"
            >
              {metrics?.globalExpansionTargets || 271}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-500" data-testid="text-regions-active">+15 Regions Active</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Brands */}
        <Card 
          className="energetic-card border-l-4" 
          style={{ borderLeftColor: 'var(--energetic-blue)' }}
          data-testid="card-active-brands"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Active Brands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="text-4xl font-bold mb-2"
              style={{ color: 'var(--energetic-blue)' }}
              data-testid="metric-active-brands"
            >
              {metrics?.activeBrands || 485}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-green-500" data-testid="text-fully-operational">Fully Operational</span>
            </div>
          </CardContent>
        </Card>

        {/* AI-Media Integration */}
        <Card 
          className="energetic-card border-l-4" 
          style={{ borderLeftColor: 'var(--energetic-amber)' }}
          data-testid="card-ai-media-integration"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" />
              AI-Media Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="text-4xl font-bold mb-2"
              style={{ color: 'var(--energetic-amber)' }}
              data-testid="metric-ai-media-integration"
            >
              {metrics?.aiMediaIntegration || 13}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4" style={{ color: 'var(--energetic-amber)' }} />
              <span className="text-muted-foreground" data-testid="text-ai-shields">AI Shields Integrated</span>
            </div>
          </CardContent>
        </Card>

        {/* Diamond Tier */}
        <Card 
          className="energetic-card border-l-4" 
          style={{ 
            borderLeftColor: 'hsl(270, 50%, 50%)',
            background: 'linear-gradient(to bottom right, hsla(270, 50%, 50%, 0.05), transparent)'
          }}
          data-testid="card-diamond-tier"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Diamond Tier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Circle className="w-3 h-3 fill-green-500 text-green-500 animate-pulse" />
              <div className="text-2xl font-bold text-green-500" data-testid="text-diamond-status">ACTIVE</div>
            </div>
            <div className="text-muted-foreground text-sm">
              <span className="text-2xl font-bold text-foreground" data-testid="metric-active-systems">{metrics?.activeSystems || 0}</span> Active Systems
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" data-testid="main-content-grid">
        {/* Global Systems */}
        <Card className="energetic-card" data-testid="card-global-systems">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5" style={{ color: 'var(--vault-cyan)' }} />
              <CardTitle>Global Systems</CardTitle>
            </div>
            <CardDescription>Core infrastructure and deployment networks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SystemItem label="Global Tree G1" status="active" count={6} />
            <SystemItem label="Regional Hubs" status="active" count={8} />
            <SystemItem label="Integration Mesh" status="active" count={24} />
            <SystemItem label="Deployment Zones" status="warning" count={3} />
          </CardContent>
        </Card>

        {/* Fruitful America™ */}
        <Card className="energetic-card" data-testid="card-fruitful-america">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" style={{ color: 'var(--energetic-blue)' }} />
              <CardTitle>Fruitful America™</CardTitle>
            </div>
            <CardDescription>Regional operations and market presence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SystemItem label="Market Hubs" status="active" count={14} />
            <SystemItem label="Supported Clients" status="active" count={7} />
            <SystemItem label="Local Repositories" status="active" count={3} />
            <SystemItem label="Real Merchandise" status="active" count={18} />
          </CardContent>
        </Card>

        {/* Wildlife Grid */}
        <Card className="energetic-card" data-testid="card-wildlife-grid">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TreePine className="w-5 h-5" style={{ color: 'var(--energetic-green)' }} />
              <CardTitle>Wildlife Grid</CardTitle>
            </div>
            <CardDescription>Conservation and biodiversity networks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SystemItem label="Core Nodes" status="active" count={7} />
            <SystemItem label="Protected Areas" status="active" count={12} />
            <SystemItem label="Conservation Grid" status="active" count={5} />
            <SystemItem label="Banimal APIs" status="active" count={8} />
          </CardContent>
        </Card>

        {/* Sacred Foundation */}
        <Card className="energetic-card" data-testid="card-sacred-foundation">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" style={{ color: 'var(--energetic-amber)' }} />
              <CardTitle>Sacred Foundation</CardTitle>
            </div>
            <CardDescription>Treaty systems and compliance frameworks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SystemItem label="Treaty Foundation" status="active" count={1} />
            <SystemItem label="Sacred Protocols" status="active" count={4} />
            <SystemItem label="Compliance Layer" status="active" count={2} />
            <SystemItem label="Guardian Babel™" status="active" count={1} />
          </CardContent>
        </Card>
      </div>

      {/* Ecosystem Progress */}
      <Card className="energetic-card" data-testid="card-ecosystem-progress">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" style={{ color: 'var(--vault-cyan)' }} />
                <CardTitle>Ecosystem Progress</CardTitle>
              </div>
              <CardDescription>Real-time integration and deployment status</CardDescription>
            </div>
            <Badge className="status-badge-green" data-testid="badge-integrated">
              98% Integrated
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ProgressItem 
              label="Brand Integration" 
              current={485} 
              total={500} 
              color="vault-cyan"
            />
            <ProgressItem 
              label="Database Deployment" 
              current={27} 
              total={27} 
              color="energetic-green"
            />
            <ProgressItem 
              label="API Route Coverage" 
              current={376} 
              total={380} 
              color="energetic-blue"
            />
            <ProgressItem 
              label="Asset Synchronization" 
              current={1247} 
              total={1250} 
              color="energetic-amber"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div 
        className="mt-8 p-6 rounded-xl border"
        style={{ 
          background: 'linear-gradient(to right, hsla(180, 100%, 41%, 0.1), hsla(203, 93%, 68%, 0.1), hsla(270, 50%, 50%, 0.1))',
          borderColor: 'hsla(180, 100%, 41%, 0.2)'
        }}
        data-testid="quick-actions-section"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-bold mb-1" data-testid="heading-operations">Command Center Operations</h3>
            <p className="text-muted-foreground" data-testid="text-operations-description">Access integrated ecosystem management tools</p>
          </div>
          <div className="flex gap-3">
            <Button 
              className="hover:opacity-90"
              style={{
                background: 'linear-gradient(to right, var(--vault-cyan), var(--energetic-blue))'
              }}
              data-testid="button-ecosystem-manager"
            >
              <Database className="w-4 h-4 mr-2" />
              Ecosystem Manager
            </Button>
            <Button 
              variant="outline" 
              className="border"
              style={{ 
                borderColor: 'hsla(180, 100%, 41%, 0.3)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsla(180, 100%, 41%, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              data-testid="button-team-portal"
            >
              <Users className="w-4 h-4 mr-2" />
              Team Portal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function SystemItem({ 
  label, 
  status, 
  count 
}: { 
  label: string; 
  status: 'active' | 'warning' | 'offline'; 
  count: number;
}) {
  const statusConfig = {
    active: { color: 'text-green-500', bgColor: 'bg-green-500', label: 'ACTIVE' },
    warning: { color: 'text-amber-500', bgColor: 'bg-amber-500', label: 'WARNING' },
    offline: { color: 'text-red-500', bgColor: 'bg-red-500', label: 'OFFLINE' },
  };

  const config = statusConfig[status];
  const itemId = label.toLowerCase().replace(/\s+/g, '-').replace(/™/g, '');

  return (
    <div 
      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
      data-testid={`system-${itemId}`}
    >
      <div className="flex items-center gap-3">
        <Circle className={`w-2 h-2 ${config.bgColor} rounded-full animate-pulse`} />
        <span className="font-medium" data-testid={`text-system-${itemId}`}>{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <Badge 
          variant="outline" 
          className={`${config.color} text-xs px-2`}
          data-testid={`badge-status-${itemId}`}
        >
          {config.label}
        </Badge>
        <span 
          className="text-sm font-bold text-muted-foreground min-w-[2rem] text-right"
          data-testid={`metric-count-${itemId}`}
        >
          {count}
        </span>
      </div>
    </div>
  );
}

function ProgressItem({ 
  label, 
  current, 
  total, 
  color 
}: { 
  label: string; 
  current: number; 
  total: number; 
  color: string;
}) {
  const percentage = Math.round((current / total) * 100);
  const itemId = label.toLowerCase().replace(/\s+/g, '-');
  
  const colorVars = {
    'vault-cyan': { 
      gradient: 'linear-gradient(to right, var(--vault-cyan), var(--vault-cyan-light))'
    },
    'energetic-green': { 
      gradient: 'linear-gradient(to right, var(--energetic-green), hsl(142, 76%, 46%))'
    },
    'energetic-blue': { 
      gradient: 'linear-gradient(to right, var(--energetic-blue), hsl(203, 93%, 78%))'
    },
    'energetic-amber': { 
      gradient: 'linear-gradient(to right, var(--energetic-amber), hsl(43, 96%, 66%))'
    },
  };

  const gradientStyle = colorVars[color as keyof typeof colorVars]?.gradient || colorVars['vault-cyan'].gradient;

  return (
    <div className="space-y-2" data-testid={`progress-${itemId}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium" data-testid={`text-progress-label-${itemId}`}>{label}</span>
        <span className="text-muted-foreground" data-testid={`text-progress-stats-${itemId}`}>
          {current.toLocaleString()} / {total.toLocaleString()} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div 
          className="h-full transition-all duration-1000 rounded-full"
          style={{ 
            width: `${percentage}%`,
            background: gradientStyle
          }}
          data-testid={`bar-progress-${itemId}`}
        />
      </div>
    </div>
  );
}
