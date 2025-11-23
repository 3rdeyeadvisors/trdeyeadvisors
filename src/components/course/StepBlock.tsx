import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StepBlockProps {
  steps: string[];
  title?: string;
}

export const StepBlock = ({ steps, title }: StepBlockProps) => {
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4 sm:p-6 space-y-2">
        {title && <h4 className="font-semibold mb-3 text-sm sm:text-base break-words">{title}</h4>}
        <ol className="space-y-3 pl-1">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-semibold">
                {index + 1}
              </span>
              <span className="flex-1 pt-0.5 text-sm sm:text-base break-words">{step}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};
