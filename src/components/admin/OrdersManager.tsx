import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, RefreshCw, ExternalLink, Package, Truck, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ManualOrderProcessor } from "./ManualOrderProcessor";
import { PrintifyProductSync } from "./PrintifyProductSync";
import { toast } from "sonner";

const getStatusBadge = (status: string) => {
  const statusLower = status?.toLowerCase() || '';
  
  if (statusLower.includes('delivered')) {
    return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="h-3 w-3 mr-1" />Delivered</Badge>;
  }
  if (statusLower.includes('shipped') || statusLower.includes('in_transit') || statusLower.includes('shipment')) {
    return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><Truck className="h-3 w-3 mr-1" />Shipped</Badge>;
  }
  if (statusLower.includes('fulfilled') || statusLower.includes('production')) {
    return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30"><Package className="h-3 w-3 mr-1" />Fulfilled</Badge>;
  }
  if (statusLower.includes('pending') || statusLower.includes('created')) {
    return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
  }
  if (statusLower.includes('cancel')) {
    return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelled</Badge>;
  }
  return <Badge variant="secondary">{status}</Badge>;
};

export function OrdersManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel('printify-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'printify_orders'
        },
        (payload) => {
          console.log('📦 Order update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new as any, ...prev]);
            toast.success('New order received!');
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(order => 
              order.id === payload.new.id ? payload.new : order
            ));
            const newStatus = (payload.new as any).status;
            if (newStatus?.includes('shipped') || newStatus?.includes('delivered')) {
              toast.success(`Order ${(payload.new as any).external_id} updated: ${newStatus}`);
            }
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(order => order.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("printify_orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.external_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportOrders = () => {
    const csv = [
      ["Order ID", "Customer", "Email", "Status", "Tracking", "Total", "Created At"],
      ...filteredOrders.map(o => [
        o.external_id,
        o.customer_name || '',
        o.customer_email || '',
        o.status,
        o.tracking_number || '',
        (o.amount_paid || o.total_price) / 100,
        new Date(o.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders_export.csv";
    a.click();
  };

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <ManualOrderProcessor />
        <PrintifyProductSync />
      </div>
      
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Orders & Customers
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" title="Real-time updates enabled" />
              </CardTitle>
              <CardDescription>Manage and track all orders (auto-updates enabled)</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadOrders} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={exportOrders} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ID, customer, email, or status..."
              className="pl-10"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer_name || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{order.external_id}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      {order.tracking_url ? (
                        <a 
                          href={order.tracking_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline text-sm"
                        >
                          {order.tracking_number || 'Track'}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : order.tracking_number ? (
                        <span className="text-sm font-mono">{order.tracking_number}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold">${((order.amount_paid || order.total_price) / 100).toFixed(2)}</TableCell>
                    <TableCell>
                      <div>
                        <div>{new Date(order.created_at).toLocaleDateString()}</div>
                        {order.shipped_at && (
                          <div className="text-xs text-muted-foreground">
                            Shipped: {new Date(order.shipped_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
