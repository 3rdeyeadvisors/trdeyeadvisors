import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProgress } from "@/components/progress/ProgressProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/progress/ProgressBar";
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
  Star
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { courseProgress } = useProgress();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Mock courses data - in a real app, this would come from an API
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

  // Calculate stats
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
    
    if (completedCourses >= 2) {
      achievements.push({
        title: "Knowledge Builder",
        description: "Completed 2 courses",
        icon: Award,
        earned: true,
        date: "2024-01-20"
      });
    }
    
    achievements.push({
      title: "DeFi Master",
      description: "Complete all 4 courses",
      icon: Star,
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
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="w-16 h-16">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-consciousness">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-consciousness font-bold text-foreground">
              Welcome back!
            </h1>
            <p className="text-muted-foreground font-consciousness">
              Continue your DeFi learning journey
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-card/60 border-border">
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

          <Card className="p-6 bg-card/60 border-border">
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

          <Card className="p-6 bg-card/60 border-border">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-consciousness font-bold text-foreground">
                  {Math.round(totalProgress)}%
                </p>
                <p className="text-sm text-muted-foreground font-consciousness">
                  Avg. Progress
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/60 border-border">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-consciousness font-bold text-foreground">
                  {currentStreak}
                </p>
                <p className="text-sm text-muted-foreground font-consciousness">
                  Day Streak
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress" className="font-consciousness">
              Course Progress
            </TabsTrigger>
            <TabsTrigger value="achievements" className="font-consciousness">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="activity" className="font-consciousness">
              Recent Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6">
            {/* In Progress Courses */}
            {inProgress.length > 0 && (
              <div>
                <h2 className="text-xl font-consciousness font-semibold text-foreground mb-4">
                  Continue Learning
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {inProgress.map(course => (
                    <Card 
                      key={course.id}
                      className="p-6 bg-card/60 border-border hover:border-primary/40 transition-all cursor-pointer"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <BookOpen className="w-6 h-6 text-primary" />
                        <Badge className={getCategoryColor(course.category)}>
                          {course.category === "free" ? "Free" : course.price}
                        </Badge>
                      </div>
                      <h3 className="font-consciousness font-semibold text-foreground mb-2 line-clamp-2">
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
                      <ProgressBar courseId={course.id} showBadge={false} />
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Courses */}
            {completed.length > 0 && (
              <div>
                <h2 className="text-xl font-consciousness font-semibold text-foreground mb-4">
                  Completed Courses
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {completed.map(course => (
                    <Card 
                      key={course.id}
                      className="p-6 bg-primary/5 border-primary/30 hover:border-primary/50 transition-all cursor-pointer"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <Trophy className="w-6 h-6 text-primary" />
                        <Badge variant="default">
                          Completed
                        </Badge>
                      </div>
                      <h3 className="font-consciousness font-semibold text-foreground mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                        <span className={getDifficultyColor(course.difficulty)}>
                          {course.difficulty}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Courses */}
            {notStarted.length > 0 && (
              <div>
                <h2 className="text-xl font-consciousness font-semibold text-foreground mb-4">
                  Recommended for You
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {notStarted.slice(0, 2).map(course => (
                    <Card 
                      key={course.id}
                      className="p-6 bg-card/60 border-border hover:border-primary/40 transition-all cursor-pointer"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <BookOpen className="w-6 h-6 text-muted-foreground" />
                        <Badge className={getCategoryColor(course.category)}>
                          {course.category === "free" ? "Free" : course.price}
                        </Badge>
                      </div>
                      <h3 className="font-consciousness font-semibold text-foreground mb-2 line-clamp-2">
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
                      <Button variant="outline" size="sm" className="w-full font-consciousness">
                        Start Learning
                      </Button>
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
                  className={`p-6 ${
                    achievement.earned 
                      ? "bg-primary/10 border-primary/30" 
                      : "bg-card/60 border-border opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <achievement.icon className={`w-8 h-8 ${
                      achievement.earned ? "text-primary" : "text-muted-foreground"
                    }`} />
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
                {Object.entries(courseProgress).slice(0, 5).map(([courseId, progress]) => {
                  const course = courses.find(c => c.id === parseInt(courseId));
                  if (!course) return null;
                  
                  return (
                    <div key={courseId} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-consciousness text-foreground">
                          {progress.completion_percentage === 100 ? "Completed" : "Progressed in"} {course.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(progress.last_accessed).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(progress.completion_percentage)}%
                      </Badge>
                    </div>
                  );
                })}
                
                {Object.keys(courseProgress).length === 0 && (
                  <p className="text-center text-muted-foreground font-consciousness py-8">
                    No activity yet. Start your first course to see your progress here!
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;