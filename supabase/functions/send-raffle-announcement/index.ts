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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Fetching subscribers for raffle announcement...");

    // Fetch all subscribers
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('email, name');

    if (error) throw error;

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No subscribers found" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending raffle announcement to ${subscribers.length} subscribers...`);

    // Send emails in batches
    const emailPromises = subscribers.map(subscriber => 
      resend.emails.send({
        from: "3rdeyeadvisors <noreply@the3rdeyeadvisors.com>",
        to: [subscriber.email],
        subject: "🎟 Learn to Earn — Join Our $50 Bitcoin Raffle Now",
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
                        <h1 style="color: #6D28D9; margin: 0 0 20px 0; font-family: Arial, sans-serif;">The Future Rewards Learning 🚀</h1>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; font-family: Arial, sans-serif; color: #1a1a1a;">
                          Hi ${subscriber.name || 'there'},
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; font-family: Arial, sans-serif; color: #1a1a1a;">
                          The future of finance is decentralized — and now, learning it pays.
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; font-family: Arial, sans-serif; color: #1a1a1a;">
                          <strong>3rdeyeadvisors</strong> has officially launched the <strong>Learn-to-Earn Raffle</strong>, rewarding our community for learning and engaging in DeFi education.
                        </p>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); border-radius: 12px; margin: 30px 0;">
                          <tr>
                            <td style="padding: 30px; text-align: center;">
                              <h2 style="margin: 0 0 20px 0; color: #ffffff; font-family: Arial, sans-serif;">How to Enter</h2>
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="font-size: 16px; line-height: 2; color: #ffffff; font-family: Arial, sans-serif; text-align: left; padding: 0 20px;">
                                    ✅ Follow us on <strong>Instagram</strong> @3rdeyeadvisors<br>
                                    ✅ Follow us on <strong>X</strong> @3rdeyeadvisors<br>
                                    ✅ Subscribe to the newsletter (you're already in! 🎉)<br>
                                    ✅ Complete the <strong>DeFi Foundations</strong> and <strong>Staying Safe with DeFi</strong> courses<br>
                                    ✅ Rate the courses and join the discussion
                                  </td>
                                </tr>
                              </table>
                              
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                                <tr>
                                  <td style="padding: 20px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                                    <p style="font-size: 18px; margin: 0; color: #ffffff; font-family: Arial, sans-serif;">💡 <strong>Bonus:</strong> Each referral link shared from your dashboard earns extra entries when someone signs up.</p>
                                  </td>
                                </tr>
                              </table>
                              
                              <div style="font-size: 48px; font-weight: bold; margin: 20px 0; color: #ffffff;">🪙 $50</div>
                              <p style="font-size: 20px; margin: 10px 0; color: #ffffff; font-family: Arial, sans-serif;">Prize: Bitcoin</p>
                              <p style="font-size: 16px; margin: 10px 0; color: #ffffff; font-family: Arial, sans-serif;">🕒 Active Period: November 10–23, 2025</p>
                            </td>
                          </tr>
                        </table>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td align="center" style="padding: 40px 0;">
                              <a href="https://the3rdeyeadvisors.com/raffles" style="display: inline-block; background: #8B5CF6; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; font-family: Arial, sans-serif;">
                                Join the Raffle Now →
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="font-size: 16px; line-height: 1.6; font-style: italic; text-align: center; color: #4a4a4a; margin: 0 0 40px 0; font-family: Arial, sans-serif;">
                          The more you learn, the more you earn — because awareness is the real currency.
                        </p>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e5e5e5; padding-top: 20px;">
                          <tr>
                            <td align="center">
                              <p style="font-size: 18px; font-weight: bold; color: #6D28D9; margin: 0 0 8px 0; font-family: Arial, sans-serif;">
                                Awareness is advantage.
                              </p>
                              <p style="font-size: 14px; color: #4a4a4a; margin: 0; font-family: Arial, sans-serif;">
                                — 3rdeyeadvisors
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

    console.log(`Raffle announcement sent: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successful, 
        failed: failed,
        total: subscribers.length 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-raffle-announcement:", error);
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
