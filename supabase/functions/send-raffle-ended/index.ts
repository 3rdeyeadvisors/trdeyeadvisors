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
        from: "3rdeyeadvisors <info@the3rdeyeadvisors.com>",
        to: [participant.email],
        subject: `⏰ ${raffle.title} Has Ended — Winner Coming Soon!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f5f5f5;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff;">
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h1 style="color: #8B5CF6; margin: 0 0 20px 0; font-family: Arial, sans-serif;">The Wait is Almost Over ⏰</h1>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; font-family: Arial, sans-serif; color: #333333;">
                          Hi ${participant.display_name || 'there'},
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; font-family: Arial, sans-serif; color: #333333;">
                          The <strong>${raffle.title}</strong> has officially ended. Thank you for participating and learning with us!
                        </p>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); border-radius: 12px; margin: 30px 0;">
                          <tr>
                            <td style="padding: 30px; text-align: center;">
                              <h2 style="margin: 0 0 20px 0; color: #ffffff; font-family: Arial, sans-serif;">Raffle Complete</h2>
                              <div style="font-size: 48px; font-weight: bold; margin: 20px 0; color: #ffffff;">🪙 $${raffle.prize_amount}</div>
                              <p style="font-size: 20px; margin: 10px 0; color: #ffffff; font-family: Arial, sans-serif;">Prize: ${raffle.prize}</p>
                              <p style="font-size: 16px; margin: 20px 0; opacity: 0.9; color: #ffffff; font-family: Arial, sans-serif;">
                                ${raffle.description}
                              </p>
                            </td>
                          </tr>
                        </table>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f9f9f9; border-radius: 8px; margin: 30px 0;">
                          <tr>
                            <td style="padding: 20px;">
                              <h3 style="color: #8B5CF6; margin: 0 0 16px 0; font-family: Arial, sans-serif;">What's Next?</h3>
                              <p style="font-size: 16px; line-height: 1.6; margin: 0; font-family: Arial, sans-serif; color: #333333;">
                                🎯 We're currently verifying all entries and selecting the winner<br>
                                📧 The winner will be announced via email soon<br>
                                🌐 All results will be visible on our <a href="https://the3rdeyeadvisors.com/raffle-history" style="color: #8B5CF6; text-decoration: none;">Raffle History</a> page
                              </p>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 40px 0; font-family: Arial, sans-serif; color: #333333;">
                          Even if you don't win this time, your learning journey continues to pay dividends. Keep exploring DeFi with us!
                        </p>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td align="center" style="padding: 0 0 40px 0;">
                              <a href="https://the3rdeyeadvisors.com/courses" style="display: inline-block; background: #8B5CF6; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; font-family: Arial, sans-serif;">
                                Continue Learning →
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e5e5e5; padding-top: 20px;">
                          <tr>
                            <td align="center">
                              <p style="font-size: 18px; font-weight: bold; color: #8B5CF6; margin: 0 0 8px 0; font-family: Arial, sans-serif;">
                                Awareness is advantage.
                              </p>
                              <p style="font-size: 14px; color: #666666; margin: 0; font-family: Arial, sans-serif;">
                                — The 3rdeyeadvisors Team
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
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
