import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Document } from "@shared/schema";

interface DocumentCardProps {
  document: Document;
  onView?: (document: Document) => void;
  onDownload?: (document: Document) => void;
}

export function DocumentCard({ document, onView, onDownload }: DocumentCardProps) {
  const getIconAndColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return { icon: "fas fa-file-pdf", color: "text-red-500", bgColor: "bg-red-500/10" };
      case 'docx':
      case 'doc':
        return { icon: "fas fa-file-word", color: "text-blue-500", bgColor: "bg-blue-500/10" };
      default:
        return { icon: "fas fa-file-alt", color: "text-emerald-500", bgColor: "bg-emerald-500/10" };
    }
  };

  const { icon, color, bgColor } = getIconAndColor(document.type);
  const metadata = document.metadata as any;

  return (
    <div className="document-preview rounded-lg p-6 hover:scale-105 transition-transform cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className={`${bgColor} p-3 rounded-lg`}>
          <i className={`${icon} ${color} text-xl`}></i>
        </div>
        <Badge variant="secondary">{document.type}</Badge>
      </div>
      
      <h4 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
        {document.title}
      </h4>
      
      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
        {document.content.substring(0, 150)}...
      </p>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <span>{metadata?.size ? `${Math.round(metadata.size / 1024)}KB` : 'Unknown size'}</span>
        <span>Updated {new Date(document.updatedAt).toLocaleDateString()}</span>
      </div>
      
      <div className="pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            onClick={() => onView?.(document)}
            data-testid={`view-document-${document.id}`}
          >
            <i className="fas fa-eye mr-2"></i>
            View Article
          </Button>
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => onDownload?.(document)}
            data-testid={`download-document-${document.id}`}
          >
            <i className="fas fa-download mr-2"></i>
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
