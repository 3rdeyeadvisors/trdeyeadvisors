import { Link } from "react-router-dom";
import { Mail, Github, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background/90 border-t border-border mt-8 md:mt-20">
      <div className="container mx-auto px-4 sm:px-6 py-4 md:py-12" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        {/* Desktop Footer - Full Layout */}
        <div className="hidden md:grid md:grid-cols-4 gap-10 mb-8">
          {/* Brand Column */}
          <div className="text-left">
            <Link to="/" className="inline-block mb-2">
              <span className="font-consciousness font-bold text-xl text-primary">
                3rdeyeadvisors
              </span>
            </Link>
            <p className="text-sm text-foreground/70 font-consciousness leading-relaxed max-w-xs">
              Empowering financial consciousness through DeFi education and tools.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="text-left">
            <h3 className="font-consciousness font-semibold mb-3 text-base text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/courses" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-block"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link 
                  to="/tutorials" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-block"
                >
                  Tutorials
                </Link>
              </li>
              <li>
                <Link 
                  to="/store" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-block"
                >
                  Store
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-block"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="text-left">
            <h3 className="font-consciousness font-semibold mb-3 text-base text-foreground">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/contact" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-block"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/resources" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-block"
                >
                  Resources
                </Link>
              </li>
              <li>
                <a 
                  href="/resources/3EA-Whitepaper-White.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-block"
                >
                  Whitepaper
                </a>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-block"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Column */}
          <div className="text-left">
            <h3 className="font-consciousness font-semibold mb-3 text-base text-foreground">
              Connect
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <a 
                href="mailto:info@the3rdeyeadvisors.com" 
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
                aria-label="Email us"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/3rdeyeadvisors" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
                aria-label="View our GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/3rdeyeadvisors" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground font-consciousness">
              Join our community and stay updated
            </p>
          </div>
        </div>

        {/* Mobile Footer - Minimal */}
        <div className="md:hidden flex flex-col items-center text-center gap-3">
          {/* Brand */}
          <Link to="/" className="inline-block">
            <span className="font-consciousness font-bold text-base text-primary">
              3rdeyeadvisors
            </span>
          </Link>
          
          {/* Social Icons */}
          <div className="flex items-center justify-center gap-2">
            <a 
              href="mailto:info@the3rdeyeadvisors.com" 
              className="text-muted-foreground hover:text-primary transition-colors p-2"
              aria-label="Email us"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a 
              href="https://github.com/3rdeyeadvisors" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors p-2"
              aria-label="View our GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://instagram.com/3rdeyeadvisors" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors p-2"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          
          {/* Copyright */}
          <p className="text-xs text-muted-foreground/70 font-consciousness">
            © {new Date().getFullYear()} 3rdeyeadvisors
          </p>
        </div>

        {/* Desktop Bottom Section */}
        <div className="hidden md:block border-t border-border pt-6">
          <div className="flex flex-col items-center justify-center gap-1.5 text-center">
            <p className="text-xs text-muted-foreground/80 font-consciousness">
              © {new Date().getFullYear()} 3rdeyeadvisors. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/60 font-consciousness max-w-2xl">
              Educational content only. Not financial advice. Always do your own research.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
