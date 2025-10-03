import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
  className?: string;
  expandLabel?: string;
  collapseLabel?: string;
  mobileOnly?: boolean;
  renderMarkdown?: boolean;
}

export function ExpandableText({
  text,
  maxLines = 3,
  className,
  expandLabel = "Read More",
  collapseLabel = "Read Less",
  mobileOnly = true,
  renderMarkdown = false,
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // If mobileOnly is true and we're on desktop, just show full text
  const isDesktop = typeof window !== "undefined" && window.innerWidth > 768;
  
  if (mobileOnly && isDesktop) {
    return <p className={className}>{text}</p>;
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "transition-all duration-300",
          !isExpanded && `line-clamp-${maxLines}`
        )}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: !isExpanded ? maxLines : "none",
          WebkitBoxOrient: "vertical",
          overflow: !isExpanded ? "hidden" : "visible",
        }}
      >
        {renderMarkdown ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {text}
          </ReactMarkdown>
        ) : (
          <p>{text}</p>
        )}
      </div>
      
      {text.split('\n').length > maxLines || text.length > 150 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 p-0 h-auto font-normal text-primary hover:text-primary/80"
        >
          {isExpanded ? (
            <>
              {collapseLabel}
              <ChevronUp className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              {expandLabel}
              <ChevronDown className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}