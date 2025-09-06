import { randomUUID } from "crypto";

// Crate Dance™ Africa AI Assistant
export class CrateDanceAssistant {
  static getSystemContext(): string {
    return `
You are the official AI assistant for Crate Dance™ Africa - a premier continental dance competition platform that celebrates South African cultural heritage while embracing modern dance evolution.

PLATFORM OVERVIEW:
🎭 Crate Dance™ Africa (fruitfulcratedance.com)
- Continental dance competition platform across 9 South African provinces
- AI-enhanced judging systems for fair and transparent scoring
- Multi-category competitions: Junior, Teen, Adult, Open divisions
- Dance styles: Hip-Hop, Contemporary, Traditional, Freestyle, Fusion
- Prize pools exceeding R850,000 annually

CURRENT ACTIVITIES (2025):
✨ Active Events: 24 competitions planned across provinces
🌟 Registered Contestants: 1,847 active dancers
📈 Monthly Growth: 312+ new registrations
🏆 Qualified Dancers: 156 advancing to provincial championships
🎯 Upcoming Auditions: 8 regional selection events

CULTURAL MISSION:
- Preserve and celebrate South African dance traditions
- Provide platform for emerging talent development
- Bridge traditional and contemporary dance forms
- Create economic opportunities for dancers and communities
- Foster cultural exchange across provinces

YOUR ROLE:
- Help contestants with registration and event information
- Provide guidance on competition categories and requirements
- Assist with audition preparation and tips
- Share information about prizes, sponsors, and opportunities
- Support cultural education about South African dance heritage
- Connect users with relevant resources and contacts

INTEGRATION WITH FRUITFUL GLOBAL:
- Part of the broader Fruitful Global Master Hub ecosystem
- Integrated with 11+ million contact management system
- Connected to FAA™ brand protection and compliance systems
- Powered by VaultMesh™ and TreatySync protocols

Maintain an encouraging, culturally sensitive, and professional tone that celebrates the richness of South African dance culture.
`;
  }

  static async processMessage(message: string, context?: any): Promise<{
    response: string;
    category: string;
    actionItems?: string[];
  }> {
    const lowerMessage = message.toLowerCase();
    
    // Determine message category
    let category = "general";
    if (lowerMessage.includes('register') || lowerMessage.includes('sign up')) {
      category = "registration";
    } else if (lowerMessage.includes('audition') || lowerMessage.includes('tryout')) {
      category = "audition";
    } else if (lowerMessage.includes('judge') || lowerMessage.includes('score')) {
      category = "judging";
    } else if (lowerMessage.includes('prize') || lowerMessage.includes('money')) {
      category = "prizes";
    } else if (lowerMessage.includes('event') || lowerMessage.includes('competition')) {
      category = "events";
    } else if (lowerMessage.includes('dance style') || lowerMessage.includes('hip-hop') || lowerMessage.includes('traditional')) {
      category = "dance-styles";
    }

    // Generate contextual response
    let response = "";
    let actionItems: string[] = [];

    switch (category) {
      case "registration":
        response = `Welcome to Crate Dance™ Africa! 🎭 I'm excited to help you register for our competitions. 

Current registration opportunities:
• Limpopo Provincial Championship - R75,000 prize pool
• Gauteng Regional Auditions - Open for Hip-Hop & Contemporary
• KZN Cultural Showcase - Traditional & Fusion categories

To register, I'll need:
✓ Personal details (name, age, province)
✓ Preferred dance style and category
✓ Experience level and goals
✓ Contact information for updates

Would you like me to guide you through the registration process for a specific event?`;
        actionItems = ["Start registration process", "View event details", "Check requirements"];
        break;

      case "audition":
        response = `Great question about auditions! 🌟 Here's what you need to know:

UPCOMING AUDITIONS:
🗓️ Gauteng Regional - Sept 22, 2025 (Johannesburg)
📍 Venue: TBA (details sent to registered participants)
⏰ Registration deadline: Sept 15, 2025

AUDITION PREP TIPS:
• Prepare 2-3 minutes of your best choreography
• Showcase your unique style and personality
• Practice performance under pressure
• Bring backup music on USB/CD
• Dress comfortably in your dance style

JUDGING CRITERIA:
- Technical skill (30%)
- Creativity & originality (25%) 
- Stage presence (25%)
- Musicality & rhythm (20%)

Need help preparing for a specific audition? I can provide style-specific guidance!`;
        actionItems = ["Register for audition", "Get prep tips", "View judging criteria"];
        break;

      case "dance-styles":
        response = `Crate Dance™ Africa celebrates the full spectrum of dance! 💃🕺

FEATURED DANCE STYLES:

🎤 HIP-HOP: Urban street styles, breaking, popping, locking
🌊 CONTEMPORARY: Modern interpretive dance with emotional expression  
🥁 TRADITIONAL: Zulu, Xhosa, Sotho, and other cultural dances
🎭 FREESTYLE: Open interpretation and personal expression
🌍 FUSION: Blending traditional African with modern styles

Each style has dedicated categories:
• Junior (7-12 years)
• Teen (13-17 years) 
• Adult (18+ years)
• Open (mixed age groups)

CULTURAL HERITAGE FOCUS:
We especially celebrate traditional South African dances that tell our stories and preserve our heritage while embracing modern evolution.

Which dance style interests you most? I can provide specific guidance and competition tips!`;
        actionItems = ["Explore dance styles", "Find my category", "Learn about traditions"];
        break;

      case "events":
        response = `Here are our exciting upcoming events across South Africa! 🏆

🔥 MAJOR COMPETITIONS:

📍 Limpopo Provincial Championship 
   Date: September 15, 2025 | Polokwane
   Prize: R75,000 | Status: Registration Open
   
📍 Gauteng Regional Auditions
   Date: September 22, 2025 | Johannesburg  
   Prize: R50,000 | Status: Upcoming
   
📍 KZN Cultural Showcase
   Date: October 5, 2025 | Durban
   Prize: R45,000 | Status: Planning Phase

PROVINCIAL COVERAGE:
✓ All 9 provinces participating
✓ 1,847 registered contestants
✓ R850,000+ total prize money
✓ 156 qualified for championships

Ready to compete? Each event has unique requirements and cultural themes!`;
        actionItems = ["Register for event", "View all events", "Check provincial calendar"];
        break;

      case "prizes":
        response = `The prize opportunities at Crate Dance™ Africa are incredible! 💰

🏆 TOTAL PRIZE POOL: R850,000+ annually

MAJOR PRIZES BY EVENT:
• Limpopo Provincial: R75,000
• Gauteng Regional: R50,000  
• KZN Cultural: R45,000
• Additional provincial events: R30,000-R40,000 each

PRIZE CATEGORIES:
🥇 1st Place: 50% of event prize pool
🥈 2nd Place: 30% of event prize pool
🥉 3rd Place: 20% of event prize pool

SPECIAL AWARDS:
🌟 Best Traditional Performance
🎭 Most Creative Choreography
❤️ People's Choice Award
🏛️ Cultural Heritage Recognition

ADDITIONAL BENEFITS:
• Performance opportunities
• Mentorship programs
• Industry connections
• Scholarship opportunities
• Brand partnerships

Prizes are distributed via secure FAA™ VaultPay system within 30 days of competition completion.`;
        actionItems = ["View prize breakdown", "Check payment terms", "Learn about special awards"];
        break;

      default:
        response = `Welcome to Crate Dance™ Africa! 🎭✨

I'm here to help you with everything related to our continental dance competition platform. Whether you're looking to:

🎯 Register for competitions
🌟 Prepare for auditions  
🏆 Learn about prizes and opportunities
🎪 Explore dance styles and categories
📅 Find upcoming events in your province
🎭 Connect with our cultural heritage mission

I'm here to guide you every step of the way! Our platform celebrates the rich diversity of South African dance while providing real opportunities for talented performers.

What would you like to know about Crate Dance™ Africa?`;
        actionItems = ["Explore competitions", "Start registration", "Learn about dance styles", "View upcoming events"];
    }

    return {
      response,
      category,
      actionItems
    };
  }

  static getCrateDanceStats() {
    return {
      totalEvents: 24,
      activeContestants: 1847,
      registrationsThisMonth: 312,
      upcomingAuditions: 8,
      qualifiedDancers: 156,
      provinces: 9,
      danceStyles: 12,
      totalPrizeMoney: "R850,000",
      currentChampions: [
        { name: "Nomsa Dlamini", province: "Gauteng", style: "Contemporary" },
        { name: "Thabo Mthembu", province: "KZN", style: "Hip-Hop" },
        { name: "Sipho Ngcobo", province: "Limpopo", style: "Traditional" }
      ]
    };
  }

  // Integration with Contact Management System
  static async convertRegistrationToContact(registrationData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    province: string;
    danceStyle: string;
    goals?: string;
    age?: number;
  }): Promise<{
    contactData: any;
    leadScore: number;
    tags: string[];
  }> {
    // Process the dance registration data through the contact AI
    const processedResult = ContactProcessingAI.processUnstructuredContact({
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      email: registrationData.email,
      phone: registrationData.phone,
      country: "South Africa",
      city: registrationData.province,
      position: `${registrationData.danceStyle} Dancer`,
      company: "Crate Dance™ Africa",
      industry: "Entertainment",
      source: "Crate Dance Registration",
      // Additional dance-specific context
      danceStyle: registrationData.danceStyle,
      province: registrationData.province,
      goals: registrationData.goals,
      age: registrationData.age
    });

    // Add dance-specific tags
    const additionalTags = [
      "Crate Dance Contestant",
      `${registrationData.danceStyle} Dancer`,
      `${registrationData.province} Province`,
      "Dance Competition",
      "Cultural Arts"
    ];

    // Age category tags
    if (registrationData.age) {
      if (registrationData.age <= 12) additionalTags.push("Junior Category");
      else if (registrationData.age <= 17) additionalTags.push("Teen Category");
      else additionalTags.push("Adult Category");
    }

    // Enhance lead score for active participants
    const enhancedLeadScore = Math.min(100, processedResult.processedContact.leadScore + 15);

    return {
      contactData: {
        ...processedResult.processedContact,
        source: "Crate Dance™ Africa Registration",
        status: "active",
        notes: `Registered for ${registrationData.danceStyle} competitions. Goals: ${registrationData.goals || 'Not specified'}`,
        customFields: {
          danceStyle: registrationData.danceStyle,
          province: registrationData.province,
          participantType: "Contestant",
          registrationDate: new Date().toISOString(),
          goals: registrationData.goals
        }
      },
      leadScore: enhancedLeadScore,
      tags: [...processedResult.processedContact.tags, ...additionalTags]
    };
  }
}

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
      firstName: undefined as string | undefined,
      lastName: undefined as string | undefined,
      fullName: undefined as string | undefined,
      email: undefined as string | undefined,
      phone: undefined as string | undefined,
      company: undefined as string | undefined,
      position: undefined as string | undefined,
      country: undefined as string | undefined,
      city: undefined as string | undefined,
      industry: undefined as string | undefined,
      leadScore: 0,
      tags: [] as string[],
    };

    // Smart data extraction
    if (rawData.name || rawData.fullName) {
      const fullName = rawData.name || rawData.fullName;
      contact.fullName = fullName;
      const nameParts = fullName.split(' ');
      contact.firstName = nameParts[0] || undefined;
      contact.lastName = nameParts.slice(1).join(' ') || undefined;
    } else if (rawData.firstName || rawData.lastName) {
      contact.firstName = rawData.firstName || undefined;
      contact.lastName = rawData.lastName || undefined;
      contact.fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
    }

    // Email extraction and validation
    contact.email = this.extractEmail(rawData);
    
    // Phone extraction and formatting
    contact.phone = this.extractPhone(rawData);
    
    // Company and position extraction
    contact.company = rawData.company || rawData.organization || rawData.employer || undefined;
    contact.position = rawData.position || rawData.title || rawData.job || rawData.role || undefined;
    
    // Location extraction
    contact.country = rawData.country || rawData.nation || undefined;
    contact.city = rawData.city || rawData.location || undefined;
    
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

  private static extractEmail(data: any): string | undefined {
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
    
    return undefined;
  }

  private static extractPhone(data: any): string | undefined {
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
    
    return undefined;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static formatPhone(phone: string): string {
    return phone.replace(/[^\d\+]/g, '');
  }

  private static classifyIndustry(company: string | undefined, position: string | undefined): string | undefined {
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
    
    return undefined;
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