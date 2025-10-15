import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CustomEmailRequest {
  recipients: string[];
  subject: string;
  body: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipients, subject, body }: CustomEmailRequest = await req.json();

    console.log("Sending custom email to:", recipients.length, "recipients");

    if (!recipients || recipients.length === 0) {
      throw new Error("No recipients provided");
    }

    if (!subject || !body) {
      throw new Error("Subject and body are required");
    }

    // Initialize Supabase client for logging
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results = [];

    // Send emails to all recipients
    for (const recipient of recipients) {
      try {
        const emailResponse = await resend.emails.send({
          from: "3rdeyeadvisors <info@the3rdeyeadvisors.com>",
          to: [recipient],
          subject: subject,
          tags: [
            { name: 'category', value: 'custom' }
          ],
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              <style type="text/css">
                body { margin: 0; padding: 0; }
              </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #030717;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0; padding: 0; background-color: #030717;" bgcolor="#030717">
                <tr>
                  <td align="center" style="padding: 0; background-color: #030717;" bgcolor="#030717">
                    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
                      <tr>
                        <td style="padding: 32px 20px;">
                          
                          <!-- Cosmic Header -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, hsl(217, 32%, 8%), hsl(217, 32%, 6%)); border-radius: 12px; border: 1px solid hsl(217, 32%, 15%);">
                            <tr>
                              <td style="text-align: center; padding: 48px 24px;">
                                <h1 style="color: hsl(217, 91%, 60%); font-size: 36px; margin: 0 0 8px 0; font-weight: 700; text-shadow: 0 0 24px hsla(217, 91%, 60%, 0.4);">3rdeyeadvisors</h1>
                                <p style="color: hsl(271, 91%, 75%); font-size: 18px; margin: 0; font-weight: 500;">Conscious DeFi Education</p>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Spacer -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height: 32px; line-height: 32px;"></td></tr></table>
                          
                          <!-- Email Content -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td>
                                <h2 style="color: hsl(217, 91%, 70%); font-size: 24px; margin: 0 0 16px 0; font-weight: 600;">
                                  ${subject}
                                </h2>
                                ${body.split('\n\n').map(paragraph => 
                                  `<p style="color: #F5F5F5; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">${paragraph.replace(/\n/g, '<br>')}</p>`
                                ).join('')}
                              </td>
                            </tr>
                          </table>

                          <!-- Spacer -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height: 24px; line-height: 24px;"></td></tr></table>

                          <!-- CTA Button -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td align="center" style="padding: 8px;">
                                <a href="https://the3rdeyeadvisors.com" style="background: linear-gradient(45deg, hsl(217, 91%, 60%), hsl(271, 91%, 65%)); color: hsl(0, 0%, 98%); padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px hsla(217, 91%, 60%, 0.3);">Visit 3rdeyeadvisors</a>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Spacer -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height: 24px; line-height: 24px;"></td></tr></table>
                          
                          <!-- Footer -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid hsl(217, 32%, 15%);">
                            <tr>
                              <td style="text-align: center; padding-top: 24px;">
                                <p style="color: hsl(215, 20%, 65%); font-size: 12px; margin: 0 0 8px 0; line-height: 1.5;">
                                  You're receiving this because you're part of the 3rdeyeadvisors community.
                                </p>
                                <p style="margin: 0;">
                                  <a href="https://the3rdeyeadvisors.com" style="color: hsl(215, 20%, 65%); text-decoration: underline; font-size: 12px;">Visit Website</a>
                                  <span style="color: hsl(215, 20%, 65%); margin: 0 8px;">|</span>
                                  <a href="https://the3rdeyeadvisors.com/contact" style="color: hsl(215, 20%, 65%); text-decoration: underline; font-size: 12px;">Contact Us</a>
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

        console.log("Email sent to:", recipient, "Response:", emailResponse);

        // Log successful email
        await supabase.from('email_logs').insert({
          email_type: 'custom',
          recipient_email: recipient,
          status: 'sent',
          edge_function_name: 'send-custom-email',
          metadata: {
            subject: subject,
            resend_id: emailResponse.data?.id || null
          }
        });

        results.push({ email: recipient, status: 'sent', id: emailResponse.data?.id });
      } catch (error: any) {
        console.error("Failed to send to:", recipient, error);

        // Log failed email
        await supabase.from('email_logs').insert({
          email_type: 'custom',
          recipient_email: recipient,
          status: 'failed',
          error_message: error.message,
          edge_function_name: 'send-custom-email',
          metadata: {
            subject: subject
          }
        });

        results.push({ email: recipient, status: 'failed', error: error.message });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results: results,
        sent: results.filter(r => r.status === 'sent').length,
        failed: results.filter(r => r.status === 'failed').length
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-custom-email function:", error);
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
