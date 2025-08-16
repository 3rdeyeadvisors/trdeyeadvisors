import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, BarChart3, PieChart as PieChartIcon, Activity, Loader2, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis tickFormatter={(value) => 
                selectedMetric === 'yield' ? `${value}%` : formatCurrency(value)
              } />
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
          <CardContent>
            {data?.protocols && data.protocols.length > 0 ? (
              <div className="space-y-4">
                {data.protocols.slice(0, 6).map((protocol, index) => (
                  <div key={protocol.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ backgroundColor: getProtocolColor(protocol.category) }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold text-lg">{protocol.name}</span>
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
                        <div className="text-sm text-muted-foreground">
                          TVL: <span className="font-mono font-semibold">{formatCurrency(protocol.tvl)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Mini trend indicator */}
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">24h:</span>
                          <div className={`flex items-center text-sm font-mono ${protocol.change_1d >= 0 ? 'text-awareness' : 'text-destructive'}`}>
                            {protocol.change_1d >= 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {protocol.change_1d >= 0 ? '+' : ''}{protocol.change_1d.toFixed(2)}%
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">7d:</span>
                          <div className={`flex items-center text-sm font-mono ${protocol.change_7d >= 0 ? 'text-awareness' : 'text-destructive'}`}>
                            {protocol.change_7d >= 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {protocol.change_7d >= 0 ? '+' : ''}{protocol.change_7d.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      {/* Visual trend line */}
                      <div className="w-16 h-8 flex items-end justify-between">
                        {Array.from({ length: 7 }, (_, i) => {
                          const height = Math.max(4, Math.random() * 24 + (protocol.change_7d >= 0 ? 8 : -4));
                          return (
                            <div
                              key={i}
                              className="w-1.5 rounded-sm"
                              style={{ 
                                height: `${Math.abs(height)}px`,
                                backgroundColor: getProtocolColor(protocol.category),
                                opacity: 0.3 + (i * 0.1)
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
        <Card>
          <CardHeader className="text-center md:text-left">
            <CardTitle className="flex items-center justify-center md:justify-start">
              <PieChartIcon className="w-5 h-5 mr-2" />
              Risk Distribution
            </CardTitle>
            <CardDescription>Portfolio risk allocation across DeFi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.riskDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {data.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
              </PieChart>
            </ResponsiveContainer>
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
          <div className="overflow-x-auto">
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
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
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
        </CardContent>
      </Card>
    </div>
  );
};