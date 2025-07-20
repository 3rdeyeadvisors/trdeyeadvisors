import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Shield, TrendingUp, Calculator, AlertTriangle, Wallet, ArrowLeftRight, PieChart, Target } from "lucide-react";

const VideoTutorials = () => {
  const [selectedCategory, setSelectedCategory] = useState("immediate");

  const videoCategories = {
    immediate: {
      title: "Immediate Impact",
      description: "Essential tutorials to get started safely",
      icon: Target,
      videos: [
        {
          id: "wallet-setup",
          title: "Wallet Setup & Security",
          description: "Complete guide to setting up MetaMask and securing your crypto wallet",
          duration: "8 min",
          difficulty: "Beginner",
          course: "Courses 1 & 2",
          thumbnail: "/api/placeholder/400/225",
          steps: 6,
          icon: Wallet,
          priority: "High"
        },
        {
          id: "first-dex-swap",
          title: "Your First DEX Swap",
          description: "Step-by-step tutorial for making your first decentralized exchange trade",
          duration: "12 min",
          difficulty: "Beginner",
          course: "Course 1",
          thumbnail: "/api/placeholder/400/225",
          steps: 8,
          icon: ArrowLeftRight,
          priority: "High"
        },
        {
          id: "defi-calculators",
          title: "Using DeFi Calculators",
          description: "Master the platform's yield and impermanent loss calculators",
          duration: "6 min",
          difficulty: "Beginner",
          course: "Platform Tools",
          thumbnail: "/api/placeholder/400/225",
          steps: 4,
          icon: Calculator,
          priority: "High"
        },
        {
          id: "spotting-scams",
          title: "Spotting Scam Websites",
          description: "Visual guide to identifying and avoiding DeFi scams",
          duration: "10 min",
          difficulty: "Beginner",
          course: "Course 2",
          thumbnail: "/api/placeholder/400/225",
          steps: 7,
          icon: AlertTriangle,
          priority: "Critical"
        }
      ]
    },
    practical: {
      title: "Practical DeFi Actions",
      description: "Hands-on tutorials for DeFi strategies",
      icon: TrendingUp,
      videos: [
        {
          id: "yield-farming",
          title: "Yield Farming Step-by-Step",
          description: "Complete walkthrough of yield farming strategies and execution",
          duration: "15 min",
          difficulty: "Intermediate",
          course: "Course 3",
          thumbnail: "/api/placeholder/400/225",
          steps: 10,
          icon: TrendingUp,
          priority: "Medium"
        },
        {
          id: "liquidity-pools",
          title: "Liquidity Pool Basics",
          description: "Understanding and participating in liquidity pools safely",
          duration: "12 min",
          difficulty: "Intermediate",
          course: "Course 3",
          thumbnail: "/api/placeholder/400/225",
          steps: 8,
          icon: TrendingUp,
          priority: "Medium"
        },
        {
          id: "portfolio-tracking",
          title: "Portfolio Tracking Setup",
          description: "Set up comprehensive DeFi portfolio tracking and monitoring",
          duration: "9 min",
          difficulty: "Beginner",
          course: "Course 4",
          thumbnail: "/api/placeholder/400/225",
          steps: 6,
          icon: PieChart,
          priority: "Medium"
        },
        {
          id: "risk-assessment",
          title: "Risk Assessment Walkthrough",
          description: "Practical guide to evaluating DeFi protocol risks",
          duration: "14 min",
          difficulty: "Advanced",
          course: "Course 4",
          thumbnail: "/api/placeholder/400/225",
          steps: 9,
          icon: Shield,
          priority: "Medium"
        }
      ]
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-500";
      case "High": return "bg-orange-500";
      case "Medium": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-green-600 bg-green-50";
      case "Intermediate": return "text-yellow-600 bg-yellow-50";
      case "Advanced": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Video Tutorials
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Visual, step-by-step guides to master DeFi safely and effectively
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            {Object.entries(videoCategories).map(([key, category]) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  {category.title}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(videoCategories).map(([key, category]) => (
            <TabsContent key={key} value={key}>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">{category.title}</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.videos.map((video) => {
                  const VideoIcon = video.icon;
                  return (
                    <Card key={video.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <VideoIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {video.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${getPriorityColor(video.priority)} text-white border-0`}
                                >
                                  {video.priority}
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getDifficultyColor(video.difficulty)} border-0`}
                                >
                                  {video.difficulty}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <CardDescription className="mb-4 text-sm">
                          {video.description}
                        </CardDescription>

                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span>{video.duration}</span>
                          <span>{video.steps} steps</span>
                          <span>{video.course}</span>
                        </div>

                        <Button 
                          className="w-full group-hover:bg-primary group-hover:text-white transition-all"
                          variant="outline"
                          onClick={() => {
                            const tutorialRoutes: { [key: string]: string } = {
                              "wallet-setup": "/tutorials/wallet-setup",
                              "first-dex-swap": "/tutorials/first-dex-swap",
                              "defi-calculators": "/tutorials/defi-calculators",
                              "spotting-scams": "/tutorials/spotting-scams"
                            };
                            window.location.href = tutorialRoutes[video.id] || "/tutorials";
                          }}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Tutorial
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Coming Soon Section */}
        <Card className="mt-12 bg-gradient-to-r from-primary/5 to-purple-600/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">More Tutorials Coming Soon</CardTitle>
            <CardDescription>
              We're continuously adding new video content. Next up: Advanced DeFi strategies and protocol deep-dives.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default VideoTutorials;