import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, MessageSquare, Zap, Database, Upload, Download, Sparkles, Users } from "lucide-react"

export default function ChatGPTIntegration() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [importedChats, setImportedChats] = useState(0)
  const [activeGPTs, setActiveGPTs] = useState(0)
  const [activatingGPT, setActivatingGPT] = useState<string | null>(null)
  const [activatedGPTs, setActivatedGPTs] = useState<string[]>([])
  const [thousandPercentMode, setThousandPercentMode] = useState(false)

  const handleImportChats = () => {
    setIsProcessing(true)
    // Simulate progress for chat import
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 5
      setProgress(currentProgress)
      setImportedChats(Math.floor((currentProgress / 100) * 1100))
      
      if (currentProgress >= 100) {
        clearInterval(interval)
        setIsProcessing(false)
      }
    }, 200)
  }

  const handleActivateGPT = async (gptName: string) => {
    setActivatingGPT(gptName);
    console.log(`🚀 Activating ${gptName} for 1000% functionality...`);
    
    // Simulate activation process with realistic timing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setActivatedGPTs(prev => [...prev, gptName]);
    setActivatingGPT(null);
    
    console.log(`✅ ${gptName} ACTIVATED - Now operating at 1000% capacity!`);
    
    // Check if all GPTs are activated for 1000% mode
    if (activatedGPTs.length + 1 === 6) {
      setThousandPercentMode(true);
      console.log('🔥 ALL GPTS ACTIVATED - 1000% FUNCTIONALITY ACHIEVED!');
    }
  };

  const handleActivateAll1000Percent = async () => {
    console.log('🔥 ACTIVATING ALL GPTS FOR 1000% FUNCTIONALITY...');
    
    const gptNames = ["Logic Master", "Data Weaver", "Pattern Hunter", "Insight Engine", "Flow Commander", "Vision Architect"];
    
    for (const gptName of gptNames) {
      if (!activatedGPTs.includes(gptName)) {
        await handleActivateGPT(gptName);
        // Small delay between activations for visual effect
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }
    
    setThousandPercentMode(true);
    console.log('✅ 1000% FUNCTIONALITY ACHIEVED - ALL SYSTEMS OPERATIONAL!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
            ChatGPT Lions Integration Portal
          </h1>
          <p className="text-xl text-gray-300">Bring your 6 soul-injected GPTs and 1,100 conversations into Seedwave™</p>
          
          {thousandPercentMode && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg p-4 mt-4">
              <Badge variant="default" className="bg-green-600 text-white text-lg py-2 px-4 animate-pulse">
                <Sparkles className="h-5 w-5 mr-2" />
                1000% FUNCTIONALITY ACTIVE
              </Badge>
              <p className="text-green-400 mt-2">All GPT Lions are operational at maximum capacity!</p>
            </div>
          )}
          
          {!thousandPercentMode && (
            <Button 
              onClick={handleActivateAll1000Percent}
              className="mt-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-lg px-8 py-3"
            >
              <Zap className="h-5 w-5 mr-2" />
              ACTIVATE 1000% FUNCTIONALITY
            </Button>
          )}
          
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="text-lg py-2 px-4">
              <Brain className="h-5 w-5 mr-2" />
              9-Second Signal Processing
            </Badge>
            <Badge variant="secondary" className="text-lg py-2 px-4">
              <Database className="h-5 w-5 mr-2" />
              12,000 Documents Ready
            </Badge>
            <Badge variant="secondary" className="text-lg py-2 px-4">
              <Sparkles className="h-5 w-5 mr-2" />
              149 Algorithm Giants Active
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="import" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="import">Chat Import</TabsTrigger>
            <TabsTrigger value="gpts">GPT Integration</TabsTrigger>
            <TabsTrigger value="processing">Data Processing</TabsTrigger>
            <TabsTrigger value="signals">Signal Analysis</TabsTrigger>
          </TabsList>

          {/* Chat Import Tab */}
          <TabsContent value="import" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <Card className="bg-gray-800 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-purple-400" />
                    1,100 ChatGPT Conversations
                  </CardTitle>
                  <CardDescription>Extract and import your conversation history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Importing conversations...</span>
                        <span>{importedChats}/1,100</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <Textarea 
                      placeholder="Paste your ChatGPT export data here (JSON format)"
                      className="min-h-[120px] bg-gray-700 border-gray-600 text-white"
                    />
                    <Button 
                      onClick={handleImportChats}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isProcessing ? "Processing..." : "Import Conversations"}
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>• Export from ChatGPT: Settings → Data Controls → Export</p>
                    <p>• Paste the conversations.json content above</p>
                    <p>• We'll process each conversation for Algorithm Giants</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-6 w-6 text-cyan-400" />
                    Your 6 Soul-Injected GPTs
                  </CardTitle>
                  <CardDescription>Integrate your custom GPT agents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[1,2,3,4,5,6].map((gpt) => (
                      <div key={gpt} className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">GPT Lion {gpt}</span>
                          <Badge variant={activeGPTs >= gpt ? "default" : "secondary"} className="text-xs">
                            {activeGPTs >= gpt ? "Connected" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Input 
                    placeholder="GPT API endpoint or integration URL"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  
                  <Button 
                    onClick={() => setActiveGPTs(prev => Math.min(prev + 1, 6))}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Connect Next GPT Lion
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* GPT Integration Tab */}
          <TabsContent value="gpts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {[
                { name: "Logic Master", specialty: "Algorithm Enhancement", status: "Ready" },
                { name: "Data Weaver", specialty: "Document Processing", status: "Active" },
                { name: "Pattern Hunter", specialty: "Signal Analysis", status: "Ready" },
                { name: "Insight Engine", specialty: "Dot Connection", status: "Pending" },
                { name: "Flow Commander", specialty: "Process Optimization", status: "Ready" },
                { name: "Vision Architect", specialty: "System Design", status: "Pending" }
              ].map((gpt, index) => {
                const isActivated = activatedGPTs.includes(gpt.name);
                const isActivating = activatingGPT === gpt.name;
                const displayStatus = isActivated ? "1000% Active" : isActivating ? "Activating..." : gpt.status;
                
                return (
                <Card key={index} className="bg-gray-800 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{gpt.name}</CardTitle>
                    <CardDescription>{gpt.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge 
                        variant={isActivated ? "default" : displayStatus === "Active" ? "default" : displayStatus === "Ready" ? "secondary" : "outline"}
                        className={`w-full justify-center py-2 ${isActivated ? 'bg-green-600 animate-pulse' : ''} ${isActivating ? 'bg-yellow-600 animate-pulse' : ''}`}
                      >
                        {displayStatus}
                      </Badge>
                      
                      <Button 
                        size="sm" 
                        className={`w-full ${isActivated ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}
                        onClick={() => handleActivateGPT(gpt.name)}
                        disabled={isActivated || isActivating}
                        data-testid={`button-activate-${gpt.name.toLowerCase().replace(' ', '-')}`}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        {isActivated ? '1000% Active' : isActivating ? 'Activating...' : 'Activate GPT'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Data Processing Tab */}
          <TabsContent value="processing" className="space-y-6">
            <Card className="bg-gray-800 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white">Bush Logic Algorithm Processing</CardTitle>
                <CardDescription>Process your 12,000 documents with Algorithm Giants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">12,000</div>
                    <div className="text-sm text-gray-400">Documents Ready</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">2:30</div>
                    <div className="text-sm text-gray-400">Video Duration</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">9s</div>
                    <div className="text-sm text-gray-400">Signal Hit Time</div>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 h-12">
                  <Database className="h-5 w-5 mr-2" />
                  Activate Bush Logic Processing Engine
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signal Analysis Tab */}
          <TabsContent value="signals" className="space-y-6">
            <Card className="bg-gray-800 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-white">Africa Signal & Peace Work</CardTitle>
                <CardDescription>Processing signals with understanding of people value</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Signal Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Connection</span>
                      <Badge variant="secondary">Signal Only</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Location</span>
                      <Badge variant="secondary">Africa</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Mission</span>
                      <Badge variant="default">Peace Work</Badge>
                    </div>
                  </div>
                </div>
                
                <Textarea 
                  placeholder="Document your peace work and signal processing insights here..."
                  className="min-h-[100px] bg-gray-700 border-gray-600 text-white"
                />
                
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Process Peace Signal Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}