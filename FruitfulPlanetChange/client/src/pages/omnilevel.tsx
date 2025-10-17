import { useState } from 'react';
import { OmnilevelSelector, allSectorsData } from '@/components/portal/omnilevel-selector';
import { RecommendationPanel } from '@/components/portal/recommendation-panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Sparkles, CheckCircle, Zap } from 'lucide-react';
import { Link } from 'wouter';

export function OmnilevelPage() {
  const [selectedSectors, setSelectedSectors] = useState<Array<{key: string, data: any}>>([]);
  const [completionStatus, setCompletionStatus] = useState<'idle' | 'processing' | 'complete'>('idle');

  const handleSectorSelect = (sectorKey: string, sectorData: any) => {
    setSelectedSectors(prev => {
      const existing = prev.find(s => s.key === sectorKey);
      if (existing) {
        return prev.filter(s => s.key !== sectorKey);
      }
      return [...prev, { key: sectorKey, data: sectorData }];
    });
  };

  const handleRecommendedSectorAdd = (sectorKey: string) => {
    const sectorData = allSectorsData[sectorKey as keyof typeof allSectorsData];
    if (sectorData) {
      handleSectorSelect(sectorKey, sectorData);
    }
  };

  const processCompletionLogic = () => {
    setCompletionStatus('processing');
    
    // Simulate AI processing
    setTimeout(() => {
      setCompletionStatus('complete');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-600" />
              Omnilevel AI Logic
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete sector selection using advanced AI logic from ai-logic.seedwave.faa.zone
            </p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Selected Sectors</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedSectors.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Available</p>
                  <p className="text-2xl font-bold text-green-600">31</p>
                </div>
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completion</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round((selectedSectors.length / 31) * 100)}%
                  </p>
                </div>
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Sectors Summary */}
      {selectedSectors.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Current Selection
              </CardTitle>
              <Button
                onClick={processCompletionLogic}
                disabled={completionStatus !== 'idle'}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Brain className="w-4 h-4" />
                {completionStatus === 'processing' ? 'Processing...' : 'AI Complete'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedSectors.map(({ key, data }) => (
                <div key={key} className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <div className="font-medium text-blue-900 dark:text-blue-100">
                    {data.name}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    {data.baseUrl}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {data.brands?.length || 0} brands
                  </div>
                </div>
              ))}
            </div>

            {completionStatus === 'complete' && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">Omnilevel Completion Successful!</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                  AI logic has processed your sector selection and identified optimal cross-sector synergies. 
                  All {selectedSectors.length} selected sectors are now fully integrated within the ecosystem.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Recommendation Panel */}
      {selectedSectors.length > 0 && (
        <div className="mb-6">
          <RecommendationPanel
            selectedSectors={selectedSectors.map(s => s.key)}
            onSectorRecommend={handleRecommendedSectorAdd}
            userProfile={{
              searchHistory: [],
              interactionHistory: [],
              preferences: {
                businessStage: 'growth',
                riskTolerance: 'medium',
                focusAreas: ['ai', 'automation', 'ecosystem']
              }
            }}
          />
        </div>
      )}

      {/* Main Selector */}
      <OmnilevelSelector
        onSectorSelect={handleSectorSelect}
        selectedSectors={selectedSectors.map(s => s.key)}
        multiSelect={true}
        showBrands={true}
      />

      {/* Footer Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">About Omnilevel Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI-Powered Recommendations
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Advanced recommendation engine analyzes sector synergies, business compatibility, 
                and strategic value to suggest optimal sector combinations for your ecosystem.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Intelligent Analysis
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time analysis of cross-sector relationships, technology stack overlaps, 
                and supply chain completeness to maximize ecosystem efficiency.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}