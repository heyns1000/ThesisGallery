import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart,
  Users,
  DollarSign,
  Shield,
  Eye,
  Music,
  FileText,
  Zap,
  Target,
  Globe,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Baby,
  Gift,
  Coins,
  Volume2,
  Video,
  Radio,
  Headphones,
  Award,
  Clock,
  ArrowRight,
  ArrowDown
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function BanimalIntegration() {
  const [selectedDistribution, setSelectedDistribution] = useState<string | null>(null);
  const [activeVaultActions, setActiveVaultActions] = useState<any[]>([]);
  const [sonicGridStatus, setSonicGridStatus] = useState("active");
  const { toast } = useToast();

  const banimalMetrics = {
    totalSales: 156750,
    childrenHelped: 2834,
    activeDonations: 89,
    vaultActions: 12,
    mediaProcessed: 156,
    sonicGridConnections: 8,
    pendingDistributions: 4
  };

  const distributionRules = {
    childCharity: 35,
    developer: 25,
    operations: 20,
    sonicGrid: 10,
    vault: 10
  };

  const recentTransactions = [
    {
      id: 1,
      type: "sale",
      amount: 450,
      product: "Banimal Winter Onesie Set",
      timestamp: "2 minutes ago",
      distribution: {
        charity: 157.50,
        developer: 112.50,
        operations: 90,
        sonicGrid: 45,
        vault: 45
      },
      childBeneficiary: "Cape Town Children's Home",
      status: "distributed"
    },
    {
      id: 2,
      type: "sale", 
      amount: 275,
      product: "Banimal Soft Toy Bundle",
      timestamp: "8 minutes ago",
      distribution: {
        charity: 96.25,
        developer: 68.75,
        operations: 55,
        sonicGrid: 27.50,
        vault: 27.50
      },
      childBeneficiary: "Johannesburg Youth Center",
      status: "processing"
    }
  ];

  const sonicGridConnections = [
    {
      id: 1,
      name: "Affirmative Document Processor",
      type: "Media Processing",
      status: "active",
      documentsProcessed: 48,
      confidenceScore: 97.8,
      lastActivity: "30 seconds ago"
    },
    {
      id: 2,
      name: "Charitable Impact Validator",
      type: "Impact Verification",
      status: "active", 
      validationsCompleted: 156,
      confidenceScore: 99.2,
      lastActivity: "1 minute ago"
    },
    {
      id: 3,
      name: "Audio Distribution Network",
      type: "SonicGrid Core",
      status: "active",
      audioStreams: 12,
      confidenceScore: 95.4,
      lastActivity: "15 seconds ago"
    }
  ];

  const vaultActions = [
    {
      id: 1,
      action: "Charitable Distribution",
      beneficiary: "Soweto Children's Fund",
      amount: 2450,
      visibility: "public",
      status: "completed",
      timestamp: "5 minutes ago",
      impact: "87 children received educational materials"
    },
    {
      id: 2,
      action: "Media Rights Transfer",
      beneficiary: "Community Radio Network",
      amount: 890,
      visibility: "public",
      status: "pending",
      timestamp: "12 minutes ago",
      impact: "Audio content distributed to 5 stations"
    }
  ];

  const handleRedirectToPayment = () => {
    toast({
      title: "Redirecting to Banimal.co.za",
      description: "All payment processing happens through our secure Banimal payment gateway.",
    });
    window.open("https://banimal.co.za/payment", "_blank");
  };

  return (
    <div className="space-y-6" data-testid="banimal-integration-container">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3" data-testid="heading-banimal-integration">
            <Heart className="h-8 w-8 text-rose-500" />
            Banimal Integration Dashboard
          </h2>
          <p className="text-muted-foreground mt-2" data-testid="text-banimal-description">
            Charitable distributions, vault actions, and SonicGrid processing
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 dark:text-green-400" data-testid="badge-status-active">
          <CheckCircle className="h-3 w-3 mr-1" />
          System Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="card-metric-total-sales">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground" data-testid="text-total-sales-label">Total Sales</p>
                <p className="text-2xl font-bold mt-2" data-testid="text-total-sales-value">R {banimalMetrics.totalSales.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </Card>

        <Card data-testid="card-metric-children-helped">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground" data-testid="text-children-helped-label">Children Helped</p>
                <p className="text-2xl font-bold mt-2" data-testid="text-children-helped-value">{banimalMetrics.childrenHelped.toLocaleString()}</p>
              </div>
              <Baby className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card data-testid="card-metric-active-donations">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground" data-testid="text-active-donations-label">Active Donations</p>
                <p className="text-2xl font-bold mt-2" data-testid="text-active-donations-value">{banimalMetrics.activeDonations}</p>
              </div>
              <Gift className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card data-testid="card-metric-vault-actions">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground" data-testid="text-vault-actions-label">Vault Actions</p>
                <p className="text-2xl font-bold mt-2" data-testid="text-vault-actions-value">{banimalMetrics.vaultActions}</p>
              </div>
              <Shield className="h-8 w-8 text-cyan-500" />
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="distributions" className="w-full" data-testid="tabs-banimal">
        <TabsList data-testid="tabs-list-banimal">
          <TabsTrigger value="distributions" data-testid="tab-distributions">
            <Heart className="h-4 w-4 mr-2" />
            Charitable Distributions
          </TabsTrigger>
          <TabsTrigger value="transactions" data-testid="tab-transactions">
            <DollarSign className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="vault" data-testid="tab-vault">
            <Shield className="h-4 w-4 mr-2" />
            Vault Actions
          </TabsTrigger>
          <TabsTrigger value="sonicgrid" data-testid="tab-sonicgrid">
            <Zap className="h-4 w-4 mr-2" />
            SonicGrid
          </TabsTrigger>
        </TabsList>

        <TabsContent value="distributions" className="space-y-4" data-testid="tab-content-distributions">
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4" data-testid="heading-distribution-rules">Distribution Rules</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm" data-testid="text-rule-charity">Children in Need</span>
                    <span className="text-sm font-semibold" data-testid="text-rule-charity-percent">{distributionRules.childCharity}%</span>
                  </div>
                  <Progress value={distributionRules.childCharity} className="h-2" data-testid="progress-rule-charity" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm" data-testid="text-rule-developer">Developer</span>
                    <span className="text-sm font-semibold" data-testid="text-rule-developer-percent">{distributionRules.developer}%</span>
                  </div>
                  <Progress value={distributionRules.developer} className="h-2" data-testid="progress-rule-developer" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm" data-testid="text-rule-operations">Operations</span>
                    <span className="text-sm font-semibold" data-testid="text-rule-operations-percent">{distributionRules.operations}%</span>
                  </div>
                  <Progress value={distributionRules.operations} className="h-2" data-testid="progress-rule-operations" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm" data-testid="text-rule-sonicgrid">SonicGrid</span>
                    <span className="text-sm font-semibold" data-testid="text-rule-sonicgrid-percent">{distributionRules.sonicGrid}%</span>
                  </div>
                  <Progress value={distributionRules.sonicGrid} className="h-2" data-testid="progress-rule-sonicgrid" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm" data-testid="text-rule-vault">Vault Reserves</span>
                    <span className="text-sm font-semibold" data-testid="text-rule-vault-percent">{distributionRules.vault}%</span>
                  </div>
                  <Progress value={distributionRules.vault} className="h-2" data-testid="progress-rule-vault" />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4" data-testid="tab-content-transactions">
          {recentTransactions.map((transaction) => (
            <Card key={transaction.id} data-testid={`card-transaction-${transaction.id}`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold" data-testid={`text-transaction-product-${transaction.id}`}>{transaction.product}</h3>
                    <p className="text-sm text-muted-foreground" data-testid={`text-transaction-time-${transaction.id}`}>{transaction.timestamp}</p>
                  </div>
                  <Badge 
                    variant={transaction.status === "distributed" ? "default" : "secondary"}
                    data-testid={`badge-transaction-status-${transaction.id}`}
                  >
                    {transaction.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground" data-testid={`text-transaction-amount-label-${transaction.id}`}>Total Amount</p>
                    <p className="text-lg font-semibold" data-testid={`text-transaction-amount-${transaction.id}`}>R {transaction.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground" data-testid={`text-transaction-charity-label-${transaction.id}`}>To Charity</p>
                    <p className="text-lg font-semibold text-rose-600" data-testid={`text-transaction-charity-${transaction.id}`}>R {transaction.distribution.charity}</p>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-xs text-muted-foreground" data-testid={`text-transaction-beneficiary-label-${transaction.id}`}>Beneficiary</p>
                    <p className="text-sm font-medium" data-testid={`text-transaction-beneficiary-${transaction.id}`}>{transaction.childBeneficiary}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="vault" className="space-y-4" data-testid="tab-content-vault">
          {vaultActions.map((action) => (
            <Card key={action.id} data-testid={`card-vault-action-${action.id}`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-cyan-500" />
                    <div>
                      <h3 className="font-semibold" data-testid={`text-vault-action-${action.id}`}>{action.action}</h3>
                      <p className="text-sm text-muted-foreground" data-testid={`text-vault-time-${action.id}`}>{action.timestamp}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={action.status === "completed" ? "default" : "secondary"}
                    data-testid={`badge-vault-status-${action.id}`}
                  >
                    {action.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground" data-testid={`text-vault-beneficiary-label-${action.id}`}>Beneficiary</p>
                    <p className="text-sm font-medium" data-testid={`text-vault-beneficiary-${action.id}`}>{action.beneficiary}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground" data-testid={`text-vault-amount-label-${action.id}`}>Amount</p>
                    <p className="text-lg font-semibold" data-testid={`text-vault-amount-${action.id}`}>R {action.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground" data-testid={`text-vault-visibility-label-${action.id}`}>Visibility</p>
                    <Badge variant="outline" data-testid={`badge-vault-visibility-${action.id}`}>
                      <Eye className="h-3 w-3 mr-1" />
                      {action.visibility}
                    </Badge>
                  </div>
                </div>
                {action.impact && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm flex items-center gap-2" data-testid={`text-vault-impact-${action.id}`}>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      {action.impact}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sonicgrid" className="space-y-4" data-testid="tab-content-sonicgrid">
          {sonicGridConnections.map((connection) => (
            <Card key={connection.id} data-testid={`card-sonicgrid-${connection.id}`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-yellow-500" />
                    <div>
                      <h3 className="font-semibold" data-testid={`text-sonicgrid-name-${connection.id}`}>{connection.name}</h3>
                      <p className="text-sm text-muted-foreground" data-testid={`text-sonicgrid-type-${connection.id}`}>{connection.type}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600" data-testid={`badge-sonicgrid-status-${connection.id}`}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {connection.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground" data-testid={`text-sonicgrid-processed-label-${connection.id}`}>Documents Processed</p>
                    <p className="text-lg font-semibold" data-testid={`text-sonicgrid-processed-${connection.id}`}>{connection.documentsProcessed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground" data-testid={`text-sonicgrid-confidence-label-${connection.id}`}>Confidence Score</p>
                    <p className="text-lg font-semibold text-green-600" data-testid={`text-sonicgrid-confidence-${connection.id}`}>{connection.confidenceScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground" data-testid={`text-sonicgrid-activity-label-${connection.id}`}>Last Activity</p>
                    <p className="text-sm font-medium" data-testid={`text-sonicgrid-activity-${connection.id}`}>{connection.lastActivity}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20" data-testid="card-payment-redirect">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2" data-testid="heading-payment-redirect">
                <Heart className="h-5 w-5 text-rose-500" />
                Make a Purchase - Support Children in Need
              </h3>
              <p className="text-sm text-muted-foreground mt-2" data-testid="text-payment-description">
                All payments processed securely through banimal.co.za
              </p>
            </div>
            <Button 
              onClick={handleRedirectToPayment}
              className="bg-rose-600 hover:bg-rose-700"
              data-testid="button-redirect-payment"
            >
              Go to Payment Portal
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
