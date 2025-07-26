/**
 * Enhanced Layout with SEO Automation
 * Automatically applies SEO validation and monitoring to all pages
 */

import { ReactNode } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import SEOValidator from "./SEOValidator";

interface AutomatedLayoutProps {
  children: ReactNode;
  showSEOValidator?: boolean;
}

const AutomatedLayout = ({ children, showSEOValidator = true }: AutomatedLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-cosmic flex flex-col">
      <Navigation />
      <main className="pt-16 flex-1">
        {children}
      </main>
      <Footer />
      
      {/* SEO Validator - shows in development, optional in production */}
      {showSEOValidator && <SEOValidator />}
    </div>
  );
};

export default AutomatedLayout;