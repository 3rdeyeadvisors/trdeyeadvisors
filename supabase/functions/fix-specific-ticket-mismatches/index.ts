import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${timestamp}] [FIX-TICKET-MISMATCHES] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Initialize Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify admin access
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization required");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("Invalid authentication");
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
      throw new Error("Admin access required");
    }

    logStep("Admin verified", { userId: userData.user.id });

    // Parse request body
    const { raffleId } = await req.json();
    
    if (!raffleId) {
      throw new Error("raffleId is required");
    }

    logStep("Processing raffle", { raffleId });

    // Define the 2 users with mismatches from the audit
    const usersToFix = [
      { userId: "97e82a90-41de-4e06-80b4-cf7d3e528643", expectedEntries: 2 },
      { userId: "924b0355-8c9b-40b5-a400-2bd2e9909d22", expectedEntries: 14 }
    ];

    const fixResults = [];

    for (const userToFix of usersToFix) {
      logStep("Processing user", { userId: userToFix.userId });

      // Get current entry count
      const { data: entryData, error: entryError } = await supabaseClient
        .from("raffle_entries")
        .select("entry_count")
        .eq("user_id", userToFix.userId)
        .eq("raffle_id", raffleId)
        .single();

      if (entryError) {
        logStep("User entry not found", { userId: userToFix.userId, error: entryError.message });
        fixResults.push({
          userId: userToFix.userId,
          status: "error",
          message: "Entry not found for this user in the specified raffle"
        });
        continue;
      }

      const expectedTickets = entryData.entry_count;

      // Get current ticket count
      const { data: ticketData, error: ticketError } = await supabaseClient
        .from("raffle_tickets")
        .select("id")
        .eq("user_id", userToFix.userId)
        .eq("raffle_id", raffleId);

      if (ticketError) {
        logStep("Error fetching tickets", { userId: userToFix.userId, error: ticketError.message });
        fixResults.push({
          userId: userToFix.userId,
          status: "error",
          message: ticketError.message
        });
        continue;
      }

      const actualTickets = ticketData?.length || 0;
      const missingTickets = expectedTickets - actualTickets;

      logStep("Ticket analysis", {
        userId: userToFix.userId,
        expectedTickets,
        actualTickets,
        missingTickets
      });

      if (missingTickets <= 0) {
        fixResults.push({
          userId: userToFix.userId,
          status: "no_action_needed",
          expectedTickets,
          actualTickets,
          message: "Ticket count is already correct"
        });
        continue;
      }

      // Create missing tickets
      const ticketsToCreate = [];
      for (let i = 0; i < missingTickets; i++) {
        ticketsToCreate.push({
          user_id: userToFix.userId,
          raffle_id: raffleId,
          ticket_source: "admin_correction",
          metadata: {
            correction_type: "audit_fix_2025_11_25",
            original_ticket_count: actualTickets,
            corrected_to: expectedTickets,
            correction_timestamp: new Date().toISOString(),
            corrected_by: userData.user.id,
            reason: "Fixed ticket count mismatch found in raffle audit"
          }
        });
      }

      const { data: insertedTickets, error: insertError } = await supabaseClient
        .from("raffle_tickets")
        .insert(ticketsToCreate)
        .select();

      if (insertError) {
        logStep("Error creating tickets", { userId: userToFix.userId, error: insertError.message });
        fixResults.push({
          userId: userToFix.userId,
          status: "error",
          message: insertError.message
        });
        continue;
      }

      logStep("Tickets created successfully", {
        userId: userToFix.userId,
        ticketsCreated: insertedTickets?.length || 0
      });

      // Verify final count
      const { data: verifyData } = await supabaseClient
        .from("raffle_tickets")
        .select("id")
        .eq("user_id", userToFix.userId)
        .eq("raffle_id", raffleId);

      fixResults.push({
        userId: userToFix.userId,
        status: "fixed",
        expectedTickets,
        previousTickets: actualTickets,
        ticketsAdded: missingTickets,
        currentTickets: verifyData?.length || 0,
        verified: (verifyData?.length || 0) === expectedTickets
      });
    }

    logStep("Fix complete", { results: fixResults });

    return new Response(
      JSON.stringify({
        success: true,
        raffleId,
        results: fixResults,
        summary: {
          usersProcessed: usersToFix.length,
          usersFixed: fixResults.filter(r => r.status === "fixed").length,
          usersAlreadyCorrect: fixResults.filter(r => r.status === "no_action_needed").length,
          errors: fixResults.filter(r => r.status === "error").length
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});