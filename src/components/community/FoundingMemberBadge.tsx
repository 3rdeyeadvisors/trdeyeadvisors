import { Crown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FoundingMemberBadgeProps {
  className?: string;
}

export const FoundingMemberBadge = ({ className = "" }: FoundingMemberBadgeProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Crown 
          className={`w-4 h-4 text-amber-500 fill-amber-500 shrink-0 ${className}`} 
        />
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">Founding 33 Member</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
