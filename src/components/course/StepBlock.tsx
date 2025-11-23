import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StepBlockProps {
  steps: string[];
  title?: string;
}

export const StepBlock = ({ steps, title }: StepBlockProps) => {
  return (
    <Card className="bg-muted/30 w-full">
      <CardContent className="px-4 py-4 sm:px-6 sm:py-5 space-y-3">
        {title && <h4 className="font-semibold mb-3 text-sm sm:text-base break-words">{title}</h4>}
        <ol className="space-y-3 pl-1">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                {index + 1}
              </span>
              <span className="flex-1 pt-0.5 text-sm break-words leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};
