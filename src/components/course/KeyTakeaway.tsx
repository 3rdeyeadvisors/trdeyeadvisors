import { Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface KeyTakeawayProps {
  title?: string;
  children: React.ReactNode;
}

export const KeyTakeaway = ({ title = "Key Takeaway", children }: KeyTakeawayProps) => {
  return (
    <Alert className="border-primary bg-primary/5 px-4 py-4 sm:px-6 sm:py-5 rounded-lg w-full">
      <div className="flex flex-col items-center text-center space-y-3">
        <Lightbulb className="h-5 w-5 text-primary flex-shrink-0" />
        <AlertDescription className="w-full">
          <p className="font-semibold text-primary mb-3 text-sm sm:text-base break-words">{title}</p>
          <div className="text-foreground text-sm sm:text-base break-words leading-relaxed">{children}</div>
        </AlertDescription>
      </div>
    </Alert>
  );
};
