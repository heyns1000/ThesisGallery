import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const paymentMethods = [
  { name: "LoopPay™ Sovereign Portal", icon: "🔄", status: "Active", action: () => window.location.href = '/looppay-gallery' },
  { name: "Stripe Payment Gateway", icon: "💳", status: "Coming Soon", action: () => alert('Stripe Payment Gateway Coming Soon') },
  { name: "Crypto Payments", icon: "₿", status: "Active", action: () => window.open('https://faa.zone/global-checkout', '_blank') },
  { name: "ZAR Pay - Homemart Africa", icon: "🇿🇦", status: "Active", action: () => window.open('https://homemart.africa/checkout/', '_blank') },
  { name: "PayPal", icon: "💰", status: "Active", action: () => window.open('https://homemart.africa/checkout/', '_blank') }
];

const supportedMethods = [
  "VISA / Mastercard", "Samsung Pay", "Instant EFT (PayFast)", "Capitec Pay",
  "SnapScan / Zapper", "Scan to Pay", "RCS Store Cards", "MobiCred"
];

const walletImages = [
  { name: "Main Wallet (BTC)", image: "/FAA_BTC_Wallet.png", highlight: true },
  { name: "ETH Wallet", image: "/FAA_ETH_Wallet.png", highlight: false },
  { name: "XRP Wallet", image: "/FAA_XRP_Wallet.png", highlight: false }
];

export default function VaultPayments() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-4 text-yellow-400">
            FAA™ Vault Payment Gateway
          </h1>
          <p className="max-w-3xl mx-auto text-lg opacity-90 italic">
            Signal-generated vault node connected to Vault@faa.zone
          </p>
        </div>
      </section>

      {/* Navigation Buttons */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <Button 
            className="h-16 bg-indigo-700 hover:bg-indigo-600"
            onClick={() => document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Payment
          </Button>
          <Button 
            className="h-16 bg-indigo-700 hover:bg-indigo-600"
            onClick={() => document.getElementById('access-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Access Control
          </Button>
          <Button 
            className="h-16 bg-indigo-700 hover:bg-indigo-600"
            onClick={() => document.getElementById('omnikey-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            OmniKey™
          </Button>
        </div>
      </section>

      {/* LoopPay Integration Banner */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-6 text-white text-center shadow-lg">
          <h2 className="text-2xl font-bold mb-2">🔄 LoopPay™ Sovereign Integration Active</h2>
          <p className="text-purple-200 mb-4">9-second payout cycles • ClaimRoot™ immutable contracts • DivLock™ compliance</p>
          <div className="flex justify-center space-x-4">
            <Badge className="bg-green-500 text-white px-3 py-1">PulseTrade™ Mesh</Badge>
            <Badge className="bg-blue-500 text-white px-3 py-1">FAA Vault Sync</Badge>
            <Badge className="bg-purple-500 text-white px-3 py-1">Sovereign Compliant</Badge>
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section id="payment-section" className="max-w-7xl mx-auto px-6 py-16">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-6">
              💳 Vault-Based Scroll Payments
            </CardTitle>
            <div className="text-center text-gray-600">
              <p>Integrated with LoopPay™ sovereign payment processing for enhanced security and compliance</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {paymentMethods.map((method, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-16 text-left flex items-center gap-3 hover:bg-gray-100"
                  onClick={method.action}
                  data-testid={`button-payment-${method.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <div className="font-semibold">{method.name}</div>
                    <Badge 
                      className={method.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {method.status}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-center text-gray-600 mb-10">
              {supportedMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-center p-2 bg-gray-100 rounded">
                  ✔️ {method}
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 mb-10">
              Every transaction auto-activates a scroll license, sealed by FAA Vault protocols.
            </p>

            {/* Wallet Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {walletImages.map((wallet, index) => (
                <div key={index} className="text-center">
                  <div className={`w-48 h-48 mx-auto border rounded-lg shadow bg-gray-100 flex items-center justify-center ${
                    wallet.highlight ? 'border-yellow-400 border-2' : 'border-gray-300'
                  }`}>
                    <div className="text-gray-500 text-sm">
                      {wallet.name}<br/>
                      QR Code Placeholder
                    </div>
                  </div>
                  <p className={`mt-2 text-sm font-semibold ${
                    wallet.highlight ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {wallet.name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Access Control Section */}
      <section id="access-section" className="max-w-6xl mx-auto px-6 py-16">
        <Card className="bg-gray-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Access Control</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 mb-6">
              Verify your vault identity and unlock full access:
            </p>
            <Button className="bg-indigo-700 hover:bg-indigo-600 text-white px-6 py-3">
              🔓 Verify License
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              Ledger-bound + legally enforced under FAA Treaty Protocols™
            </p>
          </CardContent>
        </Card>
      </section>

      {/* OmniKey Section */}
      <section id="omnikey-section" className="max-w-6xl mx-auto px-6 py-16">
        <Card className="bg-gradient-to-br from-gray-900 to-indigo-900 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-center">
              🔐 OmniKey™ License Activation
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-base mb-6">Wallet: FAA-WALLET-001-HS</p>
            
            <div className="w-52 h-52 mx-auto border-2 border-yellow-400 rounded-xl shadow-lg bg-gray-800 flex items-center justify-center mb-6">
              <div className="text-yellow-300 text-sm text-center">
                OmniKey™ QR<br/>
                Activation Code
              </div>
            </div>
            
            <div className="text-yellow-300 text-xs mb-8 space-y-1">
              <div>Scroll Mode: Auto-License on Payment</div>
              <div>Status: ✅ Active & Legally Bound</div>
              <div>Included: OmniKey™ Enterprise, Seedwave™</div>
            </div>
            
            <Button className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-6 py-3">
              🧾 View Vault Receipt
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="text-center py-10">
        <Button 
          variant="outline" 
          className="inline-flex items-center gap-2"
          onClick={() => window.location.reload()}
        >
          🔄 Sync Signal
        </Button>
        <p className="text-sm text-gray-500 mt-4">Loop active. Bound to Vault@faa.zone</p>
        <p className="text-xs text-gray-500 mt-6">
          FAA VAULTMESH™ © 2025 | Sovereign Node: FAA-ZONE-V1 | Identity: Heyns Schoeman
        </p>
      </footer>
    </div>
  );
}