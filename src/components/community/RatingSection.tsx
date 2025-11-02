import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Star, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RatingData {
  averageRating: number;
  totalRatings: number;
  distribution: { [key: number]: number };
  userRating?: {
    rating: number;
    review?: string;
  };
}

interface RatingSectionProps {
  courseId: number;
  moduleId?: string;
}

export const RatingSection = ({ courseId, moduleId }: RatingSectionProps) => {
  const [ratingData, setRatingData] = useState<RatingData>({
    averageRating: 0,
    totalRatings: 0,
    distribution: {}
  });
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchRatingData();
  }, [courseId, moduleId]);

  // Pre-fill user's existing rating when data loads
  useEffect(() => {
    if (ratingData.userRating) {
      setSelectedRating(ratingData.userRating.rating);
      setReview(ratingData.userRating.review || "");
    }
  }, [ratingData.userRating]);

  const fetchRatingData = async () => {
    try {
      const contentId = moduleId || `course-${courseId}`;
      const contentType = moduleId ? 'module' : 'course';

      // Fetch all ratings for this content
      const { data: ratings, error } = await supabase
        .from('ratings')
        .select('rating, review_text, user_id')
        .eq('content_id', contentId)
        .eq('content_type', contentType);

      if (error) throw error;

      if (ratings && ratings.length > 0) {
        const total = ratings.length;
        const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
        const avg = sum / total;

        const dist: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach(r => {
          dist[r.rating] = (dist[r.rating] || 0) + 1;
        });

        const userRating = ratings.find(r => r.user_id === user?.id);

        setRatingData({
          averageRating: parseFloat(avg.toFixed(1)),
          totalRatings: total,
          distribution: dist,
          userRating: userRating ? {
            rating: userRating.rating,
            review: userRating.review_text || undefined
          } : undefined
        });
      }
    } catch (error) {
      console.error('Error fetching rating data:', error);
    }
  };

  const handleSubmitRating = async () => {
    console.log('Submitting rating:', { selectedRating, user: !!user });
    
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to rate this content.",
        variant: "destructive",
      });
      return;
    }

    if (selectedRating === 0) {
      toast({
        title: "Select Rating",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const contentId = moduleId || `course-${courseId}`;
      const contentType = moduleId ? 'module' : 'course';

      console.log('Upserting rating:', { contentId, contentType, selectedRating });

      const { error } = await supabase
        .from('ratings')
        .upsert({
          user_id: user.id,
          content_id: contentId,
          content_type: contentType,
          rating: selectedRating,
          review_text: review.trim() || null,
        }, {
          onConflict: 'user_id,content_id,content_type'
        });

      if (error) {
        console.error('Rating upsert error:', error);
        throw error;
      }

      console.log('Rating submitted successfully');

      // Send email notification
      try {
        await supabase.functions.invoke('send-community-notification', {
          body: {
            type: 'rating',
            user_name: user.user_metadata?.display_name || user.email || 'Anonymous',
            user_email: user.email || 'unknown@email.com',
            content_id: contentId,
            content_type: contentType,
            rating: selectedRating,
            review: review.trim() || undefined
          }
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
        // Don't fail the rating submission if email fails
      }

      toast({
        title: "Rating Submitted!",
        description: "Thank you for your feedback.",
      });

      await fetchRatingData();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, size = "w-5 h-5") => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} cursor-pointer transition-colors ${
              star <= rating
                ? "fill-warning text-warning"
                : "text-muted-foreground hover:text-warning"
            }`}
            onClick={interactive ? () => setSelectedRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-consciousness font-semibold">
          {moduleId ? "Module Rating" : "Course Rating"}
        </h3>
      </div>

      {/* Rating Overview */}
      {ratingData.totalRatings > 0 && (
        <div className="mb-6 p-4 bg-muted/20 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-consciousness font-bold">
                  {ratingData.averageRating}
                </span>
                {renderStars(ratingData.averageRating)}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {ratingData.totalRatings} rating{ratingData.totalRatings !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingData.distribution[star] || 0;
              const percentage = ratingData.totalRatings > 0 ? (count / ratingData.totalRatings) * 100 : 0;
              
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{star}★</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-warning rounded-full h-2 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* User Rating Form */}
      {user && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-consciousness font-medium mb-2">
              {ratingData.userRating ? "Update your rating:" : "Rate this content:"}
            </label>
            {renderStars(selectedRating, true, "w-6 h-6")}
          </div>

          <div>
            <label className="block text-sm font-consciousness font-medium mb-2">
              Review (optional):
            </label>
            <Textarea
              placeholder="Share your thoughts about this content..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <Button
            onClick={handleSubmitRating}
            disabled={selectedRating === 0 || submitting}
            className="font-consciousness"
          >
            {submitting ? "Submitting..." : ratingData.userRating ? "Update Rating" : "Submit Rating"}
          </Button>

          {ratingData.userRating && (
            <Badge variant="outline" className="ml-2">
              You rated this {ratingData.userRating.rating}/5 stars
            </Badge>
          )}
        </div>
      )}

      {!user && ratingData.totalRatings === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-consciousness">No ratings yet. Sign in to be the first to rate this content!</p>
        </div>
      )}
    </Card>
  );
};