import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Clock, BarChart3, Eye, Shield, 
  Users, Calculator, DownloadCloud, Building, Folder
} from "lucide-react";

const payrollFeatures = [
  {
    id: "P-006",
    name: "Payslip Engine",
    icon: <FileText className="w-6 h-6" />,
    description: "Auto-generates monthly payslips, tax summaries, ledger-linked exports, and QR documentation. Zero human input required.",
    assetType: "Atom-Level™ Contract Object Generator",
    functions: [
      "Auto-generates monthly payslips",
      "Tax summaries with QR-based documentation", 
      "Enables ledger-linked exports",
      "Requires zero human input"
    ]
  },
  {
    id: "P-001", 
    name: "ShiftSync Grid",
    icon: <Clock className="w-6 h-6" />,
    description: "Real-time shift logging, drift detection, overload warnings, integrated with team sync and approval chains.",
    assetType: "Temporal Ledger Validator™",
    functions: [
      "Real-time shift logging",
      "Detects time drift, shift overloads",
      "Integrates approval chains",
      "Team sync mechanisms"
    ]
  },
  {
    id: "P-002, P-007",
    name: "CTC Tracker AI", 
    icon: <Calculator className="w-6 h-6" />,
    description: "Validates compensation packages against role logic, bonus schemas, and industry pay bands with real-time compliance overlays.",
    assetType: "Inline Risk Comparator™",
    functions: [
      "Validates compensation packages",
      "Role logic matching",
      "Bonus schemas verification",
      "Industry pay bands comparison",
      "Real-time compliance overlays"
    ]
  },
  {
    id: "P-004, P-005",
    name: "Drift + Ghost Detection",
    icon: <Eye className="w-6 h-6" />,
    description: "Detects ghost shifts, under-hour activity, and policy bypass patterns using advanced fraud detection algorithms.",
    assetType: "GhostFlag Mesh Detector™", 
    functions: [
      "Ghost shifts detection",
      "Under-hour activity monitoring",
      "Policy bypass pattern recognition",
      "Advanced fraud detection"
    ]
  },
  {
    id: "Vault Echo Logs",
    name: "VaultMesh Sync",
    icon: <Shield className="w-6 h-6" />,
    description: "Enforces immutable scroll logs, runs 9-second Scroll ID validation cycles, and binds session events to contractual evidence.",
    assetType: "Vault Validation Kernel™",
    tracePath: "/vault/echo/logs/ctc-weekly.json",
    functions: [
      "Enforces immutable scroll logs",
      "9-second Scroll ID validation cycles",
      "Binds session events to contracts",
      "Contractual evidence binding"
    ]
  },
  {
    id: "P-008",
    name: "Brand Bind Scrolls",
    icon: <Building className="w-6 h-6" />,
    description: "Connects staff roles, cost centers, performance tiers, and FAA Contract Clauses through brand mesh technology.",
    assetType: "Role-Bound Brand Mesh™",
    functions: [
      "Staff roles connection",
      "Cost centers integration", 
      "Performance tiers mapping",
      "FAA Contract Clauses binding"
    ]
  },
  {
    id: "ScrollChain",
    name: "Role-to-Pay Real-Time Analyzer",
    icon: <BarChart3 className="w-6 h-6" />,
    description: "Analyzes job titles to provide GPA-to-Shift alignment, bonus history validation, and dynamic comp grid checks.",
    assetType: "ScrollChain Analyzer™",
    backedBy: "CTC Tracker GPT",
    functions: [
      "Job Title input analysis",
      "GPA-to-Shift alignment",
      "Bonus history validation", 
      "Dynamic comp grid checks"
    ]
  },
  {
    id: "Vault Access",
    name: "Vault Entry Logs Access",
    icon: <Folder className="w-6 h-6" />,
    description: "Provides access to CTC audit trails, team scroll history, and contract evidence logs with vault-level security.",
    assetType: "Vault Access Controller™",
    traceFiles: ["/vault/ctc-report.json", "/vault/scrolls/payroll/"],
    functions: [
      "CTC audit trails access",
      "Team scroll history",
      "Contract evidence logs",
      "Vault-level security"
    ]
  },
  {
    id: "Org Matrix",
    name: "Org Role Matrix",
    icon: <Users className="w-6 h-6" />,
    description: "Visual map of departments, GPA clusters, latency-prone payroll nodes, and pay grade calibrations.",
    assetType: "Organizational Mapper™",
    targetAnalyzer: "FAA Shift Balancer AI",
    functions: [
      "Departments visual mapping",
      "GPA clusters analysis",
      "Latency-prone payroll nodes",
      "Pay grade calibrations"
    ]
  },
  {
    id: "Export Engine",
    name: "Exportable Reports",
    icon: <DownloadCloud className="w-6 h-6" />,
    description: "Download CTC Vault Reports, Weekly Shift & Risk Logs in multiple formats including JSON and PDF.",
    assetType: "Report Generation Engine™",
    files: ["/vault/ctc-report.json", "/vault/echo/logs/ctc-weekly.json"],
    functions: [
      "CTC Vault Reports (JSON/PDF)",
      "Weekly Shift & Risk Logs",
      "Multiple export formats",
      "Automated report generation"
    ]
  }
];

const functionalGroups = [
  {
    name: "Payroll Automation",
    features: ["Payslip Engine", "ShiftSync Grid", "CTC Tracker AI"],
    color: "bg-blue-50 border-blue-200"
  },
  {
    name: "Fraud & Risk Intelligence", 
    features: ["Drift Detection", "GhostFlag Mesh", "VaultMesh Sync"],
    color: "bg-red-50 border-red-200"
  },
  {
    name: "Organizational Insights",
    features: ["Role-to-Pay Analyzer", "Brand Bind Scrolls", "Org Matrix"],
    color: "bg-green-50 border-green-200"
  },
  {
    name: "Export & Verification",
    features: ["Vault Logs Access", "Downloadable Audit Reports"],
    color: "bg-purple-50 border-purple-200"
  }
];

export default function PayrollFeatures() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🧬 FAA™ Payroll OS — Feature Matrix</h1>
        <p className="text-gray-600">Sovereign payroll grid with VaultMesh™ integration and zero-human automation</p>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="bg-green-100 px-3 py-1 rounded">
            <span className="text-green-800 font-semibold">✅ VaultMesh™ Active</span>
          </div>
          <div className="bg-blue-100 px-3 py-1 rounded">
            <span className="text-blue-800 font-semibold">🔄 9s Validation Cycle</span>
          </div>
          <div className="bg-purple-100 px-3 py-1 rounded">
            <span className="text-purple-800 font-semibold">🛡️ Sovereign Grid</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {payrollFeatures.map((feature, idx) => (
          <Card key={idx} className="shadow-lg border-2 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-green-600">
                  {feature.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-900" data-testid={`feature-${feature.name}`}>
                  {feature.name}
                </h2>
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Scroll ID and Asset Type */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="text-xs">
                  <span className="font-semibold text-gray-600">Scroll ID:</span>
                  <span className="ml-2 font-mono text-blue-600">{feature.id}</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-gray-600">Asset Type:</span>
                  <span className="ml-2 text-purple-600">{feature.assetType}</span>
                </div>
                {feature.tracePath && (
                  <div className="text-xs">
                    <span className="font-semibold text-gray-600">Trace Path:</span>
                    <span className="ml-2 font-mono text-green-600">{feature.tracePath}</span>
                  </div>
                )}
                {feature.backedBy && (
                  <div className="text-xs">
                    <span className="font-semibold text-gray-600">Backed by:</span>
                    <span className="ml-2 text-indigo-600">{feature.backedBy}</span>
                  </div>
                )}
                {feature.targetAnalyzer && (
                  <div className="text-xs">
                    <span className="font-semibold text-gray-600">Target Analyzer:</span>
                    <span className="ml-2 text-indigo-600">{feature.targetAnalyzer}</span>
                  </div>
                )}
              </div>

              {/* Functions */}
              <div>
                <h4 className="font-semibold text-sm mb-2 text-gray-700">🛠️ Functions:</h4>
                <div className="space-y-1">
                  {feature.functions.map((func, i) => (
                    <div key={i} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>{func}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trace Files */}
              {feature.traceFiles && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-gray-700">📁 Trace Files:</h4>
                  <div className="space-y-1">
                    {feature.traceFiles.map((file, i) => (
                      <div key={i} className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Export Files */}
              {feature.files && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-gray-700">📄 Export Files:</h4>
                  <div className="space-y-1">
                    {feature.files.map((file, i) => (
                      <div key={i} className="text-xs font-mono text-green-600 bg-green-50 px-2 py-1 rounded">
                        {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs" 
                  data-testid={`button-view-logs-${feature.name}`}
                >
                  📊 View Logs
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-xs"
                  data-testid={`button-download-${feature.name}`}
                >
                  💾 Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Functional Grouping Overview */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Functional Grouping Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {functionalGroups.map((group, idx) => (
            <Card key={idx} className={`border-2 ${group.color}`}>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3 text-gray-800">{group.name}</h3>
                <div className="space-y-2">
                  {group.features.map((feature, i) => (
                    <Badge key={i} variant="secondary" className="text-xs block w-fit">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📦 Export Options</h2>
        <p className="text-gray-600 mb-4">
          Ready for deployment in multiple formats supporting FAA CMS, VaultMesh React Components, and sovereign grid integration.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-green-600 hover:bg-green-700">
            🧩 FAA CMS Integration
          </Button>
          <Button variant="outline">
            📄 CSV/JSON Export
          </Button>
          <Button variant="outline">
            🗺️ Sitemap XML
          </Button>
          <Button variant="outline">
            🎨 Tailwind Preview
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>FAA™ Payroll OS • VaultMesh™ Certified • Sovereign Economic Grid Technology</p>
        <p className="mt-1">All features verified via 9-second validation cycles • Zero-human automation active</p>
      </div>
    </div>
  );
}