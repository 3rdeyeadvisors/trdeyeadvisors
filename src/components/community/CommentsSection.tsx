import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, ThumbsUp, ThumbsDown, Reply, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string;
  };
  likes_count: number;
  dislikes_count: number;
  user_interaction: 'like' | 'dislike' | null;
}

interface CommentsSectionProps {
  courseId: number;
  moduleId?: string;
}

export const CommentsSection = ({ courseId, moduleId }: CommentsSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [courseId, moduleId]);

  const fetchComments = async () => {
    try {
      // For now, return empty array until database is properly set up
      setComments([]);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      // Database operation will be implemented after migration
      toast({
        title: "Coming Soon",
        description: "Comments feature will be available after database setup",
      });
      setNewComment("");
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string, isLike: boolean) => {
    if (!user) return;
    // Like functionality will be implemented after database setup
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
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-consciousness font-semibold">
          Discussion ({comments.length})
        </h3>
      </div>

      {/* Add Comment */}
      {user && (
        <div className="mb-6 space-y-3">
          <Textarea
            placeholder="Share your thoughts or ask a question..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || submitting}
              className="font-consciousness"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-consciousness">No comments yet. Be the first to start the discussion!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-4 bg-muted/20">
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {comment.profiles.display_name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-consciousness font-medium text-sm">
                      {comment.profiles.display_name || "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-foreground mb-3 font-system leading-relaxed">
                    {comment.content}
                  </p>
                  
                  {user && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(comment.id, true)}
                        className={`h-8 px-2 ${
                          comment.user_interaction === 'like' ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {comment.likes_count}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(comment.id, false)}
                        className={`h-8 px-2 ${
                          comment.user_interaction === 'dislike' ? 'text-destructive' : 'text-muted-foreground'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3 mr-1" />
                        {comment.dislikes_count}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );
};