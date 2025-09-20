import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SamFoxGalleryStrip } from "@/components/samfox-gallery";
import { ArrowLeft, Users, Target, Trophy, BarChart3 } from "lucide-react";
import { Link } from "wouter";

export default function AgentInsightsModule() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-cyan-700 p-6">
        <div className="w-full px-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/faa-realestate-platform">
              <Button variant="outline" size="sm" className="bg-transparent border-indigo-300 text-indigo-300 hover:bg-indigo-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Platform
              </Button>
            </Link>
            <Badge className="bg-indigo-500 text-white px-3 py-1">Active Module</Badge>
          </div>
          <h1 className="text-4xl font-bold text-indigo-100">🧭 Agent Intelligence Hub</h1>
          <p className="text-indigo-200 mt-2">Advanced analytics for real estate agents with client prediction and deal optimization</p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full p-6 space-y-8">
        {/* Performance Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-950 border-indigo-500">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-indigo-400">+25%</div>
              <div className="text-gray-400">Deal Success Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-950 border-cyan-500">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-cyan-400">90%</div>
              <div className="text-gray-400">Client Match Accuracy</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-950 border-green-500">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-green-400">A-grade</div>
              <div className="text-gray-400">Lead Quality</div>
            </CardContent>
          </Card>
        </section>

        {/* Agent Intelligence Dashboard */}
        <section>
          <Card className="bg-gray-950 border-indigo-500">
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-400">🎯 Agent Performance Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-300 mb-4">Intelligence Modules</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Client Behavior Predictor</span>
                      <Badge className="bg-indigo-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Deal Probability Calculator</span>
                      <Badge className="bg-indigo-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Lead Scoring Engine</span>
                      <Badge className="bg-indigo-500 text-white">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Commission Optimizer</span>
                      <Badge className="bg-indigo-500 text-white">Active</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-300 mb-4">Analytics Tools</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Performance Benchmarking</span>
                      <Badge className="bg-cyan-500 text-white">Available</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Market Share Analysis</span>
                      <Badge className="bg-cyan-500 text-white">Available</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Client Satisfaction Metrics</span>
                      <Badge className="bg-cyan-500 text-white">Available</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Revenue Forecasting</span>
                      <Badge className="bg-cyan-500 text-white">Available</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Action Panel */}
        <section>
          <Card className="bg-gray-950 border-indigo-500">
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-400">⚡ Agent Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="bg-indigo-600 hover:bg-indigo-500 p-6 h-auto flex flex-col gap-2">
                  <Users className="w-8 h-8" />
                  <span>Client Insights</span>
                </Button>
                <Button className="bg-cyan-600 hover:bg-cyan-500 p-6 h-auto flex flex-col gap-2">
                  <Target className="w-8 h-8" />
                  <span>Lead Scoring</span>
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-500 p-6 h-auto flex flex-col gap-2">
                  <Trophy className="w-8 h-8" />
                  <span>Performance Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SamFox Agent Performance Assets Strip */}
        <section className="bg-gradient-to-r from-indigo-900/20 to-cyan-900/20 rounded-lg border border-indigo-500/30 p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-indigo-400 flex items-center">
              🦁 Agent Intelligence Assets
            </h3>
            <p className="text-gray-400 mt-1">Performance dashboards, client insights, and agent tools</p>
          </div>
          <SamFoxGalleryStrip 
            filterType="screenshot,brand-asset,concept"
            title="Agent Performance Visuals"
            readOnly={true}
            showFullScreen={true}
          />
        </section>
      </div>
    </div>
  );
}