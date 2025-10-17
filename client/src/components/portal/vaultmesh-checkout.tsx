import { useState, useEffect } from 'react';
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
      setSelectedProduct(banimalProducts[1]);
    }
  }, []);

  const handleProductSelect = (product: BanimalLoopProduct) => {
    setSelectedProduct(product);
    setCurrentStep(2);
  };

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

  const handleRedirectToPayment = () => {
    toast({
      title: "Redirecting to Banimal.co.za",
      description: "All payment processing happens through our secure Banimal payment gateway.",
    });
    
    const checkoutUrl = `https://banimal.co.za/checkout?product=${selectedProduct?.id}&email=${checkoutData.email}`;
    window.open(checkoutUrl, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto p-6" data-testid="vaultmesh-checkout-container">
      <div className="flex items-center gap-4 mb-8">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-checkout">VaultMesh™ Checkout</h1>
          <p className="text-muted-foreground" data-testid="text-checkout-description">Secure your Banimal Loop subscription</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8" data-testid="checkout-steps">
        {checkoutSteps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className={cn(
              "flex items-center gap-2 flex-1",
              step.completed && "opacity-60"
            )} data-testid={`step-${step.id}`}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-semibold",
                currentStep === step.id && "bg-cyan-500 text-white",
                step.completed && "bg-green-500 text-white",
                currentStep !== step.id && !step.completed && "bg-gray-200 dark:bg-gray-700"
              )} data-testid={`step-indicator-${step.id}`}>
                {step.completed ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span className="text-sm font-medium" data-testid={`step-title-${step.id}`}>{step.title}</span>
            </div>
            {index < checkoutSteps.length - 1 && (
              <div className="w-full h-0.5 bg-gray-200 dark:bg-gray-700 mx-2" />
            )}
          </div>
        ))}
      </div>

      {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="step-1-products">
          {banimalProducts.map((product) => (
            <Card 
              key={product.id}
              className={cn(
                "cursor-pointer transition-all",
                selectedProduct?.id === product.id && "border-2 border-cyan-500"
              )}
              onClick={() => handleProductSelect(product)}
              data-testid={`card-product-${product.id}`}
            >
              <CardHeader>
                <CardTitle data-testid={`text-product-name-${product.id}`}>{product.name}</CardTitle>
                <CardDescription data-testid={`text-product-description-${product.id}`}>{product.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold" data-testid={`text-product-price-${product.id}`}>${product.price}</span>
                  <span className="text-muted-foreground">/{product.currency}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-2" data-testid={`text-features-label-${product.id}`}>Features:</p>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm" data-testid={`feature-${product.id}-${index}`}>
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2" data-testid={`text-integrations-label-${product.id}`}>Integrations:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.integrations.map((integration, index) => (
                        <Badge key={index} variant="outline" data-testid={`badge-integration-${product.id}-${index}`}>
                          {integration}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {currentStep === 2 && (
        <Card data-testid="step-2-customer-info">
          <CardHeader>
            <CardTitle data-testid="heading-customer-info">Customer Information</CardTitle>
            <CardDescription data-testid="text-customer-info-description">Please provide your billing details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" data-testid="label-first-name">First Name</Label>
                <Input
                  id="firstName"
                  value={checkoutData.firstName}
                  onChange={(e) => setCheckoutData({ ...checkoutData, firstName: e.target.value })}
                  data-testid="input-first-name"
                />
              </div>
              <div>
                <Label htmlFor="lastName" data-testid="label-last-name">Last Name</Label>
                <Input
                  id="lastName"
                  value={checkoutData.lastName}
                  onChange={(e) => setCheckoutData({ ...checkoutData, lastName: e.target.value })}
                  data-testid="input-last-name"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" data-testid="label-email">Email</Label>
              <Input
                id="email"
                type="email"
                value={checkoutData.email}
                onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                data-testid="input-email"
              />
            </div>
            <div>
              <Label htmlFor="company" data-testid="label-company">Company (Optional)</Label>
              <Input
                id="company"
                value={checkoutData.company}
                onChange={(e) => setCheckoutData({ ...checkoutData, company: e.target.value })}
                data-testid="input-company"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handlePreviousStep} data-testid="button-previous-2">
                Previous
              </Button>
              <Button onClick={handleNextStep} data-testid="button-next-2">
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card data-testid="step-3-payment">
          <CardHeader>
            <CardTitle data-testid="heading-payment">Payment Method</CardTitle>
            <CardDescription data-testid="text-payment-description">Secure payment through banimal.co.za</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-cyan-500" />
                <h3 className="font-semibold" data-testid="heading-secure-payment">Secure Payment Gateway</h3>
              </div>
              <p className="text-sm text-muted-foreground" data-testid="text-secure-payment-description">
                All payments are processed securely through our trusted payment partner banimal.co.za. 
                Your payment information is encrypted and protected.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold" data-testid="heading-order-summary">Order Summary</h4>
              <div className="flex justify-between" data-testid="summary-product-name">
                <span>Product:</span>
                <span className="font-semibold">{selectedProduct?.name}</span>
              </div>
              <div className="flex justify-between" data-testid="summary-product-price">
                <span>Price:</span>
                <span className="font-semibold">${selectedProduct?.price} {selectedProduct?.currency}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold" data-testid="summary-total">
                <span>Total:</span>
                <span>${selectedProduct?.price} {selectedProduct?.currency}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={handlePreviousStep} data-testid="button-previous-3">
                Previous
              </Button>
              <Button 
                onClick={handleRedirectToPayment} 
                className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                data-testid="button-proceed-payment"
              >
                <Lock className="mr-2 h-4 w-4" />
                Proceed to Secure Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
