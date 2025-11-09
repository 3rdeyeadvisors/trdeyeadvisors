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

    console.log("Sending username verification notification to admins...");

    // Send notification to admin
    const adminEmail = "admin@3rdeyeadvisors.com"; // Update with actual admin email

    const emailResponse = await resend.emails.send({
      from: "3rdeyeadvisors <noreply@the3rdeyeadvisors.com>",
      to: [adminEmail],
      subject: `🔍 New Social Media Username Submitted - ${raffle_title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B5CF6;">New Username Verification Request</h2>
          
          <p>A user has submitted their social media username for verification.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>User Email:</strong> ${email}</p>
            <p><strong>Raffle:</strong> ${raffle_title}</p>
            <p><strong>Task Type:</strong> ${task_type}</p>
            ${instagram_username ? `<p><strong>Instagram Username:</strong> @${instagram_username}</p>` : ''}
            ${x_username ? `<p><strong>X Username:</strong> @${x_username}</p>` : ''}
          </div>
          
          <p>Please verify these usernames in the Admin Raffle Manager dashboard.</p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            — The 3rdeyeadvisors System
          </p>
        </div>
      `,
    });

    console.log("Admin notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
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
