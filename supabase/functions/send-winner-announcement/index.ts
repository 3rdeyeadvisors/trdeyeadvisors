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

interface WinnerAnnouncementRequest {
  raffle_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { raffle_id }: WinnerAnnouncementRequest = await req.json();
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Fetching raffle details for winner announcement:", raffle_id);

    // Get raffle details with winner info
    const { data: raffle, error: raffleError } = await supabase
      .from('raffles')
      .select('*')
      .eq('id', raffle_id)
      .single();

    if (raffleError) throw raffleError;

    if (!raffle.winner_user_id) {
      throw new Error("No winner selected for this raffle");
    }

    // Get winner profile and email
    const { data: winnerProfile, error: winnerError } = await supabase
      .from('profiles')
      .select('display_name, user_id')
      .eq('user_id', raffle.winner_user_id)
      .single();

    if (winnerError) throw winnerError;

    const { data: users } = await supabase
      .rpc('get_user_emails_with_profiles');

    const winner = users?.find((u: any) => u.user_id === raffle.winner_user_id);
    const winnerEmail = winner?.email;
    const winnerName = winnerProfile?.display_name || 'Winner';

    // Get all participants
    const { data: entries, error: entriesError } = await supabase
      .from('raffle_entries')
      .select('user_id')
      .eq('raffle_id', raffle_id);

    if (entriesError) throw entriesError;

    const uniqueUserIds = [...new Set(entries?.map(e => e.user_id) || [])];
    const participants = users?.filter((u: any) => uniqueUserIds.includes(u.user_id)) || [];

    console.log(`Sending winner announcement to ${participants.length} participants...`);

    // Send winner notification email
    if (winnerEmail) {
      await resend.emails.send({
        from: "3rdeyeadvisors <noreply@the3rdeyeadvisors.com>",
        to: [winnerEmail],
        subject: `🎉 Congratulations! You Won the ${raffle.title}!`,
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
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td align="center" style="padding-bottom: 30px;">
                              <div style="font-size: 72px; margin-bottom: 20px;">🎉🏆🎉</div>
                              <h1 style="color: #8B5CF6; margin: 0; font-size: 36px; font-family: Arial, sans-serif;">YOU WON!</h1>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="font-size: 18px; line-height: 1.6; text-align: center; margin: 0 0 16px 0; font-family: Arial, sans-serif; color: #333333;">
                          Hi ${winnerName},
                        </p>
                        
                        <p style="font-size: 18px; line-height: 1.6; text-align: center; margin: 0 0 30px 0; font-family: Arial, sans-serif; color: #333333;">
                          Congratulations! You've won the <strong>${raffle.title}</strong>!
                        </p>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 12px; margin: 30px 0;">
                          <tr>
                            <td style="padding: 40px; text-align: center;">
                              <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 28px; font-family: Arial, sans-serif;">Your Prize</h2>
                              <div style="font-size: 64px; font-weight: bold; margin: 20px 0; color: #ffffff;">🪙 $${raffle.prize_amount}</div>
                              <p style="font-size: 24px; margin: 10px 0; font-weight: bold; color: #ffffff; font-family: Arial, sans-serif;">${raffle.prize}</p>
                            </td>
                          </tr>
                        </table>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #FEF3C7; border-radius: 8px; border-left: 4px solid #F59E0B; margin: 30px 0;">
                          <tr>
                            <td style="padding: 20px;">
                              <h3 style="color: #92400E; margin: 0 0 12px 0; font-size: 18px; font-family: Arial, sans-serif;">📬 Next Steps</h3>
                              <p style="font-size: 16px; line-height: 1.6; margin: 0; color: #78350F; font-family: Arial, sans-serif;">
                                Our team will contact you directly within 24-48 hours to arrange delivery of your prize. Please check your email inbox (and spam folder) for our message.
                              </p>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="font-size: 16px; line-height: 1.6; text-align: center; margin: 40px 0; font-family: Arial, sans-serif; color: #333333;">
                          Thank you for being part of our Learn-to-Earn community. Your commitment to learning is what makes this possible!
                        </p>
                        
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
      });
    }

    // Send announcement to all other participants
    const otherParticipants = participants.filter((p: any) => p.user_id !== raffle.winner_user_id);
    
    const emailPromises = otherParticipants.map((participant: any) => 
      resend.emails.send({
        from: "3rdeyeadvisors <noreply@the3rdeyeadvisors.com>",
        to: [participant.email],
        subject: `🏆 ${raffle.title} Winner Announced!`,
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
                        <h1 style="color: #8B5CF6; margin: 0 0 20px 0; font-family: Arial, sans-serif;">We Have a Winner! 🎉</h1>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; font-family: Arial, sans-serif; color: #333333;">
                          Hi ${participant.display_name || 'there'},
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; font-family: Arial, sans-serif; color: #333333;">
                          The <strong>${raffle.title}</strong> has concluded and we're excited to announce the winner!
                        </p>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); border-radius: 12px; margin: 30px 0;">
                          <tr>
                            <td style="padding: 30px; text-align: center;">
                              <h2 style="margin: 0 0 20px 0; color: #ffffff; font-family: Arial, sans-serif;">Winner</h2>
                              <div style="font-size: 48px; margin: 20px 0;">🏆</div>
                              <p style="font-size: 24px; font-weight: bold; margin: 10px 0; color: #ffffff; font-family: Arial, sans-serif;">${winnerName}</p>
                              <p style="font-size: 20px; margin: 20px 0; opacity: 0.9; color: #ffffff; font-family: Arial, sans-serif;">Won $${raffle.prize_amount} in ${raffle.prize}</p>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; font-family: Arial, sans-serif; color: #333333;">
                          While you didn't win this time, your learning journey continues to be valuable. Every course you complete, every discussion you join, builds your understanding of DeFi.
                        </p>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f9f9f9; border-radius: 8px; margin: 30px 0;">
                          <tr>
                            <td style="padding: 20px;">
                              <h3 style="color: #8B5CF6; margin: 0 0 16px 0; font-family: Arial, sans-serif;">Stay Tuned!</h3>
                              <p style="font-size: 16px; line-height: 1.6; margin: 0; font-family: Arial, sans-serif; color: #333333;">
                                🎟 More Learn-to-Earn raffles are coming<br>
                                📚 Keep learning and earning entries<br>
                                🔔 Follow us on <a href="https://instagram.com/3rdeyeadvisors" style="color: #8B5CF6; text-decoration: none;">Instagram</a> and <a href="https://x.com/3rdeyeadvisors" style="color: #8B5CF6; text-decoration: none;">X</a> for updates
                              </p>
                            </td>
                          </tr>
                        </table>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td align="center" style="padding: 0 0 40px 0;">
                              <a href="https://the3rdeyeadvisors.com/courses" style="display: inline-block; background: #8B5CF6; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; font-family: Arial, sans-serif;">
                                Continue Learning →
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e5e5e5; padding-top: 20px; margin-bottom: 30px;">
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
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f9f9f9; border-radius: 8px;">
                          <tr>
                            <td style="padding: 20px; text-align: center;">
                              <p style="font-size: 14px; color: #666666; margin: 0; font-family: Arial, sans-serif;">
                                View all past winners on our <a href="https://the3rdeyeadvisors.com/raffle-history" style="color: #8B5CF6; text-decoration: none;">Raffle History</a> page.
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

    console.log(`Winner announcement sent: ${successful + (winnerEmail ? 1 : 0)} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successful + (winnerEmail ? 1 : 0), 
        failed: failed,
        total: participants.length 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-winner-announcement:", error);
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
