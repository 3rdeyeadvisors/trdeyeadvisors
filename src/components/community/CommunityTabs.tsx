import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommentsSection } from "./CommentsSection";
import { RatingSection } from "./RatingSection";
import { QASection } from "./QASection";
import { MessageCircle, Star, HelpCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { DesktopOnlyNotice } from "@/components/DesktopOnlyNotice";

interface CommunityTabsProps {
  courseId: number;
  moduleId?: string;
}

export const CommunityTabs = ({ courseId, moduleId }: CommunityTabsProps) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <DesktopOnlyNotice feature="community interactions (comments, ratings, and Q&A)" />;
  }
  
  return (
    <Tabs defaultValue="comments" className="w-full">
      <TabsList className="flex w-full justify-center gap-2 p-2 bg-card/60 rounded-lg border border-border flex-wrap">
        <TabsTrigger 
          value="comments" 
          className="flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">Discussion</span>
        </TabsTrigger>
        <TabsTrigger 
          value="rating" 
          className="flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <Star className="w-4 h-4" />
          <span className="text-sm">Rating</span>
        </TabsTrigger>
        <TabsTrigger 
          value="qa" 
          className="flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-sm">Q&A</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="comments" className="mt-6">
        <CommentsSection courseId={courseId} moduleId={moduleId} />
      </TabsContent>
      
      <TabsContent value="rating" className="mt-6">
        <RatingSection courseId={courseId} moduleId={moduleId} />
      </TabsContent>
      
      <TabsContent value="qa" className="mt-6">
        <QASection courseId={courseId} moduleId={moduleId} />
      </TabsContent>
    </Tabs>
  );
};