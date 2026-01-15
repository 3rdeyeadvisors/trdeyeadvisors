import { Link } from "react-router-dom";
import { GraduationCap, Building2, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";

const InstitutionalSection = () => {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <AnimatedSection animation="fade-up" className="text-center">
          {/* Icons row */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Scale className="w-6 h-6" />
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
          
          {/* Headline */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Institutional & Educational Partnerships
          </h2>
          
          {/* Body */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Are you a school, law firm, or financial institution looking to onboard your team or students to the world of DeFi? We offer bulk licensing and custom certification programs.
          </p>
          
          {/* CTA */}
          <Button asChild size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
            <Link to="/contact">
              Contact Us for Partnership Inquiries
            </Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default InstitutionalSection;
