import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      throw new Error("No items provided");
    }

    // Initialize Stripe with secret key
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    console.log("Stripe key starts with:", stripeSecretKey?.substring(0, 7));
    
    if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_')) {
      throw new Error("Invalid or missing Stripe secret key. Expected key starting with 'sk_'");
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Separate digital and physical (Printify) products
    const digitalItems = items.filter((item: any) => !item.printify_id);
    const printifyItems = items.filter((item: any) => item.printify_id);

    console.log('Digital items:', digitalItems.length);
    console.log('Printify items:', printifyItems.length);

    // Create line items for Stripe
    const lineItems = items.map((item: any) => {
      const productData: any = {
        name: item.title,
        description: `${item.category} - ${item.type}`,
        metadata: {
          type: item.type || 'digital',
          category: item.category || 'product',
          printify_id: item.printify_id || '',
          item_id: item.id.toString(),
        },
      };

      // Add product images if available
      if (item.images && item.images.length > 0) {
        // Use the first image as the main product image
        const mainImage = item.images[0];
        if (mainImage && (mainImage.src || mainImage.url)) {
          productData.images = [mainImage.src || mainImage.url];
        }
      }

      return {
        price_data: {
          currency: "usd",
          product_data: productData,
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      automatic_tax: {
        enabled: true,
      },
      success_url: `${req.headers.get("origin")}/store?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cart?canceled=true`,
      metadata: {
        has_printify_items: printifyItems.length > 0 ? 'true' : 'false',
        printify_items_count: printifyItems.length.toString(),
      },
    });

    // Note: Digital product purchase recording would be handled after successful payment
    // via webhook or success page, not in the checkout creation phase

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating cart checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});