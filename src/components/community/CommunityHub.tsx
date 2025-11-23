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
      <Card className="w-full">
        <CardHeader className="px-4 sm:px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Users className="w-5 h-5 flex-shrink-0" />
            Community Hub
          </CardTitle>
          <CardDescription className="text-sm">
            Connect with other learners, share feedback, and get help
          </CardDescription>
          {/* Softer notice for mobile users */}
          <div className="text-center py-2 px-3 mt-3 bg-muted/30 rounded-lg border border-border md:hidden">
            <p className="text-xs text-muted-foreground">
              Fully usable on mobile. For the best experience, we recommend using a desktop or laptop.
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 py-4">
          <Tabs defaultValue="comments" className="w-full">
            <TabsList className="flex w-full justify-center gap-2 p-2 bg-card/60 rounded-lg border border-border flex-wrap">
              <TabsTrigger 
                value="comments" 
                className="flex items-center gap-2 min-h-[44px] px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm whitespace-normal data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span>Comments</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ratings" 
                className="flex items-center gap-2 min-h-[44px] px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm whitespace-normal data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Star className="w-4 h-4 flex-shrink-0" />
                <span>Ratings</span>
              </TabsTrigger>
              {showDiscussions && (
                <TabsTrigger 
                  value="discussions" 
                  className="flex items-center gap-2 min-h-[44px] px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm whitespace-normal data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <HelpCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Q&A</span>
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="comments" className="mt-6 space-y-4">
              <Comments 
                contentType={contentType}
                contentId={contentId}
                title={title}
              />
            </TabsContent>
            
            <TabsContent value="ratings" className="mt-6 space-y-4">
              {(contentType === 'tutorial' || contentType === 'course') ? (
                <RatingReviews 
                  contentType={contentType}
                  contentId={contentId}
                  title={title}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Ratings are available for tutorials and courses
                </div>
              )}
            </TabsContent>
            
            {showDiscussions && (
              <TabsContent value="discussions" className="mt-6 space-y-4">
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