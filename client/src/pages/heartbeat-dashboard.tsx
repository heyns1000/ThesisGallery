import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "wouter";

const miningNodes = [
  { name: "OreXcel", seed: "🌱 Sprouted", pulse: "🫀 Active", seal: "🛡️ Secured" },
  { name: "Minerva", seed: "🌱 Sprouted", pulse: "🫀 Active", seal: "🛡️ Secured" },
  { name: "Digium", seed: "🌱 Sprouted", pulse: "🫀 Active", seal: "🛡️ Secured" },
  { name: "MineForge", seed: "🌱 Sprouted", pulse: "🫀 Active", seal: "🛡️ Secured" },
  { name: "MineralVision", seed: "🌱 Sprouted", pulse: "🫀 Active", seal: "🛡️ Secured" },
  { name: "AutoBorn", seed: "🌱 Sprouted", pulse: "🫀 Active", seal: "🛡️ Secured" }
];

export default function HeartbeatDashboard() {
  const [counter, setCounter] = useState(9);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => prev <= 1 ? 9 : prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-950 border-b border-cyan-500 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-cyan-400">
              🧬 FAA.Zone Mining Sector | VaultPulse Heartbeat Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Real-time pulse monitoring • 9-second sync intervals • VaultMesh TreatyMesh Status
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/mining-dashboard">
              <Button className="bg-cyan-600 hover:bg-cyan-500" data-testid="button-mining-dashboard">
                ⛏️ Mining Hub
              </Button>
            </Link>
            <Link href="/global-view">
              <Button className="bg-white text-black hover:bg-gray-200">
                🌍 Global View
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="px-6 py-8 space-y-12">
        {/* Heartbeat Ticker */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-cyan-900/50 to-cyan-800/50 rounded-xl p-8 border border-cyan-500">
            <h2 className="text-4xl font-bold text-cyan-400 mb-4">⚡ Live Heartbeat Ticker</h2>
            <div className="text-6xl font-black text-cyan-300 mb-4">
              {counter}s
            </div>
            <p className="text-cyan-200">Next PulseGrid™ sync in {counter} seconds</p>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-cyan-400 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${((9 - counter) / 9) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Mining Nodes Table */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-cyan-400">
            🏭 Mining Node Status Grid
          </h3>
          <Card className="bg-gray-950 border-cyan-500">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-cyan-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-cyan-300 font-bold border-b border-cyan-500">
                        Mining Node
                      </th>
                      <th className="px-6 py-4 text-left text-cyan-300 font-bold border-b border-cyan-500">
                        OmniSeed Status
                      </th>
                      <th className="px-6 py-4 text-left text-cyan-300 font-bold border-b border-cyan-500">
                        VaultPulse Status
                      </th>
                      <th className="px-6 py-4 text-left text-cyan-300 font-bold border-b border-cyan-500">
                        VaultSeal Treaty
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {miningNodes.map((node, index) => (
                      <tr key={index} className="border-b border-cyan-500/30 hover:bg-cyan-900/20">
                        <td className="px-6 py-4 font-semibold text-white">
                          {node.name}
                        </td>
                        <td className="px-6 py-4 text-green-400">
                          {node.seed}
                        </td>
                        <td className="px-6 py-4 text-cyan-400">
                          {node.pulse}
                        </td>
                        <td className="px-6 py-4 text-blue-400">
                          {node.seal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* System Status Cards */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-cyan-400">
            🔧 System Health Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-950 border-green-500">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">🟢</div>
                <div className="font-bold text-green-400 mb-2">VaultMesh</div>
                <div className="text-sm text-gray-400">Aligned & Operational</div>
                <Badge className="mt-2 bg-green-100 text-green-800">99.9% Uptime</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gray-950 border-blue-500">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">🔗</div>
                <div className="font-bold text-blue-400 mb-2">TreatyMesh</div>
                <div className="text-sm text-gray-400">Protocol Active</div>
                <Badge className="mt-2 bg-blue-100 text-blue-800">Synchronized</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gray-950 border-purple-500">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">📡</div>
                <div className="font-bold text-purple-400 mb-2">PulseGrid™</div>
                <div className="text-sm text-gray-400">9s Interval Active</div>
                <Badge className="mt-2 bg-purple-100 text-purple-800">Live Sync</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gray-950 border-yellow-500">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">🧬</div>
                <div className="font-bold text-yellow-400 mb-2">ClauseIndex™</div>
                <div className="text-sm text-gray-400">Compliance Ready</div>
                <Badge className="mt-2 bg-yellow-100 text-yellow-800">GLUP Active</Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Real-time Metrics */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-950 border-cyan-500">
              <CardHeader>
                <CardTitle className="text-cyan-400">📊 Live Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Nodes:</span>
                    <span className="text-cyan-400 font-bold">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pulse Interval:</span>
                    <span className="text-green-400 font-bold">9s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Sync:</span>
                    <span className="text-blue-400 font-bold">{counter}s ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-950 border-cyan-500">
              <CardHeader>
                <CardTitle className="text-cyan-400">🛡️ Security Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">VaultChain:</span>
                    <span className="text-green-400 font-bold">✅ Secured</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Encryption:</span>
                    <span className="text-green-400 font-bold">✅ Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Audit Trail:</span>
                    <span className="text-green-400 font-bold">✅ Intact</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-950 border-cyan-500">
              <CardHeader>
                <CardTitle className="text-cyan-400">🌐 Network Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Latency:</span>
                    <span className="text-green-400 font-bold">&lt; 50ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Throughput:</span>
                    <span className="text-green-400 font-bold">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Redundancy:</span>
                    <span className="text-green-400 font-bold">✅ Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Status Footer */}
        <section className="text-center">
          <Card className="bg-green-900/20 border-green-500">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-green-400 mb-2">
                ✅ VaultMesh TreatyMesh Status: Aligned and Operational
              </h3>
              <p className="text-green-300">
                All systems synchronized • 9-second heartbeat maintained • FAA compliance active
              </p>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-500 border-t border-cyan-500">
        FAA VaultChain Protocol · VaultPulse Active · TreatyMesh Synchronized · Mining Intelligence Grid Live
      </footer>
    </div>
  );
}