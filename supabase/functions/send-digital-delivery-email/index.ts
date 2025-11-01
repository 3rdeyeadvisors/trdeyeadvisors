import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'npm:resend@4.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DigitalItem {
  product_id: number;
  product_name: string;
  download_token: string;
}

interface EmailPayload {
  order_id: string;
  customer_email: string;
  customer_name: string;
  digital_items: DigitalItem[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { order_id, customer_email, customer_name, digital_items }: EmailPayload = await req.json();

    console.log(`Sending digital delivery email for order ${order_id} to ${customer_email}`);

    const downloadPortalUrl = `https://www.the3rdeyeadvisors.com/download-portal?order=${order_id}`;

    // Build download links HTML
    const downloadLinksHtml = digital_items.map(item => {
      const downloadUrl = `https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/download-digital-file?token=${item.download_token}`;
      return `
        <div style="margin: 20px 0; padding: 20px; background: rgba(30, 58, 138, 0.3); border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.3);">
          <h3 style="color: #60a5fa; margin: 0 0 10px 0; font-size: 18px;">${item.product_name}</h3>
          <a href="${downloadUrl}" 
             style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 10px;">
            Download Now
          </a>
        </div>
      `;
    }).join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%); border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
              
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #60a5fa; margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">
                  Your Digital Downloads Are Ready! 🎉
                </h1>
                <p style="color: #cbd5e1; margin: 0; font-size: 16px;">
                  Order #${order_id}
                </p>
              </div>

              <!-- Greeting -->
              <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hi ${customer_name},
              </p>
              
              <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Thank you for your purchase! Your digital products are ready to download. Click the buttons below to access your files:
              </p>

              <!-- Download Links -->
              ${downloadLinksHtml}

              <!-- Portal Link -->
              <div style="margin: 30px 0; padding: 20px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; border-left: 4px solid #3b82f6;">
                <p style="color: #cbd5e1; margin: 0 0 10px 0; font-size: 14px;">
                  <strong style="color: #60a5fa;">Need to re-download later?</strong>
                </p>
                <p style="color: #cbd5e1; margin: 0 0 15px 0; font-size: 14px;">
                  Access your downloads anytime at:
                </p>
                <a href="${downloadPortalUrl}" 
                   style="display: inline-block; color: #60a5fa; text-decoration: none; font-weight: 600;">
                  ${downloadPortalUrl}
                </a>
              </div>

              <!-- Important Info -->
              <div style="margin: 30px 0; padding: 20px; background: rgba(234, 179, 8, 0.1); border-radius: 8px; border-left: 4px solid #eab308;">
                <p style="color: #fbbf24; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">
                  ⚡ Important Information
                </p>
                <ul style="color: #e2e8f0; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                  <li>Download links are valid for <strong>7 days</strong></li>
                  <li>You can download each file up to <strong>5 times</strong></li>
                  <li>If you don't see this email, check your spam folder</li>
                  <li>Need help? Contact us at <a href="mailto:support@the3rdeyeadvisors.com" style="color: #60a5fa;">support@the3rdeyeadvisors.com</a></li>
                </ul>
              </div>

              <!-- Footer -->
              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(148, 163, 184, 0.2); text-align: center;">
                <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 14px;">
                  Thank you for choosing 3rd Eye Advisors
                </p>
                <p style="color: #64748b; margin: 0; font-size: 12px;">
                  © ${new Date().getFullYear()} 3rd Eye Advisors. All rights reserved.
                </p>
              </div>

            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: '3rd Eye Advisors <orders@the3rdeyeadvisors.com>',
      to: [customer_email],
      subject: `Your Digital Products Are Ready - Order ${order_id}`,
      html,
    });

    console.log('Digital delivery email sent:', emailResponse);

    // Log the email
    await supabase.from('email_logs').insert({
      email_type: 'digital_delivery',
      recipient_email: customer_email,
      status: 'sent',
      edge_function_name: 'send-digital-delivery-email',
      metadata: { order_id, digital_items_count: digital_items.length }
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error sending digital delivery email:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
