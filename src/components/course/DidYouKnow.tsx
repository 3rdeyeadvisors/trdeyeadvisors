import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DidYouKnowProps {
  fact: string;
}

export const DidYouKnow = ({ fact }: DidYouKnowProps) => {
  return (
    <Card className="border-accent bg-accent/5">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-accent text-sm mb-1">Did You Know?</p>
            <p className="text-sm">{fact}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
