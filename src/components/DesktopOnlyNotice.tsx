import { Monitor } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DesktopOnlyNoticeProps {
  feature?: string;
}

export const DesktopOnlyNotice = ({ feature = "full functionality" }: DesktopOnlyNoticeProps) => {
  return (
    <Alert className="mb-6">
      <Monitor className="h-4 w-4" />
      <AlertTitle>Desktop Experience Required</AlertTitle>
      <AlertDescription>
        For the best experience, {feature} is available on desktop and tablet devices only. 
        You can browse content on mobile, but please switch to a larger screen to interact with courses, tutorials, and raffles.
      </AlertDescription>
    </Alert>
  );
};
