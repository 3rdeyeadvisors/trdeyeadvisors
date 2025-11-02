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
  description: string;
  created_at: string;
  user_id: string;
  is_solved: boolean;
  profiles: {
    display_name: string;
  } | null;
  discussion_replies: Array<{
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    is_solution: boolean;
    profiles: {
      display_name: string;
    } | null;
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
      const contentId = moduleId || `course-${courseId}`;
      const contentType = moduleId ? 'module' : 'course';

      const { data, error } = await supabase
        .from('discussions')
        .select('id, title, description, created_at, user_id, is_solved')
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch profiles and replies separately
      const questionsWithDetails = await Promise.all(
        (data || []).map(async (question) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', question.user_id)
            .maybeSingle();
          
          const { data: replies } = await supabase
            .from('discussion_replies')
            .select('id, content, created_at, user_id, is_solution')
            .eq('discussion_id', question.id)
            .order('created_at');
          
          const repliesWithProfiles = await Promise.all(
            (replies || []).map(async (reply) => {
              const { data: replyProfile } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('user_id', reply.user_id)
                .maybeSingle();
              
              return {
                ...reply,
                profiles: replyProfile
              };
            })
          );
          
          return {
            ...question,
            profiles: profile,
            discussion_replies: repliesWithProfiles
          };
        })
      );
      
      setQuestions(questionsWithDetails);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to ask questions.",
        variant: "destructive",
      });
      return;
    }

    if (!newQuestionTitle.trim() || !newQuestionContent.trim()) {
      toast({
        title: "Complete Form",
        description: "Please provide both a title and description.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const contentId = moduleId || `course-${courseId}`;
      const contentType = moduleId ? 'module' : 'course';

      const { error } = await supabase
        .from('discussions')
        .insert({
          title: newQuestionTitle.trim(),
          description: newQuestionContent.trim(),
          user_id: user.id,
          content_id: contentId,
          content_type: contentType,
        });

      if (error) throw error;

      toast({
        title: "Question Posted!",
        description: "Your question has been added successfully.",
      });

      setNewQuestionTitle("");
      setNewQuestionContent("");
      setShowNewQuestion(false);
      await fetchQuestions();
    } catch (error) {
      console.error('Error submitting question:', error);
      toast({
        title: "Error",
        description: "Failed to post question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (questionId: string, isAnswer = false) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to reply.",
        variant: "destructive",
      });
      return;
    }

    const content = replyContent[questionId]?.trim();
    if (!content) return;

    try {
      const { error } = await supabase
        .from('discussion_replies')
        .insert({
          discussion_id: questionId,
          content: content,
          user_id: user.id,
          is_solution: isAnswer,
        });

      if (error) throw error;

      toast({
        title: "Reply Posted!",
        description: isAnswer ? "Answer submitted successfully." : "Reply added successfully.",
      });

      setReplyContent(prev => ({ ...prev, [questionId]: "" }));
      await fetchQuestions();
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    }
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
                    {question.is_solved && (
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Solved
                      </Badge>
                    )}
                  </div>
                  
                  <h4 className="font-consciousness font-semibold text-foreground mb-2">
                    {question.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {question.description}
                  </p>
                </div>
              </div>

              {/* Replies */}
              {question.discussion_replies && question.discussion_replies.length > 0 && (
                <div className="ml-11 space-y-3 mb-4">
                  {question.discussion_replies
                    .sort((a, b) => {
                      // Show solutions first
                      if (a.is_solution && !b.is_solution) return -1;
                      if (!a.is_solution && b.is_solution) return 1;
                      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    })
                    .map((reply) => (
                    <Card 
                      key={reply.id} 
                      className={`p-3 ${reply.is_solution ? 'bg-success/10 border-success/30' : 'bg-muted/20'}`}
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
                            {reply.is_solution && (
                              <Badge variant="outline" className="text-xs bg-success/20">
                                Solution
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
                    {!question.is_solved && (
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