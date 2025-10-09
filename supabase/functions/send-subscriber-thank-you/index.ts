import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscriberThankYouPayload {
  table: string;
  record: {
    id: string;
    email: string;
    name?: string;
    created_at: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: SubscriberThankYouPayload = await req.json();
    console.log('Received subscriber thank you payload:', payload);

    const { record } = payload;
    const email = record.email;
    const name = record.name || 'Valued Subscriber';
    const firstName = name.split(' ')[0] || 'there';
    
    // Send personalized thank you email to the subscriber
    const emailResponse = await resend.emails.send({
      from: "3rdeyeadvisors <info@the3rdeyeadvisors.com>",
      to: [email],
      subject: "🙏 Thank You for Subscribing - 3rdeyeadvisors Newsletter",
      html: `
        <!DOCTYPE html>
        <html style="margin: 0; padding: 0;" bgcolor="#0a0f1e">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style type="text/css">
            * { margin: 0; padding: 0; }
            body, html { background-color: #0a0f1e !important; }
          </style>
        </head>
        <body style="margin: 0 !important; padding: 0 !important; background-color: #0a0f1e !important;" bgcolor="#0a0f1e">
          <div style="background-color: #0a0f1e; margin: 0; padding: 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0a0f1e" style="margin: 0; padding: 0; background-color: #0a0f1e;">
            <tr>
              <td align="center" bgcolor="#0a0f1e" style="padding: 0; margin: 0; background-color: #0a0f1e;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; background-color: #0a0f1e; color: #fafafa;">
                  <tr>
                    <td style="padding: 32px 20px; background-color: #0a0f1e;">
                      
                      <!-- Cosmic Header -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="text-align: center; padding: 48px 24px; background: linear-gradient(135deg, hsl(217, 32%, 8%), hsl(217, 32%, 6%)); border-radius: 12px; margin-bottom: 32px; border: 1px solid hsl(217, 32%, 15%);">
                            <h1 style="color: hsl(217, 91%, 60%); font-size: 36px; margin: 0 0 8px 0; font-weight: 700; text-shadow: 0 0 24px hsla(217, 91%, 60%, 0.4);">3rdeyeadvisors</h1>
                            <p style="color: hsl(271, 91%, 75%); font-size: 18px; margin: 0; font-weight: 500;">Conscious DeFi Education</p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Spacer -->
                      <div style="height: 32px;"></div>
                      
                      <!-- Welcome Message -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="text-align: center; padding: 0 20px;">
                            <h2 style="color: hsl(0, 0%, 98%); font-size: 28px; margin: 0 0 16px 0; font-weight: 600;">
                              Welcome, ${firstName}! 🙏
                            </h2>
                            <p style="color: hsl(0, 0%, 90%); font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
                              You are now part of our conscious DeFi community. Thank you for joining us on this journey of financial awareness and decentralized education.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Spacer -->
                      <div style="height: 28px;"></div>

                      <!-- What's Coming Section -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="background: linear-gradient(135deg, hsl(217, 32%, 8%), hsl(217, 32%, 10%)); padding: 28px 24px; border-radius: 12px; border: 1px solid hsl(217, 32%, 15%);">
                            <h3 style="color: hsl(217, 91%, 70%); margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">What&apos;s coming your way:</h3>
                            <div style="color: hsl(0, 0%, 88%); font-size: 15px; line-height: 1.8;">
                              <div style="margin: 12px 0; padding-left: 8px;">📧 <strong style="color: hsl(0, 0%, 95%);">Weekly DeFi insights</strong> directly to your inbox</div>
                              <div style="margin: 12px 0; padding-left: 8px;">🔍 <strong style="color: hsl(0, 0%, 95%);">Market analysis</strong> with a conscious perspective</div>
                              <div style="margin: 12px 0; padding-left: 8px;">🛡️ <strong style="color: hsl(0, 0%, 95%);">Security tips</strong> to protect your digital assets</div>
                              <div style="margin: 12px 0; padding-left: 8px;">🎓 <strong style="color: hsl(0, 0%, 95%);">Educational content</strong> for all experience levels</div>
                              <div style="margin: 12px 0; padding-left: 8px;">⚡ <strong style="color: hsl(0, 0%, 95%);">Early access</strong> to new courses and resources</div>
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- Spacer -->
                      <div style="height: 28px;"></div>

                      <!-- CTA Section -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="background: linear-gradient(135deg, hsl(271, 91%, 12%), hsl(271, 91%, 10%)); padding: 32px 24px; border-radius: 12px; border: 1px solid hsl(271, 91%, 25%); text-align: center;">
                            <h3 style="color: hsl(271, 91%, 75%); margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">Start exploring now:</h3>
                            <p style="color: hsl(0, 0%, 88%); line-height: 1.7; margin: 0 0 24px 0; font-size: 15px;">
                              While you wait for your first newsletter, dive into our free educational content:
                            </p>
                            <div>
                              <a href="https://the3rdeyeadvisors.com/philosophy" style="background: linear-gradient(45deg, hsl(217, 91%, 60%), hsl(271, 91%, 65%)); color: hsl(0, 0%, 98%); padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin: 8px; font-size: 15px; box-shadow: 0 4px 12px hsla(217, 91%, 60%, 0.3);">Our Philosophy</a>
                              <a href="https://the3rdeyeadvisors.com/courses" style="background: linear-gradient(45deg, hsl(271, 91%, 60%), hsl(217, 91%, 65%)); color: hsl(0, 0%, 98%); padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin: 8px; font-size: 15px; box-shadow: 0 4px 12px hsla(271, 91%, 60%, 0.3);">Free Courses</a>
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- Spacer -->
                      <div style="height: 32px;"></div>

                      <!-- Personal Note -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="text-align: center; padding: 24px; background: linear-gradient(135deg, hsl(217, 32%, 8%), hsl(217, 32%, 10%)); border-radius: 12px; border: 1px solid hsl(217, 32%, 15%);">
                            <p style="color: hsl(0, 0%, 85%); font-size: 14px; margin: 0 0 12px 0; line-height: 1.6;">
                              Have questions? Just reply to this email - we read every message personally.
                            </p>
                            <p style="color: hsl(217, 91%, 70%); font-size: 16px; margin: 0; font-weight: 500;">
                              Thank you for trusting us with your DeFi education, ${firstName}! 🌟
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Spacer -->
                      <div style="height: 24px;"></div>
                      
                      <!-- Footer -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="text-align: center; padding-top: 24px; border-top: 1px solid hsl(217, 32%, 15%);">
                            <p style="color: hsl(215, 20%, 65%); font-size: 12px; margin: 0 0 8px 0; line-height: 1.5;">
                              You&apos;re receiving this because you subscribed to 3rdeyeadvisors newsletter.
                            </p>
                            <p style="margin: 0;">
                              <a href="https://the3rdeyeadvisors.com" style="color: hsl(215, 20%, 65%); text-decoration: underline; font-size: 12px;">Visit Website</a>
                              <span style="color: hsl(215, 20%, 65%); margin: 0 8px;">|</span>
                              <a href="#" style="color: hsl(215, 20%, 65%); text-decoration: underline; font-size: 12px;">Unsubscribe</a>
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
          </div>
        </body>
        </html>
      `,
    });

    console.log("Subscriber thank you email sent successfully to:", email);

    // Log to email_logs table
    await supabase.from('email_logs').insert({
      email_type: 'thank_you',
      recipient_email: email,
      status: 'sent',
      edge_function_name: 'send-subscriber-thank-you',
      metadata: {
        resend_id: emailResponse.data?.id,
        name: name || 'Valued Reader'
      }
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Thank you email sent to ${email}`,
        emailId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-subscriber-thank-you function:", error);

    // Log failed email
    try {
      const payload: SubscriberThankYouPayload = await req.json();
      await supabase.from('email_logs').insert({
        email_type: 'thank_you',
        recipient_email: payload.record.email,
        status: 'failed',
        edge_function_name: 'send-subscriber-thank-you',
        error_message: error.message
      });
    } catch (logError) {
      console.error('Failed to log email error:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);