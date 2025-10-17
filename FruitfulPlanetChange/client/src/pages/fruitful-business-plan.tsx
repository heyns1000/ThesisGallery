import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  Target,
  Globe,
  Users,
  DollarSign,
  FileText,
  Download,
  Calendar,
  BarChart3,
  MapPin,
  Sparkles,
  Handshake,
  Trophy,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function FruitfulBusinessPlan() {
  const keyMetrics = [
    { label: 'Projected Revenue', value: 'R391M', icon: <DollarSign className="w-6 h-6" />, color: 'text-green-500' },
    { label: 'Target Markets', value: '35+', icon: <Globe className="w-6 h-6" />, color: 'text-blue-500' },
    { label: 'Youth Demographic', value: '16-35', icon: <Users className="w-6 h-6" />, color: 'text-purple-500' },
    { label: 'Market Value', value: '$3B', icon: <TrendingUp className="w-6 h-6" />, color: 'text-orange-500' }
  ];

  const businessPillars = [
    {
      title: 'Crate Dance Showcase',
      description: 'Premier global youth culture platform celebrating street dance and creativity',
      icon: <Trophy className="w-8 h-8" />,
      metrics: { events: '50+', cities: '25', participants: '10K+' },
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Sponsorship Ecosystem',
      description: 'Multi-layered partnerships with global brands like Red Bull, Nike, Coca-Cola',
      icon: <Handshake className="w-8 h-8" />,
      metrics: { sponsors: '15+', tiers: '3', roi: '340%' },
      color: 'from-blue-500 to-purple-500'
    },
    {
      title: 'Community Impact',
      description: 'Empowering local economies and fostering talent development worldwide',
      icon: <Heart className="w-8 h-8" />,
      metrics: { communities: '100+', jobs: '2.5K', impact: 'High' },
      color: 'from-pink-500 to-purple-500'
    },
    {
      title: 'Franchise Model',
      description: 'Scalable operations enabling global expansion and local partnerships',
      icon: <Globe className="w-8 h-8" />,
      metrics: { regions: '12', licenses: '50+', growth: '200%' },
      color: 'from-green-500 to-teal-500'
    }
  ];

  const revenueStreams = [
    { name: 'Sponsorship Packages', value: 45, amount: 'R175.95M' },
    { name: 'Ticket Sales', value: 25, amount: 'R97.75M' },
    { name: 'Merchandising', value: 15, amount: 'R58.65M' },
    { name: 'Franchise Licensing', value: 10, amount: 'R39.1M' },
    { name: 'Digital Content', value: 5, amount: 'R19.55M' }
  ];

  const implementationPhases = [
    {
      phase: 'Phase 1',
      title: 'Foundation & Launch',
      timeline: 'Q1-Q2 2025',
      progress: 75,
      status: 'In Progress',
      objectives: ['Secure initial sponsorships', 'Establish core team', 'Launch pilot events']
    },
    {
      phase: 'Phase 2',
      title: 'Regional Expansion',
      timeline: 'Q3-Q4 2025',
      progress: 30,
      status: 'Planning',
      objectives: ['Scale to 5 major cities', 'Develop franchise model', 'Digital platform launch']
    },
    {
      phase: 'Phase 3',
      title: 'Global Reach',
      timeline: 'Q1-Q2 2026',
      progress: 10,
      status: 'Roadmap',
      objectives: ['International expansion', 'Strategic partnerships', 'Technology integration']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-red-400/20 to-pink-400/20 dark:from-orange-600/30 dark:via-red-600/30 dark:to-pink-600/30" />
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                  Fruitful Holdings
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">Crate Dance Showcase Business Plan</p>
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              A comprehensive strategy for establishing the Crate Dance Showcase as a premier global youth culture platform 
              with projected R391 million revenue through innovative sponsorship models and community-driven initiatives.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-6 flex-wrap mb-8"
            >
              <Badge className="px-6 py-3 text-lg bg-orange-500/20 text-orange-600 border-orange-500/30">
                <TrendingUp className="w-5 h-5 mr-2" />
                R391M Revenue Target
              </Badge>
              <Badge className="px-6 py-3 text-lg bg-red-500/20 text-red-600 border-red-500/30">
                <Globe className="w-5 h-5 mr-2" />
                Global Expansion
              </Badge>
              <Badge className="px-6 py-3 text-lg bg-pink-500/20 text-pink-600 border-pink-500/30">
                <Users className="w-5 h-5 mr-2" />
                Youth Culture Focus
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button 
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300"
                onClick={() => window.open('/legal-docs/Change_1753063971221.docx', '_blank')}
              >
                <Download className="w-6 h-6 mr-3" />
                Download Full Business Plan
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 lg:w-[800px] mx-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="strategy" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Strategy
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Revenue Model
            </TabsTrigger>
            <TabsTrigger value="implementation" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Implementation
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Impact
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="text-center hover:shadow-lg transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className={`inline-flex p-3 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 ${metric.color}`}>
                        {metric.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{metric.value}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{metric.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {businessPillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className={`h-2 bg-gradient-to-r ${pillar.color}`} />
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${pillar.color} text-white`}>
                          {pillar.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{pillar.title}</CardTitle>
                          <p className="text-gray-600 dark:text-gray-300 mt-2">{pillar.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        {Object.entries(pillar.metrics).map(([key, value]) => (
                          <div key={key}>
                            <div className="text-lg font-bold">{value}</div>
                            <div className="text-sm text-gray-500 capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Strategy */}
          <TabsContent value="strategy" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Strategic Framework</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our comprehensive approach to establishing the Crate Dance Showcase as the premier global youth culture platform
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-orange-500" />
                    Vision & Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Vision</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      To establish the Crate Dance Showcase as a world-renowned platform that celebrates the vibrancy 
                      of youth culture, promotes creative expression, and empowers communities through dance, music, and innovation.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Mission</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Transforming the landscape of youth culture by providing opportunities, fostering partnerships, 
                      promoting sustainability, and driving innovation across global communities.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-red-500" />
                    Target Audience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Primary Audience</h4>
                    <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Youth aged 16-35 passionate about street culture</li>
                      <li>• Emerging artists, dancers, and choreographers</li>
                      <li>• Socially conscious individuals interested in community empowerment</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Secondary Audience</h4>
                    <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Corporate sponsors and brand partners</li>
                      <li>• Media organizations and content creators</li>
                      <li>• Families and community stakeholders</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Model */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Revenue Breakdown</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Diversified revenue streams targeting R391 million through strategic partnerships and operations
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {revenueStreams.map((stream, index) => (
                    <div key={stream.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{stream.name}</span>
                        <span className="text-orange-600 font-bold">{stream.amount}</span>
                      </div>
                      <Progress value={stream.value} className="h-2" />
                      <div className="text-sm text-gray-500">{stream.value}% of total revenue</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Financial Highlights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">R391M</div>
                    <div className="text-gray-600 dark:text-gray-300">Projected Total Revenue</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">340%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">ROI Growth</div>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">$3B</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Market Value</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Revenue Drivers</h4>
                    <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Multi-tier sponsorship packages</li>
                      <li>• Global franchise licensing</li>
                      <li>• Premium event experiences</li>
                      <li>• Digital content monetization</li>
                      <li>• Merchandise and brand collaborations</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Implementation */}
          <TabsContent value="implementation" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Implementation Roadmap</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Structured approach to scaling the Crate Dance Showcase from local to global presence
              </p>
            </div>

            <div className="space-y-6">
              {implementationPhases.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="flex-shrink-0">
                          <div className={`
                            w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold
                            ${phase.status === 'In Progress' ? 'bg-orange-500 text-white' :
                              phase.status === 'Planning' ? 'bg-blue-500 text-white' :
                              'bg-gray-500 text-white'}
                          `}>
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold">{phase.title}</h3>
                              <p className="text-gray-600 dark:text-gray-300">{phase.timeline}</p>
                            </div>
                            <Badge variant="outline">{phase.status}</Badge>
                          </div>
                          <div className="mb-4">
                            <div className="flex items-center gap-4 mb-2">
                              <span className="text-sm font-medium">Progress</span>
                              <span className="text-sm text-gray-500">{phase.progress}%</span>
                            </div>
                            <Progress value={phase.progress} className="h-2" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Key Objectives:</h4>
                            <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                              {phase.objectives.map((objective, i) => (
                                <li key={i}>• {objective}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Impact */}
          <TabsContent value="impact" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Community Impact & Sustainability</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Creating lasting positive change through youth empowerment, economic development, and cultural celebration
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex p-4 bg-orange-100 dark:bg-orange-900/20 rounded-full mb-4">
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Community Empowerment</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Providing platforms for talent development and creative expression across diverse communities
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Communities Reached</span>
                      <span className="font-bold">100+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Participants</span>
                      <span className="font-bold">10,000+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex p-4 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Economic Development</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Stimulating local economies through job creation, vendor partnerships, and tourism
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Jobs Created</span>
                      <span className="font-bold">2,500+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Local Partnerships</span>
                      <span className="font-bold">250+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Cultural Innovation</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Celebrating diversity and fostering cross-cultural collaboration through artistic expression
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Cultural Events</span>
                      <span className="font-bold">50+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cities Worldwide</span>
                      <span className="font-bold">25+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Sustainability Commitment</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
                  The Crate Dance Showcase is committed to environmental responsibility and social sustainability, 
                  implementing eco-friendly practices and supporting long-term community development initiatives.
                </p>
                <div className="flex justify-center gap-6 flex-wrap">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">Carbon Neutral</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Event Operations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">Zero Waste</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Goal by 2026</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">100%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Local Sourcing</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}