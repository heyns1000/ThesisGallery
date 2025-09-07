import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Target, BarChart3, Activity } from "lucide-react";
import { Link } from "wouter";

export default function ValuationAIModule() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/faa-realestate-platform">
              <Button variant="outline" size="sm" className="bg-transparent border-green-300 text-green-300 hover:bg-green-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Platform
              </Button>
            </Link>
            <Badge className="bg-green-500 text-white px-3 py-1">Active Module</Badge>
          </div>
          <h1 className="text-4xl font-bold text-green-100">📊 Real-Time Valuation AI</h1>
          <p className="text-green-200 mt-2">Instant property valuations with 95% predictive accuracy using machine learning</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Performance Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-950 border-green-500">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-green-400">95%</div>
              <div className="text-gray-400">Prediction Accuracy</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-950 border-blue-500">
            <CardContent className="p-6 text-center">
              <Activity className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-blue-400">Instant</div>
              <div className="text-gray-400">Processing Speed</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-950 border-yellow-500">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-yellow-400">1000+</div>
              <div className="text-gray-400">Valuations/Day</div>
            </CardContent>
          </Card>
        </section>

        {/* AI Engine Status */}
        <section>
          <Card className="bg-gray-950 border-green-500">
            <CardHeader>
              <CardTitle className="text-2xl text-green-400">🤖 AI Valuation Engine Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-green-300 mb-4">Machine Learning Models</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Property Value Predictor</span>
                      <Badge className="bg-green-500 text-white">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Market Trend Analyzer</span>
                      <Badge className="bg-green-500 text-white">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Comparative Analysis Engine</span>
                      <Badge className="bg-green-500 text-white">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Risk Assessment Module</span>
                      <Badge className="bg-green-500 text-white">Online</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-300 mb-4">Data Sources</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Property24 Feed</span>
                      <Badge className="bg-blue-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Government Deeds Office</span>
                      <Badge className="bg-blue-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Municipal Valuations</span>
                      <Badge className="bg-blue-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Economic Indicators</span>
                      <Badge className="bg-blue-500 text-white">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Action Panel */}
        <section>
          <Card className="bg-gray-950 border-green-500">
            <CardHeader>
              <CardTitle className="text-2xl text-green-400">🚀 Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="bg-green-600 hover:bg-green-500 p-6 h-auto flex flex-col gap-2">
                  <TrendingUp className="w-8 h-8" />
                  <span>Generate Valuation</span>
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-500 p-6 h-auto flex flex-col gap-2">
                  <BarChart3 className="w-8 h-8" />
                  <span>View Analytics</span>
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-500 p-6 h-auto flex flex-col gap-2">
                  <Target className="w-8 h-8" />
                  <span>Model Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}