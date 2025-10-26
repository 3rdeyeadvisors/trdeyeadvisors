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
    <Tabs defaultValue="comments" className="w-full">
      <TabsList className="grid w-full grid-cols-3 justify-center mx-auto">
        <TabsTrigger value="comments" className="flex items-center justify-center gap-2 min-h-[44px]">
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Discussion</span>
          <span className="sm:hidden">Chat</span>
        </TabsTrigger>
        <TabsTrigger value="rating" className="flex items-center justify-center gap-2 min-h-[44px]">
          <Star className="w-4 h-4" />
          <span className="hidden sm:inline">Rating</span>
          <span className="sm:hidden">Rate</span>
        </TabsTrigger>
        <TabsTrigger value="qa" className="flex items-center justify-center gap-2 min-h-[44px]">
          <HelpCircle className="w-4 h-4" />
          Q&A
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