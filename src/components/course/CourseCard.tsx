import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/progress/ProgressBar';
import { useAuth } from '@/components/auth/AuthProvider';
import { LucideIcon } from 'lucide-react';

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "free": return "bg-awareness/20 text-awareness border-awareness/30";
      case "paid": return "bg-primary/20 text-primary border-primary/30";
      case "tool": return "bg-accent/20 text-accent border-accent/30";
      default: return "bg-muted/20 text-muted-foreground border-border";
    }
  };

  const handleStartCourse = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    onStartCourse(course.id);
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
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-system">
          {course.duration}
        </span>
        <Button 
          variant={course.category === "paid" ? "cosmic" : "awareness"}
          size="sm"
          className="font-consciousness"
          onClick={handleStartCourse}
        >
          {course.category === "tool" ? "Launch" : 
           user ? "Continue Learning" : "Start Learning"}
        </Button>
      </div>
    </Card>
  );
};