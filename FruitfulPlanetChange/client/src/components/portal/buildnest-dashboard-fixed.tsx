import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Cpu, 
  Zap, 
  Power, 
  Brain, 
  Search, 
  RefreshCcw, 
  Shield, 
  BarChart3, 
  Layers, 
  Lock, 
  RotateCcw, 
  Flame, 
  TrendingUp, 
  DollarSign, 
  Target,
  Pickaxe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ProgressRing, 
  PulseIndicator, 
  InteractiveCard, 
  SuccessCheckmark,
  RippleEffect,
  SparkleEffect
} from "@/components/ui/micro-interactions";

export function BuildNestDashboard() {
  const [selectedIndustry, setSelectedIndustry] = useState("Finance");
  const [selectedDataVolume, setSelectedDataVolume] = useState("Large");
  const [selectedNetwork, setSelectedNetwork] = useState("Global");
  const [selectedSecurity, setSelectedSecurity] = useState("High");
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [operationLogs, setOperationLogs] = useState<string[]>([]);
  const [activeEngines, setActiveEngines] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sparkleEngines, setSparkleEngines] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initial metrics
  const [metrics, setMetrics] = useState({
    networkLoad: 78.5,
    securityScore: 94.2,
    equipmentUptime: 99.1,
    costSavings: 12.7,
    roi: 145,
    responseTime: 0.3
  });

  const engines = [
    { id: "corethink", name: "Corethink™", icon: Brain, description: "Primary cognitive processing engine" },
    { id: "truthweight", name: "TruthWeight™", icon: Search, description: "Data validation and truth assessment" },
    { id: "ecosynth", name: "EchoSynth™", icon: RefreshCcw, description: "Pattern recognition and synthesis" },
    { id: "autosigil", name: "AutoSigil™", icon: Shield, description: "Automated security and encryption" },
    { id: "pulseindex", name: "PulseIndex™", icon: BarChart3, description: "Real-time indexing and monitoring" },
    { id: "omnitrace", name: "OmniTrace™", icon: Layers, description: "Comprehensive system tracing" },
    { id: "lifthalo", name: "LiftHalo™", icon: Lock, description: "Elevated security protocols" },
    { id: "mirrorloop", name: "MirrorLoop™", icon: RotateCcw, description: "Recursive optimization cycles" },
    { id: "fireratio", name: "FireRatio™", icon: Flame, description: "Performance scaling optimization" }
  ];

  const [engineMetrics, setEngineMetrics] = useState<Record<string, any>>({});

  const generateRandomMetrics = () => ({
    networkLoad: 60 + Math.random() * 30,
    securityScore: 85 + Math.random() * 15,
    equipmentUptime: 95 + Math.random() * 5,
    costSavings: 8 + Math.random() * 10,
    roi: 120 + Math.random() * 80,
    responseTime: 0.1 + Math.random() * 0.5
  });

  const addLog = (message: string, type: "info" | "success" | "warning" = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === "success" ? "✓" : type === "warning" ? "⚠" : "ℹ";
    setOperationLogs(prev => [...prev.slice(-9), `[${timestamp}] ${prefix} ${message}`]);
  };

  const updateEngineMetrics = () => {
    const newEngineMetrics: Record<string, any> = {};
    engines.forEach(engine => {
      newEngineMetrics[engine.id] = {
        efficiency: 70 + Math.random() * 30,
        status: activeEngines.includes(engine.id) ? "Active" : "Standby",
        progress: activeEngines.includes(engine.id) ? 80 + Math.random() * 20 : 20 + Math.random() * 30
      };
    });
    setEngineMetrics(newEngineMetrics);
  };

  const startSimulation = () => {
    setIsLiveMode(false);
    addLog("Starting simulation with current parameters...", "info");
    setMetrics(generateRandomMetrics());
    updateEngineMetrics();
    addLog("Simulation complete - all systems operational", "success");
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const startLiveMode = () => {
    setIsLiveMode(true);
    addLog("Connecting to live data streams...", "info");
    addLog("Live mode activated - metrics updating every 5 seconds", "success");
    
    const interval = setInterval(() => {
      setMetrics(generateRandomMetrics());
      updateEngineMetrics();
      addLog(`Live update: Network load ${(60 + Math.random() * 30).toFixed(1)}%`, "info");
    }, 5000);
    
    intervalRef.current = interval;
  };

  const stopLiveMode = () => {
    setIsLiveMode(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    addLog("Live mode deactivated", "warning");
  };

  const toggleEngine = (engineId: string) => {
    setActiveEngines(prev => {
      const newActive = prev.includes(engineId) 
        ? prev.filter(id => id !== engineId)
        : [...prev, engineId];
      
      const engine = engines.find(e => e.id === engineId);
      addLog(`${engine?.name} ${newActive.includes(engineId) ? 'activated' : 'deactivated'}`, "info");
      
      if (newActive.includes(engineId)) {
        setSparkleEngines(prev => new Set([...prev, engineId]));
        setTimeout(() => {
          setSparkleEngines(prev => {
            const newSet = new Set(prev);
            newSet.delete(engineId);
            return newSet;
          });
        }, 1000);
      }
      
      return newActive;
    });
  };

  useEffect(() => {
    addLog("BuildNest Dashboard initialized", "success");
    updateEngineMetrics();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    updateEngineMetrics();
  }, [activeEngines]);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-yellow-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="bg-black/50 border-b border-yellow-500/20 p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            className="text-4xl font-bold text-yellow-400 mb-2 flex items-center gap-3"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Cpu className="w-10 h-10" />
            </motion.div>
            FAA.zone™ MONSTER OMNI™ BuildNest Dashboard
            <SuccessCheckmark show={showSuccess} size={32} />
          </motion.h1>
          <motion.p 
            className="text-yellow-200/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Advanced sector-specific brand management with AI-powered real-time metrics and ecosystem integration
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Control Panel */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <InteractiveCard className="bg-black/70 border-yellow-500/30 p-6">
            <motion.h2 
              className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              🎛️ Demo Configuration
              <PulseIndicator active={isLiveMode} color="bg-green-400" />
            </motion.h2>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-yellow-400 font-medium">Industry</label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="bg-black/50 border-yellow-500/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Finance", "Healthcare", "Manufacturing", "Technology", "Agriculture", "Mining", "Education"].map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-yellow-400 font-medium">Data Volume</label>
                <Select value={selectedDataVolume} onValueChange={setSelectedDataVolume}>
                  <SelectTrigger className="bg-black/50 border-yellow-500/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Small", "Medium", "Large", "Enterprise"].map(volume => (
                      <SelectItem key={volume} value={volume}>{volume}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-yellow-400 font-medium">Network Topology</label>
                <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                  <SelectTrigger className="bg-black/50 border-yellow-500/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Local", "Regional", "Global", "Multi-Cloud"].map(network => (
                      <SelectItem key={network} value={network}>{network}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-yellow-400 font-medium">Security Level</label>
                <Select value={selectedSecurity} onValueChange={setSelectedSecurity}>
                  <SelectTrigger className="bg-black/50 border-yellow-500/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Standard", "High", "Maximum", "Classified"].map(security => (
                      <SelectItem key={security} value={security}>{security}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <RippleEffect onClick={startSimulation}>
                <motion.button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="w-4 h-4" />
                  Generate Simulation
                </motion.button>
              </RippleEffect>
              
              <AnimatePresence mode="wait">
                {!isLiveMode ? (
                  <motion.div
                    key="connect"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <RippleEffect onClick={startLiveMode}>
                      <motion.button
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Activity className="w-4 h-4" />
                        Connect Live Data
                      </motion.button>
                    </RippleEffect>
                  </motion.div>
                ) : (
                  <motion.div
                    key="stop"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <RippleEffect onClick={stopLiveMode}>
                      <motion.button
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Power className="w-4 h-4" />
                        Stop Live Data
                      </motion.button>
                    </RippleEffect>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </InteractiveCard>
        </motion.div>

        {/* KPI Overview */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            { value: metrics.networkLoad, label: "Network Load", suffix: "%" },
            { value: metrics.securityScore, label: "Security Score", suffix: "%" },
            { value: metrics.equipmentUptime, label: "Equipment Uptime", suffix: "%" },
            { value: metrics.costSavings, label: "Cost Savings", prefix: "$", suffix: "M" }
          ].map((kpi, index) => (
            <motion.div
              key={kpi.label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <InteractiveCard className="bg-black/70 border-yellow-500/30 p-4 text-center">
                <motion.div 
                  className="text-3xl font-bold text-yellow-400 mb-2"
                  animate={{ 
                    color: isLiveMode ? ["#facc15", "#fbbf24", "#facc15"] : "#facc15"
                  }}
                  transition={{ duration: 2, repeat: isLiveMode ? Infinity : 0 }}
                >
                  {kpi.prefix}{kpi.value.toFixed(1)}{kpi.suffix}
                </motion.div>
                <div className="text-yellow-200/80 text-sm">{kpi.label}</div>
                <div className="mt-2 flex justify-center">
                  <ProgressRing 
                    progress={kpi.value} 
                    size={60} 
                    strokeWidth={4}
                    color={
                      kpi.value > 90 ? "#10b981" : 
                      kpi.value > 70 ? "#facc15" : "#ef4444"
                    }
                  />
                </div>
              </InteractiveCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Engines Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {engines.map((engine) => {
            const metrics = engineMetrics[engine.id] || { efficiency: 0, status: "Standby", progress: 0 };
            const IconComponent = engine.icon;
            const isActive = activeEngines.includes(engine.id);
            const hasSparkle = sparkleEngines.has(engine.id);
            
            return (
              <motion.div
                key={engine.id}
                variants={{
                  hidden: { y: 50, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: isActive ? "0 10px 30px rgba(250, 200, 20, 0.3)" : "0 10px 25px rgba(0,0,0,0.2)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <SparkleEffect trigger={hasSparkle}>
                  <motion.div
                    className={`p-6 cursor-pointer border-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-yellow-900/20 border-yellow-400 shadow-lg shadow-yellow-400/20' 
                        : 'bg-black/70 border-yellow-500/30 opacity-60'
                    }`}
                    onClick={() => toggleEngine(engine.id)}
                    animate={{
                      borderColor: isActive ? ["#facc15", "#fbbf24", "#facc15"] : "#6b7280",
                      backgroundColor: isActive ? 
                        ["rgba(250, 200, 20, 0.1)", "rgba(250, 200, 20, 0.15)", "rgba(250, 200, 20, 0.1)"] : 
                        "rgba(0, 0, 0, 0.7)"
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: isActive ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        animate={isActive ? { 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ 
                          duration: 2, 
                          repeat: isActive ? Infinity : 0,
                          repeatDelay: 1
                        }}
                      >
                        <IconComponent className="w-6 h-6 text-yellow-400" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-yellow-400">{engine.name}</h3>
                      <PulseIndicator 
                        active={isActive} 
                        color={isActive ? "bg-green-400" : "bg-gray-500"} 
                        size="w-2 h-2"
                      />
                    </div>
                    <p className="text-yellow-200/80 text-sm mb-4">{engine.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-300">Efficiency:</span>
                        <span className="text-yellow-200">{metrics.efficiency.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-300">Status:</span>
                        <Badge variant={isActive ? "default" : "secondary"}>
                          {metrics.status}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          className="bg-yellow-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${metrics.progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </SparkleEffect>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Operations Log */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <InteractiveCard className="bg-black/70 border-yellow-500/30 p-6">
            <motion.h3 
              className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                animate={isLiveMode ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1, repeat: isLiveMode ? Infinity : 0 }}
              >
                <Activity className="w-5 h-5" />
              </motion.div>
              Operations Log 
              <AnimatePresence>
                {isLiveMode && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <Badge className="bg-green-600 animate-pulse">LIVE</Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.h3>
            <div className="bg-black/90 border border-yellow-500/20 rounded p-4 h-64 overflow-y-auto font-mono text-sm">
              <AnimatePresence>
                {operationLogs.map((log, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="text-green-400 mb-1"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </InteractiveCard>
        </motion.div>
      </div>
    </motion.div>
  );
}