import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sprout, Dna, Leaf, Beaker, Globe, TrendingUp, 
  DollarSign, ShoppingCart, CreditCard, Star, CheckCircle, 
  Users, Factory, Shield, Brain, Lightbulb
} from "lucide-react";

// Agriculture-Biotech Platform - Complete ecosystem data
const agricultureEcosystem = {
  "Agricultural Technologies": {
    "Precision Farming": {
      description: "AI-driven precision agriculture and crop optimization systems",
      features: ["GPS Guidance", "Soil Analysis", "Crop Monitoring", "Yield Prediction"],
      price: "$2,500/month",
      icon: "🚜"
    },
    "Smart Irrigation": {
      description: "IoT-enabled water management and conservation systems",
      features: ["Moisture Sensors", "Weather Integration", "Water Conservation", "Remote Control"],
      price: "$1,800/month",
      icon: "💧"
    },
    "Crop Analytics": {
      description: "Advanced analytics for crop health and productivity optimization",
      features: ["Disease Detection", "Growth Tracking", "Nutrient Management", "Harvest Planning"],
      price: "$3,200/month",
      icon: "📊"
    }
  },
  "Biotechnology Solutions": {
    "Gene Sequencing": {
      description: "Next-generation genetic analysis for crop and livestock improvement",
      features: ["DNA Sequencing", "Genetic Markers", "Trait Analysis", "Breeding Optimization"],
      price: "$5,000/month",
      icon: "🧬"
    },
    "Biosensors": {
      description: "Real-time biological monitoring and detection systems",
      features: ["Pathogen Detection", "Contamination Alert", "Quality Control", "Safety Monitoring"],
      price: "$2,800/month",
      icon: "🔬"
    },
    "Biofertilizers": {
      description: "Sustainable biological fertilizer production and application",
      features: ["Microbial Cultures", "Organic Compounds", "Soil Enhancement", "Eco-Friendly"],
      price: "$1,500/month",
      icon: "🌱"
    }
  },
  "Supply Chain Integration": {
    "Blockchain Tracking": {
      description: "End-to-end traceability for agricultural products",
      features: ["Product Tracking", "Quality Assurance", "Supply Chain Visibility", "Consumer Trust"],
      price: "$4,200/month",
      icon: "🔗"
    },
    "Cold Chain Management": {
      description: "Temperature-controlled logistics for perishable goods",
      features: ["Temperature Monitoring", "Logistics Optimization", "Quality Preservation", "Real-time Alerts"],
      price: "$3,500/month",
      icon: "❄️"
    },
    "Market Intelligence": {
      description: "AI-powered market analysis and pricing optimization",
      features: ["Price Forecasting", "Market Trends", "Demand Analysis", "Trading Insights"],
      price: "$2,200/month",
      icon: "📈"
    }
  }
};

// Pricing tiers for the platform
const pricingTiers = [
  {
    name: "Starter",
    price: "$599",
    period: "/month",
    description: "Perfect for small farms and individual farmers",
    features: [
      "Basic Crop Monitoring",
      "Weather Integration",
      "Mobile App Access",
      "Email Support",
      "5 Field Zones",
      "Basic Analytics"
    ],
    isPopular: false,
    paypalPlanId: "P-123STARTER",
    cardClass: "starter-card"
  },
  {
    name: "Professional",
    price: "$2,499",
    period: "/month",
    description: "Comprehensive solution for medium agricultural operations",
    features: [
      "Advanced Crop Analytics",
      "AI-Powered Insights",
      "IoT Sensor Integration",
      "Priority Support",
      "50 Field Zones",
      "Custom Reports",
      "Team Collaboration",
      "Yield Optimization"
    ],
    isPopular: true,
    paypalPlanId: "P-456PROFESSIONAL",
    cardClass: "pro-card"
  },
  {
    name: "Enterprise",
    price: "$8,999",
    period: "/month",
    description: "Full-scale biotech and agricultural platform",
    features: [
      "Complete Platform Access",
      "Gene Sequencing Tools",
      "Supply Chain Integration",
      "24/7 Dedicated Support",
      "Unlimited Field Zones",
      "White-label Solutions",
      "API Access",
      "Custom Development",
      "Regulatory Compliance",
      "Global Deployment"
    ],
    isPopular: false,
    paypalPlanId: "P-789ENTERPRISE",
    cardClass: "enterprise-card"
  }
];

const supportedPaymentMethods = [
  { name: "PayPal", icon: "🅿️", description: "Secure PayPal payments" },
  { name: "Credit Cards", icon: "💳", description: "Visa, MasterCard, Amex" },
  { name: "Bank Transfer", icon: "🏦", description: "Direct bank transfers" },
  { name: "Crypto", icon: "₿", description: "Bitcoin and major cryptocurrencies" }
];

interface PricingCardProps {
  tier: any;
  onSubscribe: (planId: string) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ tier, onSubscribe }) => (
  <Card className={`pricing-card ${tier.cardClass} ${tier.isPopular ? 'highlight' : ''} transform transition-all hover:shadow-xl hover:-translate-y-2`}>
    <CardHeader className="text-center">
      {tier.isPopular && (
        <Badge className="mx-auto mb-4 bg-purple-600 text-white">Most Popular</Badge>
      )}
      <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
      <div className="text-4xl font-bold my-4">
        {tier.price}<span className="text-lg font-normal">{tier.period}</span>
      </div>
      <p className="text-gray-600 dark:text-gray-400">{tier.description}</p>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3 mb-6">
        {tier.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        className="w-full py-3 text-white font-semibold rounded-lg transition-all"
        onClick={() => onSubscribe(tier.paypalPlanId)}
        data-testid={`subscribe-${tier.name.toLowerCase()}`}
      >
        Subscribe to {tier.name}
      </Button>
    </CardContent>
  </Card>
);

interface EcosystemSectionProps {
  title: string;
  systems: Record<string, any>;
  sectionIcon: string;
}

const EcosystemSection: React.FC<EcosystemSectionProps> = ({ title, systems, sectionIcon }) => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-300 flex items-center">
        <span className="text-3xl mr-3">{sectionIcon}</span>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(systems).map(([name, data]) => (
          <Card key={name} className="border-l-4 border-green-400 hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">{data.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-200">{name}</h3>
                  <Badge variant="outline" className="text-xs mt-1 bg-green-100">{data.price}</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{data.description}</p>
              <div className="space-y-1">
                {data.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
              <Button size="sm" className="w-full mt-3 bg-green-600 hover:bg-green-700">
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default function AgricultureBiotechPlatform() {
  const [selectedPayment, setSelectedPayment] = useState('PayPal');
  const [showPayPalModal, setShowPayPalModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    setShowPayPalModal(true);
    // In a real application, this would integrate with PayPal SDK
    console.log(`Subscribing to plan: ${planId}`);
  };

  const handlePayPalPayment = () => {
    // Mock PayPal integration
    alert(`Processing PayPal payment for plan: ${selectedPlan}`);
    setShowPayPalModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-green-900 dark:to-blue-900" data-testid="agriculture-biotech-platform">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-800 via-emerald-800 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🌾🧬</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Agriculture-Biotech Platform
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            Revolutionary agricultural technology and biotechnology solutions powered by AI, 
            IoT, and advanced analytics. Transform your farming operations with cutting-edge science.
          </p>
          <div className="mt-6 flex justify-center space-x-4 flex-wrap">
            <Badge variant="secondary" className="bg-green-500 text-white text-lg px-4 py-2">
              <Sprout className="h-4 w-4 mr-2" />
              Smart Farming
            </Badge>
            <Badge variant="secondary" className="bg-blue-500 text-white text-lg px-4 py-2">
              <Dna className="h-4 w-4 mr-2" />
              Biotechnology
            </Badge>
            <Badge variant="secondary" className="bg-purple-500 text-white text-lg px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              AI-Powered
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        {/* Platform Overview */}
        <Card className="mb-8 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-4">
              🚀 Next-Generation Agricultural Intelligence
            </h2>
            <p className="text-lg text-green-700 dark:text-green-400 max-w-4xl mx-auto mb-6">
              Our platform combines cutting-edge biotechnology, precision agriculture, and AI-driven 
              analytics to revolutionize food production, sustainability, and agricultural efficiency 
              across global operations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <Factory className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-bold">Precision Farming</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">GPS-guided agricultural operations</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <Beaker className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-bold">Biotechnology</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Genetic analysis and biosensors</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-bold">Supply Chain</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">End-to-end traceability</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-bold">Sustainability</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Eco-friendly solutions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ecosystem Sections */}
        <EcosystemSection 
          title="Agricultural Technologies" 
          systems={agricultureEcosystem["Agricultural Technologies"]} 
          sectionIcon="🚜"
        />
        
        <EcosystemSection 
          title="Biotechnology Solutions" 
          systems={agricultureEcosystem["Biotechnology Solutions"]} 
          sectionIcon="🧬"
        />
        
        <EcosystemSection 
          title="Supply Chain Integration" 
          systems={agricultureEcosystem["Supply Chain Integration"]} 
          sectionIcon="🔗"
        />

        {/* Pricing Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-blue-800 dark:text-blue-300">
              💰 Flexible Pricing Plans
            </CardTitle>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
              Choose the perfect plan for your agricultural operation
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => (
                <PricingCard
                  key={index}
                  tier={tier}
                  onSubscribe={handleSubscribe}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-green-800 dark:text-green-300">
              🔒 Secure Payment Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {supportedPaymentMethods.map((method, index) => (
                <div key={index} className="text-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-3xl mb-2">{method.icon}</div>
                  <h3 className="font-semibold">{method.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Statistics */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-green-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-8">📊 Platform Impact Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold">2.5M+</div>
                <div className="text-lg opacity-90">Acres Monitored</div>
              </div>
              <div>
                <div className="text-4xl font-bold">450+</div>
                <div className="text-lg opacity-90">Agricultural Partners</div>
              </div>
              <div>
                <div className="text-4xl font-bold">35%</div>
                <div className="text-lg opacity-90">Average Yield Increase</div>
              </div>
              <div>
                <div className="text-4xl font-bold">60%</div>
                <div className="text-lg opacity-90">Water Usage Reduction</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Stories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-purple-800 dark:text-purple-300">
              🌟 Success Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  "Increased our crop yield by 40% while reducing water usage by half. 
                  The precision farming tools are game-changing."
                </p>
                <div className="font-semibold">- Sarah Johnson, Green Valley Farms</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  "The biotech solutions helped us detect crop diseases early, 
                  saving thousands in potential losses."
                </p>
                <div className="font-semibold">- Marcus Chen, Tech Harvest Inc.</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-green-50 dark:from-purple-900 dark:to-green-900 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  "Supply chain transparency has improved customer trust and 
                  allowed us to command premium prices."
                </p>
                <div className="font-semibold">- Elena Rodriguez, Organic Plus</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PayPal Payment Modal */}
      {showPayPalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Complete Payment</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl mb-4">🅿️</div>
              <p className="mb-6">You will be redirected to PayPal to complete your subscription.</p>
              <div className="space-y-2">
                <Button 
                  onClick={handlePayPalPayment} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Continue with PayPal
                </Button>
                <Button 
                  onClick={() => setShowPayPalModal(false)} 
                  variant="outline" 
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 text-center bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap justify-center mb-4 text-sm space-x-4">
          <a href="https://footer.global.repo.seedwave.faa.zone/privacy.html" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Privacy</a>
          <a href="https://footer.global.repo.seedwave.faa.zone/terms.html" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Terms</a>
          <a href="https://footer.global.repo.seedwave.faa.zone/contact.html" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Contact</a>
          <a href="https://footer.global.repo.seedwave.faa.zone/about.html" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">About</a>
        </div>
        <span>© 2025 FAA™ Treaty System™. All Rights Reserved.</span>
        <span className="ml-2">Powered by 🦍 glyphs + Vault API. Synced with Seedwave™.</span>
      </footer>
    </div>
  );
}