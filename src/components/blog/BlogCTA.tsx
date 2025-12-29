import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface BlogCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

const BlogCTA: React.FC<BlogCTAProps> = ({
  title = "Ready to Learn More?",
  description = "Explore our comprehensive courses and tutorials to deepen your understanding of DeFi.",
  buttonText = "Browse Courses",
  buttonLink = "/courses"
}) => {
  return (
    <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl p-8 text-center mb-8">
      <h3 className="text-2xl font-bold text-foreground mb-4">{title}</h3>
      <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">{description}</p>
      <Link to={buttonLink}>
        <Button className="gap-2">
          {buttonText}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};

export default BlogCTA;
