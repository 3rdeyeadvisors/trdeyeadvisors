
import { SocialBannerGenerator } from "@/components/SocialBannerGenerator";
import { SocialPreviewChecker } from "@/components/SocialPreviewChecker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEOAutomation from "@/components/SEOAutomation";

const SocialBanner = () => {
  return (
    <>
      <SEOAutomation 
        title="Social Banner Generator & Link Preview Checker"
        description="Generate professional social media banners and test how your links appear when shared on messaging apps and social platforms."
        category="Tools"
        tags={['social media', 'banner generator', 'link preview', 'marketing tools']}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="generator" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="generator">Generate Banner</TabsTrigger>
              <TabsTrigger value="checker">Test Link Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generator">
              <SocialBannerGenerator />
            </TabsContent>
            
            <TabsContent value="checker">
              <SocialPreviewChecker />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SocialBanner;
