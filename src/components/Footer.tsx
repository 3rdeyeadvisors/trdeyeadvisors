import { Link } from "react-router-dom";
import { Mail, Twitter, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background/90 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="font-consciousness font-bold text-xl">3rdeyeadvisors</span>
            </Link>
            <p className="text-sm text-muted-foreground font-consciousness leading-relaxed">
              Empowering financial consciousness through DeFi education and tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-consciousness font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link to="/store" className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness">
                  Store
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-consciousness font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness">
                  Resources
                </Link>
              </li>
              <li>
                <a href="mailto:info@the3rdeyeadvisors.com" className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness">
                  Support Email
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="font-consciousness font-semibold mb-4">Legal & Social</h3>
            <ul className="space-y-2 mb-4">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness">
                  Terms of Service
                </Link>
              </li>
            </ul>
            
            <div className="flex space-x-3">
              <a href="mailto:info@the3rdeyeadvisors.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground font-consciousness">
              © {new Date().getFullYear()} 3rdeyeadvisors. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground font-consciousness mt-2 md:mt-0">
              Educational content only. Not financial advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;