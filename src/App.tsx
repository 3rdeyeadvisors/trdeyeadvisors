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
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/philosophy" element={<Philosophy />} />
                          <Route path="/courses" element={<Courses />} />
                          <Route path="/courses/:courseId" element={<CourseDetail />} />
                          <Route path="/courses/:courseId/module/:moduleId" element={<ModuleViewer />} />
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/blog/:page(\\d+)" element={<Navigate to="/blog" replace />} />
                          <Route path="/blog/defi-regulation-aml-integration" element={<DefiRegulationAmlIntegration />} />
                          <Route path="/blog/web3-gaming-defi-convergence-2025" element={<WebThreeGamingDefiConvergence />} />
                          <Route path="/blog/defai-revolution-2025" element={<DefaiRevolution2025 />} />
                          <Route path="/blog/liquid-staking-tokens-2025" element={<LiquidStakingTokens2025 />} />
                          <Route path="/blog/stablecoins-defi-infrastructure-2025" element={<StablecoinsDefiInfrastructure2025 />} />
                          <Route path="/blog/why-most-people-lose-crypto" element={<WhyMostPeopleLoseCrypto />} />
                          <Route path="/blog/defi-matured-2025" element={<DefiMatured2025 />} />
                          <Route path="/blog/defi-vaults-explained" element={<DefiVaultsExplained />} />
                          <Route path="/blog/prediction-markets-defi-2025" element={<PredictionMarketsDeFi2025 />} />
                          <Route path="/blog/rwa-overtakes-dex-2025" element={<RwaOvertakesDex2025 />} />
                          <Route path="/blog/:slug" element={<BlogPost />} />
                          <Route path="/resources" element={<Resources />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/tutorials" element={<Tutorials />} />
                          <Route path="/tutorials/wallet-setup" element={<WalletSetupTutorial />} />
                          <Route path="/tutorials/first-dex-swap" element={<FirstDexSwapTutorial />} />
                          <Route path="/tutorials/defi-calculators" element={<DefiCalculatorsTutorial />} />
                          <Route path="/tutorials/spotting-scams" element={<SpottingScamsTutorial />} />
                          <Route path="/tutorials/cross-chain-bridging" element={<CrossChainBridgingTutorial />} />
                          <Route path="/tutorials/advanced-defi-protocols" element={<AdvancedDefiProtocolsTutorial />} />
                          <Route path="/tutorials/portfolio-rebalancing" element={<PortfolioRebalancingTutorial />} />
                          <Route path="/tutorials/portfolio-tracking" element={<PortfolioTrackingTutorial />} />
                          <Route path="/tutorials/liquidity-pools" element={<LiquidityPoolBasicsTutorial />} />
                          <Route path="/tutorials/reading-defi-metrics" element={<ReadingDefiMetricsTutorial />} />
                          <Route path="/tutorials/risk-assessment" element={<RiskAssessmentTutorial />} />
                          <Route path="/tutorials/chart-reading" element={<ChartReadingTutorial />} />
                          <Route path="/tutorials/nft-defi" element={<NftDefiTutorial />} />
                          <Route path="/tutorials/dao-participation" element={<DaoParticipationTutorial />} />
                          <Route path="/store" element={<Store />} />
                          <Route path="/store/merchandise/:productId" element={<MerchandiseDetail />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/signin" element={<Auth />} />
                          <Route path="/signup" element={<Auth />} />
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/reset-password" element={<ResetPassword />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/subscription" element={<Subscription />} />
                          <Route path="/awareness-blueprint" element={<AwarenessBlueprintLanding />} />
                          <Route path="/start" element={<AdLanding />} />
                          <Route path="/admin/upload-resource" element={
                            <ProtectedRoute requireRole="admin">
                              <UploadResourceFile />
                            </ProtectedRoute>
                          } />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/privacy" element={<PrivacyPolicy />} />
                          <Route path="/terms" element={<TermsOfService />} />
                          <Route path="/social-banner" element={<SocialBanner />} />
                          <Route path="/setup-stripe-products" element={
                            <ProtectedRoute requireRole="admin">
                              <SetupStripeProducts />
                            </ProtectedRoute>
                          } />
                          <Route path="/stripe-diagnostic" element={
                            <ProtectedRoute requireRole="admin">
                              <StripeDiagnostic />
                            </ProtectedRoute>
                          } />
                          <Route path="/admin/email-logs" element={
                            <ProtectedRoute requireRole="admin">
                              <EmailLogsAdmin />
                            </ProtectedRoute>
                          } />
                          <Route path="/admin/store" element={
                            <ProtectedRoute requireRole="admin">
                              <AdminStoreDashboard />
                            </ProtectedRoute>
                          } />
                          <Route path="/admin" element={
                            <ProtectedRoute requireRole="admin">
                              <AdminDashboard />
                            </ProtectedRoute>
                          } />
                          <Route path="/raffles" element={<Raffles />} />
                          <Route path="/raffle-history" element={<RaffleHistory />} />
                          <Route path="/earn" element={<Earn />} />
                          <Route path="/referral-terms" element={<ReferralTerms />} />
                          <Route path="/vault-access" element={<VaultAccess />} />
                          <Route path="/vault-deposit-guide" element={<VaultDepositTutorial />} />
                          <Route path="/vault-withdrawal-guide" element={<VaultWithdrawalTutorial />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
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