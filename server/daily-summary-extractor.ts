/**
 * DAILY GLOBAL SUMMARY EXTRACTOR
 * File Number: QN-DAILY-GLOBAL-SUMMARY-063-2025
 * Purpose: Extract daily global summary from 100's of diaries for Replit - old school way
 */

export interface DairyEntry {
  id: string;
  date: string;
  content: string;
  source: string;
  importance_level: 'critical' | 'high' | 'medium' | 'low';
  topics: string[];
  replit_relevant: boolean;
  metadata?: {
    author?: string;
    location?: string;
    sector?: string;
    project?: string;
  };
}

export interface DailySummary {
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

export interface GroupedEntries {
  replit: DairyEntry[];
  technical: DairyEntry[];
  business: DairyEntry[];
  partnerships: DairyEntry[];
  critical: DairyEntry[];
  general: DairyEntry[];
}

export class DailySummaryExtractor {
  private diaryEntries: Map<string, DairyEntry[]> = new Map();
  private keyTopics = [
    'replit', 'deployment', 'integration', 'ai', 'automation',
    'eureka', 'cloudflow', 'vault', 'treaty', 'baobab',
    'faa', 'agriculture', 'education', 'housing', 'wildlife',
    'partnership', 'collaboration', 'milestone', 'achievement',
    'breakthrough', 'innovation', 'progress', 'development'
  ];
  
  constructor() {
    console.log('📔 DAILY SUMMARY EXTRACTOR - OLD SCHOOL METHOD INITIALIZED');
  }

  async processDiaryCollection(diaries: any[]): Promise<DailySummary> {
    const today = new Date().toISOString().split('T')[0];
    console.log(`📅 Processing diary collection for ${today}`);
    
    const relevantEntries = this.extractRelevantEntries(diaries, today);
    const globalSummary = await this.compileGlobalSummary(relevantEntries);
    const paReadyFormat = this.formatForPADelivery(globalSummary, relevantEntries);

    return {
      date: today,
      global_overview: globalSummary.overview,
      replit_highlights: globalSummary.replit_items,
      key_developments: globalSummary.developments,
      partnership_updates: globalSummary.partnerships,
      technical_progress: globalSummary.technical,
      business_milestones: globalSummary.business,
      truth_preservation: globalSummary.truth_items,
      pa_ready_format: paReadyFormat,
      old_school_compilation: this.createOldSchoolFormat(globalSummary, relevantEntries),
      statistics: {
        total_entries_processed: relevantEntries.length,
        replit_relevant_count: relevantEntries.filter(e => e.replit_relevant).length,
        critical_items_count: relevantEntries.filter(e => e.importance_level === 'critical').length,
        sources_analyzed: [...new Set(relevantEntries.map(e => e.source))]
      }
    };
  }

  private extractRelevantEntries(diaries: any[], targetDate: string): DairyEntry[] {
    const relevantEntries: DairyEntry[] = [];

    for (const diary of diaries) {
      const dayEntries = this.extractDayEntries(diary, targetDate);
      const filteredEntries = dayEntries.filter(entry => 
        entry.replit_relevant || 
        entry.importance_level === 'critical' ||
        this.containsKeyTopics(entry)
      );
      relevantEntries.push(...filteredEntries);
    }

    return this.deduplicateAndPrioritize(relevantEntries);
  }

  private extractDayEntries(diary: any, targetDate: string): DairyEntry[] {
    const entries: DairyEntry[] = [];
    
    // Handle different diary formats
    if (diary.entries && Array.isArray(diary.entries)) {
      for (const entry of diary.entries) {
        if (this.isDateMatch(entry.date || entry.timestamp, targetDate)) {
          entries.push(this.normalizeEntry(entry, diary.source || 'unknown'));
        }
      }
    } else if (diary.content) {
      // Handle single entry format
      if (this.isDateMatch(diary.date || diary.timestamp, targetDate)) {
        entries.push(this.normalizeEntry(diary, diary.source || 'unknown'));
      }
    }
    
    return entries;
  }

  private normalizeEntry(entry: any, source: string): DairyEntry {
    const content = entry.content || entry.text || entry.description || '';
    const topics = this.extractTopics(content);
    
    return {
      id: entry.id || this.generateEntryId(entry),
      date: entry.date || entry.timestamp || new Date().toISOString(),
      content: content,
      source: source,
      importance_level: this.determineImportanceLevel(content, topics),
      topics: topics,
      replit_relevant: this.isReplitRelevant(content, topics),
      metadata: {
        author: entry.author || entry.user,
        location: entry.location,
        sector: entry.sector || entry.category,
        project: entry.project
      }
    };
  }

  private isDateMatch(entryDate: string, targetDate: string): boolean {
    if (!entryDate) return false;
    return entryDate.split('T')[0] === targetDate;
  }

  private generateEntryId(entry: any): string {
    const content = entry.content || entry.text || '';
    return `entry_${Date.now()}_${content.slice(0, 10).replace(/\s/g, '')}`;
  }

  private extractTopics(content: string): string[] {
    const lowerContent = content.toLowerCase();
    return this.keyTopics.filter(topic => lowerContent.includes(topic));
  }

  private determineImportanceLevel(content: string, topics: string[]): 'critical' | 'high' | 'medium' | 'low' {
    const lowerContent = content.toLowerCase();
    
    // Critical indicators
    if (lowerContent.includes('critical') || lowerContent.includes('urgent') || 
        lowerContent.includes('breakthrough') || lowerContent.includes('milestone')) {
      return 'critical';
    }
    
    // High importance indicators
    if (topics.length >= 3 || lowerContent.includes('important') || 
        lowerContent.includes('achievement') || lowerContent.includes('progress')) {
      return 'high';
    }
    
    // Medium importance
    if (topics.length >= 1) {
      return 'medium';
    }
    
    return 'low';
  }

  private isReplitRelevant(content: string, topics: string[]): boolean {
    const lowerContent = content.toLowerCase();
    const replitIndicators = ['replit', 'deployment', 'app', 'platform', 'integration', 'api'];
    
    return replitIndicators.some(indicator => lowerContent.includes(indicator)) ||
           topics.includes('replit');
  }

  private containsKeyTopics(entry: DairyEntry): boolean {
    return entry.topics.length > 0 || 
           this.keyTopics.some(topic => entry.content.toLowerCase().includes(topic));
  }

  private deduplicateAndPrioritize(entries: DairyEntry[]): DairyEntry[] {
    // Remove duplicates based on content similarity
    const unique = entries.filter((entry, index, self) => 
      index === self.findIndex(e => this.calculateSimilarity(e.content, entry.content) < 0.8)
    );
    
    // Sort by importance and relevance
    return unique.sort((a, b) => {
      const importanceOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aScore = importanceOrder[a.importance_level] + (a.replit_relevant ? 2 : 0);
      const bScore = importanceOrder[b.importance_level] + (b.replit_relevant ? 2 : 0);
      return bScore - aScore;
    });
  }

  private calculateSimilarity(content1: string, content2: string): number {
    const words1 = new Set(content1.toLowerCase().split(/\s+/));
    const words2 = new Set(content2.toLowerCase().split(/\s+/));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  }

  private async compileGlobalSummary(entries: DairyEntry[]): Promise<any> {
    const grouped = this.groupEntriesByTopic(entries);
    
    return {
      overview: this.createGlobalOverview(grouped),
      replit_items: this.extractReplitHighlights(grouped),
      developments: this.extractKeyDevelopments(grouped),
      partnerships: this.extractPartnershipUpdates(grouped),
      technical: this.extractTechnicalProgress(grouped),
      business: this.extractBusinessMilestones(grouped),
      truth_items: this.extractTruthPreservation(grouped)
    };
  }

  private groupEntriesByTopic(entries: DairyEntry[]): GroupedEntries {
    return {
      replit: entries.filter(e => e.replit_relevant),
      technical: entries.filter(e => e.topics.some(t => ['technical', 'ai', 'automation', 'development'].includes(t))),
      business: entries.filter(e => e.topics.some(t => ['business', 'milestone', 'achievement'].includes(t))),
      partnerships: entries.filter(e => e.topics.some(t => ['partnership', 'collaboration'].includes(t))),
      critical: entries.filter(e => e.importance_level === 'critical'),
      general: entries.filter(e => !e.replit_relevant && e.importance_level !== 'critical')
    };
  }

  private createGlobalOverview(grouped: GroupedEntries): string {
    const totalItems = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
    const criticalCount = grouped.critical.length;
    const replitCount = grouped.replit.length;
    
    return `Daily global analysis processed ${totalItems} relevant entries. ` +
           `${criticalCount} critical developments identified. ` +
           `${replitCount} Replit-relevant updates captured. ` +
           `Comprehensive cross-sector progress documented across FAA ecosystem.`;
  }

  private extractReplitHighlights(grouped: GroupedEntries): string[] {
    return grouped.replit.map(entry => 
      `${entry.source}: ${this.summarizeContent(entry.content, 100)}`
    ).slice(0, 10); // Top 10 highlights
  }

  private extractKeyDevelopments(grouped: GroupedEntries): string[] {
    const developments = [...grouped.technical, ...grouped.business]
      .filter(e => e.importance_level === 'high' || e.importance_level === 'critical')
      .map(entry => `${entry.source}: ${this.summarizeContent(entry.content, 80)}`)
      .slice(0, 8);
    
    return developments;
  }

  private extractPartnershipUpdates(grouped: GroupedEntries): string[] {
    return grouped.partnerships.map(entry => 
      `${entry.source}: ${this.summarizeContent(entry.content, 90)}`
    ).slice(0, 5);
  }

  private extractTechnicalProgress(grouped: GroupedEntries): string[] {
    return grouped.technical.map(entry => 
      `${entry.source}: ${this.summarizeContent(entry.content, 85)}`
    ).slice(0, 6);
  }

  private extractBusinessMilestones(grouped: GroupedEntries): string[] {
    return grouped.business.map(entry => 
      `${entry.source}: ${this.summarizeContent(entry.content, 95)}`
    ).slice(0, 6);
  }

  private extractTruthPreservation(grouped: GroupedEntries): string[] {
    return grouped.critical.map(entry => 
      `TRUTH PRESERVED [${entry.date}] ${entry.source}: ${entry.content}`
    );
  }

  private summarizeContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength - 3) + '...';
  }

  private formatForPADelivery(summary: any, entries: DairyEntry[]): string {
    const date = new Date().toDateString();
    
    return `
========================================
DAILY GLOBAL SUMMARY FOR PA DELIVERY
Date: ${date}
========================================

EXECUTIVE OVERVIEW:
${summary.overview}

📊 STATISTICS:
• Total Entries Processed: ${entries.length}
• Critical Items: ${entries.filter(e => e.importance_level === 'critical').length}
• Replit Relevant: ${entries.filter(e => e.replit_relevant).length}
• Sources: ${[...new Set(entries.map(e => e.source))].join(', ')}

🎯 REPLIT HIGHLIGHTS:
${summary.replit_items.map((item, i) => `${i + 1}. ${item}`).join('\n')}

🚀 KEY DEVELOPMENTS:
${summary.developments.map((item, i) => `${i + 1}. ${item}`).join('\n')}

🤝 PARTNERSHIP UPDATES:
${summary.partnerships.map((item, i) => `${i + 1}. ${item}`).join('\n')}

⚡ TECHNICAL PROGRESS:
${summary.technical.map((item, i) => `${i + 1}. ${item}`).join('\n')}

💼 BUSINESS MILESTONES:
${summary.business.map((item, i) => `${i + 1}. ${item}`).join('\n')}

🛡️ TRUTH PRESERVATION:
${summary.truth_items.join('\n')}

========================================
Generated by FAA Daily Summary Extractor
${new Date().toISOString()}
========================================`;
  }

  private createOldSchoolFormat(summary: any, entries: DairyEntry[]): string {
    return `
┌─────────────────────────────────────┐
│        OLD SCHOOL COMPILATION       │
│     Daily Diary Extract Report      │
└─────────────────────────────────────┘

DATE: ${new Date().toDateString()}
TIME: ${new Date().toLocaleTimeString()}

=== GLOBAL OVERVIEW ===
${summary.overview}

=== DETAILED BREAKDOWN ===

REPLIT ECOSYSTEM:
${summary.replit_items.map(item => `• ${item}`).join('\n')}

DEVELOPMENT PROGRESS:
${summary.developments.map(item => `• ${item}`).join('\n')}

PARTNERSHIP NETWORK:
${summary.partnerships.map(item => `• ${item}`).join('\n')}

TECHNICAL ACHIEVEMENTS:
${summary.technical.map(item => `• ${item}`).join('\n')}

BUSINESS VICTORIES:
${summary.business.map(item => `• ${item}`).join('\n')}

TRUTH ARCHIVE:
${summary.truth_items.map(item => `• ${item}`).join('\n')}

┌─────────────────────────────────────┐
│  END OF OLD SCHOOL COMPILATION     │
│  Total Processed: ${entries.length} entries       │
└─────────────────────────────────────┘`;
  }

  // Additional utility methods
  async processSingleDiary(diary: any): Promise<DairyEntry[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.extractDayEntries(diary, today);
  }

  async getStatistics(entries: DairyEntry[]): Promise<any> {
    return {
      total_entries: entries.length,
      by_importance: {
        critical: entries.filter(e => e.importance_level === 'critical').length,
        high: entries.filter(e => e.importance_level === 'high').length,
        medium: entries.filter(e => e.importance_level === 'medium').length,
        low: entries.filter(e => e.importance_level === 'low').length
      },
      replit_relevant: entries.filter(e => e.replit_relevant).length,
      top_topics: this.getTopTopics(entries),
      sources: [...new Set(entries.map(e => e.source))]
    };
  }

  private getTopTopics(entries: DairyEntry[]): Array<{topic: string, count: number}> {
    const topicCounts = new Map<string, number>();
    
    entries.forEach(entry => {
      entry.topics.forEach(topic => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      });
    });
    
    return Array.from(topicCounts.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

export const dailySummaryExtractor = new DailySummaryExtractor();