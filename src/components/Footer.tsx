import { Link } from "react-router-dom";
import { Mail, Twitter, Github } from "lucide-react";

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
                href="https://x.com/3rdeyeadvisors" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
                aria-label="Follow us on X"
              >
                <Twitter className="w-5 h-5" />
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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
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
              href="https://x.com/3rdeyeadvisors" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors p-2"
              aria-label="Follow us on X"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://instagram.com/3rdeyeadvisors" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors p-2"
              aria-label="Follow us on Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
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
