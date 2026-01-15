import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Point values for different actions (matching the frontend POINTS_VALUES)
const POINT_ACTIONS = [
  { type: 'module_completion', points: 25 },
  { type: 'quiz_passed', points: 50 },
  { type: 'daily_login', points: 10 },
  { type: 'tutorial_completion', points: 15 },
  { type: 'course_completion', points: 100 },
];

// Get random number between min and max
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pick random action with weighted probability
function pickRandomAction(): { type: string; points: number } {
  const weights = [40, 15, 30, 12, 3]; // Probability weights
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < POINT_ACTIONS.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return POINT_ACTIONS[i];
    }
  }
  return POINT_ACTIONS[0];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    console.log(`Running bot simulation for month: ${currentMonth}`);

    // Get the top REAL user's points (excluding bots)
    const { data: topRealUser, error: topUserError } = await supabaseAdmin
      .from('user_points_monthly')
      .select(`
        user_id,
        total_points,
        profiles!inner(is_bot)
      `)
      .eq('month_year', currentMonth)
      .eq('profiles.is_bot', false)
      .order('total_points', { ascending: false })
      .limit(1)
      .single();

    if (topUserError && topUserError.code !== 'PGRST116') {
      console.error('Error fetching top user:', topUserError);
    }

    const topRealPoints = topRealUser?.total_points || 100; // Default minimum if no real users
    console.log(`Top real user has ${topRealPoints} points`);

    // Get all bots with their configs
    const { data: bots, error: botsError } = await supabaseAdmin
      .from('bot_config')
      .select(`
        user_id,
        personality_type,
        max_point_percentage,
        profiles!inner(display_name, is_bot)
      `)
      .eq('profiles.is_bot', true);

    if (botsError) {
      console.error('Error fetching bots:', botsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch bots' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!bots || bots.length === 0) {
      return new Response(JSON.stringify({ message: 'No bots found. Run seed-bot-users first.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Processing ${bots.length} bots...`);
    const results: { name: string; pointsAwarded: number; currentTotal: number }[] = [];

    for (const bot of bots) {
      const botName = bot.profiles?.display_name || 'Unknown Bot';
      const maxPoints = Math.floor(topRealPoints * (bot.max_point_percentage / 100));

      // Get bot's current points for this month
      const { data: currentPoints } = await supabaseAdmin
        .from('user_points_monthly')
        .select('total_points')
        .eq('user_id', bot.user_id)
        .eq('month_year', currentMonth)
        .single();

      const botCurrentPoints = currentPoints?.total_points || 0;
      
      // Calculate how many points the bot can still earn
      const pointsRemaining = maxPoints - botCurrentPoints;
      
      if (pointsRemaining <= 0) {
        console.log(`Bot ${botName} at cap (${botCurrentPoints}/${maxPoints}), skipping...`);
        results.push({ name: botName, pointsAwarded: 0, currentTotal: botCurrentPoints });
        continue;
      }

      // Determine activity level based on personality
      let activityChance: number;
      let maxActionsPerRun: number;
      
      switch (bot.personality_type) {
        case 'aggressive':
          activityChance = 0.9; // 90% chance to be active
          maxActionsPerRun = randomBetween(3, 5);
          break;
        case 'steady':
          activityChance = 0.7;
          maxActionsPerRun = randomBetween(2, 4);
          break;
        case 'casual':
          activityChance = 0.5;
          maxActionsPerRun = randomBetween(1, 3);
          break;
        case 'low_activity':
        default:
          activityChance = 0.3;
          maxActionsPerRun = randomBetween(1, 2);
          break;
      }

      // Random chance to skip this bot entirely (adds natural variation)
      if (Math.random() > activityChance) {
        console.log(`Bot ${botName} not active this run`);
        results.push({ name: botName, pointsAwarded: 0, currentTotal: botCurrentPoints });
        continue;
      }

      let totalPointsAwarded = 0;
      const numActions = randomBetween(1, maxActionsPerRun);

      for (let i = 0; i < numActions; i++) {
        const action = pickRandomAction();
        
        // Don't exceed the bot's cap
        if (botCurrentPoints + totalPointsAwarded + action.points > maxPoints) {
          console.log(`Bot ${botName} would exceed cap, stopping actions`);
          break;
        }

        // Generate a unique action ID to prevent duplicates
        const actionId = `bot-${bot.user_id}-${Date.now()}-${i}`;

        // Award points using the database function
        const { data: awardResult, error: awardError } = await supabaseAdmin
          .rpc('award_user_points', {
            _user_id: bot.user_id,
            _points: action.points,
            _action_type: action.type,
            _action_id: actionId,
            _metadata: { simulated: true, run_timestamp: new Date().toISOString() }
          });

        if (awardError) {
          console.error(`Error awarding points to ${botName}:`, awardError);
        } else if (awardResult?.[0]?.success) {
          totalPointsAwarded += awardResult[0].points_awarded;
        }

        // Small delay to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      const newTotal = botCurrentPoints + totalPointsAwarded;
      console.log(`Bot ${botName}: awarded ${totalPointsAwarded} points, new total: ${newTotal}/${maxPoints}`);
      results.push({ name: botName, pointsAwarded: totalPointsAwarded, currentTotal: newTotal });
    }

    const totalAwarded = results.reduce((sum, r) => sum + r.pointsAwarded, 0);
    const activeBots = results.filter(r => r.pointsAwarded > 0).length;

    return new Response(JSON.stringify({
      success: true,
      message: `Simulation complete. ${activeBots} bots active, ${totalAwarded} total points awarded.`,
      topRealUserPoints: topRealPoints,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in simulate-bot-activity:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
