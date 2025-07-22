import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    const { email, resetUrl }: PasswordResetRequest = await req.json();

    console.log(`Sending password reset email to: ${email}`);

    const emailResponse = await resend.emails.send({
      from: "3rdeyeadvisors <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your Password - 3rdeyeadvisors",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333;">
          
          <!-- Header -->
          <div style="text-align: center; padding: 40px 20px 20px; background: linear-gradient(135deg, #0a0a0a, #1a1a1a); border-radius: 12px 12px 0 0;">
            <h1 style="color: #00d4ff; font-size: 32px; margin: 0; font-weight: bold;">3rdeyeadvisors</h1>
            <p style="color: #ccc; font-size: 16px; margin: 8px 0 0 0;">Password Reset Request</p>
          </div>

          <!-- Main Content -->
          <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            
            <!-- Greeting -->
            <h2 style="color: #333; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">Password Reset Request</h2>
            
            <p style="color: #555; font-size: 16px; margin: 0 0 24px 0; line-height: 1.6;">
              We received a request to reset the password for your 3rdeyeadvisors account. If you made this request, click the button below to reset your password.
            </p>

            <!-- Reset Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: #00d4ff; color: #000; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 2px 8px rgba(0, 212, 255, 0.3); transition: all 0.3s ease;">
                Reset Password
              </a>
            </div>

            <!-- Security Notice -->
            <div style="background: #f8f9fa; border-left: 4px solid #00d4ff; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
              <p style="color: #555; margin: 0; font-size: 14px;">
                <strong>🔒 Security Notice:</strong> This link will expire in 24 hours for your security. If you didn't request this password reset, you can safely ignore this email.
              </p>
            </div>

            <!-- Alternative Link -->
            <p style="color: #777; font-size: 14px; margin: 30px 0; line-height: 1.5;">
              If the button above doesn't work, you can copy and paste this link into your browser:
            </p>
            <p style="background: #f5f5f5; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 13px; color: #555; margin: 0 0 30px 0;">
              ${resetUrl}
            </p>

          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 30px 20px; background: #f8f9fa; margin-top: 20px; border-radius: 8px;">
            <p style="color: #777; font-size: 14px; margin: 0 0 8px 0;">
              Need help? Contact our support team at 
              <a href="mailto:info@3rdeyeadvisors.com" style="color: #00d4ff; text-decoration: none;">info@3rdeyeadvisors.com</a>
            </p>
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 3rdeyeadvisors. All rights reserved.
            </p>
          </div>

          <!-- Mobile Responsive -->
          <style>
            @media only screen and (max-width: 600px) {
              .container { padding: 10px !important; }
              .content { padding: 20px !important; }
              .button { padding: 14px 24px !important; font-size: 14px !important; }
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