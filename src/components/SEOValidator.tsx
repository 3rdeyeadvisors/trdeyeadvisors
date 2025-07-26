/**
 * SEO Validation Component
 * Real-time SEO monitoring and validation for development
 */

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSEOMonitoring } from '@/hooks/useSEOAutomation';

interface SEOValidatorProps {
  showInProduction?: boolean;
  minimized?: boolean;
}

const SEOValidator = ({ 
  showInProduction = false, 
  minimized = false 
}: SEOValidatorProps) => {
  const { issues, score } = useSEOMonitoring();
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(minimized);

  // Hide in production unless explicitly shown
  if (!showInProduction && process.env.NODE_ENV === 'production') {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-4 h-4" />;
    if (score >= 70) return <AlertTriangle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          variant="outline"
          size="sm"
          className={`${getScoreColor(score)} border-current`}
        >
          {getScoreIcon(score)}
          <span className="ml-2">SEO: {score}%</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="p-4 shadow-lg bg-white border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge className={getScoreColor(score)}>
              {getScoreIcon(score)}
              <span className="ml-1">SEO Score: {score}%</span>
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              onClick={() => setIsMinimized(true)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              −
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {issues.length === 0 ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">All SEO checks passed!</span>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-800">
              Issues Found ({issues.length})
            </h4>
            <ul className="space-y-1">
              {issues.map((issue, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-700">{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Real-time monitoring</span>
            <span>DEV</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SEOValidator;