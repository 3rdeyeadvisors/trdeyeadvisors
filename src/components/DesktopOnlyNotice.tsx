import { Monitor } from "lucide-react";

interface DesktopOnlyNoticeProps {
  feature?: string;
}

export const DesktopOnlyNotice = ({ feature = "full functionality" }: DesktopOnlyNoticeProps) => {
  return (
    <div className="text-center py-3 px-4 mb-4 bg-muted/30 rounded-lg border border-border">
      <p className="text-xs sm:text-sm text-muted-foreground">
        Fully usable on mobile. For the best experience, we recommend rotating your device to landscape or using a desktop.
      </p>
    </div>
  );
};
