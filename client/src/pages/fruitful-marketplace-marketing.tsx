import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Megaphone, TrendingUp, Target, BarChart } from "lucide-react"

export default function FruitfulMarketplaceMarketingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="fruitful-marketplace-marketing-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-2 border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Megaphone className="h-8 w-8 text-white" data-testid="icon-marketing" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Marketplace Marketing</CardTitle>
            <CardDescription className="text-lg">
              Strategic marketing campaigns for Fruitful Marketplace ecosystem
            </CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="outline" className="border-blue-500 text-blue-400">Digital Marketing</Badge>
              <Badge variant="outline" className="border-green-500 text-green-400">SEO/SEM</Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Reach", value: "2.5M", icon: Target },
            { title: "Conversion", value: "12.8%", icon: TrendingUp },
            { title: "Engagement", value: "34%", icon: BarChart },
            { title: "ROI", value: "385%", icon: TrendingUp }
          ].map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <Card key={index} data-testid={`metric-card-${index}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardDescription>{metric.title}</CardDescription>
                    <IconComponent className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold">{metric.value}</div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card data-testid="channel-card-social">
            <CardHeader>
              <Megaphone className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Multi-platform campaigns across Facebook, Instagram, Twitter, and LinkedIn
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="channel-card-content">
            <CardHeader>
              <Target className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>Content Marketing</CardTitle>
              <CardDescription>
                SEO-optimized content and thought leadership articles
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="channel-card-paid">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>Paid Advertising</CardTitle>
              <CardDescription>
                Google Ads, Facebook Ads, and programmatic display campaigns
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Megaphone className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Integrated Marketing Strategy</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive marketing campaigns driving awareness and sales across the Fruitful Marketplace, with analytics integration through PulseGrid™ and VaultMesh™ targeting.
            </p>
            <Button className="mt-6 bg-blue-500 hover:bg-blue-600" data-testid="button-view-campaigns">
              View Active Campaigns
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
