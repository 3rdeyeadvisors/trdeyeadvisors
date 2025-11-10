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

    const { taskIds, skipEmail } = await req.json();

    if (!taskIds || !Array.isArray(taskIds)) {
      throw new Error('taskIds must be an array');
    }

    console.log(`Admin ${user.email} manually marking ${taskIds.length} tasks as verified (skipEmail: ${skipEmail})`);

    // Update tasks - use service role to bypass RLS
    const { data: updatedTasks, error: updateError } = await supabaseAdmin
      .from('raffle_tasks')
      .update({
        verification_status: 'verified',
        completed: true,
        verified_at: new Date().toISOString(),
      })
      .in('id', taskIds)
      .select('id, user_id, task_type, raffle_id');

    if (updateError) {
      console.error('Error updating tasks:', updateError);
      throw updateError;
    }

    console.log(`Successfully updated ${updatedTasks?.length || 0} tasks`);

    // Update entry counts for each user
    if (updatedTasks && updatedTasks.length > 0) {
      for (const task of updatedTasks) {
        const { data: currentEntry } = await supabaseAdmin
          .from('raffle_entries')
          .select('entry_count')
          .eq('raffle_id', task.raffle_id)
          .eq('user_id', task.user_id)
          .single();

        await supabaseAdmin
          .from('raffle_entries')
          .upsert({
            raffle_id: task.raffle_id,
            user_id: task.user_id,
            entry_count: (currentEntry?.entry_count || 0) + 2,
          }, {
            onConflict: 'raffle_id,user_id'
          });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        updated: updatedTasks?.length || 0,
        message: 'Tasks marked as verified without sending emails'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in admin-mark-verified:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
