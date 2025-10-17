import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Eye, EyeOff, Key, Settings, CheckCircle } from "lucide-react";

const settingsFormSchema = z.object({
  cloudflareApiToken: z.string().min(1, "API Token is required"),
  cloudflareAccountId: z.string().min(1, "Account ID is required"),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function AdminSettings() {
  const { toast } = useToast();
  const [showApiToken, setShowApiToken] = useState(false);
  const [showAccountId, setShowAccountId] = useState(false);

  const { data: apiTokenStatus, isLoading: loadingApiToken } = useQuery({
    queryKey: ['/api/settings/status', 'CLOUDFLARE_API_TOKEN'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/settings/CLOUDFLARE_API_TOKEN/status');
        if (!res.ok) throw new Error('Failed to fetch API token status');
        return res.json();
      } catch (error) {
        return { exists: false, configured: false };
      }
    },
  });

  const { data: accountIdStatus, isLoading: loadingAccountId } = useQuery({
    queryKey: ['/api/settings/status', 'CLOUDFLARE_ACCOUNT_ID'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/settings/CLOUDFLARE_ACCOUNT_ID/status');
        if (!res.ok) throw new Error('Failed to fetch account ID status');
        return res.json();
      } catch (error) {
        return { exists: false, configured: false };
      }
    },
  });

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      cloudflareApiToken: "",
      cloudflareAccountId: "",
    },
  });

  const saveApiTokenMutation = useMutation({
    mutationFn: async (value: string) => {
      return apiRequest('/api/settings', {
        method: 'POST',
        body: JSON.stringify({
          key: 'CLOUDFLARE_API_TOKEN',
          value,
          category: 'cloudflare',
          description: 'Cloudflare API Token for HotStack integration',
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings/status', 'CLOUDFLARE_API_TOKEN'] });
      toast({
        title: "Success",
        description: "Cloudflare API Token saved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save API Token",
        variant: "destructive",
      });
    },
  });

  const saveAccountIdMutation = useMutation({
    mutationFn: async (value: string) => {
      return apiRequest('/api/settings', {
        method: 'POST',
        body: JSON.stringify({
          key: 'CLOUDFLARE_ACCOUNT_ID',
          value,
          category: 'cloudflare',
          description: 'Cloudflare Account ID for HotStack integration',
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings/status', 'CLOUDFLARE_ACCOUNT_ID'] });
      toast({
        title: "Success",
        description: "Cloudflare Account ID saved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save Account ID",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      await saveApiTokenMutation.mutateAsync(values.cloudflareApiToken);
      await saveAccountIdMutation.mutateAsync(values.cloudflareAccountId);
      form.reset();
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const isLoading = loadingApiToken || loadingAccountId;
  const isSaving = saveApiTokenMutation.isPending || saveAccountIdMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Settings className="w-10 h-10 text-yellow-400" />
            Admin Settings
          </h1>
          <p className="text-gray-400">Configure Cloudflare HotStack Integration</p>
        </div>

        {/* Current Settings Card */}
        <Card className="bg-gray-800/50 border-gray-700" data-testid="card-current-settings">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-yellow-400" />
              Current Configuration Status
            </CardTitle>
            <CardDescription className="text-gray-400">
              View your current Cloudflare settings status (values are never displayed for security)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="text-gray-400 animate-pulse">Loading settings status...</div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div>
                    <div className="text-sm font-medium text-gray-300">Cloudflare API Token</div>
                    <div className="text-xs text-gray-500 mt-1" data-testid="text-current-api-token">
                      {apiTokenStatus?.configured ? "Configured (value hidden)" : "Not configured"}
                    </div>
                  </div>
                  <Badge className={apiTokenStatus?.configured ? "bg-green-500" : "bg-red-500"}>
                    {apiTokenStatus?.configured ? "Configured" : "Not Set"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div>
                    <div className="text-sm font-medium text-gray-300">Cloudflare Account ID</div>
                    <div className="text-xs text-gray-500 mt-1" data-testid="text-current-account-id">
                      {accountIdStatus?.configured ? "Configured (value hidden)" : "Not configured"}
                    </div>
                  </div>
                  <Badge className={accountIdStatus?.configured ? "bg-green-500" : "bg-red-500"}>
                    {accountIdStatus?.configured ? "Configured" : "Not Set"}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Settings Form */}
        <Card className="bg-gray-800/50 border-gray-700" data-testid="card-update-settings">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Update Settings
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter new values to update your Cloudflare configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="cloudflareApiToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Cloudflare API Token</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showApiToken ? "text" : "password"}
                            placeholder="Enter your Cloudflare API Token"
                            className="bg-gray-900/50 border-gray-700 text-white pr-10"
                            data-testid="input-api-token"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiToken(!showApiToken)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                            data-testid="button-toggle-api-token"
                          >
                            {showApiToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        Your Cloudflare API token with Workers and R2 permissions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cloudflareAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Cloudflare Account ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showAccountId ? "text" : "password"}
                            placeholder="Enter your Cloudflare Account ID"
                            className="bg-gray-900/50 border-gray-700 text-white pr-10"
                            data-testid="input-account-id"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAccountId(!showAccountId)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                            data-testid="button-toggle-account-id"
                          >
                            {showAccountId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        Your Cloudflare Account ID (found in Workers & Pages dashboard)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold"
                    disabled={isSaving}
                    data-testid="button-save-settings"
                  >
                    {isSaving ? "Saving..." : "Save Settings"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => form.reset()}
                    data-testid="button-reset-form"
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-indigo-700">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔐</div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-white">Security Notice</h3>
                <p className="text-sm text-gray-300">
                  Settings are stored securely in the database. The Cloudflare service will read from the database first, 
                  then fall back to environment variables if not found.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  To get your Cloudflare credentials:
                </p>
                <ol className="text-sm text-gray-400 list-decimal list-inside space-y-1 mt-1">
                  <li>Log in to your Cloudflare dashboard</li>
                  <li>Go to "Workers & Pages" → "Overview"</li>
                  <li>Your Account ID is displayed on the right sidebar</li>
                  <li>For API Token: Go to "My Profile" → "API Tokens" → "Create Token"</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
