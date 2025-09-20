import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, AlertTriangle, TrendingDown, BarChart3 } from "lucide-react";
import { Link } from "wouter";

export default function MortgageRiskModule() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-orange-700 p-6">
        <div className="w-full px-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/faa-realestate-platform">
              <Button variant="outline" size="sm" className="bg-transparent border-red-300 text-red-300 hover:bg-red-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Platform
              </Button>
            </Link>
            <Badge className="bg-red-500 text-white px-3 py-1">Active Module</Badge>
          </div>
          <h1 className="text-4xl font-bold text-red-100">⚠️ Mortgage Risk Grid</h1>
          <p className="text-red-200 mt-2">AI-powered mortgage risk assessment and loan recovery optimization</p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full p-6 space-y-8">
        {/* Performance Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-950 border-red-500">
            <CardContent className="p-6 text-center">
              <TrendingDown className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-red-400">30%</div>
              <div className="text-gray-400">Risk Reduction</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-950 border-orange-500">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-orange-400">92%</div>
              <div className="text-gray-400">Assessment Accuracy</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-950 border-yellow-500">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-yellow-400">SA-wide</div>
              <div className="text-gray-400">Coverage</div>
            </CardContent>
          </Card>
        </section>

        {/* Risk Assessment Dashboard */}
        <section>
          <Card className="bg-gray-950 border-red-500">
            <CardHeader>
              <CardTitle className="text-2xl text-red-400">🎯 Risk Assessment Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-red-300 mb-4">Risk Analysis Models</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Credit Score Predictor</span>
                      <Badge className="bg-red-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Income Stability Analyzer</span>
                      <Badge className="bg-red-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Debt-to-Income Calculator</span>
                      <Badge className="bg-red-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Property Risk Evaluator</span>
                      <Badge className="bg-red-500 text-white">Active</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-300 mb-4">Risk Factors</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Employment History</span>
                      <Badge className="bg-orange-500 text-white">Monitoring</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Market Volatility</span>
                      <Badge className="bg-orange-500 text-white">Monitoring</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Interest Rate Trends</span>
                      <Badge className="bg-orange-500 text-white">Monitoring</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Economic Indicators</span>
                      <Badge className="bg-orange-500 text-white">Monitoring</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Action Panel */}
        <section>
          <Card className="bg-gray-950 border-red-500">
            <CardHeader>
              <CardTitle className="text-2xl text-red-400">⚡ Risk Management Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="bg-red-600 hover:bg-red-500 p-6 h-auto flex flex-col gap-2">
                  <AlertTriangle className="w-8 h-8" />
                  <span>Assess Risk Profile</span>
                </Button>
                <Button className="bg-orange-600 hover:bg-orange-500 p-6 h-auto flex flex-col gap-2">
                  <Shield className="w-8 h-8" />
                  <span>Generate Report</span>
                </Button>
                <Button className="bg-yellow-600 hover:bg-yellow-500 p-6 h-auto flex flex-col gap-2">
                  <BarChart3 className="w-8 h-8" />
                  <span>Risk Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}