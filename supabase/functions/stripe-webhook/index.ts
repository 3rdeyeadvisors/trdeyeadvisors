import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const signature = req.headers.get("stripe-signature");
    const body = await req.text();
    
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    // Verify webhook signature (if webhook secret is configured)
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    let event: Stripe.Event;
    
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // For testing without webhook secret
      event = JSON.parse(body);
      console.warn("Processing webhook without signature verification - not recommended for production");
    }

    console.log("Processing Stripe event:", event.type);

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("Checkout session completed:", session.id);
      console.log("Session metadata:", session.metadata);
      console.log("Customer email:", session.customer_email);
      console.log("Customer details:", session.customer_details);
      console.log("Shipping details:", session.shipping_details);

      // Get line items to process the order
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product'],
      });

      console.log("Line items count:", lineItems.data.length);

      // Separate Printify items from digital items
      const printifyItems: any[] = [];
      const digitalItems: any[] = [];

      for (const item of lineItems.data) {
        const product = item.price?.product as Stripe.Product;
        if (product && product.metadata) {
          const metadata = product.metadata;
          
          console.log('Processing line item:', {
            name: product.name,
            metadata: metadata,
            quantity: item.quantity
          });
          
          if (metadata.printify_id || metadata.printify_product_id) {
            printifyItems.push({
              printify_product_id: metadata.printify_product_id || metadata.printify_id,
              variant_id: parseInt(metadata.variant_id),
              quantity: item.quantity || 1,
              item_id: metadata.item_id,
            });
          } else {
            digitalItems.push({
              product_id: parseInt(metadata.item_id),
              quantity: item.quantity || 1,
            });
          }
        }
      }

      console.log("Printify items:", printifyItems.length);
      console.log("Digital items:", digitalItems.length);

      // Get user ID from session metadata (preferred) or customer email lookup
      let userId: string | null = session.metadata?.user_id || null;
      
      if (!userId && session.customer_email) {
        console.log('Looking up user by email:', session.customer_email);
        const { data: userData } = await supabaseClient.auth.admin.listUsers();
        const user = userData.users.find(u => u.email === session.customer_email);
        if (user) {
          userId = user.id;
          console.log('User found by email lookup:', userId);
        } else {
          console.warn('No user found for email:', session.customer_email);
        }
      } else if (userId) {
        console.log('User ID from session metadata:', userId);
      }

      // Handle Printify orders
      if (printifyItems.length > 0 && session.shipping_details) {
        console.log("=== Creating Printify Order ===");
        console.log('Printify items:', JSON.stringify(printifyItems, null, 2));
        console.log('Shipping details:', JSON.stringify(session.shipping_details, null, 2));
        
        const orderData = {
          line_items: printifyItems,
          shipping_method: 1, // Standard shipping
          send_shipping_notification: true,
          address_to: {
            first_name: session.shipping_details.name?.split(' ')[0] || session.customer_details?.name?.split(' ')[0] || "Customer",
            last_name: session.shipping_details.name?.split(' ').slice(1).join(' ') || session.customer_details?.name?.split(' ').slice(1).join(' ') || "Name",
            email: session.customer_email || session.customer_details?.email || "",
            phone: session.customer_details?.phone || "",
            country: session.shipping_details.address?.country || "",
            region: session.shipping_details.address?.state || "",
            address1: session.shipping_details.address?.line1 || "",
            address2: session.shipping_details.address?.line2 || "",
            city: session.shipping_details.address?.city || "",
            zip: session.shipping_details.address?.postal_code || "",
          },
        };

        console.log("Printify order payload:", JSON.stringify(orderData, null, 2));

        // Call create-printify-order function
        const printifyResponse = await supabaseClient.functions.invoke('create-printify-order', {
          body: orderData,
        });

        if (printifyResponse.error) {
          console.error("Error creating Printify order:", printifyResponse.error);
          throw new Error(`Failed to create Printify order: ${printifyResponse.error.message}`);
        }

        console.log("✅ Printify order created successfully!");
        console.log("Order ID:", printifyResponse.data?.order?.id);
        console.log("Order status:", printifyResponse.data?.order?.status);

        // Update the order with user_id if available
        if (userId && printifyResponse.data?.order?.id) {
          console.log('Updating Printify order with user_id:', userId);
          const { error: updateError } = await supabaseClient
            .from('printify_orders')
            .update({ user_id: userId })
            .eq('printify_order_id', printifyResponse.data.order.id);
            
          if (updateError) {
            console.error('Failed to update order with user_id:', updateError);
          } else {
            console.log('✅ Order updated with user_id');
          }
        }
      } else if (printifyItems.length > 0 && !session.shipping_details) {
        console.error('❌ Printify items present but no shipping details!');
      }

      // Record digital product purchases
      if (digitalItems.length > 0 && userId) {
        console.log("Recording digital product purchases...");
        
        for (const item of digitalItems) {
          // Check if purchase already exists
          const { data: existingPurchase } = await supabaseClient
            .from('user_purchases')
            .select('id')
            .eq('user_id', userId)
            .eq('product_id', item.product_id)
            .eq('stripe_session_id', session.id)
            .single();

          if (!existingPurchase) {
            const { error: purchaseError } = await supabaseClient
              .from('user_purchases')
              .insert({
                user_id: userId,
                product_id: item.product_id,
                stripe_session_id: session.id,
                amount_paid: session.amount_total,
                purchase_date: new Date().toISOString(),
              });

            if (purchaseError) {
              console.error("Error recording purchase:", purchaseError);
            } else {
              console.log("Purchase recorded for product:", item.product_id);
            }
          }
        }
      }

      // Send order confirmation emails
      console.log("=== Sending Order Confirmation Emails ===");
      
      // Prepare items data for emails
      const emailItems = lineItems.data.map(item => {
        const product = item.price?.product as Stripe.Product;
        const isPrintify = product.metadata?.printify_id || product.metadata?.printify_product_id;
        
        return {
          name: product.name,
          quantity: item.quantity || 1,
          price: item.amount_total || 0,
          type: isPrintify ? 'merchandise' : 'digital'
        };
      });

      // Customer order confirmation
      try {
        const orderConfirmationPayload = {
          order_id: session.id.substring(session.id.length - 8).toUpperCase(),
          customer_email: session.customer_email || session.customer_details?.email || '',
          customer_name: session.customer_details?.name || session.shipping_details?.name || 'Customer',
          items: emailItems,
          subtotal: session.amount_subtotal || 0,
          shipping: session.total_details?.amount_shipping || 0,
          total: session.amount_total || 0,
          shipping_address: session.shipping_details?.address || undefined
        };

        console.log('Sending customer order confirmation...');
        const { error: emailError } = await supabaseClient.functions.invoke('send-order-confirmation', {
          body: orderConfirmationPayload
        });

        if (emailError) {
          console.error('Failed to send order confirmation:', emailError);
        } else {
          console.log('✅ Order confirmation email sent');
        }
      } catch (emailErr) {
        console.error('Error sending order confirmation:', emailErr);
      }

      // Admin notification
      try {
        const adminNotificationPayload = {
          order_id: session.id.substring(session.id.length - 8).toUpperCase(),
          customer_email: session.customer_email || session.customer_details?.email || '',
          customer_name: session.customer_details?.name || session.shipping_details?.name || 'Customer',
          items: emailItems,
          total: session.amount_total || 0,
          shipping_address: session.shipping_details?.address || undefined
        };

        console.log('Sending admin notification...');
        const { error: adminEmailError } = await supabaseClient.functions.invoke('send-admin-order-notification', {
          body: adminNotificationPayload
        });

        if (adminEmailError) {
          console.error('Failed to send admin notification:', adminEmailError);
        } else {
          console.log('✅ Admin notification sent');
        }
      } catch (adminErr) {
        console.error('Error sending admin notification:', adminErr);
      }

      // Record discount usage if applicable
      if (session.metadata?.discount_id && session.total_details?.amount_discount) {
        console.log("Recording discount usage...");
        
        const { error: discountError } = await supabaseClient
          .from('discount_usage')
          .insert({
            discount_id: session.metadata.discount_id,
            user_id: userId,
            stripe_session_id: session.id,
            order_amount: session.amount_total || 0,
            discount_amount: session.total_details.amount_discount,
          });

        if (discountError) {
          console.error("Error recording discount usage:", discountError);
        }

        // Increment discount usage count
        await supabaseClient
          .from('discount_codes')
          .update({ current_uses: supabaseClient.sql`current_uses + 1` })
          .eq('id', session.metadata.discount_id);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
