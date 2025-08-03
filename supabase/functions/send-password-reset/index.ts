import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  resetUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received password reset request");
    const { email, resetUrl }: PasswordResetRequest = await req.json();
    console.log(`Processing password reset for email: ${email?.substring(0, 5)}...`);

    // Get user's name from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('user_id', (await supabase.auth.admin.getUserByEmail(email)).data.user?.id)
      .single();

    const firstName = profile?.display_name?.split(' ')[0] || 'there';

    const emailResponse = await resend.emails.send({
      from: "3rdeyeadvisors <info@the3rdeyeadvisors.com>",
      to: [email],
      subject: "Reset Your Password - 3rdeyeadvisors",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #fff; background: hsl(222, 84%, 4.9%);">
          
          <!-- Header with Cosmic Background -->
          <div style="text-align: center; padding: 50px 30px 30px; background: linear-gradient(135deg, hsl(222, 84%, 4.9%), hsl(217, 32%, 8%)); border-radius: 12px 12px 0 0; position: relative;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 50% 50%, hsl(217, 91%, 60%, 0.1), transparent 70%); border-radius: 12px 12px 0 0;"></div>
            <h1 style="color: hsl(217, 91%, 60%); font-size: 36px; margin: 0; font-weight: bold; text-shadow: 0 0 20px hsl(217, 91%, 60%, 0.3); position: relative; z-index: 1;">3rdeyeadvisors</h1>
            <p style="color: hsl(0, 0%, 95%); font-size: 18px; margin: 12px 0 0 0; opacity: 0.9; position: relative; z-index: 1;">Secure Password Reset</p>
          </div>

          <!-- Main Content with Cosmic Theme -->
          <div style="background: linear-gradient(180deg, hsl(217, 32%, 8%), hsl(217, 32%, 6%)); padding: 40px 30px; border-radius: 0 0 12px 12px; border: 1px solid hsl(217, 32%, 15%);">
            
            <!-- Greeting -->
            <h2 style="color: hsl(217, 91%, 70%); font-size: 24px; margin: 0 0 24px 0; font-weight: 600;">Hello ${firstName}!</h2>
            
            <p style="color: hsl(0, 0%, 90%); font-size: 16px; margin: 0 0 28px 0; line-height: 1.6;">
              We received a request to reset the password for your 3rdeyeadvisors account. Click the button below to create a new secure password and continue your DeFi journey.
            </p>

            <!-- Reset Button with Cosmic Glow -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: linear-gradient(45deg, hsl(217, 91%, 60%), hsl(271, 91%, 65%)); color: hsl(222, 84%, 4.9%); padding: 18px 36px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 0 30px hsl(217, 91%, 60%, 0.4), 0 8px 20px rgba(0,0,0,0.3); transition: all 0.3s ease; font-family: 'Inter', sans-serif;">
                🔐 Reset My Password
              </a>
            </div>

            <!-- Security Notice with Cosmic Styling -->
            <div style="background: linear-gradient(135deg, hsl(217, 32%, 10%), hsl(217, 32%, 12%)); border-left: 4px solid hsl(217, 91%, 60%); padding: 24px; margin: 32px 0; border-radius: 0 12px 12px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
              <p style="color: hsl(0, 0%, 90%); margin: 0; font-size: 14px; line-height: 1.5;">
                <strong style="color: hsl(217, 91%, 70%);">🛡️ Security Notice:</strong> This link will expire in 24 hours for your protection. If you didn't request this password reset, you can safely ignore this email.
              </p>
            </div>

            <!-- Alternative Link -->
            <p style="color: hsl(215, 20%, 65%); font-size: 14px; margin: 32px 0 16px 0; line-height: 1.5;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <div style="background: hsl(217, 32%, 10%); padding: 16px; border-radius: 8px; word-break: break-all; font-size: 13px; color: hsl(217, 91%, 70%); margin: 0 0 32px 0; border: 1px solid hsl(217, 32%, 15%); font-family: 'JetBrains Mono', monospace;">
              ${resetUrl}
            </div>

          </div>

          <!-- Footer with Cosmic Branding -->
          <div style="text-align: center; padding: 32px 24px; background: linear-gradient(135deg, hsl(217, 32%, 6%), hsl(222, 84%, 4.9%)); margin-top: 24px; border-radius: 12px; border: 1px solid hsl(217, 32%, 15%);">
            <p style="color: hsl(215, 20%, 65%); font-size: 14px; margin: 0 0 12px 0; line-height: 1.5;">
              Need help? Contact our support team at 
              <a href="mailto:info@the3rdeyeadvisors.com" style="color: hsl(217, 91%, 70%); text-decoration: none; font-weight: 500;">info@the3rdeyeadvisors.com</a>
            </p>
            <p style="color: hsl(215, 20%, 50%); font-size: 12px; margin: 0;">
              © 2024 3rdeyeadvisors. Empowering DeFi consciousness.
            </p>
          </div>

          <!-- Mobile Responsive -->
          <style>
            @media only screen and (max-width: 600px) {
              .container { padding: 16px !important; }
              .content { padding: 24px !important; }
              .button { padding: 16px 28px !important; font-size: 15px !important; }
              h1 { font-size: 28px !important; }
              h2 { font-size: 20px !important; }
            }
          </style>
        </div>
      `,
    });

    console.log("Password reset email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Password reset email sent successfully",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending password reset email:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send password reset email",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);