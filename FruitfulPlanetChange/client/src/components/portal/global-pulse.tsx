import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Zap, Globe, Sparkles, Activity, Target, Rocket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PulseCanvas {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  animationId: number | null;
}

// Seedwave™ Global Pulse Component - Advanced integration dashboard
export function GlobalPulse() {
  const [brandInsight, setBrandInsight] = useState('');
  const [brandName, setBrandName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pulseCanvases, setPulseCanvases] = useState<Record<string, PulseCanvas>>({});
  
  const heroGridRef = useRef<HTMLDivElement>(null);
  const headerPulseRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Initialize canvas animations
  useEffect(() => {
    initializeCanvases();
    return () => {
      // Cleanup animations on unmount
      Object.values(pulseCanvases).forEach(canvasObj => {
        if (canvasObj.animationId) {
          cancelAnimationFrame(canvasObj.animationId);
        }
      });
    };
  }, []);

  const initializeCanvases = () => {
    const canvasIds = [
      'rhythmic-pulse',
      'concentric-waves',
      'shooting-pulses',
      'particle-grid',
      'radial-bursts',
      'hyperspace-warp'
    ];

    const newCanvases: Record<string, PulseCanvas> = {};

    canvasIds.forEach(id => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        newCanvases[id] = {
          canvas,
          ctx,
          animationId: null
        };
        
        // Set canvas size to match container
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Start appropriate animation
        startPulseAnimation(id, newCanvases[id]);
      }
    });

    // Initialize header pulse
    if (headerPulseRef.current) {
      const canvas = headerPulseRef.current;
      const ctx = canvas.getContext('2d');
      newCanvases['header-pulse'] = {
        canvas,
        ctx,
        animationId: null
      };
      
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      startHeaderPulse(newCanvases['header-pulse']);
    }

    setPulseCanvases(newCanvases);
  };

  const startPulseAnimation = (type: string, canvasObj: PulseCanvas) => {
    if (!canvasObj.ctx || !canvasObj.canvas) return;

    const animate = () => {
      const { ctx, canvas } = canvasObj;
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(10, 10, 13, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw based on type
      switch (type) {
        case 'rhythmic-pulse':
          drawRhythmicPulse(ctx, canvas);
          break;
        case 'concentric-waves':
          drawConcentricWaves(ctx, canvas);
          break;
        case 'shooting-pulses':
          drawShootingPulses(ctx, canvas);
          break;
        case 'particle-grid':
          drawParticleGrid(ctx, canvas);
          break;
        case 'radial-bursts':
          drawRadialBursts(ctx, canvas);
          break;
        case 'hyperspace-warp':
          drawHyperspaceWarp(ctx, canvas);
          break;
      }

      canvasObj.animationId = requestAnimationFrame(animate);
    };

    animate();
  };

  const startHeaderPulse = (canvasObj: PulseCanvas) => {
    if (!canvasObj.ctx || !canvasObj.canvas) return;

    let time = 0;
    const animate = () => {
      const { ctx, canvas } = canvasObj;
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw stock exchange style pulse
      time += 0.05;
      const points = 100;
      const amplitude = 15;
      
      ctx.strokeStyle = '#00e393';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < points; i++) {
        const x = (i / points) * canvas.width;
        const y = canvas.height / 2 + Math.sin(i * 0.1 + time) * amplitude;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      canvasObj.animationId = requestAnimationFrame(animate);
    };

    animate();
  };

  // Simplified animation functions
  const drawRhythmicPulse = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const time = Date.now() * 0.005;
    
    for (let i = 0; i < 3; i++) {
      const radius = 30 + i * 20 + Math.sin(time + i) * 10;
      ctx.strokeStyle = `hsl(${120 + i * 60}, 100%, 60%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawConcentricWaves = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const time = Date.now() * 0.003;
    
    for (let i = 0; i < 5; i++) {
      const radius = (time * 50 + i * 40) % (canvas.width / 2);
      const alpha = 1 - (radius / (canvas.width / 2));
      
      ctx.strokeStyle = `rgba(0, 123, 255, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawShootingPulses = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const time = Date.now() * 0.01;
    
    for (let i = 0; i < 10; i++) {
      const x = ((time + i * 30) % (canvas.width + 50)) - 25;
      const y = canvas.height / 2 + Math.sin(time + i) * 50;
      
      ctx.fillStyle = `hsl(${200 + i * 20}, 100%, 60%)`;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawParticleGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const time = Date.now() * 0.002;
    const gridSize = 30;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        const size = 2 + Math.sin(time + x * 0.01 + y * 0.01) * 2;
        const alpha = 0.3 + Math.sin(time + x * 0.02 + y * 0.02) * 0.3;
        
        ctx.fillStyle = `rgba(255, 100, 150, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawRadialBursts = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const time = Date.now() * 0.008;
    
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const length = 80 + Math.sin(time + i) * 40;
      
      ctx.strokeStyle = `hsl(${300 + i * 20}, 100%, 70%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * length,
        centerY + Math.sin(angle) * length
      );
      ctx.stroke();
    }
  };

  const drawHyperspaceWarp = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const time = Date.now() * 0.003;
    const gridSpacing = 25;
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 + Math.sin(time) * 0.3})`;
    ctx.lineWidth = 1.5;
    
    // Horizontal lines
    for (let y = 0; y < canvas.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y + Math.sin(time + y * 0.03) * 20);
      ctx.lineTo(canvas.width, y + Math.sin(time + y * 0.03) * 20);
      ctx.stroke();
    }
    
    // Vertical lines
    for (let x = 0; x < canvas.width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(time + x * 0.03) * 20, 0);
      ctx.lineTo(x + Math.cos(time + x * 0.03) * 20, canvas.height);
      ctx.stroke();
    }
  };

  const handleGenerateBrandInsight = async () => {
    if (!brandName.trim()) {
      toast({
        title: "Please enter a brand name",
        description: "Enter a brand name to generate insights.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI insight generation (in real app would use Gemini API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const insights = [
        `${brandName}™ - "Innovating Beyond Tomorrow's Horizon"`,
        `Strategic positioning: Premium technology integration with sustainable practices`,
        `Target market: Forward-thinking enterprises seeking next-generation solutions`,
        `Core value proposition: Seamless ecosystem integration with measurable ROI`,
        `Brand differentiator: AI-powered automation with human-centric design philosophy`
      ];
      
      setBrandInsight(insights.join('\n\n'));
      
      toast({
        title: "Brand insights generated successfully",
        description: `Generated comprehensive insights for ${brandName}™`,
      });
    } catch (error) {
      toast({
        title: "Failed to generate insights",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Pulse Animation */}
      <Card className="border-2 border-green-500/20 bg-gradient-to-r from-gray-900 to-black text-white">
        <CardHeader className="text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5" />
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">Fruitful™</span>
                <span className="text-gray-300">|</span>
                <span className="text-2xl font-bold">Seedwave™</span>
              </div>
              <canvas 
                ref={headerPulseRef}
                className="ml-6 h-10 w-96"
                style={{ maxWidth: '400px' }}
              />
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Seedwave™: The Global Pulse
            </CardTitle>
            <CardDescription className="text-xl text-gray-300 mt-4">
              *Integrating beyond what the word has witnessed as yet.* We orchestrate the future of innovation, 
              from digital enterprises to groundbreaking non-digital ventures, with atomic precision and global reach.
            </CardDescription>
            <Button className="mt-6 bg-white text-black hover:bg-gray-100 font-bold px-8 py-3 rounded-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Discover the Future
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Hero Pulse Grid */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div ref={heroGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-96">
            <div className="bg-gray-800 rounded-lg border border-gray-600 relative overflow-hidden">
              <canvas id="rhythmic-pulse" className="w-full h-full" />
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-600 relative overflow-hidden">
              <canvas id="concentric-waves" className="w-full h-full" />
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-600 relative overflow-hidden">
              <canvas id="shooting-pulses" className="w-full h-full" />
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-600 relative overflow-hidden">
              <canvas id="particle-grid" className="w-full h-full" />
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-600 relative overflow-hidden">
              <canvas id="radial-bursts" className="w-full h-full" />
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-600 relative overflow-hidden">
              <canvas id="hyperspace-warp" className="w-full h-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operational Pillars */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Our Operational Pillars: Beyond Conventional Integration</CardTitle>
          <CardDescription className="text-lg max-w-4xl mx-auto">
            Seedwave's operational philosophy transcends traditional boundaries, focusing on seamless, 
            intuitive integration across all phases of enterprise development. We automate the unseen, 
            build the impossible, and deploy with a global consciousness.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Target className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h3 className="text-2xl font-bold">Auto Design</h3>
                <p className="text-muted-foreground mt-2">
                  AI-powered design systems that understand intent and create optimized solutions
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Activity className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-2xl font-bold">Auto Build</h3>
                <p className="text-muted-foreground mt-2">
                  Automated construction pipelines with intelligent error correction and optimization
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Rocket className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                <h3 className="text-2xl font-bold">Auto Deploy</h3>
                <p className="text-muted-foreground mt-2">
                  Global deployment with real-time monitoring and autonomous scaling capabilities
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Master License Brands */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Seedwave™ Global Master License Brands</CardTitle>
          <CardDescription className="text-lg max-w-4xl mx-auto">
            Our portfolio embodies a new epoch of integrated ventures, where each brand is a self-aware node 
            in a larger, evolving consciousness, transcending traditional market boundaries and resonating 
            with the very pulse of global transformation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Art Typography */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <pre className="text-sm font-mono text-left leading-relaxed">
{`Seedwave™:
    The Nexus.
      A Portfolio of Innovation.
        Digital Enterprises, and so much more...
          Beyond physical and meta-physical divides.
            Groundbreaking Non-Digital Ventures.
              Cultivating Tomorrow, and the Unseen.
                Rapid Deployments, touching every dimension.
                  Global Repositories, weaving universal truths.
                    Tangible Presence, yet formless essence.
                      The Pulse of Expansion, echoing through existence.
                        Across All Frontiers, and beyond time.
                          Every Brand, A Node, a conscious entity.
                            Driving Collective Impact, a symphony of being.
                              Integrating beyond what the word has witnessed as yet.`}
            </pre>
          </div>

          {/* Master Brand Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a 
              href="https://samfox.faa.zone" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg text-center hover:shadow-xl transition-all transform hover:scale-105"
            >
              <h3 className="text-2xl font-bold">Samfox™</h3>
              <ExternalLink className="w-5 h-5 mx-auto mt-2 opacity-70" />
            </a>
            <a 
              href="https://seedwave.faa.zone" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg text-center hover:shadow-xl transition-all transform hover:scale-105"
            >
              <h3 className="text-2xl font-bold">Seedwave™</h3>
              <ExternalLink className="w-5 h-5 mx-auto mt-2 opacity-70" />
            </a>
            <a 
              href="https://faa.zone/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-8 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg text-center hover:shadow-xl transition-all transform hover:scale-105"
            >
              <h3 className="text-2xl font-bold">FAA.ZONE™</h3>
              <ExternalLink className="w-5 h-5 mx-auto mt-2 opacity-70" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Brand Insight Generator */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Brand Insight Generator
          </CardTitle>
          <CardDescription>
            Enter a brand name to generate a marketing slogan and strategic insight, powered by advanced AI analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-2xl mx-auto space-y-6">
          <div className="flex gap-4">
            <Input
              placeholder="e.g., HarmonyHearth™"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleGenerateBrandInsight}
              disabled={isGenerating}
              className="px-6"
            >
              {isGenerating ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Insight
                </>
              )}
            </Button>
          </div>
          
          <div className="min-h-[200px] p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            {brandInsight ? (
              <pre className="whitespace-pre-wrap text-sm">{brandInsight}</pre>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Insights will appear here.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Global Pulse Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Seedwave™ Core', status: 'active', integration: 'Auto Design & Build' },
              { name: 'Samfox™ Network', status: 'active', integration: 'AI Brand Insights' },
              { name: 'FAA.ZONE™ Portal', status: 'active', integration: 'Global Deployment' },
              { name: 'Pulse Analytics', status: 'active', integration: 'Real-time Monitoring' }
            ].map((service) => (
              <div key={service.name} className="text-center p-4 border rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                <div className="font-semibold text-sm">{service.name}</div>
                <div className="text-xs text-muted-foreground">{service.integration}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}