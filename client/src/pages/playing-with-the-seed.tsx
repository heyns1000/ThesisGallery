import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sprout, Globe, Atom, Heart, Target, Zap, Sparkles, Leaf,
  Trees, Sun, Droplets, MapPin, Clock, TrendingUp,
  Eye, Shield, CheckCircle, AlertCircle, Users, Award
} from "lucide-react";

const PlayingWithTheSeed = () => {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [intentionVerified, setIntentionVerified] = useState(false);
  const [atomLevelView, setAtomLevelView] = useState(false);

  // FAA™ Global Monitoring Data - 10 Core Brands
  const globalBrands = [
    {
      id: 1,
      name: "FAA™ Global Monitoring™",
      category: "Compliance & Monitoring",
      method: "Licensing",
      markets: ["USA", "EU", "APAC"],
      status: "Active Monitoring",
      atomLevel: 99.8,
      soilHealth: 95,
      seedProgress: 87,
      nextAction: "Review IP Ownership",
      timestamp: "2025-01-10 08:00 UTC",
      owner: "Heyns Schoeman™",
      methodology: "Atom-Level Execution™"
    },
    {
      id: 2,
      name: "FAA™ Legal Compliance™",
      category: "Legal Framework Development",
      method: "Automation",
      markets: ["Global"],
      status: "Active Monitoring",
      atomLevel: 98.5,
      soilHealth: 92,
      seedProgress: 89,
      nextAction: "Review Contracts",
      timestamp: "2025-01-11 10:00 UTC",
      owner: "Heyns Schoeman™",
      methodology: "Atom-Level Execution™"
    },
    {
      id: 3,
      name: "FAA™ Intellectual Property™",
      category: "Legal & Financial Structuring",
      method: "Automation",
      markets: ["Global"],
      status: "Active Monitoring",
      atomLevel: 97.9,
      soilHealth: 94,
      seedProgress: 91,
      nextAction: "Review IP Ownership",
      timestamp: "2025-01-12 11:00 UTC",
      owner: "Heyns Schoeman™",
      methodology: "Atom-Level Execution™"
    },
    {
      id: 4,
      name: "FAA™ Financial Systems™",
      category: "Financial Systems Regulation",
      method: "Compliance Systems",
      markets: ["USA", "EU", "APAC"],
      status: "Active Monitoring",
      atomLevel: 96.7,
      soilHealth: 88,
      seedProgress: 85,
      nextAction: "Review Financial Systems",
      timestamp: "2025-01-13 12:00 UTC",
      owner: "Heyns Schoeman™",
      methodology: "Atom-Level Execution™"
    },
    {
      id: 5,
      name: "FAA™ Blockchain Integration™",
      category: "Compliance & Blockchain Solutions",
      method: "Blockchain Technology",
      markets: ["Global"],
      status: "Ongoing Monitoring",
      atomLevel: 98.2,
      soilHealth: 96,
      seedProgress: 93,
      nextAction: "Blockchain Verification",
      timestamp: "2025-01-14 13:00 UTC",
      owner: "Heyns Schoeman™",
      methodology: "Atom-Level Execution™"
    },
    {
      id: 6,
      name: "FAA™ Data Protection™",
      category: "Data Security & Protection",
      method: "Cybersecurity",
      markets: ["Global"],
      status: "Active Monitoring",
      atomLevel: 99.1,
      soilHealth: 97,
      seedProgress: 94,
      nextAction: "Review Data Protection Policies",
      timestamp: "2025-01-15 14:00 UTC",
      owner: "Heyns Schoeman™",
      methodology: "Atom-Level Execution™"
    },
    {
      id: 7,
      name: "FAA™ AI Compliance™",
      category: "Emerging Technology & AI Compliance",
      method: "AI & Machine Learning",
      markets: ["Global"],
      status: "Ongoing Monitoring",
      atomLevel: 97.6,
      soilHealth: 93,
      seedProgress: 88,
      nextAction: "Review AI Algorithms",
      timestamp: "2025-01-16 15:00 UTC",
      owner: "Heyns Schoeman™",
      methodology: "Atom-Level Execution™"
    },
    {
      id: 8,
      name: "FAA™ Compliance Audits™",
      category: "Auditing & Compliance Monitoring",
      method: "Periodic Audits",
      markets: ["Global"],
      status: "Active Monitoring",
      atomLevel: 98.8,
      soilHealth: 95,
      seedProgress: 90,
      nextAction: "Conduct Compliance Audits",
      timestamp: "2025-01-17 16:00 UTC",
      owner: "Heyns Schoeman™",
      methodology: "Atom-Level Execution™"
    },
    {
      id: 9,
      name: "FAA™ Global Connectivity™",
      category: "Infrastructure & SaaS Expansion",
      method: "SaaS Integration",
      markets: ["USA", "EU", "APAC"],
      status: "Active Monitoring",
      atomLevel: 96.3,
      soilHealth: 89,
      seedProgress: 86,
      nextAction: "Review Expansion Progress",
      timestamp: "2025-01-18 17:00 UTC",
      owner: "Heyns Schoeman™",
      methodology: "Atom-Level Execution™"
    },
    {
      id: 10,
      name: "FAA™ Trademark Integrity™",
      category: "Trademark Protection & Enforcement",
      method: "Brand Integrity & Protection",
      markets: ["Global"],
      status: "Active Monitoring",
      atomLevel: 99.3,
      soilHealth: 98,
      seedProgress: 95,
      nextAction: "Trademark Integrity Review",
      timestamp: "2025-01-19 18:00 UTC",
      owner: "Heyns Schoeman™",
      methodology: "Atom-Level Execution™"
    }
  ];

  const naturalIngredients = [
    { name: "Organic Compost", purity: 99.7, atomicStructure: "C-N-P-K Complex", source: "Natural Decomposition" },
    { name: "Mycorrhizal Fungi", purity: 98.9, atomicStructure: "Symbiotic Network", source: "Forest Floor" },
    { name: "Kelp Meal", purity: 97.8, atomicStructure: "Trace Minerals", source: "Atlantic Ocean" },
    { name: "Rock Phosphate", purity: 96.5, atomicStructure: "Ca₃(PO₄)₂", source: "Natural Deposits" },
    { name: "Azomite Clay", purity: 98.2, atomicStructure: "67 Trace Elements", source: "Ancient Seabed" },
    { name: "Worm Castings", purity: 99.1, atomicStructure: "Bio-Available NPK", source: "Red Wiggler Process" }
  ];

  const intentionVerification = () => {
    // Simple good intentions verification
    const verification = Math.random() > 0.1; // 90% pass rate for good intentions
    setIntentionVerified(verification);
    return verification;
  };

  const AtomLevelProgress = ({ value, label }: { value: number; label: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Atom className="h-3 w-3" />
        <span>Atom-Level Verification™ Active</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-emerald-900/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Sprout className="h-10 w-10" />
                Playing with the Seed
              </h1>
              <p className="text-lg opacity-90 mt-2">
                A Global Reality Platform - Atom-Level Growth Methodology
              </p>
              <div className="flex items-center gap-6 mt-3 text-sm">
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  happyfruitful.com
                </span>
                <span className="flex items-center gap-1">
                  <Atom className="h-4 w-4" />
                  Atom-Level Execution™
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  Good Intentions Verified
                </span>
              </div>
            </div>
            <div className="text-right">
              <Button 
                className="bg-white text-green-600 hover:bg-gray-100"
                size="lg"
                onClick={intentionVerification}
                data-testid="button-verify-intentions"
              >
                <Eye className="h-5 w-5 mr-2" />
                Verify Good Intentions
              </Button>
              {intentionVerified && (
                <div className="mt-2 flex items-center gap-2 text-green-100">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Access Granted - Welcome!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Intention Verification Gate */}
      {!intentionVerified ? (
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex justify-center">
                <Shield className="h-16 w-16 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold">Good Intentions Verification Required</h2>
              <p className="text-gray-600 dark:text-gray-400">
                This platform is designed for those with pure intentions toward sustainable growth and planetary healing. 
                Please verify your commitment to positive impact.
              </p>
              <Button 
                onClick={intentionVerification}
                className="bg-gradient-to-r from-green-500 to-blue-500"
                size="lg"
                data-testid="button-verify-access"
              >
                <Heart className="h-5 w-5 mr-2" />
                I Come with Good Intentions
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Message */}
          <Card className="mb-8 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Sparkles className="h-8 w-8 text-yellow-500" />
                <div>
                  <h3 className="text-xl font-bold">Welcome to the Global Seed Reality</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    You now have access to atom-level growth methodology. Every seed planted here contributes to global healing through natural, sustainable practices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-Time Global Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active FAA™ Brands</p>
                    <p className="text-3xl font-bold text-green-600">10</p>
                  </div>
                  <Sprout className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Global Atom Level</p>
                    <p className="text-3xl font-bold text-blue-600">98.1%</p>
                  </div>
                  <Atom className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Soil Health Index</p>
                    <p className="text-3xl font-bold text-emerald-600">94.2%</p>
                  </div>
                  <Leaf className="h-8 w-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Growth Progress</p>
                    <p className="text-3xl font-bold text-yellow-600">89.7%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="seed-garden" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="seed-garden">Seed Garden</TabsTrigger>
              <TabsTrigger value="faa-monitoring">FAA™ Monitoring</TabsTrigger>
              <TabsTrigger value="natural-ingredients">Natural Soil</TabsTrigger>
              <TabsTrigger value="atom-level">Atom-Level View</TabsTrigger>
              <TabsTrigger value="global-impact">Global Impact</TabsTrigger>
            </TabsList>

            {/* Seed Garden Tab */}
            <TabsContent value="seed-garden" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trees className="h-6 w-6 text-green-500" />
                      Virtual Seed Planting Interface
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <Label htmlFor="seedType">Seed Type</Label>
                        <select className="w-full p-2 border rounded-md" data-testid="select-seed-type">
                          <option>Consciousness Seed</option>
                          <option>Wisdom Seed</option>
                          <option>Compassion Seed</option>
                          <option>Innovation Seed</option>
                          <option>Healing Seed</option>
                        </select>
                      </div>
                      <div className="space-y-4">
                        <Label htmlFor="intention">Plant with Intention</Label>
                        <Textarea 
                          placeholder="What positive intention do you plant with this seed?"
                          data-testid="textarea-intention"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label>Global Coordinates</Label>
                        <div className="flex items-center gap-2 p-2 border rounded-md">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Auto-detected via Good Intentions</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button 
                        className="bg-gradient-to-r from-green-500 to-emerald-500"
                        data-testid="button-plant-seed"
                      >
                        <Sprout className="h-5 w-5 mr-2" />
                        Plant Seed in Global Reality
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* FAA™ Monitoring Tab */}
            <TabsContent value="faa-monitoring" className="space-y-6">
              <div className="grid gap-4">
                {globalBrands.map((brand) => (
                  <Card key={brand.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="default" className="bg-blue-500">
                              #{brand.id}
                            </Badge>
                            <h3 className="font-bold text-lg">{brand.name}</h3>
                            <Badge variant="outline">{brand.category}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            <AtomLevelProgress value={brand.atomLevel} label="Atom-Level Integrity" />
                            <AtomLevelProgress value={brand.soilHealth} label="Soil Health Index" />
                            <AtomLevelProgress value={brand.seedProgress} label="Growth Progress" />
                          </div>

                          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {brand.timestamp}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="h-4 w-4" />
                              {brand.markets.join(", ")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              {brand.owner}
                            </span>
                          </div>

                          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Next Action:</span>
                              <span className="text-sm">{brand.nextAction}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-sm font-medium">Methodology:</span>
                              <span className="text-sm font-mono">{brand.methodology}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          onClick={() => setSelectedBrand(brand.id.toString())}
                          data-testid={`button-view-brand-${brand.id}`}
                        >
                          Atom View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Natural Ingredients Tab */}
            <TabsContent value="natural-ingredients" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-green-500" />
                    Natural Soil Ingredients - Atom-Level Purity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {naturalIngredients.map((ingredient, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg">{ingredient.name}</h4>
                          <Badge className="bg-green-500">{ingredient.purity}% Pure</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Atomic Structure:</span>
                            <p className="font-mono text-sm">{ingredient.atomicStructure}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Natural Source:</span>
                            <p className="text-sm">{ingredient.source}</p>
                          </div>
                          <div>
                            <Progress value={ingredient.purity} className="mt-2" />
                            <p className="text-xs text-center mt-1">Atom-Level Verification™</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Atom-Level View Tab */}
            <TabsContent value="atom-level" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Atom className="h-6 w-6 text-blue-500" />
                    Atom-Level Reality Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-6">
                    <div className="relative w-64 h-64 mx-auto border-4 border-blue-200 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                      <div className="absolute inset-0 animate-spin-slow border-2 border-blue-400 rounded-full opacity-50"></div>
                      <div className="absolute inset-4 animate-pulse border-2 border-purple-400 rounded-full opacity-40"></div>
                      <Atom className="h-16 w-16 text-blue-600 animate-bounce" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">98.1%</div>
                        <div className="text-sm text-gray-600">Electron Stability</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">99.7%</div>
                        <div className="text-sm text-gray-600">Molecular Harmony</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">97.3%</div>
                        <div className="text-sm text-gray-600">Quantum Coherence</div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                      At the atomic level, every seed planted through good intentions creates ripples through the quantum field, 
                      influencing molecular structures across the global network. This is the foundation of sustainable growth methodology.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Global Impact Tab */}
            <TabsContent value="global-impact" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-6 w-6 text-blue-500" />
                      Global Reach & Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Active Global Regions:</span>
                        <Badge>USA, EU, APAC</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Good Intentions Verified:</span>
                        <span className="font-bold text-green-600">2,847,329</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Seeds Planted Today:</span>
                        <span className="font-bold text-blue-600">15,847</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Atom-Level Coherence:</span>
                        <span className="font-bold text-purple-600">98.1%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-6 w-6 text-green-500" />
                      Community Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Global Participation</span>
                          <span>89.7%</span>
                        </div>
                        <Progress value={89.7} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Sustainable Practices</span>
                          <span>94.2%</span>
                        </div>
                        <Progress value={94.2} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Positive Impact Index</span>
                          <span>96.8%</span>
                        </div>
                        <Progress value={96.8} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Live Global Feed */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-500" />
                Live Global Seed Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <Sprout className="h-4 w-4 text-green-500" />
                  <span className="text-sm">🌍 New consciousness seed planted in Johannesburg - Intention: "Healing the Earth"</span>
                  <span className="text-xs text-gray-500 ml-auto">2 minutes ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <Atom className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">⚛️ FAA™ Data Protection™ achieved 99.1% atom-level integrity</span>
                  <span className="text-xs text-gray-500 ml-auto">5 minutes ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <Heart className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">💜 Good intentions verified for 847 new participants in APAC region</span>
                  <span className="text-xs text-gray-500 ml-auto">12 minutes ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">☀️ Global soil health index increased to 94.2% through natural ingredients</span>
                  <span className="text-xs text-gray-500 ml-auto">18 minutes ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PlayingWithTheSeed;