import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SamFoxPortfolio() {
  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent" data-testid="heading-portfolio">
          SamFox Digital Art Portfolio
        </h1>
        <p className="text-gray-600 dark:text-gray-300" data-testid="text-portfolio-description">
          Creative digital art, character design & brand development
        </p>
      </div>

      {/* Featured Work Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Madiba Mock - Nelson Mandela Tribute */}
        <Card className="overflow-hidden" data-testid="card-madiba-mock">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span data-testid="title-madiba-mock">Madiba Mock</span>
              <Badge variant="secondary" data-testid="badge-digital-art">Digital Art</Badge>
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Nelson Mandela tribute piece featuring creative ice cream concept
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🎨</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Madiba Portrait Artwork</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" data-testid="badge-portrait-art">Portrait Art</Badge>
                <Badge variant="outline" data-testid="badge-cultural-tribute">Cultural Tribute</Badge>
                <Badge variant="outline" data-testid="badge-hand-drawn">Hand-drawn Style</Badge>
              </div>
              <p className="text-sm" data-testid="text-madiba-details">
                <strong>Medium:</strong> Digital illustration<br/>
                <strong>Style:</strong> Stylized portrait with playful ice cream concept<br/>
                <strong>Theme:</strong> "Mama & Tata" - celebrating South African heritage
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Banimal Collection */}
        <Card className="overflow-hidden" data-testid="card-banimal-collection">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span data-testid="title-banimal-collection">Banimal Collection</span>
              <Badge variant="secondary" data-testid="badge-brand-design">Brand Design</Badge>
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Animal-themed children's clothing and soft toy brand
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🐻</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Banimal Winter Onesies</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" data-testid="badge-character-design">Character Design</Badge>
                <Badge variant="outline" data-testid="badge-childrens-brand">Children's Brand</Badge>
                <Badge variant="outline" data-testid="badge-product-design">Product Design</Badge>
              </div>
              <p className="text-sm" data-testid="text-banimal-details">
                <strong>Brand:</strong> Banimal Soft Toys<br/>
                <strong>Products:</strong> Winter onesies, soft toys, vinyl designs<br/>
                <strong>Target:</strong> Parents & children (0-3 years)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Assets */}
      <Card data-testid="card-portfolio-assets">
        <CardHeader>
          <CardTitle>Portfolio Assets & Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Digital Art</h4>
              <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Madiba_mock.png (Portrait)</li>
                <li>• Character illustrations</li>
                <li>• Digital paintings</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Brand Materials</h4>
              <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Banimal company profile</li>
                <li>• Product photography</li>
                <li>• Marketing banners</li>
                <li>• Web banners (1m x 1m)</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Design Files</h4>
              <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Adobe Illustrator (.ai)</li>
                <li>• Photoshop (.psd)</li>
                <li>• Vinyl designs</li>
                <li>• PDF presentations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Art Style & Techniques */}
      <Card data-testid="card-art-style">
        <CardHeader>
          <CardTitle>Artistic Style & Techniques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Digital Art Expertise</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" data-testid="badge-character-design-skill">Character Design</Badge>
                <Badge variant="outline" data-testid="badge-portrait-skill">Portrait Illustration</Badge>
                <Badge variant="outline" data-testid="badge-brand-identity">Brand Identity</Badge>
                <Badge variant="outline" data-testid="badge-product-viz">Product Visualization</Badge>
                <Badge variant="outline" data-testid="badge-cultural-art">Cultural Art</Badge>
                <Badge variant="outline" data-testid="badge-childrens-illustration">Children's Illustration</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Tools & Software</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400" data-testid="text-tools">
                Adobe Creative Suite (Photoshop, Illustrator), Digital drawing tablets,
                Brand development, Product mockups, Marketing materials
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Specializations</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400" data-testid="text-specializations">
                • Cultural tribute art (Madiba/Nelson Mandela artwork)<br/>
                • Children's brand development (Banimal collection)<br/>
                • Animal character design and illustration<br/>
                • Product design for soft toys and clothing<br/>
                • Digital marketing assets and brand materials
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
