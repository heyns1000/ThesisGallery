import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles } from "lucide-react";

interface RecommendationPanelProps {
  selectedSectors: string[];
  onSectorRecommend: (sectorKey: string) => void;
  userProfile?: {
    searchHistory?: string[];
    interactionHistory?: string[];
    preferences?: {
      businessStage?: string;
      riskTolerance?: string;
      focusAreas?: string[];
    };
  };
}

export function RecommendationPanel({ 
  selectedSectors, 
  onSectorRecommend,
  userProfile 
}: RecommendationPanelProps) {
  // AI-powered recommendations based on selected sectors
  const getRecommendations = () => {
    const recommendations = [
      { key: "agriculture", name: "🌱 Agriculture & Biotech", reason: "Synergy with FSF sector", confidence: 92 },
      { key: "banking", name: "🏦 Banking & Finance", reason: "Payment processing integration", confidence: 88 },
      { key: "creative", name: "🖋️ Creative Tech", reason: "Media & content creation", confidence: 85 }
    ];
    
    return recommendations.filter(r => !selectedSectors.includes(r.key)).slice(0, 3);
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card data-testid="recommendation-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI-Powered Recommendations
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Based on your selection, these sectors may complement your ecosystem
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.key} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" data-testid={`recommendation-${rec.key}`}>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">{rec.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{rec.reason}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" data-testid={`confidence-${rec.key}`}>
                  {rec.confidence}% match
                </Badge>
                <Button 
                  size="sm" 
                  onClick={() => onSectorRecommend(rec.key)}
                  className="flex items-center gap-1"
                  data-testid={`button-add-${rec.key}`}
                >
                  <Sparkles className="w-3 h-3" />
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
