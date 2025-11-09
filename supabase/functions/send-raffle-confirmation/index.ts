import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RaffleConfirmationRequest {
  email: string;
  first_name?: string;
  raffle_title: string;
  prize: string;
  prize_amount: number;
  end_date: string;
  entry_count: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, first_name, raffle_title, prize, prize_amount, end_date, entry_count }: RaffleConfirmationRequest = await req.json();

    console.log("Sending raffle confirmation email to:", email);

    const emailResponse = await resend.emails.send({
      from: "3rdeyeadvisors <noreply@the3rdeyeadvisors.com>",
      to: [email],
      subject: "You're officially entered — 3rdeyeadvisors Learn-to-Earn Raffle 🎟",
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
                      <h1 style="color: #8B5CF6; margin: 0 0 20px 0; font-family: Arial, sans-serif;">You're In! 🎉</h1>
                      
                      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; font-family: Arial, sans-serif; color: #333333;">
                        Hi ${first_name || 'there'},
                      </p>
                      
                      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; font-family: Arial, sans-serif; color: #333333;">
                        You've successfully joined our <strong>Learn-to-Earn Raffle</strong> — welcome to the next evolution of financial consciousness.
                      </p>
                      
                      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; font-family: Arial, sans-serif; color: #333333;">
                        Each step you took — learning, sharing, and engaging — earns you energy in return. The system remembers. 🌐
                      </p>
                      
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); border-radius: 12px; margin: 30px 0;">
                        <tr>
                          <td style="padding: 30px; text-align: center;">
                            <h2 style="margin: 0 0 20px 0; color: #ffffff; font-family: Arial, sans-serif;">Your Entry Details</h2>
                            <div style="font-size: 48px; font-weight: bold; margin: 20px 0; color: #ffffff;">🪙 $${prize_amount}</div>
                            <p style="font-size: 20px; margin: 10px 0; color: #ffffff; font-family: Arial, sans-serif;">Prize: ${prize}</p>
                            <p style="font-size: 18px; margin: 10px 0; color: #ffffff; font-family: Arial, sans-serif;">Your Entries: ${entry_count}</p>
                            <p style="font-size: 16px; margin: 10px 0; color: #ffffff; font-family: Arial, sans-serif;">⏰ Raffle Ends: ${new Date(end_date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              timeZoneName: 'short'
                            })}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 40px 0; font-family: Arial, sans-serif; color: #333333;">
                        Stay tuned for updates, and keep sharing your referral link for extra entries!
                      </p>
                      
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
                              Want more entries? Share your referral link from your <a href="https://the3rdeyeadvisors.com/raffles" style="color: #8B5CF6; text-decoration: none;">raffle dashboard</a>.
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

    console.log("Raffle confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-raffle-confirmation:", error);
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
