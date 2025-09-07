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
  Mail, 
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
  UserMinus
} from 'lucide-react';

interface EmailProvider {
  id: string;
  name: string;
  type: 'smtp' | 'oauth' | 'api';
  isActive: boolean;
  configuration: any;
  createdAt: string;
  updatedAt: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: string[];
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  description?: string;
  templateId: string;
  providerId: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  scheduleType: 'immediate' | 'scheduled' | 'drip';
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  unsubscribeCount: number;
  createdAt: string;
  updatedAt: string;
}

interface EmailStatistics {
  totalProviders: number;
  activeProviders: number;
  totalTemplates: number;
  totalCampaigns: number;
  totalEmailsSent: number;
  recentCampaigns: EmailCampaign[];
}

export default function EmailSystemPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Fetch email statistics
  const { data: emailStats } = useQuery<EmailStatistics>({
    queryKey: ['/api/email/statistics'],
  });

  // Fetch email providers
  const { data: providers = [] } = useQuery<EmailProvider[]>({
    queryKey: ['/api/email/providers'],
  });

  // Fetch email templates
  const { data: templates = [] } = useQuery<EmailTemplate[]>({
    queryKey: ['/api/email/templates'],
  });

  // Fetch email campaigns
  const { data: campaigns = [] } = useQuery<EmailCampaign[]>({
    queryKey: ['/api/email/campaigns'],
  });

  // Fetch contacts for campaign targeting
  const { data: contacts = [] } = useQuery({
    queryKey: ['/api/contacts'],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🌳 Sacred Baobab™ Enterprise Email System
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive email marketing platform with SMTP/OAuth providers, template management, 
            campaign automation, and detailed analytics for the Fruitful Global Master Hub ecosystem.
          </p>
        </div>

        {/* Dashboard Stats */}
        {emailStats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card data-testid="stat-providers">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Providers</p>
                    <p className="text-2xl font-bold">{emailStats.activeProviders}/{emailStats.totalProviders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-templates">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Templates</p>
                    <p className="text-2xl font-bold">{emailStats.totalTemplates}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-campaigns">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Send className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Campaigns</p>
                    <p className="text-2xl font-bold">{emailStats.totalCampaigns}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-emails-sent">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Emails Sent</p>
                    <p className="text-2xl font-bold">{emailStats.totalEmailsSent.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-active-campaigns">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                    <p className="text-2xl font-bold">
                      {campaigns.filter(c => c.status === 'sending' || c.status === 'scheduled').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5" data-testid="email-tabs">
            <TabsTrigger value="dashboard" data-testid="tab-dashboard">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="providers" data-testid="tab-providers">
              <Settings className="w-4 h-4 mr-2" />
              Providers
            </TabsTrigger>
            <TabsTrigger value="templates" data-testid="tab-templates">
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="campaigns" data-testid="tab-campaigns">
              <Send className="w-4 h-4 mr-2" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Campaigns */}
              <Card data-testid="recent-campaigns">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Recent Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {emailStats?.recentCampaigns.slice(0, 5).map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {campaign.sentCount} sent • {campaign.openCount} opens
                          </p>
                        </div>
                        <Badge 
                          variant={
                            campaign.status === 'sent' ? 'default' :
                            campaign.status === 'sending' ? 'secondary' :
                            campaign.status === 'draft' ? 'outline' : 'destructive'
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                    ))}
                    {(!emailStats?.recentCampaigns || emailStats.recentCampaigns.length === 0) && (
                      <p className="text-gray-500 text-center py-4">No campaigns yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card data-testid="quick-actions">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CreateProviderDialog />
                  <CreateTemplateDialog />
                  <CreateCampaignDialog 
                    providers={providers} 
                    templates={templates} 
                    contacts={contacts}
                  />
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('analytics')}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* System Overview */}
            <Card data-testid="system-overview">
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {providers.filter(p => p.isActive).length}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Email Providers</p>
                    <p className="text-xs text-gray-500 mt-1">SMTP & OAuth Support</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {templates.filter(t => t.isActive).length}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Templates</p>
                    <p className="text-xs text-gray-500 mt-1">Dynamic Variables & Handlebars</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {contacts.length}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Contacts</p>
                    <p className="text-xs text-gray-500 mt-1">Ready for Campaign Targeting</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Providers Tab */}
          <TabsContent value="providers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Email Providers</h2>
              <CreateProviderDialog />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
              {providers.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No email providers configured</p>
                  <p className="text-sm text-gray-400 mb-4">Add your first provider to start sending emails</p>
                  <CreateProviderDialog />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Email Templates</h2>
              <CreateTemplateDialog />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
              {templates.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No email templates created</p>
                  <p className="text-sm text-gray-400 mb-4">Create your first template to design professional emails</p>
                  <CreateTemplateDialog />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Email Campaigns</h2>
              <CreateCampaignDialog 
                providers={providers} 
                templates={templates} 
                contacts={contacts}
              />
            </div>
            
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
              {campaigns.length === 0 && (
                <div className="text-center py-12">
                  <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No email campaigns created</p>
                  <p className="text-sm text-gray-400 mb-4">Create your first campaign to reach your contacts</p>
                  <CreateCampaignDialog 
                    providers={providers} 
                    templates={templates} 
                    contacts={contacts}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Email Analytics</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card data-testid="analytics-sent">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Sent</p>
                      <p className="text-2xl font-bold">{emailStats?.totalEmailsSent.toLocaleString() || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card data-testid="analytics-opens">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Opens</p>
                      <p className="text-2xl font-bold">
                        {campaigns.reduce((sum, c) => sum + c.openCount, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card data-testid="analytics-clicks">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <MousePointer className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</p>
                      <p className="text-2xl font-bold">
                        {campaigns.reduce((sum, c) => sum + c.clickCount, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card data-testid="analytics-unsubscribes">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <UserMinus className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Unsubscribes</p>
                      <p className="text-2xl font-bold">
                        {campaigns.reduce((sum, c) => sum + c.unsubscribeCount, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaign Performance */}
            <Card data-testid="campaign-performance">
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.filter(c => c.sentCount > 0).map((campaign) => {
                    const openRate = campaign.sentCount > 0 ? (campaign.openCount / campaign.sentCount * 100) : 0;
                    const clickRate = campaign.sentCount > 0 ? (campaign.clickCount / campaign.sentCount * 100) : 0;
                    
                    return (
                      <div key={campaign.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{campaign.name}</h4>
                          <Badge variant="outline">{campaign.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Sent</p>
                            <p className="font-bold">{campaign.sentCount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Open Rate</p>
                            <p className="font-bold text-green-600">{openRate.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Click Rate</p>
                            <p className="font-bold text-blue-600">{clickRate.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Bounces</p>
                            <p className="font-bold text-red-600">{campaign.bounceCount}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {campaigns.filter(c => c.sentCount > 0).length === 0 && (
                    <p className="text-gray-500 text-center py-8">No campaign data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Provider Card Component
function ProviderCard({ provider }: { provider: EmailProvider }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const testProviderMutation = useMutation({
    mutationFn: async (testEmail: string) => 
      apiRequest(`/api/email/providers/${provider.id}/test`, {
        method: 'POST',
        body: { testEmail }
      }),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "✅ Test Successful",
          description: "Email provider is working correctly!",
        });
      } else {
        toast({
          title: "❌ Test Failed",
          description: data.error || "Provider test failed",
          variant: "destructive",
        });
      }
    },
  });

  const [testEmail, setTestEmail] = useState('');

  return (
    <Card data-testid={`provider-${provider.id}`} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{provider.name}</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {provider.type} provider
            </p>
          </div>
          <Badge variant={provider.isActive ? "default" : "secondary"}>
            {provider.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Created: {new Date(provider.createdAt).toLocaleDateString()}
        </div>
        
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" data-testid={`test-provider-${provider.id}`}>
                <TestTube className="w-4 h-4 mr-1" />
                Test
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test Email Provider</DialogTitle>
                <DialogDescription>
                  Send a test email to verify the provider configuration
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="test-email">Test Email Address</Label>
                  <Input
                    id="test-email"
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    data-testid="input-test-email"
                  />
                </div>
                <Button 
                  onClick={() => testProviderMutation.mutate(testEmail)}
                  disabled={!testEmail || testProviderMutation.isPending}
                  className="w-full"
                  data-testid="button-send-test"
                >
                  {testProviderMutation.isPending ? 'Sending...' : 'Send Test Email'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Template Card Component
function TemplateCard({ template }: { template: EmailTemplate }) {
  return (
    <Card data-testid={`template-${template.id}`} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {template.category}
            </p>
          </div>
          <Badge variant={template.isActive ? "default" : "secondary"}>
            {template.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm">
          <p className="font-medium">Subject:</p>
          <p className="text-gray-600 dark:text-gray-400">{template.subject}</p>
        </div>
        
        <div className="text-sm">
          <p className="font-medium">Variables:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {template.variables.map((variable) => (
              <Badge key={variable} variant="outline" className="text-xs">
                {variable}
              </Badge>
            ))}
            {template.variables.length === 0 && (
              <span className="text-gray-500">No variables</span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Campaign Card Component
function CampaignCard({ campaign }: { campaign: EmailCampaign }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const startCampaignMutation = useMutation({
    mutationFn: async () => 
      apiRequest(`/api/email/campaigns/${campaign.id}/start`, {
        method: 'POST'
      }),
    onSuccess: () => {
      toast({
        title: "🚀 Campaign Started",
        description: "Your email campaign is now sending!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/email/campaigns'] });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Campaign Start Failed",
        description: error.message || "Failed to start campaign",
        variant: "destructive",
      });
    },
  });

  const openRate = campaign.sentCount > 0 ? (campaign.openCount / campaign.sentCount * 100) : 0;
  const clickRate = campaign.sentCount > 0 ? (campaign.clickCount / campaign.sentCount * 100) : 0;

  return (
    <Card data-testid={`campaign-${campaign.id}`} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">{campaign.name}</h3>
            {campaign.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">{campaign.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={
                campaign.status === 'sent' ? 'default' :
                campaign.status === 'sending' ? 'secondary' :
                campaign.status === 'draft' ? 'outline' : 'destructive'
              }
            >
              {campaign.status}
            </Badge>
            {campaign.status === 'draft' && (
              <Button 
                size="sm"
                onClick={() => startCampaignMutation.mutate()}
                disabled={startCampaignMutation.isPending}
                data-testid={`start-campaign-${campaign.id}`}
              >
                <PlayCircle className="w-4 h-4 mr-1" />
                {startCampaignMutation.isPending ? 'Starting...' : 'Start'}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Recipients</p>
            <p className="text-lg font-bold">{campaign.totalRecipients}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Sent</p>
            <p className="text-lg font-bold">{campaign.sentCount}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Open Rate</p>
            <p className="text-lg font-bold text-green-600">{openRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Click Rate</p>
            <p className="text-lg font-bold text-blue-600">{clickRate.toFixed(1)}%</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-1" />
              Analytics
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Create Provider Dialog Component
function CreateProviderDialog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'smtp' as 'smtp' | 'oauth' | 'api',
    configuration: {
      smtp: {
        host: '',
        port: 587,
        secure: false,
        auth: {
          user: '',
          pass: ''
        }
      }
    }
  });

  const createProviderMutation = useMutation({
    mutationFn: async (data: any) => 
      apiRequest('/api/email/providers', {
        method: 'POST',
        body: data
      }),
    onSuccess: () => {
      toast({
        title: "✅ Provider Created",
        description: "Email provider configured successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/email/providers'] });
      setOpen(false);
      setFormData({
        name: '',
        type: 'smtp',
        configuration: {
          smtp: {
            host: '',
            port: 587,
            secure: false,
            auth: { user: '', pass: '' }
          }
        }
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Creation Failed",
        description: error.message || "Failed to create provider",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="create-provider-button">
          <Plus className="w-4 h-4 mr-2" />
          Add Provider
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Email Provider</DialogTitle>
          <DialogDescription>
            Configure a new email provider for sending campaigns
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="provider-name">Provider Name</Label>
            <Input
              id="provider-name"
              placeholder="e.g., Gmail SMTP"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              data-testid="input-provider-name"
            />
          </div>

          <div>
            <Label htmlFor="provider-type">Provider Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: 'smtp' | 'oauth' | 'api') => 
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger data-testid="select-provider-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smtp">SMTP</SelectItem>
                <SelectItem value="oauth">OAuth (Gmail/Outlook)</SelectItem>
                <SelectItem value="api">API</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === 'smtp' && (
            <>
              <div>
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input
                  id="smtp-host"
                  placeholder="smtp.gmail.com"
                  value={formData.configuration.smtp.host}
                  onChange={(e) => setFormData({
                    ...formData,
                    configuration: {
                      ...formData.configuration,
                      smtp: { ...formData.configuration.smtp, host: e.target.value }
                    }
                  })}
                  data-testid="input-smtp-host"
                />
              </div>

              <div>
                <Label htmlFor="smtp-user">Email</Label>
                <Input
                  id="smtp-user"
                  type="email"
                  placeholder="your-email@gmail.com"
                  value={formData.configuration.smtp.auth.user}
                  onChange={(e) => setFormData({
                    ...formData,
                    configuration: {
                      ...formData.configuration,
                      smtp: { 
                        ...formData.configuration.smtp, 
                        auth: { ...formData.configuration.smtp.auth, user: e.target.value }
                      }
                    }
                  })}
                  data-testid="input-smtp-user"
                />
              </div>

              <div>
                <Label htmlFor="smtp-pass">Password</Label>
                <Input
                  id="smtp-pass"
                  type="password"
                  placeholder="App Password"
                  value={formData.configuration.smtp.auth.pass}
                  onChange={(e) => setFormData({
                    ...formData,
                    configuration: {
                      ...formData.configuration,
                      smtp: { 
                        ...formData.configuration.smtp, 
                        auth: { ...formData.configuration.smtp.auth, pass: e.target.value }
                      }
                    }
                  })}
                  data-testid="input-smtp-pass"
                />
              </div>
            </>
          )}

          <Button 
            onClick={() => createProviderMutation.mutate(formData)}
            disabled={!formData.name || createProviderMutation.isPending}
            className="w-full"
            data-testid="submit-provider"
          >
            {createProviderMutation.isPending ? 'Creating...' : 'Create Provider'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Create Template Dialog Component
function CreateTemplateDialog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    htmlContent: '',
    textContent: '',
    category: 'general',
    variables: [] as string[]
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (data: any) => 
      apiRequest('/api/email/templates', {
        method: 'POST',
        body: data
      }),
    onSuccess: () => {
      toast({
        title: "✅ Template Created",
        description: "Email template created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/email/templates'] });
      setOpen(false);
      setFormData({
        name: '',
        subject: '',
        htmlContent: '',
        textContent: '',
        category: 'general',
        variables: []
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Creation Failed",
        description: error.message || "Failed to create template",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" data-testid="create-template-button">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Email Template</DialogTitle>
          <DialogDescription>
            Design a new email template with dynamic variables
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="e.g., Welcome Email"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="input-template-name"
              />
            </div>

            <div>
              <Label htmlFor="template-category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger data-testid="select-template-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="transactional">Transactional</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="template-subject">Subject Line</Label>
            <Input
              id="template-subject"
              placeholder="🌳 Welcome to Sacred Baobab™ {{firstName}}"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              data-testid="input-template-subject"
            />
          </div>

          <div>
            <Label htmlFor="template-html">HTML Content</Label>
            <Textarea
              id="template-html"
              placeholder="<h1>Welcome {{firstName}}!</h1><p>Thank you for joining our Sacred Baobab™ ecosystem...</p>"
              value={formData.htmlContent}
              onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
              rows={8}
              data-testid="input-template-html"
            />
          </div>

          <div>
            <Label htmlFor="template-text">Text Content (Optional)</Label>
            <Textarea
              id="template-text"
              placeholder="Welcome {{firstName}}! Thank you for joining our Sacred Baobab ecosystem..."
              value={formData.textContent}
              onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
              rows={4}
              data-testid="input-template-text"
            />
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Available Variables:</strong> firstName, lastName, fullName, email, company, unsubscribeUrl, trackingPixelUrl</p>
            <p>Use Handlebars syntax: <code>{'{{variable}}'}</code></p>
          </div>

          <Button 
            onClick={() => createTemplateMutation.mutate(formData)}
            disabled={!formData.name || !formData.subject || !formData.htmlContent || createTemplateMutation.isPending}
            className="w-full"
            data-testid="submit-template"
          >
            {createTemplateMutation.isPending ? 'Creating...' : 'Create Template'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Create Campaign Dialog Component
function CreateCampaignDialog({ 
  providers, 
  templates, 
  contacts 
}: { 
  providers: EmailProvider[]; 
  templates: EmailTemplate[]; 
  contacts: any[];
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    templateId: '',
    providerId: '',
    scheduleType: 'immediate' as 'immediate' | 'scheduled',
    targetAudience: { contactIds: [] as string[] }
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: any) => 
      apiRequest('/api/email/campaigns', {
        method: 'POST',
        body: data
      }),
    onSuccess: () => {
      toast({
        title: "✅ Campaign Created",
        description: "Email campaign created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/email/campaigns'] });
      setOpen(false);
      setFormData({
        name: '',
        description: '',
        templateId: '',
        providerId: '',
        scheduleType: 'immediate',
        targetAudience: { contactIds: [] }
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Creation Failed",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" data-testid="create-campaign-button">
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Email Campaign</DialogTitle>
          <DialogDescription>
            Set up a new email campaign to reach your contacts
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input
              id="campaign-name"
              placeholder="e.g., Welcome Series"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              data-testid="input-campaign-name"
            />
          </div>

          <div>
            <Label htmlFor="campaign-template">Email Template</Label>
            <Select 
              value={formData.templateId} 
              onValueChange={(value) => setFormData({ ...formData, templateId: value })}
            >
              <SelectTrigger data-testid="select-campaign-template">
                <SelectValue placeholder="Choose template" />
              </SelectTrigger>
              <SelectContent>
                {templates.filter(t => t.isActive).map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="campaign-provider">Email Provider</Label>
            <Select 
              value={formData.providerId} 
              onValueChange={(value) => setFormData({ ...formData, providerId: value })}
            >
              <SelectTrigger data-testid="select-campaign-provider">
                <SelectValue placeholder="Choose provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.filter(p => p.isActive).map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Target Contacts</Label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {contacts.length} contacts available
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setFormData({
                ...formData,
                targetAudience: { contactIds: contacts.map(c => c.id) }
              })}
              data-testid="select-all-contacts"
            >
              <Users className="w-4 h-4 mr-2" />
              Select All Contacts ({contacts.length})
            </Button>
          </div>

          <div>
            <Label htmlFor="campaign-description">Description (Optional)</Label>
            <Textarea
              id="campaign-description"
              placeholder="Campaign description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              data-testid="input-campaign-description"
            />
          </div>

          <Button 
            onClick={() => createCampaignMutation.mutate(formData)}
            disabled={!formData.name || !formData.templateId || !formData.providerId || formData.targetAudience.contactIds.length === 0 || createCampaignMutation.isPending}
            className="w-full"
            data-testid="submit-campaign"
          >
            {createCampaignMutation.isPending ? 'Creating...' : 'Create Campaign'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}