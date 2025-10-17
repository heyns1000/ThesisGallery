import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

type UserProfile = {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
};

const navItems = [
  { href: "/", label: "Dashboard", icon: "fas fa-tachometer-alt", id: "dashboard" },
  { href: "/documents", label: "Documents & Articles", icon: "fas fa-file-alt", id: "documents" },
  { href: "/gallery", label: "Visual Gallery", icon: "fas fa-images", id: "gallery" },
  { href: "/conversations", label: "AI Conversations", icon: "fas fa-comments", id: "conversations" },
  { href: "/brands", label: "Brand Management", icon: "fas fa-trademark", id: "brands" },
  { href: "/compliance", label: "Compliance Monitor", icon: "fas fa-shield-alt", id: "compliance" },
  { href: "/automation", label: "Automation Engine", icon: "fas fa-robot", id: "automation" },
  { href: "/global-view", label: "🌍 Global View GPT", icon: "fas fa-globe", id: "global-view" },
  { href: "/fruitful-america", label: "🇺🇸 Fruitful America™", icon: "fas fa-flag-usa", id: "fruitful-america" },
  { href: "/wildlife-dashboard", label: "🌳 Wildlife Grid", icon: "fas fa-tree", id: "wildlife-dashboard" },
  { href: "/payroll-dashboard", label: "🧬 Payroll OS", icon: "fas fa-calculator", id: "payroll-dashboard" },
  { href: "/mining-dashboard", label: "⛏️ Mining Ecosystem", icon: "fas fa-pickaxe", id: "mining-dashboard" },
  { href: "/housing-dashboard", label: "🏛️ Housing Sector", icon: "fas fa-home", id: "housing-dashboard" },
  { href: "/faa-realestate-platform", label: "🏠 FAA Real Estate AI™", icon: "fas fa-chart-area", id: "faa-realestate-platform" },
  { href: "/faa-global-industry-index", label: "🌍 FAA™ Global Industry Index", icon: "fas fa-globe", id: "faa-global-industry-index" },
  { href: "/github-repository-browser", label: "📂 GitHub Repository Browser", icon: "fab fa-github", id: "github-repository-browser" },
  { href: "/education-dashboard", label: "🧸 Education Sector", icon: "fas fa-graduation-cap", id: "education-dashboard" },
  { href: "/ai-logic-dashboard", label: "🧠 AI & Logic Grid", icon: "fas fa-brain", id: "ai-logic-dashboard" },
  { href: "/samfox-studio-platform", label: "🦁 SamFox Studio™", icon: "fas fa-copyright", id: "samfox-studio-platform" },
  { href: "/admin-portal", label: "🦁 Admin Portal", icon: "fas fa-shield-alt", id: "admin-portal" },
  { href: "/pulse-grid-dashboard", label: "🍇 PulseGrid Trading", icon: "fas fa-chart-line", id: "pulse-grid-dashboard" },
  { href: "/crate-dance-smart-grid", label: "🧩 Crate Dance Grid", icon: "fas fa-cubes", id: "crate-dance-smart-grid" },
  { href: "/crate-dance-africa", label: "🎭 Crate Dance™ Africa", icon: "fas fa-music", id: "crate-dance-africa" },
  { href: "/playing-with-the-seed", label: "🌱 Playing with the Seed", icon: "fas fa-seedling", id: "playing-with-the-seed" },
  { href: "/seedling-language-learning", label: "💬 Seedling Languages", icon: "fas fa-heart", id: "seedling-language-learning" },
  { href: "/data-pipeline", label: "🌳 Data Pipeline", icon: "fas fa-database", id: "data-pipeline" },
  { href: "/email-system", label: "📧 Enterprise Email", icon: "fas fa-envelope", id: "email-system" },
  { href: "/multi-channel-messaging", label: "💬 Multi-Channel Hub", icon: "fas fa-satellite-dish", id: "multi-channel-messaging" },
  { href: "/faa-youth-education-brands", label: "🧸 FAA Youth & Education Brands", icon: "fas fa-graduation-cap", id: "faa-youth-education-brands" },
  { href: "/fruitful-global-platform", label: "🍇 Fruitful Global Platform", icon: "fas fa-globe", id: "fruitful-global-platform" },
  { href: "/faa-tesis-omni-render", label: "📜 FAA Tesis Omni Render", icon: "fas fa-file-alt", id: "faa-tesis-omni-render" },
  { href: "/agriculture-biotech-platform", label: "🌾 Agriculture-Biotech Platform", icon: "fas fa-seedling", id: "agriculture-biotech-platform" },
  { href: "/strategic-sell-scroll", label: "🌕 Strategic Sell Scroll", icon: "fas fa-moon", id: "strategic-sell-scroll" },
  { href: "/eureka-cloudflow-dashboard", label: "🌊 Eureka Cloudflow", icon: "fas fa-cloud", id: "eureka-cloudflow-dashboard" },
  { href: "/daily-summary-extractor", label: "📔 Daily Summary Extractor", icon: "fas fa-book", id: "daily-summary-extractor" },
  { href: "/vault-payments", label: "💳 Vault Payments", icon: "fas fa-credit-card", id: "vault-payments" },
  { href: "/team-onboarding", label: "👥 Team Onboarding", icon: "fas fa-user-plus", id: "team-onboarding" },
  { href: "/contact-management", label: "📧 Contact Management", icon: "fas fa-address-book", id: "contact-management" },
  { href: "/banimal-platform", label: "🐾 Banimal™ FAA Platform", icon: "fas fa-shopping-cart", id: "banimal-platform" },
  { href: "/banimal-connector", label: "🔌 Banimal Connector", icon: "fas fa-plug", id: "banimal-connector" },
  { href: "/ecosystem-manager", label: "🌐 Ecosystem Manager", icon: "fas fa-network-wired", id: "ecosystem-manager" },
  { href: "/looppay-gallery", label: "💳 LoopPay™ Sovereign Portal", icon: "fas fa-credit-card", id: "looppay-gallery" },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { user: contextUser } = useAppContext();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const userProfile = user as UserProfile | undefined;

  return (
    <aside className="w-80 min-w-[20rem] bg-card border-r border-border flex flex-col h-screen relative z-10">
      <div className="p-6">
        <div className="gradient-border">
          <div className="gradient-border-inner p-4 text-center">
            <h1 className="text-xl font-bold text-primary">🌳 Fruitful Global</h1>
            <p className="text-xs text-muted-foreground mt-1">Master Hub & Ecosystem Platform</p>
          </div>
        </div>
        
        {/* Welcome Message from AppContext */}
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm font-medium text-primary" data-testid="text-welcome-message">
            Welcome, {contextUser.name}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{contextUser.email}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href;
          
          return (
            <Link key={item.id} href={item.href}>
              <div 
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                data-testid={`nav-link-${item.id}`}
              >
                <i className={`${item.icon} mr-3`}></i>
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-3">
        {/* User Info */}
        {userProfile && (
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                {userProfile.profileImageUrl ? (
                  <img 
                    src={userProfile.profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium">
                  {userProfile.firstName || userProfile.lastName 
                    ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim()
                    : userProfile.email || 'User'
                  }
                </p>
                {userProfile.email && (userProfile.firstName || userProfile.lastName) && (
                  <p className="text-xs text-muted-foreground">{userProfile.email}</p>
                )}
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              data-testid="button-logout"
            >
              <LogOut className="w-3 h-3 mr-1" />
              Sign Out
            </Button>
          </div>
        )}

        {/* System Status */}
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">System Status</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-xs text-accent ml-2">Online</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Atom-Level Verification™ Active</p>
        </div>
      </div>
    </aside>
  );
}
