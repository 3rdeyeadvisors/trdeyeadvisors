import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Download, Package, FileText, Calculator, TrendingUp } from "lucide-react";

const Store = () => {
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
                    <Button variant="cosmic" className="font-consciousness">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
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
                    <Button variant="awareness" className="font-consciousness">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
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