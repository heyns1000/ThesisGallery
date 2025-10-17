import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Globe,
  TrendingUp,
  Users,
  Star,
  Heart,
  Share2,
  Search,
  Filter,
  ExternalLink,
  Play,
  Download,
  MessageCircle,
  ThumbsUp,
  Eye,
  Package,
  Truck,
  Shield,
  CreditCard,
  Smartphone,
  Laptop,
  Headphones,
  Camera,
  Watch,
  Gamepad2,
  Shirt,
  Home,
  Coffee,
  Dumbbell
} from 'lucide-react';
import { motion } from 'framer-motion';

// Marketplace Categories
const categories = [
  { id: 'electronics', name: 'Electronics', icon: <Smartphone className="w-6 h-6" />, count: 1247, color: 'from-blue-500 to-cyan-500' },
  { id: 'fashion', name: 'Fashion & Apparel', icon: <Shirt className="w-6 h-6" />, count: 892, color: 'from-pink-500 to-purple-500' },
  { id: 'home', name: 'Home & Living', icon: <Home className="w-6 h-6" />, count: 634, color: 'from-green-500 to-teal-500' },
  { id: 'sports', name: 'Sports & Fitness', icon: <Dumbbell className="w-6 h-6" />, count: 456, color: 'from-orange-500 to-red-500' },
  { id: 'gaming', name: 'Gaming', icon: <Gamepad2 className="w-6 h-6" />, count: 378, color: 'from-purple-500 to-indigo-500' },
  { id: 'accessories', name: 'Accessories', icon: <Watch className="w-6 h-6" />, count: 521, color: 'from-yellow-500 to-orange-500' },
  { id: 'audio', name: 'Audio & Tech', icon: <Headphones className="w-6 h-6" />, count: 287, color: 'from-indigo-500 to-blue-500' },
  { id: 'lifestyle', name: 'Lifestyle', icon: <Coffee className="w-6 h-6" />, count: 195, color: 'from-teal-500 to-green-500' }
];

// Featured Products
const featuredProducts = [
  {
    id: 1,
    name: 'Smart Fitness Tracker Pro',
    price: 'R2,499',
    originalPrice: 'R3,199',
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 1247,
    category: 'Sports & Fitness',
    badge: 'Best Seller',
    discount: '22% OFF'
  },
  {
    id: 2,
    name: 'Wireless Gaming Headset',
    price: 'R1,899',
    originalPrice: 'R2,399',
    image: '/api/placeholder/300/300',
    rating: 4.9,
    reviews: 832,
    category: 'Gaming',
    badge: 'New Arrival',
    discount: '21% OFF'
  },
  {
    id: 3,
    name: 'Premium Coffee Machine',
    price: 'R4,999',
    originalPrice: 'R6,499',
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 456,
    category: 'Home & Living',
    badge: 'Editor\'s Choice',
    discount: '23% OFF'
  },
  {
    id: 4,
    name: 'Smartphone Camera Lens Kit',
    price: 'R899',
    originalPrice: 'R1,199',
    image: '/api/placeholder/300/300',
    rating: 4.6,
    reviews: 623,
    category: 'Electronics',
    badge: 'Trending',
    discount: '25% OFF'
  }
];

// Marketing Stats
const marketingStats = [
  { label: 'Active Products', value: '6,005', growth: '+23%', icon: <Package className="w-6 h-6" /> },
  { label: 'Monthly Visitors', value: '2.3M', growth: '+45%', icon: <Users className="w-6 h-6" /> },
  { label: 'Conversion Rate', value: '8.7%', growth: '+12%', icon: <TrendingUp className="w-6 h-6" /> },
  { label: 'Customer Satisfaction', value: '96%', growth: '+3%', icon: <Star className="w-6 h-6" /> }
];

// Live URL Integration Features
const liveFeatures = [
  { title: 'Real-time Inventory', description: 'Live stock tracking across all 6,005 products', icon: <Globe className="w-5 h-5" /> },
  { title: 'Dynamic Pricing', description: 'AI-powered pricing optimization', icon: <TrendingUp className="w-5 h-5" /> },
  { title: 'Live Chat Support', description: '24/7 customer support integration', icon: <MessageCircle className="w-5 h-5" /> },
  { title: 'Secure Payments', description: 'Multiple payment gateways', icon: <Shield className="w-5 h-5" /> }
];

export default function FruitfulMarketplaceMarketing() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-red-400/20 to-pink-400/20 dark:from-orange-600/30 dark:via-red-600/30 dark:to-pink-600/30" />
        <div className="relative px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl">
                  <ShoppingCart className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                    Fruitful Marketplace
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">Your Premium Shopping Destination</p>
                </div>
              </div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
              >
                Discover over 6,005 premium products across 8 categories with real-time inventory, 
                AI-powered recommendations, and seamless shopping experiences powered by advanced technology.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center gap-6 flex-wrap mb-8"
              >
                <Badge className="px-6 py-3 text-lg bg-orange-500/20 text-orange-600 border-orange-500/30">
                  <Package className="w-5 h-5 mr-2" />
                  6,005+ Products
                </Badge>
                <Badge className="px-6 py-3 text-lg bg-red-500/20 text-red-600 border-red-500/30">
                  <Globe className="w-5 h-5 mr-2" />
                  Live Integration
                </Badge>
                <Badge className="px-6 py-3 text-lg bg-green-500/20 text-green-600 border-green-500/30">
                  <Shield className="w-5 h-5 mr-2" />
                  Secure Shopping
                </Badge>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center justify-center gap-4 flex-wrap"
              >
                <Button 
                  size="lg"
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300"
                  onClick={() => window.open('https://www.fruitfulcratedance.com', '_blank')}
                >
                  <ExternalLink className="w-6 h-6 mr-3" />
                  Visit Live Store
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-4 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 text-xl font-bold rounded-2xl"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marketing Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {marketingStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="text-center hover:shadow-xl transition-all duration-300 border-t-4 border-t-orange-500">
                <CardContent className="pt-6">
                  <div className="inline-flex p-3 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-4 text-orange-600">
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{stat.label}</p>
                  <Badge className="bg-green-100 text-green-600 border-green-200">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.growth}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="products" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mx-auto">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Marketing
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Live Features
            </TabsTrigger>
          </TabsList>

          {/* Featured Products */}
          <TabsContent value="products" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Hand-picked premium products with real-time availability and competitive pricing
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg rounded-xl border-2 border-orange-200 focus:border-orange-500"
                />
              </div>
              <Button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl">
                <Filter className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative">
                      <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                        <Camera className="w-16 h-16 text-gray-400" />
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-red-500 text-white font-bold">
                          {product.discount}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="bg-white/90">
                          {product.badge}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500 mb-2">{product.category}</div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({product.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-orange-600">{product.price}</span>
                          <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Categories */}
          <TabsContent value="categories" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Product Categories</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Explore our comprehensive range of products across 8 major categories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${category.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {category.icon}
                      </div>
                      <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{category.count} products</p>
                      <Progress value={(category.count / 1500) * 100} className="h-2" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Marketing Features */}
          <TabsContent value="marketing" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Marketing & Growth</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Advanced marketing tools and analytics to drive sales and customer engagement
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                    Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Conversion Rate</span>
                      <span className="font-bold text-green-600">8.7%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Customer Retention</span>
                      <span className="font-bold text-blue-600">76%</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Mobile Traffic</span>
                      <span className="font-bold text-purple-600">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-blue-500" />
                    Customer Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">2.3M</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Monthly Visitors</div>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">4.2</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Pages per Session</div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">3m 45s</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Avg. Session</div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">96%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Live Integration Features */}
          <TabsContent value="integration" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Live Integration Features</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Real-time marketplace features powered by advanced technology and live data integration
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {liveFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Live URL Integration</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
                  The Fruitful Marketplace is fully integrated with live URL functionality, providing real-time 
                  product updates, inventory management, and seamless e-commerce operations.
                </p>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Badge className="px-4 py-2 bg-green-500/20 text-green-600 border-green-500/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                    Live Status: Active
                  </Badge>
                  <Badge className="px-4 py-2 bg-blue-500/20 text-blue-600 border-blue-500/30">
                    Last Updated: {currentTime.toLocaleTimeString()}
                  </Badge>
                </div>
                <div className="flex justify-center gap-4">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white"
                    onClick={() => window.open('https://www.fruitfulcratedance.com', '_blank')}
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Access Live Store
                  </Button>
                  <Button size="lg" variant="outline">
                    <Download className="w-5 h-5 mr-2" />
                    Download Catalog
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}