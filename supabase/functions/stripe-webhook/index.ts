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

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  let event: Stripe.Event;

  try {
    // Read raw body and signature for webhook verification
    const signature = req.headers.get("stripe-signature");
    const body = await req.text();
    
    if (!signature) {
      console.error("❌ No Stripe signature found");
      return new Response(
        JSON.stringify({ error: "invalid signature" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Verify webhook signature using async crypto (Edge runtime safe)
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!webhookSecret) {
      console.error("❌ STRIPE_WEBHOOK_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "webhook secret not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    console.log("✅ Webhook signature verified, event type:", event.type);

  } catch (verifyError) {
    console.error("❌ Signature verification failed:", verifyError.message);
    return new Response(
      JSON.stringify({ error: "invalid signature" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }

  // Immediately acknowledge receipt to Stripe (before slow operations)
  const responsePromise = new Response(
    JSON.stringify({ received: true }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
  );

  // Process webhook event in background (don't block response)
  const backgroundWork = async () => {
    try {
      if (event.type !== "checkout.session.completed") {
        console.log("Ignoring event type:", event.type);
        return;
      }

      let session = event.data.object as Stripe.Checkout.Session;
      
      // Retrieve full session with line items and shipping details
      session = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items', 'line_items.data.price.product', 'customer', 'shipping_details']
      });
      
      console.log("🛒 Processing checkout session:", session.id);
      console.log("Session metadata:", session.metadata);
      console.log("Customer email:", session.customer_email);
      console.log("Shipping info:", session.shipping_details ? "✅ Present" : "❌ Missing");
      console.log("Shipping details:", JSON.stringify(session.shipping_details, null, 2));

      // Line items are already expanded in the session retrieval
      const lineItems = { data: session.line_items?.data || [] };

      console.log("📦 Line items count:", lineItems.data.length);

      // Separate merchandise (Printify) from digital items
      const printifyItems: any[] = [];
      const digitalItems: any[] = [];

      for (const item of lineItems.data) {
        const product = item.price?.product as Stripe.Product;
        if (product?.metadata) {
          const metadata = product.metadata;
          
          if (metadata.printify_id || metadata.printify_product_id) {
            printifyItems.push({
              printify_product_id: metadata.printify_product_id || metadata.printify_id,
              variant_id: parseInt(metadata.variant_id),
              quantity: item.quantity || 1,
              item_id: metadata.item_id,
            });
          } else if (metadata.item_id) {
            digitalItems.push({
              product_id: parseInt(metadata.item_id),
              quantity: item.quantity || 1,
            });
          }
        }
      }

      console.log("🎽 Printify items:", printifyItems.length);
      console.log("💾 Digital items:", digitalItems.length);

      // Get user ID from metadata or email lookup
      let userId: string | null = session.metadata?.user_id || null;
      
      if (!userId && session.customer_email) {
        try {
          const { data: userData } = await supabaseClient.auth.admin.listUsers();
          const user = userData.users.find(u => u.email === session.customer_email);
          if (user) {
            userId = user.id;
            console.log("👤 User found by email:", userId);
          }
        } catch (userErr) {
          console.error("Error looking up user:", userErr);
        }
      }

      // Handle Printify orders (merchandise only)
      if (printifyItems.length > 0) {
        try {
          const shippingInfo = session.shipping_details || session.shipping;
          if (!shippingInfo) {
            console.error("❌ Printify items present but no shipping info!");
            await supabaseClient.from('order_action_logs').insert({
              order_id: session.id,
              action_type: 'printify_created',
              status: 'error',
              error_message: 'No shipping information provided'
            });
          } else {
            console.log("📦 Creating Printify order (merchandise only)...");
            
            const orderData = {
              line_items: printifyItems,
              shipping_method: 1,
              send_shipping_notification: true,
              address_to: {
                first_name: shippingInfo.name?.split(' ')[0] || "Customer",
                last_name: shippingInfo.name?.split(' ').slice(1).join(' ') || "Name",
                email: session.customer_email || session.customer_details?.email || "",
                phone: session.customer_details?.phone || "",
                country: shippingInfo.address?.country || "",
                region: shippingInfo.address?.state || "",
                address1: shippingInfo.address?.line1 || "",
                address2: shippingInfo.address?.line2 || "",
                city: shippingInfo.address?.city || "",
                zip: shippingInfo.address?.postal_code || "",
              },
            };

            const printifyResponse = await supabaseClient.functions.invoke('create-printify-order', {
              body: orderData,
            });

            if (printifyResponse.error) {
              console.error("❌ Error creating Printify order:", printifyResponse.error);
              await supabaseClient.from('order_action_logs').insert({
                order_id: session.id,
                action_type: 'printify_created',
                status: 'error',
                error_message: printifyResponse.error.message
              });
            } else {
              console.log("✅ Printify order created:", printifyResponse.data?.order?.id);

              // Update order with user_id
              if (userId && printifyResponse.data?.order?.id) {
                await supabaseClient
                  .from('printify_orders')
                  .update({ user_id: userId })
                  .eq('printify_order_id', printifyResponse.data.order.id);
              }

              await supabaseClient.from('order_action_logs').insert({
                order_id: session.id,
                action_type: 'printify_created',
                status: 'success',
                metadata: { 
                  printify_order_id: printifyResponse.data?.order?.id,
                  items_count: printifyItems.length
                }
              });
            }
          }
        } catch (printifyErr) {
          console.error("❌ Printify order failed:", printifyErr);
          await supabaseClient.from('order_action_logs').insert({
            order_id: session.id,
            action_type: 'printify_created',
            status: 'error',
            error_message: printifyErr.message
          });
        }
      }

      // Record digital product purchases and generate download links
      const digitalDownloadItems: any[] = [];
      if (digitalItems.length > 0 && userId) {
        try {
          console.log("💾 Recording digital purchases and generating download links...");
          
          for (const item of digitalItems) {
            // Record purchase
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
                console.error("❌ Error recording purchase:", purchaseError);
              } else {
                console.log("✅ Purchase recorded for product:", item.product_id);
              }
            }

            // Get product details (course)
            const { data: course } = await supabaseClient
              .from('courses')
              .select('title')
              .eq('id', item.product_id)
              .single();

            // Get associated files for this product
            const { data: files } = await supabaseClient
              .from('digital_product_files')
              .select('id')
              .eq('product_id', item.product_id);

            if (files && files.length > 0) {
              // Generate cryptographically secure 64-character hex token (256 bits of entropy)
              const tokenBytes = new Uint8Array(32);
              crypto.getRandomValues(tokenBytes);
              const downloadToken = Array.from(tokenBytes).map(b => b.toString(16).padStart(2, '0')).join('');
              const expiryDate = new Date();
              expiryDate.setDate(expiryDate.getDate() + 7); // 7 days expiry

              // Create download record
              const { error: downloadError } = await supabaseClient
                .from('digital_downloads')
                .insert({
                  order_id: session.id,
                  user_id: userId,
                  user_email: session.customer_email || '',
                  product_id: item.product_id,
                  product_name: course?.title || `Course ${item.product_id}`,
                  product_type: 'course',
                  download_token: downloadToken,
                  file_ids: files.map(f => f.id),
                  expires_at: expiryDate.toISOString(),
                  max_downloads: 5,
                  download_count: 0
                });

              if (downloadError) {
                console.error("❌ Error creating download record:", downloadError);
              } else {
                console.log("✅ Download link generated for product:", item.product_id);
                digitalDownloadItems.push({
                  product_id: item.product_id,
                  product_name: course?.title || `Course ${item.product_id}`,
                  download_token: downloadToken
                });
              }
            }
          }

          // Log action
          await supabaseClient.from('order_action_logs').insert({
            order_id: session.id,
            action_type: 'digital_links_generated',
            status: 'success',
            metadata: { items_count: digitalDownloadItems.length }
          });

        } catch (digitalErr) {
          console.error("❌ Digital purchase processing failed:", digitalErr);
          await supabaseClient.from('order_action_logs').insert({
            order_id: session.id,
            action_type: 'digital_links_generated',
            status: 'error',
            error_message: digitalErr.message
          });
        }
      }

      // Prepare email items
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

      // Send customer order confirmation email
      try {
        console.log("📧 Sending customer confirmation email...");
        
        const orderConfirmationPayload = {
          order_id: session.id.substring(session.id.length - 8).toUpperCase(),
          customer_email: session.customer_email || session.customer_details?.email || '',
          customer_name: session.customer_details?.name || session.shipping?.name || 'Customer',
          items: emailItems,
          subtotal: session.amount_subtotal || 0,
          shipping: session.total_details?.amount_shipping || 0,
          total: session.amount_total || 0,
          shipping_address: session.shipping?.address || undefined
        };

        const { error: emailError } = await supabaseClient.functions.invoke('send-order-confirmation', {
          body: orderConfirmationPayload
        });

        if (emailError) {
          console.error("❌ Failed to send customer confirmation:", emailError);
        } else {
          console.log("✅ Customer confirmation email sent");
        }
      } catch (emailErr) {
        console.error("❌ Customer email failed:", emailErr);
      }

      // Send admin notification email
      try {
        console.log("📧 Sending admin notification email...");
        
        const adminNotificationPayload = {
          order_id: session.id.substring(session.id.length - 8).toUpperCase(),
          customer_email: session.customer_email || session.customer_details?.email || '',
          customer_name: session.customer_details?.name || session.shipping?.name || 'Customer',
          items: emailItems,
          total: session.amount_total || 0,
          shipping_address: session.shipping?.address || undefined
        };

        const { error: adminEmailError } = await supabaseClient.functions.invoke('send-admin-order-notification', {
          body: adminNotificationPayload
        });

        if (adminEmailError) {
          console.error("❌ Failed to send admin notification:", adminEmailError);
        } else {
          console.log("✅ Admin notification email sent");
        }
      } catch (adminErr) {
        console.error("❌ Admin email failed:", adminErr);
      }

      // Record discount usage if applicable
      if (session.metadata?.discount_id && session.total_details?.amount_discount) {
        try {
          console.log("🎟️ Recording discount usage...");
          
          await supabaseClient
            .from('discount_usage')
            .insert({
              discount_id: session.metadata.discount_id,
              user_id: userId,
              stripe_session_id: session.id,
              order_amount: session.amount_total || 0,
              discount_amount: session.total_details.amount_discount,
            });

          await supabaseClient
            .from('discount_codes')
            .update({ current_uses: supabaseClient.sql`current_uses + 1` })
            .eq('id', session.metadata.discount_id);

          console.log("✅ Discount usage recorded");
        } catch (discountErr) {
          console.error("❌ Discount recording failed:", discountErr);
        }
      }

      console.log("✅ Webhook processing complete");
    } catch (bgError) {
      console.error("❌ Background processing error:", bgError);
    }
  };

  // Start background work without blocking response
  EdgeRuntime.waitUntil(backgroundWork());

  return responsePromise;
});
