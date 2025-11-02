import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Trash2, Loader2, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PrintifyProduct {
  id: string;
  printify_id: string;
  title: string;
  description: string | null;
  variants: any;
  images: any;
}

export function ProductManager() {
  const [products, setProducts] = useState<PrintifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<PrintifyProduct | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('printify_products')
        .select('*')
        .order('title');

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string, productTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      return;
    }

    setIsDeleting(productId);
    try {
      const { error } = await supabase
        .from('printify_products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast.success("Product deleted successfully");
      await loadProducts();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(error.message || "Failed to delete product");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (product: PrintifyProduct) => {
    setEditingProduct(product);
    setEditForm({
      title: product.title,
      description: product.description || ""
    });
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      const { error } = await supabase
        .from('printify_products')
        .update({
          title: editForm.title,
          description: editForm.description
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      toast.success("Product updated successfully");
      setEditingProduct(null);
      await loadProducts();
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error.message || "Failed to update product");
    }
  };

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

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Printify Products
          </CardTitle>
          <CardDescription>Manage merchandise products from Printify</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No products found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Printify ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.title}</p>
                        {product.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.printify_id}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product.id, product.title)}
                          disabled={isDeleting === product.id}
                        >
                          {isDeleting === product.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product title and description</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProduct(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
