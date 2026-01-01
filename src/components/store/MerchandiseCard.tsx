import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MerchandiseCardProps {
  product: any;
  onAddToCart: (product: any) => void;
  isInCart: (productId: string | number) => boolean;
}

export function MerchandiseCard({ product, onAddToCart, isInCart }: MerchandiseCardProps) {
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Check if product has color/size variants or single variant
  const hasSizeVariants = product.variants?.some((v: any) => v.title.includes(' / '));
  
  // Known sizes to detect format (Size / Color vs Color / Size)
  const knownSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', 'One size', 'One Size'];
  
  // Detect if format is "Size / Color" or "Color / Size" by checking first part of first variant
  const detectFormat = (variants: any[]) => {
    if (!variants?.length) return 'color-first';
    const firstTitle = variants[0]?.title || '';
    const [firstPart] = firstTitle.split(' / ');
    // If first part is a known size, it's "Size / Color" format
    return knownSizes.includes(firstPart) ? 'size-first' : 'color-first';
  };
  
  const variantFormat = hasSizeVariants ? detectFormat(product.variants) : 'color-first';
  
  // Group variants by color (only if has size variants)
  const variantsByColor = hasSizeVariants 
    ? product.variants?.reduce((acc: any, variant: any) => {
        const parts = variant.title.split(' / ');
        const color = variantFormat === 'size-first' ? parts[1] : parts[0];
        const size = variantFormat === 'size-first' ? parts[0] : parts[1];
        if (!acc[color]) {
          acc[color] = [];
        }
        acc[color].push({ ...variant, color, size });
        return acc;
      }, {})
    : null;

  const colors = variantsByColor ? Object.keys(variantsByColor) : [];
  const defaultColor = colors[0] || '';
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  
  // Get sizes for selected color
  const availableSizes = variantsByColor?.[selectedColor] || [];
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]?.size || '');

  // Update selected variant when color or size changes
  const updateSelectedVariant = (color: string, size: string) => {
    // Match based on detected format
    const expectedTitle = variantFormat === 'size-first' 
      ? `${size} / ${color}` 
      : `${color} / ${size}`;
    const variant = product.variants?.find((v: any) => 
      v.title === expectedTitle
    );
    setSelectedVariant(variant);
    
    // Update image based on color
    const colorImageIndex = product.images?.findIndex((img: any) => 
      img.variant_ids?.includes(variant?.id)
    );
    if (colorImageIndex !== -1) {
      setCurrentImageIndex(colorImageIndex);
    }
  };

  // Initialize first variant on mount
  useEffect(() => {
    if (selectedVariant) return;
    
    // For single-variant products (like journals), just use the first variant
    if (!hasSizeVariants && product.variants?.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedVariant(firstVariant);
    } else if (availableSizes.length > 0) {
      const expectedTitle = variantFormat === 'size-first'
        ? `${selectedSize} / ${selectedColor}`
        : `${selectedColor} / ${selectedSize}`;
      const firstVariant = product.variants?.find((v: any) => 
        v.title === expectedTitle
      );
      if (firstVariant) {
        setSelectedVariant(firstVariant);
      }
    }
  }, [product.variants, hasSizeVariants, variantFormat, selectedSize, selectedColor, availableSizes.length, selectedVariant]);

  // Update image when variant changes
  useEffect(() => {
    if (selectedVariant && product.images) {
      const colorImageIndex = product.images.findIndex((img: any) => 
        img.variant_ids?.includes(selectedVariant.id)
      );
      if (colorImageIndex !== -1) {
        setCurrentImageIndex(colorImageIndex);
      }
    }
  }, [selectedVariant, product.images]);

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
    
    onAddToCart({
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
      image: product.images?.[currentImageIndex]?.src || product.images?.[0]?.src,
      quantity: 1,
    });
  };

  const currentImage = product.images?.[currentImageIndex];
  const inCart = selectedVariant && isInCart(`${product.printify_id}-${selectedVariant.id}`);

  const handleCardClick = () => {
    navigate(`/store/merchandise/${product.printify_id}`);
  };

  return (
    <Card className="group overflow-hidden border bg-card/50 backdrop-blur hover:border-primary/40 transition-all duration-300 flex flex-col h-full">
      {/* Product Image - Clickable */}
      <div 
        className="relative aspect-square overflow-hidden bg-background cursor-pointer"
        onClick={handleCardClick}
      >
        <img
          src={currentImage?.src || product.images?.[0]?.src}
          alt={product.title}
          loading="lazy"
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Product Name - Clickable */}
        <div className="mb-2 sm:mb-3">
          <h3 
            onClick={handleCardClick}
            className="text-xs sm:text-sm md:text-base font-consciousness font-semibold mb-1 sm:mb-2 line-clamp-3 sm:line-clamp-2 min-h-[3.5rem] sm:min-h-[3rem] cursor-pointer hover:text-primary transition-colors text-left leading-snug"
          >
            {product.title}
          </h3>
        </div>

        {/* Compact Variant Selector - only show if product has variants with sizes */}
        {hasSizeVariants ? (
          <div className="space-y-1.5 mb-2">
            <Select 
              value={`${selectedColor} / ${selectedSize}`} 
              onValueChange={(value) => {
                const [color, size] = value.split(' / ');
                setSelectedColor(color);
                setSelectedSize(size);
                updateSelectedVariant(color, size);
              }}
            >
              <SelectTrigger className="w-full h-8 md:h-9 text-xs">
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((color) => (
                  <div key={color}>
                    {variantsByColor[color].map((variant: any) => (
                      <SelectItem 
                        key={variant.id} 
                        value={`${color} / ${variant.size}`} 
                        className="text-xs"
                      >
                        {color} / {variant.size}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          /* Single variant label for products without size options */
          <div className="h-8 md:h-9 mb-2 flex items-center justify-center">
            <span className="text-xs text-muted-foreground font-consciousness">One Size</span>
          </div>
        )}

        {/* Price & Buttons */}
        <div className="flex flex-col gap-1.5 mt-auto pt-2 border-t border-border/50">
          <p className="text-lg md:text-2xl font-consciousness font-bold text-primary text-center">
            ${selectedVariant?.price?.toFixed(2) || '0.00'}
          </p>
          
          {/* View Details Button */}
          <Button
            onClick={handleCardClick}
            variant="outline"
            className="gap-1.5 w-full h-8 md:h-10 text-xs font-consciousness"
            size="sm"
          >
            <Eye className="h-3 md:h-4 w-3 md:w-4" />
            <span className="hidden md:inline">View Details</span>
            <span className="md:hidden">Details</span>
          </Button>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || inCart}
            className="gap-1.5 w-full h-8 md:h-10 text-xs font-consciousness"
            size="sm"
          >
            {inCart ? (
              <>
                <Check className="h-3 md:h-4 w-3 md:w-4" />
                <span className="hidden md:inline">In Cart</span>
                <span className="md:hidden">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3 md:h-4 w-3 md:w-4" />
                <span className="hidden md:inline">Add to Cart</span>
                <span className="md:hidden">Add</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
