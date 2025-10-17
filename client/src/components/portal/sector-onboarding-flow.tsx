import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, ChevronLeft, CheckCircle, PlayCircle, ArrowRight, Sparkles, Target, Zap, Globe } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SectorStep {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  benefits: string[]
  nextSteps: string[]
  estimatedTime: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
}

interface OnboardingFlow {
  id: string
  name: string
  description: string
  steps: SectorStep[]
  totalTime: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

export function SectorOnboardingFlow() {
  const [currentFlow, setCurrentFlow] = useState<string>("ecosystem-overview")
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false)

  const onboardingFlows: OnboardingFlow[] = [
    {
      id: "ecosystem-overview",
      name: "🌐 Ecosystem Overview",
      description: "Get acquainted with the complete Seedwave™ ecosystem and core infrastructure",
      totalTime: "15 minutes",
      difficulty: "beginner",
      steps: [
        {
          id: "welcome",
          title: "Welcome to Seedwave™",
          description: "Your gateway to the FAA.zone™ ecosystem with 25+ integrated sectors",
          icon: "🌱",
          features: [
            "6,005+ brand management system",
            "VaultMesh™ security infrastructure", 
            "Real-time analytics dashboard",
            "Cross-sector integration"
          ],
          benefits: [
            "Centralized brand management",
            "Enterprise-grade security",
            "Scalable infrastructure",
            "Global deployment ready"
          ],
          nextSteps: [
            "Explore the Global Dashboard",
            "Review system status",
            "Check your authentication"
          ],
          estimatedTime: "3 minutes",
          difficulty: "beginner",
          category: "infrastructure"
        },
        {
          id: "navigation",
          title: "Portal Navigation",
          description: "Master the Seedwave portal navigation and key features",
          icon: "🧭",
          features: [
            "Ecosystem explorer with 45+ sectors",
            "VaultMesh™ product suite",
            "Legal documentation hub",
            "Repository management"
          ],
          benefits: [
            "Efficient workflow navigation",
            "Quick access to all tools",
            "Organized sector management",
            "Streamlined operations"
          ],
          nextSteps: [
            "Try the ecosystem explorer",
            "Browse VaultMesh products",
            "Check repository hub"
          ],
          estimatedTime: "5 minutes",
          difficulty: "beginner",
          category: "navigation"
        },
        {
          id: "core-features",
          title: "Core Features Overview",
          description: "Understand the main capabilities and integration points",
          icon: "⚡",
          features: [
            "AI-powered sector recommendations",
            "Real-time system monitoring",
            "Payment processing integration",
            "Legal compliance tracking"
          ],
          benefits: [
            "Intelligent decision making",
            "Proactive system management", 
            "Secure transactions",
            "Automated compliance"
          ],
          nextSteps: [
            "Set up payment integration",
            "Configure monitoring alerts",
            "Review legal documents"
          ],
          estimatedTime: "7 minutes",
          difficulty: "intermediate",
          category: "features"
        }
      ]
    },
    {
      id: "vaultmesh-setup",
      name: "🔐 VaultMesh™ Setup",
      description: "Configure VaultMesh™ security and payment infrastructure",
      totalTime: "25 minutes",
      difficulty: "intermediate",
      steps: [
        {
          id: "security-setup",
          title: "Security Configuration",
          description: "Set up enterprise-grade security with VaultMesh™ protocols",
          icon: "🛡️",
          features: [
            "Multi-factor authentication",
            "API key management",
            "Encrypted data storage",
            "Audit trail logging"
          ],
          benefits: [
            "Enhanced security posture",
            "Compliance readiness",
            "Risk mitigation",
            "Operational transparency"
          ],
          nextSteps: [
            "Configure API keys",
            "Set up audit logging",
            "Test security protocols"
          ],
          estimatedTime: "10 minutes",
          difficulty: "intermediate",
          category: "security"
        },
        {
          id: "payment-integration",
          title: "Payment Processing",
          description: "Integrate PayPal and Stripe for secure transactions",
          icon: "💳",
          features: [
            "PayPal business integration",
            "Stripe payment processing",
            "Transaction monitoring",
            "Automated invoicing"
          ],
          benefits: [
            "Secure payment processing",
            "Multiple payment options",
            "Automated financial tracking",
            "Reduced manual overhead"
          ],
          nextSteps: [
            "Connect PayPal account",
            "Configure Stripe settings",
            "Test payment flows"
          ],
          estimatedTime: "15 minutes",
          difficulty: "advanced",
          category: "finance"
        }
      ]
    },
    {
      id: "sector-specialization",
      name: "🎯 Sector Specialization",
      description: "Choose and configure your primary sector focus areas",
      totalTime: "30 minutes", 
      difficulty: "intermediate",
      steps: [
        {
          id: "sector-selection",
          title: "Choose Your Sectors",
          description: "Select primary sectors for your business focus",
          icon: "🎯",
          features: [
            "AI-powered sector matching",
            "Cross-sector synergy analysis",
            "Performance metrics tracking",
            "Growth opportunity mapping"
          ],
          benefits: [
            "Optimized sector alignment",
            "Strategic decision support",
            "Performance visibility",
            "Growth pathway clarity"
          ],
          nextSteps: [
            "Complete sector assessment",
            "Review recommendations",
            "Configure sector dashboards"
          ],
          estimatedTime: "12 minutes",
          difficulty: "intermediate",
          category: "strategy"
        },
        {
          id: "sector-configuration",
          title: "Sector Configuration",
          description: "Customize your chosen sectors with specific settings",
          icon: "⚙️",
          features: [
            "Custom dashboard layouts",
            "Automated reporting",
            "Integration workflows",
            "Performance thresholds"
          ],
          benefits: [
            "Tailored user experience",
            "Automated insights",
            "Streamlined operations",
            "Proactive monitoring"
          ],
          nextSteps: [
            "Set up dashboards",
            "Configure alerts",
            "Test integrations"
          ],
          estimatedTime: "18 minutes",
          difficulty: "advanced",
          category: "configuration"
        }
      ]
    }
  ]

  const currentFlowData = onboardingFlows.find(flow => flow.id === currentFlow)
  const currentStepData = currentFlowData?.steps[currentStep]
  const progress = currentFlowData ? ((currentStep + 1) / currentFlowData.steps.length) * 100 : 0

  const handleNextStep = () => {
    if (currentFlowData && currentStep < currentFlowData.steps.length - 1) {
      if (currentStepData) {
        setCompletedSteps(prev => new Set([...Array.from(prev), currentStepData.id]))
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCompleteStep = () => {
    if (currentStepData) {
      setCompletedSteps(prev => new Set([...Array.from(prev), currentStepData.id]))
    }
  }

  const handleStartOnboarding = (flowId: string) => {
    setCurrentFlow(flowId)
    setCurrentStep(0)
    setIsOnboarding(true)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500"
      case "intermediate": return "bg-yellow-500"
      case "advanced": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "infrastructure": return "🏗️"
      case "navigation": return "🧭"
      case "features": return "⚡"
      case "security": return "🛡️"
      case "finance": return "💳"
      case "strategy": return "🎯"
      case "configuration": return "⚙️"
      default: return "📋"
    }
  }

  if (!isOnboarding) {
    return (
      <div className="space-y-6" data-testid="onboarding-selection">
        <div className="text-center space-y-4">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            data-testid="title-onboarding"
          >
            Sector Transition Onboarding
          </motion.h1>
          <p className="text-gray-400 dark:text-gray-500 text-lg max-w-2xl mx-auto" data-testid="description-onboarding">
            Navigate your journey through the Seedwave™ ecosystem with guided onboarding flows 
            tailored to your specific needs and experience level.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {onboardingFlows.map((flow, index) => (
            <motion.div
              key={flow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex h-full"
              data-testid={`flow-card-${flow.id}`}
            >
              <Card className="bg-gray-800 dark:bg-gray-900 border-gray-700 dark:border-gray-600 hover:border-green-500 transition-all duration-300 hover:transform hover:scale-105 flex flex-col w-full min-h-[480px]">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="flex items-center justify-between text-white dark:text-gray-100">
                    <span className="flex items-center gap-2" data-testid={`flow-name-${flow.id}`}>
                      <Sparkles className="h-5 w-5 text-green-400" />
                      {flow.name}
                    </span>
                    <Badge className={`${getDifficultyColor(flow.difficulty)} text-white flex-shrink-0`} data-testid={`flow-difficulty-${flow.id}`}>
                      {flow.difficulty}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-4 flex-grow">
                    <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed" data-testid={`flow-description-${flow.id}`}>{flow.description}</p>
                    
                    <div className="flex justify-between text-sm text-gray-400 dark:text-gray-500 bg-gray-900/50 rounded-lg p-3">
                      <span className="flex items-center gap-1" data-testid={`flow-steps-${flow.id}`}>
                        <Target className="h-4 w-4" />
                        {flow.steps.length} steps
                      </span>
                      <span className="flex items-center gap-1" data-testid={`flow-time-${flow.id}`}>
                        <Zap className="h-4 w-4" />
                        {flow.totalTime}
                      </span>
                    </div>

                    <div className="space-y-2 flex-grow">
                      <div className="text-sm font-medium text-gray-300 dark:text-gray-400">Steps Overview:</div>
                      <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                        {flow.steps.map((step, stepIndex) => (
                          <div key={step.id} className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 py-1" data-testid={`step-preview-${step.id}`}>
                            <span className="text-base flex-shrink-0">{getCategoryIcon(step.category)}</span>
                            <span className="truncate flex-1">{step.title}</span>
                            {completedSteps.has(step.id) && (
                              <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 pt-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold h-12 text-sm"
                      onClick={() => handleStartOnboarding(flow.id)}
                      data-testid={`button-start-flow-${flow.id}`}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start Flow
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-gray-800 dark:bg-gray-900 border-gray-700 dark:border-gray-600" data-testid="card-progress-summary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white dark:text-gray-100">
              <Globe className="h-6 w-6 text-green-400" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400" data-testid="stat-completed-steps">{Array.from(completedSteps).length}</div>
                <div className="text-gray-400 dark:text-gray-500">Steps Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400" data-testid="stat-total-steps">
                  {onboardingFlows.reduce((total, flow) => total + flow.steps.length, 0)}
                </div>
                <div className="text-gray-400 dark:text-gray-500">Total Steps Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400" data-testid="stat-overall-progress">
                  {Math.round((Array.from(completedSteps).length / onboardingFlows.reduce((total, flow) => total + flow.steps.length, 0)) * 100)}%
                </div>
                <div className="text-gray-400 dark:text-gray-500">Overall Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6" data-testid="onboarding-flow">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white dark:text-gray-100" data-testid="current-flow-name">{currentFlowData?.name}</h2>
          <p className="text-gray-400 dark:text-gray-500" data-testid="current-flow-description">{currentFlowData?.description}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsOnboarding(false)}
          className="border-gray-600 dark:border-gray-700 text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800"
          data-testid="button-exit-flow"
        >
          Exit Flow
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400 dark:text-gray-500">
          <span data-testid="progress-step-text">Step {currentStep + 1} of {currentFlowData?.steps.length}</span>
          <span data-testid="progress-percent">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-700 dark:bg-gray-800" data-testid="progress-bar" />
      </div>

      <AnimatePresence mode="wait">
        {currentStepData && (
          <motion.div
            key={currentStepData.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            data-testid={`step-content-${currentStepData.id}`}
          >
            <Card className="bg-gray-800 dark:bg-gray-900 border-gray-700 dark:border-gray-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white dark:text-gray-100">
                  <span className="text-2xl" data-testid="step-icon">{currentStepData.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span data-testid="step-title">{currentStepData.title}</span>
                      {completedSteps.has(currentStepData.id) && (
                        <CheckCircle className="h-5 w-5 text-green-400" data-testid="step-completed-icon" />
                      )}
                    </div>
                    <div className="text-sm text-gray-400 dark:text-gray-500 font-normal" data-testid="step-meta">
                      {currentStepData.estimatedTime} • {currentStepData.difficulty}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-300 dark:text-gray-400 text-lg" data-testid="step-description">{currentStepData.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-400 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {currentStepData.features.map((feature, index) => (
                        <li key={index} className="text-gray-300 dark:text-gray-400 text-sm flex items-start gap-2" data-testid={`feature-${index}`}>
                          <ChevronRight className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-cyan-400 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Benefits
                    </h4>
                    <ul className="space-y-2">
                      {currentStepData.benefits.map((benefit, index) => (
                        <li key={index} className="text-gray-300 dark:text-gray-400 text-sm flex items-start gap-2" data-testid={`benefit-${index}`}>
                          <ChevronRight className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-yellow-400 flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      Next Steps
                    </h4>
                    <ul className="space-y-2">
                      {currentStepData.nextSteps.map((step, index) => (
                        <li key={index} className="text-gray-300 dark:text-gray-400 text-sm flex items-start gap-2" data-testid={`next-step-${index}`}>
                          <ChevronRight className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-700 dark:border-gray-600">
                  <Button 
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                    className="border-gray-600 dark:border-gray-700 text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800"
                    data-testid="button-previous"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex gap-3">
                    {!completedSteps.has(currentStepData.id) && (
                      <Button 
                        variant="outline"
                        onClick={handleCompleteStep}
                        className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                        data-testid="button-mark-complete"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                    
                    <Button 
                      onClick={handleNextStep}
                      disabled={currentFlowData ? currentStep >= currentFlowData.steps.length - 1 : true}
                      className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white"
                      data-testid="button-next"
                    >
                      {currentFlowData && currentStep >= currentFlowData.steps.length - 1 ? 'Complete Flow' : 'Next Step'}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
