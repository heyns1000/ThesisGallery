import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, ExternalLink, Calendar, User, AlertCircle, CheckCircle } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  type?: string;
  priority?: string;
  author?: string;
  size?: string;
  status?: string;
  lastUpdated?: string;
}

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
}

export function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getDocumentType = (id: string) => {
    const typeMap: Record<string, string> = {
      '1': 'PDF',
      '2': 'DOCX',
      '3': 'PDF',
      '4': 'PDF',
      '5': 'DOCX',
      '6': 'PDF',
      '7': 'DOCX',
      '8': 'PDF',
      '9': 'DOCX',
      '10': 'PDF'
    };
    return typeMap[id] || 'PDF';
  };

  const getDocumentStatus = (id: string) => {
    const statusMap: Record<string, string> = {
      '1': 'Active',
      '2': 'Under Review',
      '3': 'Active',
      '4': 'Draft',
      '5': 'Active',
      '6': 'Under Review',
      '7': 'Active',
      '8': 'Active',
      '9': 'Draft',
      '10': 'Active'
    };
    return statusMap[id] || 'Active';
  };

  const getDocumentPriority = (id: string) => {
    const priorityMap: Record<string, string> = {
      '1': 'High',
      '2': 'Medium',
      '3': 'High',
      '4': 'Low',
      '5': 'Medium',
      '6': 'High',
      '7': 'Medium',
      '8': 'High',
      '9': 'Low',
      '10': 'Medium'
    };
    return priorityMap[id] || 'Medium';
  };

  const getDocumentSize = (id: string) => {
    const sizeMap: Record<string, string> = {
      '1': '2.4 MB',
      '2': '1.8 MB',
      '3': '3.2 MB',
      '4': '0.9 MB',
      '5': '2.1 MB',
      '6': '1.5 MB',
      '7': '2.7 MB',
      '8': '3.8 MB',
      '9': '1.2 MB',
      '10': '2.9 MB'
    };
    return sizeMap[id] || '1.5 MB';
  };

  const getDocumentAuthor = (id: string) => {
    const authorMap: Record<string, string> = {
      '1': 'Legal Team',
      '2': 'Compliance Officer',
      '3': 'Legal Team',
      '4': 'Project Manager',
      '5': 'Legal Team',
      '6': 'Compliance Officer',
      '7': 'Legal Team',
      '8': 'VaultMesh™ Admin',
      '9': 'Project Manager',
      '10': 'Legal Team'
    };
    return authorMap[id] || 'Legal Team';
  };

  const getDocumentContent = () => {
    return `
      <div class="document-content">
        <h1>${document.title}</h1>
        <p class="lead">${document.description}</p>
        
        <h2>Document Overview</h2>
        <p>This document is part of the VaultMesh™ legal documentation system and provides comprehensive information for ${document.category} purposes.</p>
        
        <div class="document-details">
          <h3>Document Specifications</h3>
          <ul>
            <li><strong>Type:</strong> ${getDocumentType(document.id)}</li>
            <li><strong>Status:</strong> ${getDocumentStatus(document.id)}</li>
            <li><strong>Priority:</strong> ${getDocumentPriority(document.id)}</li>
            <li><strong>Size:</strong> ${getDocumentSize(document.id)}</li>
            <li><strong>Author:</strong> ${getDocumentAuthor(document.id)}</li>
          </ul>
        </div>
        
        <h2>VaultMesh™ Integration</h2>
        <p>This document is integrated with the VaultMesh™ infrastructure ensuring secure access, audit trails, and compliance with enterprise security standards.</p>
        
        <h2>Legal Compliance</h2>
        <p>All documentation follows enterprise compliance standards and regulatory requirements for the Fruitful Holdings ecosystem.</p>
      </div>
    `;
  };

  const handleDownload = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Use window.open instead of document.createElement for better compatibility
      const downloadUrl = `/api/legal-documents/${document.id}/download`;
      window.open(downloadUrl, '_blank');
      setIsLoading(false);
    }, 1000);
  };

  const handleOpenInSecureSign = () => {
    // Navigate to SecureSign portal integration
    const secureSignUrl = `/securesign/document/${document.id}`;
    window.open(secureSignUrl, '_blank');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'under review': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl h-[90vh] rounded-lg shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {document.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {document.description}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Document Info Bar */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                {getStatusIcon(getDocumentStatus(document.id))}
                <span className="text-sm font-medium">
                  {getDocumentStatus(document.id)}
                </span>
              </div>
              <Badge variant={getPriorityColor(getDocumentPriority(document.id))}>
                {getDocumentPriority(document.id)} Priority
              </Badge>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>{getDocumentAuthor(document.id)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Updated July 19, 2025</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>{isLoading ? 'Downloading...' : 'Download'}</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleOpenInSecureSign}
                className="flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in SecureSign™</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Document Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: getDocumentContent() }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}