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
import CrateDanceAfrica from "@/pages/crate-dance-africa";
import PlayingWithTheSeed from "@/pages/playing-with-the-seed";
import FAASubnodes from "@/pages/faa-subnodes";
import PayrollFeatures from "@/pages/payroll-features";
import PayrollSovereignGrid from "@/pages/payroll-sovereign-grid";
import AdvancedPayrollDashboard from "@/pages/advanced-payroll-dashboard";
import TeamOnboarding from "@/pages/team-onboarding";
import ContactManagement from "@/pages/contact-management";
import BanimalPlatform from "@/pages/banimal-platform";
import SeedlingLanguageLearning from "@/pages/seedling-language-learning";
import DataPipeline from "@/pages/data-pipeline";
import EmailSystemPage from "@/pages/email-system";
import MultiChannelMessaging from "@/pages/multi-channel-messaging";
import FAARealestatePlatform from "@/pages/faa-realestate-platform";
import FAAGlobalIndustryIndex from "@/pages/faa-global-industry-index";
import GitHubRepositoryBrowser from "@/pages/github-repository-browser";
import FAAYouthEducationBrands from "@/pages/faa-youth-education-brands";
import FruitfulGlobalPlatform from "@/pages/fruitful-global-platform";
import FAATestisOmniRender from "@/pages/faa-tesis-omni-render";
import AgricultureBiotechPlatform from "@/pages/agriculture-biotech-platform";
import StrategicSellScroll from "@/pages/strategic-sell-scroll";
import EurekaCloudflowDashboard from "@/pages/eureka-cloudflow-dashboard";
import DailySummaryExtractor from "@/pages/daily-summary-extractor";
import NotificationSettings from "@/pages/notification-settings";
import AdMobDashboard from "@/pages/admob-dashboard";
import SamFoxStudioPlatform from "@/pages/samfox-studio-platform";
import LoopPayGallery from "@/pages/looppay-gallery";
import ValuationAIModule from "@/pages/ai-module-valuation";
import MortgageRiskModule from "@/pages/ai-module-mortgage-risk";
import MarketForecastModule from "@/pages/ai-module-market-forecast";
import AgentInsightsModule from "@/pages/ai-module-agent-insights";
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
      <Route path="/faa-realestate-platform" component={FAARealestatePlatform} />
      <Route path="/faa-global-industry-index" component={FAAGlobalIndustryIndex} />
      <Route path="/github-repository-browser" component={GitHubRepositoryBrowser} />
      <Route path="/faa-youth-education-brands" component={FAAYouthEducationBrands} />
      <Route path="/fruitful-global-platform" component={FruitfulGlobalPlatform} />
      <Route path="/faa-tesis-omni-render" component={FAATestisOmniRender} />
      <Route path="/agriculture-biotech-platform" component={AgricultureBiotechPlatform} />
      <Route path="/strategic-sell-scroll" component={StrategicSellScroll} />
      <Route path="/eureka-cloudflow-dashboard" component={EurekaCloudflowDashboard} />
      <Route path="/daily-summary-extractor" component={DailySummaryExtractor} />
      <Route path="/education-dashboard" component={EducationDashboard} />
      <Route path="/smart-toys-platform" component={SmartToysPlatform} />
      <Route path="/modular-view" component={ModularView} />
      <Route path="/ai-logic-dashboard" component={AILogicDashboard} />
      <Route path="/codenest-platform" component={CodeNestPlatform} />
      <Route path="/admin-portal" component={AdminPortal} />
      <Route path="/admin-access-portal" component={AdminAccessPortal} />
      <Route path="/pulse-grid-dashboard" component={PulseGridDashboard} />
      <Route path="/crate-dance-smart-grid" component={CrateDanceSmartGrid} />
      <Route path="/crate-dance-africa" component={CrateDanceAfrica} />
      <Route path="/playing-with-the-seed" component={PlayingWithTheSeed} />
      <Route path="/faa-subnodes" component={FAASubnodes} />
      <Route path="/payroll-features" component={PayrollFeatures} />
      <Route path="/payroll-sovereign-grid" component={PayrollSovereignGrid} />
      <Route path="/advanced-payroll-dashboard" component={AdvancedPayrollDashboard} />
      <Route path="/team-onboarding" component={TeamOnboarding} />
      <Route path="/contact-management" component={ContactManagement} />
      <Route path="/banimal-platform" component={BanimalPlatform} />
      <Route path="/seedling-language-learning" component={SeedlingLanguageLearning} />
      <Route path="/data-pipeline" component={DataPipeline} />
      <Route path="/email-system" component={EmailSystemPage} />
      <Route path="/multi-channel-messaging" component={MultiChannelMessaging} />
      <Route path="/notifications/settings" component={NotificationSettings} />
      <Route path="/admob-dashboard" component={AdMobDashboard} />
      <Route path="/samfox-studio-platform" component={SamFoxStudioPlatform} />
      <Route path="/looppay-gallery" component={LoopPayGallery} />
      <Route path="/ai-module/valuation-ai" component={ValuationAIModule} />
      <Route path="/ai-module/mortgage-risk" component={MortgageRiskModule} />
      <Route path="/ai-module/market-forecast" component={MarketForecastModule} />
      <Route path="/ai-module/agent-insights" component={AgentInsightsModule} />
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
