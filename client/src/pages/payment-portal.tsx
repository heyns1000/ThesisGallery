import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Shield, CheckCircle, ArrowLeft, Zap, Heart, Globe, Lock } from "lucide-react"

interface Payment {
  id: number
  transactionId: string
  amount: string
  currency: string
  status: string
  provider: string
  createdAt: string
  metadata: Record<string, any>
}

export default function PaymentPortal() {
  const { toast } = useToast()
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments"]
  })

  const handleRedirectToPayment = () => {
    toast({
      title: "Redirecting to Banimal.co.za",
      description: "All payment processing happens through our secure Banimal payment gateway.",
    })
    window.open("https://banimal.co.za/payment", "_blank")
  }

  const handleViewTransaction = (payment: Payment) => {
    setSelectedPayment(payment)
    toast({
      title: "Transaction Details",
      description: `Viewing details for transaction ${payment.transactionId}`,
    })
  }

  return (
    <div className="p-8 space-y-6" data-testid="payment-portal-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3" data-testid="heading-payment-portal">
            <CreditCard className="h-10 w-10 text-green-500" />
            Payment Portal
          </h1>
          <p className="text-muted-foreground mt-2" data-testid="text-payment-portal-description">
            Secure payment processing powered by banimal.co.za
          </p>
        </div>
        <Badge variant="outline" className="text-green-600" data-testid="badge-secure-gateway">
          <Shield className="h-4 w-4 mr-2" />
          Secure Gateway
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-metric-total-payments">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2" data-testid="heading-total-payments">
              <CreditCard className="h-4 w-4 text-green-500" />
              Total Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-payments">{payments.length}</div>
            <p className="text-xs text-muted-foreground" data-testid="text-total-payments-subtitle">Processed transactions</p>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-total-amount">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2" data-testid="heading-total-amount">
              <Zap className="h-4 w-4 text-yellow-500" />
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-amount">
              R {payments.reduce((sum, p) => sum + parseFloat(p.amount), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground" data-testid="text-total-amount-subtitle">All time revenue</p>
          </CardContent>
        </Card>

        <Card data-testid="card-metric-active-payments">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2" data-testid="heading-active-payments">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-payments">
              {payments.filter(p => p.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground" data-testid="text-active-payments-subtitle">Successful payments</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20" data-testid="card-new-payment">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" data-testid="heading-new-payment">
            <Lock className="h-6 w-6 text-green-500" />
            Secure Payment Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-2" data-testid="heading-banimal-gateway">Banimal Payment Gateway</h3>
              <p className="text-sm text-muted-foreground mb-4" data-testid="text-banimal-gateway-description">
                All payment processing is handled securely through banimal.co.za. Your payment information is encrypted 
                and protected with industry-standard security protocols.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" data-testid="badge-feature-encrypted">
                  <Shield className="h-3 w-3 mr-1" />
                  256-bit SSL Encrypted
                </Badge>
                <Badge variant="outline" data-testid="badge-feature-pci">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  PCI DSS Compliant
                </Badge>
                <Badge variant="outline" data-testid="badge-feature-global">
                  <Globe className="h-3 w-3 mr-1" />
                  Global Payment Support
                </Badge>
              </div>
            </div>
          </div>
          <Button 
            size="lg"
            className="bg-green-600 hover:bg-green-700"
            onClick={handleRedirectToPayment}
            data-testid="button-make-payment"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Go to Secure Payment Gateway
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4" data-testid="heading-payment-history">Payment History</h2>
        {isLoading ? (
          <Card data-testid="card-loading">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground" data-testid="text-loading">Loading payment history...</p>
            </CardContent>
          </Card>
        ) : payments.length === 0 ? (
          <Card data-testid="card-no-payments">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground" data-testid="text-no-payments">No payment history available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <Card 
                key={payment.id} 
                className={`cursor-pointer transition-all ${selectedPayment?.id === payment.id ? 'border-2 border-green-500' : ''}`}
                onClick={() => handleViewTransaction(payment)}
                data-testid={`card-payment-${payment.id}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg" data-testid={`text-payment-id-${payment.id}`}>
                        Transaction {payment.transactionId}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground" data-testid={`text-payment-date-${payment.id}`}>
                        {new Date(payment.createdAt).toLocaleDateString()} at {new Date(payment.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge 
                      variant={payment.status === 'completed' ? 'default' : 'secondary'}
                      data-testid={`badge-payment-status-${payment.id}`}
                    >
                      {payment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-amount-label-${payment.id}`}>Amount</p>
                      <p className="text-lg font-semibold" data-testid={`text-amount-${payment.id}`}>
                        {payment.amount} {payment.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-provider-label-${payment.id}`}>Provider</p>
                      <p className="font-medium" data-testid={`text-provider-${payment.id}`}>{payment.provider}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground" data-testid={`text-method-label-${payment.id}`}>Method</p>
                      <Badge variant="outline" data-testid={`badge-method-${payment.id}`}>
                        <CreditCard className="h-3 w-3 mr-1" />
                        {payment.metadata?.paymentMethod || 'Card'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Card className="border-2 border-cyan-200 dark:border-cyan-800" data-testid="card-charitable-impact">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" data-testid="heading-charitable-impact">
            <Heart className="h-6 w-6 text-rose-500" />
            Charitable Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4" data-testid="text-charitable-description">
            Every payment processed through the Banimal gateway contributes to charitable causes. 
            A portion of each transaction is automatically distributed to support children in need across South Africa.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center" data-testid="metric-children-helped">
              <p className="text-2xl font-bold text-rose-600">2,847</p>
              <p className="text-sm text-muted-foreground">Children Helped</p>
            </div>
            <div className="text-center" data-testid="metric-donations">
              <p className="text-2xl font-bold text-rose-600">R 156,750</p>
              <p className="text-sm text-muted-foreground">Total Donations</p>
            </div>
            <div className="text-center" data-testid="metric-organizations">
              <p className="text-2xl font-bold text-rose-600">18</p>
              <p className="text-sm text-muted-foreground">Partner Organizations</p>
            </div>
            <div className="text-center" data-testid="metric-impact">
              <p className="text-2xl font-bold text-rose-600">35%</p>
              <p className="text-sm text-muted-foreground">Distribution Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
