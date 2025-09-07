import twilio from 'twilio';
import { v4 as uuidv4 } from 'uuid';
import handlebars from 'handlebars';
import type { 
  MessageChannel, 
  MessageTemplate, 
  MessagingCampaign, 
  MessageSend,
  WhatsappConversation,
  SmsConversation,
  InsertMessageChannel,
  InsertMessageTemplate,
  InsertMessagingCampaign,
  InsertMessageSend,
  InsertWhatsappConversation,
  InsertSmsConversation,
  InsertMessageTracking
} from '@shared/schema';

// Multi-Channel Configuration Types
interface TwilioConfig {
  accountSid: string;
  authToken: string;
  whatsappNumber?: string; // +14155552671 (Twilio WhatsApp sandbox)
  smsNumber?: string; // Your Twilio phone number
}

interface WhatsappTemplateConfig {
  name: string;
  language: string;
  components?: any[];
}

interface ChannelConfig {
  twilio?: TwilioConfig;
  firebase?: {
    serverKey: string;
    projectId: string;
  };
  email?: {
    providerId: string;
  };
}

// Message Result Interface
interface MessageSendResult {
  success: boolean;
  externalMessageId?: string; // Twilio SID, Firebase message ID, etc.
  error?: string;
  trackingId: string;
  deliveredAt?: Date;
}

// Template Variables for Multi-Channel
interface MessageVariables {
  [key: string]: any;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  company?: string;
  unsubscribeUrl?: string;
  // FAA™ Multilingual Support
  thankYou?: string; // "Dankie", "Thank you", "Gracias", etc.
  please?: string; // "Asseblief", "Please", "Por favor", etc.
  language?: string; // Current language code
}

export class MultiChannelMessagingService {
  private storage: any;
  private twilioClient: twilio.Twilio | null = null;
  private firebaseMessaging: any = null; // Firebase messaging instance

  constructor(storage: any) {
    this.storage = storage;
  }

  // ===============================
  // CHANNEL MANAGEMENT
  // ===============================

  async createMessageChannel(channelData: InsertMessageChannel): Promise<MessageChannel> {
    // Validate configuration based on channel type
    this.validateChannelConfiguration(channelData.type, channelData.configuration);
    
    const channel = await this.storage.createMessageChannel(channelData);
    
    // Initialize channel provider
    if (channel.isActive) {
      await this.initializeChannelProvider(channel);
    }
    
    return channel;
  }

  async updateMessageChannel(channelId: string, updates: Partial<MessageChannel>): Promise<MessageChannel | null> {
    const channel = await this.storage.updateMessageChannel(channelId, updates);
    if (channel && channel.isActive) {
      await this.initializeChannelProvider(channel);
    }
    return channel;
  }

  async getMessageChannels(): Promise<MessageChannel[]> {
    return this.storage.getMessageChannels();
  }

  async getActiveChannels(): Promise<MessageChannel[]> {
    const channels = await this.storage.getMessageChannels();
    return channels.filter(c => c.isActive);
  }

  private validateChannelConfiguration(type: string, config: any): void {
    switch (type) {
      case 'whatsapp':
        if (!config.twilio || !config.twilio.accountSid || !config.twilio.authToken) {
          throw new Error('WhatsApp channel requires Twilio account credentials');
        }
        break;
      case 'sms':
        if (!config.twilio || !config.twilio.accountSid || !config.twilio.smsNumber) {
          throw new Error('SMS channel requires Twilio credentials and phone number');
        }
        break;
      case 'push':
        if (!config.firebase || !config.firebase.serverKey) {
          throw new Error('Push notifications require Firebase server key');
        }
        break;
      case 'email':
        if (!config.email || !config.email.providerId) {
          throw new Error('Email channel requires email provider ID');
        }
        break;
      default:
        throw new Error(`Unsupported channel type: ${type}`);
    }
  }

  private async initializeChannelProvider(channel: MessageChannel): Promise<void> {
    const config = channel.configuration as ChannelConfig;
    
    try {
      switch (channel.type) {
        case 'whatsapp':
        case 'sms':
          if (config.twilio && !this.twilioClient) {
            this.twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);
            console.log(`✅ Twilio client initialized for ${channel.name}`);
          }
          break;
          
        case 'push':
          if (config.firebase && !this.firebaseMessaging) {
            // Firebase messaging already initialized in firebase-admin.ts
            console.log(`✅ Firebase push notifications ready for ${channel.name}`);
          }
          break;
          
        case 'email':
          console.log(`✅ Email channel ${channel.name} linked to existing email service`);
          break;
      }
    } catch (error) {
      console.error(`❌ Failed to initialize channel "${channel.name}":`, error);
      throw error;
    }
  }

  // ===============================
  // TEMPLATE MANAGEMENT
  // ===============================

  async createMessageTemplate(templateData: InsertMessageTemplate): Promise<MessageTemplate> {
    // Validate handlebars template syntax
    try {
      handlebars.compile(templateData.content);
      if (templateData.subject) {
        handlebars.compile(templateData.subject);
      }
    } catch (error) {
      throw new Error(`Template compilation error: ${error.message}`);
    }

    // Validate channel-specific requirements
    if (templateData.channelType === 'whatsapp' && templateData.approvalStatus !== 'approved') {
      console.warn('WhatsApp templates require approval from WhatsApp Business API');
    }

    return this.storage.createMessageTemplate(templateData);
  }

  async updateMessageTemplate(templateId: string, updates: Partial<MessageTemplate>): Promise<MessageTemplate | null> {
    return this.storage.updateMessageTemplate(templateId, updates);
  }

  async getMessageTemplates(channelType?: string): Promise<MessageTemplate[]> {
    if (channelType) {
      return this.storage.getMessageTemplatesByChannel(channelType);
    }
    return this.storage.getMessageTemplates();
  }

  async renderTemplate(template: MessageTemplate, variables: MessageVariables): Promise<{
    subject?: string;
    content: string;
  }> {
    const contentTemplate = handlebars.compile(template.content);
    const subjectTemplate = template.subject ? handlebars.compile(template.subject) : null;

    // Add FAA™ multilingual support
    const enhancedVariables = {
      ...variables,
      // Default to Afrikaans (Sacred Baobab™ foundation)
      thankYou: variables.thankYou || 'Dankie',
      please: variables.please || 'Asseblief',
      language: variables.language || 'af'
    };

    return {
      subject: subjectTemplate ? subjectTemplate(enhancedVariables) : undefined,
      content: contentTemplate(enhancedVariables),
    };
  }

  // ===============================
  // CAMPAIGN MANAGEMENT
  // ===============================

  async createMessagingCampaign(campaignData: InsertMessagingCampaign): Promise<MessagingCampaign> {
    const campaign = await this.storage.createMessagingCampaign(campaignData);
    
    // If immediate sending, start the campaign
    if (campaign.scheduleType === 'immediate' && campaign.status === 'draft') {
      await this.startCampaign(campaign.id);
    }
    
    return campaign;
  }

  async startCampaign(campaignId: string): Promise<void> {
    const campaign = await this.storage.getMessagingCampaign(campaignId);
    if (!campaign) throw new Error('Campaign not found');

    if (campaign.status !== 'draft') {
      throw new Error('Only draft campaigns can be started');
    }

    // Update campaign status
    await this.storage.updateMessagingCampaign(campaignId, { 
      status: 'sending',
      sentAt: new Date()
    });

    // Get contacts based on target audience
    const contacts = await this.getTargetContacts(campaign.targetAudience);
    
    // Update total recipients
    await this.storage.updateMessagingCampaign(campaignId, { 
      totalRecipients: contacts.length 
    });

    // Send messages across all selected channels
    await this.sendCampaignMessages(campaign, contacts);
  }

  private async getTargetContacts(targetAudience: any): Promise<any[]> {
    const filters = targetAudience || {};
    return this.storage.getContacts(filters);
  }

  private async sendCampaignMessages(campaign: MessagingCampaign, contacts: any[]): Promise<void> {
    const template = await this.storage.getMessageTemplate(campaign.templateId);
    if (!template) throw new Error('Template not found');

    // Get all selected channels
    const channels = await Promise.all(
      campaign.channelIds.map(id => this.storage.getMessageChannel(id))
    );
    
    const activeChannels = channels.filter(c => c && c.isActive);
    if (activeChannels.length === 0) {
      throw new Error('No active channels found for campaign');
    }

    let totalSent = 0;
    let totalDelivered = 0;
    let totalFailed = 0;

    // Send to each contact on each channel
    for (const contact of contacts) {
      for (const channel of activeChannels) {
        try {
          const trackingId = uuidv4();
          
          // Determine recipient identifier based on channel
          const recipientIdentifier = this.getRecipientIdentifier(contact, channel.type);
          if (!recipientIdentifier) {
            console.warn(`No ${channel.type} identifier for contact ${contact.id}`);
            continue;
          }

          // Create message send record
          const messageSend = await this.storage.createMessageSend({
            campaignId: campaign.id,
            contactId: contact.id,
            channelId: channel.id,
            templateId: template.id,
            recipientIdentifier,
            status: 'pending',
            trackingId,
            metadata: { contactData: contact, channelType: channel.type }
          });

          // Send the message
          const result = await this.sendSingleMessage(
            template,
            channel,
            contact,
            trackingId,
            campaign.id
          );

          if (result.success) {
            await this.storage.updateMessageSend(messageSend.id, {
              status: 'sent',
              sentAt: new Date(),
              externalMessageId: result.externalMessageId,
              deliveredAt: result.deliveredAt
            });
            totalSent++;
            if (result.deliveredAt) totalDelivered++;
          } else {
            await this.storage.updateMessageSend(messageSend.id, {
              status: 'failed',
              failureReason: result.error
            });
            totalFailed++;
          }

        } catch (error) {
          console.error(`Failed to send ${channel.type} message to ${contact.id}:`, error);
          totalFailed++;
        }
      }
    }

    // Update campaign statistics
    await this.storage.updateMessagingCampaign(campaign.id, {
      status: 'sent',
      sentCount: totalSent,
      deliveredCount: totalDelivered,
      failedCount: totalFailed
    });
  }

  private getRecipientIdentifier(contact: any, channelType: string): string | null {
    switch (channelType) {
      case 'email':
        return contact.email;
      case 'whatsapp':
      case 'sms':
        return contact.phone || contact.whatsappNumber || contact.phoneNumber;
      case 'push':
        return contact.deviceToken || contact.fcmToken;
      default:
        return null;
    }
  }

  // ===============================
  // MESSAGE SENDING
  // ===============================

  async sendSingleMessage(
    template: MessageTemplate,
    channel: MessageChannel,
    contact: any,
    trackingId: string,
    campaignId?: string
  ): Promise<MessageSendResult> {
    try {
      // Prepare template variables with FAA™ multilingual support
      const variables: MessageVariables = {
        firstName: contact.firstName,
        lastName: contact.lastName,
        fullName: contact.fullName || `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
        phone: contact.phone,
        email: contact.email,
        company: contact.company,
        unsubscribeUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/unsubscribe/${trackingId}`,
        // FAA™ Language Learning Integration
        thankYou: contact.preferredThankYou || 'Dankie',
        please: contact.preferredPlease || 'Asseblief',
        language: contact.preferredLanguage || 'af',
        ...contact.customFields
      };

      // Render template
      const rendered = await this.renderTemplate(template, variables);
      
      // Send via appropriate channel
      switch (channel.type) {
        case 'whatsapp':
          return await this.sendWhatsAppMessage(channel, contact, rendered, trackingId);
          
        case 'sms':
          return await this.sendSMSMessage(channel, contact, rendered, trackingId);
          
        case 'push':
          return await this.sendPushNotification(channel, contact, rendered, trackingId);
          
        case 'email':
          return await this.sendEmailMessage(channel, contact, template, trackingId, campaignId);
          
        default:
          throw new Error(`Unsupported channel type: ${channel.type}`);
      }

    } catch (error) {
      console.error(`Message send error on ${channel.type}:`, error);
      return {
        success: false,
        error: error.message,
        trackingId
      };
    }
  }

  private async sendWhatsAppMessage(
    channel: MessageChannel, 
    contact: any, 
    rendered: any, 
    trackingId: string
  ): Promise<MessageSendResult> {
    const config = channel.configuration as ChannelConfig;
    
    if (!this.twilioClient || !config.twilio?.whatsappNumber) {
      throw new Error('WhatsApp not properly configured');
    }

    const recipientNumber = contact.phone || contact.whatsappNumber;
    if (!recipientNumber) {
      throw new Error('No WhatsApp number for contact');
    }

    try {
      const message = await this.twilioClient.messages.create({
        body: rendered.content,
        from: `whatsapp:${config.twilio.whatsappNumber}`,
        to: `whatsapp:${recipientNumber}`,
      });

      // Create/update WhatsApp conversation
      await this.upsertWhatsAppConversation(contact.id, recipientNumber);

      return {
        success: true,
        externalMessageId: message.sid,
        trackingId,
        deliveredAt: new Date() // Twilio provides immediate response
      };
    } catch (error) {
      throw new Error(`WhatsApp send failed: ${error.message}`);
    }
  }

  private async sendSMSMessage(
    channel: MessageChannel, 
    contact: any, 
    rendered: any, 
    trackingId: string
  ): Promise<MessageSendResult> {
    const config = channel.configuration as ChannelConfig;
    
    if (!this.twilioClient || !config.twilio?.smsNumber) {
      throw new Error('SMS not properly configured');
    }

    const recipientNumber = contact.phone || contact.phoneNumber;
    if (!recipientNumber) {
      throw new Error('No phone number for contact');
    }

    try {
      const message = await this.twilioClient.messages.create({
        body: rendered.content,
        from: config.twilio.smsNumber,
        to: recipientNumber,
      });

      // Create/update SMS conversation
      await this.upsertSMSConversation(contact.id, recipientNumber, config.twilio.smsNumber);

      return {
        success: true,
        externalMessageId: message.sid,
        trackingId,
        deliveredAt: new Date()
      };
    } catch (error) {
      throw new Error(`SMS send failed: ${error.message}`);
    }
  }

  private async sendPushNotification(
    channel: MessageChannel, 
    contact: any, 
    rendered: any, 
    trackingId: string
  ): Promise<MessageSendResult> {
    // Use existing Firebase messaging from firebase-admin.ts
    const deviceToken = contact.deviceToken || contact.fcmToken;
    if (!deviceToken) {
      throw new Error('No device token for push notification');
    }

    try {
      // Import Firebase messaging
      const { getMessaging } = await import('firebase-admin/messaging');
      const messaging = getMessaging();

      const message = {
        token: deviceToken,
        notification: {
          title: rendered.subject || '🌳 Sacred Baobab™ Ecosystem',
          body: rendered.content,
        },
        data: {
          trackingId,
          channelType: 'push',
          timestamp: new Date().toISOString()
        },
      };

      const response = await messaging.send(message);

      return {
        success: true,
        externalMessageId: response, // Firebase message ID
        trackingId,
        deliveredAt: new Date()
      };
    } catch (error) {
      throw new Error(`Push notification failed: ${error.message}`);
    }
  }

  private async sendEmailMessage(
    channel: MessageChannel, 
    contact: any, 
    template: MessageTemplate,
    trackingId: string,
    campaignId?: string
  ): Promise<MessageSendResult> {
    // Delegate to existing email service
    const { enterpriseEmailService } = await import('./email-service');
    
    const config = channel.configuration as ChannelConfig;
    if (!config.email?.providerId) {
      throw new Error('Email provider not configured');
    }

    const provider = await this.storage.getEmailProvider(config.email.providerId);
    if (!provider) {
      throw new Error('Email provider not found');
    }

    try {
      const result = await enterpriseEmailService.sendSingleEmail(
        template as any, // Type compatibility
        provider,
        contact,
        trackingId,
        campaignId
      );

      return {
        success: result.success,
        externalMessageId: result.messageId,
        error: result.error,
        trackingId: result.trackingId
      };
    } catch (error) {
      throw new Error(`Email send failed: ${error.message}`);
    }
  }

  // ===============================
  // CONVERSATION MANAGEMENT
  // ===============================

  private async upsertWhatsAppConversation(contactId: string, whatsappNumber: string): Promise<void> {
    const existing = await this.storage.getWhatsAppConversationByNumber(whatsappNumber);
    
    if (existing) {
      await this.storage.updateWhatsAppConversation(existing.id, {
        lastMessageAt: new Date(),
        messageCount: existing.messageCount + 1
      });
    } else {
      await this.storage.createWhatsAppConversation({
        contactId,
        whatsappNumber,
        conversationStatus: 'active',
        isBusinessInitiated: true,
        metadata: { channel: 'whatsapp', createdVia: 'campaign' }
      });
    }
  }

  private async upsertSMSConversation(contactId: string, phoneNumber: string, twilioNumber: string): Promise<void> {
    const existing = await this.storage.getSMSConversationByNumber(phoneNumber);
    
    if (existing) {
      await this.storage.updateSMSConversation(existing.id, {
        lastMessageAt: new Date(),
        messageCount: existing.messageCount + 1
      });
    } else {
      await this.storage.createSMSConversation({
        contactId,
        phoneNumber,
        twilioPhoneNumber: twilioNumber,
        conversationStatus: 'active',
        metadata: { channel: 'sms', createdVia: 'campaign' }
      });
    }
  }

  // ===============================
  // WEBHOOK HANDLERS
  // ===============================

  async handleTwilioWebhook(webhookData: any): Promise<void> {
    try {
      const { MessageSid, MessageStatus, From, To, Body, SmsStatus } = webhookData;
      
      if (From.startsWith('whatsapp:')) {
        await this.handleWhatsAppWebhook(webhookData);
      } else {
        await this.handleSMSWebhook(webhookData);
      }
    } catch (error) {
      console.error('Twilio webhook processing error:', error);
    }
  }

  private async handleWhatsAppWebhook(webhookData: any): Promise<void> {
    const { MessageSid, MessageStatus, From, To, Body } = webhookData;
    const cleanFromNumber = From.replace('whatsapp:', '');
    const cleanToNumber = To.replace('whatsapp:', '');

    // Check if this is an incoming message (to our WhatsApp number)
    if (Body && From !== To) {
      // Store incoming WhatsApp message
      const conversation = await this.storage.getWhatsAppConversationByNumber(cleanFromNumber);
      
      if (conversation) {
        await this.storage.createWhatsAppMessage({
          conversationId: conversation.id,
          twilioMessageSid: MessageSid,
          direction: 'inbound',
          messageType: 'text',
          content: Body,
          fromNumber: cleanFromNumber,
          toNumber: cleanToNumber,
          messageStatus: MessageStatus,
          webhookData: webhookData
        });

        // Update conversation
        await this.storage.updateWhatsAppConversation(conversation.id, {
          lastMessageAt: new Date(),
          messageCount: conversation.messageCount + 1
        });
      }
    }

    // Update outbound message status
    const messageSend = await this.storage.getMessageSendByExternalId(MessageSid);
    if (messageSend) {
      const statusMap = {
        'delivered': 'delivered',
        'read': 'read',
        'failed': 'failed',
        'undelivered': 'failed'
      };

      const status = statusMap[MessageStatus] || messageSend.status;
      
      await this.storage.updateMessageSend(messageSend.id, {
        status,
        deliveredAt: MessageStatus === 'delivered' ? new Date() : messageSend.deliveredAt,
        readAt: MessageStatus === 'read' ? new Date() : messageSend.readAt
      });

      // Create tracking event
      await this.storage.createMessageTracking({
        sendId: messageSend.id,
        trackingId: messageSend.trackingId,
        channelType: 'whatsapp',
        eventType: MessageStatus,
        eventData: webhookData
      });
    }
  }

  private async handleSMSWebhook(webhookData: any): Promise<void> {
    const { MessageSid, SmsStatus, From, To, Body } = webhookData;

    // Similar logic for SMS webhooks
    if (Body && From !== To) {
      const conversation = await this.storage.getSMSConversationByNumber(From);
      
      if (conversation) {
        await this.storage.createSMSMessage({
          conversationId: conversation.id,
          twilioMessageSid: MessageSid,
          direction: 'inbound',
          content: Body,
          fromNumber: From,
          toNumber: To,
          messageStatus: SmsStatus,
          webhookData: webhookData
        });

        await this.storage.updateSMSConversation(conversation.id, {
          lastMessageAt: new Date(),
          messageCount: conversation.messageCount + 1
        });
      }
    }

    // Update outbound message status
    const messageSend = await this.storage.getMessageSendByExternalId(MessageSid);
    if (messageSend) {
      const statusMap = {
        'delivered': 'delivered',
        'failed': 'failed',
        'undelivered': 'failed'
      };

      const status = statusMap[SmsStatus] || messageSend.status;
      
      await this.storage.updateMessageSend(messageSend.id, {
        status,
        deliveredAt: SmsStatus === 'delivered' ? new Date() : messageSend.deliveredAt
      });

      await this.storage.createMessageTracking({
        sendId: messageSend.id,
        trackingId: messageSend.trackingId,
        channelType: 'sms',
        eventType: SmsStatus,
        eventData: webhookData
      });
    }
  }

  // ===============================
  // ANALYTICS & REPORTING
  // ===============================

  async getMultiChannelAnalytics(channelType?: string, days: number = 30): Promise<{
    totalSent: number;
    totalDelivered: number;
    totalRead: number;
    totalReplied: number;
    totalFailed: number;
    deliveryRate: number;
    readRate: number;
    responseRate: number;
    channelBreakdown: any[];
    recentCampaigns: MessagingCampaign[];
  }> {
    const analytics = await this.storage.getMessageAnalytics(channelType, days);
    const campaigns = await this.storage.getRecentMessagingCampaigns(5);

    const totals = analytics.reduce((acc, day) => ({
      totalSent: acc.totalSent + day.totalSent,
      totalDelivered: acc.totalDelivered + day.totalDelivered,
      totalRead: acc.totalRead + day.totalRead,
      totalReplied: acc.totalReplied + day.totalReplied,
      totalFailed: acc.totalFailed + day.totalFailed,
    }), { totalSent: 0, totalDelivered: 0, totalRead: 0, totalReplied: 0, totalFailed: 0 });

    const deliveryRate = totals.totalSent > 0 ? (totals.totalDelivered / totals.totalSent) * 100 : 0;
    const readRate = totals.totalDelivered > 0 ? (totals.totalRead / totals.totalDelivered) * 100 : 0;
    const responseRate = totals.totalSent > 0 ? (totals.totalReplied / totals.totalSent) * 100 : 0;

    const channelBreakdown = await this.storage.getChannelBreakdown(days);

    return {
      ...totals,
      deliveryRate: Math.round(deliveryRate * 100) / 100,
      readRate: Math.round(readRate * 100) / 100,
      responseRate: Math.round(responseRate * 100) / 100,
      channelBreakdown,
      recentCampaigns: campaigns
    };
  }

  // ===============================
  // UTILITIES
  // ===============================

  async testChannel(channelId: string, testRecipient: string): Promise<{ success: boolean; error?: string }> {
    try {
      const channel = await this.storage.getMessageChannel(channelId);
      if (!channel) throw new Error('Channel not found');

      // Create test template
      const testTemplate: MessageTemplate = {
        id: 'test',
        name: 'Test Template',
        content: '🌳 Sacred Baobab™ Multi-Channel Test\n\nThis is a test message from the Fruitful Global Master Hub.\n\nDankie! 🙏',
        subject: '🌳 Sacred Baobab™ Test Message',
        channelType: channel.type,
        variables: [],
        category: 'test',
        language: 'en',
        isActive: true,
        approvalStatus: 'approved',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {}
      } as MessageTemplate;

      const testContact = {
        id: 'test-contact',
        email: channel.type === 'email' ? testRecipient : 'test@example.com',
        phone: ['whatsapp', 'sms'].includes(channel.type) ? testRecipient : '+1234567890',
        deviceToken: channel.type === 'push' ? testRecipient : 'test-token',
        firstName: 'Test',
        lastName: 'User',
        fullName: 'Test User'
      };

      const result = await this.sendSingleMessage(
        testTemplate,
        channel,
        testContact,
        uuidv4()
      );

      return { success: result.success, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

import { storage } from './storage';

export const multiChannelMessagingService = new MultiChannelMessagingService(storage);