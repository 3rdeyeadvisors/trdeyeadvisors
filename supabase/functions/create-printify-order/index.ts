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

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get shop ID
    const printifyResponse = await fetch("https://api.printify.com/v1/shops.json", {
      headers: {
        "Authorization": `Bearer ${Deno.env.get("PRINTIFY_API_KEY")}`,
        "Content-Type": "application/json",
      },
    });

    if (!printifyResponse.ok) {
      const errorText = await printifyResponse.text();
      throw new Error(`Printify API error: ${printifyResponse.statusText}`);
    }

    const shops = await printifyResponse.json();
    
    if (!shops || !Array.isArray(shops) || shops.length === 0) {
      throw new Error('No Printify shops configured. Please connect a Printify shop first.');
    }
    
    const shopId = shops[0].id;

    // Fetch product details for each line item to get print_provider_id
    const enrichedLineItems = await Promise.all(
      line_items.map(async (item) => {
        let actualProductId = item.printify_product_id;
        let productFound = false;
        
        // Try to fetch with the original product ID first
        let productResponse = await fetch(
          `https://api.printify.com/v1/shops/${shopId}/products/${actualProductId}.json`,
          {
            headers: {
              "Authorization": `Bearer ${Deno.env.get("PRINTIFY_API_KEY")}`,
              "Content-Type": "application/json",
            },
          }
        );

        // If product not found, look up current product from database
        if (!productResponse.ok) {
          const errorText = await productResponse.text();
          
          // Check if it's a "product doesn't belong to shop" error
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.code === 8104 || productResponse.status === 404) {
              
              const { data: currentProducts } = await supabaseClient
                .from('printify_products')
                .select('printify_id, title, shop_id')
                .eq('shop_id', shopId.toString())
                .eq('is_active', true)
                .limit(1);
              
              if (currentProducts && currentProducts.length > 0) {
                actualProductId = currentProducts[0].printify_id;
                
                // Try fetching with the new product ID
                productResponse = await fetch(
                  `https://api.printify.com/v1/shops/${shopId}/products/${actualProductId}.json`,
                  {
                    headers: {
                      "Authorization": `Bearer ${Deno.env.get("PRINTIFY_API_KEY")}`,
                      "Content-Type": "application/json",
                    },
                  }
                );
                
                if (!productResponse.ok) {
                  const newErrorText = await productResponse.text();
                  throw new Error(`Failed to fetch current product ${actualProductId}: ${newErrorText}`);
                }
                
                productFound = true;
              } else {
                throw new Error(`No active products found in database for shop ${shopId}. Please sync Printify products first.`);
              }
            } else {
              throw new Error(`Failed to fetch Printify product: ${errorText}`);
            }
          } catch (parseError) {
            throw new Error(`Failed to fetch Printify product ${actualProductId}: ${errorText}`);
          }
        } else {
          productFound = true;
        }

        const product = await productResponse.json();

        return {
          product_id: actualProductId,
          variant_id: item.variant_id,
          quantity: item.quantity,
          print_provider_id: product.print_provider_id
        };
      })
    );

    console.log('Creating Printify order...');

    // Create order in Printify
    const orderData = {
      external_id: `order_${Date.now()}`,
      line_items: enrichedLineItems,
      shipping_method,
      send_shipping_notification,
      address_to,
    };

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
    console.log("✅ Order created:", printifyOrder.id);

    // Store order in database
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
      console.error("Database error:", orderError.message);
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