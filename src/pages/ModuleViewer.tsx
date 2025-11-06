import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedContentPlayer } from "@/components/course/EnhancedContentPlayer";
import { CommunityTabs } from "@/components/community/CommunityTabs";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProgress } from "@/components/progress/ProgressProvider";
import { AuthModal } from "@/components/auth/AuthModal";
import { getCourseContent } from "@/data/courseContent";
import { ArrowLeft, BookOpen, List, Play } from "lucide-react";

const ModuleViewer = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCourseProgress } = useProgress();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showModuleList, setShowModuleList] = useState(false);

  const course = getCourseContent(parseInt(courseId || "0"));
  const currentModuleIndex = course?.modules.findIndex(m => m.id === moduleId) ?? -1;
  const currentModule = course?.modules[currentModuleIndex];

  useEffect(() => {
    if (!course || currentModuleIndex === -1) {
      navigate("/courses");
    }
  }, [course, currentModuleIndex, navigate]);

  if (!course || currentModuleIndex === -1 || !currentModule) {
    return null;
  }

  const progress = getCourseProgress(course.id);
  
  const handleModuleComplete = () => {
    // Content player handles the completion logic
  };

  const handleNext = () => {
    if (currentModuleIndex < course.modules.length - 1) {
      const nextModule = course.modules[currentModuleIndex + 1];
      navigate(`/courses/${courseId}/module/${nextModule.id}`);
    }
  };

  const handlePrevious = () => {
    if (currentModuleIndex > 0) {
      const prevModule = course.modules[currentModuleIndex - 1];
      navigate(`/courses/${courseId}/module/${prevModule.id}`);
    }
  };

  const isModuleCompleted = (moduleIndex: number) => {
    return progress?.completed_modules?.includes(moduleIndex) || false;
  };

  if (!user) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="outline"
            onClick={() => navigate(`/courses/${courseId}`)}
            className="mb-8 font-consciousness"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>

          <Card className="p-8 text-center bg-awareness/10 border-awareness/30">
            <BookOpen className="w-16 h-16 text-awareness mx-auto mb-4" />
            <h1 className="text-2xl font-consciousness font-bold text-foreground mb-4">
              Sign In Required
            </h1>
            <p className="text-muted-foreground font-consciousness mb-6">
              Please sign in to access course content and track your progress.
            </p>
            <Button
              variant="awareness"
              onClick={() => setShowAuthModal(true)}
              className="font-consciousness"
            >
              Sign In to Continue
            </Button>
          </Card>

          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="w-full px-4 md:px-6 mobile-typography-center">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/courses/${courseId}`)}
              className="font-consciousness text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Course</span>
              <span className="sm:hidden">Back</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setShowModuleList(!showModuleList)}
              className="font-consciousness text-sm md:text-base"
            >
              <List className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">All Modules</span>
              <span className="sm:hidden">Modules</span>
            </Button>
          </div>

          <div className="text-left md:text-right">
            <h2 className="text-base md:text-lg font-consciousness font-semibold text-foreground line-clamp-1">
              {course.title}
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              {course.category === "free" ? "Free Course" : `${course.category} Course`}
            </p>
          </div>
        </div>

        {/* Module List Sidebar */}
        {showModuleList && (
          <Card className="mb-4 md:mb-6 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-consciousness font-semibold mb-3 md:mb-4 text-center md:text-left">Course Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
              {course.modules.map((module, index) => {
                const isCompleted = isModuleCompleted(index);
                const isCurrent = index === currentModuleIndex;
                
                return (
                  <Button
                    key={module.id}
                    variant={isCurrent ? "default" : "outline"}
                    className={`h-auto p-3 md:p-4 min-h-[60px] transition-all ${
                      isCurrent 
                        ? "bg-primary/10 border-primary/50 text-primary hover:bg-primary/20" 
                        : isCompleted 
                          ? "bg-awareness/10 border-awareness/40 hover:bg-awareness/20" 
                          : "bg-card border-border hover:border-primary/30"
                    }`}
                    onClick={() => {
                      navigate(`/courses/${courseId}/module/${module.id}`);
                      setShowModuleList(false);
                    }}
                  >
                    <div className="flex items-center gap-2 md:gap-3 w-full">
                      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                        {isCompleted ? (
                          <div className="w-5 h-5 md:w-6 md:h-6 bg-awareness rounded-full flex items-center justify-center">
                            <span className="text-foreground text-xs font-bold">✓</span>
                          </div>
                        ) : (
                          <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-current rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">{index + 1}</span>
                          </div>
                        )}
                        {isCurrent && <Play className="w-3 h-3 md:w-4 md:h-4" />}
                      </div>
                      <div className="flex-1 min-w-0 text-center md:text-left">
                        <p className="text-xs md:text-sm font-medium break-words whitespace-normal">{module.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{module.duration} min</p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </Card>
        )}

        {/* Enhanced Content Player */}
        <EnhancedContentPlayer
          courseId={course.id}
          module={currentModule}
          onComplete={handleModuleComplete}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={currentModuleIndex < course.modules.length - 1}
          hasPrevious={currentModuleIndex > 0}
          currentModuleIndex={currentModuleIndex}
          totalModules={course.modules.length}
        />

        {/* Community Features - Only for authenticated users */}
        <div className="mt-8 md:mt-12">
          <Card className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-consciousness font-bold text-center mb-6">
              Community Discussion
            </h2>
            <CommunityTabs 
              courseId={course.id} 
              moduleId={currentModule.id}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModuleViewer;