import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

export function AnalyticsHub() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Dashboard
          </CardTitle>
          <CardDescription>View comprehensive site and financial analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate("/analytics")}
            variant="outline"
            className="w-full"
          >
            Open Full Analytics Dashboard
          </Button>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Advanced AI-powered analytics features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground text-sm">
          <p>• Real-time traffic analysis</p>
          <p>• Conversion funnel tracking</p>
          <p>• Revenue forecasting</p>
          <p>• User behavior insights</p>
        </CardContent>
      </Card>
    </div>
  );
}
