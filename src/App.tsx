import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProgressProvider } from "./components/progress/ProgressProvider";
import Index from "./pages/Index";
import Philosophy from "./pages/Philosophy";
import Courses from "./pages/Courses";
import Blog from "./pages/Blog";
import Resources from "./pages/Resources";
import Store from "./pages/Store";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import CourseDetail from "./pages/CourseDetail";
import ModuleViewer from "./pages/ModuleViewer";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import VideoTutorials from "./pages/VideoTutorials";
import WalletSetupTutorial from "./pages/WalletSetupTutorial";
import FirstDexSwapTutorial from "./pages/FirstDexSwapTutorial";
import DefiCalculatorsTutorial from "./pages/DefiCalculatorsTutorial";
import SpottingScamsTutorial from "./pages/SpottingScamsTutorial";
import CrossChainBridgingTutorial from "./pages/CrossChainBridgingTutorial";
import AdvancedDefiProtocolsTutorial from "./pages/AdvancedDefiProtocolsTutorial";
import PortfolioRebalancingTutorial from "./pages/PortfolioRebalancingTutorial";
import ReadingDefiMetricsTutorial from "./pages/ReadingDefiMetricsTutorial";
import RiskAssessmentTutorial from "./pages/RiskAssessmentTutorial";
import ChartReadingTutorial from "./pages/ChartReadingTutorial";
import NftDefiTutorial from "./pages/NftDefiTutorial";
import DaoParticipationTutorial from "./pages/DaoParticipationTutorial";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProgressProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/philosophy" element={<Philosophy />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:courseId" element={<CourseDetail />} />
                <Route path="/courses/:courseId/module/:moduleId" element={<ModuleViewer />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/tutorials" element={<VideoTutorials />} />
                <Route path="/tutorials/wallet-setup" element={<WalletSetupTutorial />} />
                <Route path="/tutorials/first-dex-swap" element={<FirstDexSwapTutorial />} />
                <Route path="/tutorials/defi-calculators" element={<DefiCalculatorsTutorial />} />
                <Route path="/tutorials/spotting-scams" element={<SpottingScamsTutorial />} />
                <Route path="/tutorials/cross-chain-bridging" element={<CrossChainBridgingTutorial />} />
                <Route path="/tutorials/advanced-defi-protocols" element={<AdvancedDefiProtocolsTutorial />} />
                <Route path="/tutorials/portfolio-rebalancing" element={<PortfolioRebalancingTutorial />} />
                <Route path="/tutorials/reading-defi-metrics" element={<ReadingDefiMetricsTutorial />} />
                <Route path="/tutorials/risk-assessment" element={<RiskAssessmentTutorial />} />
                <Route path="/tutorials/chart-reading" element={<ChartReadingTutorial />} />
                <Route path="/tutorials/nft-defi" element={<NftDefiTutorial />} />
                <Route path="/tutorials/dao-participation" element={<DaoParticipationTutorial />} />
                <Route path="/store" element={<Store />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </ProgressProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
