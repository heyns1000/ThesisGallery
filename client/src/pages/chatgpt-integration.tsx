import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Bot, Sparkles, Zap } from "lucide-react"

export default function ChatGPTIntegrationPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="chatgpt-integration-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-2 border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="h-8 w-8 text-white" data-testid="icon-ai" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">ChatGPT Integration</CardTitle>
            <CardDescription className="text-lg">
              AI-powered assistance and automation across the Fruitful ecosystem
            </CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="outline" className="border-purple-500 text-purple-400">OpenAI</Badge>
              <Badge variant="outline" className="border-pink-500 text-pink-400">GPT-4</Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-400">Coming Soon</Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card data-testid="feature-card-chat">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>Smart Chat Assistant</CardTitle>
              <CardDescription>
                Conversational AI for customer support and user assistance
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="feature-card-automation">
            <CardHeader>
              <Zap className="h-8 w-8 text-pink-500 mb-2" />
              <CardTitle>Workflow Automation</CardTitle>
              <CardDescription>
                AI-driven task automation and process optimization
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="feature-card-insights">
            <CardHeader>
              <Sparkles className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Intelligent Insights</CardTitle>
              <CardDescription>
                Data analysis and predictive recommendations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Bot className="h-16 w-16 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Integration Coming Soon</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Full ChatGPT integration with custom training on VaultMesh™ documentation, ecosystem services, and intelligent automation workflows.
            </p>
            <Button className="mt-6 bg-purple-500 hover:bg-purple-600" data-testid="button-get-access">
              Request Early Access
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
