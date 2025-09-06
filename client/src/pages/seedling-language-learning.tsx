import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Heart, Leaf, Globe, Award, BookOpen, Users, MessageCircle, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Language {
  id: string;
  languageCode: string;
  languageName: string;
  englishName: string;
  thankYou: string;
  please: string;
  region: string;
  pronunciation: string;
  culturalContext: string;
  isActiveSeedlingLanguage: boolean;
}

interface SeedlingProgress {
  id: string;
  seedlingId: string;
  languageCode: string;
  thankYouLearned: boolean;
  pleaseLearned: boolean;
  practiceCount: number;
  kindnessScore: number;
  mastered: boolean;
  lastPracticed: string;
}

interface LearningStats {
  totalLanguagesLearned: number;
  totalKindnessScore: number;
  totalPracticeTime: number;
  recentSessions: any[];
  languageProgress: SeedlingProgress[];
}

export default function SeedlingLanguageLearning() {
  const [selectedSeedling, setSelectedSeedling] = useState<string>('seedling-001');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [practiceMode, setPracticeMode] = useState<'daily' | 'intensive' | 'cultural'>('daily');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all languages for seedling learning
  const { data: languages = [], isLoading: languagesLoading } = useQuery({
    queryKey: ['/api/language-learning/languages'],
    queryFn: () => apiRequest('/api/language-learning/languages')
  });

  // Fetch seedling language statistics
  const { data: seedlingStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/language-learning/seedlings', selectedSeedling, 'stats'],
    queryFn: () => apiRequest(`/api/language-learning/seedlings/${selectedSeedling}/stats`),
    enabled: !!selectedSeedling
  });

  // Initialize language learning system
  const initializeMutation = useMutation({
    mutationFn: () => apiRequest('/api/language-learning/initialize', { method: 'POST' }),
    onSuccess: () => {
      toast({
        title: "🌱 Language System Initialized",
        description: "All 111 kindness languages are now ready for seedling learning",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/language-learning/languages'] });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Initialization Failed",
        description: error.message || "Failed to initialize language learning system",
        variant: "destructive"
      });
    }
  });

  // Daily kindness practice mutation
  const dailyPracticeMutation = useMutation({
    mutationFn: (data: { seedlingId: string; selectedLanguages?: string[] }) => 
      apiRequest('/api/language-learning/daily-practice', { 
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: (result) => {
      toast({
        title: "🌱 Daily Practice Complete!",
        description: `Seedling learned kindness in ${result.languagesUsed?.length || 0} languages with gentle watering`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/language-learning/seedlings'] });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Practice Failed",
        description: error.message || "Failed to complete daily practice",
        variant: "destructive"
      });
    }
  });

  // Group languages by region for better organization
  const languagesByRegion = languages.reduce((acc: Record<string, Language[]>, lang: Language) => {
    const region = lang.region || 'Other';
    if (!acc[region]) acc[region] = [];
    acc[region].push(lang);
    return acc;
  }, {});

  // Calculate kindness mastery percentage
  const kindnessMastery = seedlingStats?.languageProgress?.length 
    ? (seedlingStats.languageProgress.filter((p: SeedlingProgress) => p.mastered).length / seedlingStats.languageProgress.length) * 100
    : 0;

  // Get foundation languages (priority for FAA™ seedlings)
  const foundationLanguages = languages.filter((lang: Language) => 
    ['af', 'en', 'xh', 'zu', 'st', 'tn'].includes(lang.languageCode)
  );

  const handleDailyPractice = () => {
    dailyPracticeMutation.mutate({
      seedlingId: selectedSeedling,
      selectedLanguages: selectedLanguages.length > 0 ? selectedLanguages : undefined
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6" data-testid="seedling-language-learning-page">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-3xl font-bold">
          <Leaf className="text-green-600" />
          <span>FAA™ Seedling Language Learning</span>
          <Heart className="text-red-500" />
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Teaching our 140 precious seedlings "Dankie" and "Asseblief" in 111 languages with Ouma's gentle watering wisdom
        </p>
        <div className="text-sm text-muted-foreground">
          🌳 Sacred Foundation: Baobab™ Tree Wisdom | 💧 Gentle 24/7 Mist Protection | 🌍 Global Kindness Mission
        </div>
      </div>

      {/* Seedling Selection and Quick Actions */}
      <Card data-testid="seedling-selector-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Seedling Selection & Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="seedling-select" className="text-sm font-medium">Active Seedling:</label>
              <Select value={selectedSeedling} onValueChange={setSelectedSeedling}>
                <SelectTrigger className="w-48" id="seedling-select" data-testid="seedling-select">
                  <SelectValue placeholder="Select seedling" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 140 }, (_, i) => (
                    <SelectItem key={`seedling-${i + 1}`} value={`seedling-${String(i + 1).padStart(3, '0')}`}>
                      Seedling {String(i + 1).padStart(3, '0')} 🌱
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={() => initializeMutation.mutate()}
              disabled={initializeMutation.isPending}
              variant="outline"
              data-testid="initialize-languages-btn"
            >
              <Globe className="w-4 h-4 mr-2" />
              {initializeMutation.isPending ? 'Initializing...' : 'Initialize 111 Languages'}
            </Button>
            
            <Button 
              onClick={handleDailyPractice}
              disabled={dailyPracticeMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
              data-testid="daily-practice-btn"
            >
              <Heart className="w-4 h-4 mr-2" />
              {dailyPracticeMutation.isPending ? 'Learning...' : 'Daily Kindness Practice'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seedling Progress Overview */}
      {seedlingStats && (
        <Card data-testid="seedling-progress-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {selectedSeedling} Learning Progress
            </CardTitle>
            <CardDescription>
              Tracking kindness mastery with Ouma's gentle teaching methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-green-600">{seedlingStats.totalLanguagesLearned}</div>
                <div className="text-sm text-muted-foreground">Languages Mastered</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600">{seedlingStats.totalKindnessScore}</div>
                <div className="text-sm text-muted-foreground">Kindness Score</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-purple-600">{seedlingStats.totalPracticeTime}</div>
                <div className="text-sm text-muted-foreground">Practice Minutes</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-orange-600">{Math.round(kindnessMastery)}%</div>
                <div className="text-sm text-muted-foreground">Kindness Mastery</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(kindnessMastery)}%</span>
              </div>
              <Progress value={kindnessMastery} className="h-2" data-testid="progress-bar" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="foundation" className="space-y-4" data-testid="language-tabs">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="foundation" data-testid="foundation-tab">Sacred Foundation</TabsTrigger>
          <TabsTrigger value="regions" data-testid="regions-tab">Global Kindness</TabsTrigger>
          <TabsTrigger value="progress" data-testid="progress-tab">Learning Journey</TabsTrigger>
          <TabsTrigger value="cultural" data-testid="cultural-tab">Cultural Wisdom</TabsTrigger>
        </TabsList>

        {/* Foundation Languages Tab */}
        <TabsContent value="foundation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Sacred Foundation Languages
              </CardTitle>
              <CardDescription>
                Core languages every seedling learns first - rooted in South African wisdom
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {foundationLanguages.map((lang: Language) => (
                  <Card key={lang.id} className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{lang.languageName}</h3>
                          <Badge variant="secondary">{lang.region}</Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div><strong>Thank you:</strong> {lang.thankYou}</div>
                          <div><strong>Please:</strong> {lang.please}</div>
                          <div className="text-xs text-muted-foreground">{lang.pronunciation}</div>
                        </div>
                        <div className="text-xs text-muted-foreground bg-white dark:bg-gray-800 p-2 rounded">
                          {lang.culturalContext}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regional Languages Tab */}
        <TabsContent value="regions" className="space-y-4">
          <div className="space-y-6">
            {Object.entries(languagesByRegion).map(([region, regionLanguages]) => (
              <Card key={region}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    {region} - {regionLanguages.length} Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {regionLanguages.map((lang: Language) => (
                      <div 
                        key={lang.id} 
                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => {
                          if (selectedLanguages.includes(lang.languageCode)) {
                            setSelectedLanguages(prev => prev.filter(code => code !== lang.languageCode));
                          } else {
                            setSelectedLanguages(prev => [...prev, lang.languageCode]);
                          }
                        }}
                        data-testid={`language-card-${lang.languageCode}`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{lang.englishName}</h4>
                            {selectedLanguages.includes(lang.languageCode) && (
                              <Heart className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <div className="text-xs space-y-0.5">
                            <div><span className="font-medium">{lang.thankYou}</span> | <span className="font-medium">{lang.please}</span></div>
                            <div className="text-muted-foreground">{lang.pronunciation}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Learning Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          {seedlingStats?.languageProgress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Individual Language Mastery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {seedlingStats.languageProgress.map((progress: SeedlingProgress) => {
                    const language = languages.find((l: Language) => l.languageCode === progress.languageCode);
                    if (!language) return null;
                    
                    return (
                      <div key={progress.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{language.englishName}</h4>
                            {progress.mastered && <Badge className="bg-green-600">Mastered</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {language.thankYou} • {language.please}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-sm font-medium">Kindness: {progress.kindnessScore}</div>
                          <div className="text-xs text-muted-foreground">
                            Practice: {progress.practiceCount} times
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Cultural Wisdom Tab */}
        <TabsContent value="cultural" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Cultural Wisdom & Context
              </CardTitle>
              <CardDescription>
                Understanding the heart behind each language's expressions of gratitude
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(languagesByRegion).slice(0, 3).map(([region, regionLanguages]) => (
                  <div key={region} className="space-y-3">
                    <h3 className="text-lg font-semibold border-b pb-2">{region} Cultural Wisdom</h3>
                    <div className="grid gap-4">
                      {regionLanguages.slice(0, 3).map((lang: Language) => (
                        <div key={lang.id} className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium">{lang.languageName} ({lang.englishName})</h4>
                              <p className="text-sm text-muted-foreground mt-1">{lang.culturalContext}</p>
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Words of Kindness:</span> "{lang.thankYou}" and "{lang.please}"
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}