import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  Activity, 
  Database, 
  Shield, 
  Zap, 
  Eye, 
  MapPin, 
  BarChart3, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Wifi,
  HardDrive
} from "lucide-react";
import { getContent } from "@/lib/appData";

// Comprehensive Wildlife Protocols Data
const protocolsData = {
  EcoGuard: {
    protocolName: "EcoGuard™ Core Protocol Overview",
    tagline: "EcoGuard™ is an innovative FAA.ZONE protocol, specifically engineered for the demands of the Wildlife & Habitat industry.",
    keyFeatures: [
      "Direct integration with FAA Professional Services Mesh",
      "Advanced data sync with GuardEco",
      "Real-time compliance validation via VaultLink™",
      "Scalable architecture for x48 node expansion",
      "Predictive analytics module for EcoGuard performance",
      "API access for seamless interoperability",
      "Cross-sector data interoperability",
      "Self-optimizing node distribution for peak efficiency",
      "AI-driven anomaly detection and fraud prevention"
    ],
    subNodes: ['GuardEco', 'LinkHabitat', 'TraceWild'],
    metadata: {
      productId: "ECO-WIL-2564",
      vaultId: "VAULT-UXRD",
      signalEchoLayer: "Layer Alpha v2.6",
      deploymentZone: "Zone A 5",
      securityRating: "FAA-SEC A+",
      activeNodes: "2,856",
      lastAudit: "2025-06-26",
      complianceStatus: "Active & Certified"
    },
    metrics: {
      currentPulseActivity: "98,839 pulses/sec",
      dataVolumeProcessed: "98.71 TB",
      latencyAverage: "96 ms"
    },
    ledgerEntries: [
      "#4623 - ECOGU Pulse Tx - Pending",
      "#6075 - WILDL Data Sync - Error", 
      "#2992 - Node Actuation Confirm - Offline",
      "#231 - VaultTrace Audit - Passed"
    ],
    icon: "🛡️",
    color: "green"
  },
  HabitatLink: {
    protocolName: "HabitatLink™ Core Protocol Overview",
    tagline: "HabitatLink™ is the premier FAA.ZONE platform, revolutionizing Wildlife & Habitat operations.",
    keyFeatures: [
      "Direct integration with FAA Professional Services Mesh",
      "Advanced data sync with NodeBio",
      "Real-time compliance validation via VaultLink™",
      "Scalable architecture for x42 node expansion",
      "Predictive analytics module for HabitatLink performance",
      "API access for seamless interoperability",
      "Cross-sector data interoperability",
      "Blockchain-secured data provenance",
      "Secure multi-party computation support"
    ],
    subNodes: ['NodeBio', 'MeshConserv', 'SyncSpecies'],
    metadata: {
      productId: "HAB-WIL-6298",
      vaultId: "VAULT-7VJ9",
      signalEchoLayer: "Layer Alpha v1.7",
      deploymentZone: "Zone E 10",
      securityRating: "FAA-SEC B+",
      activeNodes: "1,927",
      lastAudit: "2025-06-20",
      complianceStatus: "Active & Certified"
    },
    metrics: {
      currentPulseActivity: "41,894 pulses/sec",
      dataVolumeProcessed: "62.65 TB",
      latencyAverage: "89 ms"
    },
    ledgerEntries: [
      "#9832 - HABIT Pulse Tx - Confirmed",
      "#8821 - WILDL Data Sync - Completed",
      "#7296 - Node Actuation Confirm - Offline",
      "#9639 - VaultTrace Audit - Passed"
    ],
    icon: "🌿",
    color: "emerald"
  },
  WildTrace: {
    protocolName: "WildTrace™ Core Protocol Overview",
    tagline: "WildTrace™ is a leading protocol for comprehensive wildlife tracking and behavior analysis.",
    keyFeatures: [
      "AI-driven movement pattern analysis",
      "Real-time anomaly detection for unauthorized activity",
      "Integration with Sentinel Ring™ fauna tags",
      "Predictive migration route forecasting",
      "Automated health and stress alerts for tagged animals"
    ],
    subNodes: ['ProtectZone', 'FlowNature', 'GridPreserve'],
    metadata: {
      productId: "WLD-TRC-8711",
      vaultId: "VAULT-K23L",
      signalEchoLayer: "Layer Beta v3.1",
      deploymentZone: "Zone C 7",
      securityRating: "FAA-SEC A",
      activeNodes: "1,450",
      lastAudit: "2025-07-01",
      complianceStatus: "Active & Certified"
    },
    metrics: {
      currentPulseActivity: "35,123 pulses/sec",
      dataVolumeProcessed: "21.45 TB",
      latencyAverage: "105 ms"
    },
    ledgerEntries: [
      "#3145 - WILDL Data Sync - Completed",
      "#5890 - Node Actuation Confirm - Online",
      "#7772 - VaultTrace Audit - Passed"
    ],
    icon: "🦁",
    color: "amber"
  },
  BioNode: {
    protocolName: "BioNode™ Core Protocol Overview",
    tagline: "BioNode™ focuses on environmental and biological data collection.",
    keyFeatures: [
      "Automated biosensor data collection",
      "Real-time air and soil quality monitoring",
      "Infrasound detection for poaching activity",
      "Integration with climate and weather APIs",
      "Data validation against VaultMesh™ ecological scrolls"
    ],
    subNodes: ['VaultFauna', 'EcoID', 'HabitatScan'],
    metadata: {
      productId: "BIO-NOD-9002",
      vaultId: "VAULT-L5P7",
      signalEchoLayer: "Layer Gamma v1.0",
      deploymentZone: "Zone B 3",
      securityRating: "FAA-SEC B+",
      activeNodes: "890",
      lastAudit: "2025-07-05",
      complianceStatus: "Active & Certified"
    },
    metrics: {
      currentPulseActivity: "12,789 pulses/sec",
      dataVolumeProcessed: "10.11 TB",
      latencyAverage: "112 ms"
    },
    ledgerEntries: [
      "#1021 - BIO-NOD Pulse Tx - Confirmed",
      "#4489 - WILDL Data Sync - Completed",
      "#6523 - VaultTrace Audit - Passed"
    ],
    icon: "🧬",
    color: "blue"
  },
  ConservMesh: {
    protocolName: "ConservMesh™ Core Protocol Overview",
    tagline: "ConservMesh™ is designed for large-scale habitat conservation.",
    keyFeatures: [
      "Multi-region data aggregation and analysis",
      "Predictive modeling for resource allocation",
      "Integration with drone and ground sensor networks",
      "Automated alert systems for environmental threats",
      "Blockchain-based verification of conservation efforts"
    ],
    subNodes: ['WildMesh', 'NodeBio', 'ConservFlow'],
    metadata: {
      productId: "CON-MSH-7833",
      vaultId: "VAULT-9QJ2",
      signalEchoLayer: "Layer Delta v4.0",
      deploymentZone: "Zone K 12",
      securityRating: "FAA-SEC A+",
      activeNodes: "3,501",
      lastAudit: "2025-06-29",
      complianceStatus: "Active & Certified"
    },
    metrics: {
      currentPulseActivity: "78,561 pulses/sec",
      dataVolumeProcessed: "88.92 TB",
      latencyAverage: "85 ms"
    },
    ledgerEntries: [
      "#7521 - CON-MSH Pulse Tx - Confirmed",
      "#1142 - WILDL Data Sync - Completed",
      "#3309 - VaultTrace Audit - Passed"
    ],
    icon: "🌐",
    color: "violet"
  }
};

const WildlifeDashboard = () => {
  const content = getContent('wildlife-dashboard');
  const [selectedProtocol, setSelectedProtocol] = useState('EcoGuard');
  const [activeTab, setActiveTab] = useState('overview');
  const chartRef = useRef(null);

  // Initialize charts for protocol metrics
  useEffect(() => {
    const loadChartJS = async () => {
      if (typeof window !== 'undefined' && window.Chart) {
        initializeCharts();
        return;
      }

      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
          setTimeout(initializeCharts, 100);
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load Chart.js:', error);
      }
    };

    const initializeCharts = () => {
      if (!window.Chart || !chartRef.current) return;

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        new window.Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: Object.keys(protocolsData),
            datasets: [{
              data: Object.values(protocolsData).map(p => parseInt(p.metadata.activeNodes.replace(',', ''))),
              backgroundColor: [
                '#10b981', '#06d6a0', '#f59e0b', '#3b82f6', '#8b5cf6'
              ],
              borderWidth: 3,
              borderColor: '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15,
                  usePointStyle: true,
                  font: { size: 12, weight: '600' }
                }
              }
            }
          }
        });
      }
    };

    loadChartJS();
  }, []);

  const currentProtocol = protocolsData[selectedProtocol];

  // Get system statistics
  const { data: systemStats } = useQuery({
    queryKey: ['/api/system/stats'],
    refetchInterval: 5000
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-green-900" data-testid="wildlife-dashboard">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-900 text-white p-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black flex items-center justify-center" data-testid="text-wildlife-title">
          {content.title}
        </h1>
        <p className="mt-2 text-lg md:text-xl text-green-200">
          <span data-testid="text-wildlife-subtitle">{content.subtitle}</span>
        </p>
        <div className="mt-4 flex justify-center space-x-2">
          <Badge variant="secondary" className="bg-emerald-600 text-white">
            <Shield className="h-3 w-3 mr-1" />
            45 Omnidrop Kits Active
          </Badge>
          <Badge variant="secondary" className="bg-green-600 text-white">
            <Database className="h-3 w-3 mr-1" />
            12 Core Nodes Online
          </Badge>
          <Badge variant="secondary" className="bg-blue-600 text-white">
            <Wifi className="h-3 w-3 mr-1" />
            4-Country Deployment
          </Badge>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Protocol Overview</TabsTrigger>
            <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
            <TabsTrigger value="deployment">Deployment Manager</TabsTrigger>
          </TabsList>

          {/* Protocol Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Protocol Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(protocolsData).map(([key, protocol]) => (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all ${selectedProtocol === key ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : 'hover:shadow-lg'}`}
                  onClick={() => setSelectedProtocol(key)}
                  data-testid={`protocol-card-${key.toLowerCase()}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{protocol.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{key}™</h3>
                        <Badge variant="outline" className={`text-${protocol.color}-600`}>
                          {protocol.metadata.activeNodes} nodes
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {protocol.tagline}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {protocol.metadata.securityRating}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Activity className="h-3 w-3 mr-1" />
                        {protocol.metrics.currentPulseActivity}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Protocol Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Protocol Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">{currentProtocol.icon}</span>
                    <span>{currentProtocol.protocolName}</span>
                  </CardTitle>
                  <p className="text-muted-foreground">{currentProtocol.tagline}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                        Key Features
                      </h4>
                      <ul className="space-y-1">
                        {currentProtocol.keyFeatures.slice(0, 5).map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-500" />
                        Sub-Nodes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentProtocol.subNodes.map((node, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {node}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Protocol Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    <span>Protocol Metadata</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-muted-foreground">Product ID</span>
                        <p className="font-mono text-sm">{currentProtocol.metadata.productId}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Vault ID</span>
                        <p className="font-mono text-sm">{currentProtocol.metadata.vaultId}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Signal Layer</span>
                        <p className="font-mono text-sm">{currentProtocol.metadata.signalEchoLayer}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-muted-foreground">Zone</span>
                        <p className="font-mono text-sm">{currentProtocol.metadata.deploymentZone}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Security Rating</span>
                        <Badge variant="secondary" className="text-xs">
                          {currentProtocol.metadata.securityRating}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Last Audit</span>
                        <p className="text-sm flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          {currentProtocol.metadata.lastAudit}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pulse Activity</p>
                      <p className="text-2xl font-bold">{currentProtocol.metrics.currentPulseActivity}</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Data Processed</p>
                      <p className="text-2xl font-bold">{currentProtocol.metrics.dataVolumeProcessed}</p>
                    </div>
                    <HardDrive className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Latency</p>
                      <p className="text-2xl font-bold">{currentProtocol.metrics.latencyAverage}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ledger Entries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <span>Recent Ledger Entries</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentProtocol.ledgerEntries.map((entry, index) => {
                    const [id, action, status] = entry.split(' - ');
                    const statusColor = status === 'Passed' ? 'green' : 
                                      status === 'Completed' ? 'blue' :
                                      status === 'Confirmed' ? 'emerald' :
                                      status === 'Error' ? 'red' :
                                      status === 'Offline' ? 'gray' : 'amber';
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="font-mono text-xs">
                            {id}
                          </Badge>
                          <span className="text-sm">{action}</span>
                        </div>
                        <Badge variant="secondary" className={`text-${statusColor}-600`}>
                          {status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-blue-500" />
                    <span>Active Nodes Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <canvas ref={chartRef} data-testid="nodes-distribution-chart"></canvas>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-emerald-500" />
                    <span>Deployment Zones</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.values(protocolsData).map((protocol, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{protocol.icon}</span>
                          <div>
                            <p className="font-medium">{protocol.metadata.deploymentZone}</p>
                            <p className="text-sm text-muted-foreground">{protocol.metadata.signalEchoLayer}</p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {protocol.metadata.activeNodes} nodes
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(protocolsData).map(([key, protocol]) => (
                <Card key={key}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg">{protocol.icon}</span>
                      <h3 className="font-bold">{key}™</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Pulse Activity</span>
                        <span className="text-xs font-mono">{protocol.metrics.currentPulseActivity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Data Volume</span>
                        <span className="text-xs font-mono">{protocol.metrics.dataVolumeProcessed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Latency</span>
                        <span className="text-xs font-mono">{protocol.metrics.latencyAverage}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Deployment Manager Tab */}
          <TabsContent value="deployment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>FAA™ Wildlife Grid Deployment Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">45</div>
                    <div className="text-sm text-muted-foreground">Omnidrop Kits Deployed</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-muted-foreground">Core Nodes Active</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">4</div>
                    <div className="text-sm text-muted-foreground">Countries Covered</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <div className="text-sm text-muted-foreground">System Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WildlifeDashboard;