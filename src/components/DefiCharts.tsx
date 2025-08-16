import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

// Mock DeFi data that updates dynamically
const generateMockData = () => {
  const protocols = ['Uniswap', 'Compound', 'Aave', 'MakerDAO', 'Curve', 'SushiSwap'];
  const timeData = [];
  const protocolData = [];
  const riskData = [
    { name: 'Low Risk', value: 35, color: '#10b981' },
    { name: 'Medium Risk', value: 45, color: '#f59e0b' },
    { name: 'High Risk', value: 20, color: '#ef4444' }
  ];

  // Generate 30 days of price data
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    timeData.push({
      date: date.toISOString().split('T')[0],
      tvl: Math.floor(Math.random() * 50000000000) + 100000000000,
      volume: Math.floor(Math.random() * 5000000000) + 1000000000,
      yield: (Math.random() * 15 + 2).toFixed(2)
    });
  }

  // Generate protocol data
  protocols.forEach(protocol => {
    protocolData.push({
      name: protocol,
      tvl: Math.floor(Math.random() * 20000000000) + 5000000000,
      apr: (Math.random() * 12 + 2).toFixed(2),
      volume24h: Math.floor(Math.random() * 2000000000) + 100000000
    });
  });

  return { timeData, protocolData, riskData };
};

export const DefiCharts = () => {
  const [data, setData] = useState(generateMockData());
  const [selectedMetric, setSelectedMetric] = useState<'tvl' | 'volume' | 'yield'>('tvl');

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateMockData());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const getCurrentTVL = () => data.timeData[data.timeData.length - 1]?.tvl || 0;
  const getPreviousTVL = () => data.timeData[data.timeData.length - 2]?.tvl || 0;
  const getTVLChange = () => ((getCurrentTVL() - getPreviousTVL()) / getPreviousTVL() * 100).toFixed(2);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 mobile-typography-center">
      <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4 text-center md:text-left">
        <div>
          <h1 className="text-3xl font-bold">DeFi Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Live market data and insights from the decentralized finance ecosystem
          </p>
        </div>
        <Badge variant="secondary" className="animate-pulse">
          <Activity className="w-4 h-4 mr-2" />
          Live Data
        </Badge>
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
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={parseFloat(getTVLChange()) >= 0 ? 'text-green-500' : 'text-red-500'}>
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
              {formatCurrency(data.timeData[data.timeData.length - 1]?.volume || 0)}
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
              {data.timeData[data.timeData.length - 1]?.yield || '0'}%
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
                variant={selectedMetric === 'tvl' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('tvl')}
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
            <AreaChart data={data.timeData}>
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
                  selectedMetric.toUpperCase()
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
            <CardDescription>Ranked by Total Value Locked</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.protocolData.sort((a, b) => b.tvl - a.tvl)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'TVL']} />
                <Bar dataKey="tvl" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
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
                  data={data.riskData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {data.riskData.map((entry, index) => (
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
                  <th className="text-right py-2 px-4">APR</th>
                  <th className="text-right py-2 px-4">24h Volume</th>
                </tr>
              </thead>
              <tbody>
                {data.protocolData
                  .sort((a, b) => b.tvl - a.tvl)
                  .map((protocol, index) => (
                    <tr key={protocol.name} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4 font-medium">{protocol.name}</td>
                      <td className="text-right py-2 px-4">{formatCurrency(protocol.tvl)}</td>
                      <td className="text-right py-2 px-4 text-green-600">{protocol.apr}%</td>
                      <td className="text-right py-2 px-4">{formatCurrency(protocol.volume24h)}</td>
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