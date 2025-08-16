import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  // Generate canonical URL - normalize path and ensure proper domain
  const canonicalUrl = `https://www.the3rdeyeadvisors.com${location.pathname}`.replace(/\/$/, '') || 'https://www.the3rdeyeadvisors.com';

  return (
    <>
      <Helmet>
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <div className="min-h-screen bg-gradient-cosmic flex flex-col">
        <Navigation />
        <main className="pt-16 flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;