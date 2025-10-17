import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Music, Heart, Users, Gift } from "lucide-react"

export default function FruitfulCrateDancePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="fruitful-crate-dance-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-2 border-pink-500/20 bg-gradient-to-r from-pink-500/5 to-purple-500/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Music className="h-8 w-8 text-white" data-testid="icon-crate-dance" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Fruitful Crate Dance</CardTitle>
            <CardDescription className="text-lg">
              Music-powered giving initiative connecting rhythm with community impact
            </CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="outline" className="border-pink-500 text-pink-400">Music Festival</Badge>
              <Badge variant="outline" className="border-purple-500 text-purple-400">Giving Loop</Badge>
              <Badge variant="outline" className="border-green-500 text-green-400">Community</Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card data-testid="feature-card-events">
            <CardHeader>
              <Music className="h-8 w-8 text-pink-500 mb-2" />
              <CardTitle>Dance Events</CardTitle>
              <CardDescription>
                Community dance events and music festivals across South Africa
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="feature-card-giving">
            <CardHeader>
              <Heart className="h-8 w-8 text-red-500 mb-2" />
              <CardTitle>Banimal Integration</CardTitle>
              <CardDescription>
                Every event supports child welfare through the Banimal giving loop
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="feature-card-community">
            <CardHeader>
              <Users className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>Community Building</CardTitle>
              <CardDescription>
                Bringing people together through music and shared purpose
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Gift className="h-16 w-16 text-pink-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Dance for a Cause</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
              Fruitful Crate Dance combines the joy of music and movement with meaningful community impact. 100% of proceeds support children's education and welfare programs.
            </p>
            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4 max-w-md mx-auto mb-6">
              <p className="text-sm text-pink-800 dark:text-pink-200">
                🎵 Next event: February 14, 2025 | Cape Town Waterfront
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button className="bg-pink-500 hover:bg-pink-600" data-testid="button-register">
                Register for Event
              </Button>
              <Button variant="outline" data-testid="button-learn-more">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
