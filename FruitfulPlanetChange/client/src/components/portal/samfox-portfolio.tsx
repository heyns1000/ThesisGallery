import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import MadibaMockImage from "@assets/samfox-main/Madiba_mock.png"
import BanimalImage from "@assets/Banimal_1753055992604.png"

export function SamFoxPortfolio() {
  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          SamFox Digital Art Portfolio
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Creative digital art, character design & brand development
        </p>
      </div>

      {/* Featured Work Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Madiba Mock - Nelson Mandela Tribute */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Madiba Mock
              <Badge variant="secondary">Digital Art</Badge>
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Nelson Mandela tribute piece featuring creative ice cream concept
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img 
                src={MadibaMockImage} 
                alt="Madiba Mock - Nelson Mandela digital art piece" 
                className="w-full h-full object-cover"
                data-testid="img-madiba-mock"
              />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Portrait Art</Badge>
                <Badge variant="outline">Cultural Tribute</Badge>
                <Badge variant="outline">Hand-drawn Style</Badge>
              </div>
              <p className="text-sm">
                <strong>Medium:</strong> Digital illustration<br/>
                <strong>Style:</strong> Stylized portrait with playful ice cream concept<br/>
                <strong>Theme:</strong> "Mama & Tata" - celebrating South African heritage
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Banimal Collection */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Banimal Collection
              <Badge variant="secondary">Brand Design</Badge>
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Animal-themed children's clothing and soft toy brand
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img 
                src={BanimalImage} 
                alt="Banimal winter onesies collection" 
                className="w-full h-full object-cover"
                data-testid="img-banimal-collection"
              />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Character Design</Badge>
                <Badge variant="outline">Children's Brand</Badge>
                <Badge variant="outline">Product Design</Badge>
              </div>
              <p className="text-sm">
                <strong>Brand:</strong> Banimal Soft Toys<br/>
                <strong>Products:</strong> Winter onesies, soft toys, vinyl designs<br/>
                <strong>Target:</strong> Parents & children (0-3 years)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Assets */}
      <Card>
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
      <Card>
        <CardHeader>
          <CardTitle>Artistic Style & Techniques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Digital Art Expertise</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Character Design</Badge>
                <Badge variant="outline">Portrait Illustration</Badge>
                <Badge variant="outline">Brand Identity</Badge>
                <Badge variant="outline">Product Visualization</Badge>
                <Badge variant="outline">Cultural Art</Badge>
                <Badge variant="outline">Children's Illustration</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Tools & Software</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Adobe Creative Suite (Photoshop, Illustrator), Digital drawing tablets,
                Brand development, Product mockups, Marketing materials
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Specializations</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
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