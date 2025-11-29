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
        <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start text-center sm:text-left">
          <Lightbulb className="h-5 w-5 min-w-5 text-primary flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-primary mb-2 text-sm sm:text-base break-words">{title}</p>
            <div className="text-foreground text-sm sm:text-base break-words leading-relaxed">{children}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
