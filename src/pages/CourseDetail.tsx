import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProgress } from "@/components/progress/ProgressProvider";
import { AuthModal } from "@/components/auth/AuthModal";
import { ArrowLeft, BookOpen, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateModuleProgress, getCourseProgress } = useProgress();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();

  // Mock course data - in a real app, this would come from an API
  const courses = [
    {
      id: 1,
      title: "DeFi Foundations: Understanding the New Financial System",
      description: "Complete beginner's guide from zero knowledge to confident understanding. Learn what DeFi is, why it exists, and how it works in plain English.",
      category: "free",
      duration: "5 modules",
      modules: [
        "What is DeFi? (Simple explanation with comparisons to traditional banking)",
        "Why DeFi Exists (The problems it solves – fees, middlemen, accessibility)",
        "The Blockchain Basics You Actually Need to Know (No tech overload)",
        "The Key Players (Stablecoins, DEXs, lending protocols – explained simply)",
        "Risks and Myths (Separating facts from hype)"
      ]
    },
    {
      id: 2,
      title: "Staying Safe in DeFi: Wallets, Security, and Avoiding Scams",
      description: "Essential security course for beginners worried about hacks or losing funds. Learn to set up wallets correctly and keep funds safe.",
      category: "free",
      duration: "5 modules",
      modules: [
        "Choosing the Right Wallet (MetaMask, Trust Wallet, or Ledger?)",
        "Private Keys & Seed Phrases – The Rule You Can't Break",
        "Spotting Scams and Fake Projects Before You Click",
        "Safe Transactions – Sending, Receiving, and Testing Small First",
        "The Beginner's Checklist for DeFi Security"
      ]
    },
    {
      id: 3,
      title: "Earning with DeFi: Staking, Yield Farming, and Liquidity Pools Made Simple",
      description: "Ready to earn passive income? Understand different earning methods and choose what fits your risk level.",
      category: "paid",
      duration: "5 modules",
      price: "$67",
      modules: [
        "How People Earn with DeFi (Overview)",
        "Staking vs Yield Farming – Which is Better for You?",
        "What Are Liquidity Pools (Explained Without Confusion)",
        "How to Calculate Risk vs Reward Before You Invest",
        "Beginner-Friendly Platforms to Start With"
      ]
    },
    {
      id: 4,
      title: "Managing Your Own DeFi Portfolio: From Beginner to Confident User",
      description: "Learn to actively manage a small DeFi portfolio. Track, adjust, and grow your investments responsibly.",
      category: "paid",
      duration: "5 modules",
      price: "$97",
      modules: [
        "How to Build a Starter Portfolio (Even with $100)",
        "Tracking Your Investments (Best DeFi Portfolio Tools)",
        "When to Reinvest vs Take Profits",
        "Recognizing Market Trends Without Guessing",
        "Staying Consistent: The Long-Term DeFi Mindset"
      ]
    }
  ];

  const course = courses.find(c => c.id === parseInt(courseId || "0"));
  const progress = getCourseProgress(parseInt(courseId || "0"));

  useEffect(() => {
    if (!course) {
      navigate("/courses");
    }
  }, [course, navigate]);

  if (!course) {
    return null;
  }

  const handleModuleToggle = async (moduleIndex: number) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      await updateModuleProgress(course.id, moduleIndex);
      toast({
        title: "Progress Updated",
        description: "Module completion status has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isModuleCompleted = (moduleIndex: number) => {
    return progress?.completed_modules?.includes(moduleIndex) || false;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "free": return "bg-awareness/20 text-awareness border-awareness/30";
      case "paid": return "bg-primary/20 text-primary border-primary/30";
      default: return "bg-muted/20 text-muted-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate("/courses")}
          className="mb-8 font-consciousness"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        {/* Course Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <Badge className={getCategoryColor(course.category)}>
                {course.category === "free" ? "Free Course" : 
                 course.category === "paid" ? `${course.price} Course` : "Course"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="font-system">{course.duration}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-consciousness font-bold text-foreground mb-4">
            {course.title}
          </h1>

          <p className="text-lg text-muted-foreground font-consciousness leading-relaxed mb-6">
            {course.description}
          </p>

          {user && (
            <ProgressBar 
              courseId={course.id} 
              className="mb-6"
            />
          )}

          {!user && (
            <Card className="p-6 mb-6 bg-awareness/10 border-awareness/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-consciousness font-semibold text-foreground mb-2">
                    Track Your Progress
                  </h3>
                  <p className="text-muted-foreground font-consciousness">
                    Sign in to save your progress and earn completion badges.
                  </p>
                </div>
                <Button
                  variant="awareness"
                  onClick={() => setShowAuthModal(true)}
                  className="font-consciousness"
                >
                  Sign In
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Modules */}
        <div className="space-y-4">
          <h2 className="text-2xl font-consciousness font-semibold text-foreground mb-6">
            Course Modules
          </h2>

          {course.modules.map((module, index) => {
            const isCompleted = isModuleCompleted(index);
            
            return (
              <Card
                key={index}
                className={`p-6 transition-all duration-300 ${
                  isCompleted 
                    ? "bg-primary/5 border-primary/30" 
                    : "bg-card/60 border-border hover:border-primary/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {user ? (
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => handleModuleToggle(index)}
                        className="mt-1"
                      />
                    ) : (
                      <div className="w-4 h-4 border border-border rounded mt-1" />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-system text-muted-foreground">
                          Module {index + 1}
                        </span>
                        {isCompleted && (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <h3 className={`font-consciousness font-medium ${
                        isCompleted ? "text-primary" : "text-foreground"
                      }`}>
                        {module}
                      </h3>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Course Complete Badge */}
        {user && progress?.completion_percentage === 100 && (
          <Card className="p-6 mt-8 bg-primary/10 border-primary/30 text-center">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-consciousness font-semibold text-primary mb-2">
              Course Complete! 🎉
            </h3>
            <p className="text-muted-foreground font-consciousness">
              Congratulations on completing this course. You've taken an important step in your DeFi journey.
            </p>
          </Card>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default CourseDetail;