import { Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface KeyTakeawayProps {
  title?: string;
  children: React.ReactNode;
}

export const KeyTakeaway = ({ title = "Key Takeaway", children }: KeyTakeawayProps) => {
  return (
    <Alert className="border-primary bg-primary/5 px-4 py-4 sm:px-6 sm:py-5 rounded-lg space-y-3 w-full">
      <Lightbulb className="h-4 w-4 text-primary flex-shrink-0" />
      <AlertDescription>
        <p className="font-semibold text-primary mb-3 text-sm sm:text-base break-words">{title}</p>
        <div className="text-foreground text-sm sm:text-base break-words leading-relaxed">{children}</div>
      </AlertDescription>
    </Alert>
  );
};
