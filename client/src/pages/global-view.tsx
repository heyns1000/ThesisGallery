import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GlobalView() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("⚡️ Global View interface initialized...");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendPrompt = async () => {
    if (!prompt.trim()) {
      setResponse("⚠️ Please enter a prompt.");
      return;
    }

    setIsLoading(true);
    setResponse("🔄 Sending global sync scroll to VaultBridge...");

    try {
      const res = await fetch("https://faa.zone/vaultbridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();
      setResponse(data.reply || "✅ VaultGPT acknowledged but returned no scroll.");
    } catch (err) {
      setResponse(`❌ Connection failed.\n\n🧬 OmniDrop fallback triggered:\n"${prompt}"`);
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
            <CardTitle className="text-4xl font-extrabold text-blue-400 flex items-center justify-center gap-2">
              🌍 Global View GPT
            </CardTitle>
            <p className="text-gray-400">
              Sector-wide global intelligence synchronizer for FAA.Zone deployments.
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