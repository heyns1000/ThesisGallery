// AI-powered OmniLevel Sector Recommendation Engine
import { allSectorsData, sectorList } from '@/components/portal/omnilevel-selector';

export interface RecommendationScore {
  sectorKey: string;
  score: number;
  reasoning: string[];
  confidence: number;
  category: 'synergy' | 'complementary' | 'expansion' | 'strategic';
}

export interface UserProfile {
  selectedSectors: string[];
  searchHistory: string[];
  interactionHistory: { sectorKey: string; timestamp: number; action: string }[];
  preferences: {
    riskTolerance: 'low' | 'medium' | 'high';
    focusAreas: string[];
    businessStage: 'startup' | 'growth' | 'mature' | 'enterprise';
  };
}

export class RecommendationEngine {
  private sectorKeywords: Map<string, string[]> = new Map();
  private sectorRelationships: Map<string, Set<string>> = new Map();
  private brandNetworks: Map<string, Set<string>> = new Map();

  constructor() {
    this.initializeKnowledgeBase();
  }

  private initializeKnowledgeBase() {
    // Build sector keywords and relationships from the omnilevel data
    Object.entries(allSectorsData).forEach(([key, sector]: [string, any]) => {
      const keywords = [
        ...sector.brands.map((b: any) => b.name.toLowerCase()),
        ...sector.brands.flatMap((b: any) => b.subnodes.map((s: string) => s.toLowerCase())),
        sector.name.toLowerCase(),
        sector.repoName.toLowerCase(),
        sector.baseUrl.toLowerCase()
      ];
      
      this.sectorKeywords.set(key, keywords);
      
      // Build brand networks for cross-sector analysis
      const brandNames = sector.brands.map((b: any) => b.name.toLowerCase());
      this.brandNetworks.set(key, new Set(brandNames));
      
      // Initialize relationships
      this.sectorRelationships.set(key, new Set());
    });

    // Build intelligent sector relationships
    this.buildSectorRelationships();
  }

  private buildSectorRelationships() {
    const sectorKeys = Object.keys(allSectorsData);
    
    // Analyze keyword overlaps and common technologies
    sectorKeys.forEach(sectorA => {
      const keywordsA = this.sectorKeywords.get(sectorA) || [];
      const relationshipsA = this.sectorRelationships.get(sectorA)!;
      
      sectorKeys.forEach(sectorB => {
        if (sectorA === sectorB) return;
        
        const keywordsB = this.sectorKeywords.get(sectorB) || [];
        
        // Calculate keyword similarity
        const commonKeywords = keywordsA.filter(k => 
          keywordsB.some(kb => k.includes(kb) || kb.includes(k))
        );
        
        // Technology stack analysis
        const techOverlap = this.analyzeTechStackOverlap(sectorA, sectorB);
        
        // Business model compatibility
        const businessCompatibility = this.analyzeBusinessCompatibility(sectorA, sectorB);
        
        if (commonKeywords.length >= 2 || techOverlap > 0.3 || businessCompatibility > 0.4) {
          relationshipsA.add(sectorB);
        }
      });
    });
  }

  private analyzeTechStackOverlap(sectorA: string, sectorB: string): number {
    const sectorAData = allSectorsData[sectorA as keyof typeof allSectorsData];
    const sectorBData = allSectorsData[sectorB as keyof typeof allSectorsData];
    
    if (!sectorAData || !sectorBData) return 0;
    
    const techKeywords = ['vault', 'sync', 'flow', 'mesh', 'track', 'net', 'link', 'pulse'];
    
    const sectorATech = sectorAData.brands.flatMap((b: any) => 
      b.subnodes.filter((s: string) => 
        techKeywords.some(tech => s.toLowerCase().includes(tech))
      )
    );
    
    const sectorBTech = sectorBData.brands.flatMap((b: any) => 
      b.subnodes.filter((s: string) => 
        techKeywords.some(tech => s.toLowerCase().includes(tech))
      )
    );
    
    const commonTech = sectorATech.filter((tech: string) => 
      sectorBTech.some((bTech: string) => 
        tech.toLowerCase().includes(bTech.toLowerCase()) || 
        bTech.toLowerCase().includes(tech.toLowerCase())
      )
    );
    
    return commonTech.length / Math.max(sectorATech.length, sectorBTech.length, 1);
  }

  private analyzeBusinessCompatibility(sectorA: string, sectorB: string): number {
    // Business model compatibility matrix
    const compatibilityMatrix: Record<string, string[]> = {
      'agriculture': ['nutrition', 'logistics', 'zerowaste', 'fsf'],
      'banking': ['saas', 'professional', 'payroll-mining'],
      'creative': ['media', 'fashion', 'gaming', 'voice'],
      'logistics': ['agriculture', 'packaging', 'micromesh', 'trade'],
      'health': ['nutrition', 'voice', 'ai-logic', 'professional'],
      'utilities': ['housing', 'zerowaste', 'mining', 'webless'],
      'education-ip': ['knowledge', 'ai-logic', 'professional'],
      'quantum': ['ai-logic', 'utilities', 'gaming'],
      'nft': ['creative', 'gaming', 'trade', 'justice']
    };
    
    const sectorACompat = compatibilityMatrix[sectorA] || [];
    return sectorACompat.includes(sectorB) ? 0.8 : 0.2;
  }

  public generateRecommendations(
    userProfile: UserProfile,
    maxRecommendations: number = 8
  ): RecommendationScore[] {
    const recommendations: RecommendationScore[] = [];
    const selectedSet = new Set(userProfile.selectedSectors);
    
    Object.keys(allSectorsData).forEach(sectorKey => {
      if (selectedSet.has(sectorKey)) return;
      
      const score = this.calculateSectorScore(sectorKey, userProfile);
      if (score.score > 0.3) {
        recommendations.push(score);
      }
    });
    
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, maxRecommendations);
  }

  private calculateSectorScore(sectorKey: string, userProfile: UserProfile): RecommendationScore {
    let score = 0;
    const reasoning: string[] = [];
    let category: RecommendationScore['category'] = 'expansion';
    
    // 1. Synergy Analysis (40% weight)
    const synergyScore = this.analyzeSynergy(sectorKey, userProfile.selectedSectors);
    score += synergyScore * 0.4;
    if (synergyScore > 0.7) {
      reasoning.push(`High synergy with ${userProfile.selectedSectors.length} selected sectors`);
      category = 'synergy';
    }
    
    // 2. User Interest Signals (25% weight)
    const interestScore = this.analyzeUserInterest(sectorKey, userProfile);
    score += interestScore * 0.25;
    if (interestScore > 0.6) {
      reasoning.push('Strong alignment with your search and interaction patterns');
    }
    
    // 3. Strategic Value (20% weight)
    const strategicScore = this.analyzeStrategicValue(sectorKey, userProfile);
    score += strategicScore * 0.2;
    if (strategicScore > 0.7) {
      reasoning.push('High strategic value for business expansion');
      category = 'strategic';
    }
    
    // 4. Complementary Analysis (15% weight)
    const complementaryScore = this.analyzeComplementary(sectorKey, userProfile.selectedSectors);
    score += complementaryScore * 0.15;
    if (complementaryScore > 0.6) {
      reasoning.push('Fills gaps in your current sector portfolio');
      category = 'complementary';
    }
    
    // Calculate confidence based on data quality and relationship strength
    const confidence = Math.min(0.95, 
      (synergyScore * 0.4 + interestScore * 0.3 + strategicScore * 0.3)
    );
    
    return {
      sectorKey,
      score: Math.min(1, score),
      reasoning,
      confidence,
      category
    };
  }

  private analyzeSynergy(targetSector: string, selectedSectors: string[]): number {
    if (selectedSectors.length === 0) return 0.5; // Neutral for first selection
    
    let maxSynergy = 0;
    const targetRelationships = this.sectorRelationships.get(targetSector) || new Set();
    
    selectedSectors.forEach(selectedSector => {
      if (targetRelationships.has(selectedSector)) {
        maxSynergy = Math.max(maxSynergy, 0.8);
      }
      
      // Check for indirect relationships through shared technologies
      const techOverlap = this.analyzeTechStackOverlap(targetSector, selectedSector);
      maxSynergy = Math.max(maxSynergy, techOverlap);
    });
    
    return maxSynergy;
  }

  private analyzeUserInterest(sectorKey: string, userProfile: UserProfile): number {
    let interestScore = 0;
    const sectorKeywords = this.sectorKeywords.get(sectorKey) || [];
    
    // Search history analysis
    userProfile.searchHistory.forEach(query => {
      const queryLower = query.toLowerCase();
      const matchingKeywords = sectorKeywords.filter(keyword => 
        queryLower.includes(keyword) || keyword.includes(queryLower)
      );
      
      if (matchingKeywords.length > 0) {
        interestScore += 0.3 * (matchingKeywords.length / sectorKeywords.length);
      }
    });
    
    // Interaction recency and frequency
    const recentInteractions = userProfile.interactionHistory
      .filter(interaction => Date.now() - interaction.timestamp < 24 * 60 * 60 * 1000) // Last 24 hours
      .filter(interaction => {
        const targetKeywords = this.sectorKeywords.get(interaction.sectorKey) || [];
        return targetKeywords.some(keyword => 
          sectorKeywords.some(sk => sk.includes(keyword) || keyword.includes(sk))
        );
      });
    
    interestScore += Math.min(0.4, recentInteractions.length * 0.1);
    
    return Math.min(1, interestScore);
  }

  private analyzeStrategicValue(sectorKey: string, userProfile: UserProfile): number {
    const sectorData = allSectorsData[sectorKey as keyof typeof allSectorsData];
    if (!sectorData) return 0;
    
    let strategicScore = 0;
    
    // Business stage alignment
    const stageMultipliers: Record<string, Record<string, number>> = {
      'startup': { 'ai-logic': 0.9, 'saas': 0.8, 'creative': 0.7 },
      'growth': { 'logistics': 0.9, 'marketing': 0.8, 'professional': 0.7 },
      'mature': { 'banking': 0.9, 'utilities': 0.8, 'housing': 0.7 },
      'enterprise': { 'quantum': 0.9, 'justice': 0.8, 'admin-panel': 0.7 }
    };
    
    const stageScore = stageMultipliers[userProfile.preferences.businessStage]?.[sectorKey] || 0.5;
    strategicScore += stageScore * 0.4;
    
    // Brand portfolio strength (number of brands and subnodes)
    const brandStrength = sectorData.brands.length / 5; // Normalize to 0-1 scale
    const subnodeStrength = sectorData.brands.reduce((sum: number, brand: any) => 
      sum + brand.subnodes.length, 0) / 20;
    
    strategicScore += (brandStrength + subnodeStrength) * 0.3;
    
    // Market opportunity (based on sector positioning)
    const emergingTech = ['ai-logic', 'quantum', 'webless', 'nft'];
    const established = ['banking', 'utilities', 'logistics', 'professional'];
    
    if (emergingTech.includes(sectorKey)) {
      strategicScore += userProfile.preferences.riskTolerance === 'high' ? 0.3 : 0.1;
    } else if (established.includes(sectorKey)) {
      strategicScore += userProfile.preferences.riskTolerance === 'low' ? 0.3 : 0.2;
    }
    
    return Math.min(1, strategicScore);
  }

  private analyzeComplementary(targetSector: string, selectedSectors: string[]): number {
    if (selectedSectors.length === 0) return 0.5;
    
    // Identify gaps in selected sectors
    const selectedCategories = this.categorizeSectors(selectedSectors);
    const targetCategory = this.categorizeSector(targetSector);
    
    // Higher score if filling a gap
    const hasCategory = selectedCategories.includes(targetCategory);
    const gapFillScore = hasCategory ? 0.3 : 0.8;
    
    // Supply chain completeness
    const supplyChainScore = this.analyzeSupplyChainCompleteness(targetSector, selectedSectors);
    
    return (gapFillScore + supplyChainScore) / 2;
  }

  private categorizeSectors(sectorKeys: string[]): string[] {
    const categories: string[] = [];
    
    sectorKeys.forEach(key => {
      categories.push(this.categorizeSector(key));
    });
    
    return [...new Set(categories)];
  }

  private categorizeSector(sectorKey: string): string {
    const techSectors = ['ai-logic', 'quantum', 'webless', 'voice', 'gaming'];
    const businessSectors = ['banking', 'professional', 'saas', 'payroll-mining'];
    const physicalSectors = ['agriculture', 'logistics', 'housing', 'utilities', 'mining'];
    const creativeSectors = ['creative', 'media', 'fashion', 'ritual'];
    
    if (techSectors.includes(sectorKey)) return 'technology';
    if (businessSectors.includes(sectorKey)) return 'business';
    if (physicalSectors.includes(sectorKey)) return 'physical';
    if (creativeSectors.includes(sectorKey)) return 'creative';
    
    return 'specialized';
  }

  private analyzeSupplyChainCompleteness(targetSector: string, selectedSectors: string[]): number {
    // Supply chain relationships
    const supplyChains: Record<string, string[]> = {
      'agriculture': ['logistics', 'packaging', 'nutrition'],
      'logistics': ['agriculture', 'trade', 'micromesh'],
      'creative': ['media', 'voice', 'marketing'],
      'banking': ['professional', 'saas', 'payroll-mining'],
      'utilities': ['housing', 'zerowaste', 'mining']
    };
    
    const targetChain = supplyChains[targetSector] || [];
    const selectedChainItems = selectedSectors.filter(s => targetChain.includes(s));
    
    return selectedChainItems.length / Math.max(targetChain.length, 1);
  }

  public explainRecommendation(recommendation: RecommendationScore): string {
    const sectorName = sectorList[recommendation.sectorKey as keyof typeof sectorList]?.name || recommendation.sectorKey;
    
    let explanation = `${sectorName} is recommended for your ecosystem because:\n\n`;
    
    recommendation.reasoning.forEach((reason, index) => {
      explanation += `${index + 1}. ${reason}\n`;
    });
    
    explanation += `\nConfidence Level: ${Math.round(recommendation.confidence * 100)}%`;
    explanation += `\nRecommendation Type: ${recommendation.category.charAt(0).toUpperCase() + recommendation.category.slice(1)}`;
    
    return explanation;
  }
}

// Singleton instance
export const recommendationEngine = new RecommendationEngine();