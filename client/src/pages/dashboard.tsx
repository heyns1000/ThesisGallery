import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { StatsCard } from "@/components/ui/stats-card";
import { useEffect, useState } from "react";
import type { SystemStats, Document, ComplianceLog } from "@shared/schema";

export default function Dashboard() {
  const { subscribe } = useWebSocket();
  const [realtimeStats, setRealtimeStats] = useState<SystemStats | null>(null);

  const { data: stats } = useQuery<SystemStats>({
    queryKey: ["/api/system/stats"],
  });

  const { data: recentDocs = [] } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    select: (data) => data.slice(0, 3),
  });

  const { data: recentLogs = [] } = useQuery<ComplianceLog[]>({
    queryKey: ["/api/compliance/logs"],
    select: (data) => data.slice(0, 3),
  });

  useEffect(() => {
    const unsubscribe = subscribe('system_stats', (data: SystemStats) => {
      setRealtimeStats(data);
    });
    return unsubscribe;
  }, [subscribe]);

  const displayStats = realtimeStats || stats;

  return (
    <div className="p-6">
      <header className="bg-card border-b border-border px-6 py-4 -mx-6 -mt-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">🌳 Fruitful Global Command Center</h2>
            <p className="text-muted-foreground">Master Hub for Business Ecosystem Integration - Sacred Baobab™ Foundation</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="status-indicator bg-secondary rounded-lg px-3 py-2">
              <span className="text-xs text-secondary-foreground">🟢 VaultMesh™: Active</span>
            </div>
            <div className="status-indicator bg-accent/10 rounded-lg px-3 py-2">
              <span className="text-xs text-accent">⚡ TreatySync: Online</span>
            </div>
            <button 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              data-testid="button-new-upload"
            >
              <i className="fas fa-plus mr-2"></i>New Upload
            </button>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatsCard
          title="Protected Brands"
          value={displayStats?.totalBrands || 9000}
          icon="fas fa-trademark"
          iconBg="bg-yellow-400/10 text-yellow-400"
          change="Global Expansion Target"
          changeType="positive"
        />
        <StatsCard
          title="Wildlife Nodes"
          value={displayStats?.totalWildlifeNodes || 45}
          icon="fas fa-tree"
          iconBg="bg-green-400/10 text-green-400"
          change="🌍 4 Regions Active"
          changeType="positive"
        />
        <StatsCard
          title="US States Ready"
          value={displayStats?.totalAmericanStates || 13}
          icon="fas fa-flag-usa"
          iconBg="bg-blue-400/10 text-blue-400"
          change="50 States Target"
          changeType="neutral"
        />
        <StatsCard
          title="VaultMesh™ Status"
          value={displayStats?.vaultMeshStatus === "active" ? "🟢 ACTIVE" : "⚪ OFFLINE"}
          icon="fas fa-cube"
          iconBg="bg-purple-400/10 text-purple-400"
          change="Diamond Tier"
          changeType="positive"
        />
        <StatsCard
          title="Sacred Foundation"
          value="🌳 BAOBAB™"
          icon="fas fa-seedling"
          iconBg="bg-amber-400/10 text-amber-400"
          change="Aug 7, 2021 - Kruger"
          changeType="positive"
        />
      </div>

      {/* Integrated Systems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-lg border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              🌍 Global Systems
            </h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Global View GPT</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">VaultMesh™ Bridge</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">TreatySync Protocol</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Synced</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              🇺🇸 Fruitful America™
            </h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Active States</span>
              <span className="font-semibold text-blue-600">13 / 50</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Quantum Nexus™</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Live</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Local Manufacturing</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Growing</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              🌳 Wildlife Grid
            </h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Core Nodes</span>
              <span className="font-semibold text-green-600">12 Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Deployment Regions</span>
              <span className="font-semibold text-green-600">4 Countries</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Omnidrop Kits</span>
              <span className="font-semibold text-purple-600">45 Deployed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Ecosystem Progress</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-400/10 p-2 rounded-lg mr-3">
                    <i className="fas fa-tree text-green-400"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Kenya Wildlife Deployment</p>
                    <p className="text-xs text-muted-foreground">Scroll ID: KENYA-FAAZ-4312</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-400/10 p-2 rounded-lg mr-3">
                    <i className="fas fa-flag-usa text-blue-400"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Arizona SolarCore™ Launch</p>
                    <p className="text-xs text-muted-foreground">Rand Index: 90% - Desert Modulars</p>
                  </div>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Live</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-purple-400/10 p-2 rounded-lg mr-3">
                    <i className="fas fa-cube text-purple-400"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">VaultMesh™ Diamond Tier</p>
                    <p className="text-xs text-muted-foreground">Treaty-driven execution mesh</p>
                  </div>
                </div>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Deployed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Sacred Foundation</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-amber-400/10 p-2 rounded-lg mr-3">
                    <i className="fas fa-seedling text-amber-400"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Baobab™ Tree Foundation</p>
                    <p className="text-xs text-muted-foreground">Kruger National Park - Aug 7, 2021</p>
                  </div>
                </div>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Divine</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-emerald-400/10 p-2 rounded-lg mr-3">
                    <i className="fas fa-shield-alt text-emerald-400"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Baobab Security Network™</p>
                    <p className="text-xs text-muted-foreground">120-country mapping active</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">Protected</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-yellow-400/10 p-2 rounded-lg mr-3">
                    <i className="fas fa-coins text-yellow-400"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">ABSA Verification Complete</p>
                    <p className="text-xs text-muted-foreground">H Schoeman - Account 9393313084</p>
                  </div>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
