import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Zap, 
  Info,
  ChevronRight,
  RefreshCw,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { sectorList } from './omnilevel-selector';
import { 
  recommendationEngine, 
  type RecommendationScore, 
  type UserProfile 
} from '@/services/recommendation-engine';

interface RecommendationPanelProps {
  selectedSectors: string[];
  onSectorRecommend: (sectorKey: string) => void;
  userProfile?: Partial<UserProfile>;
  className?: string;
}

export function RecommendationPanel({ 
  selectedSectors, 
  onSectorRecommend, 
  userProfile = {},
  className = "" 
}: RecommendationPanelProps) {
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'positive' | 'negative'>>({});

  // Build user profile from props and defaults
  const fullUserProfile: UserProfile = {
    selectedSectors,
    searchHistory: userProfile.searchHistory || [],
    interactionHistory: userProfile.interactionHistory || [],
    preferences: {
      riskTolerance: userProfile.preferences?.riskTolerance || 'medium',
      focusAreas: userProfile.preferences?.focusAreas || [],
      businessStage: userProfile.preferences?.businessStage || 'growth',
      ...userProfile.preferences
    }
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newRecommendations = recommendationEngine.generateRecommendations(
      fullUserProfile,
      6
    );
    
    setRecommendations(newRecommendations);
    setIsGenerating(false);
  };

  useEffect(() => {
    if (selectedSectors.length > 0) {
      generateRecommendations();
    } else {
      setRecommendations([]);
    }
  }, [selectedSectors]);

  const getCategoryIcon = (category: RecommendationScore['category']) => {
    switch (category) {
      case 'synergy': return <Zap className="w-4 h-4" />;
      case 'complementary': return <Target className="w-4 h-4" />;
      case 'expansion': return <TrendingUp className="w-4 h-4" />;
      case 'strategic': return <Brain className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: RecommendationScore['category']) => {
    switch (category) {
      case 'synergy': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'complementary': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'expansion': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'strategic': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleFeedback = (sectorKey: string, type: 'positive' | 'negative') => {
    setFeedback(prev => ({ ...prev, [sectorKey]: type }));
    
    // In a real implementation, this would send feedback to improve the recommendation engine
    console.log(`Feedback for ${sectorKey}: ${type}`);
  };

  if (selectedSectors.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            AI Recommendations Ready
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select one or more sectors to get intelligent AI-powered recommendations 
            for complementary sectors and strategic expansion opportunities.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg">AI Sector Recommendations</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {recommendations.length} recommendations
            </Badge>
            <Button
              onClick={generateRecommendations}
              disabled={isGenerating}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Based on your {selectedSectors.length} selected sectors and AI analysis
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {isGenerating ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((rec) => {
              const sectorName = sectorList[rec.sectorKey as keyof typeof sectorList]?.name || rec.sectorKey;
              const isExpanded = expandedCard === rec.sectorKey;
              const userFeedback = feedback[rec.sectorKey];
              
              return (
                <Card 
                  key={rec.sectorKey}
                  className="transition-all duration-200 hover:shadow-md border-l-4"
                  style={{ borderLeftColor: rec.category === 'synergy' ? '#8b5cf6' : 
                                            rec.category === 'strategic' ? '#f59e0b' :
                                            rec.category === 'complementary' ? '#3b82f6' : '#10b981' }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(rec.category)}
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {sectorName}
                          </span>
                        </div>
                        <Badge className={getCategoryColor(rec.category)}>
                          {rec.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {Math.round(rec.score * 100)}% Match
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round(rec.confidence * 100)}% confidence
                          </div>
                        </div>
                      </div>
                    </div>

                    <Progress value={rec.score * 100} className="mb-3" />

                    <div className="space-y-2 mb-3">
                      {rec.reasoning.slice(0, isExpanded ? rec.reasoning.length : 1).map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{reason}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => onSectorRecommend(rec.sectorKey)}
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Sparkles className="w-3 h-3" />
                          Add Sector
                        </Button>
                        
                        {rec.reasoning.length > 1 && (
                          <Button
                            onClick={() => setExpandedCard(isExpanded ? null : rec.sectorKey)}
                            size="sm"
                            variant="ghost"
                            className="flex items-center gap-1"
                          >
                            <Info className="w-3 h-3" />
                            {isExpanded ? 'Less' : 'Details'}
                            <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => handleFeedback(rec.sectorKey, 'positive')}
                          size="sm"
                          variant="ghost"
                          className={`p-1 ${userFeedback === 'positive' ? 'text-green-600' : 'text-gray-400'}`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => handleFeedback(rec.sectorKey, 'negative')}
                          size="sm"
                          variant="ghost"
                          className={`p-1 ${userFeedback === 'negative' ? 'text-red-600' : 'text-gray-400'}`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          <h4 className="font-semibold mb-2">AI Analysis Details</h4>
                          <p>{recommendationEngine.explainRecommendation(rec)}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!isGenerating && recommendations.length === 0 && (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Additional Recommendations
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your current sector selection appears comprehensive. 
              Try adjusting your preferences or adding different sectors for new recommendations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}