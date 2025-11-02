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
  } | null;
  likes_count: number;
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
      const contentId = moduleId || `course-${courseId}`;
      const contentType = moduleId ? 'module' : 'course';

      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          likes_count
        `)
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch profiles separately
      const commentsWithProfiles = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', comment.user_id)
            .maybeSingle();
          
          return {
            ...comment,
            profiles: profile
          };
        })
      );
      
      setComments(commentsWithProfiles);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error Loading Comments",
        description: "Unable to load comments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to post comments.",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please write a comment before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const contentId = moduleId || `course-${courseId}`;
      const contentType = moduleId ? 'module' : 'course';

      const { error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          user_id: user.id,
          content_id: contentId,
          content_type: contentType,
        });

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke('send-community-notification', {
          body: {
            type: 'comment',
            user_name: user.user_metadata?.display_name || user.email || 'Anonymous',
            user_email: user.email || 'unknown@email.com',
            content_id: contentId,
            content_type: contentType,
            content: newComment.trim()
          }
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't fail the comment submission if email fails
      }

      toast({
        title: "Comment Posted!",
        description: "Your comment has been added successfully.",
      });
      
      setNewComment("");
      await fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to like comments.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if already liked
      const { data: existing } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // Unlike
        await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: user.id,
          });
      }

      await fetchComments();
    } catch (error) {
      console.error('Error liking comment:', error);
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
                    {comment.profiles?.display_name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-consciousness font-medium text-sm">
                      {comment.profiles?.display_name || "Anonymous"}
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
                        onClick={() => handleLike(comment.id)}
                        className="h-8 px-2 text-muted-foreground hover:text-primary"
                      >
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {comment.likes_count}
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