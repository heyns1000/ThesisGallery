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
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <div className="gradient-border">
          <div className="gradient-border-inner p-4 text-center">
            <h1 className="text-xl font-bold text-primary">FAA™ Global</h1>
            <p className="text-xs text-muted-foreground mt-1">Document & Brand Management</p>
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
