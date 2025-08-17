import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { HelmetProvider } from "react-helmet-async";
import SecurityHeaders from "@/components/SecurityHeaders";
import Layout from "./components/Layout";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProgressProvider } from "./components/progress/ProgressProvider";
import Index from "./pages/Index";
import Philosophy from "./pages/Philosophy";
import Courses from "./pages/Courses";
import Blog from "./pages/Blog";
import Resources from "./pages/Resources";
import Store from "./pages/Store";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import CourseDetail from "./pages/CourseDetail";
import ModuleViewer from "./pages/ModuleViewer";
import Dashboard from "./pages/Dashboard";
import Downloads from "./pages/Downloads";
import AdminUploadContent from "./pages/AdminUploadContent";
import TestDownloads from "./pages/TestDownloads";
import Analytics from "./pages/Analytics";
import ProtectedRoute from "./components/auth/ProtectedRoute";
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
import Profile from "./pages/Profile";
import BlogPost from "./pages/BlogPost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import SocialBanner from "./pages/SocialBanner";
import WebThreeGamingDefiConvergence from "./pages/WebThreeGamingDefiConvergence";
import DefaiRevolution2025 from "./pages/DefaiRevolution2025";

const queryClient = new QueryClient();

const App = () => {
  // Handle domain and protocol redirects in production only
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const pathname = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    
    // Only redirect on the3rdeyeadvisors.com domain
    if (hostname.endsWith('the3rdeyeadvisors.com')) {
      // Redirect non-www to www or http to https
      if (hostname === 'the3rdeyeadvisors.com' || protocol === 'http:') {
        const redirectUrl = `https://www.the3rdeyeadvisors.com${pathname}${search}${hash}`;
        window.location.replace(redirectUrl);
      }
    }
  }, []);

  return (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <AuthProvider>
            <ProgressProvider>
              <SecurityHeaders />
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
                  <Route path="/blog/:page(\\d+)" element={<Navigate to="/blog" replace />} />
                  <Route path="/blog/web3-gaming-defi-convergence-2025" element={<WebThreeGamingDefiConvergence />} />
                  <Route path="/blog/defai-revolution-2025" element={<DefaiRevolution2025 />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
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
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/downloads" element={<Downloads />} />
                  <Route path="/admin/upload" element={
                    <ProtectedRoute requireRole="admin">
                      <AdminUploadContent />
                    </ProtectedRoute>
                  } />
                  <Route path="/test-downloads" element={
                    <ProtectedRoute requireRole="admin">
                      <TestDownloads />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/social-banner" element={<SocialBanner />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </ProgressProvider>
        </AuthProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
  );
};

export default App;