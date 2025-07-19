import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProgress } from "@/components/progress/ProgressProvider";
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  FileText, 
  ExternalLink,
  Download,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { ModuleContent } from "@/data/courseContent";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";

interface ContentPlayerProps {
  courseId: number;
  module: ModuleContent;
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  currentModuleIndex: number;
  totalModules: number;
}

export const ContentPlayer = ({
  courseId,
  module,
  onComplete,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  currentModuleIndex,
  totalModules
}: ContentPlayerProps) => {
  const { user } = useAuth();
  const { getCourseProgress, updateModuleProgress } = useProgress();
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [notes, setNotes] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const { toast } = useToast();

  // Check if module is already completed
  useEffect(() => {
    if (user) {
      const progress = getCourseProgress(courseId);
      const completed = progress?.completed_modules?.includes(currentModuleIndex) || false;
      setIsCompleted(completed);
    }
  }, [user, courseId, currentModuleIndex, getCourseProgress]);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000 / 60));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [startTime]);

  // Track reading progress for text content
  useEffect(() => {
    if (module.type === 'text') {
      const handleScroll = () => {
        const contentElement = document.getElementById('module-content');
        if (contentElement) {
          const scrollTop = contentElement.scrollTop;
          const scrollHeight = contentElement.scrollHeight - contentElement.clientHeight;
          const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
          setReadingProgress(Math.min(progress, 100));
        }
      };

      const contentElement = document.getElementById('module-content');
      contentElement?.addEventListener('scroll', handleScroll);
      return () => contentElement?.removeEventListener('scroll', handleScroll);
    }
  }, [module.type]);

  const handleComplete = async () => {
    if (!user) return;

    try {
      await updateModuleProgress(courseId, currentModuleIndex);
      setIsCompleted(true);
      onComplete();
      
      toast({
        title: "Module Completed! 🎉",
        description: `You've finished "${module.title}". Keep up the great work!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark Removed" : "Bookmark Added",
      description: isBookmarked 
        ? "Module removed from bookmarks" 
        : "Module saved to bookmarks",
    });
  };

  const saveNotes = () => {
    // In a real app, this would save to a backend
    localStorage.setItem(`notes-${courseId}-${module.id}`, notes);
    toast({
      title: "Notes Saved",
      description: "Your notes have been saved locally.",
    });
  };

  // Load saved notes
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes-${courseId}-${module.id}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [courseId, module.id]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'text': return '📖';
      case 'interactive': return '🎯';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-700 border-red-200';
      case 'text': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'interactive': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Module Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge className={getTypeColor(module.type)}>
              {getTypeIcon(module.type)} {module.type.charAt(0).toUpperCase() + module.type.slice(1)}
            </Badge>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{module.duration} min</span>
            </div>
            {isCompleted && (
              <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBookmark}
              className="text-muted-foreground hover:text-foreground"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentModuleIndex + 1} of {totalModules}
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-consciousness font-bold text-foreground mb-2">
          {module.title}
        </h1>

        {/* Progress bar for text content */}
        {module.type === 'text' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Reading Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(readingProgress)}%</span>
            </div>
            <Progress value={readingProgress} className="h-2" />
          </div>
        )}
      </div>

      {/* Content */}
      <Card className="mb-6">
        <div className="p-6">
          {module.type === 'text' && module.content.text && (
            <div 
              id="module-content"
              className="prose prose-lg max-w-none font-consciousness overflow-y-auto max-h-[600px]"
            >
              <ReactMarkdown>{module.content.text}</ReactMarkdown>
            </div>
          )}

          {module.type === 'video' && module.content.videoUrl && (
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-4xl mb-4">🎥</div>
                <p className="text-lg">Video Player</p>
                <p className="text-sm opacity-75">
                  In a real implementation, this would be a video player
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 text-white border-white hover:bg-white hover:text-black"
                  onClick={() => window.open(module.content.videoUrl, '_blank')}
                >
                  Open Video
                </Button>
              </div>
            </div>
          )}

          {module.type === 'interactive' && module.content.quiz && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Interactive Quiz</h3>
              <div className="p-4 bg-muted rounded-lg">
                <p className="mb-4 font-medium">{module.content.quiz.question}</p>
                <div className="space-y-2">
                  {module.content.quiz.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        if (index === module.content.quiz!.correctAnswer) {
                          toast({
                            title: "Correct! 🎉",
                            description: "Great job! You got the right answer.",
                          });
                        } else {
                          toast({
                            title: "Not quite right",
                            description: "Try again! Think about what we just covered.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Resources */}
      {module.resources && module.resources.length > 0 && (
        <Card className="mb-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Additional Resources
            </h3>
            <div className="space-y-3">
              {module.resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {resource.type === 'pdf' && <FileText className="w-4 h-4 text-red-600" />}
                    {resource.type === 'link' && <ExternalLink className="w-4 h-4 text-blue-600" />}
                    {resource.type === 'download' && <Download className="w-4 h-4 text-green-600" />}
                    <span className="font-medium">{resource.title}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    {resource.type === 'download' ? 'Download' : 'Open'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Notes Section */}
      <Card className="mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Personal Notes</h3>
          <Textarea
            placeholder="Add your notes about this module..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px] mb-4"
          />
          <Button variant="outline" onClick={saveNotes}>
            Save Notes
          </Button>
        </div>
      </Card>

      <Separator className="my-6" />

      {/* Navigation and Completion */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {hasPrevious && (
            <Button variant="outline" onClick={onPrevious}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous Module
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Time spent: {timeSpent} min{timeSpent !== 1 ? 's' : ''}
          </div>
          
          {!isCompleted && user && (
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
          )}

          {hasNext && (
            <Button 
              variant={isCompleted ? "default" : "outline"} 
              onClick={onNext}
            >
              Next Module
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};