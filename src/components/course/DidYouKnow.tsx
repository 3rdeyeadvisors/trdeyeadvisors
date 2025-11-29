import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DidYouKnowProps {
  fact: string;
}

export const DidYouKnow = ({ fact }: DidYouKnowProps) => {
  return (
    <Card className="border-accent/50 bg-accent/10 w-full">
      <CardContent className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex gap-3 items-start">
          <Info className="h-5 w-5 min-w-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-accent mb-2 text-sm sm:text-base break-words">Did You Know?</p>
            <p className="text-foreground text-sm sm:text-base break-words leading-relaxed">{fact}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
