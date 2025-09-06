import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI client
let genAI: GoogleGenerativeAI | null = null;

function initializeGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return !!genAI;
}

// Enhanced Contact Processing with Real AI
export class GeminiContactProcessor {
  static async processUnstructuredContact(rawData: any): Promise<{
    processedContact: any;
    confidence: number;
    suggestions: string[];
  }> {
    // Initialize Gemini if not already done
    if (!genAI && !initializeGemini()) {
      // Fallback to basic processing if no API key
      return this.fallbackProcessing(rawData);
    }

    try {
      const model = genAI!.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        You are an expert data processor for contact management. Process this unstructured contact data and extract standardized information.
        
        Raw contact data: ${JSON.stringify(rawData)}
        
        Please extract and standardize the following information:
        1. First Name
        2. Last Name  
        3. Full Name
        4. Email (validate format)
        5. Phone (standardize format)
        6. Company
        7. Position/Title
        8. Country
        9. City
        10. Industry (classify based on company/position)
        11. Lead Score (0-100 based on data completeness and quality)
        
        Return a JSON object with the extracted data and include:
        - confidence: score 0-100 for extraction accuracy
        - suggestions: array of recommendations for data improvement
        - tags: array of relevant classification tags
        
        Focus on data quality and standardization.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const aiResult = JSON.parse(text);
        return {
          processedContact: {
            faaId: this.generateFaaReference(aiResult.email || aiResult.fullName || Math.random().toString()),
            firstName: aiResult.firstName || null,
            lastName: aiResult.lastName || null,
            fullName: aiResult.fullName || null,
            email: aiResult.email || null,
            phone: aiResult.phone || null,
            company: aiResult.company || null,
            position: aiResult.position || null,
            country: aiResult.country || null,
            city: aiResult.city || null,
            industry: aiResult.industry || null,
            leadScore: aiResult.leadScore || 0,
            tags: aiResult.tags || [],
            status: "active"
          },
          confidence: aiResult.confidence || 50,
          suggestions: aiResult.suggestions || []
        };
      } catch (parseError) {
        // If AI response isn't valid JSON, fall back to basic processing
        return this.fallbackProcessing(rawData);
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.fallbackProcessing(rawData);
    }
  }

  private static fallbackProcessing(rawData: any) {
    // Basic processing without AI
    const contact = {
      faaId: this.generateFaaReference(rawData.email || rawData.name || Math.random().toString()),
      firstName: rawData.firstName || rawData.first_name || null,
      lastName: rawData.lastName || rawData.last_name || null,
      fullName: rawData.fullName || rawData.name || null,
      email: rawData.email || null,
      phone: rawData.phone || rawData.phoneNumber || null,
      company: rawData.company || rawData.organization || null,
      position: rawData.position || rawData.title || null,
      country: rawData.country || null,
      city: rawData.city || null,
      industry: null,
      leadScore: 30, // Basic score
      tags: ["Basic Processing"],
      status: "active"
    };

    return {
      processedContact: contact,
      confidence: 30,
      suggestions: ["AI processing unavailable - manual review recommended"]
    };
  }

  private static generateFaaReference(baseString: string): string {
    const timestamp = Date.now().toString();
    const hash = Buffer.from(`FAA${baseString}${timestamp}`).toString('base64').slice(0, 12).toUpperCase();
    return `FAA${hash}`;
  }
}

// Enhanced Banimal Chatbot with Real AI
export class GeminiBanimalChatbot {
  static async processMessage(message: string, context?: any): Promise<string> {
    // Initialize Gemini if not already done
    if (!genAI && !initializeGemini()) {
      return this.fallbackResponse(message);
    }

    try {
      const model = genAI!.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        You are the official AI customer support assistant for Banimal™, a premium FAA-compliant e-commerce platform. 
        
        Your role:
        - Provide helpful, professional customer support
        - Focus on Banimal™ products, orders, returns, and services
        - Maintain the brand's premium, friendly tone
        - Be concise but informative
        
        Customer message: "${message}"
        ${context ? `Context: ${JSON.stringify(context)}` : ''}
        
        Key information about Banimal™:
        - 30-day return policy on unworn items with tags
        - Same-day dispatch for orders before 12:00 PM
        - Live tracking via BobGo API
        - Banimal Points™ loyalty program (1 point per R1 spent)
        - Multi-currency support (ZAR, USD, EUR, GBP, AUD)
        - FAA™ compliance with unique customer tracking
        - POPIA and GDPR compliant
        
        Provide a helpful response (max 150 words):
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini chatbot error:', error);
      return this.fallbackResponse(message);
    }
  }

  private static fallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('order') || lowerMessage.includes('track')) {
      return "I can help you track your order! Please provide your order number or email address, and I'll get the latest status for you.";
    }
    
    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return "Our return policy allows 30 days for returns on unworn items with tags attached. Items must be in original packaging. Would you like me to start a return request?";
    }
    
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return "We offer same-day dispatch for orders before 12:00 PM with live tracking via BobGo API. Standard shipping takes 2-5 business days.";
    }
    
    return "I'm here to help with your Banimal™ questions! I can assist with orders, returns, shipping, products, and loyalty points. What would you like to know?";
  }
}

// AI-Powered Product Descriptions
export class GeminiProductAI {
  static async generateProductDescription(productData: {
    name: string;
    category: string;
    features?: string[];
    specifications?: any;
  }): Promise<{
    description: string;
    seoTitle: string;
    seoDescription: string;
    tags: string[];
  }> {
    if (!genAI && !initializeGemini()) {
      return this.fallbackProductData(productData);
    }

    try {
      const model = genAI!.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Create compelling e-commerce content for this Banimal™ product:
        
        Product: ${productData.name}
        Category: ${productData.category}
        Features: ${productData.features ? productData.features.join(', ') : 'Premium quality'}
        Specifications: ${JSON.stringify(productData.specifications || {})}
        
        Generate:
        1. Product description (2-3 sentences, engaging and informative)
        2. SEO title (60 characters max, include brand)
        3. SEO description (150 characters max)
        4. Relevant tags (5-8 tags for categorization)
        
        Style: Premium, professional, emphasizing quality and FAA™ compliance.
        Return as JSON object with: description, seoTitle, seoDescription, tags
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        return JSON.parse(text);
      } catch (parseError) {
        return this.fallbackProductData(productData);
      }
    } catch (error) {
      console.error('Gemini product AI error:', error);
      return this.fallbackProductData(productData);
    }
  }

  private static fallbackProductData(productData: any) {
    return {
      description: `Premium ${productData.name} from Banimal™. Crafted with attention to detail and FAA™ compliance standards.`,
      seoTitle: `${productData.name} - Premium ${productData.category} | Banimal™`,
      seoDescription: `Shop ${productData.name} at Banimal™. Premium quality ${productData.category} with fast shipping and 30-day returns.`,
      tags: [productData.category, "Premium", "Banimal", "FAA Compliant", "Quality"]
    };
  }
}

// AI Marketing Assistant
export class GeminiMarketingAI {
  static async generateMarketingContent(campaign: {
    type: string; // email, sms, promotion, social
    target: string; // audience description
    product?: string;
    occasion?: string;
  }): Promise<{
    subject?: string;
    content: string;
    callToAction: string;
    hashtags?: string[];
  }> {
    if (!genAI && !initializeGemini()) {
      return this.fallbackMarketingContent(campaign);
    }

    try {
      const model = genAI!.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Create ${campaign.type} marketing content for Banimal™:
        
        Campaign Type: ${campaign.type}
        Target Audience: ${campaign.target}
        ${campaign.product ? `Product: ${campaign.product}` : ''}
        ${campaign.occasion ? `Occasion: ${campaign.occasion}` : ''}
        
        Brand Guidelines:
        - Premium, sophisticated tone
        - Emphasize quality and FAA™ compliance
        - Highlight customer benefits (free shipping, returns, loyalty points)
        - Keep messaging concise and compelling
        
        Generate appropriate content for this campaign type including:
        - ${campaign.type === 'email' ? 'Subject line and email content' : 'Main content'}
        - Strong call-to-action
        - ${campaign.type === 'social' ? 'Relevant hashtags' : ''}
        
        Return as JSON object.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        return JSON.parse(text);
      } catch (parseError) {
        return this.fallbackMarketingContent(campaign);
      }
    } catch (error) {
      console.error('Gemini marketing AI error:', error);
      return this.fallbackMarketingContent(campaign);
    }
  }

  private static fallbackMarketingContent(campaign: any) {
    const content = {
      email: {
        subject: "Exclusive Offer from Banimal™",
        content: "Discover our premium collection with special pricing for valued customers. Shop now and earn Banimal Points™!",
        callToAction: "Shop Now - Free Shipping Over R500"
      },
      social: {
        content: "✨ New arrivals at Banimal™! Premium quality meets FAA™ compliance standards. #Quality #Premium #Banimal",
        callToAction: "Shop the collection 👆",
        hashtags: ["#Banimal", "#Premium", "#Quality", "#FAA", "#Shopping"]
      }
    };

    return content[campaign.type as keyof typeof content] || content.email;
  }
}

// Initialize Gemini on module load
initializeGemini();

export { initializeGemini };