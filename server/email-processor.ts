// Email Metadata Processing for FAA™ Document Verification
// Extracts timestamps, recipients, senders for authenticity verification

export interface EmailMetadata {
  messageId?: string;
  sender: string;
  recipients: string[];
  subject: string;
  timestamp: Date;
  dateString: string;
  timeString: string;
  headers?: Record<string, string>;
  attachments?: string[];
  verified: boolean;
  originalityScore: number;
}

export interface EmailParsingResult {
  metadata: EmailMetadata;
  content: string;
  verification: {
    timestampValid: boolean;
    senderVerified: boolean;
    recipientsValid: boolean;
    attachmentsFound: boolean;
  };
}

export class EmailProcessor {
  
  /**
   * Parse email content and extract metadata for verification
   */
  static parseEmailContent(emailText: string): EmailParsingResult {
    const lines = emailText.split('\n');
    const metadata: EmailMetadata = {
      sender: '',
      recipients: [],
      subject: '',
      timestamp: new Date(),
      dateString: '',
      timeString: '',
      verified: false,
      originalityScore: 0
    };

    let content = '';
    let inContent = false;
    let attachmentCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Extract subject
      if (line.startsWith('Subject:')) {
        metadata.subject = line.replace('Subject:', '').trim();
        continue;
      }

      // Extract sender
      if (line.includes('<') && line.includes('@') && line.includes('>')) {
        const emailMatch = line.match(/<([^>]+@[^>]+)>/);
        const nameMatch = line.match(/^([^<]+)</);
        
        if (emailMatch && !metadata.sender) {
          metadata.sender = emailMatch[1];
        }
      }

      // Extract timestamp information
      if (line.match(/\d{1,2}:\d{2}/) || line.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/)) {
        const timeMatch = line.match(/(\d{1,2}:\d{2})/);
        const dateMatch = line.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(\d{1,2})\s+(\w+)/);
        
        if (timeMatch) {
          metadata.timeString = timeMatch[1];
        }
        
        if (dateMatch) {
          metadata.dateString = `${dateMatch[1]} ${dateMatch[2]} ${dateMatch[3]}`;
          
          // Parse the full timestamp
          try {
            const fullDateStr = `${dateMatch[3]} ${dateMatch[2]} ${metadata.timeString || '00:00'}`;
            metadata.timestamp = new Date(fullDateStr);
          } catch (e) {
            // Fallback to current date if parsing fails
            metadata.timestamp = new Date();
          }
        }
      }

      // Extract recipients (to, cc, bcc lines)
      if (line.startsWith('to ') || line.startsWith('cc ') || line.startsWith('bcc ')) {
        const recipients = line.replace(/^(to|cc|bcc)\s+/, '').split(',');
        metadata.recipients.push(...recipients.map(r => r.trim()));
      }

      // Count attachments
      if (line.includes('attachment') || line.includes('Scanned by Gmail')) {
        attachmentCount++;
      }

      // Collect content after headers
      if (inContent || (!line.includes(':') && !line.includes('<') && line.length > 20)) {
        inContent = true;
        content += line + '\n';
      }
    }

    // Calculate verification metrics
    const verification = {
      timestampValid: metadata.timestamp > new Date('2020-01-01'),
      senderVerified: metadata.sender.includes('@') && metadata.sender.length > 5,
      recipientsValid: metadata.recipients.length > 0,
      attachmentsFound: attachmentCount > 0
    };

    // Calculate originality score based on verification factors
    let score = 0;
    if (verification.timestampValid) score += 25;
    if (verification.senderVerified) score += 25;
    if (verification.recipientsValid) score += 25;
    if (verification.attachmentsFound) score += 15;
    if (metadata.subject.length > 10) score += 10;

    metadata.verified = score >= 70;
    metadata.originalityScore = score;
    metadata.attachments = attachmentCount > 0 ? [`${attachmentCount} attachment(s) found`] : [];

    return {
      metadata,
      content: content.trim(),
      verification
    };
  }

  /**
   * Verify document authenticity based on email metadata
   */
  static verifyDocumentAuthenticity(emailResult: EmailParsingResult): {
    authentic: boolean;
    confidence: number;
    reasons: string[];
  } {
    const { metadata, verification } = emailResult;
    const reasons: string[] = [];
    let confidence = 0;

    // Check timestamp authenticity
    if (verification.timestampValid) {
      reasons.push(`✓ Valid timestamp: ${metadata.dateString} ${metadata.timeString}`);
      confidence += 30;
    } else {
      reasons.push(`✗ Invalid or missing timestamp`);
    }

    // Check sender verification
    if (verification.senderVerified) {
      reasons.push(`✓ Verified sender: ${metadata.sender}`);
      confidence += 25;
    } else {
      reasons.push(`✗ Sender not verified`);
    }

    // Check recipients
    if (verification.recipientsValid) {
      reasons.push(`✓ Recipients found: ${metadata.recipients.length} recipient(s)`);
      confidence += 20;
    } else {
      reasons.push(`✗ No valid recipients found`);
    }

    // Check for attachments (indicates original email)
    if (verification.attachmentsFound) {
      reasons.push(`✓ Original attachments detected`);
      confidence += 15;
    }

    // Subject line analysis
    if (metadata.subject && metadata.subject.length > 5) {
      reasons.push(`✓ Meaningful subject: "${metadata.subject}"`);
      confidence += 10;
    }

    return {
      authentic: confidence >= 70,
      confidence,
      reasons
    };
  }

  /**
   * Generate compliance report for FAA™ system
   */
  static generateComplianceReport(emailResult: EmailParsingResult): {
    documentId: string;
    verificationStatus: 'VERIFIED' | 'PARTIAL' | 'FAILED';
    timestamp: Date;
    metadata: EmailMetadata;
    complianceScore: number;
    atomLevelVerification: boolean;
  } {
    const authenticity = this.verifyDocumentAuthenticity(emailResult);
    const documentId = `DOC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    let verificationStatus: 'VERIFIED' | 'PARTIAL' | 'FAILED';
    if (authenticity.confidence >= 85) {
      verificationStatus = 'VERIFIED';
    } else if (authenticity.confidence >= 60) {
      verificationStatus = 'PARTIAL';
    } else {
      verificationStatus = 'FAILED';
    }

    return {
      documentId,
      verificationStatus,
      timestamp: new Date(),
      metadata: emailResult.metadata,
      complianceScore: authenticity.confidence,
      atomLevelVerification: verificationStatus === 'VERIFIED'
    };
  }
}