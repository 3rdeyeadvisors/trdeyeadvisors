import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify admin access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user is admin
    const { data: roles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin');

    if (!roles || roles.length === 0) {
      throw new Error('User is not an admin');
    }

    const { raffleId } = await req.json();

    if (!raffleId) {
      throw new Error('raffleId is required');
    }

    console.log('🔧 Starting raffle data audit and fix for raffle:', raffleId);

    // Step 1: Get all entries for this raffle
    const { data: entries, error: entriesError } = await supabaseAdmin
      .from('raffle_entries')
      .select('user_id, entry_count')
      .eq('raffle_id', raffleId);

    if (entriesError) throw entriesError;

    let fixed = 0;
    let verified = 0;
    const report: any[] = [];

    // Step 2: For each entry, count actual tickets and fix mismatches
    for (const entry of entries || []) {
      const { data: tickets } = await supabaseAdmin
        .from('raffle_tickets')
        .select('id, ticket_source')
        .eq('raffle_id', raffleId)
        .eq('user_id', entry.user_id);

      const actualTicketCount = tickets?.length || 0;
      const recordedCount = entry.entry_count;

      if (actualTicketCount !== recordedCount) {
        console.log(`❌ MISMATCH for user ${entry.user_id}: Recorded ${recordedCount}, Actual ${actualTicketCount}`);
        
        // Fix the entry count to match actual tickets
        const { error: updateError } = await supabaseAdmin
          .from('raffle_entries')
          .update({ entry_count: actualTicketCount })
          .eq('raffle_id', raffleId)
          .eq('user_id', entry.user_id);

        if (updateError) {
          console.error('Failed to update entry:', updateError);
        } else {
          fixed++;
          report.push({
            user_id: entry.user_id,
            old_count: recordedCount,
            new_count: actualTicketCount,
            status: 'FIXED'
          });
        }
      } else {
        verified++;
        report.push({
          user_id: entry.user_id,
          count: recordedCount,
          status: 'VERIFIED'
        });
      }
    }

    // Step 3: Check for orphaned tickets (tickets without entries)
    const { data: allTickets } = await supabaseAdmin
      .from('raffle_tickets')
      .select('user_id')
      .eq('raffle_id', raffleId);

    const uniqueTicketUsers = [...new Set(allTickets?.map(t => t.user_id) || [])];
    const entryUserIds = entries?.map(e => e.user_id) || [];
    const orphanedUsers = uniqueTicketUsers.filter(uid => !entryUserIds.includes(uid));

    let orphansFixed = 0;
    for (const userId of orphanedUsers) {
      const { data: userTickets } = await supabaseAdmin
        .from('raffle_tickets')
        .select('id')
        .eq('raffle_id', raffleId)
        .eq('user_id', userId);

      const ticketCount = userTickets?.length || 0;

      // Create missing entry
      const { error: createError } = await supabaseAdmin
        .from('raffle_entries')
        .insert({
          raffle_id: raffleId,
          user_id: userId,
          entry_count: ticketCount
        });

      if (!createError) {
        orphansFixed++;
        console.log(`✅ Created missing entry for user ${userId} with ${ticketCount} tickets`);
      }
    }

    const summary = {
      total_entries_checked: entries?.length || 0,
      mismatches_fixed: fixed,
      verified_correct: verified,
      orphaned_tickets_fixed: orphansFixed,
      report: report
    };

    console.log('🎉 Audit complete:', summary);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Raffle data audit and fix complete',
        summary
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in audit-fix-raffle-data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});