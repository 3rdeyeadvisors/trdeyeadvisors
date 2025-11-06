import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

    return Math.round((earnedPoints / totalPoints) * 100);
  };

  const handleSubmitQuiz = async () => {
    if (!user) return;

    setLoading(true);
    const finalScore = calculateScore();
    const passed = finalScore >= quiz.passingScore;
    const timeTaken = quiz.timeLimit ? (quiz.timeLimit * 60) - (timeLeft || 0) : null;

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

      if (error) throw error;

      setScore(finalScore);
      setShowResults(true);
      setQuizStarted(false);
      
      toast({
        title: passed ? "Quiz Passed! 🎉" : "Quiz Complete",
        description: passed 
          ? `Great job! You scored ${finalScore}%` 
          : `You scored ${finalScore}%. Passing score is ${quiz.passingScore}%`,
        variant: passed ? "default" : "destructive"
      });

      onComplete?.(passed, finalScore);
      await loadAttempts();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive"
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
    const userAnswer = answers[question.id];

    if (question.type === 'single' || question.type === 'true-false') {
      return (
        <RadioGroup
          value={userAnswer?.toString()}
          onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`${question.id}-${index}`} />
              <Label htmlFor={`${question.id}-${index}`} className="cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    if (question.type === 'multiple') {
      return (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
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
              />
              <Label htmlFor={`${question.id}-${index}`} className="cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderResults = () => {
    const passed = score >= quiz.passingScore;
    
    return (
      <Card className="p-6">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            passed ? "bg-awareness/20 text-awareness" : "bg-destructive/20 text-destructive"
          }`}>
            {passed ? <Trophy className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {passed ? "Congratulations!" : "Keep Practicing"}
          </h3>
          <p className="text-muted-foreground mb-4">
            You scored {score}% (Passing: {quiz.passingScore}%)
          </p>
        </div>

        <div className="space-y-4">
          {quiz.questions.map((question, index) => {
            const userAnswer = answers[question.id];
            const isCorrect = question.type === 'multiple' 
              ? userAnswer && Array.isArray(userAnswer) && 
                new Set(question.correctAnswers).size === new Set(userAnswer).size &&
                question.correctAnswers.every(ans => userAnswer.includes(ans))
              : question.correctAnswers.includes(userAnswer);

            return (
              <div key={question.id} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isCorrect ? "bg-awareness/20 text-awareness" : "bg-destructive/20 text-destructive"
                  }`}>
                    {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                  <h4 className="font-medium">Question {index + 1}</h4>
                </div>
                <p className="mb-3">{question.question}</p>
                
                {!isCorrect && (
                  <div className="bg-muted p-3 rounded">
                    <p className="text-sm font-medium mb-1">Correct Answer:</p>
                    <p className="text-sm">
                      {question.correctAnswers.map(ans => question.options[ans]).join(', ')}
                    </p>
                    {question.explanation && (
                      <p className="text-sm text-muted-foreground mt-2">{question.explanation}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          {canTakeQuiz() && !passed && (
            <Button onClick={startQuiz} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again ({quiz.maxAttempts - attempts.length} attempts left)
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
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>
        {timeLeft !== null && (
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span className={timeLeft < 300 ? "text-red-600 font-bold" : ""}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      {/* Progress */}
      <Progress value={progress} className="mb-6" />

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">{currentQuestionData.question}</h3>
        {renderQuestion(currentQuestionData)}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          {Object.keys(answers).length} of {quiz.questions.length} answered
        </div>

        {currentQuestion === quiz.questions.length - 1 ? (
          <Button
            onClick={handleSubmitQuiz}
            disabled={loading}
            className="bg-awareness hover:bg-awareness/90"
          >
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </Card>
  );
};