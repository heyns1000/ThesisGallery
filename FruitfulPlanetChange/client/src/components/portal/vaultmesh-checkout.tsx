import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Check, CreditCard, Shield, Zap, Globe, Lock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CheckoutStep {
  id: number;
  title: string;
  completed: boolean;
}

interface BanimalLoopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  integrations: string[];
}

// VaultMesh™ Banimal Loop Checkout Component
export function VaultMeshCheckout({ onBack }: { onBack?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<BanimalLoopProduct | null>(null);
  const [checkoutData, setCheckoutData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    billingAddress: '',
    city: '',
    country: '',
    paymentMethod: 'paypal'
  });

  const { toast } = useToast();

  const checkoutSteps: CheckoutStep[] = [
    { id: 1, title: 'Product Selection', completed: currentStep > 1 },
    { id: 2, title: 'Customer Info', completed: currentStep > 2 },
    { id: 3, title: 'Payment', completed: currentStep > 3 },
    { id: 4, title: 'Confirmation', completed: false }
  ];

  // Banimal Loop products for VaultMesh™
  const banimalProducts: BanimalLoopProduct[] = [
    {
      id: 'basic-loop',
      name: 'Banimal Loop Basic',
      description: 'Essential blockchain simulation and trading loop',
      price: 149.99,
      currency: 'USD',
      features: [
        'Basic trading algorithms',
        'Real-time market simulation',
        'Portfolio tracking',
        'Risk management tools',
        'Email support'
      ],
      integrations: ['VaultMesh™ Core', 'Basic API Access']
    },
    {
      id: 'professional-loop',
      name: 'Banimal Loop Professional',
      description: 'Advanced trading strategies with AI integration',
      price: 299.99,
      currency: 'USD',
      features: [
        'Advanced AI trading algorithms',
        'Multi-market analysis',
        'Custom strategy builder',
        'Advanced risk metrics',
        'Real-time alerts',
        'Priority support'
      ],
      integrations: ['VaultMesh™ Pro', 'HotStack Integration', 'Full API Suite']
    },
    {
      id: 'enterprise-loop',
      name: 'Banimal Loop Enterprise',
      description: 'Complete institutional-grade trading ecosystem',
      price: 999.99,
      currency: 'USD',
      features: [
        'Institutional trading algorithms',
        'Multi-exchange connectivity',
        'Custom integrations',
        'Advanced analytics dashboard',
        'White-label solutions',
        'Dedicated account manager',
        '24/7 phone support'
      ],
      integrations: ['Full VaultMesh™ Suite', 'HotStack Pro', 'FAA.ZONE™ Access', 'Custom APIs']
    }
  ];

  useEffect(() => {
    if (!selectedProduct && banimalProducts.length > 0) {
      setSelectedProduct(banimalProducts[1]); // Default to Professional
    }
  }, []);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const processCheckout = useMutation({
    mutationFn: async () => {
      // Simulate checkout processing
      const response = await fetch('/api/vaultmesh/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: selectedProduct,
          customer: checkoutData
        })
      });

      if (!response.ok) throw new Error('Checkout failed');
      return response.json();
    },
    onSuccess: () => {
      setCurrentStep(4);
      toast({
        title: "Order placed successfully!",
        description: `Your ${selectedProduct?.name} order has been processed.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Checkout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {checkoutSteps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
              currentStep === step.id
                ? "bg-cyan-500 text-white"
                : step.completed
                ? "bg-green-500 text-white"
                : "bg-muted text-muted-foreground"
            )}
          >
            {step.completed ? (
              <Check className="w-5 h-5" />
            ) : (
              step.id
            )}
          </div>
          <div className="ml-2 mr-4 text-sm font-medium">
            {step.title}
          </div>
          {index < checkoutSteps.length - 1 && (
            <div className="w-8 h-0.5 bg-muted mx-4" />
          )}
        </div>
      ))}
    </div>
  );

  const renderProductSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Choose Your Banimal Loop Package</h2>
        <p className="text-muted-foreground">
          Select the perfect VaultMesh™ trading solution for your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {banimalProducts.map((product) => (
          <Card
            key={product.id}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:shadow-lg",
              selectedProduct?.id === product.id && "ring-2 ring-cyan-500",
              product.id === 'professional-loop' && "border-purple-500/50"
            )}
            onClick={() => setSelectedProduct(product)}
          >
            {product.id === 'professional-loop' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-500 text-white">Recommended</Badge>
              </div>
            )}

            <CardHeader className="text-center relative">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
              <div className="text-3xl font-bold text-cyan-500">
                ${product.price}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Features:</h4>
                <ul className="space-y-1 text-sm">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Integrations:</h4>
                <div className="flex flex-wrap gap-1">
                  {product.integrations.map((integration, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {integration}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCustomerInfo = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Customer Information</h2>
        <p className="text-muted-foreground">
          Please provide your details for account setup and billing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={checkoutData.firstName}
            onChange={(e) => setCheckoutData({...checkoutData, firstName: e.target.value})}
            placeholder="John"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={checkoutData.lastName}
            onChange={(e) => setCheckoutData({...checkoutData, lastName: e.target.value})}
            placeholder="Doe"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={checkoutData.email}
          onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})}
          placeholder="john@company.com"
        />
      </div>

      <div>
        <Label htmlFor="company">Company (Optional)</Label>
        <Input
          id="company"
          value={checkoutData.company}
          onChange={(e) => setCheckoutData({...checkoutData, company: e.target.value})}
          placeholder="Acme Corp"
        />
      </div>

      <Separator />

      <div>
        <Label htmlFor="billingAddress">Billing Address</Label>
        <Input
          id="billingAddress"
          value={checkoutData.billingAddress}
          onChange={(e) => setCheckoutData({...checkoutData, billingAddress: e.target.value})}
          placeholder="123 Main Street"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={checkoutData.city}
            onChange={(e) => setCheckoutData({...checkoutData, city: e.target.value})}
            placeholder="New York"
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Select value={checkoutData.country} onValueChange={(value) => setCheckoutData({...checkoutData, country: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="GB">United Kingdom</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
              <SelectItem value="ZA">South Africa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
        <p className="text-muted-foreground">
          Secure payment processing via PayPal integration
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>{selectedProduct?.name}</span>
            <span className="font-semibold">${selectedProduct?.price}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${selectedProduct?.price}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Shield className="w-6 h-6 text-green-500" />
            <span className="text-sm text-muted-foreground">
              Secured by PayPal • 256-bit SSL encryption
            </span>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <CreditCard className="w-5 h-5 text-blue-500 mr-2" />
              <span className="font-semibold">PayPal Payment</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You will be redirected to PayPal to complete your payment securely.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-green-600">Order Confirmed!</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Your {selectedProduct?.name} subscription has been activated. 
        You'll receive a confirmation email shortly with your access details.
      </p>

      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 space-y-2">
          <div className="flex justify-between">
            <span>Product:</span>
            <span className="font-semibold">{selectedProduct?.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-semibold">${selectedProduct?.price}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <Badge className="bg-green-500">Active</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portal
              </Button>
            )}
            <div className="flex-1" />
            <div className="flex space-x-2">
              <Badge variant="outline" className="border-cyan-500 text-cyan-400">VaultMesh™</Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-400">Banimal Loop</Badge>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            VaultMesh™ Banimal Loop Checkout
          </CardTitle>
          <CardDescription className="text-lg">
            Advanced blockchain trading simulation and portfolio management
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          {currentStep === 1 && renderProductSelection()}
          {currentStep === 2 && renderCustomerInfo()}
          {currentStep === 3 && renderPayment()}
          {currentStep === 4 && renderConfirmation()}
        </CardContent>
      </Card>

      {/* Navigation */}
      {currentStep < 4 && (
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button 
            onClick={currentStep === 3 ? () => processCheckout.mutate() : handleNextStep}
            disabled={processCheckout.isPending || 
              (currentStep === 2 && (!checkoutData.email || !checkoutData.firstName || !checkoutData.lastName))}
          >
            {currentStep === 3 ? 'Complete Order' : 'Next Step'}
          </Button>
        </div>
      )}
    </div>
  );
}