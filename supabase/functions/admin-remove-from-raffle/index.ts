import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Verify user is admin
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      throw new Error("User is not an admin");
    }

    const { raffleId } = await req.json();

    // Delete raffle participation data
    const { error: ticketsError } = await supabase
      .from("raffle_tickets")
      .delete()
      .eq("user_id", user.id)
      .eq("raffle_id", raffleId);

    if (ticketsError) {
      console.error("Error deleting tickets:", ticketsError);
    }

    const { error: entriesError } = await supabase
      .from("raffle_entries")
      .delete()
      .eq("user_id", user.id)
      .eq("raffle_id", raffleId);

    if (entriesError) {
      console.error("Error deleting entries:", entriesError);
    }

    const { error: tasksError } = await supabase
      .from("raffle_tasks")
      .delete()
      .eq("user_id", user.id)
      .eq("raffle_id", raffleId);

    if (tasksError) {
      console.error("Error deleting tasks:", tasksError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin removed from raffle successfully" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
