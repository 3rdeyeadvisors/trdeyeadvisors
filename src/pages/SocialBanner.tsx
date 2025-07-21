import { SocialBannerGenerator } from "@/components/SocialBannerGenerator";
import Layout from "@/components/Layout";

const SocialBanner = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <SocialBannerGenerator />
        </div>
      </div>
    </Layout>
  );
};

export default SocialBanner;