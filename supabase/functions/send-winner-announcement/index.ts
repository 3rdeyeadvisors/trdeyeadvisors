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
        from: "3rdeyeadvisors <info@the3rdeyeadvisors.com>",
        to: [winnerEmail],
        subject: `🎉 Congratulations! You Won the ${raffle.title}!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
            </style>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 50px 40px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td align="center" style="padding-bottom: 30px;">
                              <div style="font-size: 72px; margin-bottom: 20px;">🎉🏆🎉</div>
                              <h1 style="color: #8B5CF6; margin: 0; font-size: 40px; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                YOU WON!
                              </h1>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="font-size: 18px; line-height: 1.6; text-align: center; margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1f2937;">
                          Hi <strong>${winnerName}</strong>,
                        </p>
                        
                        <p style="font-size: 18px; line-height: 1.6; text-align: center; margin: 0 0 30px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1f2937;">
                          Congratulations! You've won the <strong style="color: #8B5CF6;">${raffle.title}</strong>!
                        </p>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #10B981; border-radius: 12px; margin: 30px 0;">
                          <tr>
                            <td style="padding: 40px; text-align: center;">
                              <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 28px; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                Your Prize
                              </h2>
                              <div style="font-size: 64px; font-weight: 700; margin: 20px 0; color: #ffffff;">🪙 $${raffle.prize_amount}</div>
                              <p style="font-size: 24px; margin: 10px 0; font-weight: 700; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                ${raffle.prize}
                              </p>
                            </td>
                          </tr>
                        </table>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FEF3C7; border-radius: 8px; border-left: 4px solid #F59E0B; margin: 30px 0;">
                          <tr>
                            <td style="padding: 24px;">
                              <h3 style="color: #92400E; margin: 0 0 12px 0; font-size: 18px; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                📬 Next Steps
                              </h3>
                              <p style="font-size: 16px; line-height: 1.6; margin: 0; color: #78350F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                Our team will contact you directly within 24-48 hours to arrange delivery of your prize. Please check your email inbox (and spam folder) for our message.
                              </p>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="font-size: 16px; line-height: 1.6; text-align: center; margin: 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1f2937;">
                          Thank you for being part of our Learn-to-Earn community. Your commitment to learning is what makes this possible!
                        </p>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 2px solid #e5e7eb; padding-top: 24px; margin-top: 20px;">
                          <tr>
                            <td align="center">
                              <p style="font-size: 18px; font-weight: 700; color: #8B5CF6; margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                Awareness is advantage.
                              </p>
                              <p style="font-size: 14px; color: #6b7280; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
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
        from: "3rdeyeadvisors <info@the3rdeyeadvisors.com>",
        to: [participant.email],
        subject: `🏆 ${raffle.title} Winner Announced!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
            </style>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 50px 40px;">
                        <h1 style="color: #8B5CF6; margin: 0 0 24px 0; font-size: 32px; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                          We Have a Winner! 🎉
                        </h1>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1f2937;">
                          Hi <strong>${participant.display_name || 'there'}</strong>,
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 32px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1f2937;">
                          The <strong style="color: #8B5CF6;">${raffle.title}</strong> has concluded and we're excited to announce the winner!
                        </p>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #8B5CF6; border-radius: 12px; margin: 30px 0;">
                          <tr>
                            <td style="padding: 40px 30px; text-align: center;">
                              <h2 style="margin: 0 0 24px 0; color: #ffffff; font-size: 24px; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                Winner
                              </h2>
                              <div style="font-size: 56px; margin: 20px 0;">🏆</div>
                              <p style="font-size: 26px; font-weight: 700; margin: 16px 0; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                ${winnerName}
                              </p>
                              <p style="font-size: 18px; margin: 16px 0; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                Won <strong>$${raffle.prize_amount}</strong> in ${raffle.prize}
                              </p>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 32px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1f2937;">
                          While you didn't win this time, your learning journey continues to be valuable. Every course you complete, every discussion you join, builds your understanding of DeFi.
                        </p>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 8px; margin: 30px 0;">
                          <tr>
                            <td style="padding: 24px;">
                              <h3 style="color: #8B5CF6; margin: 0 0 16px 0; font-size: 18px; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                Stay Tuned!
                              </h3>
                              <p style="font-size: 16px; line-height: 1.8; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1f2937;">
                                🎟 More Learn-to-Earn raffles are coming<br>
                                📚 Keep learning and earning entries<br>
                                🔔 Follow us on <a href="https://instagram.com/3rdeyeadvisors" style="color: #8B5CF6; text-decoration: none; font-weight: 600;">Instagram</a> and <a href="https://x.com/3rdeyeadvisors" style="color: #8B5CF6; text-decoration: none; font-weight: 600;">X</a> for updates
                              </p>
                            </td>
                          </tr>
                        </table>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td align="center" style="padding: 30px 0 40px 0;">
                              <a href="https://the3rdeyeadvisors.com/courses" style="display: inline-block; background-color: #8B5CF6; color: #ffffff; padding: 18px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                Continue Learning →
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 2px solid #e5e7eb; padding-top: 24px; margin: 20px 0 30px 0;">
                          <tr>
                            <td align="center">
                              <p style="font-size: 18px; font-weight: 700; color: #8B5CF6; margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                Awareness is advantage.
                              </p>
                              <p style="font-size: 14px; color: #6b7280; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                — The 3rdeyeadvisors Team
                              </p>
                            </td>
                          </tr>
                        </table>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 8px;">
                          <tr>
                            <td style="padding: 20px; text-align: center;">
                              <p style="font-size: 14px; color: #6b7280; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                View all past winners on our <a href="https://the3rdeyeadvisors.com/raffle-history" style="color: #8B5CF6; text-decoration: none; font-weight: 600;">Raffle History</a> page.
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
