import Dashboard from "@/pages/dashboard";
import Documents from "@/pages/documents";
import Gallery from "@/pages/gallery";
import Conversations from "@/pages/conversations";
import Brands from "@/pages/brands";
import Compliance from "@/pages/compliance";
import Automation from "@/pages/automation";
import GlobalView from "@/pages/global-view";
import FruitfulAmerica from "@/pages/fruitful-america";
import WildlifeDashboard from "@/pages/wildlife-dashboard";
import PayrollDashboard from "@/pages/payroll-dashboard";
import MiningDashboard from "@/pages/mining-dashboard";
import HousingDashboard from "@/pages/housing-dashboard";
import FAARealestatePlatform from "@/pages/faa-realestate-platform";
import FAAGlobalIndustryIndex from "@/pages/faa-global-industry-index";
import GitHubRepositoryBrowser from "@/pages/github-repository-browser";
import EducationDashboard from "@/pages/education-dashboard";
import AILogicDashboard from "@/pages/ai-logic-dashboard";
import SamFoxStudioPlatform from "@/pages/samfox-studio-platform";
import AdminPortal from "@/pages/admin-portal";
import AdminSettings from "@/pages/admin-settings";
import PulseGridDashboard from "@/pages/pulse-grid-dashboard";
import CrateDanceSmartGrid from "@/pages/crate-dance-smart-grid";
import CrateDanceAfrica from "@/pages/crate-dance-africa";
import PlayingWithTheSeed from "@/pages/playing-with-the-seed";
import SeedlingLanguageLearning from "@/pages/seedling-language-learning";
import DataPipeline from "@/pages/data-pipeline";
import EmailSystem from "@/pages/email-system";
import MultiChannelMessaging from "@/pages/multi-channel-messaging";
import FAAYouthEducationBrands from "@/pages/faa-youth-education-brands";
import FruitfulGlobalPlatform from "@/pages/fruitful-global-platform";
import FAATesisOmniRender from "@/pages/faa-tesis-omni-render";
import AgricultureBiotechPlatform from "@/pages/agriculture-biotech-platform";
import StrategicSellScroll from "@/pages/strategic-sell-scroll";
import EurekaCloudflowDashboard from "@/pages/eureka-cloudflow-dashboard";
import DailySummaryExtractor from "@/pages/daily-summary-extractor";
import VaultPayments from "@/pages/vault-payments";
import TeamOnboarding from "@/pages/team-onboarding";
import ContactManagement from "@/pages/contact-management";
import BanimalPlatform from "@/pages/banimal-platform";
import BanimalConnector from "@/pages/banimal-connector";
import EcosystemManager from "@/pages/ecosystem-manager";
import DeploymentDashboard from "@/pages/deployment-dashboard";
import LoopPayGallery from "@/pages/looppay-gallery";
import ScrollBinderOne from "@/pages/scrollbinder-one";
import HSOMNIIntegration from "@/pages/hsomni-integration";

interface PageRouterProps {
  activePage: string;
}

export function PageRouter({ activePage }: PageRouterProps) {
  // Route to components based on page ID/href from sidebar
  switch (activePage) {
    case "/":
    case "dashboard":
      return <Dashboard />;
    case "/documents":
    case "documents":
      return <Documents />;
    case "/gallery":
    case "gallery":
      return <Gallery />;
    case "/conversations":
    case "conversations":
      return <Conversations />;
    case "/brands":
    case "brands":
      return <Brands />;
    case "/compliance":
    case "compliance":
      return <Compliance />;
    case "/automation":
    case "automation":
      return <Automation />;
    case "/global-view":
    case "global-view":
      return <GlobalView />;
    case "/fruitful-america":
    case "fruitful-america":
      return <FruitfulAmerica />;
    case "/wildlife-dashboard":
    case "wildlife-dashboard":
      return <WildlifeDashboard />;
    case "/payroll-dashboard":
    case "payroll-dashboard":
      return <PayrollDashboard />;
    case "/mining-dashboard":
    case "mining-dashboard":
      return <MiningDashboard />;
    case "/housing-dashboard":
    case "housing-dashboard":
      return <HousingDashboard />;
    case "/faa-realestate-platform":
    case "faa-realestate-platform":
      return <FAARealestatePlatform />;
    case "/faa-global-industry-index":
    case "faa-global-industry-index":
      return <FAAGlobalIndustryIndex />;
    case "/github-repository-browser":
    case "github-repository-browser":
      return <GitHubRepositoryBrowser />;
    case "/education-dashboard":
    case "education-dashboard":
      return <EducationDashboard />;
    case "/ai-logic-dashboard":
    case "ai-logic-dashboard":
      return <AILogicDashboard />;
    case "/samfox-studio-platform":
    case "samfox-studio-platform":
      return <SamFoxStudioPlatform />;
    case "/admin-portal":
    case "admin-portal":
      return <AdminPortal />;
    case "/admin-settings":
    case "admin-settings":
      return <AdminSettings />;
    case "/pulse-grid-dashboard":
    case "pulse-grid-dashboard":
      return <PulseGridDashboard />;
    case "/crate-dance-smart-grid":
    case "crate-dance-smart-grid":
      return <CrateDanceSmartGrid />;
    case "/crate-dance-africa":
    case "crate-dance-africa":
      return <CrateDanceAfrica />;
    case "/playing-with-the-seed":
    case "playing-with-the-seed":
      return <PlayingWithTheSeed />;
    case "/seedling-language-learning":
    case "seedling-language-learning":
      return <SeedlingLanguageLearning />;
    case "/data-pipeline":
    case "data-pipeline":
      return <DataPipeline />;
    case "/email-system":
    case "email-system":
      return <EmailSystem />;
    case "/multi-channel-messaging":
    case "multi-channel-messaging":
      return <MultiChannelMessaging />;
    case "/faa-youth-education-brands":
    case "faa-youth-education-brands":
      return <FAAYouthEducationBrands />;
    case "/fruitful-global-platform":
    case "fruitful-global-platform":
      return <FruitfulGlobalPlatform />;
    case "/faa-tesis-omni-render":
    case "faa-tesis-omni-render":
      return <FAATesisOmniRender />;
    case "/agriculture-biotech-platform":
    case "agriculture-biotech-platform":
      return <AgricultureBiotechPlatform />;
    case "/strategic-sell-scroll":
    case "strategic-sell-scroll":
      return <StrategicSellScroll />;
    case "/eureka-cloudflow-dashboard":
    case "eureka-cloudflow-dashboard":
      return <EurekaCloudflowDashboard />;
    case "/daily-summary-extractor":
    case "daily-summary-extractor":
      return <DailySummaryExtractor />;
    case "/vault-payments":
    case "vault-payments":
      return <VaultPayments />;
    case "/team-onboarding":
    case "team-onboarding":
      return <TeamOnboarding />;
    case "/contact-management":
    case "contact-management":
      return <ContactManagement />;
    case "/banimal-platform":
    case "banimal-platform":
      return <BanimalPlatform />;
    case "/banimal-connector":
    case "banimal-connector":
      return <BanimalConnector />;
    case "/ecosystem-manager":
    case "ecosystem-manager":
      return <EcosystemManager />;
    case "/deployment-dashboard":
    case "deployment-dashboard":
      return <DeploymentDashboard />;
    case "/looppay-gallery":
    case "looppay-gallery":
      return <LoopPayGallery />;
    case "/scrollbinder-one":
    case "scrollbinder-one":
      return <ScrollBinderOne />;
    case "/hsomni-integration":
    case "hsomni-integration":
      return <HSOMNIIntegration />;
    default:
      return <Dashboard />;
  }
}
