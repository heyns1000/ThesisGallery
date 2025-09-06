import { randomUUID } from "crypto";

// FAA™ Reference Generator
export function generateFaaReference(baseString: string): string {
  const timestamp = Date.now().toString();
  const hash = Buffer.from(`FAA${baseString}${timestamp}`).toString('base64').slice(0, 12).toUpperCase();
  return `FAA${hash}`;
}

// Contact Data Processing AI
export interface ContactProcessingResult {
  processedContact: {
    faaId: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    company?: string;
    position?: string;
    country?: string;
    city?: string;
    industry?: string;
    leadScore: number;
    tags: string[];
  };
  confidence: number;
  suggestions: string[];
}

export class ContactProcessingAI {
  static processUnstructuredContact(rawData: any): ContactProcessingResult {
    const contact = {
      faaId: generateFaaReference(rawData.email || rawData.name || Math.random().toString()),
      firstName: null,
      lastName: null,
      fullName: null,
      email: null,
      phone: null,
      company: null,
      position: null,
      country: null,
      city: null,
      industry: null,
      leadScore: 0,
      tags: [] as string[],
    };

    // Smart data extraction
    if (rawData.name || rawData.fullName) {
      const fullName = rawData.name || rawData.fullName;
      contact.fullName = fullName;
      const nameParts = fullName.split(' ');
      contact.firstName = nameParts[0] || null;
      contact.lastName = nameParts.slice(1).join(' ') || null;
    } else if (rawData.firstName || rawData.lastName) {
      contact.firstName = rawData.firstName || null;
      contact.lastName = rawData.lastName || null;
      contact.fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
    }

    // Email extraction and validation
    contact.email = this.extractEmail(rawData);
    
    // Phone extraction and formatting
    contact.phone = this.extractPhone(rawData);
    
    // Company and position extraction
    contact.company = rawData.company || rawData.organization || rawData.employer || null;
    contact.position = rawData.position || rawData.title || rawData.job || rawData.role || null;
    
    // Location extraction
    contact.country = rawData.country || rawData.nation || null;
    contact.city = rawData.city || rawData.location || null;
    
    // Industry classification
    contact.industry = this.classifyIndustry(contact.company, contact.position);
    
    // Lead scoring
    contact.leadScore = this.calculateLeadScore(contact);
    
    // Auto-tagging
    contact.tags = this.generateTags(contact);

    return {
      processedContact: contact,
      confidence: this.calculateConfidence(contact),
      suggestions: this.generateSuggestions(contact)
    };
  }

  private static extractEmail(data: any): string | null {
    const emailFields = ['email', 'emailAddress', 'mail', 'e_mail'];
    for (const field of emailFields) {
      if (data[field] && this.isValidEmail(data[field])) {
        return data[field].toLowerCase();
      }
    }
    
    // Try to find email pattern in any string field
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        const emailMatch = value.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
        if (emailMatch) {
          return emailMatch[0].toLowerCase();
        }
      }
    }
    
    return null;
  }

  private static extractPhone(data: any): string | null {
    const phoneFields = ['phone', 'phoneNumber', 'tel', 'telephone', 'mobile', 'cell'];
    for (const field of phoneFields) {
      if (data[field]) {
        return this.formatPhone(data[field]);
      }
    }
    
    // Try to find phone pattern in any string field
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        const phoneMatch = value.match(/[\+]?[1-9]?[\d\s\-\(\)]{8,15}/);
        if (phoneMatch) {
          return this.formatPhone(phoneMatch[0]);
        }
      }
    }
    
    return null;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static formatPhone(phone: string): string {
    return phone.replace(/[^\d\+]/g, '');
  }

  private static classifyIndustry(company: string | null, position: string | null): string | null {
    const industryKeywords = {
      'Technology': ['tech', 'software', 'developer', 'engineer', 'IT', 'digital', 'computer'],
      'Healthcare': ['medical', 'health', 'doctor', 'nurse', 'hospital', 'clinic'],
      'Finance': ['bank', 'finance', 'accounting', 'investment', 'insurance'],
      'Education': ['school', 'university', 'teacher', 'education', 'academic'],
      'Retail': ['retail', 'shop', 'store', 'sales', 'commerce'],
      'Manufacturing': ['manufacturing', 'factory', 'production', 'industrial'],
      'Consulting': ['consulting', 'consultant', 'advisory', 'strategy'],
      'Marketing': ['marketing', 'advertising', 'branding', 'promotion'],
    };

    const text = `${company || ''} ${position || ''}`.toLowerCase();
    
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        return industry;
      }
    }
    
    return null;
  }

  private static calculateLeadScore(contact: any): number {
    let score = 0;
    
    // Email quality
    if (contact.email) {
      score += 20;
      if (contact.email.includes('.com') || contact.email.includes('.org')) score += 5;
      if (!contact.email.includes('gmail') && !contact.email.includes('yahoo')) score += 10; // Business email
    }
    
    // Contact completeness
    if (contact.phone) score += 15;
    if (contact.company) score += 20;
    if (contact.position) score += 15;
    if (contact.firstName && contact.lastName) score += 10;
    if (contact.country) score += 5;
    if (contact.industry) score += 10;
    
    return Math.min(100, score);
  }

  private static generateTags(contact: any): string[] {
    const tags: string[] = [];
    
    if (contact.email && contact.email.includes('@gmail')) tags.push('Personal Email');
    if (contact.email && !contact.email.includes('@gmail') && !contact.email.includes('@yahoo')) tags.push('Business Email');
    if (contact.company) tags.push('Business Contact');
    if (contact.leadScore >= 80) tags.push('High Quality Lead');
    if (contact.leadScore >= 50) tags.push('Medium Quality Lead');
    if (contact.leadScore < 50) tags.push('Low Quality Lead');
    if (contact.industry) tags.push(contact.industry);
    
    return tags;
  }

  private static calculateConfidence(contact: any): number {
    let confidence = 0;
    const fields = Object.values(contact).filter(val => val !== null && val !== '');
    confidence = (fields.length / 11) * 100; // 11 total fields
    return Math.round(confidence);
  }

  private static generateSuggestions(contact: any): string[] {
    const suggestions: string[] = [];
    
    if (!contact.email) suggestions.push('Email address missing - consider email lookup');
    if (!contact.phone) suggestions.push('Phone number missing - add for better contact options');
    if (!contact.company) suggestions.push('Company information missing - verify employment');
    if (contact.leadScore < 50) suggestions.push('Low lead score - requires data enrichment');
    if (!contact.industry) suggestions.push('Industry classification needed for better targeting');
    
    return suggestions;
  }
}

// Banimal AI Chatbot
export class BanimalChatbot {
  static async processMessage(message: string, context?: any): Promise<string> {
    const lowerMessage = message.toLowerCase();
    
    // Order tracking
    if (lowerMessage.includes('order') || lowerMessage.includes('track')) {
      return "I can help you track your order! Please provide your order number or email address, and I'll get the latest status for you.";
    }
    
    // Returns and refunds
    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return "Our return policy allows 30 days for returns on unworn items with tags attached. Items must be in original packaging. Returns due to sizing or change of mind require customer to cover return shipping costs. Would you like me to start a return request?";
    }
    
    // Shipping inquiries
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return "We offer same-day dispatch for orders before 12:00 PM with live tracking via BobGo API. Standard shipping takes 2-5 business days. International shipping available with custom rates. Would you like shipping information for a specific location?";
    }
    
    // Product inquiries
    if (lowerMessage.includes('product') || lowerMessage.includes('size') || lowerMessage.includes('color')) {
      return "I can help you find the perfect product! Our size guide is available on each product page with detailed measurements. We offer various colors and styles. What specific product are you interested in?";
    }
    
    // Payment and loyalty
    if (lowerMessage.includes('payment') || lowerMessage.includes('points') || lowerMessage.includes('loyalty')) {
      return "We accept all major payment methods with secure encryption. Earn Banimal Points™ with every purchase - 1 point per R1 spent! Points can be redeemed for discounts on future orders. Would you like to check your current points balance?";
    }
    
    // General greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! Welcome to Banimal™ FAA customer support! I'm here to help with orders, returns, product questions, and more. How can I assist you today?";
    }
    
    // Default response
    return "I'm here to help with your Banimal™ questions! I can assist with:\n• Order tracking and status\n• Returns and refunds\n• Shipping information\n• Product details and sizing\n• Loyalty points and payments\n\nWhat would you like to know?";
  }

  static generateOrderResponse(orderNumber: string): string {
    return `Great! I found order #${orderNumber}. Here's your current status:\n\n📦 Order Status: Processing\n🚚 Shipping: Preparing for dispatch\n📍 Tracking: Will be available once shipped\n⏰ Estimated Delivery: 2-3 business days\n\nYour FAA™ customer ID ensures secure tracking. You'll receive email updates at each stage!`;
  }

  static generateProductRecommendation(category: string): string {
    const recommendations = {
      'clothing': 'Based on your browsing, I recommend our premium collection with sustainable materials!',
      'accessories': 'Our handcrafted accessories collection perfectly complements any outfit!',
      'footwear': 'Check out our comfort-first footwear line with advanced cushioning technology!'
    };
    
    return recommendations[category as keyof typeof recommendations] || 'I can recommend products based on your preferences. What type of items interest you?';
  }
}

// Multi-currency AI
export class CurrencyAI {
  private static rates: Record<string, number> = {
    'ZAR': 1,
    'USD': 0.054,
    'EUR': 0.051,
    'GBP': 0.043,
    'AUD': 0.082,
  };

  static convertCurrency(amount: number, from: string, to: string): number {
    if (from === to) return amount;
    
    // Convert to USD first, then to target currency
    const usdAmount = from === 'USD' ? amount : amount * (this.rates[from] || 1);
    const convertedAmount = to === 'USD' ? usdAmount : usdAmount / (this.rates[to] || 1);
    
    return Math.round(convertedAmount * 100) / 100;
  }

  static formatPrice(amount: number, currency: string): string {
    const symbols: Record<string, string> = {
      'ZAR': 'R',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'AUD': 'A$',
    };
    
    return `${symbols[currency] || currency} ${amount.toFixed(2)}`;
  }

  static detectUserCurrency(countryCode?: string): string {
    const currencyMap: Record<string, string> = {
      'ZA': 'ZAR',
      'US': 'USD',
      'GB': 'GBP',
      'AU': 'AUD',
      'DE': 'EUR',
      'FR': 'EUR',
      'IT': 'EUR',
      'ES': 'EUR',
    };
    
    return currencyMap[countryCode || ''] || 'ZAR';
  }
}

// Holiday and Event AI
export class HolidayAI {
  static getActivePromotions(): Array<{
    name: string;
    description: string;
    discount: number;
    validUntil: string;
  }> {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();
    
    const promotions = [];
    
    // New Year (January)
    if (month === 0) {
      promotions.push({
        name: "New Year Fresh Start",
        description: "Start the year with style - 25% off all collections",
        discount: 25,
        validUntil: "2025-01-31"
      });
    }
    
    // Valentine's Day (February)
    if (month === 1) {
      promotions.push({
        name: "Valentine's Special",
        description: "Love is in the air - 20% off gift sets",
        discount: 20,
        validUntil: "2025-02-14"
      });
    }
    
    // Easter (March/April)
    if (month === 2 || month === 3) {
      promotions.push({
        name: "Easter Celebration",
        description: "Spring into savings - 15% off spring collection",
        discount: 15,
        validUntil: "2025-04-30"
      });
    }
    
    // Black Friday (November)
    if (month === 10) {
      promotions.push({
        name: "Black Friday Mega Sale",
        description: "Biggest sale of the year - Up to 50% off everything",
        discount: 50,
        validUntil: "2025-11-29"
      });
    }
    
    // Christmas (December)
    if (month === 11) {
      promotions.push({
        name: "Christmas Magic",
        description: "Holiday spirit discount - 30% off all items",
        discount: 30,
        validUntil: "2025-12-25"
      });
    }
    
    return promotions;
  }

  static generateHolidayMessage(): string {
    const promotions = this.getActivePromotions();
    if (promotions.length === 0) {
      return "Check back soon for our next seasonal promotion!";
    }
    
    const promo = promotions[0];
    return `🎉 ${promo.name}: ${promo.description} (Valid until ${promo.validUntil})`;
  }
}