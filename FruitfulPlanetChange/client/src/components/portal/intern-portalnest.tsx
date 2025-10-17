import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  GraduationCap, 
  Code, 
  Activity, 
  Eye, 
  Target, 
  BookOpen, 
  FileCode, 
  GitBranch, 
  Monitor, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Brain,
  Zap,
  MapPin,
  Building,
  Layers,
  Coffee,
  Trophy,
  Star
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  InteractiveCard, 
  PulseIndicator, 
  ProgressRing, 
  SparkleEffect,
  RippleEffect
} from "@/components/ui/micro-interactions";

export function InternPortalNest() {
  const [selectedIntern, setSelectedIntern] = useState<string | null>(null);
  const [aiTrackingEnabled, setAiTrackingEnabled] = useState(true);
  const [monitoringData, setMonitoringData] = useState<any>({});

  // Mock intern data - would come from actual tracking system
  const [internData, setInternData] = useState([
    {
      id: "intern-001",
      name: "Alex Johnson",
      program: "We Think Code",
      level: "Intermediate",
      currentProject: "VaultMesh Integration",
      progressPercent: 75,
      tasksCompleted: 12,
      totalTasks: 16,
      ecosystemUnderstanding: 60,
      replitProficiency: 80,
      lastActive: "2 minutes ago",
      status: "active",
      mentor: "Senior Dev Team",
      weeklyGoal: "Complete payment gateway integration",
      learningPath: ["React Basics", "Database Integration", "API Development", "Testing"],
      currentChallenges: ["Understanding ecosystem architecture", "Replit deployment workflow"],
      achievements: ["First successful deployment", "Clean code practices", "Team collaboration"]
    },
    {
      id: "intern-002", 
      name: "Sarah Chen",
      program: "University Graduate",
      level: "Beginner",
      currentProject: "Legal Document Portal",
      progressPercent: 45,
      tasksCompleted: 8,
      totalTasks: 18,
      ecosystemUnderstanding: 35,
      replitProficiency: 55,
      lastActive: "15 minutes ago",
      status: "learning",
      mentor: "AI Logic Team",
      weeklyGoal: "Master component structure and routing",
      learningPath: ["HTML/CSS", "JavaScript Fundamentals", "React Introduction", "Project Structure"],
      currentChallenges: ["Complex file structure navigation", "Understanding ecosystem scope"],
      achievements: ["Basic HTML proficiency", "First React component", "Git workflow understanding"]
    }
  ]);

  // Ecosystem architecture data extracted from interns repository
  const ecosystemArchitecture = {
    coreComponents: [
      {
        name: "Seedwave Portal",
        description: "Main management dashboard for 6,005+ brands across sectors",
        htmlFiles: ["index.html", "admin-portal.html", "admin-panel_full_arrays.html"],
        integration: "Central data hub with PostgreSQL backend",
        internRole: "Learn brand management, sector organization, database operations"
      },
      {
        name: "Legal SecureSign System",
        description: "Document management and NDA processing system",
        htmlFiles: ["legal/index.html", "legal/securesign_api.html"],
        integration: "Document storage, API key management, compliance tracking",
        internRole: "Understanding document workflows, API integrations, security protocols"
      },
      {
        name: "Payment Integration",
        description: "Global payment processing and checkout systems",
        htmlFiles: ["global_payment.html", "global_checkout.html"],
        integration: "PayPal, Stripe, and multi-currency payment flows",
        internRole: "Payment gateway implementation, transaction handling, error management"
      },
      {
        name: "CodeNest AI Logic",
        description: "AI-powered development assistance and sector intelligence",
        htmlFiles: ["ai-logic/sectors/codenest/index.html", "ai-logic/sectors/codenest/hotstack/index.html"],
        integration: "Omnilevel AI recommendations, sector analysis, development guidance",
        internRole: "AI logic implementation, sector mapping, intelligent recommendations"
      }
    ],
    replitIntegration: {
      currentApp: "Full-stack TypeScript application with React + Express",
      database: "PostgreSQL with Drizzle ORM",
      deployment: "Replit hosting with automatic workflows",
      development: "Live reload, hot module replacement, collaborative coding",
      architecture: "Monorepo structure: client/, server/, shared/ directories"
    },
    keyLearningAreas: [
      "Understanding HTML files are part of larger React ecosystem",
      "Database-driven vs static HTML approach",
      "Component-based architecture benefits",
      "API integration patterns",
      "Authentication and user management",
      "Real-time data handling",
      "Deployment and production workflows"
    ]
  };

  const aiRecommendations = [
    {
      type: "learning",
      priority: "high",
      title: "Ecosystem Architecture Deep Dive",
      description: "Interns need comprehensive understanding of how HTML files integrate into larger system",
      action: "Schedule architecture overview session",
      estimatedTime: "2 hours"
    },
    {
      type: "project",
      priority: "medium", 
      title: "Component Migration Exercise",
      description: "Convert existing HTML structures into React components",
      action: "Create guided migration tasks",
      estimatedTime: "1 week"
    },
    {
      type: "mentorship",
      priority: "high",
      title: "Replit Development Workflow",
      description: "Hands-on training with live deployment and collaborative features",
      action: "Pair programming sessions",
      estimatedTime: "3 sessions"
    }
  ];

  useEffect(() => {
    // Simulate AI tracking data updates
    const interval = setInterval(() => {
      if (aiTrackingEnabled) {
        setMonitoringData(prev => ({
          ...prev,
          timestamp: new Date().toLocaleTimeString(),
          activeInterns: internData.filter(i => i.status === 'active').length,
          avgProgress: Math.round(internData.reduce((acc, i) => acc + i.progressPercent, 0) / internData.length),
          ecosystemComprehension: Math.round(internData.reduce((acc, i) => acc + i.ecosystemUnderstanding, 0) / internData.length)
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [aiTrackingEnabled, internData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 text-white p-6">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <GraduationCap className="w-10 h-10 text-purple-300" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-purple-100">PortalNest™</h1>
              <p className="text-purple-300">Intern AI Tracking & Ecosystem Education Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <PulseIndicator active={aiTrackingEnabled} color="bg-green-400" size="w-3 h-3" />
            <Badge variant={aiTrackingEnabled ? "default" : "secondary"}>
              AI Tracking {aiTrackingEnabled ? "Active" : "Paused"}
            </Badge>
            <Button
              onClick={() => setAiTrackingEnabled(!aiTrackingEnabled)}
              variant={aiTrackingEnabled ? "destructive" : "default"}
              size="sm"
            >
              {aiTrackingEnabled ? "Pause" : "Resume"} Tracking
            </Button>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-purple-800/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="tracking">AI Tracking</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="replit">Replit Guide</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                label: "Active Interns", 
                value: monitoringData.activeInterns || 2, 
                icon: Users, 
                color: "text-green-400" 
              },
              { 
                label: "Avg Progress", 
                value: `${monitoringData.avgProgress || 60}%`, 
                icon: TrendingUp, 
                color: "text-blue-400" 
              },
              { 
                label: "Ecosystem Understanding", 
                value: `${monitoringData.ecosystemComprehension || 48}%`, 
                icon: Brain, 
                color: "text-purple-400" 
              },
              { 
                label: "Last Update", 
                value: monitoringData.timestamp || "Now", 
                icon: Clock, 
                color: "text-yellow-400" 
              }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <InteractiveCard className="bg-purple-800/30 border-purple-500/30 p-4 text-center">
                  <metric.icon className={`w-8 h-8 mx-auto mb-2 ${metric.color}`} />
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                  <div className="text-purple-300 text-sm">{metric.label}</div>
                </InteractiveCard>
              </motion.div>
            ))}
          </div>

          {/* Intern Progress Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {internData.map((intern, index) => (
              <motion.div
                key={intern.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <SparkleEffect trigger={intern.status === 'active'}>
                  <InteractiveCard className="bg-purple-800/40 border-purple-500/40 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{intern.name}</h3>
                        <p className="text-purple-300">{intern.program} • {intern.level}</p>
                        <Badge 
                          variant={intern.status === 'active' ? 'default' : 'secondary'}
                          className="mt-2"
                        >
                          {intern.status === 'active' ? '🟢 Active' : '🟡 Learning'}
                        </Badge>
                      </div>
                      <ProgressRing 
                        progress={intern.progressPercent} 
                        size={60} 
                        strokeWidth={4}
                        color="#8b5cf6"
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-purple-300">Current Project:</span>
                        <span className="text-white ml-2">{intern.currentProject}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-purple-300">Tasks:</span>
                          <span className="text-white ml-2">{intern.tasksCompleted}/{intern.totalTasks}</span>
                        </div>
                        <div>
                          <span className="text-purple-300">Ecosystem:</span>
                          <span className="text-white ml-2">{intern.ecosystemUnderstanding}%</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-purple-300">Weekly Goal:</span>
                        <p className="text-white text-sm mt-1">{intern.weeklyGoal}</p>
                      </div>

                      <RippleEffect onClick={() => setSelectedIntern(intern.id)}>
                        <Button variant="outline" size="sm" className="w-full mt-4">
                          View Details <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </RippleEffect>
                    </div>
                  </InteractiveCard>
                </SparkleEffect>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Architecture Tab */}
        <TabsContent value="architecture" className="space-y-6">
          <InteractiveCard className="bg-purple-800/30 border-purple-500/30 p-6">
            <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center gap-2">
              <Building className="w-6 h-6" />
              Ecosystem Architecture Overview
            </h2>
            <p className="text-purple-200 mb-6">
              Understanding how HTML files from your repositories integrate into the larger Replit application ecosystem.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ecosystemArchitecture.coreComponents.map((component, index) => (
                <motion.div
                  key={component.name}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-purple-700/30 border-purple-500/30 p-5">
                    <h3 className="text-lg font-bold text-white mb-2">{component.name}</h3>
                    <p className="text-purple-200 text-sm mb-3">{component.description}</p>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-purple-300 text-xs font-medium">HTML Files:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {component.htmlFiles.map((file) => (
                            <Badge key={file} variant="outline" className="text-xs">
                              {file}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-purple-300 text-xs font-medium">Integration:</span>
                        <p className="text-purple-100 text-xs mt-1">{component.integration}</p>
                      </div>
                      
                      <div>
                        <span className="text-purple-300 text-xs font-medium">Intern Learning Focus:</span>
                        <p className="text-purple-100 text-xs mt-1">{component.internRole}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </InteractiveCard>

          {/* Replit Integration Details */}
          <InteractiveCard className="bg-purple-800/30 border-purple-500/30 p-6">
            <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Current Replit Application Structure
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-purple-200 font-medium mb-3">Architecture:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-purple-100">
                    <Layers className="w-4 h-4 text-purple-400" />
                    {ecosystemArchitecture.replitIntegration.currentApp}
                  </li>
                  <li className="flex items-center gap-2 text-purple-100">
                    <Layers className="w-4 h-4 text-purple-400" />
                    {ecosystemArchitecture.replitIntegration.database}
                  </li>
                  <li className="flex items-center gap-2 text-purple-100">
                    <Layers className="w-4 h-4 text-purple-400" />
                    {ecosystemArchitecture.replitIntegration.deployment}
                  </li>
                  <li className="flex items-center gap-2 text-purple-100">
                    <Layers className="w-4 h-4 text-purple-400" />
                    {ecosystemArchitecture.replitIntegration.architecture}
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-purple-200 font-medium mb-3">Key Learning Areas:</h4>
                <ul className="space-y-1 text-xs">
                  {ecosystemArchitecture.keyLearningAreas.map((area, index) => (
                    <li key={index} className="flex items-start gap-2 text-purple-100">
                      <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </InteractiveCard>
        </TabsContent>

        {/* AI Tracking Tab */}
        <TabsContent value="tracking" className="space-y-6">
          <InteractiveCard className="bg-purple-800/30 border-purple-500/30 p-6">
            <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6" />
              AI Recommendations & Insights
            </h2>
            
            <div className="space-y-4">
              {aiRecommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`p-4 border-l-4 ${
                    rec.priority === 'high' ? 'border-red-400 bg-red-900/20' :
                    rec.priority === 'medium' ? 'border-yellow-400 bg-yellow-900/20' :
                    'border-blue-400 bg-blue-900/20'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {rec.type.toUpperCase()}
                          </Badge>
                          <Badge 
                            variant={rec.priority === 'high' ? 'destructive' : 'default'}
                            className="text-xs"
                          >
                            {rec.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-white mb-1">{rec.title}</h3>
                        <p className="text-purple-200 text-sm mb-2">{rec.description}</p>
                        <p className="text-purple-300 text-xs">
                          <strong>Action:</strong> {rec.action}
                        </p>
                        <p className="text-purple-300 text-xs">
                          <strong>Est. Time:</strong> {rec.estimatedTime}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Implement
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </InteractiveCard>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <InteractiveCard className="bg-purple-800/30 border-purple-500/30 p-6">
            <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Ecosystem Education Program
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-purple-700/30 border-purple-500/30 p-4">
                <FileCode className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="font-bold text-white mb-2">Phase 1: Foundation</h3>
                <ul className="text-sm text-purple-200 space-y-1">
                  <li>• HTML to React component mapping</li>
                  <li>• Understanding file structure</li>
                  <li>• Database vs static content</li>
                  <li>• API integration basics</li>
                </ul>
              </Card>
              
              <Card className="bg-purple-700/30 border-purple-500/30 p-4">
                <GitBranch className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="font-bold text-white mb-2">Phase 2: Integration</h3>
                <ul className="text-sm text-purple-200 space-y-1">
                  <li>• Component development</li>
                  <li>• State management</li>
                  <li>• Real-time data handling</li>
                  <li>• Authentication flows</li>
                </ul>
              </Card>
              
              <Card className="bg-purple-700/30 border-purple-500/30 p-4">
                <Zap className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="font-bold text-white mb-2">Phase 3: Mastery</h3>
                <ul className="text-sm text-purple-200 space-y-1">
                  <li>• Advanced features</li>
                  <li>• Performance optimization</li>
                  <li>• Deployment strategies</li>
                  <li>• Independent development</li>
                </ul>
              </Card>
            </div>
          </InteractiveCard>
        </TabsContent>

        {/* Replit Guide Tab */}
        <TabsContent value="replit" className="space-y-6">
          <InteractiveCard className="bg-purple-800/30 border-purple-500/30 p-6">
            <h2 className="text-2xl font-bold text-purple-100 mb-4 flex items-center gap-2">
              <Monitor className="w-6 h-6" />
              Replit Development Workflow
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-purple-200 mb-3">1. Understanding the Current Application</h3>
                <p className="text-purple-100 mb-3">
                  The HTML files in your repositories are being integrated into this live Replit application. 
                  This is a full-stack TypeScript application with:
                </p>
                <ul className="list-disc list-inside text-purple-200 space-y-1 ml-4">
                  <li>React frontend with modern components</li>
                  <li>Express.js backend with API routes</li>
                  <li>PostgreSQL database with Drizzle ORM</li>
                  <li>Real-time data and live updates</li>
                  <li>Authentication and user management</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-purple-200 mb-3">2. Development Process</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-purple-700/30 border-purple-500/30 p-4">
                    <h4 className="font-bold text-white mb-2">Local Development</h4>
                    <ul className="text-sm text-purple-200 space-y-1">
                      <li>• Use Replit's live collaboration</li>
                      <li>• Hot reload for instant feedback</li>
                      <li>• Real-time error detection</li>
                      <li>• Integrated debugging tools</li>
                    </ul>
                  </Card>
                  
                  <Card className="bg-purple-700/30 border-purple-500/30 p-4">
                    <h4 className="font-bold text-white mb-2">Deployment</h4>
                    <ul className="text-sm text-purple-200 space-y-1">
                      <li>• Automatic deployment on save</li>
                      <li>• Live preview URL</li>
                      <li>• Production-ready hosting</li>
                      <li>• SSL and domain management</li>
                    </ul>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-purple-200 mb-3">3. Key Workflow Steps</h3>
                <div className="space-y-3">
                  {[
                    "Edit files in the Replit editor",
                    "See changes instantly in the preview",
                    "Test functionality with live data",
                    "Push changes for team review",
                    "Deploy to production URL"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-purple-100">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </InteractiveCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}