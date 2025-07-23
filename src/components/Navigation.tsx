import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut, User, ShoppingCart } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

const Navigation = () => {
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/philosophy", label: "Our Philosophy" },
    { path: "/courses", label: "Courses & Tools" },
    { path: "/tutorials", label: "Tutorials" },
    { path: "/blog", label: "Blog & Articles" },
    { path: "/resources", label: "Resource Hub" },
    { path: "/analytics", label: "Analytics" },
    { path: "/store", label: "Store" },
    { path: "/downloads", label: "Downloads" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-consciousness transition-all duration-cosmic hover:text-primary ${
                  isActive(item.path)
                    ? "text-primary font-medium border-b border-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Cart & Auth buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
              {user ? (
                <div className="flex items-center space-x-3">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Link to="/profile" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link to="/auth" className="flex items-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-consciousness transition-colors hover:text-primary ${
                    isActive(item.path)
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Cart & Auth */}
              <div className="pt-4 border-t border-border">
                {user ? (
                  <div className="space-y-4">
                    {/* User Info Card */}
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">Welcome back!</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center space-x-2"
                      >
                        <Link 
                          to="/profile" 
                          className="flex items-center space-x-2"
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                      </Button>
                      
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center space-x-2"
                      >
                        <Link to="/cart" onClick={() => setIsOpen(false)}>
                          <div className="flex items-center space-x-2 relative">
                            <ShoppingCart className="w-4 h-4" />
                            <span>Cart</span>
                            {itemCount > 0 && (
                              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {itemCount}
                              </span>
                            )}
                          </div>
                        </Link>
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 w-full text-muted-foreground hover:text-foreground"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Sign In Call to Action */}
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Sign in to access your courses and track progress
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button asChild variant="default" size="sm" className="flex items-center justify-center space-x-2">
                        <Link 
                          to="/auth" 
                          className="flex items-center space-x-2"
                          onClick={() => setIsOpen(false)}
                        >
                          <LogIn className="w-4 h-4" />
                          <span>Sign In</span>
                        </Link>
                      </Button>
                      
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center space-x-2"
                      >
                        <Link to="/cart" onClick={() => setIsOpen(false)}>
                          <div className="flex items-center space-x-2 relative">
                            <ShoppingCart className="w-4 h-4" />
                            <span>Cart</span>
                            {itemCount > 0 && (
                              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                {itemCount}
                              </span>
                            )}
                          </div>
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;