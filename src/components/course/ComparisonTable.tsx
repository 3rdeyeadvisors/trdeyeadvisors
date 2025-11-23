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
    <Card>
      <CardContent className="p-4 sm:p-6 space-y-2">
        {title && <h4 className="font-semibold mb-3 text-center text-sm sm:text-base break-words">{title}</h4>}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h5 className="font-semibold text-destructive flex items-center gap-2 text-xs sm:text-sm">
              <XCircle className="h-4 w-4 flex-shrink-0" />
              <span>Traditional Finance</span>
            </h5>
            {items.map((item, index) => (
              <div key={index} className="p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                <p className="text-xs sm:text-sm break-words">{item.traditional}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h5 className="font-semibold text-success flex items-center gap-2 text-xs sm:text-sm">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span>DeFi</span>
            </h5>
            {items.map((item, index) => (
              <div key={index} className="p-3 bg-success/5 rounded-lg border border-success/20">
                <p className="text-xs sm:text-sm break-words">{item.defi}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
