import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderRequest {
  line_items: Array<{
    printify_product_id: string;
    variant_id: number;
    quantity: number;
  }>;
  shipping_method: number;
  send_shipping_notification: boolean;
  address_to: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    country: string;
    region: string;
    address1: string;
    address2?: string;
    city: string;
    zip: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { line_items, shipping_method, send_shipping_notification, address_to }: OrderRequest = await req.json();

    console.log('=== Printify Order Creation Request ===');
    console.log('Line items:', JSON.stringify(line_items, null, 2));
    console.log('Shipping method:', shipping_method);
    console.log('Address:', JSON.stringify(address_to, null, 2));

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get shop ID (you might want to store this in environment variables)
    console.log('Fetching Printify shops...');
    const printifyResponse = await fetch("https://api.printify.com/v1/shops.json", {
      headers: {
        "Authorization": `Bearer ${Deno.env.get("PRINTIFY_API_KEY")}`,
        "Content-Type": "application/json",
      },
    });

    if (!printifyResponse.ok) {
      const errorText = await printifyResponse.text();
      console.error('Failed to fetch Printify shops:', errorText);
      throw new Error(`Printify API error: ${printifyResponse.statusText}`);
    }

    const shops = await printifyResponse.json();
    const shopId = shops.data[0].id;
    console.log('Using shop ID:', shopId);

    // Create order in Printify
    const orderData = {
      external_id: `order_${Date.now()}`,
      line_items,
      shipping_method,
      send_shipping_notification,
      address_to,
    };

    console.log('Creating Printify order with data:', JSON.stringify(orderData, null, 2));

    const createOrderResponse = await fetch(`https://api.printify.com/v1/shops/${shopId}/orders.json`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("PRINTIFY_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!createOrderResponse.ok) {
      const errorText = await createOrderResponse.text();
      console.error("❌ Printify order creation failed:", errorText);
      throw new Error(`Failed to create Printify order: ${createOrderResponse.statusText} - ${errorText}`);
    }

    const printifyOrder = await createOrderResponse.json();
    console.log("✅ Printify order created successfully!");
    console.log("Order ID:", printifyOrder.id);
    console.log("Status:", printifyOrder.status);
    console.log("Total price:", printifyOrder.total_price);

    // Store order in our database
    console.log('Storing order in database...');
    const { data: orderRecord, error: orderError } = await supabaseClient
      .from("printify_orders")
      .insert({
        printify_order_id: printifyOrder.id,
        external_id: orderData.external_id,
        status: printifyOrder.status,
        shipping_method: shipping_method,
        address_to: address_to,
        line_items: line_items,
        total_price: printifyOrder.total_price,
        total_shipping: printifyOrder.total_shipping,
        total_tax: printifyOrder.total_tax,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      console.error("⚠️ Database error:", orderError);
      // Don't throw - Printify order was created successfully
    } else {
      console.log("✅ Order stored in database:", orderRecord?.id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        order: printifyOrder,
        order_record: orderRecord
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Error creating Printify order:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});