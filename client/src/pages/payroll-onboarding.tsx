import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function PayrollOnboarding() {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    teamMembers: "",
    payrollType: "",
    notes: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to API
    console.log("Onboarding form submitted:", formData);
    setIsSubmitted(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-gray-950 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-black text-green-400 mb-6">
            ✅ Node Request Received
          </h1>
          <p className="text-lg text-white opacity-80 mb-10">
            Your form has been submitted and is being routed through VaultMesh™ Verification.<br/>
            Expect scroll binding confirmation within 12 minutes.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/payroll-dashboard">
              <Button className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 text-lg">
                Open Payroll Core
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black px-6 py-3 text-lg">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-950 border-b border-purple-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-white">🍇 Fruitful™ Payroll OS</h1>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-semibold">
            <Link href="/payroll-dashboard" className="hover:text-purple-400">Dashboard</Link>
            <Link href="/vault-payments" className="hover:text-purple-400">Payments</Link>
            <Link href="/" className="hover:text-purple-400">Home</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-800 via-indigo-900 to-black text-center py-16">
        <h1 className="text-5xl md:text-7xl font-black mb-6">
          🚀 Launch Your Payroll Grid
        </h1>
        <p className="text-lg max-w-2xl mx-auto opacity-80">
          Deploy your own node, bind compliance scrolls, activate payslip engines and link team logic in under 10 minutes.
        </p>
      </section>

      {/* Onboarding Form */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <Card className="bg-gray-950 border-purple-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-purple-400 text-center">
              🧾 Submit Your Payroll Launch Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="companyName" className="text-sm font-semibold text-white">
                  Company or DAO Name
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="e.g. ScrollWorks DAO"
                  className="bg-gray-800 border-gray-600 text-white mt-2"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  required
                  data-testid="input-company-name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-white">
                  Contact Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@yourdomain.com"
                  className="bg-gray-800 border-gray-600 text-white mt-2"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  data-testid="input-email"
                />
              </div>

              <div>
                <Label htmlFor="teamMembers" className="text-sm font-semibold text-white">
                  Number of Active Team Members
                </Label>
                <Input
                  id="teamMembers"
                  type="number"
                  placeholder="e.g. 35"
                  className="bg-gray-800 border-gray-600 text-white mt-2"
                  value={formData.teamMembers}
                  onChange={(e) => handleInputChange("teamMembers", e.target.value)}
                  required
                  data-testid="input-team-members"
                />
              </div>

              <div>
                <Label htmlFor="payrollType" className="text-sm font-semibold text-white">
                  Payroll Type
                </Label>
                <Select onValueChange={(value) => handleInputChange("payrollType", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white mt-2">
                    <SelectValue placeholder="Select payroll type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly (Standard)</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="contractor">Contractor / Task-Based</SelectItem>
                    <SelectItem value="hybrid">Staggered (Hybrid)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-semibold text-white">
                  Additional Notes or Logic Requests
                </Label>
                <Textarea
                  id="notes"
                  rows={4}
                  placeholder="e.g. Sync with legacy system, custom scroll bindings..."
                  className="bg-gray-800 border-gray-600 text-white mt-2"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  data-testid="textarea-notes"
                />
              </div>

              <div className="text-center pt-6">
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 text-lg font-semibold"
                  data-testid="button-submit-onboarding"
                >
                  Submit & Activate Node
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* What's Next Section */}
        <Card className="bg-gray-900 border-gray-700 mt-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-400 text-center">
              🌐 Next: Scroll Integration & Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-300">
              <li>• VaultMesh™ will assign a Scroll ID and auto-map team slots based on submission.</li>
              <li>• You'll receive a secure node login link once verification is complete.</li>
              <li>• All submitted metadata will be used to generate audit and payslip keys.</li>
              <li>• If additional logic was requested, our team will follow up with a custom config binding doc.</li>
              <li>• Expect full activation and export access within 12–20 minutes.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-500 border-t border-purple-800">
        FAA™ VaultMesh | Scroll Synced | Node Verified | Treaty Logged
      </footer>
    </div>
  );
}