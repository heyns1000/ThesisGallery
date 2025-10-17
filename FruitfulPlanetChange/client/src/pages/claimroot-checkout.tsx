import ClaimRootCheckout from "@/components/claimroot-checkout"

export default function ClaimRootCheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧬 ClaimRoot License Checkout
          </h1>
          <p className="text-slate-300 text-lg">
            VaultLevel 7 • FAA-X13 Treaty Compliant • Scroll Verified
          </p>
        </div>
        
        <ClaimRootCheckout 
          sector="Technology"
          price={1140}
          onCheckoutComplete={() => {
            console.log("🔥 ClaimRoot license checkout completed!")
          }}
        />
      </div>
    </div>
  )
}