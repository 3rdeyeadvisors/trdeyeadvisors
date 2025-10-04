import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check } from "lucide-react";
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
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Group variants by color
  const variantsByColor = product.variants?.reduce((acc: any, variant: any) => {
    const [color, size] = variant.title.split(' / ');
    if (!acc[color]) {
      acc[color] = [];
    }
    acc[color].push({ ...variant, color, size });
    return acc;
  }, {});

  const colors = Object.keys(variantsByColor || {});
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  
  // Get sizes for selected color
  const availableSizes = variantsByColor?.[selectedColor] || [];
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]?.size);

  // Update selected variant when color or size changes
  const updateSelectedVariant = (color: string, size: string) => {
    const variant = product.variants?.find((v: any) => 
      v.title === `${color} / ${size}`
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

  // Initialize first variant
  if (!selectedVariant && availableSizes.length > 0) {
    const firstVariant = product.variants?.find((v: any) => 
      v.title === `${selectedColor} / ${selectedSize}`
    );
    if (firstVariant) {
      setSelectedVariant(firstVariant);
      // Set the correct image for the first variant
      const colorImageIndex = product.images?.findIndex((img: any) => 
        img.variant_ids?.includes(firstVariant.id)
      );
      if (colorImageIndex !== -1) {
        setCurrentImageIndex(colorImageIndex);
      }
    }
  }

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

  return (
    <Card className="group overflow-hidden border-2 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-background">
        <img
          src={currentImage?.src || product.images?.[0]?.src}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.tags?.includes('Premium Apparel') && (
          <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur">
            Premium
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{product.title}</h3>
          {product.description && (
            <div 
              className="text-sm text-muted-foreground line-clamp-3"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </div>

        {/* Color Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Color</label>
          <Select value={selectedColor} onValueChange={handleColorChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Size Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Size</label>
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

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-2xl font-bold text-primary">
              ${selectedVariant?.price.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedColor} / {selectedSize}
            </p>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || inCart}
            className="gap-2"
          >
            {inCart ? (
              <>
                <Check className="h-4 w-4" />
                In Cart
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {product.tags.slice(0, 3).map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
