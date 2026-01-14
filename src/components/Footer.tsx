import { Link } from 'react-router-dom';
import { Mail, Github, Instagram, Twitter, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Courses', href: '/courses' },
    { label: 'Tutorials', href: '/tutorials' },
    { label: 'Store', href: '/store' },
    { label: 'Blog', href: '/blog' },
  ];

  const supportLinks = [
    { label: 'Contact', href: '/contact' },
    { label: 'Resources', href: '/resources' },
    { label: 'Whitepaper', href: '/resources/3EA-Whitepaper-White.pdf', external: true },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ];

  const socialLinks = [
    { icon: Mail, href: 'mailto:info@the3rdeyeadvisors.com', label: 'Email' },
    { icon: Twitter, href: 'https://twitter.com/3rdeyeadvisors', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/3rdeyeadvisors', label: 'Instagram' },
    { icon: Github, href: 'https://github.com/3rdeyeadvisors', label: 'GitHub' },
  ];

  return (
    <footer className="relative border-t border-border/50 bg-card/30 backdrop-blur-sm">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
          {/* Brand column - spans 2 on mobile, 1 on larger */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4 group">
              <span className="font-consciousness font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                3rdeyeadvisors
              </span>
            </Link>
            <p className="text-sm text-muted-foreground font-consciousness leading-relaxed max-w-xs mb-6">
              Empowering financial consciousness through DeFi education and tools.
            </p>
            
            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={social.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="w-10 h-10 rounded-lg bg-background/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-consciousness font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">
              Learn
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-consciousness font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-consciousness font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-consciousness inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-consciousness text-center md:text-left">
              © {currentYear} 3rdeyeadvisors. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/70 font-consciousness text-center md:text-right max-w-md">
              Educational content only. Not financial advice. Always do your own research.
            </p>
          </div>
        </div>
      </div>
      
      {/* Safe area padding for mobile */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </footer>
  );
};

export default Footer;
