import type { ComplianceLog } from "@shared/schema";

interface ComplianceLogProps {
  logs: ComplianceLog[];
}

export function ComplianceLogComponent({ logs }: ComplianceLogProps) {
  const getLogIcon = (type: string, status: string) => {
    if (status === 'success') return { icon: 'fas fa-check', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' };
    if (status === 'warning') return { icon: 'fas fa-exclamation-triangle', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' };
    if (status === 'error') return { icon: 'fas fa-times', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' };
    if (status === 'in-progress') return { icon: 'fas fa-sync', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' };
    return { icon: 'fas fa-info', color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' };
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="space-y-4">
      {logs.map((log) => {
        const { icon, color, bg, border } = getLogIcon(log.type, log.status);
        
        return (
          <div 
            key={log.id}
            className={`flex items-center justify-between p-4 ${bg} border ${border} rounded-lg`}
            data-testid={`compliance-log-${log.id}`}
          >
            <div className="flex items-center space-x-4">
              <div className={`${bg} p-2 rounded-lg`}>
                <i className={`${icon} ${color} ${log.status === 'in-progress' ? 'animate-spin' : ''}`}></i>
              </div>
              <div>
                <p className="text-foreground font-medium">{log.message}</p>
                {log.details && (
                  <p className="text-muted-foreground text-sm">{log.details}</p>
                )}
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(new Date(log.createdAt))}
            </span>
          </div>
        );
      })}
    </div>
  );
}
