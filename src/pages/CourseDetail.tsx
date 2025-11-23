import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProgress } from "@/components/progress/ProgressProvider";
import { AuthModal } from "@/components/auth/AuthModal";
import { ArrowLeft, BookOpen, CheckCircle, Clock, Play, Grid3X3, CreditCard, Lock, ChevronDown, Monitor } from "lucide-react";
import { getCourseContent } from "@/data/courseContent";
import { EnhancedModuleNavigation } from "@/components/course/EnhancedModuleNavigation";
import { CommunityTabs } from "@/components/community/CommunityTabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { ExpandableText } from "@/components/ui/expandable-text";
import { useIsMobile } from "@/hooks/use-mobile";
import { DesktopOnlyNotice } from "@/components/DesktopOnlyNotice";
import { ParticipantTracker } from "@/components/admin/ParticipantTracker";
import { usePresenceTracking } from "@/hooks/usePresenceTracking";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { updateModuleProgress, getCourseProgress } = useProgress();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEnhancedNav, setShowEnhancedNav] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [coursePrice, setCoursePrice] = useState<string>("");
  const { toast: useToastNotification } = useToast();
  const isMobile = useIsMobile();

  const course = getCourseContent(parseInt(courseId || "0"));
  const progress = getCourseProgress(parseInt(courseId || "0"));

  // Track presence for admins
  usePresenceTracking({
    contentType: 'course',
    contentId: courseId || '0',
    progressPercentage: progress?.completion_percentage || 0,
    metadata: { courseTitle: course?.title }
  });

  // Check payment success from URL params
  useEffect(() => {
    const paymentSuccess = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');
    
    if (paymentSuccess === 'success' && sessionId && user) {
      verifyPayment(sessionId);
    }
  }, [searchParams, user]);

  // Check if user has access to this course
  useEffect(() => {
    const checkAccess = async () => {
      if (!course) {
        navigate("/courses");
        return;
      }

      if (!user) {
        setIsCheckingAccess(false);
        setHasAccess(course.category === 'free');
        return;
      }

      if (course.category === 'free') {
        setHasAccess(true);
        setIsCheckingAccess(false);
        return;
      }

      try {
        // Get course price and check access
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('price_cents')
          .eq('id', parseInt(courseId || "0"))
          .single();

        if (courseError) {
          console.error('Error fetching course data:', courseError);
        } else if (courseData?.price_cents) {
          setCoursePrice(`$${(courseData.price_cents / 100).toFixed(2)}`);
        }

        const { data, error } = await supabase.rpc('user_has_purchased_course', {
          course_id: parseInt(courseId || "0")
        });

        if (error) {
          console.error('Error checking course access:', error);
          setHasAccess(false);
        } else {
          setHasAccess(data);
        }
      } catch (error) {
        console.error('Error checking course access:', error);
        setHasAccess(false);
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkAccess();
  }, [course, courseId, user, navigate]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-course-payment', {
        body: { sessionId }
      });

      if (error) {
        console.error('Payment verification error:', error);
        toast.error('Payment verification failed');
      } else {
        toast.success('Payment verified! Welcome to the course!');
        setHasAccess(true);
        // Remove payment params from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error('Payment verification failed');
    }
  };

  useEffect(() => {
    if (!course) {
      navigate("/courses");
    }
  }, [course, navigate]);

  if (!course) {
    return null;
  }

  const handlePurchaseCourse = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsPurchasing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-course-checkout', {
        body: { courseId: parseInt(courseId || "0") }
      });

      if (error) {
        throw error;
      }

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating course checkout:', error);
      toast.error('Failed to initiate course purchase');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleModuleToggle = async (moduleIndex: number) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check if user has access to paid content
    if (course?.category === 'paid' && hasAccess === false) {
      toast.error('You need to purchase this course to access modules');
      return;
    }

    try {
      await updateModuleProgress(course!.id, moduleIndex);
      useToastNotification({
        title: "Progress Updated",
        description: "Module completion status has been saved.",
      });
    } catch (error) {
      useToastNotification({
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
    <>
      <SEO 
        title={`${course.title} - DeFi Course`}
        description={course.description}
        keywords={`DeFi course, ${course.title.toLowerCase()}, decentralized finance, cryptocurrency education, blockchain learning, ${course.category === 'free' ? 'free course' : 'premium course'}`}
        url={`https://www.the3rdeyeadvisors.com/courses/${courseId}`}
        schema={{
          type: 'Course',
          data: {
            offers: {
              price: course.category === 'free' ? "0" : coursePrice.replace('$', '') || "67",
              priceCurrency: "USD"
            },
            hasCourseInstance: true,
            coursePrerequisites: course.difficulty === 'Beginner' ? 'No prior experience required' : 'Basic understanding of cryptocurrency recommended',
            educationalLevel: course.difficulty,
            teaches: course.modules?.map(module => module.title) || [],
            timeRequired: course.estimatedTime,
            courseCode: `DEFI-${courseId}`,
            numberOfCredits: course.modules?.length || 5
          }
        }}
        faq={[
          {
            question: `What will I learn in ${course.title}?`,
            answer: `${course.description} This course covers ${course.modules?.length || 5} comprehensive modules designed to take you from ${course.difficulty.toLowerCase()} level to confident understanding.`
          },
          {
            question: "How long does this course take to complete?",
            answer: `This course is estimated to take ${course.estimatedTime}. You can learn at your own pace with lifetime access to all materials.`
          },
          {
            question: course.category === 'free' ? "Is this course completely free?" : "What's included in the course price?",
            answer: course.category === 'free' 
              ? "Yes, this course is completely free with no hidden costs. Sign up to track your progress and earn completion certificates."
              : `For ${coursePrice}, you get lifetime access to all ${course.modules?.length || 5} modules, community discussions, downloadable resources, and completion certificates.`
          }
        ]}
      />
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
        <div className="mb-8 mobile-typography-center">
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

          {/* Payment Gate for Paid Courses */}
          {course.category === 'paid' && hasAccess === false && user && (
            <Card className="p-6 mb-6 bg-primary/10 border-primary/30 text-center">
              <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-consciousness font-semibold text-primary mb-2">
                Premium Course Access Required
              </h3>
              <p className="text-muted-foreground font-consciousness mb-4">
                This is a paid course. Purchase access to unlock all modules and track your progress.
              </p>
              <Button
                onClick={handlePurchaseCourse}
                disabled={isPurchasing}
                className="bg-primary hover:bg-primary/90 font-consciousness w-full sm:w-auto flex items-center justify-center mx-auto"
                size="lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {isPurchasing ? "Opening Checkout..." : `Purchase Course - ${coursePrice}`}
              </Button>
            </Card>
          )}

          {/* Start Learning Button - Only for users with access */}
          {user && hasAccess && (
            <div className="mb-6 flex justify-center sm:justify-start">
              <Button
                onClick={() => navigate(`/courses/${courseId}/module/${course.modules[0]?.id}`)}
                className="bg-primary hover:bg-primary/90 font-consciousness w-full sm:w-auto flex items-center justify-center"
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

          {/* Mobile: Expandable text, Desktop: Full text */}
          <div className="mb-6">
            <div className="block md:hidden">
              <ExpandableText 
                text={course.description}
                maxLines={3}
                className="text-lg text-muted-foreground font-consciousness leading-relaxed"
                mobileOnly={true}
              />
            </div>
            <p className="hidden md:block text-lg text-muted-foreground font-consciousness leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Softer notice for mobile users */}
          {isMobile && (
            <div className="text-center py-3 px-4 mb-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Fully usable on mobile. For the best experience, we recommend using a desktop or laptop.
              </p>
            </div>
          )}

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
        <div className="flex flex-col gap-3 mb-6 px-4 sm:px-6">
          {/* Title and Metrics Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-base sm:text-2xl font-consciousness font-semibold text-foreground whitespace-normal">
              Course Modules
            </h2>
            <div className="flex items-center gap-3">
              <ParticipantTracker contentType="course" contentId={courseId || '0'} />
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="flex w-full rounded-lg bg-background/40 border border-border/40 p-1 gap-2">
            <button
              onClick={() => setShowEnhancedNav(true)}
              className={`flex-1 inline-flex items-center justify-center rounded-md px-3 py-2 text-xs sm:text-sm font-medium font-consciousness transition-colors ${
                showEnhancedNav
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground bg-transparent'
              }`}
            >
              <Grid3X3 className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Enhanced View</span>
            </button>
            <button
              onClick={() => setShowEnhancedNav(false)}
              className={`flex-1 inline-flex items-center justify-center rounded-md px-3 py-2 text-xs sm:text-sm font-medium font-consciousness transition-colors ${
                !showEnhancedNav
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground bg-transparent'
              }`}
            >
              <Grid3X3 className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Simple View</span>
            </button>
          </div>
        </div>

        {/* Enhanced or Simple Module Navigation */}
        {isCheckingAccess ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground font-consciousness">Checking course access...</p>
          </div>
        ) : showEnhancedNav ? (
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
              const isLocked = course.category === 'paid' && hasAccess === false;
              
              return (
                <Card
                  key={index}
                  className={`p-6 transition-all duration-300 ${
                    isLocked 
                      ? "bg-muted/30 border-muted cursor-not-allowed opacity-60"
                      : isCompleted 
                        ? "bg-primary/5 border-primary/30 cursor-pointer" 
                        : "bg-card/60 border-border hover:border-primary/40 cursor-pointer"
                  }`}
                  onClick={() => {
                    if (isLocked) {
                      toast.error('Purchase the course to access this module');
                      return;
                    }
                    navigate(`/courses/${courseId}/module/${module.id}`)
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {user && !isLocked ? (
                        <div onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isCompleted}
                            onCheckedChange={() => handleModuleToggle(index)}
                            className="mt-1"
                          />
                        </div>
                      ) : (
                        <div className={`w-4 h-4 border rounded mt-1 ${
                          isLocked ? "border-muted" : "border-border"
                        }`} />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-sm font-system ${
                            isLocked ? "text-muted-foreground/60" : "text-muted-foreground"
                          }`}>
                            Module {index + 1}
                          </span>
                          {isCompleted && !isLocked && (
                            <CheckCircle className="w-4 h-4 text-primary" />
                          )}
                          {isLocked && (
                            <Lock className="w-4 h-4 text-muted-foreground/60" />
                          )}
                        </div>
                        <h3 className={`font-consciousness font-medium ${
                          isLocked ? "text-muted-foreground/60" 
                          : isCompleted ? "text-primary" : "text-foreground"
                        }`}>
                          {module.title}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          isLocked ? "text-muted-foreground/40" : "text-muted-foreground"
                        }`}>
                          {module.duration} minutes • {module.type}
                        </p>
                      </div>
                      
                      {!isLocked && <Play className="w-5 h-5 text-primary" />}
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
    </>
  );
};

export default CourseDetail;