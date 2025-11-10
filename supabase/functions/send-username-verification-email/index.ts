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
