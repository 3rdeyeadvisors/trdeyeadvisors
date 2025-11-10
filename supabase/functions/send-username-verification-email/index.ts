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

    console.log("Sending username verification emails...");

    const platform = task_type === 'instagram' ? 'Instagram' : 'X';
    const username = instagram_username || x_username;

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "3rdeyeadvisors <noreply@the3rdeyeadvisors.com>",
      to: [email],
      subject: `✅ ${platform} Username Submitted for Verification`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center;">
                      <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
                      <h1 style="color: #8B5CF6; margin: 0 0 10px 0; font-size: 28px;">Verification Submitted!</h1>
                      <p style="color: #666; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
                        Thank you for submitting your ${platform} username for verification.
                      </p>
                      
                      <div style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); padding: 25px; border-radius: 8px; margin: 30px 0;">
                        <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Submitted Username</p>
                        <p style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 0;">@${username}</p>
                      </div>
                      
                      <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                        Our team will review your ${platform} username shortly. Once verified, you'll receive +2 bonus entries to the raffle!
                      </p>
                      
                      <p style="color: #999; font-size: 12px; line-height: 1.4; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e5e5;">
                        <strong>What's next?</strong><br>
                        We'll verify that you're following @3rdeyeadvisors on ${platform}. This usually takes 24-48 hours. You'll see the verification status update in your raffle dashboard.
                      </p>
                      
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a href="https://the3rdeyeadvisors.com/raffles" style="display: inline-block; background: #8B5CF6; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
                              View Your Entries
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #8B5CF6; font-size: 16px; font-weight: 600; margin: 30px 0 5px 0;">
                        Awareness is advantage.
                      </p>
                      <p style="color: #999; font-size: 14px; margin: 0;">
                        — 3rdeyeadvisors
                      </p>
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

    console.log("User confirmation email sent:", userEmailResponse);

    // Send notification to admin
    const adminEmail = "3rdeyeadvisors@gmail.com";

    const adminEmailResponse = await resend.emails.send({
      from: "3rdeyeadvisors <noreply@the3rdeyeadvisors.com>",
      to: [adminEmail],
      subject: `🔍 New ${platform} Username Submitted - ${raffle_title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8B5CF6; margin-bottom: 20px;">New Username Verification Request</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>User Email:</strong> ${email}</p>
            <p style="margin: 8px 0;"><strong>Raffle:</strong> ${raffle_title}</p>
            <p style="margin: 8px 0;"><strong>Platform:</strong> ${platform}</p>
            <p style="margin: 8px 0;"><strong>Username:</strong> @${username}</p>
            <p style="margin: 8px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-weight: 600; color: #856404;">Action Required</p>
            <p style="margin: 8px 0 0 0; color: #856404;">Verify this username in the Admin Raffle Manager dashboard.</p>
          </div>
          
          <a href="https://the3rdeyeadvisors.com/admin" style="display: inline-block; background: #8B5CF6; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 20px;">
            Go to Admin Dashboard
          </a>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px; border-top: 1px solid #e5e5e5; padding-top: 20px;">
            — The 3rdeyeadvisors System
          </p>
        </div>
      `,
    });

    console.log("Admin notification sent:", adminEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      user_email_sent: true,
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
