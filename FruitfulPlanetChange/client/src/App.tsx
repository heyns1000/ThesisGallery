import { Switch, Route } from "wouter"
import { queryClient } from "./lib/queryClient"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/ui/theme-provider"
import InternPortalNestPage from "@/pages/intern-portalnest"
import BanimalIntegrationPage from "@/pages/banimal-integration"
import MotionMediaSonic from "@/pages/motion-media-sonic"
import OmnilevelInterstellar from "@/pages/omnilevel-interstellar"
import { Sidebar } from "@/components/portal/sidebar"
import { GlobalPulse } from "@/components/portal/global-pulse"
import { SeedwaveAdmin } from "@/components/portal/seedwave-admin"
import EcosystemExplorer from "@/components/portal/ecosystem-explorer"
import { LegalHub } from "@/components/portal/legal-hub"
import { LegalDocumentation } from "@/components/portal/legal-documentation"
import { APIKeyManager } from "@/components/portal/api-key-manager"
import { PaymentHub } from "@/components/portal/payment-hub"
import { VaultMeshCheckout } from "@/components/portal/vaultmesh-checkout"
import { FruitfulMarketplace } from "@/components/portal/fruitful-marketplace"
import { AuthenticMarketplace } from "@/components/portal/authentic-marketplace"
import { RealPricingMarketplace } from "@/components/portal/real-pricing-marketplace"
import { CompleteSectorListing } from "@/components/portal/complete-sector-listing"
import { IntegrationsDashboard } from "@/components/portal/integrations-dashboard"
import { HotStackCodeNest } from "@/components/portal/hotstack-codenest"
import { RepositoryHub } from "@/components/portal/repository-hub"
import { SectorOnboardingFlow } from "@/components/portal/sector-onboarding-flow"
import { SectorNavigationCards } from "@/components/portal/sector-navigation-cards"
import { SectorRelationshipMapping } from "@/components/portal/sector-relationship-mapping"
import { BrandIdentityManager } from "@/components/portal/brand-identity-manager"
import { GlobalDashboard } from "@/components/portal/global-dashboard"
import { FruitfulSmartToys } from "@/components/portal/fruitful-smart-toys"
import { BaobabSecurityNetwork } from "@/components/portal/baobab-security-network"
import BuildNestDashboardPage from "@/pages/buildnest-dashboard"
import PortalHome from "@/pages/portal-home"
import BrandsPage from "@/pages/brands"
import SectorsPage from "@/pages/sectors"
import NotFound from "@/pages/not-found"
import { FruitfulCrateDancePage } from "@/pages/fruitful-crate-dance"
import { SecureSign } from "@/components/portal/secure-sign"
import VaultMeshPage from "@/pages/vaultmesh"
import { OmnilevelPage } from "@/pages/omnilevel"
import { OmniGridFAAZonePage } from "@/pages/omnigrid-faa-zone"
import SamFoxCreativeStudio from "@/pages/samfox-creative-studio"
import SamFoxPortfolioPage from "@/pages/samfox-portfolio"
import FAAQuantumNexus from "@/pages/faa-quantum-nexus"
import FruitfulBusinessPlan from "@/pages/fruitful-business-plan"
import FruitfulMarketplaceMarketing from "@/pages/fruitful-marketplace-marketing"
import ChatGPTIntegration from "@/pages/chatgpt-integration"
import FAAIntakeChecklist from "@/pages/faa-intake-checklist"
import OmniuniversalButtonValidator from "@/pages/omniuniversal-button-validator"
import ClaimRootCheckoutPage from "@/pages/claimroot-checkout"
import ButtonRepairDashboard from "@/pages/button-repair-dashboard"
import Landing from "@/pages/landing"
import SectorDashboard from "@/pages/sector-dashboard"
import SectorIndividualPage from "@/pages/sector-individual"
import { GlobalSyncIndicator } from "@/components/global-sync-indicator"
import { PayPalEcosystemManager } from '@/components/PayPalEcosystemManager'
import SectorList from "@/pages/sector-list"
import SettingsPage from "@/pages/settings"
import AnalyticsPage from "@/pages/analytics"
import SectorMapping from "@/pages/sector-mapping"
import PlanetChange from "@/pages/planet-change"
import { EcosystemCoordinator } from "@/pages/ecosystem-coordinator"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"
import { GlobalFooter } from "@/components/ui/global-footer"
import { ScrollBreathGlyphs, useScrollBreathGlyphs } from "@/components/animations/ScrollBreathGlyphs"

// Page router component that renders content based on active page
function PageRouter({ activePage }: { activePage: string }) {
  console.log("📄 PageRouter called with activePage:", activePage);
  switch (activePage) {
    case "home":
    case "marketplace":
      console.log("🏠 Returning PortalHome component");
      return <PortalHome />
    case "analytics":
      return (
        <div className="p-8">
          <AnalyticsPage />
        </div>
      )
    case "settings":
      return (
        <div className="p-8">
          <SettingsPage />
        </div>
      )
    case "integrations":
      return (
        <div className="p-8">
          <IntegrationsDashboard />
        </div>
      )
    case "brands":
      return (
        <div className="p-8">
          <BrandsPage />
        </div>
      )
    case "sectors":
      return (
        <div className="p-8">
          <SectorList />
        </div>
      )
    case "global-pulse":
      return (
        <div className="p-8">
          <GlobalPulse />
        </div>
      )
    case "seedwave-admin":
      return (
        <div className="p-8">
          <SeedwaveAdmin />
        </div>
      )

    case "global-dashboard":
      return (
        <div className="p-8">
          <GlobalDashboard />
        </div>
      )
    case "ecosystem-explorer":
      return (
        <div className="p-8">
          <EcosystemExplorer />
        </div>
      )
    case "legal-hub":
      return <LegalDocumentation />
    case "api-keys":
      return <APIKeyManager />
    case "fruitful-marketplace":
      return (
        <div className="p-8">
          <RealPricingMarketplace />
        </div>
      )
    case "complete-sectors":
      return (
        <div className="p-8">
          <CompleteSectorListing />
        </div>
      )
    case "hotstack-codenest":
      return (
        <div className="p-8">
          <HotStackCodeNest />
        </div>
      )
    case "repository-hub":
      return (
        <div className="p-8">
          <RepositoryHub />
        </div>
      )
    case "sector-onboarding":
      return (
        <div className="p-8">
          <SectorOnboardingFlow />
        </div>
      )
    case "sector-dashboard-access":
      return (
        <div className="p-8">
          <SectorsPage />
        </div>
      )
    case "brand-identity-manager":
      return (
        <div className="p-8">
          <BrandIdentityManager />
        </div>
      )
    case "sector-mapping":
      return (
        <div className="p-8">
          <SectorMapping />
        </div>
      )
    case "sector-relationship-mapping":
      return (
        <div className="p-8">
          <SectorRelationshipMapping />
        </div>
      )
    case "planet-change":
      return <PlanetChange />
    case "fruitful-crate-dance":
      return (
        <div className="p-8">
          <FruitfulCrateDancePage />
        </div>
      )
    case "secure-sign":
      return (
        <div className="p-8">
          <SecureSign />
        </div>
      )
    case "payment-hub":
      return (
        <div className="p-8">
          <PaymentHub />
        </div>
      )
    case "vaultmesh-dashboard":
    case "vaultmesh-about":
    case "vaultmesh-products":
    case "vaultmesh-brands":
      return <VaultMeshPage />
    case "vaultmesh-checkout":
      return (
        <div className="p-8">
          <VaultMeshCheckout />
        </div>
      )
    case "paypal-ecosystem":
      return (
        <div className="p-8">
          <PayPalEcosystemManager />
        </div>
      )
    case "interns":
      return (
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Intern Management Portal</h1>
            <p className="text-muted-foreground">Coming soon - Comprehensive intern training and management system</p>
          </div>
        </div>
      )
    case "compliance":
      return (
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Compliance Dashboard</h1>
            <p className="text-muted-foreground">Coming soon - Regulatory compliance monitoring and reporting</p>
          </div>
        </div>
      )
    case "omnilevel":
      return <OmnilevelPage />
    case "omnigrid-faa-zone":
      return <OmniGridFAAZonePage />
    case "buildnest-dashboard":
      return <BuildNestDashboardPage />
    case "intern-portalnest":
      return <InternPortalNestPage />
    case "banimal-integration":
      return <BanimalIntegrationPage />
    case "motion-media-sonic":
      return <MotionMediaSonic />
    case "omnilevel-interstellar":
      return <OmnilevelInterstellar />
    case "baobab-security-network":
      return <BaobabSecurityNetwork />
    case "fruitful-smart-toys":
      return <FruitfulSmartToys />
    case "samfox-creative-studio":
      return <SamFoxCreativeStudio />
    case "faa-quantum-nexus":
      return <FAAQuantumNexus />
    case "fruitful-business-plan":
      return <FruitfulBusinessPlan />
    case "fruitful-marketplace-marketing":
      return <FruitfulMarketplaceMarketing />
    case "chatgpt-integration":
      return <ChatGPTIntegration />
    case "faa-intake-checklist":
      return <FAAIntakeChecklist />
    case "omniuniversal-button-validator":
      return <OmniuniversalButtonValidator />
    case "claimroot-checkout":
      return <ClaimRootCheckoutPage />
    case "button-repair-dashboard":
      return <ButtonRepairDashboard />
    case "ecosystem-coordinator":
      return <EcosystemCoordinator />
    default:
      // Check if it's a sector dashboard route
      if (activePage.startsWith("sector-")) {
        const sectorId = activePage.replace("sector-", "")
        return <SectorDashboard />
      }
      return <NotFound />
  }
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={PortalHome} />
          <Route path="/portal-home" component={PortalHome} />
          <Route path="/sectors" component={SectorsPage} />
          <Route path="/sector-list" component={SectorList} />
          <Route path="/sector/:id">
            {(params) => <SectorIndividualPage />}
          </Route>
          <Route path="/sectors/:id">
            {(params) => <SectorIndividualPage />}
          </Route>
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [activePage, setActivePage] = useState("home")
  
  console.log("🚀 Main App component rendering");

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="seedwave-ui-theme">
        <TooltipProvider>
            <div id="main-app-wrapper" style={{ 
              minHeight: '100vh', 
              backgroundColor: '#ffffff', 
              width: '100%', 
              position: 'relative',
              display: 'block',
              visibility: 'visible',
              zIndex: 1
            }}>

              <AuthenticatedApp activePage={activePage} setActivePage={setActivePage} />
              <Toaster />
            </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

function AuthenticatedApp({ activePage, setActivePage }: { activePage: string; setActivePage: (page: string) => void }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { scrollPosition, isActive, intensity } = useScrollBreathGlyphs({ intensity: 'medium' });

  console.log("🔍 AuthenticatedApp render - isLoading:", isLoading, "isAuthenticated:", isAuthenticated, "activePage:", activePage);

  if (isLoading) {
    console.log("⏳ Showing loading spinner");
    return (
      <div className="flex items-center justify-center min-h-screen bg-white" style={{ backgroundColor: '#ffffff', minHeight: '100vh', width: '100%', zIndex: 999 }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Seedwave Portal...</p>
        </div>
      </div>
    );
  }

  // Always show authenticated app since we're in development mode
  // if (!isAuthenticated) {
  //   return <Router />;
  // }
  
  console.log("✅ Rendering main app UI");
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900" style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: '#f9fafb', position: 'relative', zIndex: 1 }}>
      <div className="flex flex-1" style={{ flex: 1, display: 'flex' }}>
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="flex-1 ml-0 md:ml-80 transition-all duration-300" style={{ flex: 1, minHeight: '100vh', backgroundColor: '#ffffff', position: 'relative' }}>
          <PageRouter activePage={activePage} />
        </main>
      </div>
      <GlobalFooter className="ml-0 md:ml-80" />
      <GlobalSyncIndicator />
      
      {/* ScrollBinder Breath Glyphs Global Integration */}
      <ScrollBreathGlyphs 
        isActive={isActive || activePage !== "home"}
        intensity={intensity}
        scrollPosition={scrollPosition}
      />
    </div>
  );
}

export default App
