import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export function ProductManager() {
  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product & Course Management
          </CardTitle>
          <CardDescription>Manage digital products, courses, and merchandise</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => window.location.href = "/admin/store"}
            variant="outline"
            className="w-full"
          >
            Open Store Dashboard
          </Button>
          
          <Button 
            onClick={() => window.location.href = "/admin/upload"}
            variant="outline"
            className="w-full"
          >
            Upload Course Content
          </Button>

          <Button 
            onClick={() => window.location.href = "/admin/upload-products"}
            variant="outline"
            className="w-full"
          >
            Upload Digital Products
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
