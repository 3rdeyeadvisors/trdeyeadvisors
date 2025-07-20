import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { HelpCircle, MessageSquare, CheckCircle, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface QAItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  is_answered: boolean;
  profiles: {
    display_name: string;
  };
  discussion_replies: Array<{
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    is_answer: boolean;
    profiles: {
      display_name: string;
    };
  }>;
}

interface QASectionProps {
  courseId: number;
  moduleId?: string;
}

export const QASection = ({ courseId, moduleId }: QASectionProps) => {
  const [questions, setQuestions] = useState<QAItem[]>([]);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, [courseId, moduleId]);

  const fetchQuestions = async () => {
    try {
      // For now, return empty array until database is properly set up
      setQuestions([]);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!user || !newQuestionTitle.trim() || !newQuestionContent.trim()) return;

    setSubmitting(true);
    try {
      // Database operation will be implemented after migration
      toast({
        title: "Coming Soon",
        description: "Q&A feature will be available after database setup",
      });
      setNewQuestionTitle("");
      setNewQuestionContent("");
      setShowNewQuestion(false);
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (questionId: string, isAnswer = false) => {
    if (!user || !replyContent[questionId]?.trim()) return;
    // Reply functionality will be implemented after database setup
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-consciousness font-semibold">
            Questions & Answers ({questions.length})
          </h3>
        </div>
        {user && (
          <Button
            onClick={() => setShowNewQuestion(!showNewQuestion)}
            variant="outline"
            className="font-consciousness"
          >
            Ask Question
          </Button>
        )}
      </div>

      {/* New Question Form */}
      {showNewQuestion && user && (
        <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
          <div className="space-y-3">
            <Input
              placeholder="Question title..."
              value={newQuestionTitle}
              onChange={(e) => setNewQuestionTitle(e.target.value)}
            />
            <Textarea
              placeholder="Describe your question in detail..."
              value={newQuestionContent}
              onChange={(e) => setNewQuestionContent(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowNewQuestion(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitQuestion}
                disabled={!newQuestionTitle.trim() || !newQuestionContent.trim() || submitting}
                className="font-consciousness"
              >
                {submitting ? "Posting..." : "Post Question"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {questions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-consciousness">No questions yet. Be the first to ask!</p>
          </div>
        ) : (
          questions.map((question) => (
            <Card key={question.id} className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {question.profiles.display_name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-consciousness font-medium text-sm">
                      {question.profiles.display_name || "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
                    </span>
                    {question.is_answered && (
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Answered
                      </Badge>
                    )}
                  </div>
                  
                  <h4 className="font-consciousness font-semibold text-foreground mb-2">
                    {question.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {question.content}
                  </p>
                </div>
              </div>

              {/* Replies */}
              {question.discussion_replies && question.discussion_replies.length > 0 && (
                <div className="ml-11 space-y-3 mb-4">
                  {question.discussion_replies
                    .sort((a, b) => {
                      // Show answers first
                      if (a.is_answer && !b.is_answer) return -1;
                      if (!a.is_answer && b.is_answer) return 1;
                      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    })
                    .map((reply) => (
                    <Card 
                      key={reply.id} 
                      className={`p-3 ${reply.is_answer ? 'bg-success/10 border-success/30' : 'bg-muted/20'}`}
                    >
                      <div className="flex items-start gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {reply.profiles.display_name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-consciousness font-medium text-xs">
                              {reply.profiles.display_name || "Anonymous"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                            </span>
                            {reply.is_answer && (
                              <Badge variant="outline" className="text-xs bg-success/20">
                                Answer
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-foreground leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              {user && (
                <div className="ml-11 space-y-2">
                  <Textarea
                    placeholder="Write your reply..."
                    value={replyContent[question.id] || ""}
                    onChange={(e) => setReplyContent(prev => ({ 
                      ...prev, 
                      [question.id]: e.target.value 
                    }))}
                    className="min-h-[60px] text-sm"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSubmitReply(question.id, false)}
                      disabled={!replyContent[question.id]?.trim()}
                    >
                      Reply
                    </Button>
                    {!question.is_answered && (
                      <Button
                        size="sm"
                        onClick={() => handleSubmitReply(question.id, true)}
                        disabled={!replyContent[question.id]?.trim()}
                        className="bg-success hover:bg-success/90"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Answer
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </Card>
  );
};