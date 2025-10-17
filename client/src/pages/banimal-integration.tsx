import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Heart, Shield, Zap, Eye, Download, ExternalLink } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
  const [amount, setAmount] = useState("49.99");
  const [childBeneficiary, setChildBeneficiary] = useState("Children's Hospital Trust");

  const { data: transactions = [] } = useQuery<BanimalTransaction[]>({
    queryKey: ["/api/banimal-transactions"]
  });

  const { data: distributions = [] } = useQuery<CharitableDistribution[]>({
    queryKey: ["/api/charitable-distributions"]
  });

  const { data: vaultActions = [] } = useQuery<VaultAction[]>({
    queryKey: ["/api/vault-actions"]
  });

  const { data: sonicGridConnections = [] } = useQuery<SonicGridConnection[]>({
    queryKey: ["/api/sonic-grid-connections"]
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/banimal-transactions", data);
    },
    onSuccess: () => {
      toast({
        title: "Payment Processed!",
        description: "Your purchase has been completed and charitable distributions are active.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/banimal-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/charitable-distributions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/vault-actions"] });
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handlePurchase = () => {
    window.open("https://banimal.co.za/payment", "_blank");
    toast({
      title: "Redirecting to Payment Portal",
      description: "All payment processing happens through banimal.co.za",
    });
  };

  return (
    <div className="p-8 space-y-6" data-testid="banimal-integration-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3" data-testid="heading-page-title">
            <Heart className="h-10 w-10 text-rose-500" />
            Banimal Integration
          </h1>
          <p className="text-muted-foreground mt-2" data-testid="text-page-description">
            Complete Banimal integration dashboard with charitable distributions and vault actions
          </p>
        </div>
        <Badge variant="outline" className="text-green-600" data-testid="badge-integration-status">
          <Shield className="h-4 w-4 mr-2" />
          Integration Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="card-metric-transactions">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium" data-testid="text-transactions-label">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-transactions-value">{transactions.length}</div>
            <p className="text-xs text-muted-foreground" data-testid="text-transactions-subtitle">Active purchases</p>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-distributions">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium" data-testid="text-distributions-label">Distributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-distributions-value">{distributions.length}</div>
            <p className="text-xs text-muted-foreground" data-testid="text-distributions-subtitle">To charities</p>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-vault-actions">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium" data-testid="text-vault-label">Vault Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-vault-value">{vaultActions.length}</div>
            <p className="text-xs text-muted-foreground" data-testid="text-vault-subtitle">Secure actions</p>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-sonicgrid">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium" data-testid="text-sonicgrid-label">SonicGrid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-sonicgrid-value">{sonicGridConnections.length}</div>
            <p className="text-xs text-muted-foreground" data-testid="text-sonicgrid-subtitle">Active connections</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full" data-testid="tabs-main">
        <TabsList data-testid="tabs-list-main">
          <TabsTrigger value="transactions" data-testid="tab-transactions">
            <Heart className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="distributions" data-testid="tab-distributions">
            <Zap className="h-4 w-4 mr-2" />
            Distributions
          </TabsTrigger>
          <TabsTrigger value="vault" data-testid="tab-vault">
            <Shield className="h-4 w-4 mr-2" />
            Vault Actions
          </TabsTrigger>
          <TabsTrigger value="sonicgrid" data-testid="tab-sonicgrid">
            <Eye className="h-4 w-4 mr-2" />
            SonicGrid
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4" data-testid="tab-content-transactions">
          {transactions.length === 0 ? (
            <Card data-testid="card-no-transactions">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground" data-testid="text-no-transactions">No transactions yet</p>
              </CardContent>
            </Card>
          ) : (
            transactions.map((transaction) => (
              <Card key={transaction.id} data-testid={`card-transaction-${transaction.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle data-testid={`text-transaction-product-${transaction.id}`}>{transaction.productName}</CardTitle>
                    <Badge data-testid={`badge-transaction-status-${transaction.id}`}>{transaction.status}</Badge>
                  </div>
                  <CardDescription data-testid={`text-transaction-id-${transaction.id}`}>ID: {transaction.transactionId}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-amount-label-${transaction.id}`}>Amount</p>
                      <p className="text-lg font-semibold" data-testid={`text-amount-${transaction.id}`}>{transaction.amount} {transaction.currency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-beneficiary-label-${transaction.id}`}>Beneficiary</p>
                      <p className="font-medium" data-testid={`text-beneficiary-${transaction.id}`}>{transaction.childBeneficiary}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-date-label-${transaction.id}`}>Date</p>
                      <p className="font-medium" data-testid={`text-date-${transaction.id}`}>{new Date(transaction.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="distributions" className="space-y-4" data-testid="tab-content-distributions">
          {distributions.length === 0 ? (
            <Card data-testid="card-no-distributions">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground" data-testid="text-no-distributions">No distributions yet</p>
              </CardContent>
            </Card>
          ) : (
            distributions.map((distribution) => (
              <Card key={distribution.id} data-testid={`card-distribution-${distribution.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle data-testid={`text-distribution-beneficiary-${distribution.id}`}>{distribution.beneficiaryName}</CardTitle>
                    <Badge data-testid={`badge-distribution-status-${distribution.id}`}>{distribution.status}</Badge>
                  </div>
                  <CardDescription data-testid={`text-distribution-type-${distribution.id}`}>{distribution.beneficiaryType}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-dist-amount-label-${distribution.id}`}>Amount</p>
                      <p className="text-lg font-semibold" data-testid={`text-dist-amount-${distribution.id}`}>{distribution.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-dist-percentage-label-${distribution.id}`}>Percentage</p>
                      <p className="font-medium" data-testid={`text-dist-percentage-${distribution.id}`}>{distribution.percentage}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-dist-date-label-${distribution.id}`}>Date</p>
                      <p className="font-medium" data-testid={`text-dist-date-${distribution.id}`}>{new Date(distribution.distributionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="vault" className="space-y-4" data-testid="tab-content-vault">
          {vaultActions.length === 0 ? (
            <Card data-testid="card-no-vault-actions">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground" data-testid="text-no-vault-actions">No vault actions yet</p>
              </CardContent>
            </Card>
          ) : (
            vaultActions.map((action) => (
              <Card key={action.id} data-testid={`card-vault-${action.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle data-testid={`text-vault-type-${action.id}`}>{action.actionType}</CardTitle>
                    <Badge data-testid={`badge-vault-status-${action.id}`}>{action.status}</Badge>
                  </div>
                  <CardDescription data-testid={`text-vault-id-${action.id}`}>Action ID: {action.actionId}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-vault-beneficiary-label-${action.id}`}>Beneficiary</p>
                      <p className="font-medium" data-testid={`text-vault-beneficiary-${action.id}`}>{action.beneficiary}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-vault-amount-label-${action.id}`}>Amount</p>
                      <p className="text-lg font-semibold" data-testid={`text-vault-amount-${action.id}`}>{action.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-vault-visibility-label-${action.id}`}>Visibility</p>
                      <Badge variant="outline" data-testid={`badge-vault-visibility-${action.id}`}>{action.visibility}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sonicgrid" className="space-y-4" data-testid="tab-content-sonicgrid">
          {sonicGridConnections.length === 0 ? (
            <Card data-testid="card-no-sonicgrid">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground" data-testid="text-no-sonicgrid">No SonicGrid connections yet</p>
              </CardContent>
            </Card>
          ) : (
            sonicGridConnections.map((connection) => (
              <Card key={connection.id} data-testid={`card-sonic-${connection.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle data-testid={`text-sonic-name-${connection.id}`}>{connection.connectionName}</CardTitle>
                    <Badge data-testid={`badge-sonic-status-${connection.id}`}>{connection.status}</Badge>
                  </div>
                  <CardDescription data-testid={`text-sonic-type-${connection.id}`}>{connection.connectionType}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-sonic-processed-label-${connection.id}`}>Documents Processed</p>
                      <p className="text-lg font-semibold" data-testid={`text-sonic-processed-${connection.id}`}>{connection.documentsProcessed}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-sonic-activity-label-${connection.id}`}>Last Activity</p>
                      <p className="font-medium" data-testid={`text-sonic-activity-${connection.id}`}>{connection.lastActivity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20" data-testid="card-payment-cta">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" data-testid="heading-payment-cta">
            <Heart className="h-6 w-6 text-rose-500" />
            Make a Purchase - Support Children in Need
          </CardTitle>
          <CardDescription data-testid="text-payment-cta-description">
            All payments are securely processed through banimal.co.za
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            size="lg"
            className="bg-rose-600 hover:bg-rose-700"
            onClick={handlePurchase}
            data-testid="button-make-purchase"
          >
            Go to Payment Portal
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
