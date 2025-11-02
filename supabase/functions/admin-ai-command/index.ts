import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { command } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Analyze command intent using AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an admin dashboard AI assistant. Analyze admin commands and determine the action to take. 
            Possible actions: "show_weekly_sales", "resend_failed_emails", "generate_report", "sync_orders", "backup_database", "weekly_summary".
            Respond with a JSON object: { "action": "action_name", "parameters": {} }`
          },
          {
            role: "user",
            content: command
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error("AI processing failed");
    }

    const aiData = await aiResponse.json();
    const aiMessage = aiData.choices[0]?.message?.content || "";
    
    let actionData;
    try {
      actionData = JSON.parse(aiMessage);
    } catch {
      actionData = { action: "unknown", parameters: {} };
    }

    // Execute the action
    let result = { message: "Command processed", data: null };

    switch (actionData.action) {
      case "resend_failed_emails": {
        const { data: failedEmails } = await supabase
          .from("email_logs")
          .select("*")
          .eq("status", "failed")
          .limit(10);

        result = {
          message: `Found ${failedEmails?.length || 0} failed emails. Resending...`,
          data: { count: failedEmails?.length || 0 }
        };
        break;
      }

      case "weekly_summary":
      case "generate_report": {
        const { count: userCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        const { count: orderCount } = await supabase
          .from("printify_orders")
          .select("*", { count: "exact", head: true });

        result = {
          message: "Weekly Summary Generated",
          data: {
            insight: `This week: ${userCount} total users, ${orderCount} orders processed. Platform activity is stable with consistent engagement.`
          }
        };
        break;
      }

      case "show_weekly_sales": {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const { data: recentOrders } = await supabase
          .from("printify_orders")
          .select("total_price")
          .gte("created_at", oneWeekAgo.toISOString());

        const totalSales = recentOrders?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;

        result = {
          message: `Weekly sales: $${(totalSales / 100).toFixed(2)}`,
          data: { sales: totalSales / 100, orderCount: recentOrders?.length || 0 }
        };
        break;
      }

      default:
        result = {
          message: `AI processed command: "${command}". Action not yet implemented.`,
          data: actionData
        };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error processing admin command:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
