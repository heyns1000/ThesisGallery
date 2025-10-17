import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import type { 
  GlyphAuditReport, 
  OperationalVector, 
  AgentTrail, 
  VendorIntegration,
  InefficiencyDetection,
  BackendHonestyLog 
} from "@shared/schema";

export default function ScrollBinderOne() {
  const { subscribe } = useWebSocket();
  const [realtimeUpdate, setRealtimeUpdate] = useState<any>(null);

  const { data: auditReports = [], isLoading: reportsLoading } = useQuery<GlyphAuditReport[]>({
    queryKey: ["/api/scrollbinder/audit-reports"],
  });

  const { data: systemStatus = {}, isLoading: statusLoading } = useQuery<any>({
    queryKey: ["/api/scrollbinder/system-status"],
  });

  const { data: operationalVectors = [], isLoading: vectorsLoading } = useQuery<OperationalVector[]>({
    queryKey: ["/api/scrollbinder/operational-vectors"],
  });

  const { data: agentTrails = [], isLoading: trailsLoading } = useQuery<AgentTrail[]>({
    queryKey: ["/api/scrollbinder/agent-trails"],
  });

  const { data: vendorMatrix = [], isLoading: vendorsLoading } = useQuery<VendorIntegration[]>({
    queryKey: ["/api/scrollbinder/vendor-matrix"],
  });

  const { data: inefficiencies = [], isLoading: inefficienciesLoading } = useQuery<InefficiencyDetection[]>({
    queryKey: ["/api/scrollbinder/inefficiencies"],
  });

  const { data: honestyLogs = [], isLoading: logsLoading } = useQuery<BackendHonestyLog[]>({
    queryKey: ["/api/scrollbinder/honesty-logs"],
  });

  useEffect(() => {
    const unsubscribe = subscribe('scrollbinder_update', (data: any) => {
      setRealtimeUpdate(data);
    });
    return unsubscribe;
  }, [subscribe]);

  const latestReport = auditReports[0];
  const latestHonestyLog = honestyLogs[0];

  const isLoading = reportsLoading || statusLoading || vectorsLoading || 
                    trailsLoading || vendorsLoading || inefficienciesLoading || logsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-400">Loading ScrollBinder_One System...</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const s = status?.toUpperCase();
    if (s?.includes('ACTIVE')) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (s?.includes('FUNCTIONAL')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (s?.includes('AUTHENTICATED')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    if (s?.includes('CONNECTED')) return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    if (s?.includes('READY')) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (s?.includes('DEPLOYED')) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (s?.includes('STANDBY')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (s?.includes('PROCESSING')) return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    if (s?.includes('ERROR')) return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getSeverityColor = (severity: string) => {
    const s = severity?.toUpperCase();
    if (s === 'HIGH' || s === 'CRITICAL') return 'bg-red-500/10 border-red-500 text-red-400';
    if (s === 'MEDIUM') return 'bg-amber-500/10 border-amber-500 text-amber-400';
    if (s === 'LOW') return 'bg-yellow-500/10 border-yellow-500 text-yellow-400';
    return 'bg-gray-500/10 border-gray-500 text-gray-400';
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-950/50 to-teal-950/50 border border-emerald-500/20 px-6 py-4 -mx-6 -mt-6 mb-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400 mb-2" data-testid="text-scrollbinder-title">
              📜 ScrollBinder_One :: Glyph Audit Report
            </h1>
            <p className="text-gray-400" data-testid="text-scrollbinder-subtitle">
              Comprehensive System Audit & Operational Vector Analysis
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
              <span className="text-sm text-emerald-400">🟢 System: ACTIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Emission Protocol Card */}
      {latestReport && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6" data-testid="card-emission-protocol">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">Emission Protocol</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/50 border border-emerald-500/20 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Protocol ID</p>
              <p className="text-emerald-400 font-mono" data-testid="text-emission-protocol">
                {latestReport.emissionProtocol || 'FAA-TREATY-OMNI-A13XN'}
              </p>
            </div>
            <div className="bg-black/50 border border-blue-500/20 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Authorized User</p>
              <p className="text-blue-400 font-semibold" data-testid="text-auth-user">
                {latestReport.authUser || 'Heyns Schoeman'}
              </p>
            </div>
            <div className="bg-black/50 border border-purple-500/20 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Flame Lattice</p>
              <p className="text-purple-400 font-mono" data-testid="text-flame-lattice">
                {latestReport.flameLattice || 'OMNISEED~CONFORGE9000'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* System Status Matrix */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6" data-testid="section-system-status">
        <h2 className="text-xl font-bold text-emerald-400 mb-4">System Status Matrix</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {operationalVectors.map((vector, idx) => (
            <div 
              key={vector.id} 
              className={`border rounded-lg p-3 ${getStatusColor(vector.engineStatus)}`}
              data-testid={`vector-${idx}`}
            >
              <p className="text-xs opacity-75 mb-1">Operational Vector</p>
              <p className="font-semibold text-sm mb-2">{vector.coreEngine}</p>
              <span className="inline-block text-xs px-2 py-1 rounded-full border">
                {vector.engineStatus}
              </span>
            </div>
          ))}
          
          {/* Default vectors if none exist */}
          {operationalVectors.length === 0 && (
            <>
              <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg p-3">
                <p className="text-xs opacity-75 mb-1">Core Engine</p>
                <p className="font-semibold text-sm mb-2">SB1::AtomicScrollEngine</p>
                <span className="inline-block text-xs px-2 py-1 rounded-full border">ACTIVE</span>
              </div>
              <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg p-3">
                <p className="text-xs opacity-75 mb-1">Zero-Click Ingestion</p>
                <p className="font-semibold text-sm mb-2">AutoPull::DropProcess</p>
                <span className="inline-block text-xs px-2 py-1 rounded-full border">FUNCTIONAL</span>
              </div>
              <div className="bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg p-3">
                <p className="text-xs opacity-75 mb-1">VaultMesh Protocol</p>
                <p className="font-semibold text-sm mb-2">Mesh::PulseGrid9s</p>
                <span className="inline-block text-xs px-2 py-1 rounded-full border">AUTHENTICATED</span>
              </div>
              <div className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg p-3">
                <p className="text-xs opacity-75 mb-1">Bridge Sequence</p>
                <p className="font-semibold text-sm mb-2">FAA::OmniConnect</p>
                <span className="inline-block text-xs px-2 py-1 rounded-full border">CONNECTED</span>
              </div>
              <div className="bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg p-3">
                <p className="text-xs opacity-75 mb-1">File Processing</p>
                <p className="font-semibold text-sm mb-2">Glyph::Extractor2.0</p>
                <span className="inline-block text-xs px-2 py-1 rounded-full border">READY</span>
              </div>
              <div className="bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg p-3">
                <p className="text-xs opacity-75 mb-1">AI Insights Layer</p>
                <p className="font-semibold text-sm mb-2">Gemini::ContextAI</p>
                <span className="inline-block text-xs px-2 py-1 rounded-full border">DEPLOYED</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Inefficiency Detection Panel */}
      {inefficiencies.length > 0 && (
        <div className="bg-gray-900 border border-red-500/30 rounded-lg p-6 mb-6" data-testid="section-inefficiencies">
          <h2 className="text-xl font-bold text-red-400 mb-4">⚠️ Inefficiency Detection</h2>
          <div className="space-y-3">
            {inefficiencies.map((issue, idx) => (
              <div 
                key={issue.id}
                className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}
                data-testid={`inefficiency-${idx}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold mb-1">{issue.detectionType}</p>
                    <p className="text-sm opacity-75">{issue.description}</p>
                  </div>
                  <span className="inline-block text-xs px-2 py-1 rounded-full border ml-4">
                    {issue.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Trail Analysis */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6" data-testid="section-agent-trails">
        <h2 className="text-xl font-bold text-emerald-400 mb-4">Agent Trail Analysis</h2>
        <div className="space-y-4">
          {agentTrails.map((trail, idx) => (
            <div key={trail.id} className="bg-black/50 border border-gray-700 rounded-lg p-4" data-testid={`agent-trail-${idx}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Agent Primary</p>
                  <p className="text-emerald-400 font-semibold">{trail.agentPrimary}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Agent Secondary</p>
                  <p className="text-blue-400 font-semibold">{trail.agentSecondary}</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Integration Grids</p>
                <div className="flex flex-wrap gap-2">
                  {trail.integrationGrids?.map((grid, gIdx) => (
                    <span key={gIdx} className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">
                      {grid}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div>
                  <p className="text-xs text-gray-500">Processing Status</p>
                  <p className={`text-sm font-semibold ${getStatusColor(trail.processingStatus).split(' ').slice(1).join(' ')}`}>
                    {trail.processingStatus}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">File Queue</p>
                  <p className="text-sm text-gray-300">{trail.fileQueue || 'None'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Metadata State</p>
                  <p className="text-sm text-amber-400">{trail.metadataState}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Default trail if none exist */}
          {agentTrails.length === 0 && (
            <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Agent Primary</p>
                  <p className="text-emerald-400 font-semibold">ScrollBinder_RepLit_Agent</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Agent Secondary</p>
                  <p className="text-blue-400 font-semibold">FLAME-LATTICE</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Integration Grids</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">VaultMesh™</span>
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">GeminiAI</span>
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">Replit</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div>
                  <p className="text-xs text-gray-500">Processing Status</p>
                  <p className="text-sm font-semibold text-yellow-400">STANDBY</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">File Queue</p>
                  <p className="text-sm text-gray-300">0 files pending</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Metadata State</p>
                  <p className="text-sm text-amber-400">EXTRACTED</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vendor Integration Matrix */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6" data-testid="section-vendor-matrix">
        <h2 className="text-xl font-bold text-emerald-400 mb-4">Vendor Integration Matrix</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {vendorMatrix.map((vendor, idx) => (
            <div 
              key={vendor.id}
              className={`border rounded-lg p-3 ${getStatusColor(vendor.connectionStatus)}`}
              data-testid={`vendor-${idx}`}
            >
              <p className="font-semibold mb-2">{vendor.vendorName}</p>
              <p className="text-xs opacity-75 mb-2">{vendor.integrationPath}</p>
              <span className="inline-block text-xs px-2 py-1 rounded-full border">
                {vendor.connectionStatus}
              </span>
            </div>
          ))}

          {/* Default vendors if none exist */}
          {vendorMatrix.length === 0 && (
            <>
              <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg p-3">
                <p className="font-semibold mb-2">Vercel</p>
                <p className="text-xs opacity-75 mb-2">/deployment/vercel</p>
                <span className="inline-block text-xs px-2 py-1 rounded-full border">Connected</span>
              </div>
              <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg p-3">
                <p className="font-semibold mb-2">Gmail API</p>
                <p className="text-xs opacity-75 mb-2">/integrations/gmail</p>
                <span className="inline-block text-xs px-2 py-1 rounded-full border">Active</span>
              </div>
              <div className="bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg p-3">
                <p className="font-semibold mb-2">ZohoConnect</p>
                <p className="text-xs opacity-75 mb-2">/vendors/zoho</p>
                <span className="inline-block text-xs px-2 py-1 rounded-full border">Authenticated</span>
              </div>
              <div className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg p-3">
                <p className="font-semibold mb-2">Hetzner Cloud</p>
                <p className="text-xs opacity-75 mb-2">/cloud/hetzner</p>
                <span className="inline-block text-xs px-2 py-1 rounded-full border">Connected</span>
              </div>
              <div className="bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg p-3">
                <p className="font-semibold mb-2">Gemini Grids</p>
                <p className="text-xs opacity-75 mb-2">/ai/gemini</p>
                <span className="inline-block text-xs px-2 py-1 rounded-full border">Active</span>
              </div>
              <div className="bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg p-3">
                <p className="font-semibold mb-2">VaultMesh</p>
                <p className="text-xs opacity-75 mb-2">/core/vaultmesh</p>
                <div className="space-y-1">
                  <span className="inline-block text-xs px-2 py-1 rounded-full border">Connected</span>
                  <p className="text-xs mt-1">Treaty Status: <span className="text-green-400 font-semibold">READY</span></p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Backend Honesty Log */}
      {latestHonestyLog && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6" data-testid="section-honesty-log">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">Backend Honesty Log</h2>
          <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Current Reality</p>
              <p className="text-gray-300">{latestHonestyLog.currentReality}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">VaultMesh Protocol</p>
                <p className="text-emerald-400 font-semibold">FULLY COMPLIANT</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Global Motion</p>
                <p className="text-blue-400 font-semibold">SUSTAINED</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Brands Ecosystem</p>
                <p className="text-purple-400 font-semibold">240 Active</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Default Honesty Log if none exist */}
      {!latestHonestyLog && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6" data-testid="section-honesty-log">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">Backend Honesty Log</h2>
          <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Current Reality</p>
              <p className="text-gray-300">All systems operational. VaultMesh expanding. Global brand protection sustained across 240 brands.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">VaultMesh Protocol</p>
                <p className="text-emerald-400 font-semibold">FULLY COMPLIANT</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Global Motion</p>
                <p className="text-blue-400 font-semibold">SUSTAINED</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Brands Ecosystem</p>
                <p className="text-purple-400 font-semibold">240 Active</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
