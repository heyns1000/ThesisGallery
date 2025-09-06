import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

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
  { href: "/education-dashboard", label: "🧸 Education Sector", icon: "fas fa-graduation-cap", id: "education-dashboard" },
  { href: "/ai-logic-dashboard", label: "🧠 AI & Logic Grid", icon: "fas fa-brain", id: "ai-logic-dashboard" },
  { href: "/admin-portal", label: "🦁 Admin Portal", icon: "fas fa-shield-alt", id: "admin-portal" },
  { href: "/pulse-grid-dashboard", label: "🍇 PulseGrid Trading", icon: "fas fa-chart-line", id: "pulse-grid-dashboard" },
  { href: "/crate-dance-smart-grid", label: "🧩 Crate Dance Grid", icon: "fas fa-cubes", id: "crate-dance-smart-grid" },
  { href: "/crate-dance-africa", label: "🎭 Crate Dance™ Africa", icon: "fas fa-music", id: "crate-dance-africa" },
  { href: "/vault-payments", label: "💳 Vault Payments", icon: "fas fa-credit-card", id: "vault-payments" },
  { href: "/team-onboarding", label: "👥 Team Onboarding", icon: "fas fa-user-plus", id: "team-onboarding" },
  { href: "/contact-management", label: "📧 Contact Management", icon: "fas fa-address-book", id: "contact-management" },
  { href: "/banimal-platform", label: "🐾 Banimal™ FAA Platform", icon: "fas fa-shopping-cart", id: "banimal-platform" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <div className="gradient-border">
          <div className="gradient-border-inner p-4 text-center">
            <h1 className="text-xl font-bold text-primary">🌳 Fruitful Global</h1>
            <p className="text-xs text-muted-foreground mt-1">Master Hub & Ecosystem Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          
          return (
            <Link key={item.id} href={item.href}>
              <a 
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                data-testid={`nav-link-${item.id}`}
              >
                <i className={`${item.icon} mr-3`}></i>
                {item.label}
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
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
