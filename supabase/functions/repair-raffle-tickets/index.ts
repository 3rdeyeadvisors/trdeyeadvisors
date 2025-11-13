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

    console.log(`🔧 Starting ticket repair for raffle: ${raffleId}`);

    // Get all verified tasks
    const { data: verifiedTasks, error: tasksError } = await supabaseAdmin
      .from('raffle_tasks')
      .select('id, user_id, task_type, instagram_username, x_username')
      .eq('raffle_id', raffleId)
      .eq('verification_status', 'verified');

    if (tasksError) throw tasksError;

    console.log(`Found ${verifiedTasks?.length || 0} verified tasks`);

    const repairs: any[] = [];

    // Process each user
    const userTasks = new Map<string, any[]>();
    verifiedTasks?.forEach(task => {
      const existing = userTasks.get(task.user_id) || [];
      existing.push(task);
      userTasks.set(task.user_id, existing);
    });

    for (const [userId, tasks] of userTasks.entries()) {
      // Count current tickets
      const { data: currentTickets } = await supabaseAdmin
        .from('raffle_tickets')
        .select('id')
        .eq('raffle_id', raffleId)
        .eq('user_id', userId);

      const currentCount = currentTickets?.length || 0;
      const expectedCount = tasks.length * 2; // 2 tickets per verified task

      console.log(`User ${userId}: ${currentCount} tickets, expected ${expectedCount}`);

      if (currentCount !== expectedCount) {
        console.log(`Mismatch detected: ${currentCount} vs ${expectedCount}`);

        if (currentCount > expectedCount) {
          // User has too many tickets - delete extras
          const ticketsToDelete = currentCount - expectedCount;
          console.log(`User has ${ticketsToDelete} extra tickets, removing them`);

          // Get extra tickets (keep the oldest ones, delete newest)
          const { data: allUserTickets } = await supabaseAdmin
            .from('raffle_tickets')
            .select('id')
            .eq('raffle_id', raffleId)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(ticketsToDelete);

          if (allUserTickets && allUserTickets.length > 0) {
            const idsToDelete = allUserTickets.map(t => t.id);
            const { error: deleteError } = await supabaseAdmin
              .from('raffle_tickets')
              .delete()
              .in('id', idsToDelete);

            if (deleteError) {
              console.error(`Failed to delete extra tickets: ${deleteError.message}`);
              throw deleteError;
            }
            console.log(`✅ Deleted ${ticketsToDelete} extra tickets`);
          }

          repairs.push({
            user_id: userId,
            old_tickets: currentCount,
            new_tickets: expectedCount,
            deleted: ticketsToDelete
          });
        } else {
          // User has too few tickets - create missing ones
          const ticketsToCreate = expectedCount - currentCount;
          console.log(`Creating ${ticketsToCreate} missing tickets`);

          // Create missing tickets per task
          for (const task of tasks) {
            // Check how many tickets exist for this specific task
            const { data: taskTickets } = await supabaseAdmin
              .from('raffle_tickets')
              .select('id')
              .eq('task_id', task.id)
              .eq('raffle_id', raffleId)
              .eq('user_id', userId);

            const taskTicketCount = taskTickets?.length || 0;
            const ticketsNeeded = 2 - taskTicketCount;

            if (ticketsNeeded > 0) {
              const username = task.task_type === 'instagram' 
                ? task.instagram_username 
                : task.x_username;

              for (let i = 0; i < ticketsNeeded; i++) {
                const { error: insertError } = await supabaseAdmin
                  .from('raffle_tickets')
                  .insert({
                    user_id: userId,
                    raffle_id: raffleId,
                    ticket_source: 'verification',
                    task_id: task.id,
                    metadata: {
                      task_type: task.task_type,
                      username: username,
                      repair: true,
                      repaired_at: new Date().toISOString()
                    }
                  });

                if (insertError) {
                  console.error(`Failed to create ticket: ${insertError.message}`);
                  throw insertError;
                }
              }
              console.log(`✅ Created ${ticketsNeeded} tickets for task ${task.id}`);
            }
          }

          repairs.push({
            user_id: userId,
            old_tickets: currentCount,
            new_tickets: expectedCount,
            created: ticketsToCreate
          });
        }

        // Update entry count to match tickets
        const { error: updateError } = await supabaseAdmin
          .from('raffle_entries')
          .update({ entry_count: expectedCount })
          .eq('raffle_id', raffleId)
          .eq('user_id', userId);

        if (updateError) {
          console.error(`Failed to update entry count: ${updateError.message}`);
          throw updateError;
        }
        console.log(`✅ Updated entry count to ${expectedCount} for user ${userId}`);
      } else {
        console.log(`✅ User ${userId} tickets are correct (${currentCount})`);
        
        // Still update entry count to ensure consistency
        const { error: updateError } = await supabaseAdmin
          .from('raffle_entries')
          .update({ entry_count: expectedCount })
          .eq('raffle_id', raffleId)
          .eq('user_id', userId);

        if (updateError) {
          console.error(`Failed to update entry count: ${updateError.message}`);
        }
      }
    }

    console.log(`🎉 Repair complete. Fixed ${repairs.length} users`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Ticket repair complete',
        repairs,
        total_fixed: repairs.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in repair-raffle-tickets:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
