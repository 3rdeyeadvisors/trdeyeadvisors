import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MerchandiseDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Group variants by color
  const variants = (product?.variants as any[]) || [];
  const variantsByColor = variants.reduce((acc: any, variant: any) => {
    const [color, size] = variant.title.split(' / ');
    if (!acc[color]) {
      acc[color] = [];
    }
    acc[color].push({ ...variant, color, size });
    return acc;
  }, {});

  const colors = Object.keys(variantsByColor || {});
  const defaultColor = colors.includes('White') ? 'White' : colors[0];
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  
  const availableSizes = variantsByColor?.[selectedColor] || [];
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]?.size);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('printify_products')
        .select('*')
        .eq('printify_id', productId)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      
      setProduct(data);
      
      // Initialize variant selection
      const productVariants = (data?.variants as any[]) || [];
      const productImages = (data?.images as any[]) || [];
      
      if (productVariants.length > 0) {
        const variantsByColor = productVariants.reduce((acc: any, variant: any) => {
          const [color, size] = variant.title.split(' / ');
          if (!acc[color]) {
            acc[color] = [];
          }
          acc[color].push({ ...variant, color, size });
          return acc;
        }, {});
        
        const colors = Object.keys(variantsByColor || {});
        const defaultColor = colors.includes('White') ? 'White' : colors[0];
        setSelectedColor(defaultColor);
        
        const firstVariant = productVariants.find((v: any) => 
          v.title.startsWith(defaultColor)
        );
        if (firstVariant) {
          const [, size] = firstVariant.title.split(' / ');
          setSelectedSize(size);
          setSelectedVariant(firstVariant);
          
          // Set the correct image for the first variant
          const colorImageIndex = productImages.findIndex((img: any) => 
            img.variant_ids?.includes(firstVariant.id)
          );
          if (colorImageIndex !== -1) {
            setCurrentImageIndex(colorImageIndex);
          }
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
      navigate('/store');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSelectedVariant = (color: string, size: string) => {
    const productVariants = (product?.variants as any[]) || [];
    const productImages = (product?.images as any[]) || [];
    
    const variant = productVariants.find((v: any) => 
      v.title === `${color} / ${size}`
    );
    setSelectedVariant(variant);
    
    // Update image based on color
    const colorImageIndex = productImages.findIndex((img: any) => 
      img.variant_ids?.includes(variant?.id)
    );
    if (colorImageIndex !== -1) {
      setCurrentImageIndex(colorImageIndex);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const newSizes = variantsByColor?.[color] || [];
    const newSize = newSizes[0]?.size;
    setSelectedSize(newSize);
    updateSelectedVariant(color, newSize);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    updateSelectedVariant(selectedColor, size);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    const productImages = (product?.images as any[]) || [];
    
    addItem({
      id: `${product.printify_id}-${selectedVariant.id}`,
      printify_id: product.printify_id,
      printify_product_id: product.printify_id,
      variant_id: selectedVariant.id,
      title: product.title,
      price: selectedVariant.price,
      type: "merchandise",
      category: "Apparel",
      color: selectedColor,
      size: selectedSize,
      image: productImages[currentImageIndex]?.src || productImages[0]?.src,
    });
    
    toast.success(`${product.title} added to cart!`);
  };

  const nextImage = () => {
    const productImages = (product?.images as any[]) || [];
    if (productImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }
  };

  const prevImage = () => {
    const productImages = (product?.images as any[]) || [];
    if (productImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    }
  };

  const inCart = selectedVariant && items.some(item => item.id === `${product.printify_id}-${selectedVariant.id}`);

  if (isLoading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-8" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/4" />
                <div className="h-32 bg-muted rounded" />
                <div className="h-12 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const productImages = (product?.images as any[]) || [];
  const productDescription = typeof product?.description === 'string' ? product.description : '';

  return (
    <>
      <SEO 
        title={`${product.title} | 3rdeyeadvisors Store`}
        description={productDescription.replace(/<[^>]*>/g, '') || `Premium merchandise: ${product.title}`}
        keywords={`${product.title}, DeFi merchandise, crypto apparel, blockchain clothing`}
        url={`https://www.the3rdeyeadvisors.com/store/merchandise/${productId}`}
        type="product"
        image={productImages[0]?.src}
      />
      
      <div className="min-h-screen py-20 w-full overflow-x-hidden">
        <div className="container mx-auto px-4 w-full max-w-7xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/store')}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Store
          </Button>

          {/* Product Detail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 w-full">
            {/* Image Gallery */}
            <div className="space-y-4">
              <Card className="overflow-hidden">
                <div className="relative aspect-square bg-background">
                  <img
                    src={productImages[currentImageIndex]?.src || productImages[0]?.src}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {productImages.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {product.tags?.includes('Premium Apparel') && (
                    <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur">
                      Premium
                    </Badge>
                  )}
                </div>
              </Card>

              {/* Thumbnail Navigation */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {productImages.map((image: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden transition-all ${
                        index === currentImageIndex
                          ? 'border-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={`${product.title} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4 sm:space-y-6 w-full">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-consciousness font-bold mb-3 sm:mb-4 break-words">
                  {product.title}
                </h1>
                <p className="text-3xl font-consciousness font-bold text-primary">
                  ${selectedVariant?.price.toFixed(2)}
                </p>
              </div>

              {/* Description */}
              {productDescription && (
                <div 
                  className="text-muted-foreground prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: productDescription }}
                />
              )}

              {/* Variant Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-consciousness font-medium mb-2">
                    Color: <span className="text-foreground">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleColorChange(color)}
                        className="min-w-[80px]"
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-consciousness font-medium mb-2">
                    Size: <span className="text-foreground">{selectedSize}</span>
                  </label>
                  <Select value={selectedSize} onValueChange={handleSizeChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSizes.map((variant: any) => (
                        <SelectItem key={variant.id} value={variant.size}>
                          {variant.size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant || inCart}
                className="w-full gap-2 h-11 sm:h-12 text-sm sm:text-base font-consciousness touch-manipulation"
                size="lg"
              >
                {inCart ? (
                  <>
                    <Check className="h-5 w-5" />
                    In Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>

              {/* Product Details */}
              <Card className="p-4 bg-secondary/40">
                <h3 className="font-consciousness font-semibold mb-2">Product Details</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Premium quality materials</li>
                  <li>• 5-7 business day processing and shipping</li>
                  <li>• Secure payment processing</li>
                  <li>• Multiple colors and sizes available</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
