import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Shield, Zap, CreditCard } from "lucide-react"

// PayPal Hosted Button Configuration
const PAYPAL_CLIENT_ID = "BAAGdPecRsf6dw_nIrWqUen0GdW0UsBZapp1Gn62xkPdD-Vqc-4lqWAidKK8LOObXux8pHJGjXknZoar6Q";
const CLAIMROOT_HOSTED_BUTTON_ID = "K9BPET82JDRQ4";

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function ClaimRootCheckout({
  sector = "Technology",
  price = 1140,
  onCheckoutComplete
}: ClaimRootCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    // Load PayPal SDK
    if (!window.paypal) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=hosted-buttons&disable-funding=venmo&currency=USD`;
      script.async = true;
      script.onload = () => {
        setPaypalLoaded(true);
        renderPayPalButton();
      };
      document.head.appendChild(script);
    } else {
      setPaypalLoaded(true);
      renderPayPalButton();
    }
  }, []);

  const renderPayPalButton = () => {
    if (window.paypal && window.paypal.HostedButtons) {
      // Clear existing PayPal containers
      const containers = document.querySelectorAll('[id^="paypal-container-"]');
      containers.forEach(container => {
        container.innerHTML = '';
      });

      // Render ClaimRoot PayPal button
      setTimeout(() => {
        const container = document.getElementById(`paypal-container-${CLAIMROOT_HOSTED_BUTTON_ID}`);
        if (container && window.paypal.HostedButtons) {
          window.paypal.HostedButtons({
            hostedButtonId: CLAIMROOT_HOSTED_BUTTON_ID,
          }).render(`#paypal-container-${CLAIMROOT_HOSTED_BUTTON_ID}`);
        }
      }, 100);
    }
  };

  return (
    <Card className="max-w-lg mx-auto bg-gradient-to-br from-slate-900 to-slate-800 border-amber-500/20">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-amber-400 mr-2" />
          <span className="text-2xl font-bold text-amber-400">ClaimRoot</span>
        </div>
        <CardTitle className="text-white">🧬 License Checkout</CardTitle>
        <CardDescription className="text-slate-300">
          Scroll-compliant licensing for {sector} sector
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* License Details */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-amber-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">ClaimRoot License – CodeFlow</span>
            <Badge variant="outline" className="border-amber-500 text-amber-400">
              {sector}
            </Badge>
          </div>
          <div className="text-2xl font-bold text-white">${price.toLocaleString()} USD</div>
          <div className="text-sm text-slate-400">Annual license with VaultMesh activation</div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <div className="flex items-center text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
            🧬 VaultMesh activation included
          </div>
          <div className="flex items-center text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
            FAA-X13 Treaty compliance
          </div>
          <div className="flex items-center text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
            SHA-256 metadata seal
          </div>
          <div className="flex items-center text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
            TreatyFlame audit trail
          </div>
        </div>

        {/* PayPal Integration */}
        <div className="mt-8 space-y-4">
          {/* PayPal Hosted Button Integration */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">ClaimRoot License - CodeFlow ({sector})</h3>
              <p className="text-2xl font-bold text-green-600">${price.toLocaleString()} USD</p>
              <p className="text-sm text-gray-600 mt-2">
                Grants full access to scroll-bound licensing certificate for CodeFlow under the {sector} sector.
                Includes 🔒 VaultMesh activation, FAA.X13 Treaty compliance, and SHA-256 metadata seal.
              </p>
            </div>

            {/* PayPal Button Container */}
            <div id={`paypal-container-${CLAIMROOT_HOSTED_BUTTON_ID}`} className="flex justify-center">
              {!paypalLoaded && (
                <div className="animate-pulse bg-yellow-400 text-black px-8 py-3 rounded font-bold">
                  Loading PayPal...
                </div>
              )}
            </div>

            {/* Fallback form for direct PayPal payment */}
            <div className="text-center">
              <form
                action={`https://www.paypal.com/ncp/payment/${CLAIMROOT_HOSTED_BUTTON_ID}`}
                method="post"
                target="_blank"
                className="inline-grid justify-items-center align-content-start gap-2"
              >
                <input
                  className="bg-yellow-400 text-black border-none rounded px-8 py-3 font-bold cursor-pointer hover:bg-yellow-500 transition-colors min-w-48"
                  type="submit"
                  value="Buy Now"
                />
                <img
                  src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg"
                  alt="cards"
                  className="max-w-32"
                />
                <section className="text-xs text-gray-500">
                  Powered by{' '}
                  <img
                    src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg"
                    alt="paypal"
                    className="h-3 inline align-middle ml-1"
                  />
                </section>
              </form>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 pt-4">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Encrypted
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Verified
            </div>
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-1" />
              Secure
            </div>
          </div>
        </div>

        {/* VaultLevel 7 Status */}
        <div className="bg-green-900/20 border border-green-500/20 p-3 rounded-lg">
          <div className="flex items-center justify-center text-green-400 mb-2">
            <Zap className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">VaultLevel 7 Verified</span>
          </div>
          <div className="text-xs text-center text-slate-400">
            FAA Treaty compliant • Scroll verified • Flame sealed
          </div>
        </div>
      </CardContent>
    </Card>
  )
}