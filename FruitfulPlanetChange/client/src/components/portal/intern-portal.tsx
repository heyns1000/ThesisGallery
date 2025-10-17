import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Brain, 
  Target, 
  Clock, 
  BookOpen, 
  Code, 
  GitBranch, 
  Activity, 
  Map, 
  Lightbulb,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  FileText,
  Layers,
  Zap,
  Settings,
  Eye
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  InteractiveCard, 
  PulseIndicator, 
  ProgressRing,
  SparkleEffect,
  RippleEffect
} from "@/components/ui/micro-interactions";

export function InternPortal() {
  const [selectedIntern, setSelectedIntern] = useState<string | null>(null);
  const [aiTrackingActive, setAiTrackingActive] = useState(true);
  const [notifications, setNotifications] = useState<Array<{ id: string; type: string; message: string; timestamp: Date }>>([]);

  // Mock intern data - will be integrated with real data
  const interns = [
    {
      id: "intern-001",
      name: "Alex Chen",
      role: "Frontend Development Intern",
      level: "Intermediate",
      avatar: "👨‍💻",
      status: "active",
      progress: 78,
      currentTask: "Implementing micro-interactions",
      completedTasks: 12,
      totalTasks: 18,
      repoAccess: ["seedwave-portal", "vaultmesh-ui"],
      skillFocus: ["React", "TypeScript", "Animation"],
      lastActivity: "2 hours ago",
      aiInsight: "Showing excellent progress in component development"
    },
    {
      id: "intern-002", 
      name: "Sarah Kim",
      role: "Backend Systems Intern",
      level: "Beginner",
      avatar: "👩‍💻",
      status: "learning",
      progress: 45,
      currentTask: "Understanding database schemas",
      completedTasks: 8,
      totalTasks: 20,
      repoAccess: ["api-services", "database-schemas"],
      skillFocus: ["Node.js", "PostgreSQL", "API Design"],
      lastActivity: "1 hour ago",
      aiInsight: "Needs guidance on complex database relationships"
    },
    {
      id: "intern-003",
      name: "Marcus Johnson", 
      role: "AI Integration Intern",
      level: "Advanced",
      avatar: "🤖",
      status: "active",
      progress: 92,
      currentTask: "Optimizing recommendation engine",
      completedTasks: 16,
      totalTasks: 18,
      repoAccess: ["ai-logic", "recommendation-engine"],
      skillFocus: ["Machine Learning", "Python", "Data Analysis"],
      lastActivity: "30 minutes ago",
      aiInsight: "Ready for advanced AI implementation tasks"
    }
  ];

  const ecosystemMap = {
    "Seedwave Portal": {
      description: "Main brand management platform",
      technologies: ["React", "TypeScript", "PostgreSQL"],
      complexity: "High",
      intern_tasks: ["UI Components", "Data Integration", "API Endpoints"]
    },
    "VaultMesh™": {
      description: "Secure document management system",
      technologies: ["Express", "Node.js", "Encryption"],
      complexity: "Medium",
      intern_tasks: ["Security Testing", "Document Processing", "API Testing"]
    },
    "OmniGrid™ FAA.zone™": {
      description: "Universal interconnected network",
      technologies: ["Real-time Data", "WebSockets", "Analytics"],
      complexity: "High",
      intern_tasks: ["Data Visualization", "Real-time Updates", "Performance Monitoring"]
    },
    "Smart Toys Ecosystem": {
      description: "AI-powered educational platform",
      technologies: ["AI/ML", "React", "Educational APIs"],
      complexity: "Medium",
      intern_tasks: ["Content Management", "AI Training", "User Experience"]
    }
  };

  const architecturalView = {
    frontend: {
      framework: "React + TypeScript",
      styling: "Tailwind CSS + shadcn/ui",
      state: "TanStack Query",
      routing: "Wouter",
      animations: "Framer Motion"
    },
    backend: {
      runtime: "Node.js + Express",
      database: "PostgreSQL + Drizzle ORM", 
      auth: "Replit Auth + OpenID Connect",
      sessions: "Express Sessions + PostgreSQL"
    },
    deployment: {
      platform: "Replit",
      workflow: "npm run dev",
      environment: "Development/Production modes",
      database: "Neon PostgreSQL serverless"
    }
  };

  const addNotification = (type: string, message: string) => {
    const notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
  };

  useEffect(() => {
    // Simulate AI tracking notifications
    const interval = setInterval(() => {
      if (aiTrackingActive) {
        const messages = [
          "AI detected: Intern productivity increased 15%",
          "Learning pattern identified: Focus on component architecture",
          "Recommendation: Pair programming session suggested",
          "Progress milestone: Frontend skills advancing rapidly"
        ];
        addNotification("ai-insight", messages[Math.floor(Math.random() * messages.length)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [aiTrackingActive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-3">
            <Users className="w-10 h-10 text-blue-600" />
            Seedwave™ Intern Portal
            <PulseIndicator active={aiTrackingActive} color="bg-green-500" />
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            AI-Powered Intern Management & Ecosystem Integration Hub
          </p>
        </motion.div>

        {/* AI Tracking Status */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <InteractiveCard className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-bold">AI Tracking & Monitoring</h3>
                  <p className="opacity-90">Real-time intern progress analysis and recommendations</p>
                </div>
              </div>
              <RippleEffect onClick={() => setAiTrackingActive(!aiTrackingActive)}>
                <motion.button
                  className={`px-6 py-3 rounded-lg font-medium ${
                    aiTrackingActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {aiTrackingActive ? 'AI Active' : 'AI Paused'}
                </motion.button>
              </RippleEffect>
            </div>
          </InteractiveCard>
        </motion.div>

        {/* Live Notifications */}
        <AnimatePresence>
          {notifications.length > 0 && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="fixed top-20 right-6 z-50 space-y-2"
            >
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  className="bg-blue-600 text-white p-3 rounded-lg shadow-lg max-w-sm"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    <span className="text-sm font-medium">{notification.message}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="ecosystem">Ecosystem Map</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="tasks">Task Management</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Intern Cards */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Interns</h2>
                
                <motion.div 
                  className="space-y-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 }
                    }
                  }}
                >
                  {interns.map((intern) => (
                    <motion.div
                      key={intern.id}
                      variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1 }
                      }}
                    >
                      <InteractiveCard 
                        className="p-6 cursor-pointer"
                        onClick={() => setSelectedIntern(selectedIntern === intern.id ? null : intern.id)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="text-4xl">{intern.avatar}</div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{intern.name}</h3>
                              <p className="text-gray-600 dark:text-gray-300">{intern.role}</p>
                              <Badge variant={intern.status === 'active' ? 'default' : 'secondary'}>
                                {intern.level} • {intern.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <ProgressRing progress={intern.progress} size={80} strokeWidth={6} />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Current Task:</span>
                            <span className="font-medium">{intern.currentTask}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Progress:</span>
                            <span className="font-medium">{intern.completedTasks}/{intern.totalTasks} tasks</span>
                          </div>
                          
                          <Progress value={(intern.completedTasks / intern.totalTasks) * 100} className="w-full" />
                          
                          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                            <Lightbulb className="w-4 h-4" />
                            <span>{intern.aiInsight}</span>
                          </div>
                        </div>

                        <AnimatePresence>
                          {selectedIntern === intern.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                            >
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <h4 className="font-medium mb-2">Repository Access</h4>
                                  <div className="space-y-1">
                                    {intern.repoAccess.map(repo => (
                                      <Badge key={repo} variant="outline" className="text-xs">
                                        <GitBranch className="w-3 h-3 mr-1" />
                                        {repo}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Skill Focus</h4>
                                  <div className="space-y-1">
                                    {intern.skillFocus.map(skill => (
                                      <Badge key={skill} variant="secondary" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-4 flex gap-2">
                                <Button size="sm" className="flex items-center gap-2">
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </Button>
                                <Button size="sm" variant="outline" className="flex items-center gap-2">
                                  <Settings className="w-4 h-4" />
                                  Assign Task
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </InteractiveCard>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Stats</h2>
                
                <div className="space-y-4">
                  <InteractiveCard className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">95%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Task Completion</div>
                  </InteractiveCard>
                  
                  <InteractiveCard className="p-4 text-center">
                    <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">24h</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Avg Response Time</div>
                  </InteractiveCard>
                  
                  <InteractiveCard className="p-4 text-center">
                    <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">8</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Skills Mastered</div>
                  </InteractiveCard>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Ecosystem Map Tab */}
          <TabsContent value="ecosystem" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Seedwave™ Ecosystem Integration Map
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Complete overview of all systems and intern integration points
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(ecosystemMap).map(([system, details]) => (
                <motion.div
                  key={system}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <InteractiveCard className="p-6 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <Layers className="w-8 h-8 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{system}</h3>
                      <Badge variant={details.complexity === 'High' ? 'destructive' : details.complexity === 'Medium' ? 'default' : 'secondary'}>
                        {details.complexity}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{details.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {details.technologies.map(tech => (
                            <Badge key={tech} variant="outline">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Intern Tasks</h4>
                        <div className="space-y-1">
                          {details.intern_tasks.map(task => (
                            <div key={task} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </InteractiveCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Replit Application Architecture
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Technical overview for intern understanding and integration
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(architecturalView).map(([layer, details]) => (
                <motion.div
                  key={layer}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <InteractiveCard className="p-6 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        layer === 'frontend' ? 'bg-blue-100 text-blue-600' :
                        layer === 'backend' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {layer === 'frontend' ? <Code className="w-6 h-6" /> :
                         layer === 'backend' ? <Zap className="w-6 h-6" /> :
                         <Settings className="w-6 h-6" />}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{layer}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {Object.entries(details).map(([key, value]) => (
                        <div key={key} className="border-l-4 border-gray-200 dark:border-gray-700 pl-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{value}</div>
                        </div>
                      ))}
                    </div>
                  </InteractiveCard>
                </motion.div>
              ))}
            </div>

            <InteractiveCard className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Integration Guidelines for Interns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Development Workflow</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Use `npm run dev` to start development server
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      All code changes are automatically reloaded
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Database migrations use `npm run db:push`
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Follow TypeScript strict mode guidelines
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Principles</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      Never modify core authentication logic
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      Always use provided UI components
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      Test all changes in development mode
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      Document any new components or utilities
                    </li>
                  </ul>
                </div>
              </div>
            </InteractiveCard>
          </TabsContent>

          {/* Task Management Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Task Assignment & Tracking
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                AI-powered task distribution and progress monitoring
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InteractiveCard className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Available Tasks</h3>
                <div className="space-y-3">
                  {[
                    { title: "Implement user feedback component", difficulty: "Medium", estimated: "4 hours", priority: "High" },
                    { title: "Add dark mode support to new pages", difficulty: "Easy", estimated: "2 hours", priority: "Medium" },
                    { title: "Optimize database queries", difficulty: "Hard", estimated: "8 hours", priority: "High" },
                    { title: "Create responsive mobile layout", difficulty: "Medium", estimated: "6 hours", priority: "Medium" }
                  ].map((task, index) => (
                    <motion.div
                      key={index}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                        <Badge variant={task.priority === 'High' ? 'destructive' : 'default'}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <span>⏱️ {task.estimated}</span>
                        <span>📊 {task.difficulty}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </InteractiveCard>

              <InteractiveCard className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI Recommendations</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900 dark:text-blue-100">Learning Path Suggestion</span>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Based on current progress, recommend focusing on advanced React patterns and state management.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900 dark:text-green-100">Optimal Task Assignment</span>
                    </div>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Alex Chen should work on micro-interactions while Sarah Kim focuses on API integration.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-900 dark:text-yellow-100">Collaboration Opportunity</span>
                    </div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Schedule pair programming session between Marcus and Alex for AI component integration.
                    </p>
                  </div>
                </div>
              </InteractiveCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}