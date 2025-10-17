import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Music, Video, Mic, Headphones } from "lucide-react"

export default function MotionMediaSonicPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="motion-media-sonic-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-2 border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Music className="h-8 w-8 text-white" data-testid="icon-sonic" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Motion Media Sonic</CardTitle>
            <CardDescription className="text-lg">
              Audio, video, and multimedia production services for the Fruitful ecosystem
            </CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="outline" className="border-purple-500 text-purple-400">Audio Production</Badge>
              <Badge variant="outline" className="border-pink-500 text-pink-400">Video Editing</Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-400">Live Streaming</Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Projects", value: "487", icon: Video },
            { title: "Studio Time", value: "2,847hrs", icon: Mic },
            { title: "Productions", value: "124", icon: Music },
            { title: "Client Satisfaction", value: "98.5%", icon: Headphones }
          ].map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <Card key={index} data-testid={`metric-card-${index}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardDescription>{metric.title}</CardDescription>
                    <IconComponent className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold">{metric.value}</div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card data-testid="service-card-audio">
            <CardHeader>
              <Mic className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>Audio Production</CardTitle>
              <CardDescription>
                Professional recording, mixing, and mastering services
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="service-card-video">
            <CardHeader>
              <Video className="h-8 w-8 text-pink-500 mb-2" />
              <CardTitle>Video Production</CardTitle>
              <CardDescription>
                Full-service video production from concept to final edit
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="service-card-live">
            <CardHeader>
              <Headphones className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Live Streaming</CardTitle>
              <CardDescription>
                Multi-platform live streaming and event coverage
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Music className="h-16 w-16 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Professional Media Production</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
              Motion Media Sonic provides comprehensive multimedia production services for Fruitful Crate Dance events, marketing campaigns, and ecosystem communications.
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 max-w-md mx-auto mb-6">
              <p className="text-sm text-purple-800 dark:text-purple-200">
                🎵 Studio available for booking | Professional equipment | Experienced team
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button className="bg-purple-500 hover:bg-purple-600" data-testid="button-book-studio">
                Book Studio Time
              </Button>
              <Button variant="outline" data-testid="button-view-portfolio">
                View Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
