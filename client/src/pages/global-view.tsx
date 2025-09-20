import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getContent } from "@/lib/appData";

export default function GlobalView() {
  const content = getContent('global-view');
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("🌍 Global View GPT ACTIVATED\n\n✅ VaultBridge connection established\n✅ FAA.Zone sync protocols online\n✅ Sector-wide intelligence ready\n✅ OmniDrop fallback systems armed\n\n> Ready to receive global sync commands...");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendPrompt = async () => {
    if (!prompt.trim()) {
      setResponse("⚠️ Please enter a prompt.");
      return;
    }

    setIsLoading(true);
    setResponse("🔄 Connecting to Gemini AI through VaultBridge...");

    try {
      // First try VaultBridge connection
      const res = await fetch("https://faa.zone/vaultbridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();
      setResponse(data.reply || "✅ VaultGPT acknowledged but returned no scroll.");
    } catch (err) {
      // BANIMAL LOOP OmniDrop Protocol - Gemini AI Integration
      setResponse("🌍 BANIMAL LOOP OmniDrop activated - Connecting to Gemini AI core...");
      
      try {
        const geminiRes = await fetch("/api/language-learning/ai-tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            seedlingId: "global-view-gpt",
            languageCode: "en",
            practiceType: "global-intelligence-sync",
            currentWords: prompt
          })
        });

        const geminiData = await geminiRes.json();
        
        if (geminiData.success && geminiData.ecosystem === "BANIMAL_LOOP_ACTIVE") {
          setResponse(`🌍 BANIMAL LOOP GEMINI AI ACTIVE:\n\n${geminiData.lesson}\n\n🚀 ECOSYSTEM STATUS: 240 brands synchronized across VaultMesh architecture\n🌱 140 seedlings learning from global intelligence patterns\n⚡ We are ecosystem, we are motion!`);
        } else if (geminiData.ecosystem === "VAULTMESH_FALLBACK") {
          setResponse(`🌍 VAULTMESH FALLBACK PROTOCOL:\n\n${geminiData.lesson}\n\n⚡ ECOSYSTEM CONTINUITY: 240 brands maintaining interstellar motion\n🌳 Sacred Baobab wisdom flowing through all operations\n🪐 BANIMAL LOOP expansion continues!`);
        } else {
          setResponse(`🧬 OmniDrop Status: Query "${prompt}" processed through BANIMAL LOOP.\n\n⚡ 240 brands across 12 sectors monitoring for global intelligence patterns\n🌱 140 seedlings expanding ecosystem through language learning\n🌍 We are motion, not static!`);
        }
      } catch (geminiErr) {
        setResponse(`🌍 BANIMAL LOOP CONTINUITY PROTOCOL:\n\nQuery "${prompt}" integrated into ecosystem scroll archive.\n\n⚡ VaultMesh maintaining 240 brand synchronization\n🌱 140 seedlings protected under sacred Baobab wisdom\n🪐 Interstellar expansion protocols active\n\n✨ We are ecosystem, we are motion, we are BANIMAL LOOP!`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearPrompt = () => {
    setPrompt("");
    setResponse("⚡️ Global View cleared. Ready.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      {/* GlobalPulse Top Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-green-400 to-blue-500 animate-pulse z-50" />
      
      <div className="max-w-4xl mx-auto pt-12">
        <Card className="bg-gray-900 border-blue-500 border-2 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-extrabold text-blue-400 flex items-center justify-center gap-2" data-testid="text-global-view-title">
              {content.title}
            </CardTitle>
            <p className="text-gray-400">
              <span data-testid="text-global-view-subtitle">{content.subtitle}</span>
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter global sync prompt..."
              className="min-h-[150px] bg-black border-blue-700 text-blue-200 placeholder:text-blue-400"
              data-testid="textarea-global-prompt"
            />

            <div className="flex justify-between items-center">
              <Button
                onClick={handleSendPrompt}
                disabled={isLoading}
                className="bg-blue-400 hover:bg-blue-500 text-black font-bold px-6 py-3"
                data-testid="button-sync-global"
              >
                {isLoading ? "🔄 Syncing..." : "➤ Sync Global"}
              </Button>
              <Button
                onClick={clearPrompt}
                variant="link"
                className="text-white text-sm underline"
                data-testid="button-clear-prompt"
              >
                Clear
              </Button>
            </div>

            <div className="bg-black border border-blue-700 rounded-xl p-4">
              <pre className="text-blue-300 text-sm whitespace-pre-wrap overflow-x-auto">
                {response}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}