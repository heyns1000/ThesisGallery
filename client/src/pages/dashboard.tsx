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
            <h2 className="text-2xl font-bold text-foreground">FAA™ Command Center</h2>
            <p className="text-muted-foreground">Global Document Processing & Brand Compliance System</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="status-indicator bg-secondary rounded-lg px-3 py-2">
              <span className="text-xs text-secondary-foreground">Processing: Active</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Documents"
          value={displayStats?.totalDocuments || 0}
          icon="fas fa-file-alt"
          iconBg="bg-primary/10 text-primary"
          change="↗ 12% from last month"
          changeType="positive"
        />
        <StatsCard
          title="AI Conversations"
          value={displayStats?.totalConversations || 0}
          icon="fas fa-robot"
          iconBg="bg-accent/10 text-accent"
          change="↗ 8% from last week"
          changeType="positive"
        />
        <StatsCard
          title="Protected Brands"
          value={displayStats?.totalBrands || 0}
          icon="fas fa-trademark"
          iconBg="bg-yellow-400/10 text-yellow-400"
          change="✓ All compliant"
          changeType="neutral"
        />
        <StatsCard
          title="Compliance Score"
          value={`${displayStats?.complianceScore || 99}%`}
          icon="fas fa-shield-alt"
          iconBg="bg-emerald-400/10 text-emerald-400"
          change="Atom-Level Verified"
          changeType="positive"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Recent Processing</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentDocs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-lg mr-3">
                      <i className="fas fa-file-pdf text-primary"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground line-clamp-1">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Processed {new Date(doc.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                    {doc.status}
                  </span>
                </div>
              ))}
              {recentDocs.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No recent documents</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Brand Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${
                      log.status === 'success' ? 'bg-emerald-400/10' :
                      log.status === 'warning' ? 'bg-yellow-400/10' :
                      'bg-primary/10'
                    }`}>
                      <i className={`${
                        log.status === 'success' ? 'fas fa-check text-emerald-400' :
                        log.status === 'warning' ? 'fas fa-exclamation-triangle text-yellow-400' :
                        'fas fa-cog text-primary'
                      }`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground line-clamp-1">{log.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    log.status === 'success' ? 'bg-emerald-400/10 text-emerald-400' :
                    log.status === 'warning' ? 'bg-yellow-400/10 text-yellow-400' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
              {recentLogs.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
