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
      const prompt = `Premium 3EA social share banner that matches the site palette. Dark cosmic background matching token --background (hsl 222 84% 4.9%) with a subtle gradient into deep navy; accents and glows ONLY in electric cosmic blue matching token --primary (hsl 217 91% 60%). Absolutely no purple or magenta tones. Subtle tech grid and a few faint interconnected nodes in blue. Center a crisp, high-contrast wordmark with ONLY the exact text: 3rdeyeadvisors (all lowercase), geometric sans similar to Orbitron/Inter, sharp edges. No other words or small text. Minimalist composition with generous safe margins for social cropping. 1792x1024, ultra high resolution.`;

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
        
        // Auto-save to storage for social sharing
        const base64Data = data.data[0].b64_json;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const file = new File([byteArray], '3ea-social-banner.webp', { type: 'image/webp' });
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('social-banners')
          .upload('3ea-social-banner.webp', file, { upsert: true });
          
        if (uploadError) {
          console.error('Upload error:', uploadError);
        }
        
        toast({
          title: "Social banner generated!",
          description: "Your banner is ready and social sharing is now active!",
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
              alt="3EA Social Share Banner — 3rdeyeadvisors wordmark"
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