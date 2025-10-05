import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Download, Package, FileText, Calculator, TrendingUp, CheckCircle, X, Plus, RefreshCw, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import SEO from "@/components/SEO";
import { MerchandiseCard } from "@/components/store/MerchandiseCard";

const Store = () => {
  const { addItem, items } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [purchasedProduct, setPurchasedProduct] = useState<string>("");
  const [printifyProducts, setPrintifyProducts] = useState<any[]>([]);
  const [digitalProducts] = useState([
    {
      id: 1,
      title: "Complete DeFi Mastery eBook",
      description: "200+ page comprehensive guide covering every aspect of decentralized finance",
      price: 47,
      type: "digital",
      category: "eBook",
      icon: FileText,
      features: ["200+ pages", "12 chapters", "Case studies", "Lifetime updates"],
      files: ["Complete DeFi eBook (PDF)", "Quick Reference Card (PDF)"]
    },
    {
      id: 2,
      title: "DeFi Portfolio Tracker Template",
      description: "Excel/Google Sheets template for tracking your DeFi positions and yields",
      price: 27,
      type: "digital",
      category: "Template",
      icon: Calculator,
      features: ["Multi-chain support", "Auto calculations", "Risk assessment", "Tax reporting"],
      files: ["Portfolio Tracker (Excel)", "Setup Guide (PDF)"]
    },
    {
      id: 3,
      title: "Yield Farming Strategy Guide",
      description: "Advanced strategies and frameworks for sustainable yield generation",
      price: 67,
      type: "digital",
      category: "Guide",
      icon: TrendingUp,
      features: ["10 proven strategies", "Risk frameworks", "ROI calculators", "Guided tutorials"],
      files: ["Strategy Guide (PDF)", "ROI Calculator (Excel)"]
    }
  ]);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id || product.printify_id,
      title: product.title,
      price: typeof product.price === 'string' ? parseFloat(product.price.replace('$', '')) : product.price,
      type: product.type,
      category: product.category,
      printify_id: product.printify_id,
      variants: product.variants,
      images: product.images
    });
    toast.success(`${product.title} added to cart!`);
  };

  const syncPrintifyProducts = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-printify-products');
      
      if (error) throw error;
      
      toast.success(`Synced ${data.synced} products from Printify!`);
      loadPrintifyProducts();
    } catch (error) {
      console.error('Error syncing Printify products:', error);
      toast.error('Failed to sync Printify products');
    } finally {
      setIsSyncing(false);
    }
  };

  const loadPrintifyProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('printify_products')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      
      const formattedProducts = data?.map(product => ({
        ...product,
        id: product.printify_id,
        price: product.variants?.[0]?.price || 0,
        type: "merchandise",
        category: "Apparel",
        icon: Package,
        features: Array.isArray(product.variants) ? product.variants.map((v: any) => `${v.title} - $${v.price}`) : []
      })) || [];
      
      setPrintifyProducts(formattedProducts);
    } catch (error) {
      console.error('Error loading Printify products:', error);
    }
  };

  const isInCart = (productId: string | number) => {
    return items.some(item => item.id == productId || item.id == productId.toString());
  };

  // Load products on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');

    if (success) {
      setShowSuccessMessage(true);
      toast.success("Payment successful! Thank you for your purchase!");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (canceled) {
      toast.error("Payment was canceled");
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    setIsLoading(true);
    loadPrintifyProducts().finally(() => setIsLoading(false));
  }, []);

  const allProducts = [...digitalProducts, ...printifyProducts];

  const getProductIcon = (product: any) => {
    return product.icon;
  };

  const getTypeColor = (type: string) => {
    return type === "digital" 
      ? "bg-primary/20 text-primary border-primary/30"
      : "bg-accent/20 text-accent border-accent/30";
  };

  return (
    <>
      <SEO 
        title="DeFi Education Store | 3rdeyeadvisors"
        description="Premium DeFi courses, guides, and educational materials. Get access to expert cryptocurrency training and blockchain education resources."
        keywords="DeFi courses, crypto education store, blockchain training materials, DeFi guides"
        url="https://www.the3rdeyeadvisors.com/store"
        type="website"
      />
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 mobile-typography-center">
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
                      Thank you for your purchase! Your cart has been cleared and you should receive your digital products via email shortly.
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
          <section className="mb-16" aria-labelledby="digital-products-heading">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-8 text-center md:text-left">
              <Download className="w-8 h-8 text-primary flex-shrink-0" aria-hidden="true" />
              <div>
                <h2 id="digital-products-heading" className="text-3xl font-consciousness font-bold text-foreground">
                  Digital Products
                </h2>
                <p className="text-sm text-muted-foreground font-consciousness mt-1">
                  Premium guides and tools for DeFi mastery
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {digitalProducts.map((product, index) => {
                const ProductIcon = getProductIcon(product);
                return (
                   <Card 
                     key={product.id}
                     className="p-6 bg-card/60 border-border hover:border-primary/40 transition-all duration-cosmic hover:shadow-consciousness group text-center md:text-left"
                     style={{ animationDelay: `${index * 0.1}s` }}
                   >
                     <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between mb-4 gap-3 md:gap-0">
                       <ProductIcon className="w-8 h-8 text-primary group-hover:text-primary-glow transition-colors" />
                       <Badge className={`${getTypeColor(product.type)} mx-auto md:mx-0`}>
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
                           <li key={idx} className="flex items-center justify-center md:justify-start gap-2">
                             <div className="w-1 h-1 bg-primary rounded-full"></div>
                             {feature}
                           </li>
                         ))}
                       </ul>
                     </div>
                     
                      <div className="flex flex-col md:flex-row items-center md:justify-between gap-3 md:gap-0">
                        <span className="text-2xl font-consciousness font-bold text-primary">
                          ${typeof product.price === 'string' ? product.price : product.price.toFixed(2)}
                        </span>
                       <Button 
                         variant={isInCart(product.id) ? "outline" : "cosmic"}
                         className="font-consciousness w-full md:w-auto"
                         onClick={() => handleAddToCart(product)}
                       >
                         <Plus className="w-4 h-4 mr-2" />
                         {isInCart(product.id) ? "Add Another" : "Add to Cart"}
                       </Button>
                     </div>
                   </Card>
                );
              })}
            </div>
          </section>

          {/* Merchandise Section */}
          <section className="mb-16" aria-labelledby="merchandise-heading">
            <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6 mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
                <Package className="w-8 h-8 text-primary flex-shrink-0" aria-hidden="true" />
                <div>
                  <h2 id="merchandise-heading" className="text-3xl font-consciousness font-bold text-foreground">
                    Merchandise
                  </h2>
                  <p className="text-sm text-muted-foreground font-consciousness mt-1">
                    Consciousness-inspired premium apparel
                  </p>
                </div>
              </div>
              <Button 
                onClick={syncPrintifyProducts} 
                disabled={isSyncing}
                variant="outline"
                size="sm"
                className="gap-2 font-consciousness w-full md:w-auto touch-target"
                aria-label="Sync merchandise products"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} aria-hidden="true" />
                {isSyncing ? 'Syncing...' : 'Sync Products'}
              </Button>
            </div>

            {(() => {
              const filteredProducts = printifyProducts.filter(
                product => product.printify_id === '6844ba70f6f4da591706ef43'
              );

              if (isLoading) {
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="overflow-hidden animate-pulse">
                        <div className="aspect-square bg-muted" />
                        <div className="p-6 space-y-4">
                          <div className="h-6 bg-muted rounded w-3/4" />
                          <div className="h-4 bg-muted rounded w-full" />
                          <div className="h-4 bg-muted rounded w-2/3" />
                          <div className="flex justify-between items-center pt-4">
                            <div className="h-8 bg-muted rounded w-20" />
                            <div className="h-10 bg-muted rounded w-32" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                );
              }

              if (filteredProducts.length === 0) {
                return (
                  <Card className="p-12 text-center border-2 bg-card/50 backdrop-blur">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                    <h3 className="text-xl font-consciousness font-semibold mb-2">
                      No Merchandise Available
                    </h3>
                    <p className="text-muted-foreground font-consciousness mb-6">
                      Check back soon for new products!
                    </p>
                    <Button 
                      onClick={syncPrintifyProducts} 
                      disabled={isSyncing}
                      variant="outline"
                      className="gap-2 font-consciousness touch-target"
                      aria-label="Sync merchandise products from Printify"
                    >
                      <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} aria-hidden="true" />
                      {isSyncing ? 'Syncing...' : 'Sync Products'}
                    </Button>
                  </Card>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product: any) => (
                    <MerchandiseCard 
                      key={product.id} 
                      product={product}
                      onAddToCart={handleAddToCart}
                      isInCart={isInCart}
                    />
                  ))}
                </div>
              );
            })()}
          </section>

          <Card className="mt-16 p-6 md:p-8 bg-secondary/40 border-border" role="region" aria-label="Payment information">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
              <Shield className="h-8 w-8 text-primary flex-shrink-0" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-consciousness font-semibold text-foreground mb-2">
                  Secure Payment Processing
                </h3>
                <p className="text-muted-foreground font-consciousness leading-relaxed">
                  All digital products are delivered instantly via email. Merchandise is automatically fulfilled with 5-7 business day processing and shipping. We accept all major payment methods.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Store;