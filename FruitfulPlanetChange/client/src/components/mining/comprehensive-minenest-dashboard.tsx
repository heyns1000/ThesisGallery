import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  Pickaxe, 
  Truck, 
  BarChart3, 
  Shield, 
  MapPin, 
  Users, 
  Zap, 
  Settings,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Search,
  Plus,
  Monitor,
  Sun,
  Moon,
  Home,
  FolderPlus,
  Wrench,
  Network,
  ShoppingCart,
  Palette,
  FileText,
  Key,
  UserPlus,
  LogIn
} from "lucide-react";
import { motion } from "framer-motion";

interface ComprehensiveMineNestDashboardProps {
  brands: Array<{
    id: number;
    name: string;
    description: string;
    status: string;
    integration: string;
    metadata?: any;
    parentId?: number | null;
  }>;
}

type ViewType = 'dashboard' | 'projects' | 'new-project' | 'scroll-builder' | 'ecosystem-map' | 'global-checkout' | 'templates' | 'licenses' | 'analytics' | 'api-keys' | 'settings' | 'login' | 'signup';

export function ComprehensiveMineNestDashboard({ brands }: ComprehensiveMineNestDashboardProps) {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadedProjects, setLoadedProjects] = useState(12);

  // Filter brands - parent brands only (subnodes have parentId)
  const parentBrands = brands.filter(b => !b.parentId);
  const activeBrands = parentBrands.filter(b => b.status === 'active' || b.status === 'development');
  
  // Calculate comprehensive metrics from actual data
  const totalProjects = activeBrands.reduce((acc, brand) => acc + (brand.metadata?.totalProjects || 0), 0);
  const totalRigs = activeBrands.reduce((acc, brand) => acc + (brand.metadata?.activeRigs || 0), 0);
  const monthlyYield = activeBrands.reduce((acc, brand) => acc + (brand.metadata?.monthlyYield || 0), 0);

  // Filter and search projects
  const filteredProjects = activeBrands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'live' && brand.status === 'active') ||
                         (statusFilter === 'pending' && brand.status === 'development') ||
                         (statusFilter === 'draft' && brand.status === 'draft') ||
                         (statusFilter === 'error' && brand.status === 'maintenance');
    return matchesSearch && matchesStatus;
  });

  const displayedProjects = filteredProjects.slice(0, loadedProjects);

  const Navigation = () => (
    <nav className="space-y-2">
      {[
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'projects', icon: FolderPlus, label: 'Projects' },
        { id: 'new-project', icon: Plus, label: 'New Project' },
        { id: 'scroll-builder', icon: Wrench, label: 'Content Builder' },
        { id: 'ecosystem-map', icon: Network, label: 'Ecosystem Map' },
        { id: 'global-checkout', icon: ShoppingCart, label: 'Global Payment' },
        { id: 'templates', icon: Palette, label: 'Templates' },
        { id: 'licenses', icon: FileText, label: 'My Licenses' },
        { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        { id: 'api-keys', icon: Key, label: 'API Keys' },
        { id: 'settings', icon: Settings, label: 'Settings' },
        { id: 'login', icon: LogIn, label: 'Sign In' },
        { id: 'signup', icon: UserPlus, label: 'Sign Up' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setCurrentView(item.id as ViewType)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
            currentView === item.id
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-300 hover:bg-slate-700/50 hover:text-blue-400'
          }`}
        >
          <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-white' : 'text-amber-500'}`} />
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );

  const DashboardView = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Welcome Panel */}
      <Card className="bg-slate-800/70 border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-amber-400 text-2xl">Welcome Back, Mining Operations Lead!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300">
            Your MineNest™ portal provides comprehensive tools for managing, optimizing, and securing your mining and resource operations across the Fruitful Global Treaty Grid.
          </p>
          <Button 
            onClick={() => setCurrentView('new-project')}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Start New Mining Project
          </Button>
        </CardContent>
      </Card>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/70 border-amber-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-400 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Total Active Mine Sites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">{totalProjects.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/70 border-amber-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-400 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Active Drill Rigs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">{totalRigs.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/70 border-amber-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-400 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Monthly Ore Yield (Tonnes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">{monthlyYield.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Operational Health Chart */}
      <Card className="bg-slate-800/70 border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-amber-400">Operational Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-slate-400">
            <div className="text-center space-y-4">
              <BarChart3 className="w-16 h-16 mx-auto text-amber-400" />
              <p>Real-time system health chart will be displayed here</p>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="bg-slate-700/50 p-3 rounded">
                  <div className="text-green-400 font-bold">98.5%</div>
                  <div>Performance</div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded">
                  <div className="text-green-400 font-bold">99.2%</div>
                  <div>Security</div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded">
                  <div className="text-green-400 font-bold">97.8%</div>
                  <div>Efficiency</div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded">
                  <div className="text-green-400 font-bold">99.9%</div>
                  <div>Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MineNest Core Protocol */}
      <Card className="bg-slate-800/70 border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-amber-400">MineNest™ Core Protocol Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300">
            MineNest™ ensures secure, real-time data flows for the Mining & Resources industry.
          </p>
          <div className="space-y-2">
            <h4 className="text-amber-300 font-semibold">Key Features:</h4>
            <ul className="space-y-2 text-slate-300">
              {[
                'Real-time Metrics Overview for immediate insights',
                'VaultTrace™ Ledger Entries for secure and transparent logging',
                'Integrated Compliance via VaultLink™ for mining-specific regulations',
                'Scalable Node Expansion for adapting to fluctuating demands',
                'Predictive Analytics for proactive decision-making'
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
            Go to FAA™ Mining & Resources Public Page →
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const ProjectsView = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="bg-slate-800/70 border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-amber-400">Your Mining Projects & Operations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search projects..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-amber-500/30 text-white placeholder:text-slate-400"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-amber-500/30 text-white">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="live">Active</SelectItem>
                <SelectItem value="pending">Exploration</SelectItem>
                <SelectItem value="draft">Planned</SelectItem>
                <SelectItem value="error">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-slate-700/70 border-amber-500/20 hover:border-amber-400/50 transition-colors h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-amber-300 text-sm">{project.name}</CardTitle>
                      <Badge className={`text-xs ${
                        project.status === 'active' ? 'bg-green-600' : 
                        project.status === 'development' ? 'bg-amber-600' : 'bg-slate-600'
                      } text-white`}>
                        {project.status === 'active' ? 'Active' : 
                         project.status === 'development' ? 'Development' : project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-300 text-xs line-clamp-2">{project.description}</p>
                    
                    {project.metadata && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {project.metadata.totalProjects && (
                          <div className="text-slate-400">
                            Projects: <span className="text-amber-300">{project.metadata.totalProjects}</span>
                          </div>
                        )}
                        {project.metadata.activeRigs && (
                          <div className="text-slate-400">
                            Rigs: <span className="text-amber-300">{project.metadata.activeRigs}</span>
                          </div>
                        )}
                        {project.metadata.monthlyYield && (
                          <div className="text-slate-400">
                            Yield: <span className="text-amber-300">{project.metadata.monthlyYield}t</span>
                          </div>
                        )}
                        {project.metadata.subnodeCount && (
                          <div className="text-slate-400">
                            Subnodes: <span className="text-amber-300">{project.metadata.subnodeCount}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs flex-1">
                        <Monitor className="w-3 h-3 mr-1" />
                        Monitor
                      </Button>
                      <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs">
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs">
                        <Activity className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {loadedProjects < filteredProjects.length && (
            <div className="text-center pt-4">
              <Button 
                onClick={() => setLoadedProjects(prev => prev + 12)}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Load More Projects
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      darkMode ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      {/* Sidebar */}
      <aside className={`w-72 p-6 border-r flex flex-col transition-colors ${
        darkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className="text-center mb-8 relative">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-0 right-0 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <h2 className="text-2xl font-bold">
            <span className="text-white">Fruitful™</span> | <span className="text-amber-400">MineNest™</span>
          </h2>
        </div>

        {/* Navigation */}
        <Navigation />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'projects' && <ProjectsView />}
        {currentView === 'new-project' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-slate-800/70 border-amber-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Initiate a New Mining Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-6">Create a new mining project with comprehensive MineNest™ integration.</p>
                <div className="text-center py-12">
                  <Pickaxe className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                  <p className="text-slate-400">New project creation form will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {(currentView !== 'dashboard' && currentView !== 'projects' && currentView !== 'new-project') && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-slate-800/70 border-amber-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">{currentView.charAt(0).toUpperCase() + currentView.slice(1).replace('-', ' ')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Wrench className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                  <p className="text-slate-400">This section will be implemented with comprehensive MineNest™ features</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8 mt-12"
        >
          <p className="text-slate-400">
            Powered by <span className="text-amber-400">MineNest™</span> | 
            Secured by <span className="text-amber-400">VaultMesh™</span> | 
            Part of the <span className="text-amber-400">Fruitful Global</span> ecosystem
          </p>
        </motion.div>
      </main>
    </div>
  );
}