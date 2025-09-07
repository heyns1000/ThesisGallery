import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Users, 
  TrendingUp, 
  MapPin, 
  BarChart3, 
  Database,
  Building2,
  Target,
  Search,
  Shield
} from 'lucide-react';

export default function FAARealestatePlatform() {
  const userPersonasChartRef = useRef<HTMLCanvasElement>(null);
  const provincialDensityChartRef = useRef<HTMLCanvasElement>(null);
  const landTenureChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load Chart.js dynamically
    const loadChartJS = async () => {
      if (typeof window !== 'undefined' && window.Chart) {
        initializeCharts();
        return;
      }

      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
          setTimeout(initializeCharts, 100);
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load Chart.js:', error);
      }
    };

    const initializeCharts = () => {
      if (!window.Chart) return;

      const energeticPlayfulPalette = {
        red: '#FF6B6B',
        yellow: '#FFD166',
        green: '#06D6A0',
        blue: '#118AB2',
        dark: '#073B4C'
      };

      // User Personas Chart
      if (userPersonasChartRef.current) {
        const ctx1 = userPersonasChartRef.current.getContext('2d');
        if (ctx1) {
          new window.Chart(ctx1, {
            type: 'doughnut',
            data: {
              labels: ['First-Time Buyers', 'Property Investors', 'Relocators', 'Rural Self-Builders'],
              datasets: [{
                data: [35, 25, 20, 20],
                backgroundColor: [
                  energeticPlayfulPalette.blue,
                  energeticPlayfulPalette.green,
                  energeticPlayfulPalette.yellow,
                  energeticPlayfulPalette.red
                ],
                borderWidth: 3,
                borderColor: '#ffffff'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: { size: 12, weight: '600' }
                  }
                }
              }
            }
          });
        }
      }

      // Provincial Density Chart
      if (provincialDensityChartRef.current) {
        const ctx2 = provincialDensityChartRef.current.getContext('2d');
        if (ctx2) {
          new window.Chart(ctx2, {
            type: 'bar',
            data: {
              labels: ['Gauteng', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape', 'Limpopo'],
              datasets: [{
                label: 'People per Household',
                data: [3.2, 3.8, 3.1, 4.2, 4.5],
                backgroundColor: energeticPlayfulPalette.blue,
                borderRadius: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 5,
                  ticks: { font: { size: 11 } }
                },
                x: {
                  ticks: { 
                    font: { size: 10 },
                    maxRotation: 45
                  }
                }
              },
              plugins: {
                legend: { display: false }
              }
            }
          });
        }
      }

      // Land Tenure Chart
      if (landTenureChartRef.current) {
        const ctx3 = landTenureChartRef.current.getContext('2d');
        if (ctx3) {
          new window.Chart(ctx3, {
            type: 'pie',
            data: {
              labels: ['Formal Title Deed', 'Informal/Squatter', 'Communal/Traditional', 'RDP/Government'],
              datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                  energeticPlayfulPalette.green,
                  energeticPlayfulPalette.red,
                  energeticPlayfulPalette.yellow,
                  energeticPlayfulPalette.blue
                ],
                borderWidth: 3,
                borderColor: '#ffffff'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 15,
                    usePointStyle: true,
                    font: { size: 11, weight: '600' }
                  }
                }
              }
            }
          });
        }
      }
    };

    loadChartJS();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900" data-testid="faa-realestate-platform">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-blue-900 text-white p-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black">FAA Real Estate AI™</h1>
        <p className="mt-2 text-lg md:text-xl text-yellow-300">Revolutionizing Property Intelligence in South Africa</p>
        <div className="mt-4 flex justify-center space-x-2">
          <Badge variant="secondary" className="bg-green-600 text-white">
            <Shield className="h-3 w-3 mr-1" />
            FAA Certified
          </Badge>
          <Badge variant="secondary" className="bg-blue-600 text-white">
            <Database className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
      </div>

      <main className="container mx-auto p-4 md:p-8 space-y-12">
        
        {/* Introduction Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">Bridging the Information Gap</h2>
          <p className="max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            The South African property market has long been divided. FAA Real Estate AI™ dismantles this information asymmetry, 
            delivering professional-grade analytics and strategic guidance to everyone, from first-time buyers in cities to 
            self-builders in rural communities. We provide clarity in a complex market.
          </p>
        </section>

        {/* Technology Architecture */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center">
              <Building2 className="h-8 w-8 mr-3 text-blue-600" />
              A Powerhouse of Technology
            </CardTitle>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Our platform is built on a modern, robust, and scalable architecture designed for speed, 
              reliability, and end-to-end type safety.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Frontend</h3>
                  <p className="text-sm">React, TypeScript, Shadcn/ui, Tailwind CSS, Chart.js</p>
                </CardContent>
              </Card>
              
              <div className="hidden md:flex justify-center">
                <div className="w-2 h-16 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"></div>
              </div>
              
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Backend</h3>
                  <p className="text-sm">Node.js, Express, TypeScript, RESTful API</p>
                </CardContent>
              </Card>
              
              <div className="md:col-span-3 flex justify-center">
                <div className="w-16 h-2 md:w-2 md:h-16 bg-gradient-to-r md:bg-gradient-to-b from-green-500 to-red-500 rounded-full"></div>
              </div>
              
              <div className="md:col-span-3 flex justify-center">
                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white max-w-md">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-2">Data & Storage</h3>
                    <p className="text-sm">PostgreSQL, Neon DB, Drizzle ORM, Zod Validation</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Personas Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center flex items-center justify-center">
                <Users className="h-8 w-8 mr-3 text-blue-600" />
                Serving All South Africans
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Our platform is meticulously designed to cater to the unique needs of a diverse range of users 
                across the South African property landscape.
              </p>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <canvas ref={userPersonasChartRef} data-testid="user-personas-chart"></canvas>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-blue-600 flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  First-Time Buyers
                </h3>
                <p className="text-muted-foreground">Simplifying the journey to homeownership with clear valuations and market forecasts.</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-green-600 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Property Investors
                </h3>
                <p className="text-muted-foreground">Unlocking opportunities with intelligent analytics and data-driven risk assessment.</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-yellow-600 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Relocators
                </h3>
                <p className="text-muted-foreground">Providing deep provincial and local insights for confident decision-making.</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-red-600 flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Rural Self-Builders
                </h3>
                <p className="text-muted-foreground">Empowering development with specialized tools for LSM 3-7 markets and informal land tenure.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Kasi Market Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Deep Dive: The South African 'Kasi' Market</CardTitle>
            <p className="text-center text-muted-foreground max-w-3xl mx-auto">
              We go where others don't. Our platform provides unprecedented insights into the peri-urban and rural property markets, 
              acknowledging the diverse reality of land ownership and housing in South Africa.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-center mb-4 text-blue-600">Average Household Density by Province</h3>
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Understanding population density is key to valuing property in diverse areas. Our data models account for 
                  these provincial variations, especially in high-density informal settlements.
                </p>
                <div className="w-full h-80">
                  <canvas ref={provincialDensityChartRef} data-testid="provincial-density-chart"></canvas>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-center mb-4 text-green-600">Land Tenure in Target Markets (LSM 3-7)</h3>
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Property in South Africa isn't just about formal deeds. We support formal, informal, and communal land tenure 
                  structures, reflecting the on-the-ground reality for millions.
                </p>
                <div className="w-full h-80">
                  <canvas ref={landTenureChartRef} data-testid="land-tenure-chart"></canvas>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Ecosystem */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center">
              <Database className="h-8 w-8 mr-3 text-blue-600" />
              The Data Ecosystem: Connecting the Dots
            </CardTitle>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Our intelligence is powered by a network of planned integrations with key data providers, 
              ensuring comprehensive, accurate, and real-time insights.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardContent className="p-4">
                  <p className="font-bold text-blue-600">Lightstone</p>
                  <p className="text-xs text-muted-foreground">AI Valuations</p>
                </CardContent>
              </Card>
              
              <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardContent className="p-4">
                  <p className="font-bold text-green-600">Deeds Office</p>
                  <p className="text-xs text-muted-foreground">Ownership Verification</p>
                </CardContent>
              </Card>
              
              <Card className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
                <CardContent className="p-4">
                  <p className="font-bold text-yellow-600">SA Banks</p>
                  <p className="text-xs text-muted-foreground">(Nedbank, Absa)</p>
                </CardContent>
              </Card>
              
              <Card className="text-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                <CardContent className="p-4">
                  <p className="font-bold text-red-600">DataFiniti</p>
                  <p className="text-xs text-muted-foreground">Property Listings</p>
                </CardContent>
              </Card>
              
              <Card className="text-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20 col-span-2 md:col-span-1">
                <CardContent className="p-4">
                  <p className="font-bold text-slate-600">Microfinance</p>
                  <p className="text-xs text-muted-foreground">(NHFC)</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Research Roadmap */}
        <Card className="bg-gradient-to-br from-slate-800 to-blue-900 text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-white">Our Research Roadmap: Building the Future</CardTitle>
            <p className="text-center text-slate-300 max-w-2xl mx-auto">
              Our commitment to data excellence is ongoing. We are executing a multi-phase research plan to build the most 
              comprehensive picture of the South African township and rural property market ever created.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-4 h-4 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-xl text-yellow-300">Phase 2: Housing & LSM Mapping</h3>
                  <p className="text-slate-300">Detailed analysis of housing sizes, rooms, and LSM bases across 1000+ locations.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-xl text-yellow-300">Phase 3: Local Market Dynamics</h3>
                  <p className="text-slate-300">Identifying and mapping independent, visionary property entrepreneurs and traders in every township.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-xl text-yellow-300">Phase 4: Building & Design Preferences</h3>
                  <p className="text-slate-300">Researching building styles, roofing architecture, and material preferences unique to local markets.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-xl text-yellow-300">Phase 5 & 6: Retail Spend & BOQ</h3>
                  <p className="text-slate-300">Establishing household budgets for hardware and creating atom-level Bill of Quantities (BOQ) for typical housing models.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="w-4 h-4 bg-slate-500 rounded-full mt-1 flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-xl text-yellow-300">Phase 7 & 8: Growth & Renovation</h3>
                  <p className="text-slate-300">Determining growth in renovations, restyling, and the integration of modern living standards.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Features Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
              <Target className="h-7 w-7 mr-3 text-blue-600" />
              Platform Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Search className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">AI Property Valuations</p>
                  <p className="text-xs text-muted-foreground">Advanced ML algorithms</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <MapPin className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Provincial Analysis</p>
                  <p className="text-xs text-muted-foreground">9-province coverage</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <BarChart3 className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Market Insights</p>
                  <p className="text-xs text-muted-foreground">Real-time analytics</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}