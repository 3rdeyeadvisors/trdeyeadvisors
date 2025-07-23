import { DefiCharts } from '@/components/DefiCharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity, BarChart3, AlertTriangle } from 'lucide-react';
import SEO from '@/components/SEO';

const Analytics = () => {
  return (
    <>
      <SEO 
        title="DeFi Analytics & Market Data"
        description="Real-time DeFi analytics, protocol insights, and comprehensive market data for the decentralized finance ecosystem. Track yields, TVL, and protocol performance."
        keywords="DeFi analytics, DeFi market data, yield farming analytics, protocol insights, TVL tracking, DeFi charts, crypto analytics"
        url="https://3rdeyeadvisors.com/analytics"
      />
      <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-consciousness font-bold text-foreground">
              DeFi Analytics
            </h1>
          </div>
          <p className="text-xl text-muted-foreground font-consciousness max-w-3xl mx-auto">
            Real-time market data, protocol insights, and comprehensive analytics for the decentralized finance ecosystem
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="animate-pulse">
              <Activity className="w-4 h-4 mr-2" />
              Live Data
            </Badge>
            <Badge variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Auto-Updates Every 10s
            </Badge>
          </div>
        </div>

        {/* Live Analytics Dashboard */}
        <DefiCharts />

        {/* Market Insights Card */}
        <Card className="mt-12 p-6 bg-card/60 border-border">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-consciousness font-semibold text-foreground mb-2">
                Market Data Disclaimer
              </h3>
              <p className="text-muted-foreground font-consciousness leading-relaxed">
                This data is for educational and informational purposes only. The simulated data represents 
                typical DeFi market patterns but should not be used for actual investment decisions. 
                Always verify data from official protocol sources and conduct your own research before 
                making any financial decisions in the DeFi space.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </>
  );
};

export default Analytics;