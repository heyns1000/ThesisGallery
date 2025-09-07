import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import handlebars from 'handlebars';
import { v4 as uuidv4 } from 'uuid';
import type { 
  EmailProvider, 
  EmailTemplate, 
  EmailCampaign, 
  EmailSend, 
  InsertEmailProvider,
  InsertEmailTemplate,
  InsertEmailCampaign,
  InsertEmailSend,
  InsertEmailTracking
} from '@shared/schema';

// Email Provider Configuration Types
interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  accessToken?: string;
}

interface EmailProviderConfig {
  smtp?: SMTPConfig;
  oauth?: OAuthConfig;
  apiKey?: string;
}

// Template Variables Interface
interface TemplateVariables {
  [key: string]: any;
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  unsubscribeUrl?: string;
  trackingPixelUrl?: string;
}

// Email Sending Result
interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  trackingId: string;
}

export class EnterpriseEmailService {
  private storage: any;
  private transporters: Map<string, nodemailer.Transporter> = new Map();

  constructor(storage: any) {
    this.storage = storage;
  }

  // ===============================
  // PROVIDER MANAGEMENT
  // ===============================

  async createEmailProvider(providerData: InsertEmailProvider): Promise<EmailProvider> {
    // Validate configuration based on provider type
    this.validateProviderConfiguration(providerData.type, providerData.configuration);
    
    const provider = await this.storage.createEmailProvider(providerData);
    
    // Initialize transporter for this provider
    if (provider.isActive) {
      await this.initializeTransporter(provider);
    }
    
    return provider;
  }

  async updateEmailProvider(providerId: string, updates: Partial<EmailProvider>): Promise<EmailProvider | null> {
    const provider = await this.storage.updateEmailProvider(providerId, updates);
    if (provider && provider.isActive) {
      await this.initializeTransporter(provider);
    } else if (provider && !provider.isActive) {
      this.transporters.delete(providerId);
    }
    return provider;
  }

  async getEmailProviders(): Promise<EmailProvider[]> {
    return this.storage.getEmailProviders();
  }

  async getActiveEmailProvider(): Promise<EmailProvider | null> {
    const providers = await this.storage.getEmailProviders();
    return providers.find(p => p.isActive) || null;
  }

  private validateProviderConfiguration(type: string, config: any): void {
    switch (type) {
      case 'smtp':
        if (!config.smtp || !config.smtp.host || !config.smtp.auth) {
          throw new Error('SMTP configuration requires host and auth credentials');
        }
        break;
      case 'oauth':
        if (!config.oauth || !config.oauth.clientId || !config.oauth.refreshToken) {
          throw new Error('OAuth configuration requires clientId, clientSecret, and refreshToken');
        }
        break;
      case 'api':
        if (!config.apiKey) {
          throw new Error('API configuration requires apiKey');
        }
        break;
      default:
        throw new Error(`Unsupported provider type: ${type}`);
    }
  }

  private async initializeTransporter(provider: EmailProvider): Promise<void> {
    const config = provider.configuration as EmailProviderConfig;
    let transporter: nodemailer.Transporter;

    try {
      switch (provider.type) {
        case 'smtp':
          transporter = nodemailer.createTransporter({
            host: config.smtp!.host,
            port: config.smtp!.port,
            secure: config.smtp!.secure,
            auth: {
              user: config.smtp!.auth.user,
              pass: config.smtp!.auth.pass,
            },
          });
          break;

        case 'oauth':
          const oauth2Client = new google.auth.OAuth2(
            config.oauth!.clientId,
            config.oauth!.clientSecret,
            'https://developers.google.com/oauthplayground'
          );
          
          oauth2Client.setCredentials({
            refresh_token: config.oauth!.refreshToken,
          });

          const accessToken = await oauth2Client.getAccessToken();
          
          transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: config.smtp?.auth.user || 'user@gmail.com',
              clientId: config.oauth!.clientId,
              clientSecret: config.oauth!.clientSecret,
              refreshToken: config.oauth!.refreshToken,
              accessToken: accessToken.token!,
            },
          } as any);
          break;

        default:
          throw new Error(`Unsupported transporter type: ${provider.type}`);
      }

      // Verify transporter connection
      await transporter.verify();
      this.transporters.set(provider.id, transporter);
      console.log(`✅ Email provider "${provider.name}" initialized successfully`);
      
    } catch (error) {
      console.error(`❌ Failed to initialize email provider "${provider.name}":`, error);
      throw error;
    }
  }

  // ===============================
  // TEMPLATE MANAGEMENT
  // ===============================

  async createEmailTemplate(templateData: InsertEmailTemplate): Promise<EmailTemplate> {
    // Validate handlebars template syntax
    try {
      handlebars.compile(templateData.htmlContent);
      if (templateData.textContent) {
        handlebars.compile(templateData.textContent);
      }
      handlebars.compile(templateData.subject);
    } catch (error) {
      throw new Error(`Template compilation error: ${error.message}`);
    }

    return this.storage.createEmailTemplate(templateData);
  }

  async updateEmailTemplate(templateId: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate | null> {
    return this.storage.updateEmailTemplate(templateId, updates);
  }

  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return this.storage.getEmailTemplates();
  }

  async getEmailTemplate(templateId: string): Promise<EmailTemplate | null> {
    return this.storage.getEmailTemplate(templateId);
  }

  async renderTemplate(template: EmailTemplate, variables: TemplateVariables): Promise<{
    subject: string;
    htmlContent: string;
    textContent?: string;
  }> {
    const subjectTemplate = handlebars.compile(template.subject);
    const htmlTemplate = handlebars.compile(template.htmlContent);
    const textTemplate = template.textContent ? handlebars.compile(template.textContent) : null;

    return {
      subject: subjectTemplate(variables),
      htmlContent: htmlTemplate(variables),
      textContent: textTemplate ? textTemplate(variables) : undefined,
    };
  }

  // ===============================
  // CAMPAIGN MANAGEMENT
  // ===============================

  async createEmailCampaign(campaignData: InsertEmailCampaign): Promise<EmailCampaign> {
    const campaign = await this.storage.createEmailCampaign(campaignData);
    
    // If immediate sending, start the campaign
    if (campaign.scheduleType === 'immediate' && campaign.status === 'draft') {
      await this.startCampaign(campaign.id);
    }
    
    return campaign;
  }

  async updateEmailCampaign(campaignId: string, updates: Partial<EmailCampaign>): Promise<EmailCampaign | null> {
    return this.storage.updateEmailCampaign(campaignId, updates);
  }

  async getEmailCampaigns(): Promise<EmailCampaign[]> {
    return this.storage.getEmailCampaigns();
  }

  async getCampaignAnalytics(campaignId: string): Promise<{
    totalSent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  }> {
    const campaign = await this.storage.getEmailCampaign(campaignId);
    if (!campaign) throw new Error('Campaign not found');

    const openRate = campaign.sentCount > 0 ? (campaign.openCount / campaign.sentCount) * 100 : 0;
    const clickRate = campaign.sentCount > 0 ? (campaign.clickCount / campaign.sentCount) * 100 : 0;
    const bounceRate = campaign.sentCount > 0 ? (campaign.bounceCount / campaign.sentCount) * 100 : 0;

    return {
      totalSent: campaign.sentCount,
      delivered: campaign.deliveredCount,
      opened: campaign.openCount,
      clicked: campaign.clickCount,
      bounced: campaign.bounceCount,
      unsubscribed: campaign.unsubscribeCount,
      openRate: Math.round(openRate * 100) / 100,
      clickRate: Math.round(clickRate * 100) / 100,
      bounceRate: Math.round(bounceRate * 100) / 100,
    };
  }

  async startCampaign(campaignId: string): Promise<void> {
    const campaign = await this.storage.getEmailCampaign(campaignId);
    if (!campaign) throw new Error('Campaign not found');

    if (campaign.status !== 'draft') {
      throw new Error('Only draft campaigns can be started');
    }

    // Update campaign status
    await this.storage.updateEmailCampaign(campaignId, { 
      status: 'sending',
      sentAt: new Date()
    });

    // Get contacts based on target audience
    const contacts = await this.getTargetContacts(campaign.targetAudience);
    
    // Update total recipients
    await this.storage.updateEmailCampaign(campaignId, { 
      totalRecipients: contacts.length 
    });

    // Send emails
    await this.sendCampaignEmails(campaign, contacts);
  }

  private async getTargetContacts(targetAudience: any): Promise<any[]> {
    // Get contacts based on audience filters
    const filters = targetAudience || {};
    return this.storage.getContacts(filters);
  }

  private async sendCampaignEmails(campaign: EmailCampaign, contacts: any[]): Promise<void> {
    const template = await this.storage.getEmailTemplate(campaign.templateId);
    const provider = await this.storage.getEmailProvider(campaign.providerId);
    
    if (!template || !provider) {
      throw new Error('Template or provider not found');
    }

    let sentCount = 0;
    let deliveredCount = 0;
    let bounceCount = 0;

    for (const contact of contacts) {
      try {
        const trackingId = uuidv4();
        
        // Create email send record
        const emailSend = await this.storage.createEmailSend({
          campaignId: campaign.id,
          contactId: contact.id,
          emailAddress: contact.email,
          templateId: template.id,
          providerId: provider.id,
          status: 'pending',
          trackingId,
          metadata: { contactData: contact }
        });

        // Send the email
        const result = await this.sendSingleEmail(
          template,
          provider,
          contact,
          trackingId,
          campaign.id
        );

        if (result.success) {
          await this.storage.updateEmailSend(emailSend.id, {
            status: 'sent',
            sentAt: new Date(),
            messageId: result.messageId
          });
          sentCount++;
          deliveredCount++; // For now, assume sent = delivered
        } else {
          await this.storage.updateEmailSend(emailSend.id, {
            status: 'failed',
            bounceReason: result.error
          });
          bounceCount++;
        }

      } catch (error) {
        console.error(`Failed to send email to ${contact.email}:`, error);
        bounceCount++;
      }
    }

    // Update campaign statistics
    await this.storage.updateEmailCampaign(campaign.id, {
      status: 'sent',
      sentCount,
      deliveredCount,
      bounceCount
    });
  }

  // ===============================
  // EMAIL SENDING
  // ===============================

  async sendSingleEmail(
    template: EmailTemplate,
    provider: EmailProvider,
    contact: any,
    trackingId: string,
    campaignId?: string
  ): Promise<EmailSendResult> {
    try {
      const transporter = this.transporters.get(provider.id);
      if (!transporter) {
        throw new Error(`No transporter found for provider ${provider.name}`);
      }

      // Prepare template variables
      const variables: TemplateVariables = {
        firstName: contact.firstName,
        lastName: contact.lastName,
        fullName: contact.fullName || `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
        email: contact.email,
        company: contact.company,
        unsubscribeUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/email/unsubscribe/${trackingId}`,
        trackingPixelUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/email/track/${trackingId}/open.gif`,
        ...contact.customFields
      };

      // Render template
      const rendered = await this.renderTemplate(template, variables);

      // Add tracking pixel to HTML content
      const htmlWithTracking = rendered.htmlContent + 
        `<img src="${variables.trackingPixelUrl}" width="1" height="1" style="display:none;" />`;

      // Send email
      const info = await transporter.sendMail({
        from: `"Sacred Baobab™ Ecosystem" <${provider.configuration.smtp?.auth?.user || 'noreply@fruitful.global'}>`,
        to: contact.email,
        subject: rendered.subject,
        text: rendered.textContent,
        html: htmlWithTracking,
        headers: {
          'X-Campaign-ID': campaignId || 'direct',
          'X-Tracking-ID': trackingId,
        }
      });

      return {
        success: true,
        messageId: info.messageId,
        trackingId
      };

    } catch (error) {
      console.error('Email send error:', error);
      return {
        success: false,
        error: error.message,
        trackingId
      };
    }
  }

  // ===============================
  // EMAIL TRACKING
  // ===============================

  async trackEmailOpen(trackingId: string, userAgent?: string, ipAddress?: string): Promise<void> {
    try {
      const emailSend = await this.storage.getEmailSendByTrackingId(trackingId);
      if (!emailSend) return;

      // Update email send record
      if (!emailSend.openedAt) {
        await this.storage.updateEmailSend(emailSend.id, {
          openedAt: new Date()
        });

        // Update campaign open count
        if (emailSend.campaignId) {
          await this.storage.incrementCampaignOpens(emailSend.campaignId);
        }
      }

      // Create tracking record
      await this.storage.createEmailTracking({
        sendId: emailSend.id,
        trackingId,
        eventType: 'open',
        userAgent,
        ipAddress,
        eventData: { timestamp: new Date().toISOString() }
      });

    } catch (error) {
      console.error('Email tracking error:', error);
    }
  }

  async trackEmailClick(trackingId: string, clickedUrl: string, userAgent?: string, ipAddress?: string): Promise<void> {
    try {
      const emailSend = await this.storage.getEmailSendByTrackingId(trackingId);
      if (!emailSend) return;

      // Update email send record
      if (!emailSend.clickedAt) {
        await this.storage.updateEmailSend(emailSend.id, {
          clickedAt: new Date()
        });

        // Update campaign click count
        if (emailSend.campaignId) {
          await this.storage.incrementCampaignClicks(emailSend.campaignId);
        }
      }

      // Create tracking record
      await this.storage.createEmailTracking({
        sendId: emailSend.id,
        trackingId,
        eventType: 'click',
        userAgent,
        ipAddress,
        eventData: { clickedUrl, timestamp: new Date().toISOString() }
      });

    } catch (error) {
      console.error('Email click tracking error:', error);
    }
  }

  async unsubscribeContact(trackingId: string): Promise<boolean> {
    try {
      const emailSend = await this.storage.getEmailSendByTrackingId(trackingId);
      if (!emailSend) return false;

      // Update contact status
      await this.storage.updateContact(emailSend.contactId, {
        status: 'unsubscribed'
      });

      // Update email send record
      await this.storage.updateEmailSend(emailSend.id, {
        unsubscribedAt: new Date()
      });

      // Update campaign unsubscribe count
      if (emailSend.campaignId) {
        await this.storage.incrementCampaignUnsubscribes(emailSend.campaignId);
      }

      // Create tracking record
      await this.storage.createEmailTracking({
        sendId: emailSend.id,
        trackingId,
        eventType: 'unsubscribe',
        eventData: { timestamp: new Date().toISOString() }
      });

      return true;
    } catch (error) {
      console.error('Unsubscribe error:', error);
      return false;
    }
  }

  // ===============================
  // BULK OPERATIONS
  // ===============================

  async sendBulkEmail(
    templateId: string,
    providerId: string,
    contactIds: string[],
    campaignName?: string
  ): Promise<{
    campaignId: string;
    totalSent: number;
    totalFailed: number;
  }> {
    // Create campaign for bulk send
    const campaign = await this.createEmailCampaign({
      name: campaignName || `Bulk Email - ${new Date().toLocaleDateString()}`,
      templateId,
      providerId,
      status: 'draft',
      scheduleType: 'immediate',
      targetAudience: { contactIds }
    });

    // Get contacts
    const contacts = await this.storage.getContactsByIds(contactIds);
    
    // Send emails
    await this.sendCampaignEmails(campaign, contacts);

    const updatedCampaign = await this.storage.getEmailCampaign(campaign.id);
    
    return {
      campaignId: campaign.id,
      totalSent: updatedCampaign.sentCount,
      totalFailed: updatedCampaign.bounceCount
    };
  }

  // ===============================
  // UTILITIES
  // ===============================

  async testProvider(providerId: string, testEmail: string): Promise<{ success: boolean; error?: string }> {
    try {
      const provider = await this.storage.getEmailProvider(providerId);
      if (!provider) throw new Error('Provider not found');

      const transporter = this.transporters.get(providerId);
      if (!transporter) {
        await this.initializeTransporter(provider);
      }

      const info = await transporter!.sendMail({
        from: `"Sacred Baobab™ Test" <${provider.configuration.smtp?.auth?.user || 'test@fruitful.global'}>`,
        to: testEmail,
        subject: '🌳 Sacred Baobab™ Email System Test',
        text: 'This is a test email from the Fruitful Global Master Hub enterprise email system.',
        html: '<h2>🌳 Sacred Baobab™ Email System Test</h2><p>This is a test email from the <strong>Fruitful Global Master Hub</strong> enterprise email system.</p><p>If you received this, your email provider is configured correctly!</p>'
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getEmailStatistics(): Promise<{
    totalProviders: number;
    activeProviders: number;
    totalTemplates: number;
    totalCampaigns: number;
    totalEmailsSent: number;
    recentCampaigns: EmailCampaign[];
  }> {
    const providers = await this.storage.getEmailProviders();
    const templates = await this.storage.getEmailTemplates();
    const campaigns = await this.storage.getEmailCampaigns();
    const recentCampaigns = campaigns.slice(0, 5);

    const totalEmailsSent = campaigns.reduce((sum, campaign) => sum + campaign.sentCount, 0);

    return {
      totalProviders: providers.length,
      activeProviders: providers.filter(p => p.isActive).length,
      totalTemplates: templates.length,
      totalCampaigns: campaigns.length,
      totalEmailsSent,
      recentCampaigns
    };
  }
}

import { storage } from './storage';

export const enterpriseEmailService = new EnterpriseEmailService(storage);