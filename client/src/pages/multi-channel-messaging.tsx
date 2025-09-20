import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useInteractivity } from '@/lib/useInteractivity';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  MessageSquare, 
  Plus, 
  Settings, 
  Send, 
  Eye, 
  BarChart3, 
  Users, 
  FileText,
  PlayCircle,
  TestTube,
  Activity,
  TrendingUp,
  MousePointer,
  Phone,
  Mail,
  Smartphone,
  MessageCircle,
  Zap,
  Globe
} from 'lucide-react';

interface MessageChannel {
  id: string;
  name: string;
  type: 'email' | 'whatsapp' | 'sms' | 'push';
  description?: string;
  isActive: boolean;
  configuration: any;
  rateLimits?: any;
  createdAt: string;
  updatedAt: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  channelType: string;
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  approvalStatus: string;
  whatsappTemplateId?: string;
  createdAt: string;
  updatedAt: string;
}

interface MessagingCampaign {
  id: string;
  name: string;
  description?: string;
  channelIds: string[];
  templateId: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  scheduleType: 'immediate' | 'scheduled' | 'drip';
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  clickCount: number;
  responseCount: number;
  failedCount: number;
  createdAt: string;
  updatedAt: string;
}

interface WhatsAppConversation {
  id: string;
  contactId: string;
  whatsappNumber: string;
  conversationStatus: string;
  lastMessageAt?: string;
  messageCount: number;
  isBusinessInitiated: boolean;
}

interface SMSConversation {
  id: string;
  contactId: string;
  phoneNumber: string;
  conversationStatus: string;
  lastMessageAt?: string;
  messageCount: number;
  twilioPhoneNumber?: string;
}

export default function MultiChannelMessagingPage() {
  const { trigger } = useInteractivity();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  // Fetch message channels
  const { data: channels = [] } = useQuery<MessageChannel[]>({
    queryKey: ['/api/messaging/channels'],
  });

  // Fetch message templates
  const { data: templates = [] } = useQuery<MessageTemplate[]>({
    queryKey: ['/api/messaging/templates'],
  });

  // Fetch messaging campaigns
  const { data: campaigns = [] } = useQuery<MessagingCampaign[]>({
    queryKey: ['/api/messaging/campaigns'],
  });

  // Fetch WhatsApp conversations
  const { data: whatsappConversations = [] } = useQuery<WhatsAppConversation[]>({
    queryKey: ['/api/messaging/whatsapp/conversations'],
  });

  // Fetch SMS conversations
  const { data: smsConversations = [] } = useQuery<SMSConversation[]>({
    queryKey: ['/api/messaging/sms/conversations'],
  });

  // Fetch analytics data
  const { data: analytics = [] } = useQuery({
    queryKey: ['/api/messaging/analytics'],
  });

  // Fetch contacts for campaign targeting
  const { data: contacts = [] } = useQuery({
    queryKey: ['/api/contacts'],
  });

  // Channel type icons
  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageCircle className="h-4 w-4" />;
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'push': return <Zap className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  // Channel type colors
  const getChannelColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-500';
      case 'whatsapp': return 'bg-green-500';
      case 'sms': return 'bg-purple-500';
      case 'push': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  // Create channel mutation
  const createChannelMutation = useMutation({
    mutationFn: async (channelData: any) => {
      return apiRequest('/api/messaging/channels', {
        method: 'POST',
        body: JSON.stringify(channelData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messaging/channels'] });
      toast({
        title: "Channel Created",
        description: "Message channel created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create message channel.",
        variant: "destructive",
      });
    },
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      return apiRequest('/api/messaging/templates', {
        method: 'POST',
        body: JSON.stringify(templateData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messaging/templates'] });
      toast({
        title: "Template Created",
        description: "Message template created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create message template.",
        variant: "destructive",
      });
    },
  });

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: any) => {
      return apiRequest('/api/messaging/campaigns', {
        method: 'POST',
        body: JSON.stringify(campaignData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messaging/campaigns'] });
      toast({
        title: "Campaign Created",
        description: "Messaging campaign created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create messaging campaign.",
        variant: "destructive",
      });
    },
  });

  // Test channel mutation
  const testChannelMutation = useMutation({
    mutationFn: async ({ channelId, testRecipient }: { channelId: string; testRecipient: string }) => {
      return apiRequest(`/api/messaging/channels/${channelId}/test`, {
        method: 'POST',
        body: JSON.stringify({ testRecipient }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Test Sent",
        description: "Test message sent successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Test Failed",
        description: "Failed to send test message.",
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: any) => {
      return apiRequest('/api/messaging/send', {
        method: 'POST',
        body: JSON.stringify(messageData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Messages Sent",
        description: "Messages sent successfully across all selected channels.",
      });
    },
    onError: () => {
      toast({
        title: "Send Failed",
        description: "Failed to send messages.",
        variant: "destructive",
      });
    },
  });

  // Dashboard metrics calculations
  const totalChannels = channels.length;
  const activeChannels = channels.filter(c => c.isActive).length;
  const totalTemplates = templates.length;
  const totalCampaigns = campaigns.length;
  const totalConversations = whatsappConversations.length + smsConversations.length;

  const channelBreakdown = {
    email: channels.filter(c => c.type === 'email').length,
    whatsapp: channels.filter(c => c.type === 'whatsapp').length,
    sms: channels.filter(c => c.type === 'sms').length,
    push: channels.filter(c => c.type === 'push').length,
  };

  return (
    <div className="p-8 space-y-8" data-testid="multi-channel-messaging-page">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Multi-Channel Messaging Hub</h1>
        <p className="text-muted-foreground mt-2">
          Sacred Baobab™ Foundation - Unified Communication Platform for 7,000+ Products across 48+ Sectors
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" data-testid="tab-dashboard">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="channels" data-testid="tab-channels">
            <Settings className="h-4 w-4 mr-2" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="templates" data-testid="tab-templates">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="campaigns" data-testid="tab-campaigns">
            <Send className="h-4 w-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="conversations" data-testid="tab-conversations">
            <MessageSquare className="h-4 w-4 mr-2" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Channels</CardTitle>
                <Globe className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{totalChannels}</div>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  {activeChannels} active channels
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Message Templates</CardTitle>
                <FileText className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">{totalTemplates}</div>
                <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                  Ready for deployment
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                <Send className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{totalCampaigns}</div>
                <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">
                  Cross-platform reach
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                <MessageSquare className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">{totalConversations}</div>
                <p className="text-xs text-orange-600 dark:text-orange-300 mt-1">
                  WhatsApp + SMS active
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Channel Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Channel Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-lg font-bold text-blue-600">{channelBreakdown.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">WhatsApp</p>
                    <p className="text-lg font-bold text-green-600">{channelBreakdown.whatsapp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">SMS</p>
                    <p className="text-lg font-bold text-purple-600">{channelBreakdown.sms}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Push</p>
                    <p className="text-lg font-bold text-orange-600">{channelBreakdown.push}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                  Quick Send
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quick-template">Template</Label>
                  <Select>
                    <SelectTrigger data-testid="select-template">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} ({template.channelType})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Channels</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {channels.filter(c => c.isActive).map((channel) => (
                      <div key={channel.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`channel-${channel.id}`}
                          checked={selectedChannels.includes(channel.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedChannels([...selectedChannels, channel.id]);
                            } else {
                              setSelectedChannels(selectedChannels.filter(id => id !== channel.id));
                            }
                          }}
                          className="rounded border-gray-300"
                          data-testid={`checkbox-channel-${channel.id}`}
                        />
                        <label htmlFor={`channel-${channel.id}`} className="text-sm flex items-center">
                          {getChannelIcon(channel.type)}
                          <span className="ml-1">{channel.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  disabled={selectedChannels.length === 0}
                  data-testid="button-quick-send"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send to Selected Channels
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaigns.slice(0, 5).map((campaign) => (
                    <div key={campaign.id} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Badge variant="outline" className={getChannelColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{campaign.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {campaign.sentCount} / {campaign.totalRecipients} sent
                        </p>
                      </div>
                    </div>
                  ))}
                  {campaigns.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No recent campaigns</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Message Channels</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button data-testid="button-add-channel">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Channel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Message Channel</DialogTitle>
                  <DialogDescription>
                    Set up a new communication channel for your messaging campaigns.
                  </DialogDescription>
                </DialogHeader>
                <ChannelCreateForm onSubmit={createChannelMutation.mutate} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel) => (
              <Card key={channel.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getChannelIcon(channel.type)}
                      <CardTitle className="text-lg">{channel.name}</CardTitle>
                    </div>
                    <Badge variant={channel.isActive ? "default" : "secondary"}>
                      {channel.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{channel.description}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getChannelColor(channel.type)}`}></div>
                      <span className="text-xs font-medium uppercase">{channel.type}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => testChannelMutation.mutate({ 
                        channelId: channel.id, 
                        testRecipient: 'test@example.com' 
                      })}
                      data-testid={`button-test-channel-${channel.id}`}
                    >
                      <TestTube className="h-3 w-3 mr-1" />
                      Test
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`button-edit-channel-${channel.id}`}>
                      <Settings className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {channels.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Channels Yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create your first message channel to start sending multi-channel campaigns.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button data-testid="button-create-first-channel">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Channel
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Message Channel</DialogTitle>
                        <DialogDescription>
                          Set up your first communication channel.
                        </DialogDescription>
                      </DialogHeader>
                      <ChannelCreateForm onSubmit={createChannelMutation.mutate} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Message Templates</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button data-testid="button-add-template">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Message Template</DialogTitle>
                  <DialogDescription>
                    Design a reusable template for your messaging campaigns.
                  </DialogDescription>
                </DialogHeader>
                <TemplateCreateForm onSubmit={createTemplateMutation.mutate} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {getChannelIcon(template.channelType)}
                      <Badge variant={template.isActive ? "default" : "secondary"}>
                        {template.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {template.subject && (
                    <div>
                      <Label className="text-xs text-muted-foreground">SUBJECT</Label>
                      <p className="text-sm font-medium">{template.subject}</p>
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">CONTENT PREVIEW</Label>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {template.content.substring(0, 120)}...
                    </p>
                  </div>

                  {template.variables.length > 0 && (
                    <div>
                      <Label className="text-xs text-muted-foreground">VARIABLES</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.variables.slice(0, 3).map((variable) => (
                          <Badge key={variable} variant="outline" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                        {template.variables.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.variables.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`button-preview-template-${template.id}`}>
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`button-edit-template-${template.id}`}>
                      <Settings className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {templates.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Templates Yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create your first message template to streamline your campaigns.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button data-testid="button-create-first-template">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create Message Template</DialogTitle>
                        <DialogDescription>
                          Design your first message template.
                        </DialogDescription>
                      </DialogHeader>
                      <TemplateCreateForm onSubmit={createTemplateMutation.mutate} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Messaging Campaigns</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button data-testid="button-add-campaign">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Messaging Campaign</DialogTitle>
                  <DialogDescription>
                    Launch a multi-channel messaging campaign across selected platforms.
                  </DialogDescription>
                </DialogHeader>
                <CampaignCreateForm 
                  onSubmit={createCampaignMutation.mutate}
                  channels={channels}
                  templates={templates}
                  contacts={contacts}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      {campaign.description && (
                        <p className="text-sm text-muted-foreground mt-1">{campaign.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={campaign.status === 'sent' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                      {campaign.status === 'draft' && (
                        <Button size="sm" data-testid={`button-start-campaign-${campaign.id}`}>
                          <PlayCircle className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">RECIPIENTS</p>
                      <p className="text-lg font-bold">{campaign.totalRecipients}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">SENT</p>
                      <p className="text-lg font-bold text-blue-600">{campaign.sentCount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">DELIVERED</p>
                      <p className="text-lg font-bold text-green-600">{campaign.deliveredCount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">RESPONSES</p>
                      <p className="text-lg font-bold text-purple-600">{campaign.responseCount}</p>
                    </div>
                  </div>
                  
                  {campaign.sentCount > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{Math.round((campaign.sentCount / campaign.totalRecipients) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(campaign.sentCount / campaign.totalRecipients) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {campaigns.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Send className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Campaigns Yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create your first multi-channel messaging campaign to reach your audience.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button data-testid="button-create-first-campaign">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Campaign
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create Messaging Campaign</DialogTitle>
                        <DialogDescription>
                          Create your first multi-channel campaign.
                        </DialogDescription>
                      </DialogHeader>
                      <CampaignCreateForm 
                        onSubmit={createCampaignMutation.mutate}
                        channels={channels}
                        templates={templates}
                        contacts={contacts}
                      />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="space-y-6">
          <h2 className="text-2xl font-semibold">Active Conversations</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* WhatsApp Conversations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                  WhatsApp Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {whatsappConversations.map((conversation) => (
                  <div key={conversation.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <p className="font-medium">{conversation.whatsappNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {conversation.messageCount} messages • {conversation.conversationStatus}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" data-testid={`button-view-whatsapp-${conversation.id}`}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
                {whatsappConversations.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No WhatsApp conversations yet</p>
                )}
              </CardContent>
            </Card>

            {/* SMS Conversations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="h-5 w-5 mr-2 text-purple-600" />
                  SMS Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {smsConversations.map((conversation) => (
                  <div key={conversation.id} className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div>
                      <p className="font-medium">{conversation.phoneNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {conversation.messageCount} messages • {conversation.conversationStatus}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" data-testid={`button-view-sms-${conversation.id}`}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
                {smsConversations.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No SMS conversations yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-semibold">Multi-Channel Analytics</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Messages Sent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47,823</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">98.7%</div>
                <p className="text-xs text-muted-foreground">+0.3% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">23.4%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Channels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{activeChannels}</div>
                <p className="text-xs text-muted-foreground">Across all platforms</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Channel Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-xs text-muted-foreground">Traditional reach</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">98.5%</p>
                    <p className="text-xs text-muted-foreground">delivery rate</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-xs text-muted-foreground">Highest engagement</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">99.2%</p>
                    <p className="text-xs text-muted-foreground">delivery rate</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">SMS</p>
                      <p className="text-xs text-muted-foreground">Universal access</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600">97.8%</p>
                    <p className="text-xs text-muted-foreground">delivery rate</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-xs text-muted-foreground">Instant delivery</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">94.2%</p>
                    <p className="text-xs text-muted-foreground">delivery rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Channel Create Form Component
function ChannelCreateForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    isActive: true,
    configuration: {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="channel-name">Channel Name</Label>
        <Input
          id="channel-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter channel name"
          required
          data-testid="input-channel-name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="channel-type">Channel Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger data-testid="select-channel-type">
            <SelectValue placeholder="Select channel type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="push">Push Notifications</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="channel-description">Description</Label>
        <Textarea
          id="channel-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter channel description"
          data-testid="textarea-channel-description"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="channel-active"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          data-testid="switch-channel-active"
        />
        <Label htmlFor="channel-active">Channel is active</Label>
      </div>

      <Button type="submit" className="w-full" data-testid="button-submit-channel">
        Create Channel
      </Button>
    </form>
  );
}

// Template Create Form Component
function TemplateCreateForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    channelType: '',
    subject: '',
    content: '',
    variables: [],
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="template-name">Template Name</Label>
        <Input
          id="template-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter template name"
          required
          data-testid="input-template-name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="template-channel-type">Channel Type</Label>
        <Select value={formData.channelType} onValueChange={(value) => setFormData({ ...formData, channelType: value })}>
          <SelectTrigger data-testid="select-template-channel-type">
            <SelectValue placeholder="Select channel type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="push">Push Notifications</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(formData.channelType === 'email' || formData.channelType === 'push') && (
        <div className="space-y-2">
          <Label htmlFor="template-subject">Subject</Label>
          <Input
            id="template-subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Enter message subject"
            data-testid="input-template-subject"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="template-content">Message Content</Label>
        <Textarea
          id="template-content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Enter your message content. Use {{variable}} for dynamic content."
          rows={6}
          required
          data-testid="textarea-template-content"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="template-active"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          data-testid="switch-template-active"
        />
        <Label htmlFor="template-active">Template is active</Label>
      </div>

      <Button type="submit" className="w-full" data-testid="button-submit-template">
        Create Template
      </Button>
    </form>
  );
}

// Campaign Create Form Component
function CampaignCreateForm({ 
  onSubmit, 
  channels, 
  templates, 
  contacts 
}: { 
  onSubmit: (data: any) => void;
  channels: MessageChannel[];
  templates: MessageTemplate[];
  contacts: any[];
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    channelIds: [],
    templateId: '',
    scheduleType: 'immediate',
    targetAudience: { contactIds: [] }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="campaign-name">Campaign Name</Label>
        <Input
          id="campaign-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter campaign name"
          required
          data-testid="input-campaign-name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="campaign-description">Description</Label>
        <Textarea
          id="campaign-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter campaign description"
          data-testid="textarea-campaign-description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="campaign-template">Template</Label>
        <Select value={formData.templateId} onValueChange={(value) => setFormData({ ...formData, templateId: value })}>
          <SelectTrigger data-testid="select-campaign-template">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name} ({template.channelType})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Select Channels</Label>
        <div className="grid grid-cols-2 gap-2">
          {channels.filter(c => c.isActive).map((channel) => (
            <div key={channel.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`campaign-channel-${channel.id}`}
                checked={formData.channelIds.includes(channel.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      channelIds: [...formData.channelIds, channel.id]
                    });
                  } else {
                    setFormData({
                      ...formData,
                      channelIds: formData.channelIds.filter(id => id !== channel.id)
                    });
                  }
                }}
                className="rounded border-gray-300"
                data-testid={`checkbox-campaign-channel-${channel.id}`}
              />
              <label htmlFor={`campaign-channel-${channel.id}`} className="text-sm">
                {channel.name} ({channel.type})
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={formData.channelIds.length === 0 || !formData.templateId}
        data-testid="button-submit-campaign"
      >
        Create Campaign
      </Button>
    </form>
  );
}