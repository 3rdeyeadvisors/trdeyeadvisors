import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePoints } from "@/hooks/usePoints";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Trophy,
  AlertCircle
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'true-false';
  options: string[];
  correctAnswers: number[];
  explanation?: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
  maxAttempts: number;
}

interface QuizComponentProps {
  courseId: number;
  moduleId: string;
  quiz: Quiz;
  onComplete?: (passed: boolean, score: number) => void;
}

export const QuizComponent = ({ courseId, moduleId, quiz, onComplete }: QuizComponentProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { awardPoints } = usePoints();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load previous attempts
  useEffect(() => {
    if (user) {
      loadAttempts();
    }
  }, [user, quiz.id]);

  // Timer
  useEffect(() => {
    if (quizStarted && timeLeft !== null && timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev && prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, timeLeft, showResults]);

  const loadAttempts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('quiz_id', quiz.id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttempts(data || []);
    } catch (error) {
      console.error('Error loading attempts:', error);
    }
  };

  const canTakeQuiz = () => {
    return attempts.length < quiz.maxAttempts;
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    if (quiz.timeLimit) {
      setTimeLeft(quiz.timeLimit * 60);
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;

    quiz.questions.forEach(question => {
      // Validate question structure
      if (!question.correctAnswers || !Array.isArray(question.correctAnswers)) {
        console.error('Invalid question structure:', question);
        return;
      }

      totalPoints += question.points;
      const userAnswer = answers[question.id];
      
      if (question.type === 'single' || question.type === 'true-false') {
        if (userAnswer !== undefined && question.correctAnswers.includes(userAnswer)) {
          earnedPoints += question.points;
        }
      } else if (question.type === 'multiple') {
        if (userAnswer && Array.isArray(userAnswer)) {
          const correctSet = new Set(question.correctAnswers);
          const userSet = new Set(userAnswer);
          
          if (correctSet.size === userSet.size && 
              [...correctSet].every(x => userSet.has(x))) {
            earnedPoints += question.points;
          }
        }
      }
    });

    return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  };

  const handleSubmitQuiz = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit the quiz.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Calculate score before submission
      const finalScore = calculateScore();
      const passed = finalScore >= quiz.passingScore;
      const timeTaken = quiz.timeLimit ? (quiz.timeLimit * 60) - (timeLeft || 0) : null;

      console.log('Submitting quiz:', { finalScore, passed, answersCount: Object.keys(answers).length });

      // Try to save to database, but don't fail if it doesn't work (for courseContent quizzes)
      try {
        const { error } = await supabase
          .from('quiz_attempts')
          .insert({
            user_id: user.id,
            quiz_id: quiz.id,
            answers,
            score: finalScore,
            passed,
            time_taken: timeTaken,
            completed_at: new Date().toISOString()
          });

        if (error) {
          console.log('Could not save quiz to database (this is OK for courseContent quizzes):', error.message);
        }
      } catch (dbError) {
        console.log('Database save skipped for courseContent quiz');
      }

      // Set results state - this should always happen
      setScore(finalScore);
      setShowResults(true);
      setQuizStarted(false);
      
      console.log('Quiz submitted successfully, showing results');
      
      // Show prominent toast notification
      toast({
        title: passed ? "🎉 Quiz Passed!" : "📝 Quiz Submitted",
        description: passed 
          ? `Excellent work! You scored ${finalScore}% (passing: ${quiz.passingScore}%)` 
          : `You scored ${finalScore}%. You need ${quiz.passingScore}% to pass. ${canTakeQuiz() ? 'You can try again!' : ''}`,
        variant: passed ? "default" : "destructive",
        duration: 5000,
      });

      onComplete?.(passed, finalScore);
      
      // Award points for quiz completion
      if (passed) {
        try {
          await awardPoints('quiz_passed', `${quiz.id}_${new Date().toISOString().slice(0, 7)}`);
          // Award bonus for perfect score
          if (finalScore === 100) {
            await awardPoints('quiz_perfect', `${quiz.id}_perfect_${new Date().toISOString().slice(0, 7)}`);
          }
        } catch (e) {
          console.log('Could not award quiz points');
        }
      }
      
      // Try to reload attempts (may not work for courseContent quizzes)
      try {
        await loadAttempts();
      } catch (e) {
        console.log('Could not reload attempts');
      }
    } catch (error) {
      console.error('Error calculating quiz score:', error);
      
      toast({
        title: "⚠️ Quiz Error",
        description: "There was an error processing your quiz. Please try again.",
        variant: "destructive",
        duration: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestion = (question: Question) => {
    // Validate question structure
    if (!question || !question.options || !Array.isArray(question.options)) {
      return (
        <div className="p-4 border border-destructive rounded-lg bg-destructive/10">
          <p className="text-sm text-destructive">Error: Invalid question structure</p>
        </div>
      );
    }

    const userAnswer = answers[question.id];

    if (question.type === 'single' || question.type === 'true-false') {
      return (
        <RadioGroup
          value={userAnswer?.toString()}
          onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
          className="space-y-3 sm:space-y-3 w-full"
        >
          {question.options.map((option, index) => (
            <Label 
              key={index} 
              htmlFor={`${question.id}-${index}`}
              className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-4 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer w-full max-w-full min-h-[56px] sm:min-h-[60px]"
            >
              <RadioGroupItem 
                value={index.toString()} 
                id={`${question.id}-${index}`} 
                className="mt-1 shrink-0 w-5 h-5 sm:w-5 sm:h-5" 
              />
              <span className="text-sm sm:text-base md:text-base leading-relaxed break-words flex-1 min-w-0 pt-0.5">
                {option}
              </span>
            </Label>
          ))}
        </RadioGroup>
      );
    }

    if (question.type === 'multiple') {
      return (
        <div className="space-y-3 sm:space-y-3 w-full">
          {question.options.map((option, index) => (
            <Label
              key={index}
              htmlFor={`${question.id}-${index}`}
              className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-4 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer w-full max-w-full min-h-[56px] sm:min-h-[60px]"
            >
              <Checkbox
                id={`${question.id}-${index}`}
                checked={userAnswer ? userAnswer.includes(index) : false}
                onCheckedChange={(checked) => {
                  const currentAnswers = userAnswer || [];
                  if (checked) {
                    handleAnswerChange(question.id, [...currentAnswers, index]);
                  } else {
                    handleAnswerChange(question.id, currentAnswers.filter((i: number) => i !== index));
                  }
                }}
                className="mt-1 shrink-0 w-5 h-5 sm:w-5 sm:h-5"
              />
              <span className="text-sm sm:text-base md:text-base leading-relaxed break-words flex-1 min-w-0 pt-0.5">
                {option}
              </span>
            </Label>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderResults = () => {
    const passed = score >= quiz.passingScore;
    
    console.log('Rendering results:', { score, passed, questionsLength: quiz.questions.length });
    
    return (
      <Card className="p-3 sm:p-6 border-2 border-primary/20 shadow-lg w-full max-w-full overflow-hidden">
        {/* Prominent Results Header */}
        <div className="text-center mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg" style={{
          background: passed 
            ? 'linear-gradient(135deg, rgba(var(--awareness), 0.1), rgba(var(--awareness), 0.05))' 
            : 'linear-gradient(135deg, rgba(var(--destructive), 0.1), rgba(var(--destructive), 0.05))'
        }}>
          <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center border-2 sm:border-4 ${
            passed ? "bg-awareness/20 text-awareness border-awareness/40" : "bg-destructive/20 text-destructive border-destructive/40"
          }`}>
            {passed ? <Trophy className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" /> : <XCircle className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />}
          </div>
          <Badge className={`text-xs sm:text-sm md:text-base mb-2 sm:mb-3 ${passed ? 'bg-awareness text-awareness-foreground' : 'bg-destructive text-destructive-foreground'}`}>
            {passed ? "✅ QUIZ PASSED" : "📝 QUIZ COMPLETE"}
          </Badge>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-consciousness font-bold mb-2 sm:mb-3 break-words">
            {passed ? "Congratulations!" : "Good Effort!"}
          </h3>
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            {score}%
          </div>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground px-2 break-words">
            {passed 
              ? `You passed! (Required: ${quiz.passingScore}%)` 
              : `You need ${quiz.passingScore}% to pass. ${canTakeQuiz() ? 'You can try again!' : ''}`
            }
          </p>
        </div>

        {/* Detailed Results Section */}
        <Separator className="my-4 sm:my-6" />
        
        <div className="mb-3 sm:mb-4">
          <h4 className="text-base sm:text-lg md:text-xl font-consciousness font-semibold text-center mb-3 sm:mb-4 break-words">
            📊 Answer Review
          </h4>
        </div>

        <div className="space-y-3 sm:space-y-4 w-full max-w-full">
          {quiz.questions.map((question, index) => {
            const userAnswer = answers[question.id];
            const isCorrect = question.type === 'multiple' 
              ? userAnswer && Array.isArray(userAnswer) && 
                new Set(question.correctAnswers).size === new Set(userAnswer).size &&
                question.correctAnswers.every(ans => userAnswer.includes(ans))
              : question.correctAnswers.includes(userAnswer);

            return (
              <div key={question.id} className={`p-3 sm:p-4 border-2 rounded-lg w-full max-w-full overflow-hidden ${
                isCorrect ? 'border-awareness/30 bg-awareness/5' : 'border-destructive/30 bg-destructive/5'
              }`}>
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 ${
                    isCorrect ? "bg-awareness text-awareness-foreground" : "bg-destructive text-destructive-foreground"
                  }`}>
                    {isCorrect ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                      <h4 className="font-semibold text-xs sm:text-sm md:text-base break-words">Question {index + 1}</h4>
                      <Badge variant={isCorrect ? "default" : "destructive"} className="text-[10px] sm:text-xs shrink-0">
                        {isCorrect ? "Correct" : "Incorrect"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <p className="mb-2 sm:mb-3 text-xs sm:text-sm md:text-base font-medium break-words leading-relaxed">{question.question}</p>
                
                <div className="space-y-2 w-full max-w-full overflow-hidden">
                  {userAnswer !== undefined && (
                    <div className="text-xs sm:text-sm break-words">
                      <span className="font-medium">Your Answer: </span>
                      <span className={`${isCorrect ? "text-awareness" : "text-destructive"} break-words`}>
                        {question.type === 'multiple' && Array.isArray(userAnswer)
                          ? userAnswer.map(ans => question.options[ans]).join(', ')
                          : question.options[userAnswer]}
                      </span>
                    </div>
                  )}
                  
                  {!isCorrect && (
                    <div className="bg-muted/50 p-2 sm:p-3 rounded border border-border w-full max-w-full overflow-hidden">
                      <p className="text-xs sm:text-sm font-semibold text-awareness mb-1 break-words">✓ Correct Answer:</p>
                      <p className="text-xs sm:text-sm font-medium break-words leading-relaxed">
                        {question.correctAnswers.map(ans => question.options[ans]).join(', ')}
                      </p>
                      {question.explanation && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <p className="text-xs sm:text-sm text-muted-foreground italic break-words leading-relaxed">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full">
          {canTakeQuiz() && !passed && (
            <Button onClick={startQuiz} variant="outline" className="w-full sm:w-auto text-xs sm:text-sm">
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Try Again ({quiz.maxAttempts - attempts.length} left)
            </Button>
          )}
        </div>
      </Card>
    );
  };

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
        <p className="text-muted-foreground">Please sign in to take this quiz.</p>
      </Card>
    );
  }

  if (showResults) {
    return renderResults();
  }

  if (!quizStarted) {
    const lastAttempt = attempts[0];
    const hasPassedBefore = attempts.some(attempt => attempt.passed);

    return (
      <Card className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
          {quiz.description && (
            <p className="text-muted-foreground mb-4">{quiz.description}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span>Passing Score: {quiz.passingScore}%</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-primary" />
            <span>Max Attempts: {quiz.maxAttempts}</span>
          </div>
          {quiz.timeLimit && (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Time Limit: {quiz.timeLimit} minutes</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span>Questions: {quiz.questions.length}</span>
          </div>
        </div>

        {attempts.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Previous Attempts</h3>
            <div className="space-y-2">
              {attempts.slice(0, 3).map((attempt, index) => (
                <div key={attempt.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span>Attempt {attempts.length - index}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={attempt.passed ? "default" : "destructive"}>
                      {attempt.score}%
                    </Badge>
                    {attempt.passed && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          {hasPassedBefore ? (
            <div className="mb-4">
              <Badge variant="default" className="mb-2">Quiz Passed</Badge>
              <p className="text-sm text-muted-foreground">You've already passed this quiz!</p>
            </div>
          ) : (
            <div className="mb-4">
              {!canTakeQuiz() && (
                <div className="text-red-600 mb-4">
                  <AlertCircle className="w-5 h-5 mx-auto mb-2" />
                  <p>You've used all your attempts for this quiz.</p>
                </div>
              )}
            </div>
          )}
          
          <Button 
            onClick={startQuiz} 
            disabled={!canTakeQuiz()}
            className="font-consciousness"
          >
            {hasPassedBefore ? "Practice Again" : "Start Quiz"}
          </Button>
        </div>
      </Card>
    );
  }

  // Quiz in progress
  const currentQuestionData = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <Card className="p-3 sm:p-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="text-center sm:text-left">
          <h2 className="text-base sm:text-xl font-bold break-words">{quiz.title}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>
        {timeLeft !== null && (
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className={`text-sm sm:text-base ${timeLeft < 300 ? "text-red-600 font-bold" : ""}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      {/* Progress */}
      <Progress value={progress} className="mb-4 sm:mb-6" />

      {/* Question */}
      <div className="mb-4 sm:mb-6 w-full max-w-full overflow-hidden">
        <h3 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4 break-words leading-relaxed">{currentQuestionData.question}</h3>
        <div className="w-full max-w-full overflow-hidden">
          {renderQuestion(currentQuestionData)}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="w-full sm:w-auto text-xs sm:text-sm order-2 sm:order-1"
        >
          Previous
        </Button>

        <div className="text-xs sm:text-sm text-muted-foreground text-center order-1 sm:order-2">
          {Object.keys(answers).length} of {quiz.questions.length} answered
        </div>

        {currentQuestion === quiz.questions.length - 1 ? (
          <Button
            onClick={handleSubmitQuiz}
            disabled={loading}
            className="bg-awareness hover:bg-awareness/90 w-full sm:w-auto text-xs sm:text-sm order-3"
          >
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full sm:w-auto text-xs sm:text-sm order-3">
            Next
          </Button>
        )}
      </div>
    </Card>
  );
};