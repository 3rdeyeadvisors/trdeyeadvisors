import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { HelmetProvider } from "react-helmet-async";
import SecurityHeaders from "@/components/SecurityHeaders";
import Layout from "./components/Layout";
import PageTransition from "./components/PageTransition";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProgressProvider } from "./components/progress/ProgressProvider";
import { SubscriptionProvider } from "./hooks/useSubscription";
// PWA components removed - app runs live without caching interruptions
import { ThirdwebProvider } from "thirdweb/react";
import Index from "./pages/Index";
import Subscription from "./pages/Subscription";
import Philosophy from "./pages/Philosophy";
import Courses from "./pages/Courses";
import Blog from "./pages/Blog";
import Resources from "./pages/Resources";
import Store from "./pages/Store";
import MerchandiseDetail from "./pages/MerchandiseDetail";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import CourseDetail from "./pages/CourseDetail";
import ModuleViewer from "./pages/ModuleViewer";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import EmailLogsAdmin from "./pages/EmailLogsAdmin";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Tutorials from "./pages/Tutorials";
import WalletSetupTutorial from "./pages/WalletSetupTutorial";
import FirstDexSwapTutorial from "./pages/FirstDexSwapTutorial";
import DefiCalculatorsTutorial from "./pages/DefiCalculatorsTutorial";
import SpottingScamsTutorial from "./pages/SpottingScamsTutorial";
import CrossChainBridgingTutorial from "./pages/CrossChainBridgingTutorial";
import AdvancedDefiProtocolsTutorial from "./pages/AdvancedDefiProtocolsTutorial";
import PortfolioRebalancingTutorial from "./pages/PortfolioRebalancingTutorial";
import PortfolioTrackingTutorial from "./pages/PortfolioTrackingTutorial";
import LiquidityPoolBasicsTutorial from "./pages/LiquidityPoolBasicsTutorial";
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
import SetupStripeProducts from "./pages/SetupStripeProducts";
import StripeDiagnostic from "./pages/StripeDiagnostic";
import WebThreeGamingDefiConvergence from "./pages/WebThreeGamingDefiConvergence";
import DefaiRevolution2025 from "./pages/DefaiRevolution2025";
import DefiRegulationAmlIntegration from "./pages/DefiRegulationAmlIntegration";
import LiquidStakingTokens2025 from "./pages/LiquidStakingTokens2025";
import StablecoinsDefiInfrastructure2025 from "./pages/StablecoinsDefiInfrastructure2025";
import WhyMostPeopleLoseCrypto from "./pages/WhyMostPeopleLoseCrypto";
import DefiMatured2025 from "./pages/DefiMatured2025";
import DefiVaultsExplained from "./pages/DefiVaultsExplained";
import PredictionMarketsDeFi2025 from "./pages/PredictionMarketsDeFi2025";
import RwaOvertakesDex2025 from "./pages/RwaOvertakesDex2025";
import AdminStoreDashboard from "./pages/AdminStoreDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Raffles from "./pages/Raffles";
import RaffleHistory from "./pages/RaffleHistory";
import AwarenessBlueprintLanding from "./pages/AwarenessBlueprintLanding";
import AdLanding from "./pages/AdLanding";
import UploadResourceFile from "./pages/UploadResourceFile";
import VaultAccess from "./pages/VaultAccess";
import VaultDepositTutorial from "./pages/VaultDepositTutorial";
import VaultWithdrawalTutorial from "./pages/VaultWithdrawalTutorial";
import Earn from "./pages/Earn";
import ReferralTerms from "./pages/ReferralTerms";

const queryClient = new QueryClient();

// Wrapper component to provide location key for page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageTransition><Index /></PageTransition>} />
      <Route path="/philosophy" element={<PageTransition><Philosophy /></PageTransition>} />
      <Route path="/courses" element={<PageTransition><Courses /></PageTransition>} />
      <Route path="/courses/:courseId" element={<PageTransition><CourseDetail /></PageTransition>} />
      <Route path="/courses/:courseId/module/:moduleId" element={<PageTransition><ModuleViewer /></PageTransition>} />
      <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
      <Route path="/blog/:page(\\d+)" element={<Navigate to="/blog" replace />} />
      <Route path="/blog/defi-regulation-aml-integration" element={<PageTransition><DefiRegulationAmlIntegration /></PageTransition>} />
      <Route path="/blog/web3-gaming-defi-convergence-2025" element={<PageTransition><WebThreeGamingDefiConvergence /></PageTransition>} />
      <Route path="/blog/defai-revolution-2025" element={<PageTransition><DefaiRevolution2025 /></PageTransition>} />
      <Route path="/blog/liquid-staking-tokens-2025" element={<PageTransition><LiquidStakingTokens2025 /></PageTransition>} />
      <Route path="/blog/stablecoins-defi-infrastructure-2025" element={<PageTransition><StablecoinsDefiInfrastructure2025 /></PageTransition>} />
      <Route path="/blog/why-most-people-lose-crypto" element={<PageTransition><WhyMostPeopleLoseCrypto /></PageTransition>} />
      <Route path="/blog/defi-matured-2025" element={<PageTransition><DefiMatured2025 /></PageTransition>} />
      <Route path="/blog/defi-vaults-explained" element={<PageTransition><DefiVaultsExplained /></PageTransition>} />
      <Route path="/blog/prediction-markets-defi-2025" element={<PageTransition><PredictionMarketsDeFi2025 /></PageTransition>} />
      <Route path="/blog/rwa-overtakes-dex-2025" element={<PageTransition><RwaOvertakesDex2025 /></PageTransition>} />
      <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
      <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
      <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
      <Route path="/tutorials" element={<PageTransition><Tutorials /></PageTransition>} />
      <Route path="/tutorials/wallet-setup" element={<PageTransition><WalletSetupTutorial /></PageTransition>} />
      <Route path="/tutorials/first-dex-swap" element={<PageTransition><FirstDexSwapTutorial /></PageTransition>} />
      <Route path="/tutorials/defi-calculators" element={<PageTransition><DefiCalculatorsTutorial /></PageTransition>} />
      <Route path="/tutorials/spotting-scams" element={<PageTransition><SpottingScamsTutorial /></PageTransition>} />
      <Route path="/tutorials/cross-chain-bridging" element={<PageTransition><CrossChainBridgingTutorial /></PageTransition>} />
      <Route path="/tutorials/advanced-defi-protocols" element={<PageTransition><AdvancedDefiProtocolsTutorial /></PageTransition>} />
      <Route path="/tutorials/portfolio-rebalancing" element={<PageTransition><PortfolioRebalancingTutorial /></PageTransition>} />
      <Route path="/tutorials/portfolio-tracking" element={<PageTransition><PortfolioTrackingTutorial /></PageTransition>} />
      <Route path="/tutorials/liquidity-pools" element={<PageTransition><LiquidityPoolBasicsTutorial /></PageTransition>} />
      <Route path="/tutorials/reading-defi-metrics" element={<PageTransition><ReadingDefiMetricsTutorial /></PageTransition>} />
      <Route path="/tutorials/risk-assessment" element={<PageTransition><RiskAssessmentTutorial /></PageTransition>} />
      <Route path="/tutorials/chart-reading" element={<PageTransition><ChartReadingTutorial /></PageTransition>} />
      <Route path="/tutorials/nft-defi" element={<PageTransition><NftDefiTutorial /></PageTransition>} />
      <Route path="/tutorials/dao-participation" element={<PageTransition><DaoParticipationTutorial /></PageTransition>} />
      <Route path="/store" element={<PageTransition><Store /></PageTransition>} />
      <Route path="/store/merchandise/:productId" element={<PageTransition><MerchandiseDetail /></PageTransition>} />
      <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
      <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
      <Route path="/signin" element={<PageTransition><Auth /></PageTransition>} />
      <Route path="/signup" element={<PageTransition><Auth /></PageTransition>} />
      <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
      <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
      <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
      <Route path="/subscription" element={<PageTransition><Subscription /></PageTransition>} />
      <Route path="/awareness-blueprint" element={<PageTransition><AwarenessBlueprintLanding /></PageTransition>} />
      <Route path="/start" element={<PageTransition><AdLanding /></PageTransition>} />
      <Route path="/admin/upload-resource" element={
        <ProtectedRoute requireRole="admin">
          <PageTransition><UploadResourceFile /></PageTransition>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
      <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
      <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />
      <Route path="/social-banner" element={<PageTransition><SocialBanner /></PageTransition>} />
      <Route path="/setup-stripe-products" element={
        <ProtectedRoute requireRole="admin">
          <PageTransition><SetupStripeProducts /></PageTransition>
        </ProtectedRoute>
      } />
      <Route path="/stripe-diagnostic" element={
        <ProtectedRoute requireRole="admin">
          <PageTransition><StripeDiagnostic /></PageTransition>
        </ProtectedRoute>
      } />
      <Route path="/admin/email-logs" element={
        <ProtectedRoute requireRole="admin">
          <PageTransition><EmailLogsAdmin /></PageTransition>
        </ProtectedRoute>
      } />
      <Route path="/admin/store" element={
        <ProtectedRoute requireRole="admin">
          <PageTransition><AdminStoreDashboard /></PageTransition>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute requireRole="admin">
          <PageTransition><AdminDashboard /></PageTransition>
        </ProtectedRoute>
      } />
      <Route path="/raffles" element={<PageTransition><Raffles /></PageTransition>} />
      <Route path="/raffle-history" element={<PageTransition><RaffleHistory /></PageTransition>} />
      <Route path="/earn" element={<PageTransition><Earn /></PageTransition>} />
      <Route path="/referral-terms" element={<PageTransition><ReferralTerms /></PageTransition>} />
      <Route path="/vault-access" element={<PageTransition><VaultAccess /></PageTransition>} />
      <Route path="/vault-deposit-guide" element={<PageTransition><VaultDepositTutorial /></PageTransition>} />
      <Route path="/vault-withdrawal-guide" element={<PageTransition><VaultWithdrawalTutorial /></PageTransition>} />
      <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
    </Routes>
  );
};

const App = () => {
  // Handle domain and protocol redirects in production only
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const pathname = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    
    // Redirect 3rdeyeadvisors.com (without "the") to the3rdeyeadvisors.com
    if (hostname === '3rdeyeadvisors.com' || hostname === 'www.3rdeyeadvisors.com') {
      const redirectUrl = `https://the3rdeyeadvisors.com${pathname}${search}${hash}`;
      window.location.replace(redirectUrl);
      return;
    }
    
    // Ensure HTTPS on the3rdeyeadvisors.com domain
    if (hostname.endsWith('the3rdeyeadvisors.com') && protocol === 'http:') {
      const redirectUrl = `https://${hostname}${pathname}${search}${hash}`;
      window.location.replace(redirectUrl);
    }
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider>
          <TooltipProvider>
            <CartProvider>
              <AuthProvider>
                <SubscriptionProvider>
                  <ProgressProvider>
                    <SecurityHeaders />
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <Layout>
                        <AnimatedRoutes />
                      </Layout>
                    </BrowserRouter>
                  </ProgressProvider>
                </SubscriptionProvider>
              </AuthProvider>
            </CartProvider>
          </TooltipProvider>
        </ThirdwebProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
