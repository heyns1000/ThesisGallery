import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FruitfulAmerica() {
  const states = [
    {
      id: "alabama",
      name: "FAA Alabama Pride™",
      governor: "Kay Ivey",
      population: "5,024,279",
      revenue: "$22.9B",
      randIndex: "87%",
      products: ["Cotton Apparel", "Steel Housing Frames"],
      businessPlan: "Comprehensive local manufacturing and sourcing."
    },
    {
      id: "alaska", 
      name: "FAA Alaska Grit™",
      governor: "Mike Dunleavy",
      population: "731,545", 
      revenue: "$15.1B",
      randIndex: "81%",
      products: ["Wild Salmon Packaging", "Insulated Arctic Wear"],
      businessPlan: "Eco-conscious resource extraction and resilience tooling."
    },
    {
      id: "arizona",
      name: "FAA Arizona SolarCore™", 
      governor: "Katie Hobbs",
      population: "7,151,502",
      revenue: "$42.3B", 
      randIndex: "90%",
      products: ["Solar Roofing Kits", "Desert Survival Modulars"],
      businessPlan: "Harnessing sun-tech innovation and modular hardware for extreme climates."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-indigo-500 text-white">
      {/* Header */}
      <header className="bg-indigo-900 py-8 shadow-2xl">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold tracking-wide text-center">
            🇺🇸 Fruitful.America™ Dashboard
          </h1>
          <p className="text-xl text-center mt-4">
            50 Brands. 50 States. Zero Outsourcing. Water The Seed™.
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="bg-black bg-opacity-50 py-12 mx-6 rounded-xl">
          <h2 className="text-4xl font-extrabold drop-shadow-lg mb-4">
            Made in Your State. Used in Your State.
          </h2>
          <p className="text-xl drop-shadow-lg">
            Rebuilding the U.S. Economy One State at a Time – From Soil to Software
          </p>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="bg-white text-indigo-900 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">
            🇺🇸 The New American Renaissance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">✨ What is Fruitful.America™?</h3>
              <p className="mb-4">
                A 50-state economic system powered by the FAA Quantum Nexus™. Each state receives its own brand, 
                built around its history, strengths, culture, and capacity.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>💯 Locally sourced</li>
                <li>🏭 Locally manufactured</li>
                <li>🛒 Sold in-state first</li>
                <li>💸 Profits recycled into the local economy</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">🧬 The FAA Quantum Nexus™</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>🧱 50 Custom Brand Pages per state</li>
                <li>⚛️ Rand Index™ Atom-Level Score measuring true growth</li>
                <li>🏛️ Business plans, revenue, governors recorded per state</li>
                <li>🖥️ Anthem-powered homepage with American flag visuals</li>
                <li>🔧 Every item sourced within the same state</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* State Metrics Dashboard */}
      <section className="container mx-auto px-6 py-16">
        <h3 className="text-4xl font-bold mb-12 text-center">State Metrics Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {states.map((state) => (
            <Card key={state.id} className="bg-white text-indigo-900 hover:scale-105 transform transition duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{state.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Governor:</strong> {state.governor}</div>
                  <div><strong>Population:</strong> {state.population}</div>
                  <div><strong>Revenue:</strong> {state.revenue}</div>
                  <div><strong>Rand Index:</strong> 
                    <Badge className="ml-2 bg-green-100 text-green-800">{state.randIndex}</Badge>
                  </div>
                </div>
                <div>
                  <strong>Signature Products:</strong>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {state.products.map((product, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <strong>Business Plan:</strong>
                  <p className="text-sm mt-1">{state.businessPlan}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 py-8">
        <div className="container mx-auto text-center">
          <p className="text-xl font-semibold">Made In-State. Built By Locals.</p>
          <p className="mt-2">
            All FAA products for each state are 100% sourced, produced, and used within state borders. 
            Powered by <em>Water The Seed™</em> protocol.
          </p>
          <p className="text-sm mt-4">
            © 2025 Fruitful.America™ | FAA Quantum Nexus™ | All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}