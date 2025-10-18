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

type NavItem = {
  href: string;
  label: string;
  id: string;
  badge?: string;
};

type NavSection = {
  title: string;
  id: string;
  items: NavItem[];
  defaultCollapsed?: boolean;
};

const navSections: NavSection[] = [
  {
    title: "CORE NAVIGATION",
    id: "core-navigation",
    items: [
      { href: "/command-center", label: "Command Center", id: "command-center" },
      { href: "/dashboard", label: "Dashboard", id: "dashboard" },
      { href: "/portal", label: "Portal Home", id: "portal" },
      { href: "/documents", label: "Documents", id: "documents" },
      { href: "/gallery", label: "Visual Gallery", id: "gallery" },
      { href: "/conversations", label: "AI Conversations", id: "conversations" },
      { href: "/brands", label: "Brand Management", id: "brands" },
    ],
  },
  {
    title: "GLOBAL SYSTEMS",
    id: "global-systems",
    items: [
      { href: "/global-view", label: "Global View GPT", id: "global-view" },
      { href: "/fruitful-america", label: "Fruitful America™", id: "fruitful-america" },
      { href: "/fruitful-global-platform", label: "Fruitful Global Platform", id: "fruitful-global-platform" },
      { href: "/wildlife-dashboard", label: "Wildlife Grid", id: "wildlife-dashboard" },
      { href: "/analytics", label: "Analytics", id: "analytics" },
    ],
  },
  {
    title: "DEVELOPMENT PLATFORMS",
    id: "development-platforms",
    items: [
      { href: "/hotstack-platform", label: "HotStack™ Platform", id: "hotstack-platform" },
      { href: "/codenest-platform", label: "CodeNest Platform", id: "codenest-platform" },
      { href: "/buildnest-dashboard", label: "BuildNest Dashboard", id: "buildnest-dashboard" },
      { href: "/intern-portalnest", label: "PortalNest™ Interns", id: "intern-portalnest" },
      { href: "/github-repository-browser", label: "GitHub Browser", id: "github-repository-browser" },
    ],
  },
  {
    title: "SECTOR MANAGEMENT",
    id: "sector-management",
    items: [
      { href: "/sectors", label: "All Sectors", id: "sectors", badge: "48" },
      { href: "/sector-dashboard", label: "Sector Dashboard", id: "sector-dashboard" },
      { href: "/sector-mapping", label: "Sector Map", id: "sector-mapping" },
      { href: "/sector-list", label: "Sector List", id: "sector-list" },
    ],
  },
  {
    title: "FAA™ SYSTEMS",
    id: "faa-systems",
    items: [
      { href: "/faa-tesis-omni-render", label: "FAA™ Thesis Gallery", id: "faa-tesis-omni-render", badge: "$1000+" },
      { href: "/faa-realestate-platform", label: "FAA Real Estate AI™", id: "faa-realestate-platform" },
      { href: "/faa-global-industry-index", label: "FAA™ Global Index", id: "faa-global-industry-index" },
      { href: "/faa-youth-education-brands", label: "FAA Youth & Education", id: "faa-youth-education-brands" },
      { href: "/faa-intake-checklist", label: "FAA Intake", id: "faa-intake-checklist" },
      { href: "/faa-quantum-nexus", label: "FAA Quantum Nexus™", id: "faa-quantum-nexus" },
      { href: "/faa-subnodes", label: "FAA Subnodes", id: "faa-subnodes" },
    ],
  },
  {
    title: "AI & LOGIC SYSTEMS",
    id: "ai-logic-systems",
    items: [
      { href: "/ai-logic-dashboard", label: "AI & Logic Grid", id: "ai-logic-dashboard" },
      { href: "/omnilevel", label: "Omnilevel AI Logic", id: "omnilevel", badge: "31 Sectors" },
      { href: "/omnilevel-interstellar", label: "Omnilevel Interstellar", id: "omnilevel-interstellar" },
      { href: "/omnigrid-faa-zone", label: "OmniGrid™ FAA.zone™", id: "omnigrid-faa-zone" },
      { href: "/chatgpt-integration", label: "ChatGPT Lions", id: "chatgpt-integration", badge: "6 Soul-Injected" },
    ],
  },
  {
    title: "VAULTMESH & PAYMENTS",
    id: "vaultmesh-payments",
    items: [
      { href: "/vaultmesh", label: "VaultMesh™ Dashboard", id: "vaultmesh" },
      { href: "/vault-payments", label: "Vault Payments", id: "vault-payments" },
      { href: "/looppay-gallery", label: "LoopPay™ Portal", id: "looppay-gallery" },
      { href: "/payment-portal", label: "Payment Portal", id: "payment-portal" },
      { href: "/claimroot-checkout", label: "ClaimRoot Checkout", id: "claimroot-checkout" },
    ],
  },
  {
    title: "SPECIALIZED DASHBOARDS",
    id: "specialized-dashboards",
    items: [
      { href: "/payroll-dashboard", label: "Payroll OS", id: "payroll-dashboard" },
      { href: "/mining-dashboard", label: "Mining Ecosystem", id: "mining-dashboard" },
      { href: "/housing-dashboard", label: "Housing Sector", id: "housing-dashboard" },
      { href: "/education-dashboard", label: "Education Sector", id: "education-dashboard" },
      { href: "/pulse-grid-dashboard", label: "PulseGrid Trading", id: "pulse-grid-dashboard" },
      { href: "/heartbeat-dashboard", label: "Heartbeat Dashboard", id: "heartbeat-dashboard" },
    ],
  },
  {
    title: "ECOSYSTEM APPS",
    id: "ecosystem-apps",
    items: [
      { href: "/planet-change", label: "Planet.Change", id: "planet-change", badge: "Genesis" },
      { href: "/hsomni-integration", label: "HSOMNI 9000", id: "hsomni-integration", badge: "3,794 Brands" },
      { href: "/samfox-studio-platform", label: "SamFox Studio™", id: "samfox-studio-platform" },
      { href: "/banimal-platform", label: "Banimal™ FAA", id: "banimal-platform" },
      { href: "/banimal-connector", label: "Banimal Connector", id: "banimal-connector" },
      { href: "/smart-toys-platform", label: "Smart Toys™", id: "smart-toys-platform", badge: "5 Products" },
      { href: "/crate-dance-smart-grid", label: "Crate Dance Grid", id: "crate-dance-smart-grid" },
      { href: "/crate-dance-africa", label: "Crate Dance™ Africa", id: "crate-dance-africa" },
      { href: "/agriculture-biotech-platform", label: "Agriculture-Biotech", id: "agriculture-biotech-platform" },
      { href: "/fruitful-business-plan", label: "Business Plan", id: "fruitful-business-plan", badge: "R391M" },
      { href: "/fruitful-marketplace-marketing", label: "Marketplace", id: "fruitful-marketplace-marketing" },
      { href: "/motion-media-sonic", label: "Motion, Media & Sonic", id: "motion-media-sonic" },
    ],
  },
  {
    title: "INTEGRATION & OPERATIONS",
    id: "integration-operations",
    defaultCollapsed: true,
    items: [
      { href: "/ecosystem-manager", label: "Ecosystem Manager", id: "ecosystem-manager" },
      { href: "/deployment-dashboard", label: "Deployment", id: "deployment-dashboard" },
      { href: "/compliance", label: "Compliance", id: "compliance" },
      { href: "/automation", label: "Automation", id: "automation" },
      { href: "/data-pipeline", label: "Data Pipeline", id: "data-pipeline" },
      { href: "/eureka-cloudflow-dashboard", label: "Eureka Cloudflow", id: "eureka-cloudflow-dashboard" },
    ],
  },
  {
    title: "TOOLS & UTILITIES",
    id: "tools-utilities",
    defaultCollapsed: true,
    items: [
      { href: "/playing-with-the-seed", label: "Playing with Seed", id: "playing-with-the-seed" },
      { href: "/seedling-language-learning", label: "Seedling Languages", id: "seedling-language-learning", badge: "111" },
      { href: "/email-system", label: "Enterprise Email", id: "email-system" },
      { href: "/multi-channel-messaging", label: "Multi-Channel Hub", id: "multi-channel-messaging" },
      { href: "/daily-summary-extractor", label: "Daily Summary", id: "daily-summary-extractor" },
      { href: "/button-repair-dashboard", label: "Button Repair", id: "button-repair-dashboard" },
      { href: "/omniuniversal-button-validator", label: "Button Validator", id: "omniuniversal-button-validator" },
      { href: "/strategic-sell-scroll", label: "Strategic Sell Scroll", id: "strategic-sell-scroll" },
    ],
  },
  {
    title: "ADMIN & SETTINGS",
    id: "admin-settings",
    defaultCollapsed: true,
    items: [
      { href: "/admin-portal", label: "Admin Portal", id: "admin-portal" },
      { href: "/admin-settings", label: "Admin Settings", id: "admin-settings" },
      { href: "/settings", label: "Settings", id: "settings" },
      { href: "/team-onboarding", label: "Team Onboarding", id: "team-onboarding" },
      { href: "/contact-management", label: "Contact Management", id: "contact-management" },
      { href: "/scrollbinder-one", label: "ScrollBinder_One™", id: "scrollbinder-one" },
    ],
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { user: contextUser } = useAppContext();

  const defaultCollapsedSections = new Set(
    navSections.filter(section => section.defaultCollapsed).map(section => section.id)
  );
  
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(defaultCollapsedSections);

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

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
        
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm font-medium text-primary" data-testid="text-welcome-message">
            Welcome, {contextUser.name}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{contextUser.email}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-3 overflow-y-auto">
        {navSections.map((section) => {
          const isCollapsed = collapsedSections.has(section.id);
          
          return (
            <div key={section.id} className="space-y-1">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`section-toggle-${section.id}`}
              >
                <span>{section.title}</span>
                {isCollapsed ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>

              {!isCollapsed && (
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location === item.href;
                    
                    return (
                      <Link key={item.id} href={item.href}>
                        <div 
                          className={cn(
                            "flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                            isActive 
                              ? "bg-primary text-primary-foreground" 
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                          data-testid={`nav-link-${item.id}`}
                        >
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
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

        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">System Status</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-xs text-accent ml-2">Online</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">70+ Apps Connected</p>
        </div>
      </div>
    </aside>
  );
}
