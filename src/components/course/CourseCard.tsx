import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/progress/ProgressBar';
import { useAuth } from '@/components/auth/AuthProvider';
import { LucideIcon, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  price?: string;
  modules: string[];
  icon: LucideIcon;
}

interface CourseCardProps {
  course: Course;
  index: number;
  onStartCourse: (courseId: number) => void;
  onAuthRequired: () => void;
}

export const CourseCard = ({ course, index, onStartCourse, onAuthRequired }: CourseCardProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Check if user has access to this course
  useEffect(() => {
    const checkAccess = async () => {
      if (!user || course.category === 'free') {
        setHasAccess(course.category === 'free');
        return;
      }

      try {
        setIsCheckingAccess(true);
        const { data, error } = await supabase.rpc('user_has_purchased_course', {
          course_id: course.id
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
  }, [user, course.id, course.category]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "free": return "bg-awareness/20 text-awareness border-awareness/30";
      case "paid": return "bg-primary/20 text-primary border-primary/30";
      case "tool": return "bg-accent/20 text-accent border-accent/30";
      default: return "bg-muted/20 text-muted-foreground border-border";
    }
  };

  const handlePurchaseCourse = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    setIsPurchasing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-course-checkout', {
        body: { courseId: course.id }
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

  const handleStartCourse = () => {
    // Allow all users (including visitors) to view course details
    onStartCourse(course.id);
  };

  const getButtonText = () => {
    if (!user) return "Start Learning";
    if (isCheckingAccess) return "Checking Access...";
    return user ? "Continue Learning" : "Start Learning";
  };

  const getButtonIcon = () => {
    if (course.category === 'paid' && hasAccess === false && user) {
      return <CreditCard className="w-4 h-4 mr-2" />;
    }
    return null;
  };

  return (
    <Card 
      className="p-5 sm:p-6 bg-card border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group w-full flex flex-col"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
          <course.icon className="w-6 h-6 text-primary group-hover:text-primary-glow transition-colors" />
        </div>
        <Badge className={`${getCategoryColor('free')} text-xs px-3 py-1`}>
          Free
        </Badge>
      </div>
      
      <h3 className="text-base sm:text-lg font-consciousness font-semibold text-foreground mb-3 leading-tight">
        {course.title}
      </h3>
      
      <p className="text-sm text-foreground/70 font-consciousness mb-5 leading-relaxed flex-1">
        {course.description}
      </p>

      {user && (
        <ProgressBar 
          courseId={course.id} 
          className="mb-5"
        />
      )}
      
      <div className="flex flex-col gap-3 mt-auto">
        <Button 
          variant="awareness"
          size="default"
          className="font-consciousness w-full min-h-[48px]"
          onClick={handleStartCourse}
          disabled={isCheckingAccess}
        >
          {getButtonText()}
        </Button>
        {isMobile && (
          <p className="text-xs text-foreground/60 text-center">
            Fully usable on mobile. Best experience on desktop.
          </p>
        )}
        <div className="text-center pt-1">
          <span className="text-xs text-foreground/60 font-system">
            {course.duration}
          </span>
        </div>
      </div>
    </Card>
  );
};