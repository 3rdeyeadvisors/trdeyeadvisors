import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCw } from "lucide-react";

interface FlipCardProps {
  front: string;
  back: string;
}

export const FlipCard = ({ front, back }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all min-h-[120px] relative"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[120px]">
        {!isFlipped ? (
          <>
            <p className="font-semibold text-lg mb-2">{front}</p>
            <RotateCw className="h-4 w-4 text-muted-foreground mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Click to reveal</p>
          </>
        ) : (
          <>
            <p className="text-muted-foreground">{back}</p>
            <RotateCw className="h-4 w-4 text-muted-foreground mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Click to flip back</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
