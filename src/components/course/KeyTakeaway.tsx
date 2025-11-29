import { Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface KeyTakeawayProps {
  title?: string;
  children: React.ReactNode;
}

export const KeyTakeaway = ({ title = "Key Takeaway", children }: KeyTakeawayProps) => {
  return (
    <Card className="border-primary bg-primary/10 w-full">
      <CardContent className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col items-center text-center space-y-3">
          <Lightbulb className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="w-full">
            <p className="font-semibold text-primary mb-3 text-sm sm:text-base break-words">{title}</p>
            <div className="text-foreground text-sm sm:text-base break-words leading-relaxed">{children}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
