import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PrintifyWebhookPayload {
  type: string;
  resource: {
    id: string;
    status: string;
    shipping_method?: number;
    shipments?: Array<{
      carrier: string;
      number: string;
      url: string;
      delivered_at?: string;
    }>;
    address_to?: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: PrintifyWebhookPayload = await req.json();
    console.log("📦 Printify webhook received:", payload.type);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { type, resource } = payload;

    // Handle different event types
    switch (type) {
      case "order:shipped":
      case "order:shipment:delivered":
      case "order:shipment:sent": {
        console.log(`📬 Processing ${type} event for order:`, resource.id);

        // Find order in database
        const { data: order, error: orderError } = await supabaseClient
          .from("printify_orders")
          .select("*")
          .eq("printify_order_id", resource.id)
          .single();

        if (orderError || !order) {
          console.error("❌ Order not found:", resource.id);
          return new Response(
            JSON.stringify({ error: "Order not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Get tracking info from shipments
        const shipment = resource.shipments?.[0];
        const trackingNumber = shipment?.number || null;
        const trackingUrl = shipment?.url || null;
        const carrier = shipment?.carrier || null;

        // Update order status
        const updateData: Record<string, any> = {
          status: resource.status || type.replace("order:", ""),
          updated_at: new Date().toISOString(),
        };

        if (trackingNumber) updateData.tracking_number = trackingNumber;
        if (trackingUrl) updateData.tracking_url = trackingUrl;

        if (type === "order:shipped" || type === "order:shipment:sent") {
          updateData.shipped_at = new Date().toISOString();
        }

        if (type === "order:shipment:delivered" || shipment?.delivered_at) {
          updateData.delivered_at = shipment?.delivered_at || new Date().toISOString();
        }

        const { error: updateError } = await supabaseClient
          .from("printify_orders")
          .update(updateData)
          .eq("printify_order_id", resource.id);

        if (updateError) {
          console.error("❌ Failed to update order:", updateError);
        } else {
          console.log("✅ Order updated:", resource.id);
        }

        // Send shipping notification email if order just shipped
        if ((type === "order:shipped" || type === "order:shipment:sent") && order.customer_email) {
          try {
            console.log("📧 Sending shipping notification email...");
            
            const { error: emailError } = await supabaseClient.functions.invoke('send-shipping-notification', {
              body: {
                order_id: order.external_id,
                customer_email: order.customer_email,
                customer_name: order.customer_name,
                tracking_number: trackingNumber,
                tracking_url: trackingUrl,
                carrier: carrier,
                items: order.line_items
              }
            });

            if (emailError) {
              console.error("❌ Failed to send shipping email:", emailError);
            } else {
              console.log("✅ Shipping notification email sent");
            }
          } catch (emailErr) {
            console.error("❌ Shipping email error:", emailErr);
          }
        }

        // Log the action
        await supabaseClient.from('order_action_logs').insert({
          order_id: order.external_id,
          action_type: type.replace("order:", ""),
          status: 'success',
          metadata: {
            printify_order_id: resource.id,
            tracking_number: trackingNumber,
            tracking_url: trackingUrl,
            carrier: carrier
          }
        });

        break;
      }

      case "order:created":
      case "order:updated": {
        console.log(`📝 Processing ${type} event for order:`, resource.id);
        
        // Update order status if exists
        const { error } = await supabaseClient
          .from("printify_orders")
          .update({ 
            status: resource.status,
            updated_at: new Date().toISOString()
          })
          .eq("printify_order_id", resource.id);

        if (error) {
          console.log("Order not in database yet or update failed:", error.message);
        }
        break;
      }

      case "order:cancelled": {
        console.log(`❌ Order cancelled:`, resource.id);
        
        const { error } = await supabaseClient
          .from("printify_orders")
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq("printify_order_id", resource.id);

        if (error) {
          console.error("Failed to update cancelled order:", error);
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${type}`);
    }

    return new Response(
      JSON.stringify({ success: true, type }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
