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
      <CardContent className="p-6">
        {title && <h4 className="font-semibold mb-4 text-center">{title}</h4>}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h5 className="font-semibold text-destructive flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Traditional Finance
            </h5>
            {items.map((item, index) => (
              <div key={index} className="p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                <p className="text-sm">{item.traditional}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h5 className="font-semibold text-success flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              DeFi
            </h5>
            {items.map((item, index) => (
              <div key={index} className="p-3 bg-success/5 rounded-lg border border-success/20">
                <p className="text-sm">{item.defi}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
