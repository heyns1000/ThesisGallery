import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Calendar, Target, BarChart3 } from "lucide-react";
import { Link } from "wouter";

export default function MarketForecastModule() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-700 p-6">
        <div className="w-full px-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/faa-realestate-platform">
              <Button variant="outline" size="sm" className="bg-transparent border-blue-300 text-blue-300 hover:bg-blue-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Platform
              </Button>
            </Link>
            <Badge className="bg-blue-500 text-white px-3 py-1">Active Module</Badge>
          </div>
          <h1 className="text-4xl font-bold text-blue-100">📈 Market Trend Forecasting</h1>
          <p className="text-blue-200 mt-2">Predictive analytics for property market movements and investment opportunities</p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full p-6 space-y-8">
        {/* Performance Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-950 border-blue-500">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-blue-400">88%</div>
              <div className="text-gray-400">Forecast Accuracy</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-950 border-purple-500">
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-purple-400">12</div>
              <div className="text-gray-400">Month Horizon</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-950 border-green-500">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-green-400">50+</div>
              <div className="text-gray-400">Market Indicators</div>
            </CardContent>
          </Card>
        </section>

        {/* Forecasting Dashboard */}
        <section>
          <Card className="bg-gray-950 border-blue-500">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-400">🔮 Market Forecasting Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-4">Prediction Models</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Price Trend Predictor</span>
                      <Badge className="bg-blue-500 text-white">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Demand Forecaster</span>
                      <Badge className="bg-blue-500 text-white">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Supply Analysis Engine</span>
                      <Badge className="bg-blue-500 text-white">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Investment Opportunity Scanner</span>
                      <Badge className="bg-blue-500 text-white">Online</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-300 mb-4">Market Indicators</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Interest Rate Analysis</span>
                      <Badge className="bg-purple-500 text-white">Tracking</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Economic Growth Metrics</span>
                      <Badge className="bg-purple-500 text-white">Tracking</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Population Demographics</span>
                      <Badge className="bg-purple-500 text-white">Tracking</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Development Projects</span>
                      <Badge className="bg-purple-500 text-white">Tracking</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Action Panel */}
        <section>
          <Card className="bg-gray-950 border-blue-500">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-400">📊 Forecasting Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-500 p-6 h-auto flex flex-col gap-2">
                  <TrendingUp className="w-8 h-8" />
                  <span>Generate Forecast</span>
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-500 p-6 h-auto flex flex-col gap-2">
                  <Target className="w-8 h-8" />
                  <span>Investment Analysis</span>
                </Button>
                <Button className="bg-green-600 hover:bg-green-500 p-6 h-auto flex flex-col gap-2">
                  <BarChart3 className="w-8 h-8" />
                  <span>Market Dashboard</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}