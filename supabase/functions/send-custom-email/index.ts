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
            </head>
            <body style="margin: 0; padding: 0; background-color: #f5f5f5;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff;">
                      <!-- Header -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 48px 24px; text-align: center; border-radius: 12px 12px 0 0;">
                          <h1 style="color: #60A5FA; font-size: 36px; margin: 0 0 8px 0; font-weight: 700; text-shadow: 0 0 24px rgba(96, 165, 250, 0.4); font-family: Arial, sans-serif;">3rdeyeadvisors</h1>
                          <p style="color: #C084FC; font-size: 18px; margin: 0; font-weight: 500; font-family: Arial, sans-serif;">Conscious DeFi Education</p>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px 30px;">
                          <h2 style="color: #60A5FA; font-size: 24px; margin: 0 0 16px 0; font-weight: 600; font-family: Arial, sans-serif;">
                            ${subject}
                          </h2>
                          ${body.split('\n\n').map(paragraph => 
                            `<p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; font-family: Arial, sans-serif;">${paragraph.replace(/\n/g, '<br>')}</p>`
                          ).join('')}
                        </td>
                      </tr>

                      <!-- CTA Button -->
                      <tr>
                        <td align="center" style="padding: 0 30px 40px 30px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="border-radius: 8px; background: linear-gradient(45deg, #60A5FA, #C084FC);">
                                <a href="https://the3rdeyeadvisors.com" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: bold; font-family: Arial, sans-serif; font-size: 16px;">Visit 3rdeyeadvisors</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="padding: 24px 30px; border-top: 1px solid #e5e5e5;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td align="center">
                                <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px 0; line-height: 1.5; font-family: Arial, sans-serif;">
                                  You're receiving this because you're part of the 3rdeyeadvisors community.
                                </p>
                                <p style="margin: 0; font-family: Arial, sans-serif;">
                                  <a href="https://the3rdeyeadvisors.com" style="color: #94a3b8; text-decoration: underline; font-size: 12px;">Visit Website</a>
                                  <span style="color: #94a3b8; margin: 0 8px;">|</span>
                                  <a href="https://the3rdeyeadvisors.com/contact" style="color: #94a3b8; text-decoration: underline; font-size: 12px;">Contact Us</a>
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
