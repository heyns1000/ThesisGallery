import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@shared/schema";

interface ConversationThreadProps {
  conversation: Conversation;
  onExpand?: (conversation: Conversation) => void;
}

export function ConversationThread({ conversation, onExpand }: ConversationThreadProps) {
  const getProviderInfo = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'chatgpt':
        return { icon: "fas fa-robot", color: "text-green-500", bgColor: "bg-green-500/10" };
      case 'gemini':
        return { icon: "fas fa-sparkles", color: "text-blue-500", bgColor: "bg-blue-500/10" };
      default:
        return { icon: "fas fa-robot", color: "text-purple-500", bgColor: "bg-purple-500/10" };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-accent/10 text-accent">Active</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const { icon, color, bgColor } = getProviderInfo(conversation.aiProvider);
  const messages = conversation.messages as any[];
  const previewMessages = messages?.slice(0, 3) || [];

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`${bgColor} p-2 rounded-lg`}>
              <i className={`${icon} ${color}`}></i>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{conversation.title}</h4>
              <p className="text-sm text-muted-foreground">
                {conversation.aiProvider} • {new Date(conversation.updatedAt).toLocaleDateString()} • {conversation.messageCount || 0} messages
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(conversation.status)}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onExpand?.(conversation)}
              data-testid={`expand-conversation-${conversation.id}`}
            >
              <i className="fas fa-chevron-down"></i>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {previewMessages.map((message, index) => (
          <div key={index} className="chat-bubble">
            <div className="flex items-start space-x-3">
              <div className={`${message.role === 'user' ? 'bg-primary/10' : bgColor} p-2 rounded-lg`}>
                <i className={`${message.role === 'user' ? 'fas fa-user text-primary' : `${icon} ${color}`} text-sm`}></i>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">
                  {message.role === 'user' ? 'You' : conversation.aiProvider}
                </p>
                <div className={`${message.role === 'user' ? 'bg-primary/5' : 'bg-card border border-border'} rounded-lg p-3`}>
                  <p className="text-foreground text-sm line-clamp-3">
                    {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {messages && messages.length > 3 && (
          <div className="flex items-center justify-center py-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onExpand?.(conversation)}
              data-testid={`view-full-conversation-${conversation.id}`}
            >
              View full conversation <i className="fas fa-chevron-right ml-1"></i>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
