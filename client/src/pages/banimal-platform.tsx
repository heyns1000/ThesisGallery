import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Package, 
  Truck, 
  CreditCard,
  Globe,
  MessageCircle,
  Gift,
  Users,
  BarChart3,
  Settings,
  Shield,
  Zap,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BanimalProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  sku: string;
  inventory: number;
  images: string[];
  variants?: any;
  status: string;
  createdAt: string;
}

interface BanimalOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

interface BanimalCustomer {
  id: string;
  faaId: string;
  email: string;
  firstName: string;
  lastName: string;
  loyaltyPoints: number;
  totalSpent: number;
  orderCount: number;
  status: string;
  customerSince: string;
}

export default function BanimalPlatformPage() {
  const [selectedCurrency, setSelectedCurrency] = useState("ZAR");
  const [chatMessages, setChatMessages] = useState<Array<{role: string, message: string}>>([]);
  const [chatInput, setChatInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/banimal/products'],
    queryFn: () => apiRequest('/api/banimal/products'),
  });

  // Fetch orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/banimal/orders'],
    queryFn: () => apiRequest('/api/banimal/orders'),
  });

  // Fetch customers
  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['/api/banimal/customers'],
    queryFn: () => apiRequest('/api/banimal/customers'),
  });

  // Currency conversion (mock implementation)
  const convertCurrency = (amount: number, from: string, to: string): number => {
    const rates: {[key: string]: number} = {
      'ZAR': 1,
      'USD': 0.054,
      'EUR': 0.051,
      'GBP': 0.043,
      'AUD': 0.082,
    };
    
    if (from === to) return amount;
    const usdAmount = from === 'USD' ? amount : amount * (rates[from] || 1);
    return usdAmount / (rates[to] || 1);
  };

  // Generate FAA™ Customer ID
  const generateFaaCustomerId = (): string => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `FAA${random}${timestamp.slice(-6)}`;
  };

  // AI Chatbot simulation
  const handleChatMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', message: userMessage }]);
    
    // Simulate AI response
    setTimeout(() => {
      let response = "I'm here to help with your Banimal™ order or product questions!";
      
      if (userMessage.toLowerCase().includes('order')) {
        response = "I can help you track your order. Please provide your order number or email address.";
      } else if (userMessage.toLowerCase().includes('return')) {
        response = "Our return policy allows 30 days for returns. Items must be unworn with tags attached.";
      } else if (userMessage.toLowerCase().includes('shipping')) {
        response = "We offer same-day dispatch for orders before 12:00 PM with live tracking via BobGo API.";
      } else if (userMessage.toLowerCase().includes('size')) {
        response = "Our size guide is available on each product page. We recommend checking measurements for the perfect fit.";
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', message: response }]);
    }, 1000);
    
    setChatInput("");
  };

  // Format price with currency
  const formatPrice = (price: number, currency: string = selectedCurrency): string => {
    const convertedPrice = convertCurrency(price, 'ZAR', currency);
    const symbols: {[key: string]: string} = {
      'ZAR': 'R',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'AUD': 'A$',
    };
    return `${symbols[currency] || currency} ${convertedPrice.toFixed(2)}`;
  };

  const getStatusBadge = (status: string, type: 'order' | 'payment' | 'customer' = 'order') => {
    const variants: {[key: string]: any} = {
      'active': 'default',
      'pending': 'secondary',
      'processing': 'secondary',
      'shipped': 'default',
      'delivered': 'default',
      'paid': 'default',
      'failed': 'destructive',
      'refunded': 'outline',
      'cancelled': 'destructive',
      'vip': 'default',
      'inactive': 'secondary',
    };
    
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Banimal™ FAA Platform</h1>
          <p className="text-gray-600 dark:text-gray-300">AI-Powered E-Commerce & Customer Management</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-24" data-testid="select-currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ZAR">🇿🇦 ZAR</SelectItem>
              <SelectItem value="USD">🇺🇸 USD</SelectItem>
              <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
              <SelectItem value="GBP">🇬🇧 GBP</SelectItem>
              <SelectItem value="AUD">🇦🇺 AUD</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" data-testid="button-settings">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="chatbot">AI Support</TabsTrigger>
          <TabsTrigger value="features">FAA™ Features</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-sm text-gray-600">Products</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <ShoppingCart className="h-8 w-8 mx-auto text-green-500 mb-2" />
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-sm text-gray-600">Orders</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                <p className="text-2xl font-bold">{customers.length}</p>
                <p className="text-sm text-gray-600">Customers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                <p className="text-2xl font-bold">
                  {formatPrice(orders.reduce((sum: number, order: BanimalOrder) => sum + order.totalAmount, 0))}
                </p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ordersLoading ? (
                    <div className="text-center py-4">Loading orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p>No orders yet</p>
                    </div>
                  ) : (
                    orders.slice(0, 5).map((order: BanimalOrder) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">#{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">{order.customerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                          {getStatusBadge(order.orderStatus)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customersLoading ? (
                    <div className="text-center py-4">Loading customers...</div>
                  ) : customers.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p>No customers yet</p>
                    </div>
                  ) : (
                    customers
                      .sort((a: BanimalCustomer, b: BanimalCustomer) => b.totalSpent - a.totalSpent)
                      .slice(0, 5)
                      .map((customer: BanimalCustomer) => (
                        <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                            <p className="text-sm text-gray-600">{customer.orderCount} orders</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(customer.totalSpent)}</p>
                            <p className="text-sm text-gray-600">{customer.loyaltyPoints} pts</p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Catalog
              </CardTitle>
              <CardDescription>
                Manage your Banimal™ product inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Inventory</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>SKU</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productsLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading products...
                        </TableCell>
                      </TableRow>
                    ) : products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <p>No products found. Add your first product to get started.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product: BanimalProduct) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                <Camera className="h-6 w-6 text-gray-400" />
                              </div>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-600">{product.description?.slice(0, 50)}...</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                          <TableCell>
                            <Badge variant={product.inventory > 10 ? 'default' : 
                                           product.inventory > 0 ? 'secondary' : 'destructive'}>
                              {product.inventory} in stock
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {product.sku}
                            </code>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Management
              </CardTitle>
              <CardDescription>
                Track and manage customer orders with BobGo shipping integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading orders...
                        </TableCell>
                      </TableRow>
                    ) : orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <p>No orders yet. Your first sale is just around the corner!</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order: BanimalOrder) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">#{order.orderNumber}</p>
                              <p className="text-sm text-gray-600">FAA™ Order</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-sm text-gray-600">{order.customerEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatPrice(order.totalAmount)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(order.paymentStatus, 'payment')}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(order.orderStatus, 'order')}
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Management
              </CardTitle>
              <CardDescription>
                FAA™ Customer database with loyalty points tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>FAA ID</TableHead>
                      <TableHead>Loyalty Points</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customersLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading customers...
                        </TableCell>
                      </TableRow>
                    ) : customers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <p>No customers yet. Start building your customer base!</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      customers.map((customer: BanimalCustomer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                              <p className="text-sm text-gray-600">{customer.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {customer.faaId}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">{customer.loyaltyPoints}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatPrice(customer.totalSpent)}
                          </TableCell>
                          <TableCell>{customer.orderCount}</TableCell>
                          <TableCell>
                            {getStatusBadge(customer.status, 'customer')}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  AI Customer Support
                </CardTitle>
                <CardDescription>
                  24/7 AI-powered customer assistance for orders, returns, and product support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-64 border rounded-lg p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                        <p>Start a conversation with our AI assistant</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {chatMessages.map((msg, index) => (
                          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs p-3 rounded-lg ${
                              msg.role === 'user' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white dark:bg-gray-800 border'
                            }`}>
                              <p className="text-sm">{msg.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about orders, returns, or products..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleChatMessage()}
                      data-testid="input-chat-message"
                    />
                    <Button onClick={handleChatMessage} data-testid="button-send-message">
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <MessageCircle className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">Smart Order Tracking</p>
                      <p className="text-sm text-gray-600">Instant order status and shipping updates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Gift className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="font-medium">Personalized Recommendations</p>
                      <p className="text-sm text-gray-600">AI-generated gift suggestions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Mail className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="font-medium">Cart Recovery</p>
                      <p className="text-sm text-gray-600">Automated abandoned cart emails</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Target className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="font-medium">Dynamic Pricing</p>
                      <p className="text-sm text-gray-600">AI-optimized discounts and offers</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  FAA™ Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Multi-layer encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Fraud prevention</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">POPIA & GDPR compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Secure checkout</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-green-500" />
                  BobGo Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Live shipping rates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Real-time tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Same-day dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Global shipping zones</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-500" />
                  Multi-Currency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Auto country detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Real-time conversion</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">5 major currencies</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Dynamic pricing</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Loyalty Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Banimal Points™ system</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Automatic point earning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Discount redemption</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">VIP tier benefits</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  Holiday AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Auto-promotions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Seasonal campaigns</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Gift suggestions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Event countdown</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-red-500" />
                  Social Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Facebook sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Google Shopping</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">TikTok marketplace</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Auto product listing</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>FAA™ Compliance Report</CardTitle>
              <CardDescription>
                Complete legal framework and e-commerce compliance status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-medium">Legal Compliance</p>
                      <p className="text-sm text-gray-600">Terms, Privacy, POPIA, PAIA compliant</p>
                    </div>
                  </div>
                  <Badge variant="default">100% Compliant</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-medium">Payment Security</p>
                      <p className="text-sm text-gray-600">Encrypted checkout & fraud prevention</p>
                    </div>
                  </div>
                  <Badge variant="default">Secured</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="h-6 w-6 text-purple-500" />
                    <div>
                      <p className="font-medium">International Ready</p>
                      <p className="text-sm text-gray-600">Multi-currency, global shipping zones</p>
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-yellow-500" />
                    <div>
                      <p className="font-medium">AI Integration</p>
                      <p className="text-sm text-gray-600">24/7 support, automated marketing</p>
                    </div>
                  </div>
                  <Badge variant="default">Operational</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}