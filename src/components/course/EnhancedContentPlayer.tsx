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
  MessageSquare,
  Brain,
  Star,
  Monitor
} from "lucide-react";
import { ModuleContent } from "@/data/courseContent";
import ReactMarkdown from "react-markdown";
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
  totalModules
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
          const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
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
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('course_id', courseId)
        .eq('module_id', module.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setQuiz({
          id: data.id,
          title: data.title,
          description: data.description,
          questions: Array.isArray(data.questions) ? data.questions : [],
          passingScore: data.passing_score,
          timeLimit: data.time_limit,
          maxAttempts: data.max_attempts
        });
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    }
  };

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
      case 'video': return 'bg-red-100 text-red-700 border-red-200';
      case 'text': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'interactive': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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
    <div className="w-full px-4 md:px-6">
      {/* Enhanced Module Header */}
      <div className="mb-4 md:mb-6 mobile-typography-center">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Badge className={`${getTypeColor(module.type)} text-xs md:text-sm`}>
              {getTypeIcon(module.type)} {module.type.charAt(0).toUpperCase() + module.type.slice(1)}
            </Badge>
            <div className="flex items-center gap-1 md:gap-2 text-muted-foreground">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">{module.duration} min</span>
            </div>
            {isCompleted && (
              <Badge variant="default" className="bg-green-100 text-green-700 border-green-200 text-xs md:text-sm">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
            {quiz && (
              <Badge variant="outline" className="border-purple-200 text-purple-700 text-xs md:text-sm">
                <Brain className="w-3 h-3 mr-1" />
                Quiz Available
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBookmark}
              className="text-muted-foreground hover:text-foreground p-1 md:p-2"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </Button>
            <span className="text-xs md:text-sm text-muted-foreground">
              {currentModuleIndex + 1} of {totalModules}
            </span>
          </div>
        </div>

        <h1 className="text-xl md:text-3xl font-consciousness font-bold text-foreground mb-3 md:mb-4">
          {module.title}
        </h1>

        {/* Enhanced Progress bar */}
        <div className="space-y-3">
          {module.type === 'text' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Reading Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(readingProgress)}%</span>
              </div>
              <Progress value={readingProgress} className="h-2" />
            </div>
          )}
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Time Spent</span>
              <span className="text-sm text-muted-foreground">{timeSpent} min</span>
            </div>
            <Progress value={Math.min((timeSpent / module.duration) * 100, 100)} className="h-2" />
          </div>
        </div>
      </div>

      {/* Enhanced Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6 w-full">
        <TabsList className="flex w-full justify-start overflow-x-auto gap-2 no-scrollbar px-0">
          <TabsTrigger value="content" className="font-consciousness text-xs md:text-sm px-2 md:px-3 min-w-[96px] shrink-0">
            <BookOpen className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Content</span>
            <span className="sm:hidden">View</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="font-consciousness text-xs md:text-sm px-2 md:px-3 min-w-[96px] shrink-0">
            <MessageSquare className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="resources" className="font-consciousness text-xs md:text-sm px-2 md:px-3 min-w-[96px] shrink-0">
            <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Resources</span>
            <span className="sm:hidden">Links</span>
          </TabsTrigger>
          {quiz && (
            <TabsTrigger value="quiz" className="font-consciousness text-xs md:text-sm px-2 md:px-3 min-w-[96px] shrink-0">
              <Brain className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Quiz
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="content" className="space-y-6 w-full">
          <Card className={`${fullscreen ? 'fixed inset-0 z-50' : ''} w-full`}>
            <div className="p-4 md:p-6">
              {module.type === 'text' && module.content.text && (
                <>
                  {/* Mobile View */}
                  <div className="block md:hidden">
                    <ExpandableText 
                      text={module.content.text}
                      maxLines={10}
                      className="prose prose-lg max-w-none font-consciousness"
                      expandLabel="Read Full Content"
                      mobileOnly={true}
                    />
                    <Card className="mt-4 p-3 bg-primary/5 border-primary/20">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-primary" />
                        <p className="text-xs text-muted-foreground">
                          Full lessons and modules available on desktop.
                        </p>
                      </div>
                    </Card>
                  </div>
                  
                  {/* Desktop View */}
                  <div 
                    id="module-content"
                    className="hidden md:block prose prose-lg max-w-none font-consciousness md:overflow-y-auto md:max-h-[600px] mobile-typography-center w-full max-w-full break-words overflow-x-hidden"
                  >
                    <ReactMarkdown>{module.content.text}</ReactMarkdown>
                  </div>
                </>
              )}

              {module.type === 'video' && module.content.videoUrl && (
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative">
                    <div className="text-white text-center">
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
                          className="text-white border-white hover:bg-white hover:text-black"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={changePlaybackSpeed}
                          className="text-white border-white hover:bg-white hover:text-black"
                        >
                          {playbackSpeed}x
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={toggleFullscreen}
                          className="text-white border-white hover:bg-white hover:text-black"
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

              {module.type === 'interactive' && module.content.quiz && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Interactive Content</h3>
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
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
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
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
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

      <Separator className="my-8" />

      {/* Enhanced Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {hasPrevious && (
            <Button variant="outline" onClick={onPrevious} size="lg">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous Module
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isCompleted && user && (
            <Button onClick={handleComplete} size="lg" className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
          )}

          {hasNext && (
            <Button 
              variant={isCompleted ? "default" : "outline"} 
              onClick={onNext}
              size="lg"
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