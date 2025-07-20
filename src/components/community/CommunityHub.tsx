import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Comments } from "./Comments";
import { RatingReviews } from "./RatingReviews";
import { QADiscussions } from "./QADiscussions";
import { MessageCircle, Star, HelpCircle, Users } from "lucide-react";

interface CommunityHubProps {
  contentType: 'tutorial' | 'course' | 'module';
  contentId: string;
  title?: string;
  showDiscussions?: boolean;
}

export const CommunityHub = ({ 
  contentType, 
  contentId, 
  title, 
  showDiscussions = true 
}: CommunityHubProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Community Hub
          </CardTitle>
          <CardDescription>
            Connect with other learners, share feedback, and get help
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="comments" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="ratings" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Ratings & Reviews
              </TabsTrigger>
              {showDiscussions && (
                <TabsTrigger value="discussions" className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Q&A
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="comments" className="mt-6">
              <Comments 
                contentType={contentType}
                contentId={contentId}
                title={title}
              />
            </TabsContent>
            
            <TabsContent value="ratings" className="mt-6">
              {(contentType === 'tutorial' || contentType === 'course') ? (
                <RatingReviews 
                  contentType={contentType}
                  contentId={contentId}
                  title={title}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Ratings are available for tutorials and courses
                </div>
              )}
            </TabsContent>
            
            {showDiscussions && (
              <TabsContent value="discussions" className="mt-6">
                <QADiscussions 
                  contentType={contentType === 'module' ? 'tutorial' : contentType}
                  contentId={contentId}
                  title={title}
                />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};