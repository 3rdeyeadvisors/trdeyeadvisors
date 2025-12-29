import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface BlogDisclaimerProps {
  text?: string;
}

const BlogDisclaimer: React.FC<BlogDisclaimerProps> = ({
  text = "This article is for educational purposes only and should not be considered financial advice. Always conduct your own research and consult with qualified professionals before making any investment decisions. Past performance does not guarantee future results, and all investments carry risk of loss."
}) => {
  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-8">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-foreground mb-2">Disclaimer</h4>
          <p className="text-sm text-foreground/80">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogDisclaimer;
