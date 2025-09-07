import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, FileText, Download, BarChart3, Clock, 
  CheckCircle, AlertCircle, TrendingUp, Users, 
  Zap, Calendar, Globe, Archive
} from "lucide-react";

interface DailySummary {
  date: string;
  global_overview: string;
  replit_highlights: string[];
  key_developments: string[];
  partnership_updates: string[];
  technical_progress: string[];
  business_milestones: string[];
  truth_preservation: string[];
  pa_ready_format: string;
  old_school_compilation: string;
  statistics: {
    total_entries_processed: number;
    replit_relevant_count: number;
    critical_items_count: number;
    sources_analyzed: string[];
  };
}

export default function DailySummaryExtractor() {
  const [diaryInput, setDiaryInput] = useState('');
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportFormat, setExportFormat] = useState('pa');

  const processDiaries = async () => {
    if (!diaryInput.trim()) return;

    setIsProcessing(true);
    try {
      // Parse diary input - support JSON or simple text format
      let diaries;
      try {
        diaries = JSON.parse(diaryInput);
      } catch {
        // If not JSON, create a simple diary structure
        diaries = [{
          source: 'manual_input',
          entries: [{
            id: 'manual_1',
            content: diaryInput,
            date: new Date().toISOString(),
            author: 'user'
          }]
        }];
      }

      const response = await fetch('/api/daily-summary/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diaries })
      });

      if (response.ok) {
        const result = await response.json();
        setSummary(result.summary);
      }
    } catch (error) {
      console.error('Failed to process diaries:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportSummary = async () => {
    if (!summary) return;

    try {
      // For this demo, we'll use the summary data directly
      let exportData: string;
      let filename: string;

      switch (exportFormat) {
        case 'pa':
          exportData = summary.pa_ready_format;
          filename = `daily-summary-pa-${summary.date}.txt`;
          break;
        case 'oldschool':
          exportData = summary.old_school_compilation;
          filename = `daily-summary-oldschool-${summary.date}.txt`;
          break;
        case 'json':
          exportData = JSON.stringify(summary, null, 2);
          filename = `daily-summary-${summary.date}.json`;
          break;
        default:
          return;
      }

      // Create and download file
      const blob = new Blob([exportData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export summary:', error);
    }
  };

  const sampleDiaryData = `[
  {
    "source": "Replit_Development_Team",
    "entries": [
      {
        "id": "entry_1",
        "date": "${new Date().toISOString()}",
        "content": "Successfully deployed new Eureka Cloudflow automation system. Generated 400+ pages in under 1 second. This is a critical breakthrough for our scalability.",
        "author": "Development Team"
      },
      {
        "id": "entry_2", 
        "date": "${new Date().toISOString()}",
        "content": "Context transfer system between ChatGPT and Freedom platforms now operational. Seamless AI continuity achieved with 95%+ similarity preservation.",
        "author": "AI Integration Team"
      }
    ]
  },
  {
    "source": "FAA_Global_Operations",
    "entries": [
      {
        "id": "entry_3",
        "date": "${new Date().toISOString()}",
        "content": "Partnership expansion across agriculture and education sectors. Baobab foundation integration showing strong progress in wildlife management systems.",
        "author": "Operations Team"
      }
    ]
  }
]`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900 dark:via-orange-900 dark:to-red-900" data-testid="daily-summary-extractor">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-800 via-red-800 to-pink-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-6">📔⚡</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Daily Global Summary Extractor
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            Extract daily global summaries from hundreds of diaries using the old school method.
            Process, analyze, and compile comprehensive daily reports with PA-ready formatting.
          </p>
          <div className="mt-6">
            <Badge variant="secondary" className="text-sm">
              QN-DAILY-GLOBAL-SUMMARY-063-2025
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <BookOpen className="h-6 w-6 mr-3" />
              Diary Input Processor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Diary Collection (JSON format or plain text)
                </label>
                <Textarea
                  value={diaryInput}
                  onChange={(e) => setDiaryInput(e.target.value)}
                  placeholder="Paste diary JSON data or enter plain text..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  onClick={processDiaries} 
                  disabled={isProcessing || !diaryInput.trim()}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Extract Daily Summary
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => setDiaryInput(sampleDiaryData)}
                  variant="outline"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Load Sample Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {summary && (
          <>
            {/* Statistics Overview */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <BarChart3 className="h-6 w-6 mr-3" />
                  Processing Statistics
                  <div className="ml-auto flex items-center space-x-4">
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pa">PA Ready Format</SelectItem>
                        <SelectItem value="oldschool">Old School</SelectItem>
                        <SelectItem value="json">JSON Export</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={exportSummary} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {summary.statistics.total_entries_processed}
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-300">Total Entries</p>
                  </div>
                  
                  <div className="text-center bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {summary.statistics.replit_relevant_count}
                    </div>
                    <p className="text-sm text-green-800 dark:text-green-300">Replit Relevant</p>
                  </div>
                  
                  <div className="text-center bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">
                      {summary.statistics.critical_items_count}
                    </div>
                    <p className="text-sm text-red-800 dark:text-red-300">Critical Items</p>
                  </div>
                  
                  <div className="text-center bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">
                      {summary.statistics.sources_analyzed.length}
                    </div>
                    <p className="text-sm text-purple-800 dark:text-purple-300">Sources</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Sources Analyzed:</h3>
                  <div className="flex flex-wrap gap-2">
                    {summary.statistics.sources_analyzed.map((source, index) => (
                      <Badge key={index} variant="outline">{source}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Globe className="h-6 w-6 mr-3" />
                  Daily Summary Results
                  <Badge className="ml-3 bg-orange-600">
                    {summary.date}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="replit">Replit</TabsTrigger>
                    <TabsTrigger value="developments">Developments</TabsTrigger>
                    <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="business">Business</TabsTrigger>
                    <TabsTrigger value="formats">Formats</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <h3 className="font-bold text-lg mb-3 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Global Overview
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {summary.global_overview}
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="replit" className="mt-6">
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                        Replit Highlights ({summary.replit_highlights.length})
                      </h3>
                      {summary.replit_highlights.map((highlight, index) => (
                        <div key={index} className="bg-green-50 dark:bg-green-900 p-4 rounded border-l-4 border-green-500">
                          <p className="text-sm">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="developments" className="mt-6">
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-blue-600" />
                        Key Developments ({summary.key_developments.length})
                      </h3>
                      {summary.key_developments.map((development, index) => (
                        <div key={index} className="bg-blue-50 dark:bg-blue-900 p-4 rounded border-l-4 border-blue-500">
                          <p className="text-sm">{development}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="partnerships" className="mt-6">
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg flex items-center">
                        <Users className="h-5 w-5 mr-2 text-purple-600" />
                        Partnership Updates ({summary.partnership_updates.length})
                      </h3>
                      {summary.partnership_updates.map((update, index) => (
                        <div key={index} className="bg-purple-50 dark:bg-purple-900 p-4 rounded border-l-4 border-purple-500">
                          <p className="text-sm">{update}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="technical" className="mt-6">
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                        Technical Progress ({summary.technical_progress.length})
                      </h3>
                      {summary.technical_progress.map((progress, index) => (
                        <div key={index} className="bg-orange-50 dark:bg-orange-900 p-4 rounded border-l-4 border-orange-500">
                          <p className="text-sm">{progress}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="business" className="mt-6">
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                        Business Milestones ({summary.business_milestones.length})
                      </h3>
                      {summary.business_milestones.map((milestone, index) => (
                        <div key={index} className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded border-l-4 border-indigo-500">
                          <p className="text-sm">{milestone}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="formats" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg mb-3 flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          PA Ready Format
                        </h3>
                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                          {summary.pa_ready_format}
                        </pre>
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-lg mb-3 flex items-center">
                          <Archive className="h-5 w-5 mr-2" />
                          Old School Compilation
                        </h3>
                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                          {summary.old_school_compilation}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}