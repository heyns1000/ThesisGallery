import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, Settings, Activity, TrendingUp, Home, BarChart3, FolderPlus, Wrench, Map, ShoppingCart, Palette, FileText, Key, Cog, LogIn, UserPlus, Sun, Moon, Globe, Clock, Eye, Edit, Trash2 } from 'lucide-react';

interface MinecoreBrand {
  id: number;
  name: string;
  status: string;
  description: string;
  integration: string;
}

interface MineNestDashboardProps {
  sectorBrands: MinecoreBrand[];
}

// MineNest™ navigation structure from uploaded HTML
const mineNestNavigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'projects', name: 'Projects', icon: FolderPlus },
  { id: 'new-project', name: 'New Project', icon: Plus },
  { id: 'scroll-builder', name: 'Content Builder', icon: Wrench },
  { id: 'ecosystem-map', name: 'Ecosystem Map', icon: Map },
  { id: 'global-checkout', name: 'Global Payment', icon: ShoppingCart },
  { id: 'templates', name: 'Templates', icon: Palette },
  { id: 'licenses', name: 'My Licenses', icon: FileText },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'api-keys', name: 'API Keys', icon: Key },
  { id: 'settings', name: 'Settings', icon: Cog },
  { id: 'login', name: 'Sign In', icon: LogIn },
  { id: 'signup', name: 'Sign Up', icon: UserPlus },
];

// Authentic MineNest™ brands from HTML file
const mineNestBrands = [
  'MineNest', 'DrillCoreX', 'OreSync', 'VaultRock', 'ClaimMine',
  'TrackShaft', 'PulseMine', 'CoreBeam', 'DigEcho', 'RockPath',
  'YieldDrill', 'MineProof', 'OreLine', 'DrillLink', 'VaultTunnel',
  'GeoGrid', 'SeamSync', 'ClaimOre', 'PulseBlast', 'OreEcho',
  'DeepCrate', 'RockLogic', 'CoreDrill', 'MineCast', 'DrillMark',
  'SignalOre', 'YieldTrack', 'VaultSeam', 'ShaftDrop', 'GeoNode'
];

// Authentic MineNest™ subnodes from HTML file
const mineNestSubnodes = [
  ['NestTrack', 'VaultShaft', 'QRMine', 'ClaimGrid'],
  ['CoreDrop', 'PulsePath', 'OreTrace', 'DrillYield'],
  ['SyncRock', 'VaultEcho', 'QRDrill', 'ClaimTag'],
  ['RockBeam', 'MineLoop', 'SignalTrace', 'QRClaim'],
  ['ClaimOre', 'VaultPath', 'OrePing', 'MineSignal'],
  ['ShaftMesh', 'DropMine', 'TrackSeam', 'QRTrack'],
  ['PulseCrate', 'MineEcho', 'YieldDrill', 'GridTag'],
  ['BeamPath', 'ClaimRock', 'VaultLoop', 'SeamDrop'],
  ['EchoMine', 'RockPing', 'VaultTrace', 'ClaimBeam'],
  ['PathDrop', 'GridMine', 'QRNode', 'YieldOre'],
  ['DrillGrid', 'ClaimYield', 'SyncTunnel', 'OreEcho'],
  ['ProofMine', 'SeamCast', 'VaultGrid', 'DropCrate'],
  ['OreLineX', 'VaultDrill', 'MineForm', 'TagTrace'],
  ['LinkMine', 'PulseEcho', 'GridSeam', 'YieldCast'],
  ['TunnelSync', 'ClaimLoop', 'QRDrillX', 'OreBeam'],
  ['GridGeo', 'VaultMap', 'RockForm', 'ClaimTunnel'],
  ['SeamSyncX', 'OreDrop', 'QRMineX', 'DrillMark'],
  ['ClaimOreX', 'TrackGrid', 'VaultDrop', 'PingEcho'],
  ['BlastMine', 'PulsePing', 'QRPath', 'SeamMark'],
  ['EchoRock', 'YieldTrack', 'VaultBeam', 'ClaimSync'],
  ['CrateDrop', 'SyncClaim', 'DrillForm', 'TunnelMap'],
  ['RockLogicX', 'VaultOre', 'YieldLoop', 'PingDrill'],
  ['CoreMine', 'OreTag', 'VaultPing', 'GridTrack'],
  ['MineCastX', 'ClaimNest', 'QRTrace', 'YieldEcho'],
  ['DrillMarkX', 'OreSignal', 'VaultCrate', 'PingTag'],
  ['OreSignalX', 'GridEcho', 'ClaimDrop', 'TrackTunnel'],
  ['TrackYield', 'MineFrame', 'SignalGrid', 'EchoDrill'],
  ['VaultSeamX', 'QRClaimX', 'GridOre', 'TunnelEcho'],
  ['DropShaft', 'ClaimTunnelX', 'YieldDrillX', 'VaultGrid'],
  ['GeoNodeX', 'SignalPing', 'DropEcho', 'MineLink']
];

// Mining project interface from HTML structure
interface MiningProject {
  id: string;
  name: string;
  status: 'live' | 'pending' | 'draft' | 'error';
  region: string;
  royalty: string;
  lastActivity: string;
  htmlCode?: string;
  description?: string;
}

// Dashboard metrics interface
interface DashboardMetrics {
  totalActiveSites: number;
  activeDrillRigs: number;
  monthlyOreYield: number;
  systemHealth: {
    safety: number;
    environmental: number;
    efficiency: number;
    uptime: number;
  };
}

export function MineNestDashboard({ sectorBrands }: MineNestDashboardProps) {
  const [brands, setBrands] = useState<MinecoreBrand[]>(sectorBrands || []);
  const [activeView, setActiveView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [projects, setProjects] = useState<MiningProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [projectLoadIndex, setProjectLoadIndex] = useState(0);
  const projectsPerLoad = 9;
  
  // Comprehensive dashboard metrics from HTML
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalActiveSites: 42,
    activeDrillRigs: 156,
    monthlyOreYield: 128420,
    systemHealth: {
      safety: 99.2,
      environmental: 97.8,
      efficiency: 94.5,
      uptime: 99.9
    }
  });

  // Initialize comprehensive mining projects from HTML
  useEffect(() => {
    const mockProjects: MiningProject[] = [
      { id: 'MN-001', name: 'Deep Earth Exploration Alpha Site', status: 'live', region: 'South Africa', royalty: '8.5%', lastActivity: '2 hours ago' },
      { id: 'MN-002', name: 'Quantum Mineral Detection Grid', status: 'pending', region: 'Australia', royalty: '6.2%', lastActivity: '5 hours ago' },
      { id: 'MN-003', name: 'Autonomous Drilling Rig Beta', status: 'live', region: 'Canada', royalty: '7.8%', lastActivity: '1 day ago' },
      { id: 'MN-004', name: 'Rare Earth Processing Plant', status: 'error', region: 'Chile', royalty: '9.1%', lastActivity: '3 days ago' },
      { id: 'MN-005', name: 'Satellite Ore Mapping System', status: 'live', region: 'Global', royalty: '5.5%', lastActivity: '12 hours ago' },
      { id: 'MN-006', name: 'Underground Water Management', status: 'draft', region: 'Peru', royalty: '4.2%', lastActivity: '1 week ago' },
      { id: 'MN-007', name: 'AI-Powered Safety Monitor', status: 'live', region: 'USA', royalty: '6.9%', lastActivity: '30 minutes ago' },
      { id: 'MN-008', name: 'Carbon Neutral Mining Initiative', status: 'pending', region: 'Norway', royalty: '7.5%', lastActivity: '2 days ago' },
      { id: 'MN-009', name: 'Blockchain Ore Tracking System', status: 'live', region: 'Brazil', royalty: '8.2%', lastActivity: '4 hours ago' },
      { id: 'MN-010', name: 'VaultMesh™ Integration Hub', status: 'live', region: 'Global', royalty: '10.5%', lastActivity: 'Real-time' },
      { id: 'MN-011', name: 'Quantum Tunneling Bore System', status: 'pending', region: 'Japan', royalty: '7.1%', lastActivity: '6 hours ago' },
      { id: 'MN-012', name: 'Desert Mining Optimization', status: 'live', region: 'Saudi Arabia', royalty: '9.8%', lastActivity: '1 hour ago' },
      { id: 'MN-013', name: 'Arctic Resource Extraction', status: 'draft', region: 'Greenland', royalty: '5.9%', lastActivity: '2 weeks ago' },
      { id: 'MN-014', name: 'Submarine Mining Platform', status: 'pending', region: 'Pacific Ocean', royalty: '11.2%', lastActivity: '3 days ago' },
      { id: 'MN-015', name: 'Renewable Energy Mining Grid', status: 'live', region: 'Iceland', royalty: '6.5%', lastActivity: '45 minutes ago' },
      { id: 'MN-016', name: 'Nano-Extraction Technology', status: 'live', region: 'Switzerland', royalty: '8.7%', lastActivity: '8 hours ago' },
      { id: 'MN-017', name: 'Orbital Mining Command Center', status: 'draft', region: 'Space', royalty: '15.0%', lastActivity: '1 month ago' },
      { id: 'MN-018', name: 'Bioremediation Mining Site', status: 'live', region: 'India', royalty: '7.3%', lastActivity: '3 hours ago' },
      { id: 'MN-019', name: 'Holographic Ore Analysis Lab', status: 'pending', region: 'Germany', royalty: '6.8%', lastActivity: '16 hours ago' },
      { id: 'MN-020', name: 'Fusion-Powered Drill Complex', status: 'error', region: 'France', royalty: '8.9%', lastActivity: '5 days ago' }
    ];
    setProjects(mockProjects);
  }, []);
  
  const totalBrands = brands.length;
  const activeBrands = brands.filter(b => b.status === 'active').length;
  const integrationRate = totalBrands > 0 ? Math.round((activeBrands / totalBrands) * 100) : 83;

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white';
      case 'development': return 'bg-yellow-600 text-white';
      case 'maintenance': return 'bg-orange-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* MineNest™ Sidebar Navigation */}
      <aside className={`w-72 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r p-6 flex flex-col`}>
        <div className="text-center mb-8 relative">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Fruitful™ | <span className="text-yellow-500 text-lg">MineNest™</span>
          </h2>
          <button 
            onClick={toggleTheme}
            className={`absolute top-0 right-0 ${isDarkMode ? 'text-gray-300 hover:text-yellow-500' : 'text-gray-600 hover:text-yellow-600'} transition-colors p-1`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        
        <nav className="space-y-2 flex-1">
          {mineNestNavigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeView === item.id 
                    ? 'bg-blue-600 text-white font-semibold shadow-lg' 
                    : isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                <IconComponent className="w-5 h-5 text-yellow-500" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Panel */}
            <Card className="bg-gradient-to-r from-orange-500/20 to-yellow-600/20 border-orange-500/30">
              <CardContent className="p-6">
                <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Welcome Back, Mining Operations Lead!
                </h1>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your MineNest™ portal provides comprehensive tools for managing, optimizing, and securing your mining and resource operations across the Fruitful Global Treaty Grid.
                </p>
                <Button 
                  onClick={() => setActiveView('new-project')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Mining Project
                </Button>
              </CardContent>
            </Card>

            {/* Operational Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-orange-500/20 to-yellow-600/20 border-orange-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-300 text-sm font-medium">Total Active Mine Sites</p>
                      <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{metrics.totalActiveSites}</p>
                    </div>
                    <Activity className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 text-sm font-medium">Active Drill Rigs</p>
                      <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{metrics.activeDrillRigs}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm font-medium">Monthly Ore Yield (Tonnes)</p>
                      <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{metrics.monthlyOreYield.toLocaleString()}</p>
                    </div>
                    <Settings className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Operational Health Overview */}
            <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-orange-400">
                  Operational Health Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className="text-sm text-gray-500 mb-1">Safety</p>
                    <p className="text-2xl font-bold text-green-500">{metrics.systemHealth.safety}%</p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className="text-sm text-gray-500 mb-1">Environmental</p>
                    <p className="text-2xl font-bold text-blue-500">{metrics.systemHealth.environmental}%</p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className="text-sm text-gray-500 mb-1">Efficiency</p>
                    <p className="text-2xl font-bold text-yellow-500">{metrics.systemHealth.efficiency}%</p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className="text-sm text-gray-500 mb-1">Uptime</p>
                    <p className="text-2xl font-bold text-purple-500">{metrics.systemHealth.uptime}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* MineNest™ Core Protocol */}
            <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300">MineNest™ Core Protocol Snapshot</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  MineNest™ ensures secure, real-time data flows for the Mining & Resources industry.
                </p>
                <h4 className="text-lg font-semibold text-purple-300 mb-3">Key Features:</h4>
                <ul className={`space-y-2 mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Real-time Metrics Overview for immediate insights.</li>
                  <li>• VaultTrace™ Ledger Entries for secure and transparent logging.</li>
                  <li>• Integrated Compliance via VaultLink™ for mining-specific regulations.</li>
                  <li>• Scalable Node Expansion for adapting to fluctuating demands.</li>
                  <li>• Predictive Analytics for proactive decision-making.</li>
                </ul>
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                  Go to FAA™ Mining & Resources Public Page →
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === 'projects' && (
          <div className="space-y-6">
            <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-orange-400">
                  Your Mining Projects & Operations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <input 
                    type="text" 
                    placeholder="Search projects..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`flex-grow p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={`p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="all">All Statuses</option>
                    <option value="live">Active</option>
                    <option value="pending">Exploration</option>
                    <option value="draft">Planned</option>
                    <option value="error">Maintenance</option>
                  </select>
                </div>

                {/* Mining Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects
                    .filter(project => filterStatus === 'all' || project.status === filterStatus)
                    .filter(project => project.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .slice(0, projectLoadIndex + projectsPerLoad)
                    .map((project) => {
                      const getStatusBadge = (status: string) => {
                        switch (status) {
                          case 'live': return 'bg-green-600 text-white';
                          case 'pending': return 'bg-yellow-600 text-white';
                          case 'draft': return 'bg-gray-600 text-white';
                          case 'error': return 'bg-red-600 text-white';
                          default: return 'bg-gray-600 text-white';
                        }
                      };

                      return (
                        <Card key={project.id} className={`transition-all hover:border-orange-500/50 hover:shadow-lg ${
                          isDarkMode 
                            ? 'bg-gray-800/70 border-gray-600' 
                            : 'bg-white border-gray-200'
                        }`}>
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {project.name}
                              </h3>
                              <Badge className={getStatusBadge(project.status)}>
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Globe className="w-4 h-4 text-orange-400" />
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                  {project.region}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <TrendingUp className="w-4 h-4 text-green-400" />
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                  Royalty: {project.royalty}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-blue-400" />
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                  {project.lastActivity}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-orange-400 font-medium">
                                ID: {project.id}
                              </span>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="text-xs">
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs">
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>

                {projects.filter(p => filterStatus === 'all' || p.status === filterStatus).length > projectLoadIndex + projectsPerLoad && (
                  <div className="text-center mt-6">
                    <Button 
                      onClick={() => setProjectLoadIndex(projectLoadIndex + projectsPerLoad)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Load More Projects
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === 'new-project' && (
          <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-orange-400">
                <Plus className="inline w-5 h-5 mr-2" />
                Initiate a New Mining Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Project Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Deep Earth Exploration Alpha Site"
                    className={`w-full p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Choose Template
                  </label>
                  <select className={`w-full p-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}>
                    <option>Select mining template...</option>
                    <option>Open Pit Mining</option>
                    <option>Underground Mining</option>
                    <option>Placer Mining</option>
                    <option>In-Situ Mining</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Project Description
                  </label>
                  <div className="flex gap-2">
                    <textarea 
                      rows={5}
                      placeholder="Describe the scope, objectives, and resources for this mining project..."
                      className={`flex-grow p-3 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <Button className="bg-purple-600 hover:bg-purple-700 px-3 text-xs">
                      ✨ AI Generate
                    </Button>
                  </div>
                </div>

                <Button className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold w-full py-3">
                  Create Mining Project
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Ecosystem Map View */}
        {activeView === 'ecosystem-map' && (
          <div className="space-y-6">
            <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-orange-400">
                  <Map className="inline w-5 h-5 mr-2" />
                  MineNest™ Ecosystem Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sector Overview */}
                  <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-900/50 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                    <h3 className="text-lg font-semibold mb-4 text-yellow-500">Mining Sector Structure</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded bg-gradient-to-r from-orange-500/20 to-yellow-600/20">
                        <span>Core Mining Brands</span>
                        <Badge className="bg-orange-600 text-white">30</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded bg-gradient-to-r from-blue-500/20 to-cyan-600/20">
                        <span>Active Subnodes</span>
                        <Badge className="bg-blue-600 text-white">120</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded bg-gradient-to-r from-purple-500/20 to-pink-600/20">
                        <span>VaultMesh™ Integrations</span>
                        <Badge className="bg-purple-600 text-white">156</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Integration Status */}
                  <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-900/50 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                    <h3 className="text-lg font-semibold mb-4 text-yellow-500">Global Integration Status</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Fruitful Global Treaty Grid</span>
                          <span className="text-sm font-semibold">95%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">VaultMesh™ Security</span>
                          <span className="text-sm font-semibold">98%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Compliance Coverage</span>
                          <span className="text-sm font-semibold">100%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ecosystem Network Visualization */}
                <div className={`mt-6 p-8 rounded-lg border text-center ${isDarkMode ? 'bg-gray-900/50 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                  <Globe className="w-16 h-16 mx-auto mb-4 text-orange-400" />
                  <h3 className="text-lg font-semibold mb-2">Interactive Ecosystem Network</h3>
                  <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Visualize mining operations, resource flows, and VaultMesh™ connections across the global network
                  </p>
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-black">
                    Launch 3D Visualization
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div className="space-y-6">
            <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-orange-400">
                  <BarChart3 className="inline w-5 h-5 mr-2" />
                  Mining Operations Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Key Performance Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-900/50 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                    <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-500">$42.8M</p>
                    <p className="text-xs text-green-400">+18.5% this month</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-900/50 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                    <p className="text-sm text-gray-500 mb-1">Active Projects</p>
                    <p className="text-2xl font-bold text-blue-500">{projects.filter(p => p.status === 'live').length}</p>
                    <p className="text-xs text-blue-400">of {projects.length} total</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-900/50 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                    <p className="text-sm text-gray-500 mb-1">Avg. Royalty Rate</p>
                    <p className="text-2xl font-bold text-yellow-500">7.8%</p>
                    <p className="text-xs text-yellow-400">Across all regions</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-900/50 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                    <p className="text-sm text-gray-500 mb-1">Efficiency Score</p>
                    <p className="text-2xl font-bold text-purple-500">{metrics.systemHealth.efficiency}%</p>
                    <p className="text-xs text-purple-400">System-wide average</p>
                  </div>
                </div>

                {/* Charts Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-900/50 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                    <h3 className="text-lg font-semibold mb-4">Monthly Ore Yield Trend</h3>
                    <div className="h-64 flex items-center justify-center">
                      <TrendingUp className="w-12 h-12 text-green-400" />
                    </div>
                  </div>
                  <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-900/50 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                    <h3 className="text-lg font-semibold mb-4">Regional Distribution</h3>
                    <div className="h-64 flex items-center justify-center">
                      <Globe className="w-12 h-12 text-blue-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* API Keys View */}
        {activeView === 'api-keys' && (
          <div className="space-y-6">
            <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-orange-400">
                  <Key className="inline w-5 h-5 mr-2" />
                  API Keys & Integration Credentials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-600/20">
                    <div>
                      <p className="font-semibold">MineNest™ Production API</p>
                      <p className="text-sm text-gray-400">mn_live_key_••••••••••••••••</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Regenerate</Button>
                      <Button size="sm" variant="outline">Copy</Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-600/20">
                    <div>
                      <p className="font-semibold">VaultMesh™ Integration</p>
                      <p className="text-sm text-gray-400">vm_integration_••••••••••••••••</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Regenerate</Button>
                      <Button size="sm" variant="outline">Copy</Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-600/20">
                    <div>
                      <p className="font-semibold">PayPal Integration</p>
                      <p className="text-sm text-gray-400">pp_client_••••••••••••••••</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Configure</Button>
                      <Button size="sm" variant="outline">Copy</Button>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-sm text-yellow-400">
                    <strong>Security Notice:</strong> Never share your API keys. Always use environment variables in production.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Other views placeholder */}
        {activeView !== 'dashboard' && activeView !== 'projects' && activeView !== 'new-project' && 
         activeView !== 'ecosystem-map' && activeView !== 'analytics' && activeView !== 'api-keys' && (
          <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">
                {mineNestNavigation.find(nav => nav.id === activeView)?.name}
              </h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                This section is under development. Full MineNest™ functionality coming soon.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}