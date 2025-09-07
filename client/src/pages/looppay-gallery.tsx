import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CreditCard, TrendingUp, Users, Zap, MessageCircle, DollarSign, Globe, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface LoopPayLicense {
  id: string;
  licenseType: string;
  licenseName: string;
  priceUsd: string;
  billingCycle: string;
  features: string[];
  maxPayouts: number | null;
  maxVendors: number | null;
  analyticsAccess: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
  active: boolean;
  createdAt: string;
}

interface LoopPayTransaction {
  id: string;
  transactionId: string;
  payoutMeshId: string;
  vendorId: string;
  amountUsd: string;
  currency: string;
  status: string;
  payoutCycle: number;
  divLockCompliance: boolean;
  claimRootHash: string;
  createdAt: string;
  completedAt: string | null;
}

interface LoopPayVendor {
  id: string;
  vendorCode: string;
  companyName: string;
  contactEmail: string;
  paymentMethod: string;
  preferredCurrency: string;
  region: string;
  complianceStatus: string;
  totalPayouts: string;
  active: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalLicenses: number;
  activeVendors: number;
  todaysTransactions: number;
  totalVolumeUsd: string;
  activeMeshes: number;
  avgPayoutTime: string;
}

export default function LoopPayGallery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [aiQuery, setAiQuery] = useState("");
  const [aiSessionId] = useState(() => `session-${Date.now()}`);
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("EUR");
  const [currencyAmount, setCurrencyAmount] = useState("100");

  // Fetch dashboard stats
  const { data: dashboardStats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/looppay/dashboard/stats"],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch licenses
  const { data: licenses = [], isLoading: licensesLoading } = useQuery<LoopPayLicense[]>({
    queryKey: ["/api/looppay/licenses"]
  });

  // Fetch transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<LoopPayTransaction[]>({
    queryKey: ["/api/looppay/transactions"]
  });

  // Fetch vendors
  const { data: vendors = [], isLoading: vendorsLoading } = useQuery<LoopPayVendor[]>({
    queryKey: ["/api/looppay/vendors"]
  });

  // Fetch supported currencies
  const { data: currenciesData } = useQuery<{ currencies: string[] }>({
    queryKey: ["/api/looppay/currencies"]
  });

  // AI Assistant query mutation
  const aiAssistantMutation = useMutation({
    mutationFn: (data: { sessionId: string; query: string; queryType?: string }) =>
      apiRequest("POST", "/api/looppay/ai-assistant", data),
    onSuccess: () => {
      setAiQuery("");
      toast({
        title: "LoopPay™ AI Assistant",
        description: "Query processed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process AI query",
        variant: "destructive",
      });
    }
  });

  // Currency conversion mutation
  const currencyConversionMutation = useMutation({
    mutationFn: (data: { amount: string; fromCurrency: string; toCurrency: string }) =>
      apiRequest("POST", "/api/looppay/currency/convert", data),
    onSuccess: (result) => {
      toast({
        title: "Currency Converted",
        description: `${result.originalAmount} ${result.originalCurrency} = ${result.convertedAmount} ${result.targetCurrency}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to convert currency",
        variant: "destructive",
      });
    }
  });

  // System initialization mutation
  const initializeMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/looppay/initialize", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/looppay"] });
      toast({
        title: "LoopPay™ Initialized",
        description: "Sovereign payment system initialized successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to initialize LoopPay system",
        variant: "destructive",
      });
    }
  });

  const handleAiQuery = () => {
    if (aiQuery.trim()) {
      aiAssistantMutation.mutate({
        sessionId: aiSessionId,
        query: aiQuery.trim(),
        queryType: "general"
      });
    }
  };

  const handleCurrencyConversion = () => {
    if (currencyAmount && currencyFrom && currencyTo) {
      currencyConversionMutation.mutate({
        amount: currencyAmount,
        fromCurrency: currencyFrom,
        toCurrency: currencyTo
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "processing": return "bg-blue-500";
      case "pending": return "bg-yellow-500";
      case "failed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getLicenseTypeColor = (type: string) => {
    switch (type) {
      case "core": return "bg-purple-500";
      case "pro-grid": return "bg-blue-500";
      case "starter-node": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            LoopPay™ Sovereign Payment Gallery
          </h1>
          <p className="text-slate-300 text-lg">
            9-second payout cycles • ClaimRoot™ immutable contracts • DivLock™ compliance
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="outline" className="text-purple-300 border-purple-300">
              <Zap className="w-3 h-3 mr-1" />
              PulseTrade™ Enabled
            </Badge>
            <Badge variant="outline" className="text-green-300 border-green-300">
              <Shield className="w-3 h-3 mr-1" />
              Sovereign Legal Scrolls
            </Badge>
            <Badge variant="outline" className="text-blue-300 border-blue-300">
              <Globe className="w-3 h-3 mr-1" />
              Global Mesh Active
            </Badge>
          </div>
        </div>

        {/* Dashboard Stats Cards */}
        {!statsLoading && dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <div className="text-xs text-slate-400">Licenses</div>
                </div>
                <div className="text-2xl font-bold text-white">{dashboardStats.totalLicenses}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <div className="text-xs text-slate-400">Active Vendors</div>
                </div>
                <div className="text-2xl font-bold text-white">{dashboardStats.activeVendors}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <div className="text-xs text-slate-400">Today's TXNs</div>
                </div>
                <div className="text-2xl font-bold text-white">{dashboardStats.todaysTransactions}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-yellow-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                  <div className="text-xs text-slate-400">Total Volume</div>
                </div>
                <div className="text-xl font-bold text-white">${parseFloat(dashboardStats.totalVolumeUsd).toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-pink-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-pink-400" />
                  <div className="text-xs text-slate-400">Active Meshes</div>
                </div>
                <div className="text-2xl font-bold text-white">{dashboardStats.activeMeshes}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-orange-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                  <div className="text-xs text-slate-400">Avg Payout</div>
                </div>
                <div className="text-lg font-bold text-white">{dashboardStats.avgPayoutTime}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Initialize System Button */}
        <div className="flex justify-center mb-6">
          <Button 
            onClick={() => initializeMutation.mutate()}
            disabled={initializeMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700"
            data-testid="button-initialize-system"
          >
            {initializeMutation.isPending ? "Initializing..." : "Initialize LoopPay™ System"}
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="dashboard" data-testid="tab-dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="licenses" data-testid="tab-licenses">Licenses</TabsTrigger>
            <TabsTrigger value="transactions" data-testid="tab-transactions">Transactions</TabsTrigger>
            <TabsTrigger value="vendors" data-testid="tab-vendors">Vendors</TabsTrigger>
            <TabsTrigger value="tools" data-testid="tab-tools">Tools</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{transaction.transactionId}</div>
                          <div className="text-slate-400 text-sm">${transaction.amountUsd} {transaction.currency}</div>
                        </div>
                        <Badge className={`${getStatusColor(transaction.status)} text-white`}>
                          {transaction.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Vendors */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Top Vendors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {vendors.slice(0, 5).map((vendor) => (
                      <div key={vendor.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{vendor.companyName}</div>
                          <div className="text-slate-400 text-sm">{vendor.vendorCode}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-medium">${parseFloat(vendor.totalPayouts).toLocaleString()}</div>
                          <div className="text-slate-400 text-sm">{vendor.region}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Licenses Tab */}
          <TabsContent value="licenses" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  LoopPay™ License Tiers
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Sovereign payment licenses with ClaimRoot™ protection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {licenses.map((license) => (
                    <Card key={license.id} className="bg-slate-700/50 border-slate-600">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg">{license.licenseName}</CardTitle>
                          <Badge className={`${getLicenseTypeColor(license.licenseType)} text-white`}>
                            {license.licenseType}
                          </Badge>
                        </div>
                        <div className="text-2xl font-bold text-green-400">
                          ${parseFloat(license.priceUsd).toLocaleString()}
                          <span className="text-sm text-slate-400 ml-1">
                            {license.billingCycle === "one-time" ? "one-time" : `/${license.billingCycle}`}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {license.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-slate-300">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-slate-400">Max Payouts</div>
                            <div className="text-white">{license.maxPayouts || "Unlimited"}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Max Vendors</div>
                            <div className="text-white">{license.maxVendors || "Unlimited"}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">API Access</div>
                            <div className="text-white">{license.apiAccess ? "Yes" : "No"}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Analytics</div>
                            <div className="text-white">{license.analyticsAccess ? "Yes" : "No"}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Transaction History
                </CardTitle>
                <CardDescription className="text-slate-400">
                  PulseTrade™ mesh transactions with 9-second cycles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <Card key={transaction.id} className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge className={`${getStatusColor(transaction.status)} text-white`}>
                              {transaction.status}
                            </Badge>
                            <div className="text-white font-mono text-sm">{transaction.transactionId}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-400">
                              ${parseFloat(transaction.amountUsd).toLocaleString()}
                            </div>
                            <div className="text-slate-400 text-sm">{transaction.currency}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-slate-400">Payout Cycle</div>
                            <div className="text-white">{transaction.payoutCycle}s</div>
                          </div>
                          <div>
                            <div className="text-slate-400">DivLock™</div>
                            <div className="text-white">{transaction.divLockCompliance ? "✓ Compliant" : "⚠ Pending"}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">ClaimRoot™</div>
                            <div className="text-white font-mono text-xs">{transaction.claimRootHash?.substring(0, 12)}...</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Created</div>
                            <div className="text-white">{new Date(transaction.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Vendor Management
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Global vendor network with sovereign compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {vendors.map((vendor) => (
                    <Card key={vendor.id} className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-white font-medium text-lg">{vendor.companyName}</div>
                            <div className="text-slate-400 text-sm">{vendor.vendorCode}</div>
                          </div>
                          <Badge 
                            className={`${vendor.complianceStatus === "verified" ? "bg-green-500" : "bg-yellow-500"} text-white`}
                          >
                            {vendor.complianceStatus}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Email:</span>
                            <span className="text-white">{vendor.contactEmail}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Payment Method:</span>
                            <span className="text-white">{vendor.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Currency:</span>
                            <span className="text-white">{vendor.preferredCurrency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Region:</span>
                            <span className="text-white">{vendor.region}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Payouts:</span>
                            <span className="text-green-400 font-medium">${parseFloat(vendor.totalPayouts).toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Currency Converter */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    Global Currency Converter
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Real-time exchange rates for international payouts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="amount" className="text-slate-300">Amount</Label>
                      <Input
                        id="amount"
                        value={currencyAmount}
                        onChange={(e) => setCurrencyAmount(e.target.value)}
                        placeholder="100"
                        className="bg-slate-700 border-slate-600 text-white"
                        data-testid="input-currency-amount"
                      />
                    </div>
                    <div>
                      <Label htmlFor="from-currency" className="text-slate-300">From</Label>
                      <Select value={currencyFrom} onValueChange={setCurrencyFrom}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-currency-from">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currenciesData?.currencies.map((currency) => (
                            <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="to-currency" className="text-slate-300">To</Label>
                      <Select value={currencyTo} onValueChange={setCurrencyTo}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white" data-testid="select-currency-to">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currenciesData?.currencies.map((currency) => (
                            <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button 
                    onClick={handleCurrencyConversion}
                    disabled={currencyConversionMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    data-testid="button-convert-currency"
                  >
                    {currencyConversionMutation.isPending ? "Converting..." : "Convert Currency"}
                  </Button>
                </CardContent>
              </Card>

              {/* AI Assistant */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-400" />
                    LoopPay™ AI Assistant
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Ask about LoopPay functionality, pricing, or security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Ask about LoopPay licenses, payout mesh, or security features..."
                    className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                    data-testid="textarea-ai-query"
                  />
                  <Button 
                    onClick={handleAiQuery}
                    disabled={aiAssistantMutation.isPending || !aiQuery.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    data-testid="button-ask-ai"
                  >
                    {aiAssistantMutation.isPending ? "Processing..." : "Ask LoopPay™ AI"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-700">
          <p className="text-slate-400 text-sm">
            Powered by FAA™ Vault • PulseTrade™ Mesh • ClaimRoot™ Contracts • DivLock™ Compliance
          </p>
        </div>
      </div>
    </div>
  );
}