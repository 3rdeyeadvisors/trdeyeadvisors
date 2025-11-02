import { Link } from "react-router-dom";
import { Mail, Twitter, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background/90 border-t border-border mt-8 md:mt-20">
      <div className="container mx-auto px-4 py-6 md:py-12" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
        {/* Brand Block - Mobile First */}
        <div className="mb-6 md:mb-8">
          <Link to="/" className="inline-block mb-2">
            <span className="font-consciousness font-bold text-base md:text-xl">3rdeyeadvisors</span>
          </Link>
          <p className="text-xs md:text-sm text-muted-foreground font-consciousness leading-snug max-w-md">
            Empowering financial consciousness through DeFi education and tools.
          </p>
        </div>

        {/* Links Grid - 2 Columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-6 md:grid-cols-4 md:gap-8 md:mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-consciousness font-semibold mb-3 text-sm md:text-base">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/courses" 
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-block min-h-[44px] flex items-center"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link 
                  to="/tutorials" 
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-block min-h-[44px] flex items-center"
                >
                  Tutorials
                </Link>
              </li>
              <li>
                <Link 
                  to="/store" 
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-block min-h-[44px] flex items-center"
                >
                  Store
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-block min-h-[44px] flex items-center"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-consciousness font-semibold mb-3 text-sm md:text-base">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/contact" 
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-block min-h-[44px] flex items-center"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/resources" 
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-block min-h-[44px] flex items-center"
                >
                  Resources
                </Link>
              </li>
              <li>
                <a 
                  href="/resources/3EA-Whitepaper-White.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-block min-h-[44px] flex items-center"
                >
                  Whitepaper
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Policies - Inline with separator */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 md:mb-8">
          <Link 
            to="/privacy" 
            className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness min-h-[44px] flex items-center px-2"
          >
            Privacy
          </Link>
          <span className="text-muted-foreground/50 text-xs">•</span>
          <Link 
            to="/terms" 
            className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness min-h-[44px] flex items-center px-2"
          >
            Terms
          </Link>
        </div>

        {/* Social Icons - Full Row with Wrap */}
        <div className="mb-6 md:mb-8">
          <h3 className="font-consciousness font-semibold mb-3 text-sm md:text-base text-center">Social</h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a 
              href="mailto:info@the3rdeyeadvisors.com" 
              className="text-muted-foreground hover:text-primary transition-colors p-2.5 rounded-lg hover:bg-primary/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Email us at info@the3rdeyeadvisors.com"
            >
              <Mail className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a 
              href="https://x.com/3rdeyeadvisors" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors p-2.5 rounded-lg hover:bg-primary/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Follow us on X (Twitter)"
            >
              <Twitter className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a 
              href="https://github.com/3rdeyeadvisors" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors p-2.5 rounded-lg hover:bg-primary/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="View our GitHub repository"
            >
              <Github className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a 
              href="https://instagram.com/3rdeyeadvisors" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors p-2.5 rounded-lg hover:bg-primary/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Follow us on Instagram"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright - Bottom with divider */}
        <div className="border-t border-border pt-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
            <p className="text-xs text-muted-foreground/80 font-consciousness text-center">
              © {new Date().getFullYear()} 3rdeyeadvisors. All rights reserved.
            </p>
            <span className="hidden md:inline text-muted-foreground/50">•</span>
            <p className="text-xs text-muted-foreground/80 font-consciousness text-center">
              Educational content only. Not financial advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;