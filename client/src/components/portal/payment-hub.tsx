import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, ShoppingCart, DollarSign, Check, X, Loader2, Globe, Zap, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  popular?: boolean;
  color: string;
}

interface Payment {
  id: string;
  userId: number;
  planName: string;
  amount: string;
  currency: string;
  paypalOrderId?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
}

// Payment Hub Component - Integrated with Fruitful Global Payment Portal
export function PaymentHub() {
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Payment plans for MineNest and VaultMesh™ services
  const paymentPlans: PaymentPlan[] = [
    {
      id: 'basic',
      name: 'MineNest Basic',
      description: 'Essential mining simulation tools',
      price: '29.99',
      currency: 'USD',
      icon: Globe,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Basic mining algorithms',
        'Resource tracking',
        'Standard analytics',
        'Community support',
        'Basic API access'
      ]
    },
    {
      id: 'professional',
      name: 'VaultMesh™ Pro',
      description: 'Advanced blockchain integration',
      price: '89.99',
      currency: 'USD',
      icon: Zap,
      popular: true,
      color: 'from-purple-500 to-purple-600',
      features: [
        'Advanced VaultMesh™ integration',
        'Real-time blockchain sync',
        'Premium analytics dashboard',
        'Priority support',
        'Full API access',
        'Custom workflows'
      ]
    },
    {
      id: 'enterprise',
      name: 'FAA.ZONE™ Enterprise',
      description: 'Complete ecosystem access',
      price: '299.99',
      currency: 'USD',
      icon: Crown,
      color: 'from-orange-500 to-orange-600',
      features: [
        'Full FAA.ZONE™ access',
        'HotStack integration',
        'Seedwave™ Admin Portal',
        'White-label solutions',
        'Dedicated account manager',
        'Custom integrations',
        '24/7 premium support'
      ]
    }
  ];

  // Fetch payment history
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['/api/payments'],
    queryFn: async () => {
      const response = await fetch('/api/payments');
      if (!response.ok) throw new Error('Failed to fetch payments');
      return response.json() as Payment[];
    }
  });

  // Currency converter integration
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: async (planData: { planId: string; currency: string }) => {
      setIsProcessingPayment(true);
      
      // Simulate PayPal integration
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: selectedPlan?.name,
          amount: convertPrice(selectedPlan?.price || '0', planData.currency),
          currency: planData.currency
        })
      });

      if (!response.ok) throw new Error('Payment processing failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Payment initiated",
        description: `Payment for ${selectedPlan?.name} has been initiated successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
      setIsProcessingPayment(false);
    },
    onError: (error) => {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessingPayment(false);
    }
  });

  const convertPrice = (price: string, currency: string): string => {
    if (currency === 'USD' || !exchangeRates[currency]) return price;
    const converted = parseFloat(price) * exchangeRates[currency];
    return converted.toFixed(2);
  };

  const formatCurrency = (amount: string, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(parseFloat(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="w-4 h-4" />;
      case 'pending': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'failed': return <X className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-purple-500/5">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
            Fruitful Global Payment & SSO Portal
          </CardTitle>
          <CardDescription className="text-lg">
            Secure payments for MineNest, VaultMesh™, and FAA.ZONE™ ecosystem services
          </CardDescription>
          <div className="flex justify-center space-x-2 mt-4">
            <Badge variant="outline" className="border-orange-500 text-orange-400">PayPal Integrated</Badge>
            <Badge variant="outline" className="border-green-500 text-green-400">Multi-Currency</Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">SSO Ready</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Currency Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Currency & Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">🇺🇸 USD</SelectItem>
                <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
                <SelectItem value="GBP">🇬🇧 GBP</SelectItem>
                <SelectItem value="CAD">🇨🇦 CAD</SelectItem>
                <SelectItem value="AUD">🇦🇺 AUD</SelectItem>
                <SelectItem value="ZAR">🇿🇦 ZAR</SelectItem>
              </SelectContent>
            </Select>
            {exchangeRates[selectedCurrency] && selectedCurrency !== 'USD' && (
              <div className="text-sm text-muted-foreground">
                1 USD = {exchangeRates[selectedCurrency].toFixed(4)} {selectedCurrency}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paymentPlans.map((plan) => {
          const IconComponent = plan.icon;
          const convertedPrice = convertPrice(plan.price, selectedCurrency);
          
          return (
            <Card 
              key={plan.id}
              className={cn(
                "relative cursor-pointer transition-all duration-300 hover:scale-105",
                selectedPlan?.id === plan.id && "ring-2 ring-cyan-500 shadow-lg",
                plan.popular && "border-purple-500/50"
              )}
              onClick={() => setSelectedPlan(plan)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-500 text-white px-3 py-1">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className={cn(
                  "w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-gradient-to-r",
                  plan.color
                )}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="text-3xl font-bold">
                  {formatCurrency(convertedPrice, selectedCurrency)}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {selectedPlan?.id === plan.id && (
                  <Button 
                    className="w-full"
                    onClick={() => processPaymentMutation.mutate({ 
                      planId: plan.id, 
                      currency: selectedCurrency 
                    })}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Subscribe Now
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payments found. Subscribe to a plan to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div 
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-white",
                      getStatusColor(payment.status)
                    )}>
                      {getStatusIcon(payment.status)}
                    </div>
                    <div>
                      <div className="font-semibold">{payment.planName}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                    <Badge 
                      className={cn("text-xs", getStatusColor(payment.status))}
                      variant="secondary"
                    >
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Ecosystem Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'VaultMesh™', status: 'active', integration: 'PayPal SDK' },
              { name: 'HotStack', status: 'active', integration: 'SSO Ready' },
              { name: 'FAA.ZONE™', status: 'active', integration: 'Multi-Currency' },
              { name: 'MineNest', status: 'active', integration: 'Subscription API' }
            ].map((service) => (
              <div key={service.name} className="text-center p-4 border rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                <div className="font-semibold text-sm">{service.name}</div>
                <div className="text-xs text-muted-foreground">{service.integration}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}