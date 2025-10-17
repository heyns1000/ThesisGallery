import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Globe, Zap, Database, Users, Activity, Cpu, Network, Cloud, Lock, CheckCircle } from "lucide-react"

export function VaultMeshAbout() {
  const coreCapabilities = [
    {
      title: "Decentralized Data Integrity",
      description: "Ensures immutable and tamper-proof data records through distributed ledger technologies",
      icon: Shield,
      features: ["Blockchain-based verification", "Cryptographic hashing", "Distributed consensus"]
    },
    {
      title: "Secure Data Orchestration", 
      description: "Manages and secures the flow of sensitive data across disparate systems and protocols",
      icon: Lock,
      features: ["End-to-end encryption", "Zero-trust architecture", "Compliance monitoring"]
    },
    {
      title: "Cross-Protocol Interoperability",
      description: "Facilitates seamless communication and data exchange between different industry standards",
      icon: Network,
      features: ["API gateway management", "Protocol translation", "Legacy system integration"]
    },
    {
      title: "Real-time Synchronization",
      description: "Provides instant data synchronization across all connected systems and platforms",
      icon: Zap,
      features: ["Event-driven architecture", "Streaming data pipelines", "Low-latency processing"]
    }
  ]

  const ecosystemComponents = [
    { name: "Omni Grid™", description: "Distributed network layer for real-time synchronization", status: "Active" },
    { name: "BuildNest™", description: "Enterprise solutions platform built on VaultMesh™", status: "Active" },
    { name: "SecureSign™", description: "Digital trust and verifiable identity solutions", status: "Active" },
    { name: "Seedwave™", description: "Administrative and analytics portal for deployments", status: "Active" },
    { name: "Baobab Archive™", description: "Compliance and immutable record-keeping solution", status: "Active" }
  ]

  return (
    <div className="space-y-8">
      {/* Vision Section */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Globe className="h-8 w-8 text-cyan-500" />
            The Vision: An Indispensable Backbone for a Connected World
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            VaultMesh™ is envisioned as the indispensable backbone for secure, real-time data synchronization 
            and complex operational orchestration within and across FAA-regulated sectors.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Its primary goal is to provide a robust, immutable, and universally accessible layer for critical 
            information and distributed processes, fostering trust and efficiency at an unprecedented scale. 
            This is where individual efforts become a collective force.
          </p>
        </CardContent>
      </Card>

      {/* Core Capabilities */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Core Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreCapabilities.map((capability, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <capability.icon className="h-6 w-6 text-cyan-500" />
                  {capability.title}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">{capability.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {capability.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ecosystem Components */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Ecosystem Components</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ecosystemComponents.map((component, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{component.name}</h3>
                    <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                      {component.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{component.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Architecture Principles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-6 w-6 text-cyan-500" />
            Architecture Principles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Database className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Distributed by Design</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No single point of failure with distributed architecture across multiple regions and providers
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Security First</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Zero-trust security model with end-to-end encryption and regulatory compliance built-in
              </p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Collaborative</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Designed for multi-stakeholder environments with role-based access and permissions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Performance Metrics</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Maximum Throughput:</span>
                  <span className="font-medium">100,000 TPS</span>
                </li>
                <li className="flex justify-between">
                  <span>Average Latency:</span>
                  <span className="font-medium">&lt; 50ms</span>
                </li>
                <li className="flex justify-between">
                  <span>Data Availability:</span>
                  <span className="font-medium">99.99%</span>
                </li>
                <li className="flex justify-between">
                  <span>Recovery Time:</span>
                  <span className="font-medium">&lt; 1 minute</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Compliance Standards</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  SOC 2 Type II Certified
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  GDPR Compliant
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  HIPAA Ready
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  ISO 27001 Aligned
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}