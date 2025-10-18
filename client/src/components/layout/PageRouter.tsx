import PortalHome from "@/pages/portal-home"
import BrandsPage from "@/pages/brands"
import SectorsPage from "@/pages/sectors"
import AnalyticsPage from "@/pages/analytics"
import SettingsPage from "@/pages/settings"
import SamFoxCreativeStudio from "@/pages/samfox-creative-studio"
import FAAQuantumNexus from "@/pages/faa-quantum-nexus"
import FruitfulBusinessPlan from "@/pages/fruitful-business-plan"
import ChatGPTIntegration from "@/pages/chatgpt-integration"
import FAAIntakeChecklist from "@/pages/faa-intake-checklist"
import OmniuniversalButtonValidator from "@/pages/omniuniversal-button-validator"
import FruitfulMarketplaceMarketing from "@/pages/fruitful-marketplace-marketing"
import BanimalIntegration from "@/pages/banimal-integration"
import MotionMediaSonic from "@/pages/motion-media-sonic"
import OmnilevelInterstellar from "@/pages/omnilevel-interstellar"
import PlanetChange from "@/pages/planet-change"
import OmnilevelPage from "@/pages/omnilevel"
import OmniGridFAAZonePage from "@/pages/omnigrid-faa-zone"
import SectorMapping from "@/pages/sector-mapping"
import Compliance from "@/pages/compliance"
import FruitfulCrateDance from "@/pages/fruitful-crate-dance"
import IntegrationsDashboard from "@/pages/integrations-dashboard"

// Stub pages for sections not yet implemented
function SecureSignPage() {
  return (
    <div className="p-8" data-testid="page-secure-sign">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-secure-sign">SecureSign™ VIP</h1>
      <p className="text-muted-foreground" data-testid="text-description">Legal Portal - Coming soon</p>
    </div>
  )
}

function BrandIdentityManagerPage() {
  return (
    <div className="p-8" data-testid="page-brand-identity-manager">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-brand-identity-manager">Brand Identity Manager</h1>
      <p className="text-muted-foreground" data-testid="text-description">6,005 Individual Sites - Coming soon</p>
    </div>
  )
}

function GlobalDashboardPage() {
  return (
    <div className="p-8" data-testid="page-global-dashboard">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-global-dashboard">📊 Global Dashboard</h1>
      <p className="text-muted-foreground" data-testid="text-description">Live Analytics - Coming soon</p>
    </div>
  )
}

function EcosystemExplorerPage() {
  return (
    <div className="p-8" data-testid="page-ecosystem-explorer">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-ecosystem-explorer">🌐 Ecosystem Explorer</h1>
      <p className="text-muted-foreground" data-testid="text-description">45 Sectors - Coming soon</p>
    </div>
  )
}

function GlobalPulsePage() {
  return (
    <div className="p-8" data-testid="page-global-pulse">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-global-pulse">Global Pulse</h1>
      <p className="text-muted-foreground" data-testid="text-description">Analytics - Coming soon</p>
    </div>
  )
}

function SeedwaveAdminPage() {
  return (
    <div className="p-8" data-testid="page-seedwave-admin">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-seedwave-admin">🦁 Seedwave™ Admin</h1>
      <p className="text-muted-foreground" data-testid="text-description">1,967 Brands - Coming soon</p>
    </div>
  )
}

function VaultMeshDashboardPage() {
  return (
    <div className="p-8" data-testid="page-vaultmesh-dashboard">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-vaultmesh-dashboard">🌐 VaultMesh™ Dashboard</h1>
      <p className="text-muted-foreground" data-testid="text-description">Infrastructure - Coming soon</p>
    </div>
  )
}

function VaultMeshAboutPage() {
  return (
    <div className="p-8" data-testid="page-vaultmesh-about">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-vaultmesh-about">ℹ️ About VaultMesh™</h1>
      <p className="text-muted-foreground" data-testid="text-description">Core Info - Coming soon</p>
    </div>
  )
}

function VaultMeshProductsPage() {
  return (
    <div className="p-8" data-testid="page-vaultmesh-products">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-vaultmesh-products">📦 VaultMesh™ Products</h1>
      <p className="text-muted-foreground" data-testid="text-description">8 Solutions - Coming soon</p>
    </div>
  )
}

function VaultMeshBrandsPage() {
  return (
    <div className="p-8" data-testid="page-vaultmesh-brands">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-vaultmesh-brands">🎯 Brand Packages</h1>
      <p className="text-muted-foreground" data-testid="text-description">610 Brands - Coming soon</p>
    </div>
  )
}

function VaultMeshCheckoutPage() {
  return (
    <div className="p-8" data-testid="page-vaultmesh-checkout">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-vaultmesh-checkout">🔐 VaultMesh™ Checkout</h1>
      <p className="text-muted-foreground" data-testid="text-description">Enterprise - Coming soon</p>
    </div>
  )
}

function PayPalEcosystemPage() {
  return (
    <div className="p-8" data-testid="page-paypal-ecosystem">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-paypal-ecosystem">💳 PayPal Ecosystem</h1>
      <p className="text-muted-foreground" data-testid="text-description">548 Containers - Coming soon</p>
    </div>
  )
}

function FruitfulSmartToysPage() {
  return (
    <div className="p-8" data-testid="page-fruitful-smart-toys">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-fruitful-smart-toys">🧸 Fruitful Smart Toys™</h1>
      <p className="text-muted-foreground" data-testid="text-description">5 Products - Coming soon</p>
    </div>
  )
}

function HotStackCodeNestPage() {
  return (
    <div className="p-8" data-testid="page-hotstack-codenest">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-hotstack-codenest">🔥 HotStack + CodeNest</h1>
      <p className="text-muted-foreground" data-testid="text-description">Independent Repos - Coming soon</p>
    </div>
  )
}

function RepositoryHubPage() {
  return (
    <div className="p-8" data-testid="page-repository-hub">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-repository-hub">🗃️ Repository Hub</h1>
      <p className="text-muted-foreground" data-testid="text-description">GitHub Integration - Coming soon</p>
    </div>
  )
}

function SectorOnboardingPage() {
  return (
    <div className="p-8" data-testid="page-sector-onboarding">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-sector-onboarding">🚀 Sector Onboarding</h1>
      <p className="text-muted-foreground" data-testid="text-description">Guided Flow - Coming soon</p>
    </div>
  )
}

function SectorRelationshipMappingPage() {
  return (
    <div className="p-8" data-testid="page-sector-relationship-mapping">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-sector-relationship-mapping">🔗 Interactive Sector Mapping</h1>
      <p className="text-muted-foreground" data-testid="text-description">Network Graph - Coming soon</p>
    </div>
  )
}

function InternPortalNestPage() {
  return (
    <div className="p-8" data-testid="page-intern-portalnest">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-intern-portalnest">🎓 PortalNest™ Interns</h1>
      <p className="text-muted-foreground" data-testid="text-description">AI Tracking - Coming soon</p>
    </div>
  )
}

function BaobabSecurityNetworkPage() {
  return (
    <div className="p-8" data-testid="page-baobab-security-network">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-baobab-security-network">🌳 Baobab Security Network™</h1>
      <p className="text-muted-foreground" data-testid="text-description">Environmental AI - Coming soon</p>
    </div>
  )
}

function LegalHubPage() {
  return (
    <div className="p-8" data-testid="page-legal-hub">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-legal-hub">📋 Legal Documentation Hub</h1>
      <p className="text-muted-foreground" data-testid="text-description">9 Documents - Coming soon</p>
    </div>
  )
}

function APIKeysPage() {
  return (
    <div className="p-8" data-testid="page-api-keys">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-api-keys">🔑 API Key Manager</h1>
      <p className="text-muted-foreground" data-testid="text-description">8 Keys - Coming soon</p>
    </div>
  )
}

function PaymentHubPage() {
  return (
    <div className="p-8" data-testid="page-payment-hub">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-payment-hub">Payment Portal</h1>
      <p className="text-muted-foreground" data-testid="text-description">SSO - Coming soon</p>
    </div>
  )
}

function InternsPage() {
  return (
    <div className="p-8" data-testid="page-interns">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-interns">👨‍🎓 Interns</h1>
      <p className="text-muted-foreground" data-testid="text-description">Coming soon - Full implementation in progress</p>
    </div>
  )
}

function BuildNestDashboardPage() {
  return (
    <div className="p-8" data-testid="page-buildnest-dashboard">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-buildnest-dashboard">🏗️ BuildNest Dashboard</h1>
      <p className="text-muted-foreground" data-testid="text-description">Live Metrics - Coming soon</p>
    </div>
  )
}

interface PageRouterProps {
  activePage: string
}

export function PageRouter({ activePage }: PageRouterProps) {
  console.log("📄 PageRouter called with activePage:", activePage);
  
  switch (activePage) {
    // Main Navigation
    case "home":
      return <PortalHome />
    case "fruitful-crate-dance":
      return <FruitfulCrateDance />
    case "secure-sign":
      return <SecureSignPage />
    case "brand-identity-manager":
      return <BrandIdentityManagerPage />
    case "brands":
      return <BrandsPage />
    case "sectors":
      return <SectorsPage />
    case "marketplace":
      return <PortalHome />
    case "analytics":
      return <AnalyticsPage />
    case "integrations":
      return <IntegrationsDashboard />
    case "settings":
      return <SettingsPage />
    
    // Main Sections
    case "global-dashboard":
      return <GlobalDashboardPage />
    case "ecosystem-explorer":
      return <EcosystemExplorerPage />
    case "global-pulse":
      return <GlobalPulsePage />
    case "seedwave-admin":
      return <SeedwaveAdminPage />
    
    // VaultMesh Core
    case "vaultmesh-dashboard":
      return <VaultMeshDashboardPage />
    case "vaultmesh-about":
      return <VaultMeshAboutPage />
    case "vaultmesh-products":
      return <VaultMeshProductsPage />
    case "vaultmesh-brands":
      return <VaultMeshBrandsPage />
    case "vaultmesh-checkout":
      return <VaultMeshCheckoutPage />
    case "paypal-ecosystem":
      return <PayPalEcosystemPage />
    
    // Ecosystem Projects
    case "faa-quantum-nexus":
      return <FAAQuantumNexus />
    case "fruitful-business-plan":
      return <FruitfulBusinessPlan />
    case "samfox-creative-studio":
      return <SamFoxCreativeStudio />
    case "chatgpt-integration":
      return <ChatGPTIntegration />
    case "faa-intake-checklist":
      return <FAAIntakeChecklist />
    case "omniuniversal-button-validator":
      return <OmniuniversalButtonValidator />
    case "fruitful-marketplace-marketing":
      return <FruitfulMarketplaceMarketing />
    case "fruitful-smart-toys":
      return <FruitfulSmartToysPage />
    case "hotstack-codenest":
      return <HotStackCodeNestPage />
    case "repository-hub":
      return <RepositoryHubPage />
    case "sector-onboarding":
      return <SectorOnboardingPage />
    case "sector-mapping":
      return <SectorMapping />
    case "sector-relationship-mapping":
      return <SectorRelationshipMappingPage />
    case "planet-change":
      return <PlanetChange />
    case "omnilevel":
      return <OmnilevelPage />
    case "omnigrid-faa-zone":
      return <OmniGridFAAZonePage />
    case "buildnest-dashboard":
      return <BuildNestDashboardPage />
    case "intern-portalnest":
      return <InternPortalNestPage />
    case "banimal-integration":
      return <BanimalIntegration />
    case "motion-media-sonic":
      return <MotionMediaSonic />
    case "omnilevel-interstellar":
      return <OmnilevelInterstellar />
    case "baobab-security-network":
      return <BaobabSecurityNetworkPage />
    case "legal-hub":
      return <LegalHubPage />
    case "api-keys":
      return <APIKeysPage />
    case "payment-hub":
      return <PaymentHubPage />
    
    // Admin Portals
    case "interns":
      return <InternsPage />
    case "compliance":
      return <Compliance />
    
    default:
      console.log("⚠️ No route found for activePage:", activePage);
      return <PortalHome />
  }
}
