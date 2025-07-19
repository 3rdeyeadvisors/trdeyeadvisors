import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProgress } from "@/components/progress/ProgressProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp,
  Calendar,
  Award,
  Star,
  CheckCircle2,
  Play,
  BarChart3,
  Brain,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface QuizStats {
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  passedQuizzes: number;
}

export const EnhancedDashboard = () => {
  const { user } = useAuth();
  const { courseProgress } = useProgress();
  const navigate = useNavigate();
  const [quizStats, setQuizStats] = useState<QuizStats>({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    passedQuizzes: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<any[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Load quiz statistics
  useEffect(() => {
    if (user) {
      loadQuizStats();
      loadRecentActivity();
      loadWeeklyProgress();
    }
  }, [user]);

  const loadQuizStats = async () => {
    if (!user) return;

    try {
      const { data: attempts, error } = await supabase
        .from('quiz_attempts')
        .select('score, passed, quiz_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const uniqueQuizzes = new Set(attempts?.map(a => a.quiz_id) || []);
      const completedQuizzes = uniqueQuizzes.size;
      const passedQuizzes = attempts?.filter(a => a.passed).length || 0;
      const averageScore = attempts?.length 
        ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
        : 0;

      setQuizStats({
        totalQuizzes: completedQuizzes, // For now, same as completed
        completedQuizzes,
        averageScore,
        passedQuizzes
      });
    } catch (error) {
      console.error('Error loading quiz stats:', error);
    }
  };

  const loadRecentActivity = async () => {
    if (!user) return;

    try {
      const { data: attempts, error } = await supabase
        .from('quiz_attempts')
        .select('*, quizzes(title, course_id, module_id)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setRecentActivity(attempts || []);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  const loadWeeklyProgress = async () => {
    // Mock weekly progress data - in a real app, this would come from analytics
    const mockData = [
      { day: 'Mon', modules: 2, quizzes: 1 },
      { day: 'Tue', modules: 3, quizzes: 2 },
      { day: 'Wed', modules: 1, quizzes: 0 },
      { day: 'Thu', modules: 4, quizzes: 3 },
      { day: 'Fri', modules: 2, quizzes: 1 },
      { day: 'Sat', modules: 1, quizzes: 1 },
      { day: 'Sun', modules: 0, quizzes: 0 },
    ];
    setWeeklyProgress(mockData);
  };

  if (!user) {
    return null;
  }

  // Mock courses data
  const courses = [
    {
      id: 1,
      title: "DeFi Foundations: Understanding the New Financial System",
      category: "free",
      duration: "5 modules",
      difficulty: "Beginner"
    },
    {
      id: 2,
      title: "Staying Safe in DeFi: Wallets, Security, and Avoiding Scams",
      category: "free", 
      duration: "5 modules",
      difficulty: "Beginner"
    },
    {
      id: 3,
      title: "Earning with DeFi: Staking, Yield Farming, and Liquidity Pools Made Simple",
      category: "paid",
      duration: "5 modules",
      price: "$67",
      difficulty: "Intermediate"
    },
    {
      id: 4,
      title: "Managing Your Own DeFi Portfolio: From Beginner to Confident User",
      category: "paid",
      duration: "5 modules", 
      price: "$97",
      difficulty: "Advanced"
    }
  ];

  // Calculate enhanced stats
  const enrolledCourses = Object.keys(courseProgress).length;
  const completedCourses = Object.values(courseProgress).filter(
    progress => progress.completion_percentage === 100
  ).length;
  const totalProgress = enrolledCourses > 0 
    ? Object.values(courseProgress).reduce((sum, progress) => sum + progress.completion_percentage, 0) / enrolledCourses
    : 0;

  const getCurrentStreak = () => {
    // Mock streak calculation - in a real app, this would be based on actual learning activity
    return Math.floor(Math.random() * 7) + 1;
  };

  const getAchievements = () => {
    const achievements = [];
    
    if (completedCourses >= 1) {
      achievements.push({
        title: "First Course Complete",
        description: "Completed your first course",
        icon: Trophy,
        earned: true,
        date: "2024-01-15"
      });
    }
    
    if (quizStats.passedQuizzes >= 5) {
      achievements.push({
        title: "Quiz Master",
        description: "Passed 5 quizzes",
        icon: Brain,
        earned: true,
        date: "2024-01-18"
      });
    }
    
    if (quizStats.averageScore >= 90) {
      achievements.push({
        title: "High Achiever",
        description: "Average quiz score above 90%",
        icon: Star,
        earned: true,
        date: "2024-01-20"
      });
    }
    
    achievements.push({
      title: "DeFi Master",
      description: "Complete all 4 courses",
      icon: Award,
      earned: completedCourses >= 4,
      date: completedCourses >= 4 ? "2024-01-25" : null
    });

    return achievements;
  };

  const getCoursesByProgress = () => {
    const inProgress = [];
    const completed = [];
    const notStarted = [];

    courses.forEach(course => {
      const progress = courseProgress[course.id];
      if (!progress) {
        notStarted.push(course);
      } else if (progress.completion_percentage === 100) {
        completed.push(course);
      } else {
        inProgress.push(course);
      }
    });

    return { inProgress, completed, notStarted };
  };

  const { inProgress, completed, notStarted } = getCoursesByProgress();
  const achievements = getAchievements();
  const currentStreak = getCurrentStreak();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "free": return "bg-awareness/20 text-awareness border-awareness/30";
      case "paid": return "bg-primary/20 text-primary border-primary/30";
      default: return "bg-muted/20 text-muted-foreground border-border";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-green-600";
      case "Intermediate": return "text-yellow-600";
      case "Advanced": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Enhanced Header */}
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="w-20 h-20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-consciousness">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-4xl font-consciousness font-bold text-foreground mb-2">
              Welcome back!
            </h1>
            <p className="text-muted-foreground font-consciousness text-lg">
              Continue your DeFi learning journey
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline" className="text-sm">
                Level {Math.floor(totalProgress / 25) + 1}
              </Badge>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">{currentStreak} day streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-consciousness font-bold text-foreground">
                  {enrolledCourses}
                </p>
                <p className="text-sm text-muted-foreground font-consciousness">
                  Courses Enrolled
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-awareness/10 to-awareness/5 border-awareness/20">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-awareness" />
              <div>
                <p className="text-2xl font-consciousness font-bold text-foreground">
                  {completedCourses}
                </p>
                <p className="text-sm text-muted-foreground font-consciousness">
                  Completed
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-consciousness font-bold text-foreground">
                  {quizStats.passedQuizzes}
                </p>
                <p className="text-sm text-muted-foreground font-consciousness">
                  Quizzes Passed
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-100 to-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-consciousness font-bold text-foreground">
                  {quizStats.averageScore}%
                </p>
                <p className="text-sm text-muted-foreground font-consciousness">
                  Avg. Quiz Score
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-200">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-consciousness font-bold text-foreground">
                  {Math.round(totalProgress)}%
                </p>
                <p className="text-sm text-muted-foreground font-consciousness">
                  Overall Progress
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-consciousness font-semibold mb-4">Weekly Learning Activity</h3>
          <div className="grid grid-cols-7 gap-4">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="text-center">
                <p className="text-sm font-medium mb-2">{day.day}</p>
                <div className="space-y-1">
                  <div className="h-8 bg-primary/20 rounded flex items-end justify-center">
                    <div 
                      className="bg-primary rounded-b w-full"
                      style={{ height: `${(day.modules / 4) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{day.modules}m</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Main Content with Enhanced Tabs */}
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="progress" className="font-consciousness">
              Course Progress
            </TabsTrigger>
            <TabsTrigger value="achievements" className="font-consciousness">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="activity" className="font-consciousness">
              Recent Activity
            </TabsTrigger>
            <TabsTrigger value="analytics" className="font-consciousness">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6">
            {/* Continue Learning Section */}
            {inProgress.length > 0 && (
              <div>
                <h2 className="text-xl font-consciousness font-semibold text-foreground mb-4">
                  Continue Learning
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {inProgress.map(course => (
                    <Card 
                      key={course.id}
                      className="p-6 bg-card/60 border-border hover:border-primary/40 transition-all cursor-pointer group"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Play className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium text-primary">Continue</span>
                        </div>
                        <Badge className={getCategoryColor(course.category)}>
                          {course.category === "free" ? "Free" : course.price}
                        </Badge>
                      </div>
                      <h3 className="font-consciousness font-semibold text-foreground mb-3 line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                        <span className={getDifficultyColor(course.difficulty)}>
                          {course.difficulty}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(courseProgress[course.id]?.completion_percentage || 0)}%</span>
                        </div>
                        <Progress 
                          value={courseProgress[course.id]?.completion_percentage || 0} 
                          className="h-2"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Courses Section */}
            {completed.length > 0 && (
              <div>
                <h2 className="text-xl font-consciousness font-semibold text-foreground mb-4">
                  Completed Courses
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {completed.map(course => (
                    <Card
                      key={course.id}
                      className="p-6 bg-green-50 border-green-200 hover:border-green-400 transition-all cursor-pointer group"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium text-green-600">Completed</span>
                        </div>
                        <Badge className={getCategoryColor(course.category)}>
                          {course.category === "free" ? "Free" : course.price}
                        </Badge>
                      </div>
                      <h3 className="font-consciousness font-semibold text-foreground mb-3 line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                        <span className={getDifficultyColor(course.difficulty)}>
                          {course.difficulty}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>100%</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Courses Section */}
            {notStarted.length > 0 && (
              <div>
                <h2 className="text-xl font-consciousness font-semibold text-foreground mb-4">
                  Recommended Courses
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {notStarted.map(course => (
                    <Card
                      key={course.id}
                      className="p-6 bg-card/60 border-border hover:border-primary/40 transition-all cursor-pointer group"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Play className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium text-primary">Start Learning</span>
                        </div>
                        <Badge className={getCategoryColor(course.category)}>
                          {course.category === "free" ? "Free" : course.price}
                        </Badge>
                      </div>
                      <h3 className="font-consciousness font-semibold text-foreground mb-3 line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                        <span className={getDifficultyColor(course.difficulty)}>
                          {course.difficulty}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <Card 
                  key={index}
                  className={`p-6 transition-all ${
                    achievement.earned 
                      ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 shadow-lg" 
                      : "bg-card/60 border-border opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-full ${
                      achievement.earned ? "bg-primary/20" : "bg-muted"
                    }`}>
                      <achievement.icon className={`w-6 h-6 ${
                        achievement.earned ? "text-primary" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-consciousness font-semibold text-foreground">
                        {achievement.title}
                      </h3>
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-muted-foreground">
                          Earned {achievement.date}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-consciousness">
                    {achievement.description}
                  </p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="p-6 bg-card/60 border-border">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-primary" />
                <h3 className="font-consciousness font-semibold text-foreground">
                  Recent Activity
                </h3>
              </div>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.passed ? "bg-green-100" : "bg-red-100"
                      }`}>
                        {activity.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Brain className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-consciousness text-foreground">
                          {activity.passed ? "Passed" : "Attempted"} quiz: {activity.quizzes?.title || "Unknown Quiz"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Score: {activity.score}% • {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={activity.passed ? "default" : "destructive"} className="text-xs">
                        {activity.score}%
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground font-consciousness py-8">
                    No recent activity. Start learning to see your progress here!
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-consciousness font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Learning Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Study Time</span>
                    <span className="font-semibold">24h 32m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Session</span>
                    <span className="font-semibold">18 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Best Day</span>
                    <span className="font-semibold">Thursday</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Modules Completed</span>
                    <span className="font-semibold">{Object.values(courseProgress).reduce((sum, p) => sum + (p.completed_modules?.length || 0), 0)}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-consciousness font-semibold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Quiz Performance
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Quizzes Taken</span>
                    <span className="font-semibold">{quizStats.completedQuizzes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pass Rate</span>
                    <span className="font-semibold">
                      {quizStats.completedQuizzes > 0 
                        ? Math.round((quizStats.passedQuizzes / quizStats.completedQuizzes) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Highest Score</span>
                    <span className="font-semibold">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Improvement Trend</span>
                    <span className="font-semibold text-green-600">+12%</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
