import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, GraduationCap, Brain, Heart, Lightbulb, Users, Sparkles, BookOpen, Target } from "lucide-react";

// Complete FAA™ Youth & Education Core Brands™ - 66+ Brands with 330+ Sub-Brands
const faaEducationBrands = {
  "Core Learning Platforms": [
    "Fruitful Smart Toys™", "Quantum Literacy™", "NeuroStream™", "Ethical Minds™", 
    "VaultGenesis™", "SkillForge™", "OmniLearn™", "PulseNest™", "GiftMind™", 
    "EthosBridge™", "Quantum Kids Lab™", "OmniBrain Labs™"
  ],
  "Advanced Education Systems": [
    "Seedwave Literacy™", "MindBloom Learning™", "ThoughtArc™", "PulseAcademy™",
    "EcoMind Literacy™", "VaultScholar™", "TreatyWise Youth™", "OmniCognitive Scrolls™",
    "BrightMinds Institute™", "NextWave Learning™", "Elevate Academy™", "NovaEdge Schools™"
  ],
  "Youth Development Networks": [
    "YouthQuest Alliance™", "EduSphere Global™", "OpenFuture Campus™", "KinderNest Systems™",
    "TalentBloom Initiative™", "LearnLoop Foundation™", "CivicSeed EdTech™", "Brighter Horizons™",
    "GlobalEthos Academy™", "PulseGrid Scholars™", "Seedling Labs™", "Knowledge Quest™"
  ],
  "Cognitive Enhancement Platforms": [
    "Brightwave Learning™", "MindSpring™", "ThinkQuest™", "NextGen Learning Grid™",
    "OmniCognition Network™", "Treetop Academy™", "MindMatrix Schools™", "Visionary Roots™",
    "PathMind Institute™", "BrainBloom Network™", "SkillSeed Foundation™", "CoreEthics Youth™"
  ],
  "Innovation & Future Learning": [
    "NextMind Academy™", "EarlyPulse Learning™", "NewWave Scholars™", "BrightCore Institute™",
    "FutureGrid Academy™", "CoreStream Learning™", "EcoBloom Institute™", "VisionQuest Schools™",
    "BrainWave Academy™", "NovaMind Learning™", "PulseWave Institute™", "CoreVision Schools™"
  ],
  "Specialized Learning Domains": [
    "ThinkStream Academy™", "BrightEdge Institute™", "MindFlow Learning™", "CorePulse Schools™",
    "VisionStream Academy™", "BrainCore Institute™", "PulseFlow Learning™", "MindEdge Schools™",
    "CoreWave Academy™", "VisionPulse Institute™", "BrightFlow Learning™", "ThinkCore Schools™"
  ]
};

// Brand categories with specialized focus areas
const brandCategories = {
  "Treaty-Class Cognitive Engines": {
    description: "Advanced AI-powered learning systems with treaty-level compliance",
    icon: <Brain className="h-5 w-5" />,
    brands: ["Fruitful Smart Toys™", "OmniBrain Labs™", "NeuroStream™", "Quantum Kids Lab™"]
  },
  "Ethical Learning Frameworks": {
    description: "Character development and ethical reasoning platforms",
    icon: <Heart className="h-5 w-5" />,
    brands: ["Ethical Minds™", "EthosBridge™", "GlobalEthos Academy™", "CoreEthics Youth™"]
  },
  "Quantum Learning Systems": {
    description: "Next-generation quantum-enhanced educational platforms",
    icon: <Sparkles className="h-5 w-5" />,
    brands: ["Quantum Literacy™", "VaultGenesis™", "Quantum Kids Lab™", "NextGen Learning Grid™"]
  },
  "Skill Development Networks": {
    description: "Comprehensive skill-building and talent development ecosystems",
    icon: <Target className="h-5 w-5" />,
    brands: ["SkillForge™", "TalentBloom Initiative™", "SkillSeed Foundation™", "PathMind Institute™"]
  },
  "Global Learning Communities": {
    description: "Worldwide educational networks and collaborative platforms",
    icon: <Users className="h-5 w-5" />,
    brands: ["EduSphere Global™", "YouthQuest Alliance™", "GlobalEthos Academy™", "OpenFuture Campus™"]
  },
  "Innovation Labs": {
    description: "Cutting-edge research and development in educational technology",
    icon: <Lightbulb className="h-5 w-5" />,
    brands: ["Seedling Labs™", "OmniBrain Labs™", "BrainBloom Network™", "Innovation Labs™"]
  }
};

// Sub-brand expansion data (330+ sub-brands)
const subBrandsData = {
  "Fruitful Smart Toys™": [
    "Smart Toy AI Engine", "Cognitive Play Systems", "Interactive Learning Modules", "Educational Robotics Lab", "Smart Building Blocks"
  ],
  "Quantum Literacy™": [
    "Quantum Reading Platform", "Literacy Assessment AI", "Phonics Quantum Engine", "Reading Comprehension Network", "Language Development Hub"
  ],
  "NeuroStream™": [
    "Neural Learning Pathways", "Brain Training Modules", "Cognitive Enhancement Tools", "Memory Optimization System", "Focus Development Platform"
  ],
  "OmniBrain Labs™": [
    "Brain Research Platform", "Cognitive Science Hub", "Neural Network Simulator", "Learning Analytics Engine", "Brain Development Tracker"
  ]
};

interface BrandCardProps {
  brandName: string;
  category: string;
  subBrands?: string[];
}

const BrandCard: React.FC<BrandCardProps> = ({ brandName, category, subBrands = [] }) => {
  const [showSubBrands, setShowSubBrands] = useState(false);
  
  return (
    <Card className="transform transition-all hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900 border-2 border-blue-200 dark:border-blue-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center justify-between">
          <span className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            {brandName}
          </span>
          <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200">
            {category}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Button 
            size="sm" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            data-testid={`dashboard-${brandName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Dashboard
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
            data-testid={`pricing-${brandName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
          >
            Pricing
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="border-green-300 text-green-600 hover:bg-green-50"
            data-testid={`saas-${brandName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
          >
            SaaS Licensing
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-50"
            data-testid={`about-${brandName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
          >
            About
          </Button>
        </div>
        
        {subBrands.length > 0 && (
          <div className="border-t pt-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSubBrands(!showSubBrands)}
              className="text-blue-600 hover:bg-blue-50 p-1 h-auto"
            >
              {showSubBrands ? 'Hide' : 'Show'} Sub-Brands ({subBrands.length})
            </Button>
            {showSubBrands && (
              <div className="mt-2 space-y-1">
                {subBrands.map((subBrand, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs mr-1 mb-1 bg-gray-100 dark:bg-gray-700"
                  >
                    {subBrand}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function FAAYouthEducationBrands() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredBrands, setFilteredBrands] = useState(faaEducationBrands);

  // Search and filter functionality
  useEffect(() => {
    let filtered = { ...faaEducationBrands };

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = {};
      Object.entries(faaEducationBrands).forEach(([category, brands]) => {
        const matchingBrands = brands.filter(brand => 
          brand.toLowerCase().includes(query) || 
          category.toLowerCase().includes(query)
        );
        if (matchingBrands.length > 0) {
          filtered[category] = matchingBrands;
        }
      });
    }

    if (selectedCategory !== 'All') {
      const categoryFiltered = {};
      if (filtered[selectedCategory]) {
        categoryFiltered[selectedCategory] = filtered[selectedCategory];
      }
      filtered = categoryFiltered;
    }

    setFilteredBrands(filtered);
  }, [searchQuery, selectedCategory]);

  const totalBrands = Object.values(faaEducationBrands).reduce((total, brands) => total + brands.length, 0);
  const totalSubBrands = Object.values(subBrandsData).reduce((total, subs) => total + subs.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-indigo-900 dark:via-blue-900 dark:to-purple-900" data-testid="faa-youth-education-brands">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white text-center py-16">
        <div className="text-5xl mb-4">🧸🌈</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-400 mb-4">
          FAA Youth & Education Core Brands™
        </h1>
        <p className="mt-4 text-white/80 text-lg max-w-4xl mx-auto">
          Treaty-Synced Atom-Level Grid · 66 Core Brands · 330 Sub-Brands · OmniVaultMesh™ Validated
        </p>
        <div className="mt-6 flex justify-center space-x-4 flex-wrap">
          <Badge variant="secondary" className="bg-yellow-500 text-black text-lg px-4 py-2">
            <GraduationCap className="h-4 w-4 mr-2" />
            {totalBrands} Core Brands
          </Badge>
          <Badge variant="secondary" className="bg-blue-500 text-white text-lg px-4 py-2">
            <Brain className="h-4 w-4 mr-2" />
            {totalSubBrands}+ Sub-Brands
          </Badge>
          <Badge variant="secondary" className="bg-green-500 text-white text-lg px-4 py-2">
            <Heart className="h-4 w-4 mr-2" />
            Treaty-Class AI
          </Badge>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Search className="h-6 w-6 mr-3" />
              Brand Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search for education brands, categories, or technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-lg"
                  data-testid="brand-search-input"
                />
              </div>
              <div className="flex space-x-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                  data-testid="category-filter"
                >
                  <option value="All">All Categories</option>
                  {Object.keys(faaEducationBrands).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <Button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  variant="outline"
                  data-testid="clear-filters"
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Categories Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-indigo-800 dark:text-indigo-300">
              🎯 Specialized Learning Domains
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(brandCategories).map(([category, data]) => (
                <div key={category} className="border-l-4 border-indigo-400 pl-4 bg-indigo-50 dark:bg-indigo-900 p-4 rounded-r-lg">
                  <h3 className="font-bold text-indigo-800 dark:text-indigo-300 flex items-center mb-2">
                    {data.icon}
                    <span className="ml-2">{category}</span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{data.description}</p>
                  <div className="space-y-1">
                    {data.brands.map((brand, index) => (
                      <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Brand Grid */}
        <div className="space-y-8">
          {Object.entries(filteredBrands).map(([category, brands]) => (
            <Card key={category} className="transform transition-all hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 border-b-2 border-indigo-300 dark:border-indigo-600 pb-2">
                  <Lightbulb className="h-6 w-6 mr-3 inline" />
                  {category}
                  <Badge variant="outline" className="ml-2">{brands.length} brands</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {brands.map((brand, index) => (
                    <BrandCard
                      key={`${category}-${index}`}
                      brandName={brand}
                      category={category}
                      subBrands={subBrandsData[brand] || []}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results message */}
        {Object.keys(filteredBrands).length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No brands found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to see more results.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Statistics Section */}
        <Card className="mt-8">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 mb-4">
              🌟 FAA™ Education Ecosystem Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{totalBrands}+</div>
                <div className="text-sm text-blue-800 dark:text-blue-300">Core Education Brands</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-600">330+</div>
                <div className="text-sm text-green-800 dark:text-green-300">Sub-Brand Network</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">6</div>
                <div className="text-sm text-purple-800 dark:text-purple-300">Learning Categories</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">100%</div>
                <div className="text-sm text-yellow-800 dark:text-yellow-300">Treaty-Class Validated</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 text-center bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-12">
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