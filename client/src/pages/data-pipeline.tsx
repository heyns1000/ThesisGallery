import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Database, Brain, Upload, Sparkles } from "lucide-react";

export default function DataPipeline() {
  const [contextData, setContextData] = useState("");
  const [prompt, setPrompt] = useState("");
  const [newData, setNewData] = useState("");
  const [category, setCategory] = useState("brands");
  const [contextCategory, setContextCategory] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch ecosystem context
  const { data: context, isLoading: contextLoading, refetch: refetchContext } = useQuery({
    queryKey: ['/api/gemini/context', contextCategory],
    queryFn: async () => {
      const response = await fetch(`/api/gemini/context?category=${contextCategory}`);
      return await response.json();
    }
  });

  // Data ingestion mutation
  const ingestMutation = useMutation({
    mutationFn: async ({ records, category, source }: { records: any[], category: string, source: string }) => {
      const response = await fetch('/api/gemini/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records, category, source })
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "🌱 Data Ingested Successfully",
        description: "Your data has been added to the Sacred Baobab™ ecosystem context",
      });
      refetchContext();
      setNewData("");
    },
    onError: () => {
      toast({
        title: "⚠️ Ingestion Failed",
        description: "BANIMAL LOOP protocols activated - please try again",
        variant: "destructive"
      });
    }
  });

  // Enhanced generation mutation
  const generateMutation = useMutation({
    mutationFn: async ({ prompt, useContext, contextCategory }: { prompt: string, useContext: boolean, contextCategory: string }) => {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, useContext, contextCategory })
      });
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "🌳 Sacred Wisdom Generated",
        description: "Baobab tree consciousness has responded with ecosystem insights",
      });
    }
  });

  const handleIngestData = () => {
    try {
      const records = JSON.parse(newData);
      if (!Array.isArray(records)) {
        throw new Error("Data must be an array");
      }
      ingestMutation.mutate({ 
        records, 
        category, 
        source: "manual-input" 
      });
    } catch (error) {
      toast({
        title: "⚠️ Invalid Data Format",
        description: "Please enter valid JSON array format",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6" data-testid="data-pipeline-page">
      <div className="flex items-center gap-2 mb-6">
        <Database className="h-8 w-8 text-green-600" />
        <h1 className="text-3xl font-bold">🌍 Sacred Baobab™ Data Pipeline</h1>
        <Badge variant="outline" className="ml-2">BANIMAL LOOP Ready</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Ingestion Panel */}
        <Card data-testid="data-ingestion-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Data Ingestion Portal
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Feed data into the ecosystem for context-aware AI responses
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="category">Data Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brands">Brands</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="contacts">Contacts</SelectItem>
                  <SelectItem value="wildlife">Wildlife Nodes</SelectItem>
                  <SelectItem value="seedlings">Seedling Progress</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="data-input">Data (JSON Array Format)</Label>
              <Textarea
                id="data-input"
                data-testid="textarea-data-input"
                placeholder='[{"name": "Example Brand", "sector": "Technology"}, {"name": "Another Brand", "sector": "Healthcare"}]'
                value={newData}
                onChange={(e) => setNewData(e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
            </div>

            <Button 
              onClick={handleIngestData}
              disabled={ingestMutation.isPending || !newData.trim()}
              className="w-full"
              data-testid="button-ingest-data"
            >
              {ingestMutation.isPending ? "🌱 Feeding to Baobab..." : "🚀 Ingest Data"}
            </Button>
          </CardContent>
        </Card>

        {/* Context Display Panel */}
        <Card data-testid="context-display-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Ecosystem Context
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Current context available to the Sacred Baobab™ AI
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="context-category">Context Category</Label>
              <Select value={contextCategory} onValueChange={setContextCategory}>
                <SelectTrigger data-testid="select-context-category">
                  <SelectValue placeholder="Select context" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ecosystem Data</SelectItem>
                  <SelectItem value="brands">Brands Only</SelectItem>
                  <SelectItem value="products">Products Only</SelectItem>
                  <SelectItem value="contacts">Contacts Only</SelectItem>
                  <SelectItem value="wildlife">Wildlife Nodes</SelectItem>
                  <SelectItem value="seedlings">Seedling Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {context && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Context Status:</span>
                  <Badge variant="default" data-testid="badge-context-status">
                    {context.dataPoints} Data Points
                  </Badge>
                </div>
                <div 
                  className="bg-muted p-3 rounded text-xs font-mono max-h-32 overflow-y-auto"
                  data-testid="text-context-preview"
                >
                  {context.context ? context.context.slice(0, 500) + "..." : "No context available"}
                </div>
              </div>
            )}

            <Button 
              onClick={() => refetchContext()}
              disabled={contextLoading}
              variant="outline"
              className="w-full"
              data-testid="button-refresh-context"
            >
              {contextLoading ? "🔄 Loading..." : "🔄 Refresh Context"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Generation Panel */}
      <Card data-testid="ai-generation-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Context-Aware AI Generation
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Ask questions with full ecosystem context from Sacred Baobab™ wisdom
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ai-prompt">Your Question to the Sacred Baobab™</Label>
            <Textarea
              id="ai-prompt"
              data-testid="textarea-ai-prompt"
              placeholder="How are our 240 brands performing? What insights do you have about our ecosystem expansion?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => generateMutation.mutate({ 
                prompt, 
                useContext: true, 
                contextCategory 
              })}
              disabled={generateMutation.isPending || !prompt.trim()}
              className="flex-1"
              data-testid="button-generate-with-context"
            >
              {generateMutation.isPending ? "🌳 Channeling Baobab..." : "🌍 Generate with Context"}
            </Button>
            <Button 
              onClick={() => generateMutation.mutate({ 
                prompt, 
                useContext: false, 
                contextCategory: "none" 
              })}
              disabled={generateMutation.isPending || !prompt.trim()}
              variant="outline"
              data-testid="button-generate-without-context"
            >
              Generate without Context
            </Button>
          </div>

          {generateMutation.data && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Sacred Baobab™ Response:</span>
                <Badge variant="secondary" data-testid="badge-response-status">
                  {generateMutation.data.contextUsed ? "With Context" : "Context-Free"}
                </Badge>
              </div>
              <div 
                className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border"
                data-testid="text-ai-response"
              >
                <pre className="whitespace-pre-wrap text-sm">
                  {generateMutation.data.text}
                </pre>
              </div>
              <div className="text-xs text-muted-foreground" data-testid="text-response-timestamp">
                Generated: {generateMutation.data.timestamp}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}