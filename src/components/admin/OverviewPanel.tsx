import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Users, BookOpen, Package, TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RemoveFromRaffleButton } from "./RemoveFromRaffleButton";

interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  icon: any;
  trend?: "up" | "down";
}

export function OverviewPanel() {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState("");

  useEffect(() => {
    loadMetrics();
    loadAIInsights();
  }, []);

  const loadMetrics = async () => {
    try {
      // Fetch total users
      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch course enrollments
      const { count: enrollmentCount } = await supabase
        .from("user_purchases")
        .select("*", { count: "exact", head: true });

      // Fetch active products
      const { count: productCount } = await supabase
        .from("printify_products")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      // Fetch recent orders
      const { count: orderCount } = await supabase
        .from("printify_orders")
        .select("*", { count: "exact", head: true });

      setMetrics([
        {
          title: "Total Revenue",
          value: "$0",
          change: 0,
          icon: DollarSign,
          trend: "up"
        },
        {
          title: "Active Users",
          value: userCount || 0,
          change: 12,
          icon: Users,
          trend: "up"
        },
        {
          title: "Course Enrollments",
          value: enrollmentCount || 0,
          change: 8,
          icon: BookOpen,
          trend: "up"
        },
        {
          title: "Product Sales",
          value: orderCount || 0,
          change: -3,
          icon: Package,
          trend: "down"
        }
      ]);
    } catch (error) {
      console.error("Error loading metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAIInsights = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-command', {
        body: { command: "generate weekly summary" }
      });

      if (!error && data?.insight) {
        setAiInsight(data.insight);
      }
    } catch (error) {
      console.error("Error loading AI insights:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Quick Actions Card */}
      <Card className="bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/20">
        <CardHeader>
          <CardTitle className="text-lg">Admin Quick Actions</CardTitle>
          <CardDescription>Remove yourself from active raffles</CardDescription>
        </CardHeader>
        <CardContent>
          <RemoveFromRaffleButton raffleId="c6008efe-7ee7-4db3-96ca-451bacc07a2a" />
        </CardContent>
      </Card>

      {aiInsight && (
        <Card className="border-primary/20 bg-gradient-to-br from-cosmic-deep to-cosmic-void">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              AI-Generated Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{aiInsight}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.change !== undefined && (
                <p className={`text-xs ${metric.trend === "up" ? "text-green-500" : "text-red-500"} flex items-center gap-1 mt-1`}>
                  {metric.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(metric.change)}% from last week
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
