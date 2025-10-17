import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Cpu, Network, Zap, Atom } from "lucide-react"

export default function FAAQuantumNexusPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="faa-quantum-nexus-page">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-2 border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Atom className="h-8 w-8 text-white" data-testid="icon-quantum" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">FAA.ZONE™ Quantum Nexus</CardTitle>
            <CardDescription className="text-lg">
              Next-generation quantum computing infrastructure for the FAA.ZONE ecosystem
            </CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="outline" className="border-blue-500 text-blue-400">Quantum Computing</Badge>
              <Badge variant="outline" className="border-purple-500 text-purple-400">Advanced AI</Badge>
              <Badge variant="outline" className="border-cyan-500 text-cyan-400">Research Phase</Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Qubits", value: "1,024", icon: Atom },
            { title: "Processing Power", value: "10^15 ops/s", icon: Cpu },
            { title: "Network Nodes", value: "256", icon: Network },
            { title: "Quantum Speed", value: "1000x", icon: Zap }
          ].map((spec, index) => {
            const IconComponent = spec.icon
            return (
              <Card key={index} data-testid={`spec-card-${index}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardDescription>{spec.title}</CardDescription>
                    <IconComponent className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold">{spec.value}</div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card data-testid="capability-card-optimization">
            <CardHeader>
              <Cpu className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Quantum Optimization</CardTitle>
              <CardDescription>
                Advanced optimization algorithms for complex ecosystem problems
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="capability-card-encryption">
            <CardHeader>
              <Network className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle>Quantum Encryption</CardTitle>
              <CardDescription>
                Unbreakable quantum encryption for VaultMesh™ security
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="capability-card-ai">
            <CardHeader>
              <Zap className="h-8 w-8 text-cyan-500 mb-2" />
              <CardTitle>Quantum AI</CardTitle>
              <CardDescription>
                Next-gen AI powered by quantum computing capabilities
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Atom className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Quantum Research Initiative</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              FAA.ZONE Quantum Nexus is our research initiative exploring quantum computing applications for ecosystem optimization, security, and AI advancement.
            </p>
            <Button className="mt-6 bg-blue-500 hover:bg-blue-600" data-testid="button-research">
              Learn About Research
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
