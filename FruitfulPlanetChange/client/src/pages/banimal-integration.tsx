import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Heart, Shield, Zap, Eye, Download, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface BanimalTransaction {
  id: number;
  transactionId: string;
  productName: string;
  amount: string;
  currency: string;
  userId: string;
  childBeneficiary: string;
  distributionRules: Record<string, number>;
  status: string;
  createdAt: string;
}

interface CharitableDistribution {
  id: number;
  transactionId: string;
  beneficiaryType: string;
  beneficiaryName: string;
  amount: string;
  percentage: number;
  distributionDate: string;
  status: string;
}

interface VaultAction {
  id: number;
  actionId: string;
  actionType: string;
  beneficiary: string;
  transactionId: string;
  amount: string;
  status: string;
  visibility: string;
  executedAt: string;
  metadata: Record<string, any>;
}

interface SonicGridConnection {
  id: number;
  connectionName: string;
  connectionType: string;
  status: string;
  documentsProcessed: number;
  lastActivity: string;
  configuration: Record<string, any>;
}

export default function BanimalIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("49.99");
  const [childBeneficiary, setChildBeneficiary] = useState("Children's Hospital Trust");

  const { data: transactions = [] } = useQuery<BanimalTransaction[]>({
    queryKey: ["/api/banimal/transactions"]
  });

  const { data: distributions = [] } = useQuery<CharitableDistribution[]>({
    queryKey: ["/api/banimal/distributions"]
  });

  const { data: vaultActions = [] } = useQuery<VaultAction[]>({
    queryKey: ["/api/banimal/vault-actions"]
  });

  const { data: sonicGridConnections = [] } = useQuery<SonicGridConnection[]>({
    queryKey: ["/api/banimal/sonicgrid"]
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/banimal/transactions", data);
    },
    onSuccess: () => {
      toast({
        title: "Payment Processed!",
        description: "Your purchase has been completed and charitable distributions are active.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/banimal/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/banimal/distributions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/banimal/vault-actions"] });
    },
    onError: (error) => {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handlePurchase = () => {
    createTransactionMutation.mutate({
      transactionId: `BAN-${Date.now()}`,
      productName: "Banimal Soft Toy - Premium Collection",
      amount,
      currency: "USD",
      userId: "current-user",
      childBeneficiary,
      distributionRules: {
        charity: 35,
        developer: 25,
        operations: 20,
        sonicGrid: 10,
        vault: 10
      },
      status: "completed"
    });
  };

  const totalDonated = distributions
    .filter(d => d.beneficiaryType === "charity")
    .reduce((sum, d) => sum + parseFloat(d.amount), 0);

  const totalTransactions = transactions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Heart className="h-6 w-6 text-red-500" />
            <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Banimal Charitable Giving
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Every Purchase Changes Lives
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Complete transparency in charitable distribution. Every payment immediately helps children in need with full vault action visibility.
          </p>
        </motion.div>

        {/* Impact Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalDonated.toFixed(2)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">Total Donated</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalTransactions}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">Transactions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {vaultActions.length}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">Vault Actions</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Purchase Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <Heart className="h-6 w-6 text-red-500" />
                <span>Make a Purchase & Give Back</span>
              </CardTitle>
              <CardDescription>
                35% of every purchase goes directly to children in need. Full transparency guaranteed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Purchase Amount ($)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Child Beneficiary Organization
                    </label>
                    <Input
                      value={childBeneficiary}
                      onChange={(e) => setChildBeneficiary(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Distribution Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Charity (35%)</span>
                      <Badge variant="secondary">${(parseFloat(amount) * 0.35).toFixed(2)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Developer (25%)</span>
                      <Badge variant="secondary">${(parseFloat(amount) * 0.25).toFixed(2)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Operations (20%)</span>
                      <Badge variant="secondary">${(parseFloat(amount) * 0.20).toFixed(2)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">SonicGrid (10%)</span>
                      <Badge variant="secondary">${(parseFloat(amount) * 0.10).toFixed(2)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Vault (10%)</span>
                      <Badge variant="secondary">${(parseFloat(amount) * 0.10).toFixed(2)}</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handlePurchase}
                disabled={createTransactionMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                size="lg"
              >
                {createTransactionMutation.isPending ? "Processing..." : "Complete Purchase & Donate"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dashboard Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="distributions">Distributions</TabsTrigger>
              <TabsTrigger value="vault-actions">Vault Actions</TabsTrigger>
              <TabsTrigger value="sonicgrid">SonicGrid</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>All Banimal purchases with charitable distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{transaction.productName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {transaction.transactionId} • {transaction.childBeneficiary}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900 dark:text-white">
                            ${parseFloat(transaction.amount).toFixed(2)}
                          </p>
                          <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {transactions.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No transactions yet. Make your first purchase above!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distributions">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Charitable Distributions</CardTitle>
                  <CardDescription>Real-time breakdown of how funds are distributed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {distributions.map((distribution) => (
                      <div key={distribution.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{distribution.beneficiaryName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {distribution.beneficiaryType} • {distribution.percentage}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900 dark:text-white">
                            ${parseFloat(distribution.amount).toFixed(2)}
                          </p>
                          <Badge variant={distribution.status === "completed" ? "default" : "secondary"}>
                            {distribution.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {distributions.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No distributions yet. Complete a purchase to see distributions here!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vault-actions">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Vault Action Transparency</span>
                  </CardTitle>
                  <CardDescription>Complete visibility into all charitable distributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vaultActions.map((action) => (
                      <div key={action.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{action.actionType}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {action.beneficiary} • {action.actionId}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900 dark:text-white">
                            ${parseFloat(action.amount).toFixed(2)}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge variant={action.visibility === "transparent" ? "default" : "secondary"}>
                              {action.visibility}
                            </Badge>
                            <Badge variant={action.status === "completed" ? "default" : "secondary"}>
                              {action.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    {vaultActions.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No vault actions recorded yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sonicgrid">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>SonicGrid Media Integration</CardTitle>
                  <CardDescription>Affirmative document processing for media sector integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sonicGridConnections.map((connection) => (
                      <div key={connection.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{connection.connectionName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {connection.connectionType} • {connection.documentsProcessed} documents processed
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={connection.status === "active" ? "default" : "secondary"}>
                            {connection.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {sonicGridConnections.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No SonicGrid connections active.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Visit our main site for more information about Banimal's charitable mission
              </p>
              <Button variant="outline" className="space-x-2">
                <ExternalLink className="h-4 w-4" />
                <span>Visit banimal.co.za</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}