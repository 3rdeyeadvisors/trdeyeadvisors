import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, ImageIcon } from "lucide-react";

export const SocialBannerGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  // Auto-generate on component mount
  useEffect(() => {
    generateBanner();
  }, []);

  const generateBanner = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Futuristic decentralized learning hub design, glowing abstract network of soft bubble-like nodes connected by smooth lines, with a bold stylized '3EA' in the center, using deep purples (#5B21B6, #7C3AED), dark galaxy tones (#0A0B14, #1A1B2E), and subtle neon accents (#A855F7, #E879F9), minimal and clean layout, professional web3 aesthetic, inviting and trustworthy vibe for education and DeFi learning, smooth gradients, high-tech atmosphere, ultra high resolution, banner format 1792x1024`;

      const { data, error } = await supabase.functions.invoke('generate-social-banner', {
        body: {
          prompt,
          size: "1792x1024",
          quality: "high"
        }
      });

      if (error) throw error;

      if (data?.data?.[0]?.b64_json) {
        const imageUrl = `data:image/webp;base64,${data.data[0].b64_json}`;
        setGeneratedImage(imageUrl);
        toast({
          title: "Social banner generated!",
          description: "Your 3EA social share banner is ready.",
        });
      } else {
        throw new Error('No image data received');
      }
    } catch (error: any) {
      console.error('Error generating banner:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate social banner.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = '3ea-social-banner.webp';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your social banner is being downloaded.",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Generate Social Share Banner</h2>
        <p className="text-muted-foreground">
          Create a futuristic 3EA social share banner for your DeFi education platform
        </p>
        
        <Button 
          onClick={generateBanner}
          disabled={isGenerating}
          className="flex items-center space-x-2"
        >
          <ImageIcon className="w-4 h-4" />
          <span>{isGenerating ? "Generating..." : "Generate Banner"}</span>
        </Button>
      </div>

      {generatedImage && (
        <div className="space-y-4">
          <div className="relative bg-card rounded-lg overflow-hidden border">
            <img 
              src={generatedImage} 
              alt="3EA Social Share Banner"
              className="w-full h-auto"
            />
          </div>
          
          <div className="text-center">
            <Button 
              onClick={downloadImage}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Banner</span>
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            <p>Banner size: 1792x1024px (optimized for social media sharing)</p>
            <p>Perfect for Twitter, LinkedIn, Facebook, and other social platforms</p>
          </div>
        </div>
      )}
    </div>
  );
};