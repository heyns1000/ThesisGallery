import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User, ChevronDown, ChevronUp } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";

type UserProfile = {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
  defaultCollapsed?: boolean;
};

type NavItem = {
  href: string;
  label: string;
  icon: string;
  id: string;
  badge?: string;
};

const navSections: NavSection[] = [
  {
    title: "CORE NAVIGATION",
    items: [
      { href: "/command-center", label: "Command Center", icon: "fas fa-home", id: "command-center" },
      { href: "/dashboard", label: "Dashboard", icon: "fas fa-tachometer-alt", id: "dashboard" },
      { href: "/portal", label: "Portal Home", icon: "fas fa-door-open", id: "portal" },
      { href: "/documents", label: "Documents", icon: "fas fa-file-alt", id: "documents" },
      { href: "/gallery", label: "Visual Gallery", icon: "fas fa-images", id: "gallery" },
      { href: "/conversations", label: "AI Conversations", icon: "fas fa-comments", id: "conversations" },
      { href: "/brands", label: "Brand Management", icon: "fas fa-trademark", id: "brands" },
    ],
  },
  {
    title: "GLOBAL SYSTEMS",
    items: [
      { href: "/global-view", label: "🌍 Global View GPT", icon: "fas fa-globe", id: "global-view" },
      { href: "/fruitful-america", label: "🇺🇸 Fruitful America™", icon: "fas fa-flag-usa", id: "fruitful-america" },
      { href: "/fruitful-global-platform", label: "🍇 Fruitful Global", icon: "fas fa-globe", id: "fruitful-global-platform" },
      { href: "/wildlife-dashboard", label: "🌳 Wildlife Grid", icon: "fas fa-tree", id: "wildlife-dashboard" },
      { href: "/analytics", label: "📊 Analytics", icon: "fas fa-chart-bar", id: "analytics" },
    ],
  },
  {
    title: "DEVELOPMENT PLATFORMS",
    items: [
      { href: "/hotstack-platform", label: "🔥 HotStack™ Platform", icon: "fas fa-fire", id: "hotstack-platform" },
      { href: "/codenest-platform", label: "💻 CodeNest Platform", icon: "fas fa-code", id: "codenest-platform" },
      { href: "/buildnest-dashboard", label: "🏗️ BuildNest Dashboard", icon: "fas fa-hammer", id: "buildnest-dashboard" },
      { href: "/intern-portalnest", label: "🎓 PortalNest™ Interns", icon: "fas fa-users", id: "intern-portalnest" },
      { href: "/github-repository-browser", label: "📂 GitHub Browser", icon: "fab fa-github", id: "github-repository-browser" },
    ],
  },
  {
    title: "SECTOR MANAGEMENT",
    items: [
      { href: "/sectors", label: "🗂️ All Sectors", icon: "fas fa-list", id: "sectors", badge: "48" },
      { href: "/sector-dashboard", label: "📊 Sector Dashboard", icon: "fas fa-chart-pie", id: "sector-dashboard" },
      { href: "/sector-mapping", label: "🌐 Sector Map", icon: "fas fa-project-diagram", id: "sector-mapping" },
      { href: "/sector-list", label: "📋 Sector List", icon: "fas fa-th-list", id: "sector-list" },
    ],
  },
  {
    title: "FAA™ SYSTEMS",
    items: [
      { href: "/faa-tesis-omni-render", label: "📜 FAA™ Thesis Gallery", icon: "fas fa-scroll", id: "faa-tesis-omni-render", badge: "$1000+" },
      { href: "/faa-realestate-platform", label: "🏠 FAA Real Estate AI™", icon: "fas fa-building", id: "faa-realestate-platform" },
      { href: "/faa-global-industry-index", label: "🌍 FAA™ Global Index", icon: "fas fa-industry", id: "faa-global-industry-index" },
      { href: "/faa-youth-education-brands", label: "🧸 FAA Youth & Education", icon: "fas fa-child", id: "faa-youth-education-brands" },
      { href: "/faa-intake-checklist", label: "✅ FAA Intake", icon: "fas fa-tasks", id: "faa-intake-checklist" },
      { href: "/faa-quantum-nexus", label: "🚀 FAA Quantum Nexus™", icon: "fas fa-atom", id: "faa-quantum-nexus" },
      { href: "/faa-subnodes", label: "🔗 FAA Subnodes", icon: "fas fa-sitemap", id: "faa-subnodes" },
    ],
  },
  {
    title: "AI & LOGIC SYSTEMS",
    items: [
      { href: "/ai-logic-dashboard", label: "🧠 AI & Logic Grid", icon: "fas fa-brain", id: "ai-logic-dashboard" },
      { href: "/omnilevel", label: "🧠 Omnilevel AI Logic", icon: "fas fa-robot", id: "omnilevel", badge: "31 Sectors" },
      { href: "/omnilevel-interstellar", label: "🚀 Omnilevel Interstellar", icon: "fas fa-space-shuttle", id: "omnilevel-interstellar" },
      { href: "/omnigrid-faa-zone", label: "🌐 OmniGrid™ FAA.zone™", icon: "fas fa-th", id: "omnigrid-faa-zone" },
      { href: "/chatgpt-integration", label: "🦁 ChatGPT Lions", icon: "fas fa-comment-dots", id: "chatgpt-integration", badge: "6 Soul-Injected" },
    ],
  },
  {
    title: "VAULTMESH & PAYMENTS",
    items: [
      { href: "/vaultmesh", label: "🌐 VaultMesh™ Dashboard", icon: "fas fa-shield-alt", id: "vaultmesh" },
      { href: "/vault-payments", label: "💳 Vault Payments", icon: "fas fa-credit-card", id: "vault-payments" },
      { href: "/looppay-gallery", label: "💳 LoopPay™ Portal", icon: "fas fa-wallet", id: "looppay-gallery" },
      { href: "/payment-portal", label: "💰 Payment Portal", icon: "fas fa-dollar-sign", id: "payment-portal" },
      { href: "/claimroot-checkout", label: "🔐 ClaimRoot Checkout", icon: "fas fa-lock", id: "claimroot-checkout" },
    ],
  },
  {
    title: "SPECIALIZED DASHBOARDS",
    items: [
      { href: "/payroll-dashboard", label: "🧬 Payroll OS", icon: "fas fa-calculator", id: "payroll-dashboard" },
      { href: "/mining-dashboard", label: "⛏️ Mining Ecosystem", icon: "fas fa-gem", id: "mining-dashboard" },
      { href: "/housing-dashboard", label: "🏛️ Housing Sector", icon: "fas fa-home", id: "housing-dashboard" },
      { href: "/education-dashboard", label: "🧸 Education Sector", icon: "fas fa-graduation-cap", id: "education-dashboard" },
      { href: "/pulse-grid-dashboard", label: "🍇 PulseGrid Trading", icon: "fas fa-chart-line", id: "pulse-grid-dashboard" },
      { href: "/heartbeat-dashboard", label: "❤️ Heartbeat Dashboard", icon: "fas fa-heartbeat", id: "heartbeat-dashboard" },
    ],
  },
  {
    title: "ECOSYSTEM APPS",
    items: [
      { href: "/planet-change", label: "🌍 Planet.Change", icon: "fas fa-leaf", id: "planet-change", badge: "Genesis" },
      { href: "/hsomni-integration", label: "🚀 HSOMNI 9000", icon: "fas fa-rocket", id: "hsomni-integration", badge: "3,794 Brands" },
      { href: "/samfox-studio-platform", label: "🦁 SamFox Studio™", icon: "fas fa-paint-brush", id: "samfox-studio-platform" },
      { href: "/banimal-platform", label: "🐾 Banimal™ FAA", icon: "fas fa-paw", id: "banimal-platform" },
      { href: "/banimal-connector", label: "🔌 Banimal Connector", icon: "fas fa-plug", id: "banimal-connector" },
      { href: "/smart-toys-platform", label: "🧸 Smart Toys™", icon: "fas fa-dice", id: "smart-toys-platform", badge: "5 Products" },
      { href: "/crate-dance-smart-grid", label: "🧩 Crate Dance Grid", icon: "fas fa-cubes", id: "crate-dance-smart-grid" },
      { href: "/crate-dance-africa", label: "🎭 Crate Dance™ Africa", icon: "fas fa-drum", id: "crate-dance-africa" },
      { href: "/agriculture-biotech-platform", label: "🌾 Agriculture-Biotech", icon: "fas fa-tractor", id: "agriculture-biotech-platform" },
      { href: "/fruitful-business-plan", label: "💼 Business Plan", icon: "fas fa-briefcase", id: "fruitful-business-plan", badge: "R391M" },
      { href: "/fruitful-marketplace-marketing", label: "🛒 Marketplace", icon: "fas fa-shopping-cart", id: "fruitful-marketplace-marketing" },
      { href: "/motion-media-sonic", label: "🎬 Motion, Media & Sonic", icon: "fas fa-film", id: "motion-media-sonic" },
    ],
  },
  {
    title: "INTEGRATION & OPERATIONS",
    defaultCollapsed: true,
    items: [
      { href: "/ecosystem-manager", label: "🌐 Ecosystem Manager", icon: "fas fa-network-wired", id: "ecosystem-manager" },
      { href: "/deployment-dashboard", label: "🚀 Deployment", icon: "fas fa-server", id: "deployment-dashboard" },
      { href: "/compliance", label: "🛡️ Compliance", icon: "fas fa-shield-alt", id: "compliance" },
      { href: "/automation", label: "🤖 Automation", icon: "fas fa-robot", id: "automation" },
      { href: "/data-pipeline", label: "🌳 Data Pipeline", icon: "fas fa-database", id: "data-pipeline" },
      { href: "/eureka-cloudflow-dashboard", label: "🌊 Eureka Cloudflow", icon: "fas fa-cloud", id: "eureka-cloudflow-dashboard" },
    ],
  },
  {
    title: "TOOLS & UTILITIES",
    defaultCollapsed: true,
    items: [
      { href: "/playing-with-the-seed", label: "🌱 Playing with Seed", icon: "fas fa-seedling", id: "playing-with-the-seed" },
      { href: "/seedling-language-learning", label: "💬 Seedling Languages", icon: "fas fa-language", id: "seedling-language-learning", badge: "111" },
      { href: "/email-system", label: "📧 Enterprise Email", icon: "fas fa-envelope", id: "email-system" },
      { href: "/multi-channel-messaging", label: "💬 Multi-Channel Hub", icon: "fas fa-comments", id: "multi-channel-messaging" },
      { href: "/daily-summary-extractor", label: "📔 Daily Summary", icon: "fas fa-book", id: "daily-summary-extractor" },
      { href: "/button-repair-dashboard", label: "🔧 Button Repair", icon: "fas fa-wrench", id: "button-repair-dashboard" },
      { href: "/omniuniversal-button-validator", label: "🧬 Button Validator", icon: "fas fa-check-circle", id: "omniuniversal-button-validator" },
      { href: "/strategic-sell-scroll", label: "🌕 Strategic Sell Scroll", icon: "fas fa-moon", id: "strategic-sell-scroll" },
    ],
  },
  {
    title: "ADMIN & SETTINGS",
    defaultCollapsed: true,
    items: [
      { href: "/admin-portal", label: "🦁 Admin Portal", icon: "fas fa-user-shield", id: "admin-portal" },
      { href: "/admin-settings", label: "⚙️ Admin Settings", icon: "fas fa-cog", id: "admin-settings" },
      { href: "/settings", label: "🔧 Settings", icon: "fas fa-sliders-h", id: "settings" },
      { href: "/team-onboarding", label: "👥 Team Onboarding", icon: "fas fa-user-plus", id: "team-onboarding" },
      { href: "/contact-management", label: "📧 Contact Management", icon: "fas fa-address-book", id: "contact-management" },
      { href: "/scrollbinder-one", label: "📜 ScrollBinder_One™", icon: "fas fa-file-contract", id: "scrollbinder-one" },
    ],
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { user: contextUser } = useAppContext();
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(navSections.filter(s => s.defaultCollapsed).map(s => s.title))
  );

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const toggleSection = (title: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const userProfile = user as UserProfile | undefined;

  return (
    <aside className="w-80 min-w-[20rem] bg-card border-r border-border flex flex-col h-screen relative z-10">
      <div className="p-6">
        <div className="gradient-border">
          <div className="gradient-border-inner p-4 text-center">
            <h1 className="text-xl font-bold text-primary">🌳 Fruitful Global</h1>
            <p className="text-xs text-muted-foreground mt-1">Master Hub & Ecosystem Platform</p>
            <p className="text-xs text-vault-cyan mt-1 font-semibold">HSOMNI9000 Complete System</p>
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

      <nav className="flex-1 px-4 space-y-4 overflow-y-auto">
        {navSections.map((section) => {
          const isCollapsed = collapsedSections.has(section.title);
          
          return (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full px-2 py-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`section-toggle-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span>{section.title}</span>
                {isCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
              </button>
              
              {!isCollapsed && (
                <div className="mt-2 space-y-1">
                  {section.items.map((item) => {
                    const isActive = location === item.href;
                    
                    return (
                      <Link key={item.id} href={item.href}>
                        <div 
                          className={cn(
                            "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                            isActive 
                              ? "bg-primary text-primary-foreground" 
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                          data-testid={`nav-link-${item.id}`}
                        >
                          <div className="flex items-center">
                            <i className={`${item.icon} mr-2 text-xs`}></i>
                            <span className="text-xs">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-xs bg-vault-cyan/20 text-vault-cyan px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
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
          <p className="text-xs text-vault-cyan mt-1">70+ Apps Connected</p>
        </div>
      </div>
    </aside>
  );
}
