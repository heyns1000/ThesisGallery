import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Sparkles, Zap, Heart } from "lucide-react"

export function FruitfulSmartToys() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900" data-testid="fruitful-smart-toys-container">
      <Card className="border-2 border-pink-500/20 bg-gradient-to-r from-pink-500/5 to-purple-500/5">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Gamepad2 className="h-8 w-8 text-white" data-testid="icon-smart-toys" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Fruitful Smart Toys
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Educational smart toys powered by AI and IoT for children's development
          </CardDescription>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="outline" className="border-pink-500 text-pink-400" data-testid="badge-educational">
              Educational
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400" data-testid="badge-ai-powered">
              AI-Powered
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400" data-testid="badge-safe">
              Child-Safe
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "Learning Cube", age: "3-6", icon: Sparkles, color: "pink" },
          { name: "Math Explorer", age: "7-10", icon: Zap, color: "purple" },
          { name: "Science Kit", age: "8-12", icon: Gamepad2, color: "blue" },
          { name: "Creative Studio", age: "5-10", icon: Heart, color: "red" }
        ].map((toy, index) => {
          const IconComponent = toy.icon
          return (
            <Card key={index} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-all" data-testid={`toy-card-${index}`}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <div className={`w-12 h-12 bg-gradient-to-r from-${toy.color}-500 to-${toy.color}-600 rounded-lg flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-lg">{toy.name}</CardTitle>
                <CardDescription>Ages {toy.age}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full" data-testid={`button-learn-${index}`}>
                  Learn More
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Heart className="h-16 w-16 text-pink-500 mx-auto" data-testid="icon-heart" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Building Brighter Futures
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Every smart toy purchase contributes to the Banimal giving loop, supporting educational programs for underprivileged children. Powered by ToyNest.seedwave.faa.zone technology.
            </p>
            <div className="flex justify-center gap-4">
              <Button className="bg-pink-500 hover:bg-pink-600" data-testid="button-preorder">
                Pre-Order Now
              </Button>
              <Button variant="outline" data-testid="button-catalog">
                View Full Catalog
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
