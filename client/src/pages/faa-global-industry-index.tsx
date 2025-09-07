import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Globe, Building, Factory, Zap } from "lucide-react";

// Complete FAA™ Brand Data - 2500+ brands organized by countries and sectors
const faaBrandData = {
  "Australia": {
    "Smart Home & AI Tech": [
      "FAA™ Home Innovations", "FAA™ Smart Appliances", "FAA™ Home Automation (Global application, but active in AU)", "FAA™ Smart Home & AI Tech (General application, active in AU)"
    ],
    "Eco & Renewable Energy": [
      "FAA™ Green Future", "FAA™ Solar Systems (U.S., Africa, but active in AU)", "FAA™ EcoPower (Germany, South America, but active in AU)", "FAA™ CleanTech Solutions (China, India, but active in AU)", "FAA™ Solar Grid™", "FAA™ AgriTech AI™", "FAA™ Ocean Cleanup™", "FAA™ Carbon Zero™", "FAA™ WaterSmart™"
    ],
    "Fitness & Wellness": [
      "FAA™ Fitness Gear", "FAA™ ActiveLife Products", "FAA™ Wellness (Asia-Pacific, EU, but active in AU)", "FAA™ GymTech™", "FAA™ Outdoor Sports™", "FAA™ WearX™", "FAA™ Playgrounds™", "FAA™ Recovery™"
    ],
    "Consumer Electronics": [
      "FAA™ Electronics Hub (U.S., EU, Japan, but active in AU)", "FAA™ Smart Devices (Global application, but active in AU)", "FAA™ Gadget Zone (U.S., UK, South Africa, but active in AU)", "FAA™ Electronics Marketplace (China, Latin America, but active in AU)"
    ],
    "Auto & Mobility Solutions": [
      "FAA™ Electric Cars (U.S., Europe, but active in AU)", "FAA™ Smart Mobility (U.K., Japan, but active in AU)", "FAA™ E-Mobility (Global application, but active in AU)", "FAA™ Auto Parts™", "FAA™ 4x4 Gear™", "FAA™ E-Mobility™", "FAA™ Smart Transport™", "FAA™ Motorsport™"
    ],
    "Baby & Kids Essentials": [
      "FAA™ KidsCare", "FAA™ Baby Essentials (EU, Japan, but active in AU)", "FAA™ Child Innovation (South Africa, Asia-Pacific, but active in AU)", "FAA™ Baby & Kids™", "FAA™ Learning Hub™", "FAA™ Safety First™", "FAA™ SchoolGear™"
    ],
    "Sustainable Living": [
      "FAA™ Green Living (Global application, but active in AU)", "FAA™ Eco Products (U.S., EU, but active in AU)", "FAA™ Sustainable Home (Australia, South America)"
    ],
    "Fashion & Apparel": [
      "FAA™ Fashion Hub (Global application, but active in AU)", "FAA™ Apparel (U.K., China, but active in AU)", "FAA™ ActiveWear (EU, Japan, but active in AU)"
    ],
    "Industrial & Hardware": [
      "FAA™ Industrial Tools", "FAA™ Hardware Solutions (Global application, but active in AU)", "FAA™ Construction Gear (EU, Africa, but active in AU)", "FAA™ Mega Tools™", "FAA™ Trade Depot™", "FAA™ Home Build™", "FAA™ Industrial Solutions™", "FAA™ Smart Workshop™"
    ],
    "Gaming & Entertainment": [
      "FAA™ Game Zone (Global application, but active in AU)", "FAA™ Interactive Gaming (EU, U.S., but active in AU)", "FAA™ VR/AR Gaming (Japan, U.K., but active in AU)", "FAA™ Music AI™", "FAA™ FilmTech™", "FAA™ Gaming XR™", "FAA™ Digital Art™", "FAA™ Smart Museums™"
    ],
    "Tools & DIY Equipment": [
      "FAA™ DIY Essentials (U.S., U.K., but active in AU)", "FAA™ Power Tools (Europe, South Africa, but active in AU)", "FAA™ Home Repair (Global application, but active in AU)"
    ],
    "Outdoor, Adventure & Camping Gear": [
      "FAA™ Outback Gear™", "FAA™ Camping Pro™", "FAA™ Off-Grid Living™", "FAA™ Tactical™"
    ],
    "Home & Living Essentials": [
      "FAA™ Luxe Living™", "FAA™ Garden Pro™", "FAA™ Smart Kitchen™", "FAA™ HomeFix™", "FAA™ Eco Living™"
    ],
    "Retail, E-Commerce & Omnichannel Expansion": [
      "FAA™ HyperMall™", "FAA™ Express Logistics™", "FAA™ Global Pay™", "FAA™ Drone Delivery™", "FAA™ Next-Gen Commerce™"
    ]
  },
  "Japan": {
    "Smart Home & AI Tech": [
      "FAA™ Smart Solutions (U.S., EU, Japan)", "FAA™ Home Automation (Global application, but active in JP)"
    ],
    "Eco & Renewable Energy": [
      "FAA™ CleanTech Solutions (China, India, but active in JP)"
    ],
    "Consumer Electronics": [
      "FAA™ Electronics Hub (U.S., EU, Japan)", "FAA™ Smart Devices (Global application, but active in JP)"
    ],
    "Auto & Mobility Solutions": [
      "FAA™ Smart Mobility (U.K., Japan)", "FAA™ E-Mobility (Global application, but active in JP)", "FAA™ Urban Mobility™"
    ],
    "Baby & Kids Essentials": [
      "FAA™ Baby Essentials (EU, Japan)", "FAA™ Child Innovation (South Africa, Asia-Pacific, but active in JP)"
    ],
    "Fashion & Apparel": [
      "FAA™ ActiveWear (EU, Japan)"
    ],
    "Gaming & Entertainment": [
      "FAA™ VR/AR Gaming (Japan, U.K.)"
    ],
    "Robotics, AI & Smart Manufacturing": [
      "FAA Japan Robotics™", "FAA Quantum Computing™", "FAA AI Logistics™", "FAA FinTech Japan™", "FAA Urban Mobility™"
    ],
    "Sustainability, Green Tech & Future Cities": [
      "FAA Smart Cities™", "FAA EV Tech™", "FAA BioEnergy™", "FAA Japan Carbon Net Zero™", "FAA Oceanic AI™"
    ],
    "Culture, Gaming & Innovation": [
      "FAA Anime XR™", "FAA Gaming AI™", "FAA Fashion Japan™", "FAA VR Japan™", "FAA Digital Arts™"
    ],
    "Health & Medical": [
      "FAA Life™ Japan (Health, Wellness & Longevity Tech)", "FAA HealthTech Japan"
    ],
    "AI Systems": [
      "FAA AI Suite China (but active in JP)", "FAA AI Systems™ Japan (Deep Learning & AI Expansion)"
    ],
    "Financial Systems": [
      "FAA Financial Systems™ Japan (FinTech, Crypto & Banking AI)"
    ]
  },
  "South Africa": {
    "E-Commerce & Retail": [
      "FAA™ E-Commerce Solutions South Africa", "FAA™ Digital Marketplaces Africa™", "FAA™ Africa Commerce™", "FAA™ Mobile Pay™", "FAA™ TradeHub™", "FAA™ HyperMarket™", "FAA™ Drone Delivery SA™", "FAA™ Hypermarket UAE™ (Multi-category e-commerce for daily essentials & bulk buying, active in SA)", "FAA™ Organic Mart UAE™ (Sustainable products, organic food, and eco-commerce, active in SA)", "FAA™ Retail Solutions™", "FAA™ Retail Cloud AI", "FAA™ Omni-Commerce", "FAA™ Smart Retail AI", "FAA™ Logistics AI", "FAA™ Smart Payments", "FAA™ Metaverse Retail", "FAA™ Cross-Border Trade", "FAA™ AI Retail Intelligence", "FAA™ Secure Transactions", "FAA™ Omni-Commerce AI Sync", "FAA™ AI Smart Pricing", "FAA™ AI Checkout & Payment Gateway", "FAA™ Logistics AI™ – Auto Dispatch & Tracking"
    ],
    "Fashion & Apparel": [
      "FAA™ Fashion South Africa"
    ],
    "Sustainability Network": [
      "FAA™ Sustainability Network South Africa"
    ],
    "Electronics & Tech": [
      "FAA™ Electronics Marketplace (China, Latin America, but active in SA)", "FAA™ Tech Hub", "FAA™ Smart Gadgets", "FAA™ VR/AR Store", "FAA™ AudioTech", "FAA™ Gaming Zone"
    ],
    "DIY & Tools": [
      "FAA™ DIY Essentials (U.S., U.K., but active in SA)", "FAA™ Power Tools (Europe, South Africa)", "FAA™ Home Repair (Global application, but active in SA)", "FAA™ Builders Warehouse", "FAA™ Smart Tools", "FAA™ Home Renovation", "FAA™ Outdoor & Gardening", "FAA™ Camping & Adventure"
    ],
    "Baby & Kids Essentials": [
      "FAA™ Baby Essentials (EU, Japan, but active in SA)", "FAA™ Child Innovation (South Africa, Asia-Pacific)", "FAA™ Kids Hub", "FAA™ Toys & Play", "FAA™ Maternity Care", "FAA™ Learning & Growth", "FAA™ Safe Baby"
    ],
    "Industrial, Construction & Logistics": [
      "FAA Africa Build™", "FAA Smart Logistics™", "FAA PowerTech™", "FAA Transport AI™", "FAA BuilderPro™", "FAA™ Industrial Tools", "FAA™ Hardware Solutions", "FAA™ Construction Gear"
    ],
    "Agriculture, Food Supply & Sustainability": [
      "FAA Agri AI™", "FAA FoodTech™", "FAA Water Solutions™", "FAA Organic Africa™", "FAA FarmBots™"
    ],
    "Culture, Media & Entertainment": [
      "FAA Music Africa™", "FAA Film Africa™", "FAA AfroGaming™", "FAA Digital Arts™", "FAA African Heritage™"
    ],
    "Home Improvement & Decor": [
      "FAA™ HomeTech™", "FAA™ HomeEssentials™", "FAA™ GreenLiving™", "FAA™ DecoPro™", "FAA™ SmartSpaces™", "FAA™ LuxeInteriors™", "FAA™ EcoDesign™"
    ],
    "Health & Medical": [
      "FAA™ MedTech™", "FAA™ HealthGuard™", "FAA™ BioPharma™", "FAA™ MediCare™", "FAA™ PharmaTech™", "FAA™ BioLife™"
    ],
    "Hospitality & Food Services": [
      "FAA™ EcoDining™", "FAA™ FoodieTech™", "FAA™ GourmetPro™", "FAA™ LocalFood™", "FAA™ FreshMeal™", "FAA™ DineSmart™", "FAA™ EcoChef™"
    ]
  },
  "Africa (Pan-African Expansion)": {
    "Agriculture & Sustainability": [
      "FAA Green Africa™", "FAA Renewable Africa™", "FAA Carbon Zero™", "FAA Smart Farming™", "FAA CleanWater™", "FAA™ AgriTech™", "FAA™ FarmPro™", "FAA™ GreenHarvest™", "FAA™ AgroSolutions™", "FAA™ GrowSmart™", "FAA™ HydroTech™"
    ],
    "Infrastructure, Urban Expansion & Construction": [
      "FAA Build Africa™", "FAA Smart Roads™", "FAA Grid Africa™", "FAA Logistics Africa™", "FAA Housing™"
    ],
    "E-Commerce, Digital Trade & FinTech": [
      "FAA Digital Africa™", "FAA Smart Retail™", "FAA FinTech Africa™", "FAA Digital Payments™", "FAA HyperMall Africa™", "FAA™ E-Commerce Solutions Africa", "FAA™ Mobile Money Africa™", "FAA™ Marketplace Africa™", "FAA™ Digital ID Africa™", "FAA™ EcoCities Africa™"
    ],
    "Culture, Gaming & Creative Expansion": [
      "FAA AfroMetaverse™", "FAA Digital Film™", "FAA Gaming Africa™", "FAA AI Music™", "FAA Digital Arts Africa™", "AFRICAN GROOVE GRID™"
    ],
    "Automotive & Transport": [
      "FAA™ AutoTech™", "FAA™ FleetSmart™", "FAA™ TransportAI™", "FAA™ CarPro™", "FAA™ GreenDrive™", "FAA™ RoadTech™"
    ],
    "Health & Medical": [
      "FAA™ MedTech™", "FAA™ HealthGuard™", "FAA™ BioPharma™", "FAA™ MediCare™", "FAA™ PharmaTech™", "FAA™ BioLife™"
    ],
    "Hospitality & Food Services": [
      "FAA™ EcoDining™", "FAA™ FoodieTech™", "FAA™ GourmetPro™", "FAA™ LocalFood™", "FAA™ FreshMeal™", "FAA™ DineSmart™", "FAA™ EcoChef™"
    ],
    "Home Improvement & Decor": [
      "FAA™ HomeTech™", "FAA™ HomeEssentials™", "FAA™ GreenLiving™", "FAA™ DecoPro™", "FAA™ SmartSpaces™", "FAA™ LuxeInteriors™", "FAA™ EcoDesign™"
    ],
    "Industrial & Manufacturing": [
      "FAA™ FactoryTech™", "FAA™ BuildPro™", "FAA™ PowerTech™", "FAA™ IndustrySmart™", "FAA™ WorkGear™", "FAA™ PowerPro™"
    ],
    "Technology, AI & Gadgets": [
      "FAA™ TechGenius™", "FAA™ RoboTech™", "FAA™ SmartGadgets™", "FAA™ AIPro™", "FAA™ DataTech™", "FAA™ VisionTech™", "FAA™ SoundTech™"
    ]
  },
  "Dubai (UAE)": {
    "E-Commerce & Retail": [
      "FAA™ Dubai Commerce Hub", "FAA™ UAE Smart Marketplaces™", "FAA™ Global Dropshipping UAE", "FAA™ AI Payment Solutions UAE", "FAA™ Logistics AI UAE", "FAA™ Luxury Dubai™", "FAA™ Smart Fashion UAE™", "FAA™ Diamond Trade™", "FAA™ Smart Living UAE™", "FAA™ Furniture Hub UAE™", "FAA™ Tech Zone Dubai™", "FAA™ Auto Dubai™", "FAA™ Smart Mobility UAE™", "FAA™ Aviation Trade Dubai™", "FAA™ B2B Trade Dubai™", "FAA™ Hypermarket UAE™", "FAA™ Organic Mart UAE™", "FAA™ Fulfillment Dubai™", "FAA™ Warehousing UAE™", "FAA™ Global Freight UAE™"
    ],
    "Cloud Computing & AI Solutions": [
      "FAA Cloud Dubai", "FAA AI Suite China (active in UAE)"
    ],
    "Financial Systems": [
      "FAA Financial Systems Dubai"
    ],
    "Automotive Solutions": [
      "FAA Automotive Solutions Saudi Arabia (active in UAE)"
    ]
  },
  "Global (General Application / Multiple Regions)": {
    "Core FAA™ System Brands": [
      "FAA™ (Primary Legal Entity & Global Compliance System)", "FAA Inline Compliance™", "FAA Atom-Level Verification™", "FAA Governance Ledger™", "FAA Legal Governance™", "FAA Global Compliance Network™", "FAA Compliance Systems™", "FAA Global Monitoring™", "FAA Financial Systems™", "FAA Blockchain Integration™", "FAA Data Protection™", "FAA AI Compliance™", "FAA Trademark Integrity™", "FAA Global Connectivity™", "FAA™ Quantum Nexus™", "FAA™ Edge AI Execution™", "FAA™ Multi-Layer Data Security™", "FAA™ AI Monitoring & Enforcement™", "FAA™ Quantum Nexus™", "FAA™ QuantumAI™", "FAA™ NeuralNet™", "FAA™ RoboticsAI™", "FAA™ AI Vision™", "FAA™ AI Assist™", "FAA™ PredictiveTech™", "FAA™ Algorithmic Compliance™", "FAA™ AI Fusion™", "FAA™ Cognitive Computing™", "FAA™ Blockchain Governance™", "FAA™ Secure ID™", "FAA™ Risk Center™", "FAA™ Trade Verification™", "FAA™ Digital Currency Systems™", "FAA™ Market Intelligence™", "FAA™ AI-Driven Compliance™", "FAA™ Cyber Resilience™", "FAA™ LegalTech Solutions™", "FAA™ Quantum Security™", "FAA™ Supply Chain Integrity™", "FAA™ Predictive Finance™", "FAA™ AI Trade Bots™", "FAA™ Climate AI™", "FAA™ Deep Learning Systems™", "FAA™ InsurTech™", "FAA™ Smart Cities AI™", "FAA™ IoT Security™", "FAA™ 6G Connectivity™", "FAA™ Green Computing™", "FAA™ Biotech Data™", "FAA™ AI Robotics™", "FAA™ Neuro AI™", "FAA™ Digital Twin Solutions™"
    ]
  }
};

// Google Maps markers data
const mapMarkers = [
  { lat: 36.966428, lng: -95.844032, title: "USA Brands" },
  { lat: 54.633221, lng: -3.432277, title: "UK Brands" },
  { lat: 34.668138, lng: 104.165802, title: "China Brands" },
  { lat: -28.48322, lng: 24.676997, title: "South Africa Brands" },
  { lat: -26.853388, lng: 133.275154, title: "Australia Brands" },
  { lat: 62.393303, lng: -96.818145, title: "Canada Brands" },
  { lat: 36, lng: 138, title: "Japan Brands" },
  { lat: 21, lng: 78, title: "India Brands" },
  { lat: 0.170945, lng: 37.903969, title: "Kenya Brands" },
  { lat: -42, lng: 174, title: "New Zealand Brands" },
  { lat: 46.232193, lng: 2.209667, title: "France Brands" },
  { lat: 51.165707, lng: 10.452764, title: "Germany Brands" },
  { lat: 25.276987, lng: 55.296249, title: "Dubai (UAE) Brands" },
  { lat: -14.242915, lng: -53.189266, title: "Brazil Brands" },
  { lat: 22.216667, lng: 114.166667, title: "Hong Kong Brands" },
  { lat: -38.421295, lng: -63.587402, title: "Argentina Brands" },
  { lat: -22.344029, lng: 24.680158, title: "Botswana Brands" },
  { lat: 52.5200, lng: 13.4050, title: "Berlin (Germany) Brands" },
  { lat: 19.0760, lng: 72.8777, title: "Mumbai (India) Brands" },
  { lat: 48.8566, lng: 2.3522, title: "Paris (France) Brands" },
  { lat: 6.5244, lng: 3.3792, title: "Lagos (Nigeria) Brands" },
  { lat: -1.286389, lng: 36.817223, title: "Nairobi (Kenya) Brands" },
  { lat: 39.9042, lng: 116.4074, title: "Beijing (China) Brands" },
  { lat: 55.7558, lng: 37.6173, title: "Moscow (Russia) Brands" },
  { lat: -34.6037, lng: -58.3816, title: "Buenos Aires (Argentina) Brands" },
  { lat: -23.5505, lng: -46.6333, title: "São Paulo (Brazil) Brands" }
];

interface GoogleMapsProps {
  markers: typeof mapMarkers;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMapsComponent: React.FC<GoogleMapsProps> = ({ markers }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Load Google Maps API if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBPG8dG29cl0TvYRGyLozejGed5Wj5Ab80';
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (mapRef.current && window.google) {
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 2,
          center: { lat: 0, lng: 0 },
          styles: [
            {
              featureType: "all",
              stylers: [{ saturation: -20 }]
            }
          ]
        });

        mapInstanceRef.current = map;

        // Add markers
        markers.forEach(markerData => {
          new window.google.maps.Marker({
            position: { lat: markerData.lat, lng: markerData.lng },
            map: map,
            title: markerData.title,
          });
        });
      }
    }
  }, [markers]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-96 md:h-[600px] rounded-xl shadow-lg"
      data-testid="google-maps"
    />
  );
};

export default function FAAGlobalIndustryIndex() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(faaBrandData);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredData(faaBrandData);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered: typeof faaBrandData = {};

    Object.entries(faaBrandData).forEach(([country, sectors]) => {
      const filteredSectors: typeof sectors = {};
      let hasMatch = false;

      Object.entries(sectors).forEach(([sector, brands]) => {
        const matchingBrands = brands.filter(brand => 
          brand.toLowerCase().includes(query)
        );

        if (matchingBrands.length > 0) {
          filteredSectors[sector] = matchingBrands;
          hasMatch = true;
        }
      });

      if (hasMatch || country.toLowerCase().includes(query)) {
        filtered[country] = hasMatch ? filteredSectors : sectors;
      }
    });

    setFilteredData(filtered);
  }, [searchQuery]);

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">
          {part}
        </span>
      ) : part
    );
  };

  const getSectorIcon = (sector: string) => {
    if (sector.includes('AI') || sector.includes('Tech')) return <Zap className="h-4 w-4" />;
    if (sector.includes('Industrial') || sector.includes('Manufacturing')) return <Factory className="h-4 w-4" />;
    if (sector.includes('Commerce') || sector.includes('Retail')) return <Building className="h-4 w-4" />;
    return <Globe className="h-4 w-4" />;
  };

  const totalBrands = Object.values(faaBrandData).reduce((total, sectors) => 
    total + Object.values(sectors).reduce((sectorTotal, brands) => 
      sectorTotal + brands.length, 0
    ), 0
  );

  const filteredBrands = Object.values(filteredData).reduce((total, sectors) => 
    total + Object.values(sectors).reduce((sectorTotal, brands) => 
      sectorTotal + brands.length, 0
    ), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-blue-900" data-testid="faa-global-industry-index">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8 text-center">
        <h1 className="text-4xl md:text-6xl font-black flex items-center justify-center mb-4">
          <Globe className="h-12 w-12 mr-4" />
          FAA™ Global Industry Index
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-blue-200 mb-4">
          Brands by Country and Sector
        </h2>
        <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto">
          This index showcases the extensive reach of the FAA™ ecosystem, categorizing its 2500+ brands 
          by their primary operational countries and specific industry sectors, reflecting the FAA™'s 
          atom-level structuring and global expansion.
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <Badge variant="secondary" className="bg-blue-600 text-white text-lg px-4 py-2">
            <Building className="h-4 w-4 mr-2" />
            {totalBrands} Total Brands
          </Badge>
          <Badge variant="secondary" className="bg-green-600 text-white text-lg px-4 py-2">
            <Globe className="h-4 w-4 mr-2" />
            {Object.keys(faaBrandData).length} Countries
          </Badge>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Search className="h-6 w-6 mr-3" />
              Brand Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search for brands, countries, or sectors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-lg"
                  data-testid="brand-search-input"
                />
              </div>
              <Button 
                onClick={() => setSearchQuery('')}
                variant="outline"
                data-testid="clear-search-button"
              >
                Clear
              </Button>
            </div>
            {searchQuery && (
              <div className="mt-4 text-sm text-muted-foreground">
                Found {filteredBrands} brands matching "{searchQuery}"
              </div>
            )}
          </CardContent>
        </Card>

        {/* Brands Display */}
        <div className="space-y-8 mb-12">
          {Object.entries(filteredData).map(([country, sectors]) => (
            <Card key={country} className="transform transition-all hover:shadow-xl hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-blue-800 dark:text-blue-300 border-b-2 border-blue-300 dark:border-blue-600 pb-2">
                  <MapPin className="h-8 w-8 mr-3 inline" />
                  {highlightText(country, searchQuery)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(sectors).map(([sector, brands]) => (
                    <div key={`${country}-${sector}`} className="border-l-4 border-blue-400 pl-6">
                      <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        {getSectorIcon(sector)}
                        <span className="ml-2">{highlightText(sector, searchQuery)}</span>
                        <Badge variant="outline" className="ml-2">{brands.length}</Badge>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {brands.map((brand, index) => (
                          <Badge 
                            key={`${country}-${sector}-${index}`}
                            variant="secondary" 
                            className="bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                            data-testid={`brand-${brand.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                          >
                            {highlightText(brand, searchQuery)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Google Maps Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-blue-800 dark:text-blue-300 border-b-2 border-blue-300 dark:border-blue-600 pb-2">
              <MapPin className="h-8 w-8 mr-3 inline" />
              FAA™ Global Presence Map 🗺️
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Interactive map showing FAA™ brand presence across global markets
            </p>
          </CardHeader>
          <CardContent>
            <GoogleMapsComponent markers={mapMarkers} />
          </CardContent>
        </Card>

        {/* No results message */}
        {Object.keys(filteredData).length === 0 && searchQuery && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No brands found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or clear the search to see all brands.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer with legal links */}
      <footer className="py-8 px-6 md:px-12 text-center bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap justify-center mb-4 text-sm space-x-4">
          <a href="https://footer.global.repo.seedwave.faa.zone/privacy.html" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Privacy</a>
          <a href="https://footer.global.repo.seedwave.faa.zone/terms.html" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Terms</a>
          <a href="https://footer.global.repo.seedwave.faa.zone/contact.html" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Contact</a>
          <a href="https://footer.global.repo.seedwave.faa.zone/copyright.html" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Copyright</a>
          <a href="https://footer.global.repo.seedwave.faa.zone/about.html" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">About</a>
        </div>
        <span>© 2025 FAA™ Treaty System™. All Rights Reserved.</span>
        <span className="ml-2">Powered by 🦍 glyphs + Vault API. Synced with Seedwave™.</span>
      </footer>
    </div>
  );
}