import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";
import { useEffect } from "react";
import { getContent } from "@/lib/appData";
import type { ProcessingQueue } from "@shared/schema";

export default function Automation() {
  const content = getContent('automation');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { subscribe } = useWebSocket();

  const { data: processingQueue = [], isLoading } = useQuery<ProcessingQueue[]>({
    queryKey: ["/api/processing/queue"],
  });

  const mailProcessMutation = useMutation({
    mutationFn: async (data: { emails?: any[] }) => {
      return await apiRequest("POST", "/api/mail/process", data);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/processing/queue"] });
      toast({ description: data.message || "Mail processing started" });
    },
    onError: (error: Error) => {
      toast({ 
        variant: "destructive",
        description: `Mail processing failed: ${error.message}` 
      });
    },
  });

  const createQueueItemMutation = useMutation({
    mutationFn: async (itemData: any) => {
      return await apiRequest("POST", "/api/processing/queue", itemData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/processing/queue"] });
      toast({ description: "Processing item queued successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        variant: "destructive",
        description: `Failed to queue item: ${error.message}` 
      });
    },
  });

  // Subscribe to real-time queue updates
  useEffect(() => {
    const unsubscribeQueueCreated = subscribe('queue_item_created', (data: ProcessingQueue) => {
      queryClient.setQueryData<ProcessingQueue[]>(["/api/processing/queue"], (old = []) => [data, ...old]);
      toast({ description: `New processing item: ${data.title}` });
    });

    const unsubscribeQueueUpdated = subscribe('queue_updated', (data: ProcessingQueue[]) => {
      queryClient.setQueryData(["/api/processing/queue"], data);
    });

    return () => {
      unsubscribeQueueCreated();
      unsubscribeQueueUpdated();
    };
  }, [subscribe, queryClient, toast]);

  const handleStartProcessing = () => {
    mailProcessMutation.mutate({ emails: [] });
  };

  const handleConfigureAutomation = () => {
    createQueueItemMutation.mutate({
      type: "configuration",
      title: "Automation engine configuration update",
      description: "Updating automation parameters and thresholds",
      progress: 0,
      status: "queued",
      estimatedTime: 5,
    });
  };

  const getStatusIcon = (status: string, progress?: number) => {
    switch (status) {
      case 'processing':
        return { icon: 'fas fa-sync animate-spin', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' };
      case 'completed':
        return { icon: 'fas fa-check', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' };
      case 'error':
        return { icon: 'fas fa-times', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' };
      case 'queued':
        return { icon: 'fas fa-clock', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' };
      default:
        return { icon: 'fas fa-info', color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'document':
        return 'fas fa-file-alt';
      case 'brand':
        return 'fas fa-seedling';
      case 'verification':
        return 'fas fa-shield-alt';
      case 'configuration':
        return 'fas fa-cog';
      default:
        return 'fas fa-tasks';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  // Calculate automation stats
  const activeItems = processingQueue.filter(item => item.status === 'processing').length;
  const completedToday = processingQueue.filter(item => {
    const today = new Date();
    const itemDate = new Date(item.updatedAt);
    return item.status === 'completed' && 
           itemDate.toDateString() === today.toDateString();
  }).length;
  const successRate = processingQueue.length > 0 
    ? Math.round((processingQueue.filter(item => item.status === 'completed').length / processingQueue.length) * 100)
    : 98;
  const queueLength = processingQueue.filter(item => item.status === 'queued').length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground" data-testid="text-automation-title">{content.sections.header.title}</h3>
            <p className="text-muted-foreground" data-testid="text-automation-subtitle">{content.sections.header.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleStartProcessing}
              disabled={mailProcessMutation.isPending}
              data-testid="button-start-processing"
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              <i className="fas fa-play mr-2"></i>
              {mailProcessMutation.isPending ? 'Starting...' : content.buttons.newWorkflow}
            </Button>
            <Button 
              onClick={handleConfigureAutomation}
              disabled={createQueueItemMutation.isPending}
              variant="secondary"
              data-testid="button-configure-automation"
            >
              <i className="fas fa-cog mr-2"></i>
              {createQueueItemMutation.isPending ? 'Configuring...' : content.buttons.settings}
            </Button>
          </div>
        </div>
      </div>

      {/* Automation Pipeline Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">Mail Feed Processor</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 text-sm">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Processed Today</span>
              <span className="text-foreground font-medium" data-testid="processed-today">{completedToday}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Success Rate</span>
              <span className="text-emerald-400 font-medium" data-testid="success-rate">{successRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Queue Length</span>
              <span className="text-primary font-medium" data-testid="queue-length">{queueLength}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">Brand Generation Engine</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Water the Seed</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-accent text-sm">Ready</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Brands Generated</span>
              <span className="text-foreground font-medium" data-testid="brands-generated">
                {processingQueue.filter(item => item.type === 'brand' && item.status === 'completed').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Protection Rate</span>
              <span className="text-emerald-400 font-medium">95.7%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pending Actions</span>
              <span className="text-yellow-400 font-medium" data-testid="pending-actions">
                {processingQueue.filter(item => item.type === 'brand' && item.status === 'queued').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Queue */}
      <div className="bg-card rounded-lg border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h4 className="text-lg font-semibold text-foreground">Active Processing Queue</h4>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-muted rounded-lg"></div>
                    <div>
                      <div className="h-4 bg-muted rounded w-48 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-32"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-muted rounded w-16 mb-1"></div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : processingQueue.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-robot text-muted-foreground text-6xl mb-4"></i>
              <h4 className="text-lg font-semibold text-foreground mb-2">No processing items in queue</h4>
              <p className="text-muted-foreground mb-6">
                Start processing or configure automation to see queue items
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button onClick={handleStartProcessing}>
                  <i className="fas fa-play mr-2"></i>
                  Start Processing
                </Button>
                <Button variant="outline" onClick={handleConfigureAutomation}>
                  <i className="fas fa-cog mr-2"></i>
                  Configure
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {processingQueue.map((item) => {
                const statusInfo = getStatusIcon(item.status || 'unknown', item.progress);
                const typeIcon = getTypeIcon(item.type);
                
                return (
                  <div 
                    key={item.id}
                    className={`flex items-center justify-between p-4 ${statusInfo.bg} border ${statusInfo.border} rounded-lg`}
                    data-testid={`queue-item-${item.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`${statusInfo.bg} p-2 rounded-lg`}>
                        <i className={`${statusInfo.icon} ${statusInfo.color}`}></i>
                      </div>
                      <div>
                        <p className="text-foreground font-medium">{item.title}</p>
                        {item.description && (
                          <p className="text-muted-foreground text-sm">{item.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {item.status === 'processing' && item.progress ? (
                        <>
                          <span className={`font-medium ${statusInfo.color}`}>{item.progress}%</span>
                          <p className="text-muted-foreground text-xs">
                            ETA: {item.estimatedTime ? `${item.estimatedTime} mins` : 'Unknown'}
                          </p>
                        </>
                      ) : item.status === 'queued' ? (
                        <>
                          <Badge variant="outline" className={statusInfo.color}>Queue</Badge>
                          <p className="text-muted-foreground text-xs">Waiting</p>
                        </>
                      ) : item.status === 'completed' ? (
                        <>
                          <Badge className="bg-emerald-400/10 text-emerald-400">Done</Badge>
                          <p className="text-muted-foreground text-xs">
                            {formatTimeAgo(new Date(item.updatedAt))}
                          </p>
                        </>
                      ) : (
                        <>
                          <Badge variant="secondary">{item.status}</Badge>
                          <p className="text-muted-foreground text-xs">
                            {formatTimeAgo(new Date(item.updatedAt))}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
