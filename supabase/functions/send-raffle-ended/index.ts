import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RaffleEndedRequest {
  raffle_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { raffle_id }: RaffleEndedRequest = await req.json();
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Fetching raffle details for ended notification:", raffle_id);

    // Get raffle details
    const { data: raffle, error: raffleError } = await supabase
      .from('raffles')
      .select('*')
      .eq('id', raffle_id)
      .single();

    if (raffleError) throw raffleError;

    // Get all participants (unique users who entered)
    const { data: entries, error: entriesError } = await supabase
      .from('raffle_entries')
      .select('user_id')
      .eq('raffle_id', raffle_id);

    if (entriesError) throw entriesError;

    if (!entries || entries.length === 0) {
      return new Response(
        JSON.stringify({ message: "No participants found" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get unique user IDs
    const uniqueUserIds = [...new Set(entries.map(e => e.user_id))];

    // Get user emails from auth.users via profiles
    const { data: users, error: usersError } = await supabase
      .rpc('get_user_emails_with_profiles');

    if (usersError) throw usersError;

    // Filter to only participants
    const participants = users.filter((u: any) => uniqueUserIds.includes(u.user_id));

    console.log(`Sending raffle ended notification to ${participants.length} participants...`);

    // Send emails in batches
    const emailPromises = participants.map((participant: any) => 
      resend.emails.send({
        from: "3rdeyeadvisors <noreply@the3rdeyeadvisors.com>",
        to: [participant.email],
        subject: `⏰ ${raffle.title} Has Ended — Winner Coming Soon!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #8B5CF6; margin-bottom: 20px;">The Wait is Almost Over ⏰</h1>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Hi ${participant.display_name || 'there'},
            </p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              The <strong>${raffle.title}</strong> has officially ended. Thank you for participating and learning with us!
            </p>
            
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
              <h2 style="margin: 0 0 20px 0; color: white;">Raffle Complete</h2>
              <div style="font-size: 48px; font-weight: bold; margin: 20px 0;">🪙 $${raffle.prize_amount}</div>
              <p style="font-size: 20px; margin: 10px 0;">Prize: ${raffle.prize}</p>
              <p style="font-size: 16px; margin: 20px 0; opacity: 0.9;">
                ${raffle.description}
              </p>
            </div>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #8B5CF6; margin-top: 0;">What's Next?</h3>
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                🎯 We're currently verifying all entries and selecting the winner<br>
                📧 The winner will be announced via email soon<br>
                🌐 All results will be visible on our <a href="https://the3rdeyeadvisors.com/raffle-history" style="color: #8B5CF6; text-decoration: none;">Raffle History</a> page
              </p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Even if you don't win this time, your learning journey continues to pay dividends. Keep exploring DeFi with us!
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://the3rdeyeadvisors.com/courses" style="display: inline-block; background: #8B5CF6; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px;">
                Continue Learning →
              </a>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center;">
              <p style="font-size: 18px; font-weight: bold; color: #8B5CF6;">
                Awareness is advantage.
              </p>
              <p style="font-size: 14px; color: #666;">
                — The 3rdeyeadvisors Team
              </p>
            </div>
          </div>
        `,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Raffle ended notification sent: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successful, 
        failed: failed,
        total: participants.length 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-raffle-ended:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
