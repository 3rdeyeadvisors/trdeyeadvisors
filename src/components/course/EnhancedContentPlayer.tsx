import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProgress } from "@/components/progress/ProgressProvider";
import { QuizComponent } from "@/components/quiz/QuizComponent";
import { ExpandableText } from "@/components/ui/expandable-text";
import { FullscreenContentViewer } from "./FullscreenContentViewer";
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
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Settings,
  Maximize,
  Maximize2,
  MessageSquare,
  Brain,
  Star,
  Monitor
} from "lucide-react";
import { ModuleContent } from "@/data/courseContent";
import { EnhancedMarkdownRenderer } from "./EnhancedMarkdownRenderer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EnhancedContentPlayerProps {
  courseId: number;
  module: ModuleContent;
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  currentModuleIndex: number;
  totalModules: number;
  courseTitle?: string;
  allModules?: ModuleContent[];
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: any[];
  passingScore: number;
  timeLimit?: number;
  maxAttempts: number;
}

export const EnhancedContentPlayer = ({
  courseId,
  module,
  onComplete,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  currentModuleIndex,
  totalModules,
  courseTitle,
  allModules
}: EnhancedContentPlayerProps) => {
  const { user } = useAuth();
  const { getCourseProgress, updateModuleProgress } = useProgress();
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [notes, setNotes] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("content");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(80);
  const [fullscreen, setFullscreen] = useState(false);
  const [isFullscreenViewerOpen, setIsFullscreenViewerOpen] = useState(false);
  const { toast } = useToast();

  // Check if module is already completed
  useEffect(() => {
    if (user) {
      const progress = getCourseProgress(courseId);
      const completed = progress?.completed_modules?.includes(currentModuleIndex) || false;
      setIsCompleted(completed);
    }
  }, [user, courseId, currentModuleIndex, getCourseProgress]);

  // Load quiz for this module
  useEffect(() => {
    loadModuleQuiz();
  }, [courseId, module.id]);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000 / 60));
    }, 60000);

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
          let progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
          
          // Consider >= 97% as 100% complete due to browser rounding issues
          if (progress >= 97) {
            progress = 100;
          }
          
          setReadingProgress(Math.min(progress, 100));
        }
      };

      const contentElement = document.getElementById('module-content');
      contentElement?.addEventListener('scroll', handleScroll);
      return () => contentElement?.removeEventListener('scroll', handleScroll);
    }
  }, [module.type]);

  const loadModuleQuiz = async () => {
    try {
      // First, check if module has a quiz in courseContent
      if (module.content.quiz) {
        
        // Validate quiz structure
        if (!module.content.quiz.questions || !Array.isArray(module.content.quiz.questions)) {
          console.error('Invalid quiz structure in courseContent');
          return;
        }

        // Validate each question has correctAnswers
        const invalidQuestions = module.content.quiz.questions.filter(
          q => !q.correctAnswers || !Array.isArray(q.correctAnswers)
        );
        
        if (invalidQuestions.length > 0) {
          console.error('Quiz has questions without correctAnswers:', invalidQuestions);
          return;
        }

        setQuiz(module.content.quiz);
        return;
      }

      // Fall back to database quiz
      const { data, error } = await supabase
        .from('quizzes_public')
        .select('*')
        .eq('course_id', courseId)
        .eq('module_id', module.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data && data.questions) {
        
        // Validate that the quiz has the correct structure
        const questions = data.questions as any[];
        const hasCorrectStructure = Array.isArray(questions) && 
          questions.length > 0 &&
          questions[0].correctAnswers !== undefined;

        if (hasCorrectStructure) {
          setQuiz({
            id: data.id,
            title: data.title,
            description: data.description,
            questions: questions,
            passingScore: data.passing_score || 70,
            timeLimit: data.time_limit,
            maxAttempts: data.max_attempts || 3
          });
        } else {
          console.error('Database quiz has invalid structure');
        }
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to track your progress.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateModuleProgress(courseId, currentModuleIndex);
      setIsCompleted(true);
      onComplete();
      
      toast({
        title: "Module Completed! 🎉",
        description: `You've finished "${module.title}". Keep up the great work!`,
      });
    } catch (error) {
      console.error('Failed to mark module complete:', error);
      toast({
        title: "Error Saving Progress",
        description: "Your progress couldn't be saved. Please try again or refresh the page.",
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
    localStorage.setItem(`notes-${courseId}-${module.id}`, notes);
    toast({
      title: "Notes Saved",
      description: "Your notes have been saved locally.",
    });
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const changePlaybackSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
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
      case 'video': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'text': return 'bg-primary/10 text-primary border-primary/20';
      case 'interactive': return 'bg-awareness/10 text-awareness border-awareness/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleQuizComplete = (passed: boolean, score: number) => {
    if (passed) {
      toast({
        title: "Quiz Passed! 🎉",
        description: `Great job! You scored ${score}%`,
      });
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-6">
      {/* Fullscreen Content Viewer */}
      <FullscreenContentViewer
        isOpen={isFullscreenViewerOpen}
        onClose={() => setIsFullscreenViewerOpen(false)}
        content={module.content.text || ''}
        title={module.title}
        currentIndex={currentModuleIndex}
        totalModules={totalModules}
        onNext={() => onNext?.()}
        onPrevious={() => onPrevious?.()}
        courseTitle={courseTitle}
      />
      {/* Enhanced Module Header */}
      <div className="mb-3 sm:mb-4 md:mb-6 text-center">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 md:gap-3 mx-auto md:mx-0">
            <Badge className={`${getTypeColor(module.type)} text-xs md:text-sm`}>
              {getTypeIcon(module.type)} {module.type.charAt(0).toUpperCase() + module.type.slice(1)}
            </Badge>
            <div className="flex items-center gap-1 md:gap-2 text-muted-foreground">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">{module.duration} min</span>
            </div>
            {isCompleted && (
              <Badge variant="default" className="bg-awareness/20 text-awareness border-awareness text-xs md:text-sm">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
            {quiz && (
              <Badge variant="outline" className="border-accent/20 text-accent bg-accent/10 text-xs md:text-sm">
                <Brain className="w-3 h-3 mr-1" />
                Quiz Available
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-center md:justify-end gap-1.5 sm:gap-2">
            {module.type === 'text' && module.content.text && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreenViewerOpen(true)}
                className="text-muted-foreground hover:text-foreground p-1.5 sm:p-2 min-h-[36px] sm:min-h-[40px] gap-1.5"
                title="Focus Mode - Fullscreen reading with swipe navigation"
              >
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline text-xs">Focus</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBookmark}
              className="text-muted-foreground hover:text-foreground p-1 sm:p-1.5 md:p-2 min-h-[36px] sm:min-h-[40px]"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </Button>
            <span className="text-xs md:text-sm text-muted-foreground">
              {currentModuleIndex + 1} of {totalModules}
            </span>
          </div>
        </div>

        <h1 className="text-lg sm:text-xl md:text-3xl font-consciousness font-bold text-foreground mb-2.5 sm:mb-3 md:mb-4 text-center break-words leading-tight px-2 sm:px-0">
          {module.title}
        </h1>

        {/* Enhanced Progress bar */}
        <div className="space-y-2.5 sm:space-y-3 max-w-2xl mx-auto px-2 sm:px-0">
          {module.type === 'text' && (
            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm text-muted-foreground">Reading Progress</span>
                <span className="text-xs sm:text-sm text-muted-foreground">{Math.round(readingProgress)}%</span>
              </div>
              <Progress value={readingProgress} className="h-1.5 sm:h-2" />
            </div>
          )}
          
          <div>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Time Spent</span>
              <span className="text-xs sm:text-sm text-muted-foreground">{timeSpent} min</span>
            </div>
            <Progress value={Math.min((timeSpent / module.duration) * 100, 100)} className="h-1.5 sm:h-2" />
          </div>
        </div>
      </div>

      {/* Enhanced Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 sm:space-y-4 md:space-y-6 w-full">
        <TabsList className="flex w-full justify-start overflow-x-auto gap-1.5 sm:gap-2 no-scrollbar px-0">
          <TabsTrigger value="content" className="font-consciousness text-xs md:text-sm px-2 md:px-3 min-w-[80px] sm:min-w-[96px] shrink-0 min-h-[36px] sm:min-h-[40px]">
            <BookOpen className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Content</span>
            <span className="sm:hidden">View</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="font-consciousness text-xs md:text-sm px-2 md:px-3 min-w-[80px] sm:min-w-[96px] shrink-0 min-h-[36px] sm:min-h-[40px]">
            <MessageSquare className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="resources" className="font-consciousness text-xs md:text-sm px-2 md:px-3 min-w-[80px] sm:min-w-[96px] shrink-0 min-h-[36px] sm:min-h-[40px]">
            <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Resources</span>
            <span className="sm:hidden">Links</span>
          </TabsTrigger>
          {quiz && (
            <TabsTrigger value="quiz" className="font-consciousness text-xs md:text-sm px-2 md:px-3 min-w-[80px] sm:min-w-[96px] shrink-0 min-h-[36px] sm:min-h-[40px]">
              <Brain className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Quiz
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="content" className="space-y-4 sm:space-y-6 w-full">
          <Card className={`${fullscreen ? 'fixed inset-0 z-50' : ''} w-full`}>
            <div className="p-3 sm:p-4 md:p-6">
              {module.type === 'text' && module.content.text && (
                <div 
                  id="module-content"
                  className="prose prose-sm md:prose-lg max-w-none font-consciousness overflow-y-auto max-h-[60vh] md:max-h-[calc(100vh-400px)] text-left mx-auto w-full break-words overflow-x-hidden overscroll-contain px-2 md:px-4"
                  style={{ 
                    WebkitOverflowScrolling: 'touch',
                    touchAction: 'pan-y'
                  }}
                >
                  <EnhancedMarkdownRenderer 
                    content={module.content.text} 
                    heroImage={module.content.heroImage}
                  />
                </div>
              )}

              {module.type === 'video' && module.content.videoUrl && (
                <div className="space-y-4">
                <div className="aspect-video bg-background rounded-lg flex items-center justify-center relative border border-border">
                  <div className="text-foreground text-center">
                      <div className="text-4xl mb-4">🎥</div>
                      <p className="text-lg">Enhanced Video Player</p>
                      <p className="text-sm opacity-75 mb-4">
                        Interactive video with progress tracking
                      </p>
                      
                      {/* Video Controls */}
                      <div className="flex items-center justify-center gap-4 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={togglePlayback}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={changePlaybackSpeed}
                        >
                          {playbackSpeed}x
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={toggleFullscreen}
                        >
                          <Maximize className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Video Progress Bar */}
                  <div className="space-y-2">
                    <Progress value={45} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>05:23</span>
                      <span>12:45</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Personal Notes
            </h3>
            <Textarea
              placeholder="Add your notes about this module..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[200px] mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={saveNotes}>
                Save Notes
              </Button>
              <Button variant="outline" onClick={() => setNotes("")}>
                Clear
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              Additional Resources
            </h3>
            {module.resources && module.resources.length > 0 ? (
              <div className="space-y-3">
                {module.resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <div className="flex items-center gap-3">
                      {resource.type === 'pdf' && <FileText className="w-5 h-5 text-red-600" />}
                      {resource.type === 'link' && <ExternalLink className="w-5 h-5 text-blue-600" />}
                      {resource.type === 'download' && <Download className="w-5 h-5 text-green-600" />}
                      <div>
                        <span className="font-medium">{resource.title}</span>
                        <p className="text-sm text-muted-foreground capitalize">{resource.type}</p>
                      </div>
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
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No additional resources available for this module.
              </p>
            )}
          </Card>
        </TabsContent>

        {quiz && (
          <TabsContent value="quiz" className="space-y-6">
            <QuizComponent
              courseId={courseId}
              moduleId={module.id}
              quiz={quiz}
              onComplete={handleQuizComplete}
            />
          </TabsContent>
        )}
      </Tabs>

      <Separator className="my-6" />

      {/* Enhanced Navigation */}
      <div className="space-y-3">
        {/* Previous/Next Row */}
        <div className="flex items-center justify-between gap-3">
          {hasPrevious ? (
            <Button 
              variant="outline" 
              onClick={onPrevious} 
              size="lg" 
              className="flex-1 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>
          ) : (
            <div className="flex-1" />
          )}

          {hasNext ? (
            <Button 
              variant="outline"
              onClick={onNext}
              size="lg"
              className="flex-1 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        {/* Mark Complete Button - Enhanced */}
        {!isCompleted && user && (
          <Button 
            onClick={handleComplete} 
            size="lg" 
            className="bg-awareness hover:bg-awareness/90 text-foreground w-full flex items-center justify-center gap-2 min-h-[48px] font-medium shadow-lg hover:shadow-awareness/20 transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Mark Module Complete</span>
          </Button>
        )}

        {isCompleted && (
          <div className="p-4 md:p-5 bg-awareness/10 border-2 border-awareness/30 rounded-lg flex items-center justify-center gap-3">
            <CheckCircle className="w-6 h-6 text-awareness" />
            <span className="font-medium text-awareness text-base md:text-lg">Module Completed ✓</span>
          </div>
        )}
      </div>
    </div>
  );
};