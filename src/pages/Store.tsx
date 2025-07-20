import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Download, Package, FileText, Calculator, TrendingUp, CheckCircle, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Store = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [purchasedProduct, setPurchasedProduct] = useState<string>("");

  // Check for success/cancel parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');
    const product = urlParams.get('product');

    if (success && product) {
      setShowSuccessMessage(true);
      setPurchasedProduct(decodeURIComponent(product));
      toast.success(`Payment successful! Thank you for purchasing ${decodeURIComponent(product)}`);
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (canceled) {
      toast.error("Payment was canceled");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handlePurchase = async (product: any) => {
    setIsLoading(true);
    try {
      const priceNumber = parseInt(product.price.replace('$', ''));
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          productId: product.id,
          productName: product.title,
          price: priceNumber
        }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Failed to create payment session');
    } finally {
      setIsLoading(false);
    }
  };

  const digitalProducts = [
    {
      id: 1,
      title: "Complete DeFi Mastery eBook",
      description: "200+ page comprehensive guide covering every aspect of decentralized finance",
      price: "$47",
      type: "digital",
      category: "eBook",
      icon: FileText,
      features: ["200+ pages", "12 chapters", "Case studies", "Lifetime updates"]
    },
    {
      id: 2,
      title: "DeFi Portfolio Tracker Template",
      description: "Excel/Google Sheets template for tracking your DeFi positions and yields",
      price: "$27",
      type: "digital",
      category: "Template",
      icon: Calculator,
      features: ["Multi-chain support", "Auto calculations", "Risk assessment", "Tax reporting"]
    },
    {
      id: 3,
      title: "Yield Farming Strategy Guide",
      description: "Advanced strategies and frameworks for sustainable yield generation",
      price: "$67",
      type: "digital",
      category: "Guide",
      icon: TrendingUp,
      features: ["10 proven strategies", "Risk frameworks", "ROI calculators", "Video tutorials"]
    }
  ];

  const merchandise = [
    {
      id: 4,
      title: "3rdeyeadvisors Cosmic Hoodie",
      description: "Premium quality hoodie with subtle consciousness-inspired design",
      price: "$89",
      type: "merchandise",
      category: "Apparel",
      icon: Package,
      features: ["100% organic cotton", "Unisex fit", "Embroidered logo", "Multiple colors"]
    },
    {
      id: 5,
      title: "\"Rewrite the System\" T-Shirt",
      description: "Minimalist tee with our core philosophy printed in cosmic style",
      price: "$34",
      type: "merchandise",
      category: "Apparel",
      icon: Package,
      features: ["Soft cotton blend", "Screen printed", "Size XS-3XL", "Black/Navy options"]
    },
    {
      id: 6,
      title: "DeFi Awareness Sticker Pack",
      description: "Set of 12 consciousness-themed stickers for laptops and devices",
      price: "$12",
      type: "merchandise",
      category: "Accessories",
      icon: Package,
      features: ["12 unique designs", "Waterproof vinyl", "Matte finish", "3\" average size"]
    }
  ];

  const allProducts = [...digitalProducts, ...merchandise];

  const getProductIcon = (product: any) => {
    return product.icon;
  };

  const getTypeColor = (type: string) => {
    return type === "digital" 
      ? "bg-primary/20 text-primary border-primary/30"
      : "bg-accent/20 text-accent border-accent/30";
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-consciousness font-bold text-foreground mb-4">
            Store
          </h1>
          <p className="text-xl text-muted-foreground font-consciousness max-w-2xl mx-auto">
            Digital resources and consciousness-inspired merchandise to support your journey
          </p>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <Card className="mb-8 p-6 bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-consciousness font-semibold text-green-800 dark:text-green-200">
                    Purchase Successful!
                  </h3>
                  <p className="text-green-700 dark:text-green-300 font-consciousness">
                    Thank you for purchasing "{purchasedProduct}". You should receive your digital product via email shortly.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuccessMessage(false)}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Digital Products Section */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <Download className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-consciousness font-bold text-foreground">
              Digital Products
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {digitalProducts.map((product, index) => {
              const ProductIcon = getProductIcon(product);
              return (
                <Card 
                  key={product.id}
                  className="p-6 bg-card/60 border-border hover:border-primary/40 transition-all duration-cosmic hover:shadow-consciousness group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <ProductIcon className="w-8 h-8 text-primary group-hover:text-primary-glow transition-colors" />
                    <Badge className={getTypeColor(product.type)}>
                      {product.category}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-consciousness font-semibold text-foreground mb-3">
                    {product.title}
                  </h3>
                  
                  <p className="text-muted-foreground font-consciousness mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-sm font-consciousness font-medium text-foreground mb-2">
                      Includes:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-consciousness font-bold text-primary">
                      {product.price}
                    </span>
                    <Button 
                      variant="cosmic" 
                      className="font-consciousness"
                      onClick={() => handlePurchase(product)}
                      disabled={isLoading}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {isLoading ? "Processing..." : "Buy Now"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Merchandise Section */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <Package className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-consciousness font-bold text-foreground">
              Merchandise
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {merchandise.map((product, index) => {
              const ProductIcon = getProductIcon(product);
              return (
                <Card 
                  key={product.id}
                  className="p-6 bg-card/60 border-border hover:border-accent/40 transition-all duration-cosmic hover:shadow-consciousness group"
                  style={{ animationDelay: `${(digitalProducts.length + index) * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <ProductIcon className="w-8 h-8 text-accent group-hover:text-accent-glow transition-colors" />
                    <Badge className={getTypeColor(product.type)}>
                      {product.category}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-consciousness font-semibold text-foreground mb-3">
                    {product.title}
                  </h3>
                  
                  <p className="text-muted-foreground font-consciousness mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-sm font-consciousness font-medium text-foreground mb-2">
                      Features:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-accent rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-consciousness font-bold text-accent">
                      {product.price}
                    </span>
                    <Button 
                      variant="awareness" 
                      className="font-consciousness"
                      onClick={() => handlePurchase(product)}
                      disabled={isLoading}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {isLoading ? "Processing..." : "Buy Now"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Payment Info */}
        <Card className="mt-16 p-6 bg-secondary/40 border-border">
          <div className="text-center">
            <h3 className="text-lg font-consciousness font-semibold text-foreground mb-3">
              Secure Payment Processing
            </h3>
            <p className="text-muted-foreground font-consciousness leading-relaxed">
              All digital products are delivered instantly via email. Merchandise is fulfilled through 
              our print-on-demand partners with 5-7 business day processing time. We accept all major 
              payment methods including crypto payments.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Store;