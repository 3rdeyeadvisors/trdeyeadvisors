import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Download, Package, FileText, Calculator, TrendingUp, CheckCircle, X, Plus, RefreshCw, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/contexts/CartContext";
import SEO from "@/components/SEO";
import { MerchandiseCard } from "@/components/store/MerchandiseCard";

const Store = () => {
  const { addItem, items, clearCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [purchasedProduct, setPurchasedProduct] = useState<string>("");
  const [printifyProducts, setPrintifyProducts] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"merchandise" | "digital">("merchandise");
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
    console.log('Adding to cart:', product);
    
    // Ensure image is a string, not an array
    const imageUrl = product.image || 
                     (product.images?.[0]?.src) || 
                     (Array.isArray(product.images) ? product.images[0] : product.images);
    
    const cartItem = {
      id: product.id || product.printify_id,
      title: product.title,
      price: typeof product.price === 'string' ? parseFloat(product.price.replace('$', '')) : product.price,
      type: product.type,
      category: product.category,
      printify_id: product.printify_id,
      printify_product_id: product.printify_product_id || product.printify_id,
      variant_id: product.variant_id,
      color: product.color,
      size: product.size,
      image: imageUrl,
      variants: product.variants,
      images: product.images
    };
    
    console.log('Cart item being added:', cartItem);
    addItem(cartItem);
    toast.success(`${product.title} added to cart!`);
  };

  const syncPrintifyProducts = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-printify-products');
      
      if (error) throw error;
      
      toast.success(`Synced ${data.synced} products from Printify! Now syncing to Stripe...`);
      
      // Now sync to Stripe
      const { data: stripeData, error: stripeError } = await supabase.functions.invoke('sync-printify-to-stripe');
      
      if (stripeError) throw stripeError;
      
      if (stripeData.success) {
        toast.success(`${stripeData.synced} products synced to Stripe with images!`);
        loadPrintifyProducts();
      }
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

  // Check admin role
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      setIsAdmin(!!data);
    };

    checkAdminRole();
  }, [user]);

  // Load products on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');

    if (success) {
      setShowSuccessMessage(true);
      clearCart(); // Clear cart after successful payment
      toast.success("Payment successful! Thank you for your purchase!");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (canceled) {
      toast.error("Payment was canceled");
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    setIsLoading(true);
    loadPrintifyProducts().finally(() => setIsLoading(false));
  }, [clearCart]);

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
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-consciousness font-bold text-foreground mb-4">
              Store
            </h1>
            <p className="text-xl text-muted-foreground font-consciousness max-w-2xl mx-auto">
              Digital resources and consciousness-inspired merchandise to support your journey
            </p>
          </div>

          {/* Category Bar */}
          <div className="mb-8">
            <div className="flex justify-center gap-4 md:gap-8 px-4">
              <button
                onClick={() => setActiveCategory("merchandise")}
                className={`text-base md:text-lg font-consciousness pb-2 px-4 md:px-6 transition-all whitespace-nowrap ${
                  activeCategory === "merchandise"
                    ? "text-primary border-b-2 border-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Merchandise
              </button>
              <button
                onClick={() => setActiveCategory("digital")}
                className={`text-base md:text-lg font-consciousness pb-2 px-4 md:px-6 transition-all whitespace-nowrap ${
                  activeCategory === "digital"
                    ? "text-primary border-b-2 border-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Digital Products
              </button>
            </div>
            {/* Category Description */}
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground font-consciousness max-w-2xl mx-auto">
                {activeCategory === "merchandise" 
                  ? "Consciousness-inspired premium apparel"
                  : "Premium guides and tools for DeFi mastery"
                }
              </p>
            </div>
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
                      Thank you for your purchase! Check your email for order confirmation and delivery details.
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
          {activeCategory === "digital" && (
            <section className="mb-16" aria-labelledby="digital-products-heading">
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {digitalProducts.map((product, index) => {
                  const ProductIcon = getProductIcon(product);
                  return (
                     <Card 
                       key={product.id}
                       className="p-3 md:p-6 bg-card/50 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg group flex flex-col h-full"
                       style={{ animationDelay: `${index * 0.1}s` }}
                     >
                       <div className="flex items-center justify-center mb-3">
                         <Badge className={`${getTypeColor(product.type)} text-xs px-2 py-1`}>
                           {product.category}
                         </Badge>
                       </div>
                       
                       <div className="flex justify-center mb-2">
                         <ProductIcon className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:text-primary transition-colors" />
                       </div>
                       
                       <h3 className="text-xs md:text-base font-consciousness font-semibold text-center mb-2 line-clamp-2 min-h-[2rem] md:min-h-[2.5rem]">
                         {product.title}
                       </h3>
                       
                       <div className="relative mb-3 flex-1">
                         <div 
                           className="h-[100px] md:h-[140px] overflow-y-auto px-1 md:px-2 scrollbar-hide text-center"
                           style={{
                             maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                             WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                           }}
                         >
                           <p className="text-xs text-muted-foreground font-consciousness leading-relaxed mb-2">
                             {product.description}
                           </p>
                           <div className="mb-2">
                             <h4 className="text-xs font-consciousness font-medium mb-1">
                               Includes:
                             </h4>
                             <ul className="text-xs text-muted-foreground space-y-0.5">
                               {product.features.map((feature, idx) => (
                                 <li key={idx} className="flex items-center justify-center gap-1.5">
                                   <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></div>
                                   <span>{feature}</span>
                                 </li>
                               ))}
                             </ul>
                           </div>
                         </div>
                       </div>
                       
                       <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-border/50">
                         <span className="text-xl md:text-3xl font-consciousness font-bold text-primary text-center">
                           ${typeof product.price === 'string' ? product.price : product.price.toFixed(2)}
                         </span>
                        <Button 
                          variant={isInCart(product.id) ? "outline" : "cosmic"}
                          className="font-consciousness w-full text-xs md:text-sm h-9 md:h-10"
                          onClick={() => handleAddToCart(product)}
                        >
                          <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1.5" />
                          {isInCart(product.id) ? "Add Another" : "Add to Cart"}
                        </Button>
                      </div>
                     </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* Merchandise Section */}
          {activeCategory === "merchandise" && (
            <section className="mb-16" aria-labelledby="merchandise-heading">
            <div className="flex justify-end mb-8">
              {isAdmin && (
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
              )}
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
                    {isAdmin && (
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
                    )}
                  </Card>
                );
              }

              return (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
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
          )}


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