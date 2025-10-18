import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Code2, Layers, Zap, Rocket, Upload, Clock, MapPin, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HotStackPlatform() {
  const [countdown, setCountdown] = useState(180);
  const [isDragging, setIsDragging] = useState(false);
  const [statusLogs, setStatusLogs] = useState([
    { time: new Date().toLocaleTimeString(), message: "HotStack™ System Online", type: "success" },
    { time: new Date().toLocaleTimeString(), message: "Monitoring 67 Replit apps via Noodle Juice", type: "info" },
    { time: new Date().toLocaleTimeString(), message: "Vault allocation system ready", type: "info" },
    { time: new Date().toLocaleTimeString(), message: "Nationwide stations: 6 locations", type: "info" },
    { time: new Date().toLocaleTimeString(), message: "Referral system active", type: "info" },
    { time: new Date().toLocaleTimeString(), message: "Omnidrop zone initialized", type: "info" },
    { time: new Date().toLocaleTimeString(), message: "Ready for digital presence deployment", type: "warning" },
  ]);
  
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          return 180;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const addStatusLog = (message: string, type: "success" | "info" | "warning" | "error" = "info") => {
    const newLog = {
      time: new Date().toLocaleTimeString(),
      message,
      type
    };
    setStatusLogs((prev) => [...prev.slice(-9), newLog]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      addStatusLog(`📂 Processing ${files.length} file(s) for Omnidrop...`, "info");
      setTimeout(() => {
        addStatusLog("⚡ Rapid deployment initiated", "warning");
        addStatusLog("🔗 DNS hooks activated", "success");
        addStatusLog("✅ Omnidrop complete - Site live in 180 seconds", "success");
        toast({
          title: "Omnidrop Initiated!",
          description: `"${files[0].name}" is being deployed to CodeNest™`,
        });
      }, 1000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      addStatusLog(`📂 File "${files[0].name}" uploaded for Omnidrop`, "info");
      setTimeout(() => {
        addStatusLog("⚡ Processing rapid deployment", "warning");
        toast({
          title: "File Uploaded",
          description: "Your file is being processed for deployment",
        });
      }, 500);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText("https://replit.com/refer/heynsschoeman");
    addStatusLog("📋 Referral link copied to clipboard", "success");
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const hotstackStations = [
    { name: "Cape Town HotStack", location: "Western Cape Digital Gateway", status: "ACTIVE", statusColor: "bg-green-600" },
    { name: "Johannesburg HotStack", location: "Gauteng Business Hub", status: "ACTIVE", statusColor: "bg-green-600" },
    { name: "Durban HotStack", location: "KwaZulu-Natal Port", status: "SETUP", statusColor: "bg-yellow-600" },
    { name: "Bloemfontein HotStack", location: "Free State Central", status: "SETUP", statusColor: "bg-yellow-600" },
    { name: "Polokwane HotStack", location: "Limpopo Gateway", status: "PLANNED", statusColor: "bg-gray-600" },
    { name: "Lesotho HotStack", location: "Mountain Kingdom", status: "SPECIAL", statusColor: "bg-blue-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Section */}
        <Card className="border-2 border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <Zap className="h-10 w-10 text-white" data-testid="icon-hotstack-hero" />
              </div>
            </div>
            <CardTitle className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Fruitful | HotStack™
            </CardTitle>
            <CardDescription className="text-xl mt-3 text-gray-300">
              Omnidrop Your Digital Presence. Live in Minutes. Branded Forever.
            </CardDescription>
            <div className="flex justify-center gap-3 mt-4 flex-wrap">
              <Badge variant="outline" className="border-yellow-500 text-yellow-400 text-sm" data-testid="badge-cloudflare">
                🚀 Cloudflare Powered
              </Badge>
              <Badge variant="outline" className="border-orange-500 text-orange-400 text-sm" data-testid="badge-workers">
                ⚡ Workers Ready
              </Badge>
              <Badge variant="outline" className="border-green-500 text-green-400 text-sm" data-testid="badge-treaty">
                🔒 Treaty-Linked
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Countdown Timer */}
        <Card className="bg-black/50 border-yellow-500/30 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-6 w-6 text-yellow-400" />
                <h3 className="text-lg font-semibold text-gray-300">Omnidrop Window</h3>
              </div>
              <div 
                className="text-7xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2 font-mono"
                data-testid="text-countdown"
              >
                {formatTime(countdown)}
              </div>
              <p className="text-sm text-gray-400">Time remaining for instant deployment</p>
            </div>
          </CardContent>
        </Card>

        {/* Activation Features */}
        <Card className="bg-black/50 border-yellow-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-yellow-400">What Your Omnidrop Activates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg hover:bg-yellow-500/20 transition-colors" data-testid="feature-rapid-deployment">
              <Zap className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Rapid Deployment</p>
                <p className="text-sm text-gray-400">Your Scroll goes Live in under 180 seconds via Omnidrop Signal.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg hover:bg-yellow-500/20 transition-colors" data-testid="feature-integrated-ecosystem">
              <Layers className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Integrated Ecosystem</p>
                <p className="text-sm text-gray-400">Auto DNS Hook + Curated Template Packs for seamless launch.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg hover:bg-yellow-500/20 transition-colors" data-testid="feature-intelligent-foundation">
              <Code2 className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Intelligent Foundation</p>
                <p className="text-sm text-gray-400">Powered by ScrollStack™, VaultDNS™, and MeshNest™ protocols.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg hover:bg-yellow-500/20 transition-colors" data-testid="feature-treaty-linked">
              <Rocket className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Treaty-Linked Economy</p>
                <p className="text-sm text-gray-400">Includes a Royalty-Linked License from Fruitful Global's Treaty Grid.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg hover:bg-yellow-500/20 transition-colors" data-testid="feature-claimroot">
              <Activity className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">ClaimRoot™ Verified</p>
                <p className="text-sm text-gray-400">Secure, traceable site ownership for every deployed scroll.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Omnidrop Zone */}
        <Card className="bg-black/50 border-yellow-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-yellow-400">Omnidrop Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                isDragging 
                  ? 'border-orange-400 bg-orange-500/20 scale-105' 
                  : 'border-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/10'
              }`}
              data-testid="drop-zone-omnidrop"
            >
              <Upload className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-xl font-semibold mb-2 text-yellow-400">Drag & Drop HTML/PDF here</h3>
              <p className="text-gray-400 mb-4">or click to upload</p>
              <p className="text-sm text-gray-500 mb-4">(Adheres to the 3-minute rule for rapid ingestion)</p>
              <Input
                type="file"
                accept=".html,.pdf"
                onChange={handleFileUpload}
                className="max-w-xs mx-auto cursor-pointer"
                data-testid="input-file-upload"
              />
            </div>
            <div className="mt-6 text-center">
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-6 text-lg" data-testid="button-enter-codenest">
                → Enter Fruitful | CodeNest™
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Nationwide HotStack Stations */}
        <Card className="bg-black/50 border-yellow-500/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-6 w-6 text-yellow-400" />
              <CardTitle className="text-2xl text-center text-yellow-400">Nationwide HotStack Stations</CardTitle>
            </div>
            <CardDescription className="text-center text-gray-400">
              Your digital filling stations across the country
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotstackStations.map((station, index) => (
                <div
                  key={index}
                  className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 hover:bg-yellow-500/20 hover:scale-105 transition-all"
                  data-testid={`station-card-${index}`}
                >
                  <h3 className="font-bold text-yellow-400 mb-1">🏢 {station.name}</h3>
                  <p className="text-sm text-gray-300 mb-3">{station.location}</p>
                  <div className="flex justify-between items-center">
                    <Badge className={`${station.statusColor} text-white text-xs`}>
                      {station.status}
                    </Badge>
                    <Button 
                      size="sm" 
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      disabled={station.status === "PLANNED"}
                      onClick={() => addStatusLog(`🔌 Connecting to ${station.name}...`, "info")}
                      data-testid={`button-connect-${index}`}
                    >
                      {station.status === "PLANNED" ? "Soon" : "Connect"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Noodle Juice Integration */}
        <Card className="bg-black/50 border-yellow-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-yellow-400">🍝 Noodle Juice Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 p-6 rounded-lg text-center border border-yellow-500/20">
                <h3 className="font-bold text-yellow-400 mb-4">📱 Your 67 Replit Apps</h3>
                <div className="text-5xl font-bold text-green-400 mb-2" data-testid="text-apps-counter">67</div>
                <p className="text-sm text-gray-400 mb-4">Private Apps Flowing</p>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" data-testid="button-view-apps">
                  View All Apps
                </Button>
              </div>
              <div className="bg-gray-900/50 p-6 rounded-lg text-center border border-yellow-500/20">
                <h3 className="font-bold text-yellow-400 mb-4">🔗 Referral System</h3>
                <p className="text-xs text-gray-400 mb-2">Your Replit Referral:</p>
                <div className="bg-black p-3 rounded text-xs font-mono text-yellow-400 mb-4 break-all">
                  replit.com/refer/heynsschoeman
                </div>
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  onClick={copyReferralLink}
                  data-testid="button-copy-referral"
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Status Console */}
        <Card className="bg-black/50 border-yellow-500/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-center gap-2">
              <Activity className="h-6 w-6 text-yellow-400" />
              <CardTitle className="text-yellow-400">HotStack Live Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded-lg p-4 font-mono text-sm space-y-1 max-h-64 overflow-y-auto" data-testid="status-log-container">
              {statusLogs.map((log, index) => (
                <div 
                  key={index}
                  className={`${
                    log.type === 'success' ? 'text-green-400' :
                    log.type === 'warning' ? 'text-yellow-400' :
                    log.type === 'error' ? 'text-red-400' :
                    'text-blue-400'
                  }`}
                  data-testid={`status-log-${index}`}
                >
                  <span className="text-gray-500">[{log.time}]</span> {log.message}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6 text-gray-400 text-sm space-y-2">
          <p>Powered by Fruitful Global | ScrollSynced | Vault-Verified</p>
          <p>🦍 Banimal Ecosystem | 🍝 Noodle Juice Flow | 🗄️ Vault Allocation</p>
        </div>
      </div>
    </div>
  );
}
