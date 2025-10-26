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
    const { items, discountCode } = await req.json();

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

    // Validate all items against database and fetch actual prices
    const validatedItems = await Promise.all(items.map(async (item: any) => {
      // Validate quantity
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
        throw new Error(`Invalid quantity for item: ${item.title || item.id}`);
      }

      if (item.printify_id) {
        // Validate Printify product
        const { data: product, error } = await supabaseClient
          .from('printify_products')
          .select('printify_id, title, variants, is_active')
          .eq('printify_id', item.printify_id)
          .single();

        if (error || !product || !product.is_active) {
          console.error('Product validation error:', { error, product, printify_id: item.printify_id });
          throw new Error(`Invalid or inactive product: ${item.printify_id}`);
        }

        // Find the specific variant price - try matching by id (both string and number)
        const variant = product.variants?.find((v: any) => 
          v.id === item.variant_id || 
          v.id?.toString() === item.variant_id?.toString() ||
          v.variant_id === item.variant_id
        );
        
        if (!variant) {
          console.error('Variant not found:', { 
            item_variant_id: item.variant_id, 
            available_variants: product.variants?.map((v: any) => ({ id: v.id, variant_id: v.variant_id })),
            product_title: product.title
          });
          throw new Error(`Invalid variant ${item.variant_id} for product: ${item.printify_id}`);
        }

        return { ...item, validatedPrice: Math.round(variant.price * 100), dbTitle: product.title };
      } else {
        // Validate course/digital product
        const { data: course, error } = await supabaseClient
          .from('courses')
          .select('id, title, price_cents, is_active')
          .eq('id', item.id)
          .single();

        if (error || !course || !course.is_active) {
          throw new Error(`Invalid or inactive course: ${item.id}`);
        }

        return { ...item, validatedPrice: course.price_cents, dbTitle: course.title };
      }
    }));

    // Separate digital and physical (Printify) products
    const digitalItems = validatedItems.filter((item: any) => !item.printify_id);
    const printifyItems = validatedItems.filter((item: any) => item.printify_id);

    console.log('Digital items:', digitalItems.length);
    console.log('Printify items:', printifyItems.length);

    // Create line items for Stripe using validated prices
    const lineItems = validatedItems.map((item: any) => {
      // Build product name with variant info for Printify items
      let productName = item.dbTitle; // Use validated title from database
      if (item.printify_id && (item.color || item.size)) {
        const variantInfo = [item.color, item.size].filter(Boolean).join(' / ');
        if (variantInfo) {
          productName = `${item.dbTitle} (${variantInfo})`;
        }
      }

      const productData: any = {
        name: productName,
        description: `${item.category} - ${item.type}`,
        metadata: {
          type: item.type || 'digital',
          category: item.category || 'product',
          printify_id: item.printify_id || '',
          printify_product_id: item.printify_product_id || '',
          variant_id: item.variant_id ? item.variant_id.toString() : '',
          color: item.color || '',
          size: item.size || '',
          item_id: item.id.toString(),
        },
      };

      // Add product image - use item.image if available, otherwise fallback to images array
      if (item.image) {
        productData.images = [item.image];
      } else if (item.images && item.images.length > 0) {
        const mainImage = item.images[0];
        if (mainImage && (mainImage.src || mainImage.url)) {
          productData.images = [mainImage.src || mainImage.url];
        }
      }

      return {
        price_data: {
          currency: "usd",
          product_data: productData,
          unit_amount: item.validatedPrice, // Use validated price from database
          tax_behavior: 'exclusive', // Tax calculated and added on top
        },
        quantity: item.quantity,
      };
    });

    // Calculate total amount
    const totalAmount = lineItems.reduce((sum, item) => sum + (item.price_data.unit_amount * item.quantity), 0);

    // Validate and apply discount if provided
    let discountAmount = 0;
    let discountId = null;
    
    if (discountCode) {
      const { data: discountResult, error: discountError } = await supabaseClient
        .rpc('validate_discount_code', {
          _code: discountCode,
          _amount: Math.floor(totalAmount / 100),
          _product_type: 'all'
        })
        .single();

      if (discountResult && discountResult.is_valid) {
        discountId = discountResult.discount_id;
        discountAmount = discountResult.discount_amount * 100;
        console.log('Discount applied:', { discountId, discountAmount });
      }
    }

    // Check if there are any physical items
    const hasPhysicalItems = printifyItems.length > 0;

    // Create checkout session config
    const sessionConfig: any = {
      line_items: lineItems,
      mode: "payment",
      billing_address_collection: 'required',
      automatic_tax: { enabled: true },
      success_url: `${req.headers.get("origin")}/store?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cart?canceled=true`,
      metadata: {
        has_printify_items: printifyItems.length > 0 ? 'true' : 'false',
        printify_items_count: printifyItems.length.toString(),
        discount_id: discountId || '',
        discount_code: discountCode || '',
      },
    };

    // Add shipping address collection for physical items
    if (hasPhysicalItems) {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI', 'AT', 'IE', 'PT', 'PL', 'CZ', 'GR', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'CY', 'MT', 'LU', 'IS', 'LI', 'CH', 'JP', 'SG', 'NZ', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'CR', 'PA', 'UY', 'EC', 'GT', 'HN', 'NI', 'SV', 'DO', 'BO', 'PY', 'VE', 'TT', 'JM', 'BS', 'BB', 'BZ', 'GY', 'SR', 'GD', 'LC', 'VC', 'AG', 'DM', 'KN', 'AW', 'CW', 'BM', 'KY', 'VG', 'TC', 'AI', 'MS', 'FK', 'GI', 'GG', 'JE', 'IM', 'FO', 'GL', 'AX'],
      };
    }

    // Apply discount if valid
    if (discountAmount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: discountAmount,
        currency: 'usd',
        duration: 'once',
        name: discountCode,
      });
      sessionConfig.discounts = [{ coupon: coupon.id }];
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);

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