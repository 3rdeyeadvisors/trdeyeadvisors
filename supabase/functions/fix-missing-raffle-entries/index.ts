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

    // Verify admin access by checking JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Decode JWT to get user ID
    const token = authHeader.replace('Bearer ', '');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    const userId = payload.sub;

    if (!userId) {
      throw new Error('Invalid token');
    }

    // Check if user is admin using service role client
    const { data: roles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin');

    if (!roles || roles.length === 0) {
      throw new Error('User is not an admin');
    }

    console.log(`Admin ${userId} running missing entries fix`);

    // Find all verified tasks that don't have corresponding entries
    const { data: verifiedTasks, error: taskError } = await supabaseAdmin
      .from('raffle_tasks')
      .select('id, user_id, raffle_id, task_type, verification_status')
      .eq('verification_status', 'verified')
      .eq('completed', true);

    if (taskError) throw taskError;

    console.log(`Found ${verifiedTasks?.length || 0} verified tasks`);

    const fixed = [];
    const tasksByUserRaffle = new Map<string, number>();

    // Count verified tasks per user per raffle
    for (const task of verifiedTasks || []) {
      const key = `${task.user_id}-${task.raffle_id}`;
      tasksByUserRaffle.set(key, (tasksByUserRaffle.get(key) || 0) + 1);
    }

    // Check each user/raffle combo
    for (const [key, taskCount] of tasksByUserRaffle.entries()) {
      const [userId, raffleId] = key.split('-');
      
      const { data: existingEntry } = await supabaseAdmin
        .from('raffle_entries')
        .select('entry_count')
        .eq('user_id', userId)
        .eq('raffle_id', raffleId)
        .maybeSingle();

      if (!existingEntry) {
        // Create missing entry
        const entryCount = taskCount * 2; // 2 tickets per verified task
        
        console.log(`Creating missing entry for user ${userId}: ${entryCount} tickets`);
        
        const { error: insertError } = await supabaseAdmin
          .from('raffle_entries')
          .insert({
            user_id: userId,
            raffle_id: raffleId,
            entry_count: entryCount,
          });

        if (insertError) {
          console.error(`Failed to create entry for ${userId}:`, insertError);
        } else {
          // Create individual tickets for each verified task
          for (let i = 0; i < taskCount; i++) {
            for (let j = 0; j < 2; j++) { // 2 tickets per task
              await supabaseAdmin
                .from('raffle_tickets')
                .insert({
                  user_id: userId,
                  raffle_id: raffleId,
                  ticket_source: 'verification',
                  metadata: { backfilled: true }
                });
            }
          }
          fixed.push({ userId, raffleId, entryCount });
        }
      }
    }

    console.log(`Fixed ${fixed.length} missing entries`);

    return new Response(
      JSON.stringify({ 
        success: true,
        fixed: fixed.length,
        details: fixed
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error fixing missing entries:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
