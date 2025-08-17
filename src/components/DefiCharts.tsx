import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, BarChart3, PieChart as PieChartIcon, Activity, Loader2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import useEmblaCarousel from 'embla-carousel-react';

interface DefiProtocol {
  id: string;
  name: string;
  tvl: number;
  change_1d: number;
  change_7d: number;
  category: string;
}

interface DefiData {
  totalTvl: number;
  totalVolume24h: number;
  averageYield: number;
  protocols: DefiProtocol[];
  historicalData: Array<{
    date: string;
    totalTvl: number;
    volume: number;
    yield: number;
  }>;
  riskDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

// Fallback data in case of API errors
const generateFallbackData = (): DefiData => {
  const historicalData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    
    return {
      date: date.toISOString().split('T')[0],
      totalTvl: 180000000000 + Math.random() * 40000000000, // $180B - $220B
      volume: 40000000000 + Math.random() * 20000000000, // $40B - $60B  
      yield: 6 + Math.random() * 8 // 6% - 14%
    };
  });

  const protocols: DefiProtocol[] = [
    { id: 'lido', name: 'Lido', tvl: 32000000000, change_1d: 2.1, change_7d: 5.3, category: 'Liquid Staking' },
    { id: 'aave', name: 'Aave', tvl: 18000000000, change_1d: -1.2, change_7d: 3.1, category: 'Lending' },
    { id: 'makerdao', name: 'MakerDAO', tvl: 15000000000, change_1d: 0.8, change_7d: -2.1, category: 'CDP' },
    { id: 'uniswap', name: 'Uniswap', tvl: 12000000000, change_1d: 1.5, change_7d: 4.2, category: 'DEX' },
    { id: 'compound', name: 'Compound', tvl: 8000000000, change_1d: -0.5, change_7d: 1.8, category: 'Lending' },
    { id: 'convex', name: 'Convex', tvl: 6500000000, change_1d: 3.2, change_7d: 8.1, category: 'Yield' },
    { id: 'curve', name: 'Curve', tvl: 5200000000, change_1d: 1.8, change_7d: 2.9, category: 'DEX' },
    { id: 'pancakeswap', name: 'PancakeSwap', tvl: 4800000000, change_1d: 2.5, change_7d: 6.7, category: 'DEX' }
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: 45, color: 'hsl(var(--awareness))' },
    { name: 'Medium Risk', value: 35, color: 'hsl(var(--accent))' },
    { name: 'High Risk', value: 20, color: 'hsl(var(--destructive))' }
  ];

  return {
    totalTvl: 200000000000,
    totalVolume24h: 50000000000,
    averageYield: 8.5,
    protocols,
    historicalData,
    riskDistribution
  };
};

export const DefiCharts = () => {
  const [data, setData] = useState<DefiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'totalTvl' | 'volume' | 'yield'>('totalTvl');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [riskCardHeight, setRiskCardHeight] = useState<number>(0);
  
  const riskCardRef = useRef<HTMLDivElement>(null);

  const fetchDefiData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: response, error: functionError } = await supabase.functions.invoke('fetch-defi-data');
      
      if (functionError) {
        console.error('Supabase function error:', functionError);
        throw new Error('Failed to fetch DeFi data');
      }
      
      if (response && response.protocols && Array.isArray(response.protocols)) {
        console.log('API returned protocols:', response.protocols.length);
        setData(response);
        setLastUpdated(new Date());
      } else {
        console.warn('Invalid response structure, using fallback data');
        throw new Error('Invalid data structure received');
      }
    } catch (err) {
      console.error('Error fetching DeFi data, using fallback:', err);
      setError('Using sample data due to network issues.');
      const fallbackData = generateFallbackData();
      console.log('Using fallback protocols:', fallbackData.protocols.length);
      setData(fallbackData);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefiData();
    
    // Update data every 60 seconds
    const interval = setInterval(fetchDefiData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Measure the Risk Distribution card height for matching protocol cards
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0] && riskCardRef.current) {
        const height = entries[0].contentRect.height;
        setRiskCardHeight(height);
      }
    });

    if (riskCardRef.current) {
      resizeObserver.observe(riskCardRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [data]); // Re-observe when data changes

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  if (loading && !data) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6 mobile-typography-center">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          <span>Loading real-time DeFi data...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Category colors for protocol visualization - using design system tokens
  const categoryColors: { [key: string]: string } = {
    'Liquid Staking': 'hsl(var(--primary))', // Primary brand color
    'Lending': 'hsl(var(--awareness))', // Green awareness color  
    'DEX': 'hsl(var(--accent))', // Accent color
    'CDP': 'hsl(var(--secondary))', // Secondary color
    'Yield': 'hsl(var(--destructive))', // Red destructive color
    'CEX': 'hsl(var(--muted-foreground))', // Muted gray
    'Bridge': 'hsl(215 100% 60%)', // Bright blue
    'Derivatives': 'hsl(330 80% 65%)', // Pink
    'Insurance': 'hsl(84 81% 44%)', // Lime green
    'Restaking': 'hsl(24 95% 53%)', // Orange variant
    'RWA': 'hsl(168 76% 42%)', // Teal
    'Gaming': 'hsl(271 91% 65%)', // Purple violet
    'NFT Marketplace': 'hsl(348 83% 47%)', // Rose red
    'Synthetics': 'hsl(142 76% 36%)', // Emerald green
    'Options': 'hsl(262 83% 58%)', // Blue violet
    'Prediction Market': 'hsl(199 89% 48%)', // Sky blue
    'Stablecoin': 'hsl(88 50% 53%)', // Stable green
    'Launchpad': 'hsl(0 84% 60%)', // Launch red
    'Perpetuals': 'hsl(258 90% 66%)', // Deep purple
    'SocialFi': 'hsl(322 84% 57%)', // Social pink
    'Privacy': 'hsl(220 13% 18%)', // Dark gray
    'Oracle': 'hsl(160 84% 39%)', // Oracle green
    'DAO': 'hsl(271 81% 56%)', // DAO purple
    'Analytics': 'hsl(188 95% 68%)', // Analytics cyan
    'Cross Chain': 'hsl(20 90% 48%)', // Chain orange
    'Farm': 'hsl(142 71% 45%)', // Farm green
    'Algo-Stables': 'hsl(173 80% 40%)', // Algorithm teal
    'Indexes': 'hsl(25 95% 39%)', // Index brown
    'Reserve Currency': 'hsl(329 69% 52%)', // Reserve pink
    'default': 'hsl(var(--muted-foreground))' // Default using theme
  };

  const getProtocolColor = (category: string) => {
    return categoryColors[category] || categoryColors.default;
  };

  const getCurrentTVL = () => data.historicalData[data.historicalData.length - 1]?.totalTvl || data.totalTvl;
  const getPreviousTVL = () => data.historicalData[data.historicalData.length - 2]?.totalTvl || data.totalTvl;
  const getTVLChange = () => ((getCurrentTVL() - getPreviousTVL()) / getPreviousTVL() * 100).toFixed(2);

  // Mobile Carousel Component
  const MobileCarousel = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    const [emblaRef] = useEmblaCarousel({ 
      align: 'start', 
      containScroll: 'trimSnaps',
      dragFree: true 
    });

    return (
      <div className={`md:hidden ${className}`}>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3">
            {children}
          </div>
        </div>
        <div className="text-center mt-3">
          <span className="text-xs text-muted-foreground">← Swipe to see more →</span>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 mobile-typography-center">
      <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4 text-center md:text-left">
        <div>
          <h1 className="text-3xl font-bold">DeFi Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Real-time data from DefiLlama, Aave, Uniswap, and leading DeFi protocols
          </p>
          {error && (
            <p className="text-amber-500 text-sm mt-1">{error}</p>
          )}
        </div>
        <TooltipProvider>
          <div className="flex gap-2">
            <Badge variant="secondary" className={loading ? "animate-pulse" : ""}>
              <Activity className="w-4 h-4 mr-2" />
              {loading ? 'Updating...' : 'Live Data'}
            </Badge>
            <UITooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="cursor-help">
                  <Clock className="w-4 h-4 mr-2" />
                  {lastUpdated ? `Last updated ${lastUpdated.toLocaleTimeString()}` : 'Updates every 60s'}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Data refreshes automatically every 60 seconds</p>
                {lastUpdated && <p>Last refresh: {lastUpdated.toLocaleString()}</p>}
              </TooltipContent>
            </UITooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getCurrentTVL())}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {parseFloat(getTVLChange()) >= 0 ? (
                <TrendingUp className="w-4 h-4 text-awareness mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive mr-1" />
              )}
              <span className={parseFloat(getTVLChange()) >= 0 ? 'text-awareness' : 'text-destructive'}>
                {getTVLChange()}%
              </span>
              <span className="ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totalVolume24h)}
            </div>
            <p className="text-xs text-muted-foreground">Trading volume across protocols</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Yield</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.averageYield.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">Annual percentage yield</p>
          </CardContent>
        </Card>
      </div>

      {/* Time Series Chart */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4 text-center md:text-left">
            <div>
              <CardTitle>Market Trends (30 Days)</CardTitle>
              <CardDescription>Track key DeFi metrics over time</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedMetric === 'totalTvl' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('totalTvl')}
              >
                TVL
              </Button>
              <Button
                variant={selectedMetric === 'volume' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('volume')}
              >
                Volume
              </Button>
              <Button
                variant={selectedMetric === 'yield' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('yield')}
              >
                Yield
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => 
                  selectedMetric === 'yield' ? `${value}%` : formatCurrency(value)
                }
                fontSize={12}
              />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [
                  selectedMetric === 'yield' ? `${value}%` : formatCurrency(Number(value)),
                  selectedMetric === 'totalTvl' ? 'TVL' : selectedMetric.toUpperCase()
                ]}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protocol Rankings */}
        <Card>
          <CardHeader className="text-center md:text-left">
            <CardTitle className="flex items-center justify-center md:justify-start">
              <BarChart3 className="w-5 h-5 mr-2" />
              Top DeFi Protocols
            </CardTitle>
            <CardDescription>Ranked by Total Value Locked with 7-day trends</CardDescription>
          </CardHeader>
          <CardContent 
            style={{ 
              maxHeight: riskCardHeight > 0 ? `${riskCardHeight - 80}px` : 'auto' // Subtract header height
            }}
            className="overflow-hidden"
          >
            {data?.protocols && data.protocols.length > 0 ? (
              <>
                {/* Desktop Layout - Carousel when height constrained */}
                <div className="hidden md:block">
                  {riskCardHeight > 0 ? (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {Array.from({ length: Math.ceil(data.protocols.length / 4) }, (_, slideIndex) => (
                          <CarouselItem key={slideIndex}>
                            <div className={`space-y-4 ${riskCardHeight > 0 ? 'overflow-y-auto' : ''}`} 
                                 style={{ maxHeight: riskCardHeight > 0 ? `${riskCardHeight - 120}px` : 'auto' }}>
                              {data.protocols.slice(slideIndex * 4, (slideIndex + 1) * 4).map((protocol, index) => (
                                <div key={protocol.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                  <div className="flex items-center justify-between gap-3">
                                    {/* Protocol info */}
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                                        {slideIndex * 4 + index + 1}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-semibold text-lg truncate">{protocol.name}</span>
                                          <Badge 
                                            variant="outline" 
                                            className="text-xs flex-shrink-0"
                                            style={{ 
                                              borderColor: getProtocolColor(protocol.category),
                                              color: getProtocolColor(protocol.category),
                                              backgroundColor: `${getProtocolColor(protocol.category)}10`
                                            }}
                                          >
                                            {protocol.category}
                                          </Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          TVL: <span className="font-mono font-semibold">{formatCurrency(protocol.tvl)}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Performance data */}
                                    <div className="flex items-center gap-4">
                                      <div className="flex gap-4">
                                        <div className="text-center">
                                          <div className="text-xs text-muted-foreground mb-1">24h</div>
                                          <div className={`flex items-center text-sm font-mono ${protocol.change_1d >= 0 ? 'text-awareness' : 'text-destructive'}`}>
                                            {protocol.change_1d >= 0 ? (
                                              <TrendingUp className="w-3 h-3 mr-1" />
                                            ) : (
                                              <TrendingDown className="w-3 h-3 mr-1" />
                                            )}
                                            {protocol.change_1d >= 0 ? '+' : ''}{protocol.change_1d.toFixed(1)}%
                                          </div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-xs text-muted-foreground mb-1">7d</div>
                                          <div className={`flex items-center text-sm font-mono ${protocol.change_7d >= 0 ? 'text-awareness' : 'text-destructive'}`}>
                                            {protocol.change_7d >= 0 ? (
                                              <TrendingUp className="w-3 h-3 mr-1" />
                                            ) : (
                                              <TrendingDown className="w-3 h-3 mr-1" />
                                            )}
                                            {protocol.change_7d >= 0 ? '+' : ''}{protocol.change_7d.toFixed(1)}%
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Visual trend line */}
                                      <div className="flex w-16 h-8 items-end justify-between">
                                        {Array.from({ length: 7 }, (_, i) => {
                                          const height = Math.max(3, Math.random() * 20 + (protocol.change_7d >= 0 ? 6 : -4));
                                          return (
                                            <div
                                              key={i}
                                              className="w-1.5 rounded-sm"
                                              style={{ 
                                                height: `${Math.abs(height)}px`,
                                                backgroundColor: getProtocolColor(protocol.category),
                                                opacity: 0.4 + (i * 0.08)
                                              }}
                                            />
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="flex justify-center mt-4 gap-2">
                        <CarouselPrevious />
                        <CarouselNext />
                      </div>
                    </Carousel>
                  ) : (
                    <div className="space-y-4">
                      {data.protocols.slice(0, 6).map((protocol, index) => (
                        <div key={protocol.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between gap-3">
                            {/* Protocol info */}
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-lg truncate">{protocol.name}</span>
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs flex-shrink-0"
                                    style={{ 
                                      borderColor: getProtocolColor(protocol.category),
                                      color: getProtocolColor(protocol.category),
                                      backgroundColor: `${getProtocolColor(protocol.category)}10`
                                    }}
                                  >
                                    {protocol.category}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  TVL: <span className="font-mono font-semibold">{formatCurrency(protocol.tvl)}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Performance data */}
                            <div className="flex items-center gap-4">
                              <div className="flex gap-4">
                                <div className="text-center">
                                  <div className="text-xs text-muted-foreground mb-1">24h</div>
                                  <div className={`flex items-center text-sm font-mono ${protocol.change_1d >= 0 ? 'text-awareness' : 'text-destructive'}`}>
                                    {protocol.change_1d >= 0 ? (
                                      <TrendingUp className="w-3 h-3 mr-1" />
                                    ) : (
                                      <TrendingDown className="w-3 h-3 mr-1" />
                                    )}
                                    {protocol.change_1d >= 0 ? '+' : ''}{protocol.change_1d.toFixed(1)}%
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-muted-foreground mb-1">7d</div>
                                  <div className={`flex items-center text-sm font-mono ${protocol.change_7d >= 0 ? 'text-awareness' : 'text-destructive'}`}>
                                    {protocol.change_7d >= 0 ? (
                                      <TrendingUp className="w-3 h-3 mr-1" />
                                    ) : (
                                      <TrendingDown className="w-3 h-3 mr-1" />
                                    )}
                                    {protocol.change_7d >= 0 ? '+' : ''}{protocol.change_7d.toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                              
                              {/* Visual trend line */}
                              <div className="flex w-16 h-8 items-end justify-between">
                                {Array.from({ length: 7 }, (_, i) => {
                                  const height = Math.max(3, Math.random() * 20 + (protocol.change_7d >= 0 ? 6 : -4));
                                  return (
                                    <div
                                      key={i}
                                      className="w-1.5 rounded-sm"
                                      style={{ 
                                        height: `${Math.abs(height)}px`,
                                        backgroundColor: getProtocolColor(protocol.category),
                                        opacity: 0.4 + (i * 0.08)
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Carousel */}
                <MobileCarousel>
                  {data.protocols.slice(0, 8).map((protocol, index) => (
                    <div key={protocol.id} className="flex-shrink-0 w-72 p-3 rounded-lg border bg-card text-center">
                      <div className="flex flex-col items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {index + 1}
                        </div>
                        <div className="font-semibold">{protocol.name}</div>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ 
                            borderColor: getProtocolColor(protocol.category),
                            color: getProtocolColor(protocol.category),
                            backgroundColor: `${getProtocolColor(protocol.category)}10`
                          }}
                        >
                          {protocol.category}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-sm text-muted-foreground text-center">
                          TVL: <span className="font-mono font-semibold text-foreground">{formatCurrency(protocol.tvl)}</span>
                        </div>
                        
                        <div className="flex justify-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">24h</div>
                            <div className={`font-mono font-medium ${protocol.change_1d >= 0 ? 'text-awareness' : 'text-destructive'}`}>
                              {protocol.change_1d >= 0 ? '+' : ''}{protocol.change_1d.toFixed(1)}%
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">7d</div>
                            <div className={`font-mono font-medium ${protocol.change_7d >= 0 ? 'text-awareness' : 'text-destructive'}`}>
                              {protocol.change_7d >= 0 ? '+' : ''}{protocol.change_7d.toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        {/* Mini trend visualization */}
                        <div className="flex w-full h-6 items-end justify-center gap-0.5 mx-auto max-w-48">
                          {Array.from({ length: 12 }, (_, i) => {
                            const height = Math.max(2, Math.random() * 16 + (protocol.change_7d >= 0 ? 4 : -2));
                            return (
                              <div
                                key={i}
                                className="flex-1 rounded-sm"
                                style={{ 
                                  height: `${Math.abs(height)}px`,
                                  backgroundColor: getProtocolColor(protocol.category),
                                  opacity: 0.3 + (i * 0.05)
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </MobileCarousel>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Protocol data loading...</p>
                  {error && <p className="text-sm mt-2">{error}</p>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card className="self-start" ref={riskCardRef}>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center">
              <PieChartIcon className="w-5 h-5 mr-2" />
              Risk Distribution
            </CardTitle>
            <CardDescription>Portfolio risk allocation across DeFi</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            {/* Mobile: Stack vertically, Desktop: Side by side centered */}
            <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-6 md:gap-8">
              {/* Chart Container - Fixed square size */}
              <div className="mx-auto md:mx-0 flex-shrink-0">
                <div className="w-[280px] h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="85%"
                        paddingAngle={2}
                        dataKey="value"
                        label={false}
                        labelLine={false}
                      >
                        {data.riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Legend - Responsive layout */}
              <div className="w-full md:w-auto md:flex-none">
                {/* Mobile: Centered wrapped layout */}
                <div className="flex flex-wrap justify-center gap-4 md:hidden">
                  {data.riskDistribution.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm font-medium">{entry.name}</span>
                      <span className="text-sm text-muted-foreground">{entry.value}%</span>
                    </div>
                  ))}
                </div>
                
                {/* Desktop: Vertical list centered */}
                <div className="hidden md:flex md:flex-col md:items-center gap-3">
                  {data.riskDistribution.map((entry, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm font-medium">{entry.name}</span>
                      <span className="text-sm text-muted-foreground font-mono ml-2">{entry.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Protocol Details Table */}
      <Card>
        <CardHeader className="text-center md:text-left">
          <CardTitle>Protocol Performance</CardTitle>
          <CardDescription>Detailed metrics for top DeFi protocols</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Protocol</th>
                  <th className="text-right py-2 px-4">TVL</th>
                  <th className="text-right py-2 px-4">1D Change</th>
                  <th className="text-right py-2 px-4">7D Change</th>
                  <th className="text-right py-2 px-4">Category</th>
                </tr>
              </thead>
              <tbody>
                {data.protocols.slice(0, 8).map((protocol, index) => (
                  <tr key={protocol.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                          {index + 1}
                        </div>
                        <span className="font-medium">{protocol.name}</span>
                      </div>
                    </td>
                    <td className="text-right py-2 px-4 font-mono">{formatCurrency(protocol.tvl)}</td>
                    <td className={`text-right py-2 px-4 font-mono ${protocol.change_1d >= 0 ? 'text-awareness' : 'text-destructive'}`}>
                      {protocol.change_1d >= 0 ? '+' : ''}{protocol.change_1d.toFixed(2)}%
                    </td>
                    <td className={`text-right py-2 px-4 font-mono ${protocol.change_7d >= 0 ? 'text-awareness' : 'text-destructive'}`}>
                      {protocol.change_7d >= 0 ? '+' : ''}{protocol.change_7d.toFixed(2)}%
                    </td>
                    <td className="text-right py-2 px-4">
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ 
                          borderColor: getProtocolColor(protocol.category),
                          color: getProtocolColor(protocol.category)
                        }}
                      >
                        {protocol.category}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Carousel */}
          <MobileCarousel>
            {data.protocols.slice(0, 8).map((protocol, index) => (
              <div key={protocol.id} className="flex-shrink-0 w-64 p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <span className="font-medium truncate">{protocol.name}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-xs flex-shrink-0"
                    style={{ 
                      borderColor: getProtocolColor(protocol.category),
                      color: getProtocolColor(protocol.category),
                      backgroundColor: `${getProtocolColor(protocol.category)}10`
                    }}
                  >
                    {protocol.category}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">TVL</div>
                    <div className="font-mono font-medium">{formatCurrency(protocol.tvl)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">24h</div>
                    <div className={`font-mono font-medium ${protocol.change_1d >= 0 ? 'text-awareness' : 'text-destructive'}`}>
                      {protocol.change_1d >= 0 ? '+' : ''}{protocol.change_1d.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">7d</div>
                    <div className={`font-mono font-medium ${protocol.change_7d >= 0 ? 'text-awareness' : 'text-destructive'}`}>
                      {protocol.change_7d >= 0 ? '+' : ''}{protocol.change_7d.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </MobileCarousel>
        </CardContent>
      </Card>
    </div>
  );
};