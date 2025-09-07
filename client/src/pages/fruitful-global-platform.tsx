import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Globe, ShoppingCart, Truck, Shield, Zap, Factory, Leaf, 
  Users, Building, Search, Star, ArrowRight, ChevronRight,
  Heart, Sparkles, TrendingUp
} from "lucide-react";

// Fruitful™ Global Platform - Complete ecosystem data
const fruitfulEcosystem = {
  "Global Operations": {
    "Fruitful.America™": {
      description: "50-state economic transformation powered by FAA Quantum Nexus™",
      features: ["Local Manufacturing", "Rand Index™ Scoring", "In-State Sourcing", "Economic Growth Metrics"],
      status: "13 Active States",
      icon: "🇺🇸"
    },
    "Vrugtige.Planet.Verandering™": {
      description: "Global planet transformation initiative with sustainable solutions",
      features: ["Planet-Wide Solutions", "Sustainable Development", "Climate Action", "Global Coordination"],
      status: "Worldwide Initiative",
      icon: "🪨"
    },
    "FAA.Zone Global Network": {
      description: "Central hub connecting thousands of independent collaborative brands",
      features: ["7000+ Brands", "Global Network", "Collaborative Commerce", "Fair Trade Systems"],
      status: "Active Worldwide",
      icon: "🍇"
    }
  },
  "Commerce & Technology": {
    "Global Checkout System": {
      description: "Universal payment and checkout system across all platforms",
      features: ["One-Click Global", "Multi-Currency", "Secure Payments", "Universal Cart"],
      status: "Live Platform",
      icon: "🐑"
    },
    "Smart Delivery Network": {
      description: "AI-powered logistics and delivery optimization system",
      features: ["Drone Delivery", "Smart Routing", "Real-time Tracking", "Eco-Friendly Transport"],
      status: "Deployment Phase",
      icon: "🚚"
    },
    "VaultMesh™ Security": {
      description: "Diamond-tier security architecture with treaty-driven protocols",
      features: ["Treaty Protocols", "Diamond Tier Security", "9-Second Sync", "Global Mesh"],
      status: "Operational",
      icon: "🔐"
    }
  },
  "Sector Integration": {
    "Wildlife Grid Dashboard": {
      description: "Advanced wildlife protection and monitoring systems",
      features: ["Real-time Monitoring", "Conservation Tech", "Species Protection", "Habitat Management"],
      status: "Multi-Country Active",
      icon: "🐬"
    },
    "Mining Intelligence Grid": {
      description: "World-first mining intelligence and optimization platform",
      features: ["Signal Intelligence", "Resource Optimization", "Environmental Monitoring", "Smart Extraction"],
      status: "Now Open",
      icon: "⛏️"
    },
    "Foxed Mobile Transmissions": {
      description: "Advanced mobile communication and data transmission systems",
      features: ["Secure Communications", "Mobile Optimization", "Data Transmission", "Network Intelligence"],
      status: "Transmission Active",
      icon: "🦊"
    }
  }
};

const globalFeatures = [
  {
    title: "7000+ Independent Brands",
    description: "Connecting thousands of small, caring businesses worldwide",
    icon: <Building className="h-8 w-8" />,
    color: "bg-blue-500"
  },
  {
    title: "Collaborative Commerce",
    description: "Businesses working together, not competing",
    icon: <Users className="h-8 w-8" />,
    color: "bg-green-500"
  },
  {
    title: "Planet-First Approach",
    description: "Sustainability and environmental protection at core",
    icon: <Leaf className="h-8 w-8" />,
    color: "bg-emerald-500"
  },
  {
    title: "AI-Powered Intelligence",
    description: "Smart technology supporting fair, personal experiences",
    icon: <Zap className="h-8 w-8" />,
    color: "bg-purple-500"
  },
  {
    title: "Treaty-Level Security",
    description: "Diamond-tier VaultMesh™ protection across all operations",
    icon: <Shield className="h-8 w-8" />,
    color: "bg-indigo-500"
  },
  {
    title: "Global Manufacturing",
    description: "Local production with 100% asset ownership transfer",
    icon: <Factory className="h-8 w-8" />,
    color: "bg-orange-500"
  }
];

const actionButtons = [
  {
    title: "Explore the Vault",
    description: "Access secure FAA™ systems and protocols",
    link: "#vault-access",
    icon: "🦅",
    color: "bg-blue-700"
  },
  {
    title: "Decode Foxed Transmission",
    description: "Access secure mobile communications",
    link: "/foxed-has-mobiles.html",
    icon: "🦊",
    color: "bg-pink-500"
  },
  {
    title: "Wildlife Sector Dashboard",
    description: "Monitor global conservation efforts",
    link: "/sectors/wildlife/dashboard.html",
    icon: "🐬",
    color: "bg-green-500"
  },
  {
    title: "Mining Intelligence Grid",
    description: "Access world-first mining intelligence",
    link: "/sectors/mining/index.html",
    icon: "⛏️",
    color: "bg-yellow-500"
  }
];

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, color }) => (
  <Card className="transform transition-all hover:shadow-xl hover:-translate-y-2 border-2 hover:border-blue-300">
    <CardContent className="p-6 text-center">
      <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
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
      <CardTitle className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 flex items-center">
        <span className="text-3xl mr-3">{sectionIcon}</span>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(systems).map(([name, data]) => (
          <Card key={name} className="border-l-4 border-blue-400 hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">{data.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-200">{name}</h3>
                  <Badge variant="outline" className="text-xs mt-1">{data.status}</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{data.description}</p>
              <div className="space-y-1">
                {data.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center text-xs text-gray-500">
                    <ChevronRight className="h-3 w-3 mr-1" />
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default function FruitfulGlobalPlatform() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-slate-900 dark:to-blue-900" data-testid="fruitful-global-platform">
      {/* Treaty Pulse Strip */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse z-50"></div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        ></div>
        
        <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center text-white px-6 py-20">
          <div className="text-6xl md:text-8xl mb-8 animate-pulse">🦍</div>
          <div className="text-4xl md:text-6xl mb-4">🍉</div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide mb-8">
            Fruitful.Planet.Change™
          </h1>
          
          <div className="max-w-4xl space-y-6 text-lg md:text-xl leading-relaxed">
            <p className="text-white/90">
              <strong>Welcome to 🍇FAA.ZONE</strong> — where new ideas for how we live, shop, and work come together. 
              We bring together thousands of small, independent brands that care about people, the planet, and the future.
            </p>
            
            <p className="text-white/80">
              From eco-friendly clothing to clean food, smart mobile tools to nature protection — this platform connects 
              you with businesses that actually care and collaborate. This isn't typical commerce — it's a global network 
              working together, not competing.
            </p>
            
            <p className="text-white/80">
              Behind it all? Our AI — a quiet but powerful engine making everything work smoother, smarter, and more personally. 
              FAA's technology helps match users with the right brands, surfaces better alternatives, and keeps the entire 
              platform intelligent, fair, and fast.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 max-w-6xl">
            {actionButtons.map((action, index) => (
              <Button
                key={index}
                className={`${action.color} text-white font-semibold uppercase rounded-full shadow hover:shadow-xl transition-all transform hover:-translate-y-1 p-6 h-auto flex flex-col items-center space-y-2`}
                data-testid={`action-${action.title.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <span className="text-3xl">{action.icon}</span>
                <span className="text-sm font-bold">{action.title}</span>
                <span className="text-xs opacity-80">{action.description}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Mining Sector Banner */}
      <div className="bg-yellow-400 overflow-hidden shadow-inner">
        <div className="py-6 text-center text-black">
          <div className="text-2xl md:text-4xl font-extrabold animate-pulse">
            🚨 MINING SECTOR NOW OPEN: 🌍 FAA WORLD-FIRST MINING INTELLIGENCE GRID — SIGNAL GROWING 🌱
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        {/* Global Features Grid */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-indigo-800 dark:text-indigo-300 mb-12">
            🌟 Global Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {globalFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                color={feature.color}
              />
            ))}
          </div>
        </div>

        {/* Ecosystem Sections */}
        <EcosystemSection 
          title="Global Operations" 
          systems={fruitfulEcosystem["Global Operations"]} 
          sectionIcon="🌍"
        />
        
        <EcosystemSection 
          title="Commerce & Technology" 
          systems={fruitfulEcosystem["Commerce & Technology"]} 
          sectionIcon="💻"
        />
        
        <EcosystemSection 
          title="Sector Integration" 
          systems={fruitfulEcosystem["Sector Integration"]} 
          sectionIcon="🔗"
        />

        {/* Platform Statistics */}
        <Card className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-8">🎯 Platform Impact Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold">7000+</div>
                <div className="text-lg opacity-90">Global Brands</div>
              </div>
              <div>
                <div className="text-4xl font-bold">50+</div>
                <div className="text-lg opacity-90">Countries Active</div>
              </div>
              <div>
                <div className="text-4xl font-bold">100%</div>
                <div className="text-lg opacity-90">Collaborative Network</div>
              </div>
              <div>
                <div className="text-4xl font-bold">24/7</div>
                <div className="text-lg opacity-90">AI Intelligence</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treaty & VaultMesh Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-indigo-800 dark:text-indigo-300">
              🔐 Treaty™ & VaultMesh™ Infrastructure
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
                <div className="text-4xl mb-4">📜</div>
                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">Treaty™ Protocols</h3>
                <p className="text-blue-600 dark:text-blue-400">
                  Legal framework ensuring fair collaboration and compliance across all platform operations with treaty-level agreements.
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-lg">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-2">VaultMesh™ Security</h3>
                <p className="text-purple-600 dark:text-purple-400">
                  Diamond-tier security architecture with 9-second synchronization and treaty-driven execution mesh protocols.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-4">🍇</div>
            <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
            <p className="text-xl mb-6 opacity-90">
              Be part of the next generation of fair, collaborative, and sustainable commerce
            </p>
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Button className="bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full">
                <ArrowRight className="h-5 w-5 mr-2" />
                Start Exploring
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 font-bold py-3 px-8 rounded-full">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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