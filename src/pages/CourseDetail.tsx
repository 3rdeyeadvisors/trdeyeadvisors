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
import { ArrowLeft, BookOpen, CheckCircle, Clock, Play, Grid3X3 } from "lucide-react";
import { getCourseContent } from "@/data/courseContent";
import { EnhancedModuleNavigation } from "@/components/course/EnhancedModuleNavigation";
import { CommunityTabs } from "@/components/community/CommunityTabs";
import { useToast } from "@/hooks/use-toast";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateModuleProgress, getCourseProgress } = useProgress();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEnhancedNav, setShowEnhancedNav] = useState(false);
  const { toast } = useToast();

  const course = getCourseContent(parseInt(courseId || "0"));
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
                {course.category === "free" ? "Free Course" : "Paid Course"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="font-system">{course.estimatedTime}</span>
            </div>
          </div>

          {/* Start Learning Button */}
          {user && (
            <div className="mb-6">
              <Button
                onClick={() => navigate(`/courses/${courseId}/module/${course.modules[0]?.id}`)}
                className="bg-primary hover:bg-primary/90 font-consciousness"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                {progress?.completion_percentage ? "Continue Learning" : "Start Learning"}
              </Button>
            </div>
          )}

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

        {/* Module Navigation Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-consciousness font-semibold text-foreground">
            Course Modules
          </h2>
          <Button
            variant="outline"
            onClick={() => setShowEnhancedNav(!showEnhancedNav)}
            className="font-consciousness"
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            {showEnhancedNav ? "Simple View" : "Enhanced View"}
          </Button>
        </div>

        {/* Enhanced or Simple Module Navigation */}
        {showEnhancedNav ? (
          <EnhancedModuleNavigation
            courseId={course.id}
            onModuleSelect={(moduleId) => navigate(`/courses/${courseId}/module/${moduleId}`)}
            showProgress={true}
            compact={false}
          />
        ) : (
          <div className="space-y-4">
            {course.modules.map((module, index) => {
              const isCompleted = isModuleCompleted(index);
              
              return (
                <Card
                  key={index}
                  className={`p-6 transition-all duration-300 cursor-pointer ${
                    isCompleted 
                      ? "bg-primary/5 border-primary/30" 
                      : "bg-card/60 border-border hover:border-primary/40"
                  }`}
                  onClick={() => navigate(`/courses/${courseId}/module/${module.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {user ? (
                        <div onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isCompleted}
                            onCheckedChange={() => handleModuleToggle(index)}
                            className="mt-1"
                          />
                        </div>
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
                          {module.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {module.duration} minutes • {module.type}
                        </p>
                      </div>
                      
                      <Play className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

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

        {/* Community Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-consciousness font-semibold text-foreground mb-6">
            Community
          </h2>
          <CommunityTabs courseId={course.id} />
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default CourseDetail;