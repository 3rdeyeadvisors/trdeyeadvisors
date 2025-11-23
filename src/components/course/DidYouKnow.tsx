import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DidYouKnowProps {
  fact: string;
}

export const DidYouKnow = ({ fact }: DidYouKnowProps) => {
  return (
    <Card className="border-accent bg-accent/5 w-full">
      <CardContent className="px-4 py-4 sm:px-6 sm:py-5 space-y-3">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-accent text-sm mb-2">Did You Know?</p>
            <p className="text-sm break-words leading-relaxed">{fact}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
