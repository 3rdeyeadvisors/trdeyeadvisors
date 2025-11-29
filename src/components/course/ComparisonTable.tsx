import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface ComparisonItem {
  traditional: string;
  defi: string;
}

interface ComparisonTableProps {
  title?: string;
  items: ComparisonItem[];
}

export const ComparisonTable = ({ title, items }: ComparisonTableProps) => {
  return (
    <Card className="w-full border-muted">
      <CardContent className="px-4 py-4 sm:px-6 sm:py-5 space-y-4">
        {title && <h4 className="font-semibold mb-3 text-center text-sm sm:text-base break-words">{title}</h4>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h5 className="font-semibold text-destructive flex items-center justify-center gap-2 text-sm sm:text-base">
              <XCircle className="h-5 w-5 flex-shrink-0" />
              <span>Traditional Finance</span>
            </h5>
            {items.map((item, index) => (
              <div key={index} className="p-3 bg-destructive/10 rounded-lg border border-destructive/30 text-center">
                <p className="text-foreground text-sm sm:text-base break-words leading-relaxed">{item.traditional}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h5 className="font-semibold text-awareness flex items-center justify-center gap-2 text-sm sm:text-base">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span>DeFi</span>
            </h5>
            {items.map((item, index) => (
              <div key={index} className="p-3 bg-awareness/10 rounded-lg border border-awareness/30 text-center">
                <p className="text-foreground text-sm sm:text-base break-words leading-relaxed">{item.defi}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
