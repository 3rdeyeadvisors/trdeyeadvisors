import SEO from "@/components/SEO";
import NewsletterSignup from "@/components/NewsletterSignup";
import {
  FloatingParticles,
  HeroSection,
  FeaturesSection,
  AboutSection,
  PlatformFeaturesSection,
  AwarenessEngineSection,
  VaultSection,
  PricingSection,
  CTASection,
} from "@/components/landing";

const Index = () => {
  return (
    <>
      <SEO 
        title="Master DeFi Education & Cryptocurrency Knowledge"
        description="Build your financial understanding with comprehensive DeFi education. Learn decentralized finance, crypto fundamentals, and blockchain protocols through practical courses and tutorials."
        keywords="DeFi education, crypto training, blockchain courses, decentralized finance, cryptocurrency learning"
        url="https://www.the3rdeyeadvisors.com/"
        type="website"
        schema={{
          type: "Organization",
          data: {
            "@type": "Organization",
            "name": "3rdeyeadvisors",
            "description": "Expert DeFi education and cryptocurrency training platform",
            "url": "https://www.the3rdeyeadvisors.com",
            "sameAs": [
              "https://twitter.com/3rdeyeadvisors"
            ]
          }
        }}
      />
      
      <div className="min-h-screen bg-background relative">
        {/* Floating particles background */}
        <FloatingParticles />
        
        {/* Main content */}
        <div className="relative z-10">
          <HeroSection />
          <FeaturesSection />
          <AboutSection />
          <PlatformFeaturesSection />
          <AwarenessEngineSection />
          <VaultSection />
          <PricingSection />
          <CTASection />
          
          {/* Newsletter */}
          <section className="py-20 md:py-32">
            <div className="max-w-4xl mx-auto px-6">
              <NewsletterSignup variant="cosmic" />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Index;
