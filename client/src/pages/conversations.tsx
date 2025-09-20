import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConversationThread } from "@/components/ui/conversation-thread";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useInteractivity } from "@/lib/useInteractivity";
import { getContent } from "@/lib/appData";
import type { Conversation } from "@shared/schema";

export default function Conversations() {
  const content = getContent('conversations');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProvider, setFilterProvider] = useState("all");
  const [expandedConversation, setExpandedConversation] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { trigger } = useInteractivity();

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const createConversationMutation = useMutation({
    mutationFn: async (conversationData: any) => {
      return await apiRequest("POST", "/api/conversations", conversationData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({ description: "Conversation created successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        variant: "destructive",
        description: `Failed to create conversation: ${error.message}` 
      });
    },
  });

  const handleExpand = (conversation: Conversation) => {
    if (expandedConversation === conversation.id) {
      setExpandedConversation(null);
    } else {
      setExpandedConversation(conversation.id);
      toast({ description: `Viewing full conversation: ${conversation.title}` });
    }
  };

  const handleImportConversation = () => {
    // Simulate conversation import
    const sampleConversation = {
      title: "New FAA Brand Discussion",
      aiProvider: "ChatGPT",
      messages: [
        { role: "user", content: "Help me with brand exposure for FAA system" },
        { role: "assistant", content: "I'll help you expose and protect your FAA brands..." }
      ],
      messageCount: 2,
      status: "active"
    };
    
    createConversationMutation.mutate(sampleConversation);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = filterProvider === "all" || 
                           conv.aiProvider.toLowerCase() === filterProvider.toLowerCase();
    return matchesSearch && matchesProvider;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground" data-testid="text-conversations-title">{content.title}</h3>
            <p className="text-muted-foreground" data-testid="text-conversations-subtitle">{content.subtitle}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={filterProvider} onValueChange={setFilterProvider}>
              <SelectTrigger data-testid="select-ai-provider">
                <SelectValue placeholder="All Conversations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conversations</SelectItem>
                <SelectItem value="chatgpt">ChatGPT</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Input
                type="text"
                placeholder={content.sections?.search?.placeholder || 'Search conversations...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-conversation-search"
              />
              <i className="fas fa-search absolute left-3 top-3 text-muted-foreground"></i>
            </div>
            <Button 
              onClick={handleImportConversation}
              disabled={createConversationMutation.isPending}
              data-testid="button-import-conversation"
            >
              <i className="fas fa-plus mr-2"></i>
              {createConversationMutation.isPending ? 'Importing...' : content.buttons?.newChat || 'Import Chat'}
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border animate-pulse">
              <div className="px-6 py-4 border-b border-border">
                <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
              <div className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="text-center py-12">
          <i className="fas fa-comments text-muted-foreground text-6xl mb-4"></i>
          <h4 className="text-lg font-semibold text-foreground mb-2">
            {searchTerm || filterProvider !== "all" ? "No conversations found" : "No conversations imported yet"}
          </h4>
          <p className="text-muted-foreground mb-6">
            {searchTerm || filterProvider !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Import your first AI conversation to get started"
            }
          </p>
          {!searchTerm && filterProvider === "all" && (
            <Button onClick={handleImportConversation}>
              <i className="fas fa-download mr-2"></i>
              Import Conversation
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {filteredConversations.map((conversation) => (
              <ConversationThread
                key={conversation.id}
                conversation={conversation}
                onExpand={handleExpand}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button 
              variant="secondary" 
              onClick={() => trigger('Conversations load more action triggered!')}
              data-testid="button-load-more-conversations"
            >
              Load More Conversations
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
