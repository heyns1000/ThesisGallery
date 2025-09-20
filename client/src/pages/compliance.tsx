import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ComplianceLogComponent } from "@/components/ui/compliance-log";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";
import { useEffect } from "react";
import { getContent } from "@/lib/appData";
import type { ComplianceLog } from "@shared/schema";

export default function Compliance() {
  const content = getContent('compliance');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { subscribe } = useWebSocket();

  const { data: complianceLogs = [], isLoading } = useQuery<ComplianceLog[]>({
    queryKey: ["/api/compliance/logs"],
  });

  const atomVerifyMutation = useMutation({
    mutationFn: async (data: { entityId: string; entityType: string }) => {
      return await apiRequest("POST", "/api/compliance/atom-verify", data);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/compliance/logs"] });
      toast({ description: `Atom-Level Verification™ completed: ${data.verificationScore}%` });
    },
    onError: (error: Error) => {
      toast({ 
        variant: "destructive",
        description: `Verification failed: ${error.message}` 
      });
    },
  });

  // Subscribe to real-time compliance updates
  useEffect(() => {
    const unsubscribe = subscribe('compliance_log_created', (data: ComplianceLog) => {
      queryClient.setQueryData<ComplianceLog[]>(["/api/compliance/logs"], (old = []) => [data, ...old]);
      toast({ description: `New compliance log: ${data.message}` });
    });
    return unsubscribe;
  }, [subscribe, queryClient, toast]);

  const handleAtomVerification = () => {
    atomVerifyMutation.mutate({
      entityId: 'global-system',
      entityType: 'system'
    });
  };

  const runComplianceAudit = async () => {
    try {
      await apiRequest("POST", "/api/compliance/logs", {
        type: "audit",
        message: "Global compliance audit initiated",
        status: "in-progress"
      });
      
      toast({ description: "Compliance audit started" });
      queryClient.invalidateQueries({ queryKey: ["/api/compliance/logs"] });
    } catch (error) {
      toast({ 
        variant: "destructive", 
        description: "Failed to start audit" 
      });
    }
  };

  // Calculate stats from logs
  const successLogs = complianceLogs.filter(log => log.status === 'success').length;
  const warningLogs = complianceLogs.filter(log => log.status === 'warning').length;
  const activeAudits = complianceLogs.filter(log => log.status === 'in-progress').length;
  const complianceScore = complianceLogs.length > 0 
    ? Math.round((successLogs / Math.max(complianceLogs.length, 1)) * 100)
    : 99;

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground" data-testid="text-compliance-title">{content.sections.header.title}</h3>
            <p className="text-muted-foreground" data-testid="text-compliance-subtitle">{content.sections.header.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 text-sm font-medium">All Systems Operational</span>
            </div>
            <Button 
              onClick={handleAtomVerification}
              disabled={atomVerifyMutation.isPending}
              data-testid="button-atom-verify"
            >
              <i className="fas fa-atom mr-2"></i>
              {atomVerifyMutation.isPending ? 'Verifying...' : 'Atom Verify'}
            </Button>
            <Button 
              variant="outline"
              onClick={runComplianceAudit}
              data-testid="button-run-audit"
            >
              <i className="fas fa-search mr-2"></i>
              Run Audit
            </Button>
          </div>
        </div>
      </div>

      {/* Compliance Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">Verification Status</h4>
            <i className="fas fa-shield-alt text-emerald-400 text-xl"></i>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-400 mb-2" data-testid="compliance-score">
              {complianceScore}%
            </div>
            <p className="text-muted-foreground">Atom-Level Verified</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">Active Audits</h4>
            <i className="fas fa-search text-primary text-xl"></i>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2" data-testid="active-audits">
              {activeAudits}
            </div>
            <p className="text-muted-foreground">In Progress</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">Global Coverage</h4>
            <i className="fas fa-globe text-accent text-xl"></i>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">120+</div>
            <p className="text-muted-foreground">Countries</p>
          </div>
        </div>
      </div>

      {/* Compliance Log */}
      <div className="bg-card rounded-lg border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h4 className="text-lg font-semibold text-foreground">Real-time Compliance Log</h4>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-muted rounded-lg"></div>
                    <div>
                      <div className="h-4 bg-muted rounded w-48 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : complianceLogs.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-shield-alt text-muted-foreground text-6xl mb-4"></i>
              <h4 className="text-lg font-semibold text-foreground mb-2">No compliance logs yet</h4>
              <p className="text-muted-foreground mb-6">
                Start by running an atom-level verification or compliance audit
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button onClick={handleAtomVerification}>
                  <i className="fas fa-atom mr-2"></i>
                  Start Verification
                </Button>
                <Button variant="outline" onClick={runComplianceAudit}>
                  <i className="fas fa-search mr-2"></i>
                  Run Audit
                </Button>
              </div>
            </div>
          ) : (
            <ComplianceLogComponent logs={complianceLogs} />
          )}
        </div>
      </div>
    </div>
  );
}
