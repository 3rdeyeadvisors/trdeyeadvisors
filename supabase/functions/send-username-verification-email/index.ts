import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UsernameVerificationRequest {
  email: string;
  raffle_title: string;
  instagram_username?: string;
  x_username?: string;
  task_type: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, raffle_title, instagram_username, x_username, task_type }: UsernameVerificationRequest = await req.json();

    console.log("Sending admin notification for username verification...");

    const platform = task_type === 'instagram' ? 'Instagram' : 'X';
    const username = instagram_username || x_username;

    // Send notification to admin only
    const adminEmail = "info@the3rdeyeadvisors.com";

    const adminEmailResponse = await resend.emails.send({
      from: "3rdeyeadvisors <noreply@the3rdeyeadvisors.com>",
      to: [adminEmail],
      subject: `🔍 New ${platform} Username Submitted - ${raffle_title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        </head>
        <body style="margin: 0; padding: 0; background-color: #030717;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0; padding: 0; background-color: #030717;" bgcolor="#030717">
            <tr>
              <td align="center" style="padding: 0; background-color: #030717;" bgcolor="#030717">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                  <tr>
                    <td style="padding: 32px 20px;">
                      
                      <!-- Header -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, hsl(217, 32%, 8%), hsl(217, 32%, 6%)); border-radius: 12px; border: 1px solid hsl(217, 32%, 15%);">
                        <tr>
                          <td style="text-align: center; padding: 48px 24px;">
                            <h1 style="color: hsl(217, 91%, 60%); font-size: 36px; margin: 0 0 8px 0; font-weight: 700; text-shadow: 0 0 24px hsla(217, 91%, 60%, 0.4);">3rdeyeadvisors</h1>
                            <p style="color: hsl(271, 91%, 75%); font-size: 18px; margin: 0; font-weight: 500;">Username Verification Request</p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Spacer -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height: 32px; line-height: 32px;"></td></tr></table>
                      
                      <!-- Content -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td>
                            <h2 style="color: hsl(217, 91%, 70%); font-size: 24px; margin: 0 0 16px 0; font-weight: 600;">
                              🔍 New ${platform} Username Submitted
                            </h2>
                            <p style="color: #F5F5F5; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                              A participant has submitted their ${platform} username for verification in the ${raffle_title}.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Verification Details -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, hsl(217, 32%, 10%), hsl(217, 32%, 12%)); border-radius: 12px; border: 1px solid hsl(217, 32%, 15%);">
                        <tr>
                          <td style="padding: 24px;">
                            <h3 style="color: hsl(217, 91%, 70%); margin: 0 0 16px 0; font-size: 18px;">Submission Details</h3>
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr><td style="color: #F5F5F5; line-height: 1.8; font-size: 15px; padding: 8px 0; border-bottom: 1px solid hsl(217, 32%, 15%);"><strong style="color: hsl(217, 91%, 70%);">User:</strong> ${email}</td></tr>
                              <tr><td style="color: #F5F5F5; line-height: 1.8; font-size: 15px; padding: 8px 0; border-bottom: 1px solid hsl(217, 32%, 15%);"><strong style="color: hsl(217, 91%, 70%);">Raffle:</strong> ${raffle_title}</td></tr>
                              <tr><td style="color: #F5F5F5; line-height: 1.8; font-size: 15px; padding: 8px 0; border-bottom: 1px solid hsl(217, 32%, 15%);"><strong style="color: hsl(217, 91%, 70%);">Platform:</strong> ${platform}</td></tr>
                              <tr><td style="color: #F5F5F5; line-height: 1.8; font-size: 15px; padding: 8px 0; border-bottom: 1px solid hsl(217, 32%, 15%);"><strong style="color: hsl(217, 91%, 70%);">Username:</strong> @${username}</td></tr>
                              <tr><td style="color: #F5F5F5; line-height: 1.8; font-size: 15px; padding: 8px 0;"><strong style="color: hsl(217, 91%, 70%);">Submitted:</strong> ${new Date().toLocaleString()}</td></tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Spacer -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height: 24px; line-height: 24px;"></td></tr></table>

                      <!-- Action Required -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, hsl(45, 100%, 10%), hsl(45, 100%, 12%)); border-left: 4px solid hsl(45, 100%, 50%); border-radius: 0 8px 8px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="color: hsl(45, 100%, 70%); margin: 0 0 8px 0; font-weight: 600; font-size: 16px;">⚡ Action Required</p>
                            <p style="color: #F5F5F5; margin: 0; font-size: 14px; line-height: 1.6;">
                              Please verify this username in the Admin Raffle Manager dashboard to award entries.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Spacer -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height: 32px; line-height: 32px;"></td></tr></table>

                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td align="center">
                            <a href="https://the3rdeyeadvisors.com/admin" style="display: inline-block; background: linear-gradient(45deg, hsl(217, 91%, 60%), hsl(271, 91%, 65%)); color: hsl(0, 0%, 98%); padding: 16px 36px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 0 30px hsla(217, 91%, 60%, 0.4), 0 8px 20px rgba(0,0,0,0.3);">
                              Go to Admin Dashboard →
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Spacer -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height: 32px; line-height: 32px;"></td></tr></table>
                      
                      <!-- Footer -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid hsl(217, 32%, 15%);">
                        <tr>
                          <td style="text-align: center; padding-top: 24px;">
                            <p style="color: hsl(215, 20%, 65%); font-size: 12px; margin: 0;">
                              Automated system notification from 3rdeyeadvisors
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

    console.log("Admin notification sent:", adminEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      admin_email_sent: true 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-username-verification-email:", error);
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
