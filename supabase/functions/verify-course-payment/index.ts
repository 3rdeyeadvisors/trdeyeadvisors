import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-COURSE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { sessionId } = await req.json();
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    logStep("Session ID received", { sessionId });

    // Initialize Supabase with service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authentication required");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error("Invalid authentication");
    }

    logStep("User authenticated", { userId: userData.user.id });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Stripe session retrieved", { 
      sessionId, 
      paymentStatus: session.payment_status,
      metadata: session.metadata 
    });

    if (session.payment_status !== 'paid') {
      throw new Error("Payment not completed");
    }

    if (!session.metadata?.course_id) {
      throw new Error("Course ID not found in session metadata");
    }

    const courseId = parseInt(session.metadata.course_id);
    logStep("Course ID from metadata", { courseId });

    // Check if purchase already recorded
    const { data: existingPurchase } = await supabaseClient
      .from('user_purchases')
      .select('id')
      .eq('user_id', userData.user.id)
      .eq('product_id', courseId)
      .single();

    if (existingPurchase) {
      logStep("Purchase already recorded");
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Purchase already recorded" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Record the purchase
    const { error: purchaseError } = await supabaseClient
      .from('user_purchases')
      .insert({
        user_id: userData.user.id,
        product_id: courseId,
        stripe_session_id: sessionId,
        amount_paid: session.amount_total || 0,
        purchase_date: new Date().toISOString()
      });

    if (purchaseError) {
      logStep("Error recording purchase", { error: purchaseError });
      throw new Error("Failed to record purchase");
    }

    logStep("Purchase recorded successfully", { courseId, userId: userData.user.id });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Course purchase verified and recorded" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in verify-course-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});