import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/progress/ProgressBar';
import { useAuth } from '@/components/auth/AuthProvider';
import { LucideIcon, Star, Lock, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  modules: string[];
  icon: LucideIcon;
  isEarlyAccess?: boolean;
  isLocked?: boolean;
  public_release_date?: string | null;
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

  const handleStartCourse = () => {
    if (course.isLocked) {
      onAuthRequired();
      return;
    }
    onStartCourse(course.id);
  };

  const getButtonText = () => {
    if (course.isLocked) return "Upgrade to Annual";
    if (!user) return "Start Learning";
    return "Continue Learning";
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const diffTime = date.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <Card 
      className={`p-5 sm:p-6 bg-card border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group w-full flex flex-col ${
        course.isLocked ? 'opacity-75' : ''
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
          <course.icon className="w-6 h-6 text-primary group-hover:text-primary-glow transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          {course.isEarlyAccess && (
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs px-2 py-0.5 flex items-center gap-1">
              <Star className="w-3 h-3" />
              Early Access
            </Badge>
          )}
          {course.isLocked ? (
            <Badge className="bg-muted text-muted-foreground border-border text-xs px-3 py-1 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Annual Only
            </Badge>
          ) : (
            <Badge className="bg-awareness/20 text-awareness border-awareness/30 text-xs px-3 py-1">
              Free
            </Badge>
          )}
        </div>
      </div>
      
      <h3 className="text-base sm:text-lg font-consciousness font-semibold text-foreground mb-3 leading-tight">
        {course.title}
      </h3>
      
      <p className="text-sm text-foreground/70 font-consciousness mb-5 leading-relaxed flex-1">
        {course.description}
      </p>

      {user && !course.isLocked && (
        <ProgressBar 
          courseId={course.id} 
          className="mb-5"
        />
      )}
      
      <div className="flex flex-col gap-3 mt-auto">
        <Button 
          variant={course.isLocked ? "outline" : "awareness"}
          size="default"
          className="font-consciousness w-full min-h-[48px]"
          onClick={handleStartCourse}
        >
          {getButtonText()}
        </Button>
        {course.isLocked && course.public_release_date && (
          <div className="flex items-center justify-center gap-1.5 text-awareness text-[10px] sm:text-xs font-consciousness animate-pulse py-1">
            <Clock className="w-3 h-3" />
            <span>Public release in {getDaysUntil(course.public_release_date)} days</span>
          </div>
        )}
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