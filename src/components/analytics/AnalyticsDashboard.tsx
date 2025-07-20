import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  MessageCircle,
  Star,
  Clock,
  Award,
  BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsData {
  totalUsers: number;
  totalCourses: number;
  totalComments: number;
  averageRating: number;
  popularTutorials: Array<{
    id: string;
    title: string;
    views: number;
    rating: number;
  }>;
  userEngagement: Array<{
    date: string;
    activeUsers: number;
    completions: number;
  }>;
  topContributors: Array<{
    name: string;
    contributions: number;
    badges: number;
  }>;
}

export const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalCourses: 0,
    totalComments: 0,
    averageRating: 0,
    popularTutorials: [],
    userEngagement: [],
    topContributors: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Load basic counts
      const [usersCount, commentsCount, ratingsData] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('comments').select('id', { count: 'exact', head: true }),
        supabase.from('ratings').select('rating')
      ]);

      const totalUsers = usersCount.count || 0;
      const totalComments = commentsCount.count || 0;
      const averageRating = ratingsData.data?.length 
        ? ratingsData.data.reduce((sum, r) => sum + r.rating, 0) / ratingsData.data.length 
        : 0;

      // Mock additional data for demo
      setAnalytics({
        totalUsers,
        totalCourses: 12, // Our tutorial count
        totalComments,
        averageRating: Math.round(averageRating * 10) / 10,
        popularTutorials: [
          { id: 'wallet-setup', title: 'Wallet Setup & Security', views: 1250, rating: 4.8 },
          { id: 'first-dex-swap', title: 'Your First DEX Swap', views: 980, rating: 4.6 },
          { id: 'defi-calculators', title: 'DeFi Calculator Tools', views: 750, rating: 4.7 },
          { id: 'spotting-scams', title: 'Spotting DeFi Scams', views: 890, rating: 4.9 }
        ],
        userEngagement: [
          { date: '2024-01-15', activeUsers: 45, completions: 12 },
          { date: '2024-01-16', activeUsers: 52, completions: 18 },
          { date: '2024-01-17', activeUsers: 38, completions: 9 },
          { date: '2024-01-18', activeUsers: 61, completions: 24 },
          { date: '2024-01-19', activeUsers: 47, completions: 15 },
          { date: '2024-01-20', activeUsers: 55, completions: 21 },
          { date: '2024-01-21', activeUsers: 43, completions: 13 }
        ],
        topContributors: [
          { name: 'Alice Johnson', contributions: 28, badges: 5 },
          { name: 'Bob Smith', contributions: 22, badges: 3 },
          { name: 'Carol White', contributions: 19, badges: 4 },
          { name: 'David Brown', contributions: 15, badges: 2 }
        ]
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-consciousness font-bold text-foreground mb-2">
            Platform Analytics
          </h1>
          <p className="text-muted-foreground">
            Insights into learning engagement and community growth
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              <div>
                <p className="text-xl md:text-2xl font-bold">{analytics.totalUsers}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-awareness" />
              <div>
                <p className="text-xl md:text-2xl font-bold">{analytics.totalCourses}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Tutorials</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-accent" />
              <div>
                <p className="text-xl md:text-2xl font-bold">{analytics.totalComments}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Comments</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
              <div>
                <p className="text-xl md:text-2xl font-bold">{analytics.averageRating.toFixed(1)}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="popular" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="popular">Popular Content</TabsTrigger>
            <TabsTrigger value="engagement">User Engagement</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="popular">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Most Popular Tutorials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.popularTutorials.map((tutorial, index) => (
                    <div key={tutorial.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <h4 className="font-medium">{tutorial.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{tutorial.views} views</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{tutorial.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.userEngagement.map((day) => (
                    <div key={day.date} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{new Date(day.date).toLocaleDateString()}</span>
                        <span>{day.activeUsers} active users</span>
                      </div>
                      <Progress value={(day.activeUsers / 70) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topContributors.map((contributor, index) => (
                    <div key={contributor.name} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <h4 className="font-medium">{contributor.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{contributor.contributions} contributions</span>
                            <span>{contributor.badges} badges</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};