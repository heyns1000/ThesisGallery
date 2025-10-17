import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { smartToysService } from '@/services/smart-toys-service';
import { 
  Brain, 
  Gamepad2, 
  Download, 
  Play, 
  Settings, 
  Users, 
  BookOpen,
  Heart,
  Mic,
  Zap,
  Shield,
  TrendingUp,
  Sparkles,
  Rocket,
  Star,
  ExternalLink,
  CheckCircle,
  FileText,
  Code,
  Globe
} from 'lucide-react';

// Smart Toys Product Data extracted from ToyNest
const smartToysData = {
  company: {
    name: "Fruitful Smart Toys (Pty) Ltd",
    sector: "education-youth",
    location: "Cape Town, South Africa",
    ceo: "Dr. Anya Sharma",
    contact: "info@smarttoys.faa.zone",
    deployment: "Global (Managed by ToyNest™)",
    certifications: "VaultMint™ Gold Standard",
    compliance: "COPPA, GDPR-K, ISO 27001"
  },
  products: [
    {
      id: "ai-companion-v2",
      name: "AI Language Companion V2",
      description: "Smart Learning Companion that grows with child's intelligence map",
      category: "AI Learning",
      icon: "🤖",
      features: [
        "Adaptive Learning AI",
        "Speech Recognition Engine", 
        "Emotional Intelligence Mapping",
        "Real-time Progress Tracking"
      ],
      targetAge: "4-12 years",
      status: "active",
      deployments: 1250,
      engagement: 94
    },
    {
      id: "emotional-storyteller",
      name: "Emotional Intelligence Storyteller",
      description: "Building empathy, creativity, and emotional literacy through interactive stories",
      category: "Emotional Learning",
      icon: "📚",
      features: [
        "Interactive Story Generation",
        "Emotion Recognition",
        "Empathy Building Exercises",
        "Creative Writing Tools"
      ],
      targetAge: "3-10 years",
      status: "active",
      deployments: 890,
      engagement: 89
    },
    {
      id: "speech-processor",
      name: "Real-time Speech Processor",
      description: "Advanced language processing and feedback system for pronunciation and communication",
      category: "Language Development",
      icon: "🎙️",
      features: [
        "Real-time Language Processing",
        "Pronunciation Feedback",
        "Multi-language Support",
        "Speech Pattern Analysis"
      ],
      targetAge: "2-8 years",
      status: "active",
      deployments: 750,
      engagement: 92
    },
    {
      id: "parental-dashboard",
      name: "AI Parental Dashboard",
      description: "Real-time emotional and academic progress reports for parents and educators",
      category: "Analytics & Monitoring",
      icon: "📊",
      features: [
        "Real-time Progress Tracking",
        "Emotional Development Analytics",
        "Academic Milestone Monitoring",
        "Personalized Recommendations"
      ],
      targetAge: "For Parents/Educators",
      status: "active",
      deployments: 2100,
      engagement: 96
    },
    {
      id: "omniscroll-ledger",
      name: "OmniScroll + Infinite Ledger",
      description: "Immutable proof of cognitive growth and learning achievements for life",
      category: "Blockchain & Certification",
      icon: "🔗",
      features: [
        "Immutable Learning Records",
        "Cognitive Growth Tracking",
        "VaultMint™ Certification",
        "Lifetime Achievement Portfolio"
      ],
      targetAge: "All Ages",
      status: "active",
      deployments: 1800,
      engagement: 88
    }
  ],
  templates: [
    {
      id: "learning-companion",
      name: "Smart Learning Companion Template",
      description: "Base template for AI-powered educational toys",
      category: "AI Learning",
      complexity: "Advanced",
      downloadCount: 450
    },
    {
      id: "story-builder",
      name: "Interactive Story Builder",
      description: "Framework for emotional intelligence storytelling toys",
      category: "Creative Learning",
      complexity: "Intermediate",
      downloadCount: 320
    },
    {
      id: "speech-engine",
      name: "Speech Recognition Engine",
      description: "Core speech processing and language development framework",
      category: "Language",
      complexity: "Expert",
      downloadCount: 280
    },
    {
      id: "progress-tracker",
      name: "Learning Progress Tracker",
      description: "Analytics and monitoring template for educational progress",
      category: "Analytics",
      complexity: "Intermediate",
      downloadCount: 380
    }
  ],
  metrics: {
    totalEngagements: 6790,
    learningModules: 245,
    certifications: 1850,
    monthlyGrowth: 23,
    userSatisfaction: 94,
    deploymentSuccess: 98
  }
};

export function FruitfulSmartToys() {
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const [downloadingTemplate, setDownloadingTemplate] = useState<string | null>(null);
  const [activatedProducts, setActivatedProducts] = useState<string[]>([]);
  const [downloadedTemplates, setDownloadedTemplates] = useState<string[]>([]);
  const [ecosystemStatus, setEcosystemStatus] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load ecosystem status on component mount
    setEcosystemStatus(smartToysService.getEcosystemStatus());
  }, []);

  const handleProductActivate = async (productId: string) => {
    setActiveProduct(productId);
    
    try {
      const result = await smartToysService.activateProduct(productId);
      
      if (result.success) {
        setActivatedProducts(prev => [...prev, productId]);
        toast({
          title: "Product Activated Successfully!",
          description: `Activation key: ${result.activationKey}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Activation Failed",
          description: result.error || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Activation Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setActiveProduct(null);
    }
  };

  const handleTemplateDownload = async (templateId: string) => {
    setDownloadingTemplate(templateId);
    
    try {
      const result = await smartToysService.downloadTemplate(templateId);
      
      if (result.success && result.downloadUrl) {
        setDownloadedTemplates(prev => [...prev, templateId]);
        
        // Trigger actual download
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `${templateId}-template.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download Started!",
          description: "Template download has begun successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Download Failed",
          description: result.error || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Download Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setDownloadingTemplate(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI Learning': return <Brain className="w-5 h-5" />;
      case 'Emotional Learning': return <Heart className="w-5 h-5" />;
      case 'Language Development': return <Mic className="w-5 h-5" />;
      case 'Analytics & Monitoring': return <TrendingUp className="w-5 h-5" />;
      case 'Blockchain & Certification': return <Shield className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'testing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'development': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                🧸 Fruitful Smart Toys™ 🌈
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Treaty-Class Cognitive Engines · OmniScroll Systems · VaultMint™ Certified
              </p>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Company Details</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">CEO:</span> {smartToysData.company.ceo}</p>
                  <p><span className="text-gray-500">Location:</span> {smartToysData.company.location}</p>
                  <p><span className="text-gray-500">Contact:</span> {smartToysData.company.contact}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Certifications</h3>
                <div className="space-y-2">
                  <Badge className="bg-gold-100 text-gold-800">{smartToysData.company.certifications}</Badge>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Compliance: {smartToysData.company.compliance}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Deployment</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {smartToysData.company.deployment}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Engagements</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {smartToysData.metrics.totalEngagements.toLocaleString()}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Learning Modules</p>
                  <p className="text-2xl font-bold text-green-600">{smartToysData.metrics.learningModules}</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">VaultMint™ Certifications</p>
                  <p className="text-2xl font-bold text-purple-600">{smartToysData.metrics.certifications}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Growth</p>
                  <p className="text-2xl font-bold text-orange-600">+{smartToysData.metrics.monthlyGrowth}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Smart Toys Products
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Development Templates
          </TabsTrigger>
          <TabsTrigger value="ecosystem" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Ecosystem Integration
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {smartToysData.products.map((product) => (
              <Card key={product.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{product.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {getCategoryIcon(product.category)}
                          <span className="text-sm text-gray-600 dark:text-gray-400">{product.category}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Deployments: {product.deployments.toLocaleString()}</span>
                      <span>Target: {product.targetAge}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>User Engagement</span>
                        <span>{product.engagement}%</span>
                      </div>
                      <Progress value={product.engagement} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() => handleProductActivate(product.id)}
                      disabled={activeProduct === product.id || activatedProducts.includes(product.id)}
                      className="flex-1 flex items-center gap-2"
                      variant={activatedProducts.includes(product.id) ? "outline" : "default"}
                    >
                      {activeProduct === product.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Activating...
                        </>
                      ) : activatedProducts.includes(product.id) ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Activated
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Activate Product
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Settings className="w-4 h-4" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {smartToysService.getTemplates().map((template) => (
              <Card key={template.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getCategoryIcon(template.category)}
                        <span className="text-sm text-gray-600 dark:text-gray-400">{template.category}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{template.complexity}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-blue-500" />
                      <span>{template.downloadCount} downloads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-500" />
                      <span>{template.fileSize}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-xs text-gray-500 ml-2">4.9/5 rating</span>
                  </div>

                  {template.documentation && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      <strong>Includes:</strong> {template.documentation}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleTemplateDownload(template.id)}
                      disabled={downloadingTemplate === template.id || downloadedTemplates.includes(template.id)}
                      className="flex-1 flex items-center gap-2"
                      variant={downloadedTemplates.includes(template.id) ? "outline" : "default"}
                    >
                      {downloadingTemplate === template.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Preparing...
                        </>
                      ) : downloadedTemplates.includes(template.id) ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Downloaded
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download
                        </>
                      )}
                    </Button>
                    {template.previewUrl && (
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Preview
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Template Resources Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Development Resources & SDKs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Complete SDK Package</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Full development kit with APIs, documentation, and sample projects
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="w-3 h-3 mr-1" />
                    Download SDK (245 MB)
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">API Documentation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Complete API reference and integration guides
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Documentation
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Sample Projects</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Ready-to-use example projects and tutorials
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="w-3 h-3 mr-1" />
                    Download Examples
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ecosystem Integration Tab */}
        <TabsContent value="ecosystem" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  ToyNest™ Platform Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete integration with ToyNest™ platform providing project management, deployment pipelines, and real-time monitoring.
                </p>
                {ecosystemStatus && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Platform Status</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {ecosystemStatus.toynest.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Projects</span>
                      <span className="text-sm font-semibold">{ecosystemStatus.toynest.activeProjects}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Deployments</span>
                      <span className="text-sm font-semibold">{ecosystemStatus.toynest.deployments.toLocaleString()}</span>
                    </div>
                  </div>
                )}
                <Button className="w-full flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Access ToyNest™ Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  VaultMint™ Blockchain Certification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All Smart Toys products feature VaultMint™ Gold Standard certification with immutable learning records and blockchain verification.
                </p>
                {ecosystemStatus && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Certification Level</span>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Gold Standard
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Chain Height</span>
                      <span className="text-sm font-mono">{ecosystemStatus.omniscroll.chainHeight.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Certificates</span>
                      <span className="text-sm font-semibold">{ecosystemStatus.omniscroll.certificates.toLocaleString()}</span>
                    </div>
                  </div>
                )}
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Blockchain Records
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  VaultMesh™ Commerce Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Seamless integration with VaultMesh™ for product catalog management, secure payments, and user authentication.
                </p>
                {ecosystemStatus && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Integration Status</span>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {ecosystemStatus.vaultmesh.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Sync</span>
                      <span className="text-xs text-gray-500">
                        {new Date(ecosystemStatus.vaultmesh.lastSync).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )}
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  VaultMesh™ Portal
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Fruitful Global Ecosystem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete integration across the entire Fruitful Global ecosystem with cross-sector synchronization and unified access.
                </p>
                {ecosystemStatus && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="text-lg font-bold text-blue-600">{ecosystemStatus.fruitfulGlobal.connectedSectors}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Connected Sectors</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="text-lg font-bold text-green-600">{ecosystemStatus.fruitfulGlobal.brandElements.toLocaleString()}+</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Brand Elements</div>
                    </div>
                  </div>
                )}
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Global Ecosystem Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* User Activation Guide */}
          <Card className="border-2 border-dashed border-blue-300 dark:border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Rocket className="w-5 h-5" />
                Ready to Activate & Enjoy Smart Toys!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your Fruitful Smart Toys ecosystem is fully configured and ready for immediate activation. Follow these steps to get started:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    1. Activate Products
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Click "Activate Product" on any Smart Toy to receive your unique activation key and begin using the product immediately.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    2. Download Templates
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Download development templates and SDKs to customize and extend your Smart Toys with advanced features.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    3. Configure & Deploy
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Use the ToyNest™ platform to configure, deploy, and monitor your Smart Toys across global infrastructure.
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    4. Verify & Certify
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    All learning progress is automatically certified through VaultMint™ blockchain for immutable achievement records.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button className="flex-1 flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  Start with AI Companion
                </Button>
                <Button variant="outline" className="flex-1 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  View Getting Started Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}