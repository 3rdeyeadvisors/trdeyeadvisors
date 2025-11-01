import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, Tag, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CartItem = ({ item }: { item: any }) => {
  const { removeItem, updateQuantity, addItem } = useCart();
  const [productData, setProductData] = useState<any>(null);
  const [variantUpdated, setVariantUpdated] = useState(false);

  useEffect(() => {
    const loadProductData = async () => {
      if (item.type === "merchandise" && item.printify_product_id) {
        const { data } = await supabase
          .from('printify_products')
          .select('*')
          .eq('printify_id', item.printify_product_id)
          .single();
        
        if (data) {
          setProductData(data);
        }
      }
    };
    loadProductData();
  }, [item]);

  const handleVariantChange = (newVariantId: string) => {
    if (!productData) return;
    
    const newVariant = productData.variants.find((v: any) => v.id.toString() === newVariantId);
    if (!newVariant) return;

    const [color, size] = newVariant.title.split(' / ');
    
    // Remove old item and add new one with updated variant
    const currentQuantity = item.quantity;
    removeItem(item.id);
    
    // Add the new variant item the same number of times as the old quantity
    for (let i = 0; i < currentQuantity; i++) {
      addItem({
        id: `${item.printify_product_id}-${newVariant.id}`,
        printify_id: item.printify_product_id,
        printify_product_id: item.printify_product_id,
        variant_id: newVariant.id,
        title: item.title,
        price: newVariant.price,
        type: "merchandise",
        category: "Apparel",
        color: color,
        size: size,
        image: productData.images?.[0]?.src,
      });
    }

    setVariantUpdated(true);
    setTimeout(() => setVariantUpdated(false), 2000);
  };

  const isMerchandise = item.type === "merchandise" && productData;

  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Image */}
        {item.image && (
          <img 
            src={item.image} 
            alt={item.title}
            className="w-20 h-20 object-cover rounded-md flex-shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-consciousness font-semibold text-foreground mb-1 truncate">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground font-consciousness mb-2">
            {item.category} • {item.type}
          </p>

          {/* Variant Selectors for Merchandise */}
          {isMerchandise && (
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <Select 
                value={item.variant_id?.toString()} 
                onValueChange={handleVariantChange}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-9">
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  {productData.variants?.map((variant: any) => (
                    <SelectItem key={variant.id} value={variant.id.toString()}>
                      {variant.title} - ${variant.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {variantUpdated && (
                <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                  <Check className="w-4 h-4" />
                  Updated
                </span>
              )}
            </div>
          )}

          <p className="text-lg font-consciousness font-semibold text-primary">
            ${typeof item.price === 'string' ? item.price : item.price.toFixed(2)}
          </p>
        </div>

        <div className="flex md:flex-col items-center gap-3 justify-between md:justify-start">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="h-8 w-8"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-8 text-center font-consciousness font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="h-8 w-8"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const Cart = () => {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    
    try {
      const { data, error } = await supabase.rpc('validate_discount_code', {
        _code: discountCode.toUpperCase(),
        _amount: Math.floor(total),
        _product_type: 'all'
      }).single();

      if (error) throw error;

      if (data?.is_valid) {
        setDiscountApplied(true);
        setDiscountAmount(data.discount_amount);
        toast.success(data.message);
      } else {
        toast.error(data?.message || "Invalid discount code");
      }
    } catch (error) {
      console.error('Error validating discount:', error);
      toast.error("Failed to validate discount code");
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    console.log('Checkout clicked! Items:', items);
    setIsLoading(true);
    try {
      console.log('Calling checkout function...');
      const { data, error } = await supabase.functions.invoke('create-cart-checkout', {
        body: {
          items: items.map(item => ({
            id: item.id,
            title: item.title,
            price: typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price,
            quantity: item.quantity,
            type: item.type,
            category: item.category,
            images: item.images,
            printify_id: item.printify_id,
            printify_product_id: item.printify_product_id || item.printify_id,
            variant_id: item.variant_id,
            color: item.color,
            size: item.size,
            image: item.image
          })),
          discountCode: discountApplied ? discountCode : null
        }
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Function returned error:', error);
        throw error;
      }

      // Open Stripe checkout
      if (data?.url) {
        console.log('Opening checkout URL:', data.url);
        // Directly redirect to checkout URL in the same window for reliability
        window.location.href = data.url;
      } else {
        console.error('No URL received from function:', data);
        toast.error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to create checkout session');
    } finally {
      setIsLoading(false);
    }
  };

  const finalTotal = discountApplied ? Math.max(0, total - discountAmount) : total;

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 mobile-typography-center">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-consciousness font-bold text-foreground mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground font-consciousness mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. 
              Explore our store to find digital products and merchandise.
            </p>
            <Link to="/store">
              <Button variant="cosmic" className="font-consciousness">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 mobile-typography-center">
        <h2 className="text-4xl md:text-5xl font-consciousness font-bold text-foreground mb-8">
          Shopping Cart
        </h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => <CartItem key={item.id} item={item} />)}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-consciousness font-bold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="font-consciousness text-muted-foreground">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-consciousness font-medium">
                      ${((typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Discount Code Section */}
              <div className="border-t pt-4 mb-4">
                <Label htmlFor="discount" className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4" />
                  <span className="font-consciousness">Discount Code</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="discount"
                    placeholder="Enter code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    disabled={discountApplied}
                    className="uppercase"
                  />
                  <Button 
                    onClick={handleApplyDiscount}
                    variant={discountApplied ? "secondary" : "outline"}
                    disabled={discountApplied || !discountCode.trim()}
                  >
                    {discountApplied ? "Applied" : "Apply"}
                  </Button>
                </div>
                {discountApplied && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    Discount of ${discountAmount.toFixed(2)} applied!
                  </p>
                )}
              </div>

              <div className="border-t pt-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-consciousness text-muted-foreground">Subtotal</span>
                  <span className="font-consciousness">${total.toFixed(2)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span className="font-consciousness">Discount</span>
                    <span className="font-consciousness">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg border-t pt-2">
                  <span className="font-consciousness font-bold text-foreground">Total</span>
                  <span className="font-consciousness font-bold text-primary">${finalTotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground font-consciousness mt-2">
                  * Taxes will be calculated at checkout
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="cosmic"
                  className="w-full font-consciousness"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Proceed to Checkout"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full font-consciousness"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>

                <Link to="/store">
                  <Button variant="ghost" className="w-full font-consciousness">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;