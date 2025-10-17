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
    <div className="space-y-8" data-testid="vaultmesh-about-container">
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20" data-testid="card-vision">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2" data-testid="heading-vision">
            <Globe className="h-8 w-8 text-cyan-500" />
            The Vision: An Indispensable Backbone for a Connected World
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4" data-testid="text-vision-primary">
            VaultMesh™ is envisioned as the indispensable backbone for secure, real-time data synchronization 
            and complex operational orchestration within and across FAA-regulated sectors.
          </p>
          <p className="text-gray-600 dark:text-gray-400" data-testid="text-vision-secondary">
            Its primary goal is to provide a robust, immutable, and universally accessible layer for critical 
            information and distributed processes, fostering trust and efficiency at an unprecedented scale. 
            This is where individual efforts become a collective force.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-6" data-testid="heading-core-capabilities">Core Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreCapabilities.map((capability, index) => (
            <Card key={index} data-testid={`card-capability-${index}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3" data-testid={`heading-capability-${index}`}>
                  <capability.icon className="h-6 w-6 text-cyan-500" />
                  {capability.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4" data-testid={`text-capability-description-${index}`}>
                  {capability.description}
                </p>
                <div className="space-y-2">
                  {capability.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2" data-testid={`feature-${index}-${featureIndex}`}>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6" data-testid="heading-ecosystem">Ecosystem Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ecosystemComponents.map((component, index) => (
            <Card key={index} data-testid={`card-ecosystem-${index}`}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between" data-testid={`heading-ecosystem-${index}`}>
                  <span>{component.name}</span>
                  <Badge variant="outline" className="text-green-600" data-testid={`badge-ecosystem-status-${index}`}>
                    <Activity className="h-3 w-3 mr-1" />
                    {component.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400" data-testid={`text-ecosystem-description-${index}`}>
                  {component.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-2 border-cyan-200 dark:border-cyan-800" data-testid="card-technical-foundation">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2" data-testid="heading-technical-foundation">
            <Database className="h-6 w-6 text-cyan-500" />
            Technical Foundation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div data-testid="section-distributed-architecture">
            <h3 className="font-semibold text-lg mb-2" data-testid="heading-distributed-architecture">Distributed Architecture</h3>
            <p className="text-gray-600 dark:text-gray-400" data-testid="text-distributed-architecture">
              VaultMesh™ utilizes a distributed architecture that ensures high availability, fault tolerance, 
              and scalability across global deployments. Each node operates independently while maintaining 
              synchronization through the Omni Grid™ network.
            </p>
          </div>
          <div data-testid="section-security-protocols">
            <h3 className="font-semibold text-lg mb-2" data-testid="heading-security-protocols">Security Protocols</h3>
            <p className="text-gray-600 dark:text-gray-400" data-testid="text-security-protocols">
              Enterprise-grade security with end-to-end encryption, multi-factor authentication, and continuous 
              security monitoring. All data transfers are protected by military-grade encryption standards.
            </p>
          </div>
          <div data-testid="section-compliance">
            <h3 className="font-semibold text-lg mb-2" data-testid="heading-compliance">Compliance & Governance</h3>
            <p className="text-gray-600 dark:text-gray-400" data-testid="text-compliance">
              Built-in compliance monitoring for GDPR, POPIA, and industry-specific regulations. Automated 
              audit trails and immutable record-keeping ensure complete transparency and accountability.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
