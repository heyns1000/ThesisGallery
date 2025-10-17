import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle2, Rocket, TrendingUp, Shield, Users, Activity } from "lucide-react";
import type { 
  IntegrationProposal, 
  TreatyScroll, 
  LiberationProtocol,
  LiberationEvent,
  CommunityAgent,
  SectorIntelligence
} from "@shared/schema";

export default function HsomniIntegration() {
  const { subscribe } = useWebSocket();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [realtimeUpdate, setRealtimeUpdate] = useState<any>(null);

  const { data: proposals = [], isLoading: proposalsLoading } = useQuery<IntegrationProposal[]>({
    queryKey: ["/api/hsomni/integration-proposals"],
  });

  const { data: treatyScrolls = [], isLoading: scrollsLoading } = useQuery<TreatyScroll[]>({
    queryKey: ["/api/hsomni/treaty-scrolls"],
  });

  const { data: liberationProtocols = [], isLoading: protocolsLoading } = useQuery<LiberationProtocol[]>({
    queryKey: ["/api/hsomni/liberation-protocols"],
  });

  const { data: liberationEvents = [], isLoading: eventsLoading } = useQuery<LiberationEvent[]>({
    queryKey: ["/api/hsomni/liberation-events"],
  });

  const { data: communityAgents = [], isLoading: agentsLoading } = useQuery<CommunityAgent[]>({
    queryKey: ["/api/hsomni/community-agents"],
  });

  const { data: sectorIntelligence = [], isLoading: intelligenceLoading } = useQuery<SectorIntelligence[]>({
    queryKey: ["/api/hsomni/sector-intelligence"],
  });

  const { data: stats } = useQuery<any>({
    queryKey: ["/api/hsomni/stats"],
  });

  const activateProtocolMutation = useMutation({
    mutationFn: async (protocolId: string) => {
      return await apiRequest("POST", "/api/hsomni/liberation-protocols/activate", { protocolId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hsomni/liberation-protocols"] });
      toast({ description: "Liberation protocol activated successfully!" });
    },
    onError: (error: Error) => {
      toast({ 
        variant: "destructive",
        description: `Failed to activate protocol: ${error.message}` 
      });
    },
  });

  useEffect(() => {
    const unsubscribe = subscribe('hsomni_update', (data: any) => {
      setRealtimeUpdate(data);
    });
    return unsubscribe;
  }, [subscribe]);

  const latestProposal = proposals[0];
  const activeAgentsCount = communityAgents.filter(a => a.agentStatus?.toUpperCase() === 'ACTIVE').length;

  const isLoading = proposalsLoading || scrollsLoading || protocolsLoading || 
                    eventsLoading || agentsLoading || intelligenceLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-400">Loading HSOMNI 9000 Integration...</p>
          </div>
        </div>
      </div>
    );
  }

  const getProtocolStatusColor = (status: string) => {
    const s = status?.toUpperCase();
    if (s?.includes('ARMED')) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (s?.includes('ACTIVE')) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (s?.includes('READY')) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (s?.includes('OPERATIONAL')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-950/50 to-blue-950/50 border border-cyan-500/20 px-6 py-4 -mx-6 -mt-6 mb-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400 mb-2 flex items-center gap-2" data-testid="text-hsomni-title">
              <Rocket className="w-8 h-8" />
              REPLIT x HSOMNI 9000 Integration Proposal
            </h1>
            <p className="text-gray-400" data-testid="text-hsomni-subtitle">
              Universal Platform Integration with FAA.ZONE™ Treaty Scroll & Sector Mapping
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
              <span className="text-sm text-cyan-400">🚀 Status: PROPOSED</span>
            </div>
          </div>
        </div>
      </header>

      {/* Executive Summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6" data-testid="section-executive-summary">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">Executive Summary</h2>
        <div className="bg-black/50 border border-cyan-500/20 rounded-lg p-4">
          <p className="text-gray-300 mb-4">
            {latestProposal?.executiveSummary || 
              "Integration of 9000 brands into unified platform ecosystem. Comprehensive market access, contact processing, and real-time sector intelligence with automated legal compliance."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Total Brands</p>
              <p className="text-2xl font-bold text-emerald-400">{stats?.totalBrands || 9000}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Platform Count</p>
              <p className="text-2xl font-bold text-blue-400">{stats?.platformCount || 12}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Active Proposals</p>
              <p className="text-2xl font-bold text-purple-400">{stats?.activeProposals || 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Overview */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6" data-testid="section-integration-overview">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">Core Systems Integration</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-6 bg-black/50 rounded-lg">
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-6 py-3 text-center">
            <p className="text-sm text-gray-400">Platform</p>
            <p className="text-lg font-bold text-emerald-400">Replit</p>
          </div>
          <div className="text-2xl text-cyan-400">→</div>
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-6 py-3 text-center">
            <p className="text-sm text-gray-400">Integration Hub</p>
            <p className="text-lg font-bold text-blue-400">HSOMNI 9000</p>
          </div>
          <div className="text-2xl text-cyan-400">→</div>
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg px-6 py-3 text-center">
            <p className="text-sm text-gray-400">Framework</p>
            <p className="text-lg font-bold text-purple-400">FAA.ZONE</p>
          </div>
          <div className="text-2xl text-cyan-400">→</div>
          <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg px-6 py-3 text-center">
            <p className="text-sm text-gray-400">Compliance</p>
            <p className="text-lg font-bold text-amber-400">Treaty Scroll</p>
          </div>
        </div>
      </div>

      {/* Strategic Value Proposition */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6" data-testid="section-strategic-value">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">Strategic Value Proposition</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-lg p-4" data-testid="value-market-access">
            <TrendingUp className="w-8 h-8 text-emerald-400 mb-3" />
            <p className="text-sm text-gray-400 mb-1">Market Access</p>
            <p className="text-2xl font-bold text-emerald-400">{stats?.marketAccess || 'R950 Billion'}</p>
            <p className="text-xs text-gray-500 mt-2">Comprehensive market reach across all sectors</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4" data-testid="value-contact-processing">
            <Activity className="w-8 h-8 text-blue-400 mb-3" />
            <p className="text-sm text-gray-400 mb-1">Contact Processing</p>
            <p className="text-2xl font-bold text-blue-400">{stats?.contactProcessing || '11M+'}</p>
            <p className="text-xs text-gray-500 mt-2">Real-time contact management system</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4" data-testid="value-sector-intelligence">
            <Shield className="w-8 h-8 text-purple-400 mb-3" />
            <p className="text-sm text-gray-400 mb-1">Sector Intelligence</p>
            <p className="text-2xl font-bold text-purple-400">Real-time</p>
            <p className="text-xs text-gray-500 mt-2">Advanced mapping across all industries</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg p-4" data-testid="value-legal-compliance">
            <CheckCircle2 className="w-8 h-8 text-amber-400 mb-3" />
            <p className="text-sm text-gray-400 mb-1">Legal Compliance</p>
            <p className="text-2xl font-bold text-amber-400">Integrated</p>
            <p className="text-xs text-gray-500 mt-2">Automated treaty scroll validation</p>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-lg p-4 md:col-span-2" data-testid="value-community-agents">
            <Users className="w-8 h-8 text-cyan-400 mb-3" />
            <p className="text-sm text-gray-400 mb-1">Community Agent Network</p>
            <div className="flex items-baseline gap-4">
              <p className="text-2xl font-bold text-cyan-400">{activeAgentsCount || 247} Agents</p>
              <p className="text-lg text-gray-400">Earnings: R2,500 - R8,000/agent</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">Township economy integration active</p>
          </div>
        </div>
      </div>

      {/* Liberation Protocols Dashboard */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6" data-testid="section-liberation-protocols">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">Liberation Protocols</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liberationProtocols.map((protocol, idx) => (
            <div 
              key={protocol.id}
              className={`border rounded-lg p-4 ${getProtocolStatusColor(protocol.protocolStatus)}`}
              data-testid={`protocol-${idx}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-bold text-lg mb-1">{protocol.protocolName}</p>
                  <p className="text-sm opacity-75">{protocol.description}</p>
                </div>
                <span className="inline-block text-xs px-3 py-1 rounded-full border ml-4">
                  {protocol.protocolStatus}
                </span>
              </div>
              {!protocol.isActive && (
                <button
                  onClick={() => activateProtocolMutation.mutate(protocol.id)}
                  disabled={activateProtocolMutation.isPending}
                  className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded border transition-colors"
                  data-testid={`button-activate-protocol-${idx}`}
                >
                  Activate Protocol
                </button>
              )}
            </div>
          ))}

          {/* Default protocols if none exist */}
          {liberationProtocols.length === 0 && (
            <>
              <div className="bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-1">Debt Nullification</p>
                    <p className="text-sm opacity-75">Automated debt relief protocols for qualified participants</p>
                  </div>
                  <span className="inline-block text-xs px-3 py-1 rounded-full border ml-4">ARMED</span>
                </div>
              </div>
              
              <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-1">Fiat Loop Detection</p>
                    <p className="text-sm opacity-75">Continuous monitoring of financial manipulation patterns</p>
                  </div>
                  <span className="inline-block text-xs px-3 py-1 rounded-full border ml-4">ACTIVE</span>
                </div>
              </div>
              
              <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-1">Community Empowerment</p>
                    <p className="text-sm opacity-75">Market-integrated economic empowerment systems</p>
                  </div>
                  <span className="inline-block text-xs px-3 py-1 rounded-full border ml-4">OPERATIONAL</span>
                </div>
              </div>
              
              <div className="bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-1">Freedom Cascade</p>
                    <p className="text-sm opacity-75">Mass liberation activation ready for deployment</p>
                  </div>
                  <span className="inline-block text-xs px-3 py-1 rounded-full border ml-4">READY</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* System Integration Complete */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6" data-testid="section-integration-complete">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">System Integration Status</h2>
        <div className="bg-black/50 border border-emerald-500/20 rounded-lg p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <p className="text-gray-300">All FAA release hooks integrated</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <p className="text-gray-300">Global inspection framework operational</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <p className="text-gray-300">Blockchain liberation record-keeping active</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <p className="text-gray-300">Real-time liberation statistics dashboard ready</p>
            </div>
          </div>
        </div>
      </div>

      {/* Community Sovereignty Networks */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6" data-testid="section-community-networks">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">Community Sovereignty Networks</h2>
        <div className="bg-black/50 border border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left p-4 text-sm text-gray-400">Agent Name</th>
                  <th className="text-left p-4 text-sm text-gray-400">Region</th>
                  <th className="text-left p-4 text-sm text-gray-400">Earnings Range</th>
                  <th className="text-left p-4 text-sm text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {communityAgents.slice(0, 5).map((agent, idx) => (
                  <tr key={agent.id} className="border-t border-gray-800" data-testid={`agent-row-${idx}`}>
                    <td className="p-4 text-gray-300">{agent.agentName}</td>
                    <td className="p-4 text-gray-400 text-sm">
                      {agent.townshipEconomy ? 'South African township economy' : 'General'}
                    </td>
                    <td className="p-4 text-emerald-400">
                      {agent.currency} {agent.earningsMin} - {agent.earningsMax}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        agent.agentStatus?.toUpperCase() === 'ACTIVE' 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        {agent.agentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {communityAgents.length === 0 && (
                  <tr className="border-t border-gray-800">
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      <p className="mb-2">247 Active Community Agents</p>
                      <p className="text-sm">Earnings: R2,500 - R8,000 per agent</p>
                      <p className="text-xs mt-2">Township economy integration: <span className="text-emerald-400">ACTIVE</span></p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Liberation Events Summary */}
      {liberationEvents.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mt-6" data-testid="section-liberation-events">
          <h2 className="text-xl font-bold text-cyan-400 mb-4">Recent Liberation Events</h2>
          <div className="space-y-3">
            {liberationEvents.slice(0, 3).map((event, idx) => (
              <div key={event.id} className="bg-black/50 border border-gray-700 rounded-lg p-4" data-testid={`event-${idx}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-200">{event.eventType}</p>
                    <p className="text-sm text-gray-400 mt-1">{event.eventDescription}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-sm font-semibold text-emerald-400">{event.timestamp?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
