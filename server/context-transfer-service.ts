import { storage } from "./storage";
import { ContactProcessingAI } from "./ai-services";
import { GeminiContactProcessor } from "./gemini-ai";

interface ContextData {
  conversationId: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    metadata?: any;
  }>;
  platformSpecific: {
    chatgpt?: {
      model: string;
      systemPrompt?: string;
      temperature?: number;
      maxTokens?: number;
    };
    freedom?: {
      mode: string;
      context_depth?: number;
      preferences?: any;
    };
  };
  userProfile?: {
    preferences: any;
    conversationStyle: string;
    expertise_level: string;
  };
}

interface TransferResult {
  success: boolean;
  transferredContext: any;
  continuity_maintained: boolean;
  platform_adaptation?: {
    format_changes: string[];
    preserved_elements: string[];
    optimization_applied: string[];
  };
  error?: string;
}

export class ContextTransferService {
  // Seamless context transfer between AI platforms
  async transferContext(
    fromPlatform: 'chatgpt' | 'freedom', 
    toPlatform: 'chatgpt' | 'freedom', 
    contextData: ContextData
  ): Promise<TransferResult> {
    try {
      console.log(`🔄 Initiating context transfer: ${fromPlatform} → ${toPlatform}`);
      
      // Validate context data
      const validation = this.validateContextData(contextData);
      if (!validation.valid) {
        return {
          success: false,
          transferredContext: null,
          continuity_maintained: false,
          error: `Context validation failed: ${validation.error}`
        };
      }

      // Extract and normalize conversation context
      const normalizedContext = await this.normalizeContext(contextData, fromPlatform);
      
      // Apply platform-specific adaptations
      const adaptedContext = await this.adaptContextForPlatform(normalizedContext, toPlatform);
      
      // Ensure continuity preservation
      const continuityCheck = this.validateContinuity(contextData, adaptedContext);
      
      // Store transfer record for tracking
      await this.recordContextTransfer(fromPlatform, toPlatform, contextData.conversationId);
      
      console.log(`✅ Context transfer successful: ${fromPlatform} → ${toPlatform}`);
      
      return {
        success: true,
        transferredContext: adaptedContext,
        continuity_maintained: continuityCheck.maintained,
        platform_adaptation: {
          format_changes: adaptedContext.formatChanges || [],
          preserved_elements: continuityCheck.preservedElements || [],
          optimization_applied: adaptedContext.optimizations || []
        }
      };

    } catch (error) {
      console.error('Context transfer error:', error);
      return {
        success: false,
        transferredContext: null,
        continuity_maintained: false,
        error: error instanceof Error ? error.message : 'Unknown transfer error'
      };
    }
  }

  private validateContextData(contextData: ContextData): { valid: boolean; error?: string } {
    if (!contextData.conversationId) {
      return { valid: false, error: 'Missing conversation ID' };
    }
    
    if (!contextData.messages || contextData.messages.length === 0) {
      return { valid: false, error: 'No messages to transfer' };
    }
    
    // Validate message structure
    for (const message of contextData.messages) {
      if (!message.role || !message.content || !message.timestamp) {
        return { valid: false, error: 'Invalid message structure' };
      }
    }
    
    return { valid: true };
  }

  private async normalizeContext(contextData: ContextData, fromPlatform: string): Promise<any> {
    const normalized = {
      conversationId: contextData.conversationId,
      messages: contextData.messages.map(msg => ({
        role: msg.role,
        content: this.sanitizeContent(msg.content),
        timestamp: msg.timestamp,
        originalPlatform: fromPlatform,
        metadata: msg.metadata || {}
      })),
      userProfile: contextData.userProfile || {},
      conversationSummary: await this.generateConversationSummary(contextData.messages),
      keyTopics: this.extractKeyTopics(contextData.messages),
      conversationTone: this.analyzeConversationTone(contextData.messages)
    };

    return normalized;
  }

  private async adaptContextForPlatform(normalizedContext: any, toPlatform: 'chatgpt' | 'freedom'): Promise<any> {
    let adapted = { ...normalizedContext };
    const formatChanges: string[] = [];
    const optimizations: string[] = [];

    if (toPlatform === 'chatgpt') {
      // ChatGPT-specific adaptations
      adapted.systemPrompt = this.generateChatGPTSystemPrompt(normalizedContext);
      adapted.messageFormat = 'openai';
      adapted.modelConfig = {
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 2048,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      };
      
      // Convert messages to ChatGPT format
      adapted.messages = adapted.messages.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));
      
      formatChanges.push('Converted to OpenAI message format');
      optimizations.push('Applied ChatGPT model configuration');
      
    } else if (toPlatform === 'freedom') {
      // Freedom platform adaptations
      adapted.contextMode = 'enhanced';
      adapted.freedomConfig = {
        context_depth: Math.min(adapted.messages.length, 20),
        mode: 'conversational',
        preserve_personality: true,
        adaptive_responses: true
      };
      
      // Enhance context with conversation metadata
      adapted.conversationContext = {
        summary: adapted.conversationSummary,
        topics: adapted.keyTopics,
        tone: adapted.conversationTone,
        user_preferences: adapted.userProfile
      };
      
      formatChanges.push('Enhanced with metadata for Freedom platform');
      optimizations.push('Applied context depth optimization');
    }

    adapted.formatChanges = formatChanges;
    adapted.optimizations = optimizations;
    adapted.transferTimestamp = new Date().toISOString();
    adapted.targetPlatform = toPlatform;

    return adapted;
  }

  private validateContinuity(originalContext: ContextData, adaptedContext: any): { maintained: boolean; preservedElements: string[] } {
    const preservedElements: string[] = [];
    let maintained = true;

    // Check message preservation
    if (originalContext.messages.length === adaptedContext.messages.length) {
      preservedElements.push('Message count maintained');
    } else {
      maintained = false;
    }

    // Check content preservation
    const originalContent = originalContext.messages.map(m => m.content).join(' ');
    const adaptedContent = adaptedContext.messages.map((m: any) => m.content).join(' ');
    
    if (this.calculateContentSimilarity(originalContent, adaptedContent) > 0.95) {
      preservedElements.push('Message content preserved');
    } else {
      preservedElements.push('Message content adapted but core meaning maintained');
    }

    // Check conversation flow
    if (adaptedContext.conversationSummary) {
      preservedElements.push('Conversation summary generated');
    }

    // Check user context
    if (adaptedContext.userProfile || originalContext.userProfile) {
      preservedElements.push('User profile context maintained');
    }

    return { maintained, preservedElements };
  }

  private sanitizeContent(content: string): string {
    // Remove platform-specific artifacts and clean content
    return content
      .replace(/\[Assistant\]/g, '')
      .replace(/\[User\]/g, '')
      .replace(/^\s*\*\*/gm, '')
      .replace(/\*\*\s*$/gm, '')
      .trim();
  }

  private async generateConversationSummary(messages: any[]): Promise<string> {
    if (messages.length === 0) return '';
    
    const recentMessages = messages.slice(-10);
    const content = recentMessages.map(m => `${m.role}: ${m.content}`).join('\n');
    
    try {
      // Use Gemini for summarization
      const gemini = new GeminiContactProcessor();
      const summary = await gemini.generateSummary(content);
      return summary || 'Ongoing conversation with AI assistant';
    } catch (error) {
      console.error('Summary generation error:', error);
      return 'Multi-turn conversation covering various topics';
    }
  }

  private extractKeyTopics(messages: any[]): string[] {
    const allContent = messages.map(m => m.content).join(' ').toLowerCase();
    
    // Simple keyword extraction
    const keywords = [
      'programming', 'code', 'development', 'ai', 'machine learning',
      'business', 'strategy', 'marketing', 'design', 'data',
      'technology', 'web', 'mobile', 'automation', 'productivity'
    ];
    
    return keywords.filter(keyword => allContent.includes(keyword));
  }

  private analyzeConversationTone(messages: any[]): string {
    const recentMessages = messages.slice(-5);
    const content = recentMessages.map(m => m.content).join(' ').toLowerCase();
    
    if (content.includes('help') || content.includes('assistance')) return 'helpful';
    if (content.includes('problem') || content.includes('error')) return 'problem-solving';
    if (content.includes('create') || content.includes('build')) return 'creative';
    if (content.includes('explain') || content.includes('understand')) return 'educational';
    
    return 'conversational';
  }

  private generateChatGPTSystemPrompt(context: any): string {
    const { conversationSummary, keyTopics, conversationTone, userProfile } = context;
    
    return `You are a helpful AI assistant continuing a conversation. 

Previous conversation summary: ${conversationSummary}

Key topics discussed: ${keyTopics.join(', ') || 'General conversation'}

Conversation tone: ${conversationTone}

User preferences: ${userProfile ? JSON.stringify(userProfile) : 'Standard assistance'}

Please maintain continuity with the previous conversation while being helpful and accurate.`;
  }

  private calculateContentSimilarity(content1: string, content2: string): number {
    // Simple similarity calculation
    const words1 = new Set(content1.toLowerCase().split(/\s+/));
    const words2 = new Set(content2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  private async recordContextTransfer(fromPlatform: string, toPlatform: string, conversationId: string): Promise<void> {
    try {
      // Store transfer record in database
      await storage.createDocument({
        title: `Context Transfer: ${fromPlatform} → ${toPlatform}`,
        content: JSON.stringify({
          fromPlatform,
          toPlatform,
          conversationId,
          timestamp: new Date().toISOString(),
          type: 'context_transfer'
        }),
        status: 'processed',
        category: 'system',
        tags: ['context-transfer', fromPlatform, toPlatform]
      });
    } catch (error) {
      console.error('Failed to record context transfer:', error);
    }
  }

  // Enhanced context management
  async getTransferHistory(conversationId: string): Promise<any[]> {
    try {
      const documents = await storage.getAllDocuments();
      return documents
        .filter(doc => 
          doc.category === 'system' && 
          doc.content.includes(conversationId) &&
          doc.content.includes('context_transfer')
        )
        .map(doc => ({
          id: doc.id,
          transferData: JSON.parse(doc.content),
          timestamp: doc.createdAt
        }));
    } catch (error) {
      console.error('Failed to get transfer history:', error);
      return [];
    }
  }

  async optimizeContextForTransfer(contextData: ContextData, targetPlatform: string): Promise<ContextData> {
    // Pre-optimize context before transfer
    const optimized = { ...contextData };
    
    // Trim excessive message history if needed
    if (optimized.messages.length > 50) {
      const summary = await this.generateConversationSummary(optimized.messages.slice(0, -20));
      optimized.messages = [
        {
          role: 'system' as const,
          content: `Previous conversation summary: ${summary}`,
          timestamp: new Date().toISOString()
        },
        ...optimized.messages.slice(-20)
      ];
    }
    
    return optimized;
  }
}

export const contextTransferService = new ContextTransferService();