import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/progress/ProgressBar';
import { useAuth } from '@/components/auth/AuthProvider';
import { LucideIcon, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    if (!user) {
      onAuthRequired();
      return;
    }

    // For paid courses, check if user has access
    if (course.category === 'paid' && hasAccess === false) {
      handlePurchaseCourse();
      return;
    }

    onStartCourse(course.id);
  };

  const getButtonText = () => {
    if (!user) return "Start Learning";
    if (isCheckingAccess) return "Checking Access...";
    if (course.category === 'free') return user ? "Continue Learning" : "Start Learning";
    if (course.category === 'paid') {
      if (hasAccess === null) return "Checking Access...";
      if (hasAccess === false) return isPurchasing ? "Opening Checkout..." : "Purchase Course";
      return "Continue Learning";
    }
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
      className="p-6 bg-card/60 border-border hover:border-primary/40 transition-all duration-cosmic hover:shadow-consciousness group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <course.icon className="w-8 h-8 text-primary group-hover:text-primary-glow transition-colors" />
        <Badge className={getCategoryColor(course.category)}>
          {course.category === "free" ? "Free" : 
           course.category === "paid" ? course.price : "Tool"}
        </Badge>
      </div>
      
      <h3 className="text-xl font-consciousness font-semibold text-foreground mb-3">
        {course.title}
      </h3>
      
      <p className="text-muted-foreground font-consciousness mb-4 leading-relaxed">
        {course.description}
      </p>

      {user && (
        <ProgressBar 
          courseId={course.id} 
          className="mb-4"
        />
      )}
      
      <div className="flex flex-col gap-3">
        <div className="flex justify-center">
          <Button 
            variant={course.category === "paid" ? "cosmic" : "awareness"}
            size="sm"
            className="font-consciousness w-full sm:w-auto"
            onClick={handleStartCourse}
            disabled={isCheckingAccess || isPurchasing}
          >
            {getButtonIcon()}
            {getButtonText()}
          </Button>
        </div>
        <div className="text-center">
          <span className="text-sm text-muted-foreground font-system">
            {course.duration}
          </span>
        </div>
      </div>
    </Card>
  );
};