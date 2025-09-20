import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Globe, 
  Zap, 
  Building, 
  BookOpen, 
  CreditCard, 
  Brain,
  Users,
  BarChart3,
  MessageSquare
} from "lucide-react";
import { SiGoogle } from "react-icons/si";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Fruitful Global Master Hub
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Complete business ecosystem integration platform featuring sacred Baobab™ foundation, 
            LoopPay™ sovereign payment system, and comprehensive AI-powered management across 72 applications.
          </p>
          <div className="flex flex-col items-center gap-4 mt-6">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Button 
                onClick={handleLogin}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8"
                data-testid="button-login"
              >
                <Shield className="w-5 h-5 mr-2" />
                Sign In with Replit
              </Button>
              
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Separator className="w-8" />
                <span className="text-sm font-medium">OR</span>
                <Separator className="w-8" />
              </div>
              
              <Button 
                onClick={handleGoogleLogin}
                size="lg"
                variant="outline"
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-8"
                data-testid="button-google-login"
              >
                <SiGoogle className="w-4 h-4 mr-2 text-red-500" />
                Sign In with Google
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md text-center">
              Choose your preferred authentication method to access the Fruitful Global Master Hub
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <Zap className="w-3 h-3 mr-1" />
            VaultMesh™ Active
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            <BarChart3 className="w-3 h-3 mr-1" />
            9s Pulse Sync Online
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
            <CreditCard className="w-3 h-3 mr-1" />
            LoopPay™ 100% Operational
          </Badge>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Real Estate AI Platform
              </CardTitle>
              <CardDescription>
                FAA Real Estate AI™ with functional AI module navigation and property intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Valuation AI Module</li>
                <li>• Mortgage Risk Analysis</li>
                <li>• Market Forecasting</li>
                <li>• Agent Insights</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                LoopPay™ Sovereign System
              </CardTitle>
              <CardDescription>
                Complete sovereign payment infrastructure with multi-currency support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Multi-currency transactions</li>
                <li>• Payout mesh networks</li>
                <li>• AI payment insights</li>
                <li>• Vendor management</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Education & Learning
              </CardTitle>
              <CardDescription>
                FAA™ Seedling Language Learning with 111 kindness languages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>• 140 protected seedlings</li>
                <li>• Sacred 24/7 mist watering</li>
                <li>• Cultural wisdom tracking</li>
                <li>• Multilingual progress</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-orange-600" />
                AI & Logic Grid
              </CardTitle>
              <CardDescription>
                188 FAA-Certified Core Scroll Brands with CodeNest™ Web Dev Studio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>• GridNest AI systems</li>
                <li>• SignalCore GPT Engine</li>
                <li>• Scroll economy platform</li>
                <li>• 9-second grid sync</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal-600" />
                Global Operations
              </CardTitle>
              <CardDescription>
                Wildlife Grid, Fruitful America™, and cross-platform integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>• 4-country deployment</li>
                <li>• 50-state economic system</li>
                <li>• Wildlife node management</li>
                <li>• Treaty-driven protocols</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-pink-600" />
                Communication Hub
              </CardTitle>
              <CardDescription>
                Multi-channel messaging, email campaigns, and real-time notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>• WhatsApp integration</li>
                <li>• SMS campaigns</li>
                <li>• Email automation</li>
                <li>• Push notifications</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sacred Foundation */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Sacred Baobab™ Foundation</CardTitle>
            <CardDescription className="text-lg">
              Spiritual cornerstone from Kruger National Park (August 7, 2021)
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              The sacred Baobab™ tree serves as both the spiritual and technical cornerstone of our 
              entire business ecosystem, providing wisdom-driven guidance across all 72 applications 
              and 56+ brands in our global operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleLogin}
                variant="outline"
                className="border-amber-600 text-amber-700 hover:bg-amber-50 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-950"
                data-testid="button-login-secondary"
              >
                Begin Your Journey (Replit)
              </Button>
              <Button 
                onClick={handleGoogleLogin}
                variant="outline"
                className="border-amber-600 text-amber-700 hover:bg-amber-50 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-950"
                data-testid="button-google-login-secondary"
              >
                <SiGoogle className="w-4 h-4 mr-2" />
                Begin with Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}