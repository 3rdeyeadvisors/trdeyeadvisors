import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut, User, ShoppingCart, ChevronDown, ChevronRight, BookOpen, BarChart3, Package, FileText, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navigation = () => {
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isLearningOpen, setIsLearningOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  // Desktop navigation - main items
  const mainNavItems = [
    { path: "/", label: "Home" },
    { path: "/philosophy", label: "Philosophy" },
    { path: "/courses", label: "Courses" },
    { path: "/tutorials", label: "Tutorials" },
    { path: "/blog", label: "Blog" },
    { path: "/resources", label: "Resources" },
    { path: "/resources/3EA-Whitepaper-White.pdf", label: "Whitepaper", external: true },
    { path: "/store", label: "Store" },
  ];

  // Desktop navigation - dropdown items
  const moreNavItems = [
    { path: "/analytics", label: "Analytics" },
    { path: "/downloads", label: "Downloads" },
    { path: "/contact", label: "Contact" },
  ];

  // Mobile navigation structure with grouping
  const mobileNavStructure = {
    primary: [
      { path: "/", label: "Home" },
      { path: "/philosophy", label: "Philosophy" },
      { path: "/store", label: "Store", icon: Package },
    ],
    learning: [
      { path: "/courses", label: "Courses", icon: BookOpen },
      { path: "/tutorials", label: "Tutorials", icon: BookOpen },
      { path: "/blog", label: "Blog", icon: FileText },
      { path: "/resources", label: "Resources", icon: FileText },
      { path: "/resources/3EA-Whitepaper-White.pdf", label: "Whitepaper", icon: FileText, external: true },
    ],
    more: [
      { path: "/analytics", label: "Analytics", icon: BarChart3 },
      { path: "/downloads", label: "Downloads" },
      { path: "/contact", label: "Contact" },
    ]
  };

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand - Mobile only */}
          <Link to="/" className="flex md:hidden items-center space-x-3 justify-center flex-1" aria-label="3rdeyeadvisors home">
            <div className="text-lg font-consciousness font-bold text-primary">
              3rdeyeadvisors
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 flex-1 justify-start">
            {mainNavItems.map((item) => (
              item.external ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-consciousness transition-all duration-cosmic hover:text-primary text-muted-foreground whitespace-nowrap"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-consciousness transition-all duration-cosmic hover:text-primary whitespace-nowrap ${
                    isActive(item.path)
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
            
            {/* More Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-consciousness h-auto py-1 px-2 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                    <MoreHorizontal className="h-4 w-4 mr-1" />
                    More
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2 bg-popover">
                      {moreNavItems.map((item) => (
                        <li key={item.path}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.path}
                              className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                                isActive(item.path)
                                  ? "bg-accent text-accent-foreground"
                                  : ""
                              }`}
                            >
                              <div className="text-sm font-medium leading-none font-consciousness">
                                {item.label}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            {/* Right side actions */}
            <div className="flex items-center space-x-3">
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

          {/* Mobile Cart & Menu */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Cart */}
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
            
            {/* Mobile Auth Button */}
            {!user && (
              <Button asChild variant="outline" size="sm">
                <Link to="/auth" className="flex items-center space-x-1">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden xs:inline">Sign In</span>
                </Link>
              </Button>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-black border-t border-border z-40">
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* Account Section (Top Priority) */}
              {user ? (
                <div className="p-4 border-b border-border bg-muted/30">
                  {/* User Info Card */}
                  <div className="bg-card rounded-lg p-3 mb-3 border">
                    <div className="flex items-center justify-between">
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
                  </div>
                  
                  {/* Account Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Link 
                        to="/profile" 
                        className="flex items-center justify-center space-x-1"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="w-3 h-3" />
                        <span>Profile</span>
                      </Link>
                    </Button>
                    
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="text-xs relative"
                    >
                      <Link 
                        to="/cart" 
                        className="flex items-center justify-center space-x-1"
                        onClick={() => setIsOpen(false)}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>Cart</span>
                        {itemCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {itemCount}
                          </span>
                        )}
                      </Link>
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="text-xs"
                    >
                      <LogOut className="w-3 h-3 mr-1" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 border-b border-border bg-muted/30">
                  <div className="text-center space-y-3">
                    <p className="text-sm font-medium">Welcome to 3rdeyeadvisors</p>
                    <Button asChild variant="default" size="sm" className="w-full">
                      <Link 
                        to="/auth" 
                        className="flex items-center justify-center space-x-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In to Get Started</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation Sections */}
              <div className="p-4 space-y-4">
                {/* Home */}
                <Link
                  to="/"
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive("/")
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-consciousness">Home</span>
                </Link>

                {/* Philosophy */}
                <Link
                  to="/philosophy"
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive("/philosophy")
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-consciousness">Philosophy</span>
                </Link>

                {/* Learning Section */}
                <Collapsible open={isLearningOpen} onOpenChange={setIsLearningOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5" />
                      <span className="font-consciousness font-medium">Learning</span>
                    </div>
                    {isLearningOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-1">
                    {mobileNavStructure.learning.map((item) => (
                      item.external ? (
                        <a
                          key={item.path}
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-2 pl-6 rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.icon && <item.icon className="w-4 h-4" />}
                          <span className="text-sm">{item.label}</span>
                        </a>
                      ) : (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center space-x-3 p-2 pl-6 rounded-lg transition-colors ${
                            isActive(item.path)
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.icon && <item.icon className="w-4 h-4" />}
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      )
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* More Section */}
                <Collapsible open={isMoreOpen} onOpenChange={setIsMoreOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-5 h-5" />
                      <span className="font-consciousness font-medium">More</span>
                    </div>
                    {isMoreOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-1">
                    {mobileNavStructure.more.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 p-2 pl-6 rounded-lg transition-colors ${
                          isActive(item.path)
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Store Section */}
                <div className="space-y-2">
                  <Link
                    to="/store"
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive("/store")
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Package className="w-5 h-5" />
                    <span className="font-consciousness">Store</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;