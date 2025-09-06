import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import Dashboard from "@/pages/dashboard";
import Documents from "@/pages/documents";
import GalleryPage from "@/pages/gallery";
import Conversations from "@/pages/conversations";
import Brands from "@/pages/brands";
import Compliance from "@/pages/compliance";
import Automation from "@/pages/automation";
import GlobalView from "@/pages/global-view";
import FruitfulAmerica from "@/pages/fruitful-america";
import WildlifeDashboard from "@/pages/wildlife-dashboard";
import VaultPayments from "@/pages/vault-payments";
import PayrollDashboard from "@/pages/payroll-dashboard";
import PayrollOnboarding from "@/pages/payroll-onboarding";
import MiningDashboard from "@/pages/mining-dashboard";
import AutoBornPlatform from "@/pages/autoborn-platform";
import MinervaplatForm from "@/pages/minerva-platform";
import HeartbeatDashboard from "@/pages/heartbeat-dashboard";
import HousingDashboard from "@/pages/housing-dashboard";
import CornexPlatform from "@/pages/cornex-platform";
import RealEstatePlatform from "@/pages/realestate-platform";
import EducationDashboard from "@/pages/education-dashboard";
import SmartToysPlatform from "@/pages/smart-toys-platform";
import ModularView from "@/pages/modular-view";
import AILogicDashboard from "@/pages/ai-logic-dashboard";
import CodeNestPlatform from "@/pages/codenest-platform";
import AdminPortal from "@/pages/admin-portal";
import AdminAccessPortal from "@/pages/admin-access-portal";
import PulseGridDashboard from "@/pages/pulse-grid-dashboard";
import CrateDanceSmartGrid from "@/pages/crate-dance-smart-grid";
import PayrollFeatures from "@/pages/payroll-features";
import PayrollSovereignGrid from "@/pages/payroll-sovereign-grid";
import AdvancedPayrollDashboard from "@/pages/advanced-payroll-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/documents" component={Documents} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/conversations" component={Conversations} />
      <Route path="/brands" component={Brands} />
      <Route path="/compliance" component={Compliance} />
      <Route path="/automation" component={Automation} />
      <Route path="/global-view" component={GlobalView} />
      <Route path="/fruitful-america" component={FruitfulAmerica} />
      <Route path="/wildlife-dashboard" component={WildlifeDashboard} />
      <Route path="/vault-payments" component={VaultPayments} />
      <Route path="/payroll-dashboard" component={PayrollDashboard} />
      <Route path="/payroll-onboarding" component={PayrollOnboarding} />
      <Route path="/mining-dashboard" component={MiningDashboard} />
      <Route path="/autoborn-platform" component={AutoBornPlatform} />
      <Route path="/minerva-platform" component={MinervaplatForm} />
      <Route path="/heartbeat-dashboard" component={HeartbeatDashboard} />
      <Route path="/housing-dashboard" component={HousingDashboard} />
      <Route path="/cornex-platform" component={CornexPlatform} />
      <Route path="/realestate-platform" component={RealEstatePlatform} />
      <Route path="/education-dashboard" component={EducationDashboard} />
      <Route path="/smart-toys-platform" component={SmartToysPlatform} />
      <Route path="/modular-view" component={ModularView} />
      <Route path="/ai-logic-dashboard" component={AILogicDashboard} />
      <Route path="/codenest-platform" component={CodeNestPlatform} />
      <Route path="/admin-portal" component={AdminPortal} />
      <Route path="/admin-access-portal" component={AdminAccessPortal} />
      <Route path="/pulse-grid-dashboard" component={PulseGridDashboard} />
      <Route path="/crate-dance-smart-grid" component={CrateDanceSmartGrid} />
      <Route path="/payroll-features" component={PayrollFeatures} />
      <Route path="/payroll-sovereign-grid" component={PayrollSovereignGrid} />
      <Route path="/advanced-payroll-dashboard" component={AdvancedPayrollDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
