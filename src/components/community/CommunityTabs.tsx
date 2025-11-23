import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommentsSection } from "./CommentsSection";
import { RatingSection } from "./RatingSection";
import { QASection } from "./QASection";
import { MessageCircle, Star, HelpCircle } from "lucide-react";

interface CommunityTabsProps {
  courseId: number;
  moduleId?: string;
}

export const CommunityTabs = ({ courseId, moduleId }: CommunityTabsProps) => {
  return (
    <div className="w-full">
      {/* Softer notice for mobile users */}
      <div className="text-center py-2 px-4 mb-4 bg-muted/30 rounded-lg border border-border md:hidden">
        <p className="text-xs text-muted-foreground">
          Fully usable on mobile. For the best experience, we recommend using a desktop or laptop.
        </p>
      </div>
      
      <Tabs defaultValue="comments" className="w-full">
        <TabsList className="flex w-full justify-center gap-2 p-2 bg-card/60 rounded-lg border border-border flex-wrap">
          <TabsTrigger 
            value="comments" 
            className="flex items-center justify-center gap-2 min-h-[44px] px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm whitespace-normal data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <MessageCircle className="w-4 h-4 flex-shrink-0" />
            <span>Discussion</span>
          </TabsTrigger>
          <TabsTrigger 
            value="rating" 
            className="flex items-center justify-center gap-2 min-h-[44px] px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm whitespace-normal data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Star className="w-4 h-4 flex-shrink-0" />
            <span>Rating</span>
          </TabsTrigger>
          <TabsTrigger 
            value="qa" 
            className="flex items-center justify-center gap-2 min-h-[44px] px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm whitespace-normal data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            <span>Q&A</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="comments" className="mt-6 space-y-4 px-4 sm:px-0">
          <CommentsSection courseId={courseId} moduleId={moduleId} />
        </TabsContent>
        
        <TabsContent value="rating" className="mt-6 space-y-4 px-4 sm:px-0">
          <RatingSection courseId={courseId} moduleId={moduleId} />
        </TabsContent>
        
        <TabsContent value="qa" className="mt-6 space-y-4 px-4 sm:px-0">
          <QASection courseId={courseId} moduleId={moduleId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};