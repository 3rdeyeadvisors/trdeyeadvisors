import { Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface KeyTakeawayProps {
  title?: string;
  children: React.ReactNode;
}

export const KeyTakeaway = ({ title = "Key Takeaway", children }: KeyTakeawayProps) => {
  return (
    <Alert className="border-primary bg-primary/5 p-4 rounded-lg space-y-2">
      <Lightbulb className="h-4 w-4 text-primary" />
      <AlertDescription>
        <p className="font-semibold text-primary mb-1 text-sm sm:text-base break-words">{title}</p>
        <div className="text-foreground text-sm sm:text-base break-words">{children}</div>
      </AlertDescription>
    </Alert>
  );
};
