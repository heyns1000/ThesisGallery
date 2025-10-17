import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart,
  Users,
  DollarSign,
  Shield,
  Eye,
  Music,
  FileText,
  Zap,
  Target,
  Globe,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Baby,
  Gift,
  Coins,
  Volume2,
  Video,
  Radio,
  Headphones,
  Award,
  Clock,
  ArrowRight,
  ArrowDown
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  InteractiveCard, 
  PulseIndicator, 
  ProgressRing, 
  SparkleEffect,
  RippleEffect,
  TypewriterText,
  MorphingButton
} from "@/components/ui/micro-interactions";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function BanimalIntegration() {
  const [selectedDistribution, setSelectedDistribution] = useState<string | null>(null);
  const [activeVaultActions, setActiveVaultActions] = useState<any[]>([]);
  const [sonicGridStatus, setSonicGridStatus] = useState("active");
  const { toast } = useToast();

  // Mock data for Banimal ecosystem - would come from actual integration
  const banimalMetrics = {
    totalSales: 156750,
    childrenHelped: 2834,
    activeDonations: 89,
    vaultActions: 12,
    mediaProcessed: 156,
    sonicGridConnections: 8,
    pendingDistributions: 4
  };

  const distributionRules = {
    childCharity: 35, // 35% to children in need
    developer: 25, // 25% to developer
    operations: 20, // 20% to operations
    sonicGrid: 10, // 10% to SonicGrid processing
    vault: 10 // 10% to vault reserves
  };

  const recentTransactions = [
    {
      id: 1,
      type: "sale",
      amount: 450,
      product: "Banimal Winter Onesie Set",
      timestamp: "2 minutes ago",
      distribution: {
        charity: 157.50,
        developer: 112.50,
        operations: 90,
        sonicGrid: 45,
        vault: 45
      },
      childBeneficiary: "Cape Town Children's Home",
      status: "distributed"
    },
    {
      id: 2,
      type: "sale", 
      amount: 275,
      product: "Banimal Soft Toy Bundle",
      timestamp: "8 minutes ago",
      distribution: {
        charity: 96.25,
        developer: 68.75,
        operations: 55,
        sonicGrid: 27.50,
        vault: 27.50
      },
      childBeneficiary: "Johannesburg Youth Center",
      status: "processing"
    }
  ];

  const sonicGridConnections = [
    {
      id: 1,
      name: "Affirmative Document Processor",
      type: "Media Processing",
      status: "active",
      documentsProcessed: 48,
      confidenceScore: 97.8,
      lastActivity: "30 seconds ago"
    },
    {
      id: 2,
      name: "Charitable Impact Validator",
      type: "Impact Verification",
      status: "active", 
      validationsCompleted: 156,
      confidenceScore: 99.2,
      lastActivity: "1 minute ago"
    },
    {
      id: 3,
      name: "Audio Distribution Network",
      type: "SonicGrid Core",
      status: "active",
      audioStreams: 12,
      confidenceScore: 95.4,
      lastActivity: "15 seconds ago"
    }
  ];

  const vaultActions = [
    {
      id: 1,
      action: "Charitable Distribution",
      amount: 157.50,
      beneficiary: "Cape Town Children's Home",
      timestamp: "2 minutes ago",
      status: "completed",
      vaultSignature: "VLT-BNL-042-X1",
      sonicValidation: true
    },
    {
      id: 2,
      action: "Developer Payment",
      amount: 112.50,
      beneficiary: "Development Team",
      timestamp: "2 minutes ago", 
      status: "completed",
      vaultSignature: "VLT-BNL-042-X2",
      sonicValidation: true
    },
    {
      id: 3,
      action: "SonicGrid Processing Fee",
      amount: 45.00,
      beneficiary: "Media Sector Integration",
      timestamp: "2 minutes ago",
      status: "completed", 
      vaultSignature: "VLT-BNL-042-X3",
      sonicValidation: true
    }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update active vault actions
      setActiveVaultActions(prev => [
        ...prev.slice(-2),
        {
          id: Date.now(),
          action: "Real-time Distribution",
          amount: Math.floor(Math.random() * 200) + 50,
          timestamp: "Just now",
          status: "processing"
        }
      ]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleDistributionView = (transactionId: string) => {
    setSelectedDistribution(transactionId);
    toast({
      title: "Distribution Details",
      description: "Viewing vault action breakdown for transaction",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-900 dark:via-cyan-900 dark:to-blue-900 p-6">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Baby className="w-10 h-10 text-teal-600" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Banimal™ <span className="text-teal-600">Global Integration</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Charitable Distribution • SonicGrid™ Media • Vault Actions
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-teal-600">
                {banimalMetrics.childrenHelped.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Children Helped</div>
            </div>
            <PulseIndicator active={sonicGridStatus === "active"} color="bg-teal-400" size="w-4 h-4" />
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/50 dark:bg-gray-800/50">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="distributions">Live Distributions</TabsTrigger>
          <TabsTrigger value="sonicgrid">SonicGrid™</TabsTrigger>
          <TabsTrigger value="vault">Vault Actions</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                label: "Total Sales", 
                value: `R${banimalMetrics.totalSales.toLocaleString()}`, 
                icon: DollarSign, 
                color: "text-green-600",
                trend: "+12.5%"
              },
              { 
                label: "Children Helped", 
                value: banimalMetrics.childrenHelped.toLocaleString(), 
                icon: Heart, 
                color: "text-red-500",
                trend: "+8.3%"
              },
              { 
                label: "Active Donations", 
                value: banimalMetrics.activeDonations.toString(), 
                icon: Gift, 
                color: "text-purple-600",
                trend: "+15.2%"
              },
              { 
                label: "Vault Actions", 
                value: banimalMetrics.vaultActions.toString(), 
                icon: Shield, 
                color: "text-blue-600",
                trend: "+23.1%"
              }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <SparkleEffect trigger={true}>
                  <InteractiveCard className="bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-600 p-6 text-center">
                    <metric.icon className={`w-8 h-8 mx-auto mb-3 ${metric.color}`} />
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {metric.label}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {metric.trend}
                    </Badge>
                  </InteractiveCard>
                </SparkleEffect>
              </motion.div>
            ))}
          </div>

          {/* Distribution Rules Visualization */}
          <InteractiveCard className="bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-600 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Automatic Distribution Rules
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {Object.entries(distributionRules).map(([key, percentage]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="text-gray-900 dark:text-white font-bold">
                        {percentage}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-800 dark:to-cyan-800 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  Live Distribution Example
                </h4>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <div>Sale Amount: <strong>R450.00</strong></div>
                  <div className="border-t pt-2 mt-2">
                    <div>→ Children's Charity: <strong>R157.50</strong></div>
                    <div>→ Developer Team: <strong>R112.50</strong></div>
                    <div>→ Operations: <strong>R90.00</strong></div>
                    <div>→ SonicGrid™: <strong>R45.00</strong></div>
                    <div>→ Vault Reserve: <strong>R45.00</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </InteractiveCard>
        </TabsContent>

        {/* Live Distributions Tab */}
        <TabsContent value="distributions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <InteractiveCard className="bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-600 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {transaction.product}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {transaction.timestamp}
                      </p>
                      <Badge 
                        variant={transaction.status === 'distributed' ? 'default' : 'secondary'}
                        className="mt-2"
                      >
                        {transaction.status === 'distributed' ? '✅ Distributed' : '⏳ Processing'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        R{transaction.amount}
                      </div>
                      <ProgressRing 
                        progress={transaction.status === 'distributed' ? 100 : 75} 
                        size={40} 
                        strokeWidth={3}
                        color="#10b981"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-medium">
                        <Heart className="w-4 h-4" />
                        Child Beneficiary
                      </div>
                      <div className="text-red-800 dark:text-red-200 text-sm mt-1">
                        {transaction.childBeneficiary}
                      </div>
                      <div className="text-red-600 dark:text-red-400 font-bold">
                        R{transaction.distribution.charity.toFixed(2)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Developer: <strong>R{transaction.distribution.developer.toFixed(2)}</strong></div>
                      <div>Operations: <strong>R{transaction.distribution.operations.toFixed(2)}</strong></div>
                      <div>SonicGrid™: <strong>R{transaction.distribution.sonicGrid.toFixed(2)}</strong></div>
                      <div>Vault: <strong>R{transaction.distribution.vault.toFixed(2)}</strong></div>
                    </div>

                    <RippleEffect onClick={() => handleDistributionView(transaction.id.toString())}>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        <Eye className="w-4 h-4 mr-2" />
                        View Vault Actions
                      </Button>
                    </RippleEffect>
                  </div>
                </InteractiveCard>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* SonicGrid Tab */}
        <TabsContent value="sonicgrid" className="space-y-6">
          <InteractiveCard className="bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-600 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-purple-600" />
              SonicGrid™ Media Integration
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Affirmative document processing and media validation for charitable distributions
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sonicGridConnections.map((connection, index) => (
                <motion.div
                  key={connection.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-200 dark:border-purple-600 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {connection.type === "Media Processing" && <FileText className="w-5 h-5 text-purple-600" />}
                        {connection.type === "Impact Verification" && <Shield className="w-5 h-5 text-green-600" />}
                        {connection.type === "SonicGrid Core" && <Radio className="w-5 h-5 text-blue-600" />}
                        <Badge variant="outline" className="text-xs">
                          {connection.status.toUpperCase()}
                        </Badge>
                      </div>
                      <PulseIndicator active={connection.status === "active"} color="bg-green-400" size="w-3 h-3" />
                    </div>
                    
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {connection.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {connection.type}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span className="font-bold">{connection.confidenceScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processed:</span>
                        <span className="font-bold">
                          {connection.documentsProcessed || connection.validationsCompleted || connection.audioStreams}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Last: {connection.lastActivity}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </InteractiveCard>
        </TabsContent>

        {/* Vault Actions Tab */}
        <TabsContent value="vault" className="space-y-6">
          <InteractiveCard className="bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-600 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Live Vault Actions
            </h2>
            
            <div className="space-y-4">
              {vaultActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200 dark:border-blue-600 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {action.vaultSignature}
                          </Badge>
                          {action.sonicValidation && (
                            <Badge variant="default" className="text-xs bg-green-600">
                              🎵 Sonic Validated
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {action.action}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          → {action.beneficiary}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {action.timestamp}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          R{action.amount.toFixed(2)}
                        </div>
                        <Badge 
                          variant={action.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {action.status === 'completed' ? '✅ Complete' : '⏳ Processing'}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </InteractiveCard>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <InteractiveCard className="bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-600 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Baby className="w-6 h-6 text-teal-600" />
              Banimal™ Product Ecosystem
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Winter Onesies Collection",
                  description: "Age-specific illustrated characters, 0-12 months",
                  price: "R450 - R650",
                  charityImpact: "35% → Children's Homes",
                  category: "Clothing"
                },
                {
                  name: "Soft Toys Collection", 
                  description: "80cm & 50cm plush companions",
                  price: "R275 - R895",
                  charityImpact: "35% → Youth Centers",
                  category: "Toys"
                },
                {
                  name: "Feeding Bibs Collection",
                  description: "Adjustable velcro, fluid-proof backing",
                  price: "R125 - R175",
                  charityImpact: "35% → Feeding Programs",
                  category: "Accessories"
                },
                {
                  name: "Gift Bundle Sets",
                  description: "Complete newborn starter packages",
                  price: "R850 - R1250",
                  charityImpact: "35% → Complete Care",
                  category: "Bundles"
                }
              ].map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 border-teal-200 dark:border-teal-600 p-5">
                    <div className="mb-4">
                      <Badge variant="outline" className="mb-2">
                        {product.category}
                      </Badge>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {product.description}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Price:</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {product.price}
                        </span>
                      </div>
                      
                      <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded text-sm">
                        <Heart className="w-3 h-3 inline mr-1 text-red-600" />
                        <span className="text-red-700 dark:text-red-300">
                          {product.charityImpact}
                        </span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700">
                      <Gift className="w-4 h-4 mr-2" />
                      Buy & Help Child
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </InteractiveCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}